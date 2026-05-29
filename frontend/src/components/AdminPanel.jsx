import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sliders, DollarSign, Users, Award, ShieldCheck, Edit, ArrowRight, RefreshCw } from 'lucide-react';

const USERS_API = import.meta.env.VITE_API_URL || '/api/users';
const GAME_API = '/api';

export default function AdminPanel({ showToast }) {
  // Config states
  const [winPercentage, setWinPercentage] = useState(40);
  const [winMultiplier, setWinMultiplier] = useState(2.0);
  const [houseProfit, setHouseProfit] = useState(0);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Player lists & adjustments
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [newBalance, setNewBalance] = useState('');

  // Fetch configs
  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const response = await axios.get(`${GAME_API}/admin/settings`);
      if (response.data.success) {
        setWinPercentage(response.data.settings.winPercentage);
        setWinMultiplier(response.data.settings.winMultiplier);
        setHouseProfit(response.data.settings.houseProfit);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load admin settings', 'error');
    } finally {
      setLoadingConfig(false);
    }
  };

  // Fetch players
  const fetchPlayers = async () => {
    setLoadingPlayers(true);
    try {
      const response = await axios.get(USERS_API);
      if (response.data.success) {
        setPlayers(response.data.users || []);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch player list', 'error');
    } finally {
      setLoadingPlayers(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchPlayers();
  }, []);

  // Update odds & multiplier settings
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${GAME_API}/admin/settings`, {
        winPercentage,
        winMultiplier,
      });
      if (response.data.success) {
        showToast('Casino game rules updated successfully!', 'success');
        setWinPercentage(response.data.settings.winPercentage);
        setWinMultiplier(response.data.settings.winMultiplier);
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update settings', 'error');
    }
  };

  // Manually update player balance
  const handleUpdateBalance = async (playerId) => {
    const balanceNum = Number(newBalance);
    if (newBalance === '' || isNaN(balanceNum) || balanceNum < 0) {
      showToast('Please enter a valid balance', 'error');
      return;
    }

    try {
      const response = await axios.post(`${GAME_API}/admin/users/${playerId}/balance`, {
        balance: balanceNum,
      });
      if (response.data.success) {
        showToast(`Successfully set player balance to ₹${balanceNum}`, 'success');
        setEditingPlayerId(null);
        setNewBalance('');
        fetchPlayers(); // Refresh players list
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update player balance', 'error');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
            <span>Admin Control Panel</span>
          </h2>
          <p className="text-slate-400 text-sm">Configure betting algorithms, winning rates, and adjust user wallets.</p>
        </div>
        <button
          onClick={() => { fetchConfig(); fetchPlayers(); }}
          className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Data</span>
        </button>
      </div>

      {/* House Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* House Net Profit */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Net House Profit</span>
            <h3 className={`text-2xl font-black font-mono mt-0.5 ${houseProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{houseProfit.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Current Win Percentage */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Win Probability</span>
            <h3 className="text-2xl font-black mt-0.5 text-white font-mono">{winPercentage}%</h3>
          </div>
        </div>

        {/* Current Multiplier */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Payout Multiplier</span>
            <h3 className="text-2xl font-black mt-0.5 text-white font-mono">{winMultiplier}x</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Game Settings Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl space-y-6 glow-indigo">
            <div className="border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">Odds Configuration</h3>
              <p className="text-xs text-slate-400 mt-1">Directly control the winning algorithm and payouts.</p>
            </div>

            <form onSubmit={handleUpdateSettings} className="space-y-6">
              
              {/* Win Percentage Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                    Win Percentage
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                    {winPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={winPercentage}
                  onChange={(e) => setWinPercentage(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 border border-white/5"
                />
                <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest px-1">
                  <span>Rigged Lose (0%)</span>
                  <span>Fair (50%)</span>
                  <span>Rigged Win (100%)</span>
                </div>
              </div>

              {/* Win Multiplier Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  Payout Multiplier
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="10.0"
                    value={winMultiplier}
                    onChange={(e) => setWinMultiplier(Number(e.target.value))}
                    className="w-full pr-12 pl-4 py-3 rounded-xl text-xs font-bold glass-input font-mono"
                    placeholder="2.0"
                  />
                  <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500 text-xs font-bold">
                    Multiplier (x)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  E.g., if set to 2.0x, a bet of ₹1000 yields ₹2000 on win. If set to 1.5x, it yields ₹1500.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loadingConfig}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
              >
                <span>Save Algorithmic Rules</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - User Balance Adjustment Directory (Takes 2 Columns) */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Player Wallets & Management</h3>
              <p className="text-xs text-slate-400 mt-1">Audit and manually adjust player accounts.</p>
            </div>

            {loadingPlayers ? (
              <div className="p-16 text-center">
                <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
              </div>
            ) : players.length === 0 ? (
              <div className="p-16 text-center text-slate-500 text-xs">No registered players found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-slate-900/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Player Name</th>
                      <th className="py-4 px-6 text-center">Current Wallet</th>
                      <th className="py-4 px-6 text-center">Total Stats</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {players.map((player) => (
                      <tr key={player._id} className="hover:bg-white/5 transition-colors group">
                        
                        {/* Name & Contact */}
                        <td className="py-4 px-6">
                          <span className="font-bold text-white block">{player.fullName}</span>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{player.email}</span>
                        </td>
                        
                        {/* Current Wallet */}
                        <td className="py-4 px-6 text-center">
                          {editingPlayerId === player._id ? (
                            <div className="flex items-center gap-2 justify-center max-w-[150px] mx-auto">
                              <span className="text-slate-500 font-mono text-[10px] font-bold">₹</span>
                              <input
                                type="number"
                                value={newBalance}
                                onChange={(e) => setNewBalance(e.target.value)}
                                className="w-20 px-2 py-1 rounded bg-slate-900 border border-white/10 text-white font-mono text-center text-[10px]"
                                placeholder="0"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ₹{player.balance.toLocaleString()}
                            </span>
                          )}
                        </td>

                        {/* Wager/Won stats */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col items-center gap-0.5 text-[10px] font-mono text-slate-400">
                            <span>Wagered: ₹{player.totalWagered || 0}</span>
                            <span>Won: ₹{player.totalWon || 0}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          {editingPlayerId === player._id ? (
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleUpdateBalance(player._id)}
                                className="px-2 py-1 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 transition-colors uppercase tracking-wider text-[9px]"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => { setEditingPlayerId(null); setNewBalance(''); }}
                                className="px-2 py-1 bg-white/5 text-slate-400 rounded hover:text-white transition-colors uppercase tracking-wider text-[9px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingPlayerId(player._id);
                                setNewBalance(player.balance.toString());
                              }}
                              className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 ml-auto text-[10px]"
                            >
                              <Edit className="w-3 h-3 text-indigo-400" />
                              <span>Set Wallet</span>
                            </button>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
