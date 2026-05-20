'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { User } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Your Name',
    email: 'you@example.com',
    plan: 'Free Tier',
    filesProcessed: 0
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0">
              <User size={40} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">My Profile</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 dark:text-slate-300">Full Name</label>
                {isEditing ? (
                  <input 
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-300 dark:border-indigo-600 outline-none focus:ring-4 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    {profile.name}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 dark:text-slate-300">Email Address</label>
                {isEditing ? (
                  <input 
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-300 dark:border-indigo-600 outline-none focus:ring-4 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    {profile.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 dark:text-slate-300">Subscription Plan</label>
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-extrabold">
                  {profile.plan}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 dark:text-slate-300">Files Processed</label>
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  {profile.filesProcessed}
                </div>
              </div>
            </div>
            
            <div className="pt-6 flex gap-4">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-colors">
                    Save Profile
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold rounded-xl transition-colors">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
