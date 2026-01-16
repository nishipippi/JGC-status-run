import React from 'react';
import { TravelHistoryItem } from '../types';
import { AIRPORTS } from '../constants';
import { ArrowRight, Plane, MapPin, Award, Clock } from 'lucide-react';

interface HistoryProps {
  history: TravelHistoryItem[];
  totalMiles: number;
}

const History: React.FC<HistoryProps> = ({ history, totalMiles }) => {
  const totalEarned = history.reduce((acc, curr) => acc + (curr.earnedMiles || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-end mb-4 border-b border-slate-100 pb-4">
        <div>
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> フライト履歴
            </h3>
            <p className="text-xs text-slate-400 mt-1">スカイメイトの旅</p>
        </div>
        <div className="text-right">
             <span className="block text-xs text-slate-500 uppercase tracking-wide">獲得マイル総計</span>
             <span className="text-2xl font-black text-red-600">{totalEarned.toLocaleString()} <span className="text-sm font-medium text-slate-400">マイル</span></span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
            <Plane className="w-8 h-8 mb-2 opacity-20" />
            <p>まだフライトがありません。</p>
            <p>羽田空港から旅を始めましょう！</p>
          </div>
        ) : (
          [...history].reverse().map((item, idx) => { // Show newest first
             const fromAp = AIRPORTS[item.from];
             const toAp = AIRPORTS[item.to];
             const flightNum = history.length - idx;
             
             return (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between text-sm group hover:border-red-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400 w-6">#{flightNum}</span>
                        <div>
                            <div className="flex items-center gap-2 font-bold text-slate-700">
                                <span>{item.from}</span>
                                <ArrowRight className="w-3 h-3 text-slate-300" />
                                <span>{item.to}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                {fromAp?.name} <span className="mx-1">→</span> {toAp?.name}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-600">
                                {item.distance} マイル
                            </span>
                            {item.flightTime && (
                                <span className="flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-100 px-1 rounded">
                                    <Clock className="w-3 h-3" />
                                    {item.flightTime}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                            <Award className="w-3 h-3" />
                            +{item.earnedMiles}
                        </div>
                    </div>
                </div>
             )
          })
        )}
      </div>
    </div>
  );
};

export default History;