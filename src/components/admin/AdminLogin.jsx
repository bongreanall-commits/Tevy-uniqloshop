import React, { useState } from 'react';
import { X, Lock, ShieldCheck, ArrowRight, User } from 'lucide-react';

export default function AdminLogin({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && (password === 'admin123' || password === 'admin' || password === 'tevy2026')) {
      onLoginSuccess();
      setError('');
      onClose();
    } else {
      setError('Invalid username or password. Default is admin / admin123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#1C1C1E] text-white">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-black">
              Admin Portal Access
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <p className="text-xs text-gray-500">
            Enter administrative credentials to manage products, post from Uniqlo JP, and track customer orders.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="Enter password (default: admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-bold">
              ⚠️ {error}
            </p>
          )}

          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-[11px] text-gray-500">
            <span>🔑 Demo Login: </span>
            <span className="font-mono font-bold text-gray-700">admin</span> / <span className="font-mono font-bold text-gray-700">admin123</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#EE1D23] hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <span>Login to Admin Backend</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
