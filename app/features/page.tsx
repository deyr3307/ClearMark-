'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Sparkles, Zap, Shield, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function FeaturesPage() {
  const allFeatures = [
    {
      title: "Intelligent Watermark Detection",
      description: "Our AI automatically outlines and identifies semi-transparent overlay logos without manual masking.",
      icon: <Sparkles size={24} className="text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: "Batch Processing Pipeline",
      description: "Upload up to 500 images at a time and process them in the background concurrently.",
      icon: <Zap size={24} className="text-amber-600 dark:text-amber-400" />,
    },
    {
      title: "Private & Secure Architecture",
      description: "We use zero-retention cloud pipelines. Your files are permanently wiped after 15 minutes.",
      icon: <Shield size={24} className="text-emerald-600 dark:text-emerald-400" />,
    },
    {
      title: "Generative Background Inpainting",
      description: "Using cutting-edge diffusion models, we reconstruct the removed areas perfectly to match the surroundings.",
      icon: <Wand2 size={24} className="text-purple-600 dark:text-purple-400" />,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Core Features</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover the powerful capabilities of ClearMark's advanced processing engine.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allFeatures.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all"
            >
              <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700">
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
