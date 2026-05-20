'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Logo({ className }: { className?: string }) {
  return (
    <svg 
      className={cn("w-10 h-10 shadow-sm rounded-xl overflow-hidden", className)} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Rounded Square matching the image */}
      <rect width="40" height="40" rx="10" className="fill-[#0f172a] dark:fill-white transition-colors" />
      
      {/* Dense Dust/Sparks from erasing */}
      {[
        { x: -10, y: -12, r: 1.5, d: 0.1, dur: 0.9 },
        { x: 12, y: -10, r: 1.2, d: 0.2, dur: 1.0 },
        { x: -14, y: -4, r: 1.0, d: 0.15, dur: 0.8 },
        { x: 16, y: -6, r: 1.8, d: 0.05, dur: 1.1 },
        { x: -6, y: -16, r: 0.8, d: 0.25, dur: 0.95 },
        { x: 8, y: -15, r: 1.4, d: 0.0, dur: 1.05 },
        { x: 2, y: -18, r: 1.1, d: 0.1, dur: 1.0 },
      ].map((p, i) => (
        <motion.circle 
          key={i}
          cx="20" 
          cy="26" 
          r={p.r} 
          className="fill-white dark:fill-[#0f172a]" 
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            x: p.x, 
            y: p.y,
            scale: [0, 1, 0.5, 0]
          }} 
          transition={{ 
            duration: p.dur, 
            ease: [0.25, 1, 0.5, 1], // Custom bezier curve for natural feel
            delay: p.d,
            repeat: Infinity,
            repeatDelay: 2
          }} 
        />
      ))}

      {/* A line being dynamically erased (representing the watermark) */}
      <motion.path 
        d="M 12 28 L 28 28" 
        className="stroke-[#6E44FF] dark:stroke-[#6E44FF]"
        strokeWidth="2.5" 
        strokeLinecap="round"
        initial={{ pathLength: 1, opacity: 1 }}
        animate={{ 
          pathLength: [1, 0.7, 0.4, 0.1, 0],
          opacity: [1, 1, 0.8, 0, 0]
        }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 1, 0.5, 1], 
          repeat: Infinity,
          repeatDelay: 2
        }}
      />

      {/* The Animated Eraser */}
      <motion.g 
         initial={{ x: 12, y: -5, rotate: 15 }}
         animate={{ 
           x: [12, -6, 8, -3, 2, 0],
           y: [-5, 2, 0, 1.5, 0.5, 0],
           rotate: [15, -12, 10, -6, 3, 0]
         }}
         transition={{ 
           duration: 1.2, 
           ease: [0.25, 1, 0.5, 1], // Custom bezier curve
           repeat: Infinity,
           repeatDelay: 2 // Settles into a clean reveal of the logo
         }}
      >
        <g strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white dark:stroke-[#0f172a]">
          {/* Top diamond block (Eraser Face) */}
          <path d="M20 12 L28 17 L20 22 L12 17 Z" className="fill-white/10 dark:fill-black/5" />
          
          {/* Vertical thickness (3D effect) */}
          <path d="M12 17 V21" />
          <path d="M28 17 V21" />
          <path d="M20 22 V26" />

          {/* Bottom edges of the eraser */}
          <path d="M12 21 L20 26 L28 21" />
        </g>
      </motion.g>
    </svg>
  );
}

