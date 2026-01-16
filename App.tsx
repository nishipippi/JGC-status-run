import React, { useState, useMemo } from 'react';
import { AIRPORTS } from './constants';
import { Airport, AppSettings, TravelHistoryItem } from './types';
import Map from './components/Map';
import Controls from './components/Controls';
import History from './components/History';
import { calculateDistance, calculateFlightDuration, milesToKm } from './utils';

const STARTING_AIRPORT = 'HND';

const App: React.FC = () => {
  const [currentAirport, setCurrentAirport] = useState<Airport>(AIRPORTS[STARTING_AIRPORT]);
  const [history, setHistory] = useState<TravelHistoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    bigAirportRatio: 0.6,
    excludeRadiusKm: 50,
    retryMode: false,
  });
  
  // State for managing the spin lifecycle
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetAirport, setTargetAirport] = useState<Airport | null>(null);
  
  // State for Retry Mode
  const [pendingAirport, setPendingAirport] = useState<Airport | null>(null);
  
  // Calculate valid destinations based on current airport and settings
  const validDestinations = useMemo(() => {
    const rawConnections = currentAirport.connections;
    
    return rawConnections
      .map(iata => AIRPORTS[iata])
      .filter(airport => {
        if (!airport) return false;
        
        // Radius check
        const distanceMiles = calculateDistance(currentAirport.lat, currentAirport.lng, airport.lat, airport.lng);
        const distanceKm = milesToKm(distanceMiles);
        
        if (distanceKm < settings.excludeRadiusKm) return false;
        
        return true;
      });
  }, [currentAirport, settings.excludeRadiusKm]);

  // Step 1: Start the spin and decide the result immediately (but don't show it yet)
  const handleSpinStart = () => {
    if (validDestinations.length === 0) return;
    
    // Clear any previous pending state if forcing a new spin
    setPendingAirport(null);

    // Roulette Logic: Decide the destination
    let candidates = validDestinations;
    const bigCandidates = candidates.filter(ap => ap.size === 'BIG');
    const smallCandidates = candidates.filter(ap => ap.size === 'SMALL');

    let selected: Airport;

    if (bigCandidates.length === 0) {
       selected = smallCandidates[Math.floor(Math.random() * smallCandidates.length)];
    } else if (smallCandidates.length === 0) {
       selected = bigCandidates[Math.floor(Math.random() * bigCandidates.length)];
    } else {
       const roll = Math.random();
       if (roll < settings.bigAirportRatio) {
          selected = bigCandidates[Math.floor(Math.random() * bigCandidates.length)];
       } else {
          selected = smallCandidates[Math.floor(Math.random() * smallCandidates.length)];
       }
    }

    setTargetAirport(selected);
    setIsSpinning(true);
  };

  // Helper to commit the move
  const commitMove = (destination: Airport) => {
    const dist = calculateDistance(currentAirport.lat, currentAirport.lng, destination.lat, destination.lng);
    const earned = Math.round(dist * 1.0); // 100% accumulation rate
    const duration = calculateFlightDuration(dist);
    
    setHistory(prev => [
      ...prev,
      {
        from: currentAirport.iata,
        to: destination.iata,
        distance: dist,
        earnedMiles: earned,
        flightTime: duration,
        flightNumber: prev.length + 1
      }
    ]);
    
    setCurrentAirport(destination);
  };

  // Step 2: Called by Controls component when the visual animation finishes
  const handleSpinComplete = () => {
    if (!targetAirport) return;

    if (settings.retryMode) {
        // In retry mode, we don't commit yet. We wait for user confirmation.
        setPendingAirport(targetAirport);
        // We clear targetAirport so Controls knows animation is done, 
        // but Controls will see pendingAirport and show the result.
    } else {
        // Standard mode: Commit immediately
        commitMove(targetAirport);
    }
    
    setTargetAirport(null); // Reset target
    setIsSpinning(false);
  };

  // Step 3 (Retry Mode Only): User accepts the result
  const handleConfirmPending = () => {
      if (pendingAirport) {
          commitMove(pendingAirport);
          setPendingAirport(null);
      }
  };

  // Step 3 (Retry Mode Only): User rejects/retries
  const handleRetryPending = () => {
      setPendingAirport(null);
      // User can click spin again
  };

  const handleReset = () => {
      setCurrentAirport(AIRPORTS[STARTING_AIRPORT]);
      setHistory([]);
      setTargetAirport(null);
      setIsSpinning(false);
      setPendingAirport(null);
      setSettings({
        bigAirportRatio: 0.6,
        excludeRadiusKm: 50,
        retryMode: false,
      });
  };

  const totalMiles = history.reduce((acc, curr) => acc + curr.distance, 0);
  const destIatas = validDestinations.map(d => d.iata);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Navbar */}
      <header className="bg-red-700 text-white p-4 shadow-md z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-700 font-bold text-xl">J</span>
               </div>
               <h1 className="text-xl font-bold tracking-tight">スカイメイト ルーレット <span className="font-light text-red-200 text-sm opacity-80 ml-2">ネットワーク シミュレーター</span></h1>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Controls (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
             <Controls 
                settings={settings}
                setSettings={setSettings}
                onSpinStart={handleSpinStart}
                onSpinComplete={handleSpinComplete}
                isSpinning={isSpinning}
                targetAirport={targetAirport}
                pendingAirport={pendingAirport}
                onConfirm={handleConfirmPending}
                onRetry={handleRetryPending}
                validDestinations={validDestinations}
                currentAirport={currentAirport}
                onReset={handleReset}
             />
             <div className="hidden lg:block flex-1">
                <History history={history} totalMiles={totalMiles} />
             </div>
        </div>

        {/* Center/Right Col: Map (9 cols) */}
        <div className="lg:col-span-9 h-[50vh] lg:h-auto min-h-[500px] order-1 lg:order-2 rounded-2xl shadow-xl overflow-hidden relative">
            <Map 
                currentAirport={currentAirport} 
                history={history} 
                validDestinations={destIatas} 
                excludeRadiusKm={settings.excludeRadiusKm}
            />
            
            {/* Overlay Statistics for Mobile */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg border border-slate-200 z-[1000] lg:hidden">
                <span className="text-xs text-slate-500 uppercase font-bold block">総移動距離</span>
                <span className="text-xl font-black text-indigo-600">{totalMiles.toLocaleString()} マイル</span>
            </div>
        </div>
        
        {/* Mobile History (Bottom) */}
        <div className="lg:hidden col-span-1 order-3">
             <History history={history} totalMiles={totalMiles} />
        </div>

      </main>
    </div>
  );
};

export default App;