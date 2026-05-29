import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RotateCw, Users, MapPin, Calendar, Mail, Phone, Wallet, PlayCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api/users';

/**
 * Modern Users Directory Component
 * Displays registered players in a premium data table layout with analytics, financial stats, and play actions.
 * @param {Object} props
 * @param {function} props.showToast - Trigger toast notifications
 * @param {function} props.onSelectPlayer - Callback to play as a selected user
 */
export default function UsersTable({ showToast, onSelectPlayer }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Users from Database
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setUsers(response.data.users || []);
        setFilteredUsers(response.data.users || []);
      } else {
        throw new Error('API failed to retrieve users');
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      const errMsg = err.response?.data?.message || 'Failed to fetch registered users. Please check backend status.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter((user) => 
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.city.toLowerCase().includes(query) ||
      user.phone.includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Analytics helper calculations
  const totalUsers = users.length;
  const totalCirculation = users.reduce((acc, u) => acc + (u.balance || 0), 0);
  const uniqueCities = new Set(users.map(u => u.city.trim().toLowerCase())).size;

  // Format creation timestamp
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric Card 1 */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Players</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{totalUsers}</h3>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Coins in Play</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5 font-mono">₹{totalCirculation.toLocaleString()}</h3>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Cities</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{uniqueCities}</h3>
          </div>
        </div>

      </div>

      {/* Directory Main Panel */}
      <div className="glass-panel rounded-3xl glow-indigo overflow-hidden">
        
        {/* Panel Header */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Registered Players</h2>
            <p className="text-xs text-slate-400 mt-1">Select a profile to play as that user, or inspect their cash standings</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search players..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs glass-input"
              />
            </div>
            
            {/* Reload Button */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
              title="Refresh player records"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Panel Content */}
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <RotateCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Fetching player profiles...</p>
          </div>
        ) : error ? (
          <div className="p-20 text-center">
            <p className="text-rose-400 font-semibold">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold transition-colors shadow-md"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 mb-4 border border-slate-800">
              <Users className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">No Players Found</h4>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              {searchQuery ? 'No search results match your criteria.' : 'Get started by creating your first registration account.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Player Name</th>
                  <th className="py-4 px-6">Wallet Balance</th>
                  <th className="py-4 px-6">Wagered / Won</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Name / Email */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</div>
                    </td>

                    {/* Balance */}
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ₹{user.balance?.toLocaleString()}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-xs text-slate-400 font-mono gap-0.5">
                        <span>Wagered: ₹{user.totalWagered || 0}</span>
                        <span>Won: ₹{user.totalWon || 0}</span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{user.city}</span>
                      </span>
                    </td>

                    {/* Play Action */}
                    <td className="py-4 px-6 text-right">
                      {onSelectPlayer && (
                        <button
                          onClick={() => onSelectPlayer(user)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto shadow-md shadow-indigo-600/15"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Play</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <div key={user._id} className="p-6 space-y-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{user.fullName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">{user.email}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ₹{user.balance?.toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Wagered</span>
                      <span className="font-mono text-slate-200">₹{user.totalWagered || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Won</span>
                      <span className="font-mono text-slate-200">₹{user.totalWon || 0}</span>
                    </div>
                  </div>

                  {onSelectPlayer && (
                    <button
                      onClick={() => onSelectPlayer(user)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Select Player to Bet</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Panel Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-900/40 text-center text-xs text-slate-500">
          Showing {filteredUsers.length} of {totalUsers} registered players
        </div>

      </div>
    </div>
  );
}
