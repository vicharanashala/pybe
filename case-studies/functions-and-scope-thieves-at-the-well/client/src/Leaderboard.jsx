import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, X } from 'lucide-react';

export default function Leaderboard({ onClose }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Listen for custom event from EvaluationPanel to refresh automatically
    const handleXpUpdate = () => fetchLeaderboard();
    window.addEventListener('xp-rewarded', handleXpUpdate);
    
    return () => window.removeEventListener('xp-rewarded', handleXpUpdate);
  }, []);

  const renderRankIcon = (index) => {
    if (index === 0) return <Trophy className="text-amber-500" size={24} />;
    if (index === 1) return <Medal className="text-slate-400" size={24} />;
    if (index === 2) return <Medal className="text-amber-700" size={24} />;
    return <span className="text-slate-400 font-bold text-sm w-6 text-center">#{index + 1}</span>;
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl border border-amber-200 overflow-hidden flex flex-col shadow-2xl relative">
      <div className="bg-amber-500/10 p-5 border-b border-amber-200 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
            <Award className="text-white" size={18} />
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Top Pilots</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-amber-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors shadow-sm">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 min-h-[300px] max-h-[500px]">
        {isLoading ? (
          <div className="text-center text-amber-600 font-bold py-8 animate-pulse">Loading Leaderboard...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-slate-400 py-8 font-medium">No pilots on the board yet.</div>
        ) : (
          users.map((user, index) => (
            <div 
              key={user._id} 
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border ${
                index < 3 ? 'bg-amber-50/80 border-amber-200 shadow-sm' : 'bg-slate-50/50 border-slate-100 hover:bg-amber-50/30'
              } transition-all`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-7">
                {renderRankIcon(index)}
              </div>
              
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-700 font-extrabold text-sm">
                  {user.learnerName?.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 font-bold text-sm truncate">{user.learnerName}</div>
                <div className="text-xs text-amber-700 font-semibold truncate">Level {user.level || 1} • {user.badge}</div>
              </div>
              
              <div className="text-right">
                <div className="text-[#C85A32] font-black text-base">{user.total_xp || user.xp || 0}</div>
                <div className="text-[9px] text-amber-800/60 font-bold uppercase tracking-widest">XP</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
