'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsPage() {
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
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <SettingsIcon size={32} className="text-slate-700 dark:text-slate-300" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
          </div>
          
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Default Export Quality</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors">Standard (1080p)</button>
                <button className="flex-1 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-black rounded-xl border border-indigo-200 dark:border-indigo-700 shadow-sm">High Quality (4K) ✓</button>
                <button className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors">Original Resolution</button>
              </div>
            </section>
            
            <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">API Keys</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Add your own API keys to bypass rate limits.</p>
              <input 
                type="password" 
                placeholder="sk-..."
                className="w-full max-w-md px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100"
              />
            </section>
            
            <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

            <section className="space-y-4">
              <h2 className="text-lg font-black text-red-600 dark:text-red-400">Danger Zone</h2>
              <div className="p-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300 mb-4">Permanently delete your account and all processing history.</p>
                <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-colors shadow-sm">
                  Delete Account
                </button>
              </div>
            </section>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
