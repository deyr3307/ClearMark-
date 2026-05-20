'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, MoreVertical, User, Sparkles, Settings, HelpCircle, Monitor, Check } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

const AnimatedUser = () => (
  <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible stroke-sky-500">
    <motion.path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" animate={{ scale: [1, 1.05, 1], y: [0, -1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="fill-sky-500/20" />
    <motion.circle cx="12" cy="7" r="4" animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="fill-sky-500/20" />
  </motion.svg>
);

const AnimatedSparkles = () => (
  <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible stroke-fuchsia-500" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
    <motion.path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" animate={{ fill: ["transparent", "rgba(217,70,239,0.3)", "transparent"] }} transition={{ duration: 2, repeat: Infinity }} />
    <motion.path d="M5 3v4M3 5h4" className="stroke-fuchsia-400" animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ transformOrigin: "4px 4px" }} />
    <motion.path d="M19 17v4M17 19h4" className="stroke-fuchsia-400" animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} style={{ transformOrigin: "19px 19px" }} />
  </motion.svg>
);

const AnimatedSettings = () => (
  <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible stroke-slate-500" animate={{ rotate: [0, 90] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" className="fill-slate-500/20" />
    <motion.circle cx="12" cy="12" r="3" className="stroke-indigo-500" animate={{ rotate: [0, -180] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "12px 12px" }} strokeDasharray="2 2" />
  </motion.svg>
);

const AnimatedHelp = () => (
  <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible stroke-emerald-500">
    <motion.circle cx="12" cy="12" r="10" className="fill-emerald-500/10" animate={{ strokeDasharray: ["60 60", "20 60", "60 60"], rotate: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "12px 12px" }} />
    <path d="M12 17h.01" />
    <motion.path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" animate={{ y: [0, -2, 0], scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
  </motion.svg>
);

const AnimatedSun = () => (
  <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible stroke-amber-500" animate={{ rotate: [0, 90] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
    <circle cx="12" cy="12" r="4" className="fill-amber-500/20" />
    <motion.g animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </motion.g>
  </motion.svg>
);

const AnimatedMoon = () => (
  <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible stroke-indigo-400">
    <motion.path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" className="fill-indigo-400/20" animate={{ rotate: [0, -10, 0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "12px 12px" }} />
    <motion.path d="M19 3v2M18 4h2" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} className="stroke-indigo-300" />
    <motion.path d="M22 8v1M21.5 8.5h1" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} className="stroke-indigo-300" />
  </motion.svg>
);

const AnimatedMonitor = () => (
  <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible stroke-blue-500">
    <motion.rect width="20" height="14" x="2" y="3" rx="2" className="fill-blue-500/10" animate={{ strokeDasharray: ["0 100", "68 0", "68 0"] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }} />
    <path d="M8 21h8M12 17v4" />
    <motion.path d="M2 13h20" className="stroke-blue-400" animate={{ y: [0, -8, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 3, repeat: Infinity }} />
  </motion.svg>
);

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group outline-none">
          <div className="transition-transform duration-500 group-hover:scale-[1.05] drop-shadow-sm">
            <Logo />
          </div>
          <motion.span 
            className="font-logo font-black text-3xl tracking-wide text-slate-900 dark:text-white flex items-center mt-1"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          >
            Clear<span className="text-slate-500 dark:text-slate-400">Mark</span>
          </motion.span>
        </Link>
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all outline-none"
            aria-label="Toggle Menu"
          >
            <MoreVertical size={18} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-3 w-64 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_15px_40px_-5px_rgba(0,0,0,0.2)] flex flex-col gap-1 origin-top-right z-[100]"
              >
                <div className="px-3 py-2 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Menu
                </div>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full text-left">
                  <AnimatedUser /> Profile
                </Link>
                <Link href="/features" onClick={() => setMenuOpen(false)} className="group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full text-left">
                  <AnimatedSparkles /> Features
                </Link>
                <Link href="/settings" onClick={() => setMenuOpen(false)} className="group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full text-left">
                  <AnimatedSettings /> Settings
                </Link>
                <Link href="/help" onClick={() => setMenuOpen(false)} className="group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full text-left">
                  <AnimatedHelp /> Help & Documentation
                </Link>
                
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-1 mx-1" />
                
                <div className="px-3 py-2 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                  Appearance
                </div>
                {mounted && (
                  <>
                    <button 
                      onClick={() => setTheme('light')}
                      className="group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full text-left"
                    >
                      <div className="flex items-center gap-3">
                        <AnimatedSun /> Light
                      </div>
                      {theme === 'light' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className="group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full text-left"
                    >
                      <div className="flex items-center gap-3">
                        <AnimatedMoon /> Dark
                      </div>
                      {theme === 'dark' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </button>
                    <button 
                      onClick={() => setTheme('system')}
                      className="group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full text-left"
                    >
                      <div className="flex items-center gap-3">
                        <AnimatedMonitor /> System
                      </div>
                      {theme === 'system' && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
