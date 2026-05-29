import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, Coins, RefreshCw, Play, TrendingUp, TrendingDown, ArrowRight, User, PlusCircle, History } from 'lucide-react';

const USERS_API = import.meta.env.VITE_API_URL || '/api/users';
const GAME_API = '/api';

export default function GameDashboard({ showToast, activePlayer, setActivePlayer }) {
  // Player session states
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // Deposit/Betting states
  const [depositAmount, setDepositAmount] = useState('');
  const [betAmount, setBetAmount] = useState('500');
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  const [betHistory, setBetHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch registered players
  const fetchPlayers = async () => {
    setLoadingPlayers(true);
    try {
      const response = await axios.get(USERS_API);
      if (response.data.success) {
        setPlayers(response.data.users || []);
        // If there is an active player, update their stats from the refreshed list
        if (activePlayer) {
          const updated = response.data.users.find(p => p._id === activePlayer._id);
          if (updated) {
            setActivePlayer(updated);
          }
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch players list', 'error');
    } finally {
      setLoadingPlayers(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Fetch active player's bet history
  const fetchBetHistory = async (playerId) => {
    if (!playerId) return;
    setLoadingHistory(true);
    try {
      const response = await axios.get(`${GAME_API}/users/${playerId}/bets`);
      if (response.data.success) {
        setBetHistory(response.data.bets || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activePlayer) {
      fetchBetHistory(activePlayer._id);
    }
  }, [activePlayer?._id]);

  // Handle deposit
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!activePlayer) return;
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      showToast('Please enter a valid deposit amount', 'error');
      return;
    }

    try {
      const response = await axios.post(`${GAME_API}/users/${activePlayer._id}/deposit`, { amount });
      if (response.data.success) {
        showToast(response.data.message, 'success');
        setActivePlayer(response.data.user);
        setDepositAmount('');
        // Refresh local player records
        fetchPlayers();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Deposit failed', 'error');
    }
  };

  // Handle Bet placement
  const handlePlaceBet = async () => {
    if (!activePlayer) return;
    const amount = Number(betAmount);
    if (!amount || amount <= 0) {
      showToast('Please enter a valid bet amount', 'error');
      return;
    }
    if (activePlayer.balance < amount) {
      showToast('Insufficient balance! Deposit some cash.', 'error');
      return;
    }

    setIsRolling(true);
    setRollResult(null);

    // Suspenseful rolling phase
    setTimeout(async () => {
      try {
        const response = await axios.post(`${GAME_API}/users/${activePlayer._id}/bet`, { amount });
        if (response.data.success) {
          setRollResult({
            outcome: response.data.outcome,
            roll: response.data.roll,
            payout: response.data.payout,
            winPercentage: response.data.winPercentage,
          });

          // Update active player details
          setActivePlayer(prev => ({
            ...prev,
            balance: response.data.newBalance,
            totalWagered: prev.totalWagered + amount,
            totalWon: response.data.outcome === 'win' ? prev.totalWon + response.data.payout : prev.totalWon,
          }));

          if (response.data.outcome === 'win') {
            showToast(`WINNER! You won ₹${response.data.payout}!`, 'success');
          } else {
            showToast('LOSE! Better luck next time.', 'error');
          }

          // Refresh bet history and overall player list
          fetchBetHistory(activePlayer._id);
          fetchPlayers();
        }
      } catch (err) {
        console.error(err);
        showToast(err.response?.data?.message || 'Failed to place bet', 'error');
      } finally {
        setIsRolling(false);
      }
    }, 1500); // 1.5 second animation delay
  };

  // Preset bet helpers
  const setPresetBet = (percent) => {
    if (!activePlayer) return;
    const newBet = Math.floor(activePlayer.balance * percent);
    setBetAmount(Math.max(1, newBet).toString());
  };

  // Render Player Selector if no player active
  if (!activePlayer) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-white">Quantum Casino Portal</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Select a player profile below or create one in the Registration tab to begin playing.
          </p>
        </div>

        {loadingPlayers ? (
          <div className="glass-panel p-16 flex flex-col items-center justify-center gap-4 rounded-3xl">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-slate-400 text-sm">Loading player directories...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl space-y-4">
            <User className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Players Registered</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Please register a user profile using the "Register" tab first to start placing bets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player) => (
              <div key={player._id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-white">{player.fullName}</h4>
                      <p className="text-xs text-slate-400 font-mono">{player.email}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ₹{player.balance.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/40 p-3 rounded-xl border border-white/5 text-center text-[10px] text-slate-400 uppercase tracking-wider">
                    <div>
                      <span>Deposited</span>
                      <p className="font-mono font-bold text-slate-200 mt-0.5">₹{player.totalDeposited || 0}</p>
                    </div>
                    <div>
                      <span>Wagered</span>
                      <p className="font-mono font-bold text-slate-200 mt-0.5">₹{player.totalWagered || 0}</p>
                    </div>
                    <div>
                      <span>Won</span>
                      <p className="font-mono font-bold text-slate-200 mt-0.5">₹{player.totalWon || 0}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActivePlayer(player)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/10"
                >
                  <span>Play as Player</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Dashboard for active player
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Top Header Card */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white">{activePlayer.fullName}</h3>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 uppercase tracking-wider">
                Live Session
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Place wagers, spin, and win cash instantly</p>
          </div>
        </div>

        {/* Live Wallet Balance */}
        <div className="flex items-center gap-6 bg-slate-900/50 p-4 rounded-2xl border border-white/5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Wallet Balance</span>
              <span className="text-xl font-black text-white font-mono">₹{activePlayer.balance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Game Box (Takes 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Game Visualizer Box */}
          <div className="glass-panel p-8 rounded-3xl glow-indigo relative overflow-hidden min-h-[350px] flex flex-col items-center justify-between">
            {/* Ambient Lighting Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-full text-center">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Quantum Roller
              </span>
            </div>

            {/* Spinner Wheel / Dice Roll Animation Container */}
            <div className="my-8 relative flex items-center justify-center">
              <div className={`w-36 h-36 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-300 ${
                isRolling 
                  ? 'border-indigo-500 animate-spin scale-110 shadow-2xl shadow-indigo-500/20' 
                  : rollResult?.outcome === 'win' 
                    ? 'border-emerald-500 scale-105 shadow-2xl shadow-emerald-500/20' 
                    : rollResult?.outcome === 'lose' 
                      ? 'border-rose-500 scale-95 shadow-2xl shadow-rose-500/20'
                      : 'border-white/10'
              }`}>
                {isRolling ? (
                  <Coins className="w-16 h-16 text-indigo-400 animate-bounce" />
                ) : rollResult ? (
                  <div className="text-center animate-fade-in">
                    <span className="text-xs text-slate-400 block font-bold uppercase">Rolled</span>
                    <span className="text-4xl font-black text-white font-mono">{rollResult.roll}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Goal &le; {rollResult.winPercentage}%</span>
                  </div>
                ) : (
                  <Coins className="w-14 h-14 text-slate-600" />
                )}
              </div>
            </div>

            {/* Win/Lose Alert Overlay */}
            <div className="w-full text-center h-16 flex items-center justify-center">
              {isRolling && (
                <p className="text-sm font-semibold text-indigo-400 animate-pulse">Shuffling quantum states...</p>
              )}
              {!isRolling && rollResult && (
                <div className={`animate-fade-in py-2 px-6 rounded-2xl border text-sm font-black flex items-center gap-2 ${
                  rollResult.outcome === 'win'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {rollResult.outcome === 'win' ? (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      <span>WIN! +₹{rollResult.payout.toLocaleString()} (Payout)</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4" />
                      <span>LOST BET (Payout: ₹0)</span>
                    </>
                  )}
                </div>
              )}
              {!isRolling && !rollResult && (
                <p className="text-xs text-slate-500 max-w-xs mx-auto">Set your bet amount below and click Spin/Play to roll the dice!</p>
              )}
            </div>
          </div>

          {/* Bet controls card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-white">Select Bet Amount</h4>
                <p className="text-xs text-slate-400">Specify your wager. Wins pay based on configured multiplier.</p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setPresetBet(0.1)} 
                  className="px-2.5 py-1 text-[10px] font-bold border border-white/5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-all"
                >
                  10%
                </button>
                <button 
                  onClick={() => setPresetBet(0.25)} 
                  className="px-2.5 py-1 text-[10px] font-bold border border-white/5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-all"
                >
                  25%
                </button>
                <button 
                  onClick={() => setPresetBet(0.5)} 
                  className="px-2.5 py-1 text-[10px] font-bold border border-white/5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-all"
                >
                  50%
                </button>
                <button 
                  onClick={() => setPresetBet(1.0)} 
                  className="px-2.5 py-1 text-[10px] font-bold border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-300 transition-all"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-mono text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="Enter bet amount"
                  disabled={isRolling}
                  className="w-full pl-8 pr-4 py-3.5 rounded-xl text-sm font-bold glass-input font-mono"
                  min="1"
                />
              </div>

              <button
                onClick={handlePlaceBet}
                disabled={isRolling || !betAmount || Number(betAmount) <= 0 || Number(betAmount) > activePlayer.balance}
                className="px-8 py-3.5 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
              >
                {isRolling ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>Roll Bet</span>
              </button>
            </div>
          </div>

        </div>

        {/* Deposit & Wallet Stats (Takes 1 Column) */}
        <div className="space-y-6">
          
          {/* Deposit Portal */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <span>Simulate Deposit</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">Load additional mock currency to play higher bets</p>
            </div>

            <form onSubmit={handleDeposit} className="space-y-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-mono text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Deposit amount"
                  className="w-full pl-8 pr-4 py-3 rounded-xl text-xs font-bold glass-input font-mono"
                  min="10"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/10"
              >
                Deposit Funds
              </button>
            </form>
          </div>

          {/* Player Personal History Logs */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <History className="w-5 h-5 text-indigo-400" />
              <span>Personal Bets</span>
            </h4>

            {loadingHistory ? (
              <div className="py-8 text-center">
                <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin mx-auto" />
              </div>
            ) : betHistory.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No bets placed yet</p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {betHistory.map((bet) => (
                  <div key={bet._id} className="flex justify-between items-center p-2.5 bg-slate-900/40 border border-white/5 rounded-xl text-xs">
                    <div>
                      <div className="font-bold font-mono text-slate-200">
                        ₹{bet.amount.toLocaleString()} 
                        <span className="text-[10px] text-slate-500 font-normal ml-1">
                          ({bet.multiplierApplied}x multiplier)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(bet.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      bet.outcome === 'win' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {bet.outcome === 'win' ? `Win +₹${bet.payout}` : 'Lose'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
