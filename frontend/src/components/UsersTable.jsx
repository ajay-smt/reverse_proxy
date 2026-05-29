import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RotateCw, Users, MapPin, Calendar, Mail, Phone, Hash } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api/users';

/**
 * Modern Users Directory Component
 * Displays registered users in a premium data table layout with analytics and search capabilities.
 * @param {Object} props
 * @param {function} props.showToast - Trigger toast notifications
 */
export default function UsersTable({ showToast }) {
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
  const averageAge = totalUsers > 0 
    ? Math.round(users.reduce((acc, user) => acc + user.age, 0) / totalUsers) 
    : 0;
  const uniqueCities = new Set(users.map(u => u.city.trim().toLowerCase())).size;

  // Format creation timestamp
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Registers</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{totalUsers}</h3>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Age</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{averageAge} <span className="text-sm font-normal text-slate-400">years</span></h3>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
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
            <h2 className="text-xl font-bold text-white">Registered Users</h2>
            <p className="text-xs text-slate-400 mt-1">Manage and inspect database onboarding status</p>
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
                placeholder="Search by name, email or city..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs glass-input"
              />
            </div>
            
            {/* Reload Button */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 rounded-xl border border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
              title="Refresh database records"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Panel Content */}
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <RotateCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Fetching registered profiles...</p>
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
            <h4 className="text-lg font-bold text-white">No Profiles Found</h4>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              {searchQuery ? 'No search results match your criteria. Try adjusting your query.' : 'Get started by creating your first registration account.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Contact details</th>
                  <th className="py-4 px-6 text-center">Age</th>
                  <th className="py-4 px-6">City</th>
                  <th className="py-4 px-6 text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {user.fullName}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{user.email}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{user.phone}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {user.age}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{user.city}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-xs text-slate-400 font-mono">
                      {formatDate(user.createdAt)}
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
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{formatDate(user.createdAt)}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {user.age} yrs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs text-slate-300 bg-slate-900/50 p-3.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{user.city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Panel Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-900/40 text-center text-xs text-slate-500">
          Showing {filteredUsers.length} of {totalUsers} registered users
        </div>

      </div>
    </div>
  );
}
