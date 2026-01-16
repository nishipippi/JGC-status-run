import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, Airport } from '../types';
import { Settings, Play, RefreshCw, Plane, Check, RotateCcw, Clock, Navigation } from 'lucide-react';
import { calculateDistance, calculateFlightDuration } from '../utils';

interface ControlsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onSpinStart: () => void;
  onSpinComplete: () => void;
  isSpinning: boolean;
  targetAirport: Airport | null;
  pendingAirport: Airport | null;
  onConfirm: () => void;
  onRetry: () => void;
  validDestinations: Airport[];
  currentAirport: Airport;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  settings,
  setSettings,
  onSpinStart,
  onSpinComplete,
  isSpinning,
  targetAirport,
  pendingAirport,
  onConfirm,
  onRetry,
  validDestinations,
  currentAirport,
  onReset
}) => {
  const [displayText, setDisplayText] = useState<{name: string, iata: string} | null>(null);
  const [highlight, setHighlight] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Animation Logic
  useEffect(() => {
    if (isSpinning && targetAirport && validDestinations.length > 0) {
      setHighlight(false);
      let step = 0;
      let delay = 50; 
      
      const minSteps = 18; 
      const slowDownThreshold = 6; 
      
      const animate = () => {
        step++;
        
        const randomIndex = Math.floor(Math.random() * validDestinations.length);
        const randomAirport = validDestinations[randomIndex];
        setDisplayText({ name: randomAirport.name, iata: randomAirport.iata });

        if (step > minSteps - slowDownThreshold) {
            const factor = (step - (minSteps - slowDownThreshold)); 
            delay += (factor * factor * 5); 
        }

        if (step < minSteps) {
           timeoutRef.current = window.setTimeout(animate, delay);
        } else {
           setDisplayText({ name: targetAirport.name, iata: targetAirport.iata });
           setHighlight(true);
           
           setTimeout(() => {
               onSpinComplete();
           }, 1000);
        }
      };

      animate();
    } else if (pendingAirport) {
        // If we are in pending state, persist the pending airport display
        setDisplayText({ name: pendingAirport.name, iata: pendingAirport.iata });
        setHighlight(true);
    } else if (!isSpinning) {
      // Idle state
      setHighlight(false);
      setDisplayText(null);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isSpinning, targetAirport, pendingAirport, validDestinations, onSpinComplete]);

  // Calculate potential flight stats for display
  const pendingStats = pendingAirport ? {
     dist: calculateDistance(currentAirport.lat, currentAirport.lng, pendingAirport.lat, pendingAirport.lng),
     time: calculateFlightDuration(calculateDistance(currentAirport.lat, currentAirport.lng, pendingAirport.lat, pendingAirport.lng))
  } : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="border-b border-slate-100 pb-4">
         <div className="flex items-center gap-2 text-red-600 mb-1">
            <Plane className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wider text-xs">現在地</span>
         </div>
         <h2 className="text-3xl font-extrabold text-slate-800">{currentAirport.name} <span className="text-slate-400 font-normal">({currentAirport.iata})</span></h2>
         <p className="text-slate-500 text-sm mt-1">
            JALグループ就航先: {validDestinations.length} 箇所
         </p>
      </div>

      {/* Roulette Display Area */}
      <div className={`relative rounded-xl p-6 text-center shadow-inner overflow-hidden transition-all duration-300 flex flex-col items-center justify-center ${highlight ? 'bg-gradient-to-br from-indigo-900 to-slate-900 ring-4 ring-yellow-400 scale-105 shadow-2xl z-10' : 'bg-slate-900'}`}>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">次の目的地</div>
          
          <div className="h-20 flex flex-col items-center justify-center">
            {(isSpinning || pendingAirport) && displayText ? (
                 <div className={`transition-all duration-100 ${highlight ? 'scale-125' : ''}`}>
                    <div className={`text-2xl md:text-3xl font-black leading-tight ${highlight ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] animate-bounce' : 'text-white'}`}>
                        {displayText.name}
                    </div>
                    <div className={`text-sm font-mono tracking-widest mt-1 ${highlight ? 'text-yellow-100' : 'text-slate-500'}`}>
                        {displayText.iata}
                    </div>
                 </div>
            ) : (
                 <div className="text-3xl font-black italic text-slate-700 tracking-wider animate-pulse">
                    {validDestinations.length > 0 ? "READY?" : "FINISH"}
                 </div>
            )}
          </div>
          
          {/* Pending Stats Badge */}
          {pendingAirport && pendingStats && highlight && (
            <div className="mt-4 flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white/10 backdrop-blur rounded px-2 py-1 flex items-center gap-1 text-xs text-white">
                    <Navigation className="w-3 h-3" />
                    {pendingStats.dist} miles
                </div>
                <div className="bg-white/10 backdrop-blur rounded px-2 py-1 flex items-center gap-1 text-xs text-white">
                    <Clock className="w-3 h-3" />
                    {pendingStats.time}
                </div>
            </div>
          )}

          <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 ${isSpinning ? 'animate-pulse' : ''}`}></div>
          <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 ${isSpinning ? 'animate-pulse' : ''}`}></div>
          
          {highlight && (
             <div className="absolute inset-0 bg-white/20 animate-ping rounded-xl pointer-events-none"></div>
          )}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Settings className="w-4 h-4" />
          <h3>ルーレット設定</h3>
        </div>

        {/* Retry Mode Toggle */}
        <div className="flex items-center justify-between py-2 border-b border-slate-50">
           <div>
               <label className="text-sm font-medium text-slate-800 block">引き直しモード</label>
               <p className="text-xs text-slate-400">結果を見てから「決定」できます</p>
           </div>
           <button 
             onClick={() => setSettings(s => ({...s, retryMode: !s.retryMode}))}
             disabled={isSpinning || pendingAirport !== null}
             className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${settings.retryMode ? 'bg-indigo-600' : 'bg-slate-300'} ${isSpinning || pendingAirport ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
           >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${settings.retryMode ? 'translate-x-6' : 'translate-x-0'}`} />
           </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label>主要空港の出現率</label>
            <span className="font-mono bg-slate-100 px-2 rounded text-slate-600">{(settings.bigAirportRatio * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.bigAirportRatio}
            onChange={(e) => setSettings({ ...settings, bigAirportRatio: parseFloat(e.target.value) })}
            disabled={isSpinning || pendingAirport !== null}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label>近距離除外半径</label>
            <span className="font-mono bg-slate-100 px-2 rounded text-slate-600">{settings.excludeRadiusKm} km</span>
          </div>
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            value={settings.excludeRadiusKm}
            onChange={(e) => setSettings({ ...settings, excludeRadiusKm: parseInt(e.target.value) })}
            disabled={isSpinning || pendingAirport !== null}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-3">
        {pendingAirport ? (
           <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2">
               <button
                 onClick={onRetry}
                 className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl border-2 border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
               >
                   <RotateCcw className="w-5 h-5" />
                   <span>やり直し</span>
               </button>
               <button
                 onClick={onConfirm}
                 className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all active:scale-95"
               >
                   <Check className="w-5 h-5" />
                   <span>ここに決定</span>
               </button>
           </div>
        ) : (
            <button
            onClick={onSpinStart}
            disabled={isSpinning || validDestinations.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95 duration-200
                ${
                isSpinning
                    ? 'bg-slate-800 text-yellow-400 border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)] cursor-not-allowed scale-[0.99]'
                    : validDestinations.length === 0
                    ? 'bg-orange-100 text-orange-600 border border-orange-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 hover:shadow-xl hover:-translate-y-0.5'
                }`}
            >
            {isSpinning ? (
                <>
                <RefreshCw className="w-5 h-5 animate-spin" /> 抽選中...
                </>
            ) : validDestinations.length === 0 ? (
                "行き止まり / 移動不可"
            ) : (
                <>
                <Play className="w-5 h-5 fill-current" /> ルーレットを回す
                </>
            )}
            </button>
        )}
        
        {validDestinations.length === 0 && (
            <div className="text-xs text-center text-orange-600 bg-orange-50 p-2 rounded">
                条件に合う行き先がありません。除外半径を小さくするか、リセットしてください。
            </div>
        )}
        
        <button onClick={onReset} className="w-full py-2 text-slate-400 text-sm hover:text-slate-600 transition-colors">
            旅程をリセット
        </button>
      </div>
    </div>
  );
};

export default Controls;