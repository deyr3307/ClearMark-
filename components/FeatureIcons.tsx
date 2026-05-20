'use client';

import React from 'react';
import { motion } from 'motion/react';

export const AnimatedImageProcessingIcon = ({ size = 28 }: { size?: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible">
    {/* Frame drawing */}
    <motion.rect 
      x="3" y="3" width="18" height="18" rx="3" ry="3" 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
    />
    
    {/* Sun and Mountains popping in */}
    <motion.circle cx="8.5" cy="8.5" r="1.5" className="fill-blue-500/20 stroke-blue-500" 
      animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }} 
      transition={{ duration: 1.5, repeat: Infinity, ease: "backOut", repeatDelay: 1.5 }}
      style={{ transformOrigin: "8.5px 8.5px" }}
    />
    <motion.path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" 
      animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
    />
    
    {/* Unwanted object dissolving */}
    <motion.g
       animate={{ opacity: [1, 1, 0, 0, 1], scale: [1, 1, 0.5, 0.5, 1], filter: ["blur(0px)", "blur(0px)", "blur(4px)", "blur(4px)", "blur(0px)"] }}
       transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.4, 0.8, 1], ease: "easeInOut" }}
       style={{ transformOrigin: "15.5px 11.5px" }}
    >
       <circle cx="15.5" cy="11.5" r="2.5" className="fill-blue-500/20 stroke-blue-500 stroke-[1.5]" />
       <path d="M14 10l3 3M17 10l-3 3" className="stroke-blue-500" />
    </motion.g>

    {/* Sparkles appearing after removal */}
    <motion.g
       animate={{ opacity: [0, 0, 0, 1, 0, 0], scale: [0, 0, 0.5, 1.3, 0, 0], rotate: [0, 0, 0, 45, 90, 90] }}
       transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeOut" }}
       style={{ transformOrigin: "15.5px 11.5px" }}
       className="stroke-amber-400 fill-amber-400"
    >
        <path d="M15.5 6v3M15.5 14v3M11.5 11.5h3M19.5 11.5h3M13 9l1.5 1.5M18 14l-1.5-1.5M18 9l-1.5 1.5M13 14l1.5-1.5" strokeWidth="1" />
    </motion.g>

    {/* Magic wand/laser sweeping */}
    <motion.g
      animate={{ x: [-4, 20, -4] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.line
        x1="4" y1="3" x2="4" y2="21"
        className="stroke-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
        strokeWidth="2"
      />
      <motion.polygon points="4,2 2,5 6,5" className="fill-cyan-400 stroke-none" />
      <motion.polygon points="4,22 2,19 6,19" className="fill-cyan-400 stroke-none" />
    </motion.g>
  </motion.svg>
);

export const AnimatedPdfProcessingIcon = ({ size = 28 }: { size?: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible">
    <motion.g
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="fill-white dark:fill-slate-900 stroke-currentColor" />
      <motion.polyline points="14 2 14 8 20 8" 
        animate={{ fill: ["rgba(0,0,0,0)", "rgba(226,232,240,0.5)", "rgba(0,0,0,0)"] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Document content - line drawing */}
      <motion.line x1="8" y1="13" x2="16" y2="13" className="stroke-slate-300 dark:stroke-slate-700" 
        animate={{ x2: [8, 16, 16, 8] }} transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.line x1="8" y1="17" x2="14" y2="17" className="stroke-slate-300 dark:stroke-slate-700" 
        animate={{ x2: [8, 14, 14, 8] }} transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
      />
      
      {/* Watermark/Logo being wiped off */}
      <motion.g
         animate={{ opacity: [1, 1, 0, 0, 1], filter: ["blur(0px)", "blur(0px)", "blur(6px)", "blur(6px)", "blur(0px)"], scale: [1, 1, 1.2, 0.8, 1] }}
         transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.5, 0.8, 1], ease: "easeInOut" }}
         className="text-rose-500"
         style={{ transformOrigin: "12px 15px" }}
      >
         <rect x="8" y="11" width="8" height="6" rx="1" strokeDasharray="2 2" className="stroke-rose-400/50" />
         <text x="12" y="14.5" fontSize="4.5" fontWeight="bold" textAnchor="middle" dominantBaseline="central" className="fill-rose-400 stroke-none tracking-widest" style={{ fontFamily: "sans-serif" }}>W</text>
      </motion.g>
      
      {/* Scanner line going top to bottom to clean it */}
      <motion.g
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <line
          x1="5" x2="19" y1="0" y2="0"
          className="stroke-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,1)]"
          strokeWidth="2"
        />
        <line x1="5" x2="19" y1="-1" y2="-1" className="stroke-rose-300/50" strokeWidth="1" />
      </motion.g>
      
      {/* Confetti/Sparkles replacing it */}
      <motion.g
         animate={{ opacity: [0, 0, 0, 1, 0, 0], scale: [0, 0, 0.5, 1.2, 0, 0], rotate: [0, 0, 0, 180, 0, 0] }}
         transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 0.8, 1], ease: "easeOut" }}
         style={{ transformOrigin: "12px 14px" }}
         className="stroke-emerald-400"
      >
        <path d="M12 9v1.5M12 17.5V19M8.5 14h1.5M14 14h1.5M9.5 11.5l1 1M13.5 16.5l1 1M14.5 11.5l-1 1M9.5 16.5l-1-1" strokeWidth="1.5" />
      </motion.g>
    </motion.g>
  </motion.svg>
);

export const AnimatedPptProcessingIcon = ({ size = 28 }: { size?: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible">
    <motion.path 
      d="M3 5h18v11H3z" 
      className="fill-white dark:fill-slate-900 stroke-currentColor"
    />
    <path d="M12 16v4M8 20h8" />
    
    {/* Inside slide layout - pop in */}
    <motion.rect x="5" y="7" width="5" height="4" rx="1" className="fill-slate-100 dark:fill-slate-800 stroke-none" 
      animate={{ scale: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.9, 1] }} style={{ transformOrigin: "7.5px 9px" }}
    />
    <motion.circle cx="16" cy="11" r="2" className="stroke-slate-300 dark:stroke-slate-700" 
      animate={{ scale: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.15, 0.9, 1] }} style={{ transformOrigin: "16px 11px" }}
    />
    <motion.path d="M13 13h6M13 10h1" className="stroke-slate-300 dark:stroke-slate-700" 
      animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.9, 1] }}
    />
    
    {/* Draft Watermark Box being targeted */}
    <motion.rect 
      x="5" y="11" width="6" height="3" rx="0.5"
      className="stroke-orange-500 fill-orange-500/10"
      strokeDasharray="2 2"
      animate={{ 
        opacity: [1, 1, 0, 0, 1], 
        y: [0, 0, -5, -5, 0],
        scale: [1, 1, 1.2, 1.2, 1],
        rotate: [0, 0, 10, 10, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.5, 0.8, 1], ease: "easeInOut" }}
      style={{ transformOrigin: "8px 12.5px" }}
    />
    
    {/* Targeting cursor/reticle */}
    <motion.g
      className="stroke-orange-500"
      strokeWidth="1.5"
      animate={{ 
        x: [0, 8, 8, 8, 0],
        y: [0, 12, 12, 12, 0],
        scale: [0, 0, 1.3, 0, 0],
        opacity: [0, 0, 1, 0, 0],
        rotate: [0, 0, 180, 360, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.4, 0.6, 1], ease: "backOut" }}
      style={{ transformOrigin: "0 0" }}
    >
       <circle cx="0" cy="0" r="3" strokeDasharray="1 3" className="stroke-orange-400" />
       <path d="M-4 0h2M2 0h2M0 -4v2M0 2v2" />
    </motion.g>

    {/* Sparkle/blast when removed */}
    <motion.g
         animate={{ opacity: [0, 0, 0, 1, 0, 0], scale: [0, 0, 0, 1.5, 0, 0], rotate: [0, 0, 0, 45, 90, 0] }}
         transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 0.7, 1], ease: "easeOut" }}
         style={{ transformOrigin: "8px 12px" }}
         className="stroke-orange-400 fill-orange-400"
    >
       <polygon points="8,9 9,11 11,12 9,13 8,15 7,13 5,12 7,11" />
       <motion.circle cx="8" cy="12" r="4" strokeWidth="1" className="fill-none" animate={{ r: [0, 0, 0, 8, 12, 0], opacity: [0, 0, 0, 1, 0, 0] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 0.7, 1] }}/>
    </motion.g>
  </motion.svg>
);

export const AnimatedWatermarksIcon = ({ size = 28 }: { size?: number }) => (
  <motion.svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="overflow-visible">
    {/* Outline of document with folding corner */}
    <motion.path 
      d="M4 5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" 
      className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700"
      animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }}
      style={{ transformOrigin: "12px 12px" }}
    />
    <motion.path d="M16 3v4h4" className="stroke-slate-300 dark:stroke-slate-700" 
      animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 3, repeat: Infinity }}
    />
    
    <path d="M8 9h6M8 13h8M8 17h4" className="stroke-slate-300 dark:stroke-slate-700" />
    
    {/* Shockwave expanding from stamp impact */}
    <motion.ellipse 
      cx="14" cy="14" rx="2" ry="1" 
      className="stroke-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]"
      animate={{ 
        rx: [1, 12, 12], 
        ry: [1, 6, 6], 
        strokeWidth: [3, 1, 0],
        opacity: [0, 1, 0] 
      }}
      transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 1], ease: "easeOut", delay: 0.1 }}
    />

    {/* The Watermark Mark left behind (Logo/Badge) */}
    <motion.g 
       className="stroke-fuchsia-500 fill-fuchsia-500/10"
       strokeWidth="2"
       animate={{ 
         opacity: [0, 0, 1, 1, 0, 0], 
         scale: [2, 2, 1, 1, 2, 2],
         rotate: [-20, -20, 0, 0, -20, -20]
       }}
       transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.35, 0.8, 0.9, 1], ease: "backOut" }}
       style={{ transformOrigin: "14px 14px" }}
    >
       <circle cx="14" cy="14" r="4" />
       <path d="M14 12v4M12 14h4" />
       <motion.circle cx="14" cy="14" r="6" strokeDasharray="2 4" strokeWidth="1" className="stroke-fuchsia-400"
         animate={{ rotate: [0, 90] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "14px 14px" }}
       />
    </motion.g>

    {/* The Stamp Tool bouncing in */}
    <motion.g
      animate={{ 
        y: [-30, 0, -4, 0, 0, -30],
        scale: [1, 1, 1.1, 1, 1, 1],
        rotate: [20, 0, -5, 0, 0, 20]
      }}
      transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.35, 0.4, 0.8, 1], ease: "easeOut" }}
      style={{ transformOrigin: "14px 14px" }}
    >
      {/* Stamp Base */}
      <path d="M10 12h8v2h-8z" className="fill-fuchsia-100 dark:fill-fuchsia-900/50 stroke-currentColor" />
      {/* Stamp Handle */}
      <path d="M14 12V4" strokeWidth="2.5" />
      <path d="M11 2h6v2h-6z" className="fill-currentColor stroke-none" />
      <circle cx="14" cy="2" r="1.5" className="fill-currentColor stroke-none" />
    </motion.g>
  </motion.svg>
);
