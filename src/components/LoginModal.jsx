import React, { useState } from 'react';
import { X, User, Phone, CheckCircle, LogOut } from 'lucide-react';

export default function LoginModal({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !name) return;
    onLogin({ name, phone });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FAF7F2]">
          <h3 className="text-sm font-black text-gray-900">
            {currentUser ? 'ព័ត៌មានគណនី (Account)' : 'ចូលគណនី (Member Login)'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {currentUser ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-black">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h4 className="font-bold text-gray-900 text-base">{currentUser.name}</h4>
                <p className="text-xs text-gray-500">{currentUser.phone}</p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  GU JP VIP Member
                </span>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>ចាកចេញ (Log Out)</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs text-gray-500 mb-2">
                ចូលដើម្បីតាមដានការដឹកជញ្ជូន និងរក្សាទុកទំនិញដែលអ្នកចូលចិត្ត (Login to track orders and save favorites)
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ឈ្មោះ (Your Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="ឈ្មោះរបស់អ្នក..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  លេខទូរស័ព្ទ (Phone Number)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="012 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#EE1D23] hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition mt-2"
              >
                ចូលគណនី (Login / Continue)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
