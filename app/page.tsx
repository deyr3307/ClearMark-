'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedImageProcessingIcon, AnimatedPdfProcessingIcon, AnimatedPptProcessingIcon, AnimatedWatermarksIcon } from '@/components/FeatureIcons';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const features = [
    {
      title: 'Image Processing',
      description: 'Remove watermarks or elements from any JPG/PNG/WEBP using intelligent AI inpainting.',
      icon: <AnimatedImageProcessingIcon />,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-[#eef2ff] dark:bg-blue-500/10'
    },
    {
      title: 'PDF Processing',
      description: 'Clean up documents, redact logos, and secure your PDF files in seconds.',
      icon: <AnimatedPdfProcessingIcon />,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-[#fff1f2] dark:bg-rose-500/10'
    },
    {
      title: 'PPT Processing',
      description: 'Automatically scan slides to detect and remove draft/watermark text boxes.',
      icon: <AnimatedPptProcessingIcon />,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-[#fff7ed] dark:bg-orange-500/10'
    },
    {
      title: 'Custom Watermarks',
      description: 'Add your own beautiful, personalized watermarks after cleaning your files.',
      icon: <AnimatedWatermarksIcon />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-[#f4f1ff] dark:bg-purple-500/10'
    }
  ];

  const subtitleText = "Intelligently wipe away unwanted elements from your photos, PDFs, and presentations in seconds. Fast, private, and incredibly precise.";
  const words = subtitleText.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.6 * i },
    }),
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 12, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300 relative">
      {/* Universal Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-70 pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        
        <main className="flex-1 flex flex-col items-center">
          
          {/* Hero Section */}
          <div className="w-full max-w-4xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center relative">
            
            {/* Template Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-50/80 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-sm font-black mb-12 border border-indigo-100/80 dark:border-indigo-800/80 backdrop-blur-sm"
            >
              <Sparkles size={16} className="text-indigo-500" />
              <span>Next-Generation AI Processing</span>
            </motion.div>

            {/* Dynamic 3-Line Title matching Template (Black, Purple, Purple) */}
            <div className="flex flex-col items-center justify-center -space-y-1 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -60, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="font-serif font-normal text-[3.5rem] sm:text-7xl md:text-8xl tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Flawless
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <motion.h1 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="font-serif font-normal text-[3.5rem] sm:text-7xl md:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#6E44FF] via-[#06b6d4] to-[#6E44FF] bg-[length:200%_auto] leading-[1.1]"
                >
                  Watermark
                </motion.h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                <motion.h1 
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2.5 }}
                  className="font-serif font-normal text-[3.5rem] sm:text-7xl md:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF44B2] via-[#6E44FF] to-[#FF44B2] bg-[length:200%_auto] leading-[1.1]"
                >
                  Removal
                </motion.h1>
              </motion.div>
            </div>

            {/* Animated Subtitle */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-[800px] mx-auto mb-14 leading-relaxed flex flex-wrap justify-center gap-x-1.5"
            >
              {words.map((word, index) => (
                <motion.span key={index} variants={wordVariants} className="inline-block">
                  {word}
                </motion.span>
              ))}
            </motion.div>
            
            {/* Pill Button */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", bounce: 0.3, duration: 1, delay: 1 }}
            >
              <Link href="/workspace" className="inline-flex items-center justify-center group outline-none">
                <div className="px-10 py-5 bg-[#0f172a] dark:bg-slate-100 hover:bg-[#1e293b] dark:hover:bg-white text-white dark:text-slate-900 rounded-full flex items-center gap-3 font-black text-lg transition-all duration-300 shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.3)] hover:-translate-y-0.5">
                  Let's begin <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Features Grid Matching Template */}
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-24 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 md:p-10 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_45px_rgb(0,0,0,0.06)] transition-shadow duration-300"
                >
                  <div className={cn("inline-flex p-5 rounded-[1.25rem] mb-6", feature.bg, feature.color)}>
                    {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
                  </div>
                  <h3 className={cn("text-[1.5rem] font-black mb-3 tracking-tight", feature.color)}>
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-[1.6] text-base md:text-lg">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
