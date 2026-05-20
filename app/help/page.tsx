'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { HelpCircle, Search, FileText, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-200 dark:border-indigo-800">
             <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Help & Support</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            How can we help you today? Search our documentation or contact support.
          </p>
          
          <div className="mt-8 relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, tutorials, or guides..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-slate-100"
            />
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="text-indigo-500 mb-4" size={28} />
            <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">Getting Started Guide</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Learn the basics of the ClearMark workspace and AI instructions.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="text-indigo-500 mb-4" size={28} />
            <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">API Documentation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Integrate our watermark removal engine into your own apps.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow cursor-pointer">
            <Mail className="text-indigo-500 mb-4" size={28} />
            <h3 className="font-black text-lg text-slate-900 dark:text-white mb-2">Contact Support</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Can't find what you need? Send us a message directly.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
