'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Upload, CheckCircle, Clock, Copy, X, Sparkles, Pencil, Download, FileText, FileImage, Presentation, GripVertical, Archive, Eye, AlertCircle, RotateCcw, Palette, Bookmark, Save, Plus, Trash2, Brain, ZoomIn, ZoomOut, Maximize, Expand, Layers, Shield, ScanText } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { AnimatedImageProcessingIcon, AnimatedPdfProcessingIcon, AnimatedPptProcessingIcon } from '@/components/FeatureIcons';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import dynamic from 'next/dynamic';

const PdfOcrPreview = dynamic(() => import('@/components/PdfOcrPreview'), {
  ssr: false,
});

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const applyImageFilterToBlob = async (file: File, filter: string): Promise<Blob> => {
  if (filter === 'none') return file;
  if (!file.name.match(/\.(jpeg|jpg|png|webp)$/i)) return file; // Ignore gif, canvas doesn't retain animation
  
  return new Promise((resolve) => {
    const img = new globalThis.Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        return resolve(file);
      }
      
      if (filter === 'grayscale') {
        ctx.filter = 'grayscale(100%)';
      } else if (filter === 'sepia') {
        ctx.filter = 'sepia(100%)';
      } else if (filter === 'invert') {
        ctx.filter = 'invert(100%)';
      }
      
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (blob) {
          resolve(blob);
        } else {
          resolve(file);
        }
      }, file.type);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    
    img.src = objectUrl;
  });
};

type TabType = 'image' | 'pdf' | 'ppt';

interface ProcessItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
}

interface Preset {
  id: string;
  name: string;
  instruction: string;
  customWatermark: string;
  imageFilter: string;
  aiModel?: string;
  processMode?: 'sequential' | 'parallel';
  redactionLevel?: string;
  ocrSensitivity?: string;
  ocrLanguage?: string;
}

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [items, setItems] = useState<ProcessItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [customWatermark, setCustomWatermark] = useState('');
  const [imageFilter, setImageFilter] = useState('none');
  const [aiModel, setAiModel] = useState('standard');
  const [processMode, setProcessMode] = useState<'sequential' | 'parallel'>('sequential');
  const [redactionLevel, setRedactionLevel] = useState('medium');
  const [ocrSensitivity, setOcrSensitivity] = useState('normal');
  const [ocrLanguage, setOcrLanguage] = useState('eng');
  const [isDragging, setIsDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<ProcessItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  React.useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('workspace_active_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.instruction !== undefined) setInstruction(parsed.instruction);
        if (parsed.customWatermark !== undefined) setCustomWatermark(parsed.customWatermark);
        if (parsed.imageFilter !== undefined) setImageFilter(parsed.imageFilter);
        if (parsed.aiModel !== undefined) setAiModel(parsed.aiModel);
        if (parsed.processMode !== undefined) setProcessMode(parsed.processMode);
        if (parsed.redactionLevel !== undefined) setRedactionLevel(parsed.redactionLevel);
        if (parsed.ocrSensitivity !== undefined) setOcrSensitivity(parsed.ocrSensitivity);
        if (parsed.ocrLanguage !== undefined) setOcrLanguage(parsed.ocrLanguage);
      }
    } catch {
      // Ignore
    }
  }, []);

  React.useEffect(() => {
    const configToSave = { instruction, customWatermark, imageFilter, aiModel, processMode, redactionLevel, ocrSensitivity, ocrLanguage };
    localStorage.setItem('workspace_active_config', JSON.stringify(configToSave));
  }, [instruction, customWatermark, imageFilter, aiModel, processMode, redactionLevel, ocrSensitivity, ocrLanguage]);
  
  React.useEffect(() => {
    if (activeTab === 'image' && !aiModel.startsWith('inpainting')) setAiModel('inpainting-fast');
    else if (activeTab === 'pdf' && !aiModel.startsWith('pdf')) setAiModel('pdf-fast');
    else if (activeTab === 'ppt' && !aiModel.startsWith('ppt')) setAiModel('ppt-fast');
  }, [activeTab]);

  React.useEffect(() => {
    if (previewItem) {
      const url = URL.createObjectURL(previewItem.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [previewItem]);
  
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [showPresetSave, setShowPresetSave] = useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('watermark_presets');
      if (saved) setPresets(JSON.parse(saved));
    } catch {
      // Ignore
    }
  }, []);

  React.useEffect(() => {
    if (presets.length > 0) {
      localStorage.setItem('watermark_presets', JSON.stringify(presets));
    } else {
      localStorage.removeItem('watermark_presets');
    }
  }, [presets]);

  const tabs = [
    { id: 'image', label: 'Image Processing', icon: AnimatedImageProcessingIcon },
    { id: 'pdf', label: 'PDF Processing', icon: AnimatedPdfProcessingIcon },
    { id: 'ppt', label: 'PPT Processing', icon: AnimatedPptProcessingIcon },
  ] as const;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, files?: FileList | null) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFiles = files || (e.target as HTMLInputElement).files;
    
    if (uploadedFiles) {
      const maxSizeBytes = (activeTab === 'image' ? 10 : 100) * 1024 * 1024;
      const validFiles = Array.from(uploadedFiles).filter(f => f.size <= maxSizeBytes);
      
      if (validFiles.length < uploadedFiles.length) {
        alert(`Some files were skipped because they exceed the ${activeTab === 'image' ? '10 MB' : '100 MB'} limit.`);
      }

      const newFiles = validFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        status: 'pending' as const,
        progress: 0
      }));
      setItems(prev => [...prev, ...newFiles]);
    }
  };

  const processFiles = async () => {
    setIsProcessing(true);
    
    if (activeTab === 'ppt' && processMode === 'parallel') {
      const pendingIndices = items.map((item, index) => item.status !== 'completed' ? index : -1).filter(i => i !== -1);
      
      setItems(prev => prev.map((item, index) => 
        pendingIndices.includes(index) ? { ...item, status: 'processing', progress: 0, errorMessage: undefined } : item
      ));

      await Promise.all(pendingIndices.map(async (i) => {
        const shouldFail = Math.random() > 0.7; // 30% chance to fail
        let hasError = false;

        for(let p = 0; p <= 100; p += 10) {
            await new Promise(resolve => setTimeout(resolve, 150));
            
            if (shouldFail && p === 60) {
                hasError = true;
                setItems(prev => prev.map((item, index) => 
                    index === i ? { ...item, status: 'error', errorMessage: 'Processing failed: Invalid format or corrupted data.' } : item
                ));
                break;
            } else {
                setItems(prev => prev.map((item, index) => 
                    index === i ? { ...item, progress: p } : item
                ));
            }
        }

        if (!hasError) {
            setItems(prev => prev.map((item, index) => 
                index === i ? { ...item, status: 'completed', progress: 100 } : item
            ));
        }
      }));
    } else {
      for (let i = 0; i < items.length; i++) {
          if (items[i].status === 'completed') continue;
          
          setItems(prev => prev.map((item, index) => 
              index === i ? { ...item, status: 'processing', progress: 0, errorMessage: undefined } : item
          ));

          const shouldFail = Math.random() > 0.7; // 30% chance to fail
          let hasError = false;

          // Simulate progress for individual file
          for(let p = 0; p <= 100; p += 10) {
              await new Promise(resolve => setTimeout(resolve, 150));
              
              if (shouldFail && p === 60) {
                  hasError = true;
                  setItems(prev => prev.map((item, index) => 
                      index === i ? { ...item, status: 'error', errorMessage: 'Processing failed: Invalid format or corrupted data.' } : item
                  ));
                  break;
              } else {
                  setItems(prev => prev.map((item, index) => 
                      index === i ? { ...item, progress: p } : item
                  ));
              }
          }

          if (!hasError) {
              setItems(prev => prev.map((item, index) => 
                  index === i ? { ...item, status: 'completed', progress: 100 } : item
              ));
          }
      }
    }
    
    setIsProcessing(false);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const retryItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'pending', errorMessage: undefined } : item));
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    const newPreset: Preset = {
      id: Math.random().toString(36).substring(7),
      name: presetName.trim(),
      instruction,
      customWatermark,
      imageFilter,
      aiModel,
      processMode,
      redactionLevel,
      ocrSensitivity,
      ocrLanguage
    };
    setPresets(prev => [...prev, newPreset]);
    setPresetName('');
    setShowPresetSave(false);
  };

  const applyPreset = (preset: Preset) => {
    setInstruction(preset.instruction);
    setCustomWatermark(preset.customWatermark);
    setImageFilter(preset.imageFilter);
    setAiModel(preset.aiModel || 'standard');
    if (preset.processMode) {
      setProcessMode(preset.processMode);
    }
    if (preset.redactionLevel) setRedactionLevel(preset.redactionLevel);
    if (preset.ocrSensitivity) setOcrSensitivity(preset.ocrSensitivity);
    if (preset.ocrLanguage) setOcrLanguage(preset.ocrLanguage);
    setShowPresetSave(false);
  };

  const removePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  const handleDownloadAll = async () => {
    const completedItems = items.filter(item => item.status === 'completed');
    if (completedItems.length === 0) return;

    const zip = new JSZip();
    for (const item of completedItems) {
      if (item.file.name.endsWith('.pdf') || item.file.name.endsWith('.PDF')) {
        try {
          const { PDFDocument, rgb } = await import('pdf-lib');
          const arrayBuffer = await item.file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          pdfDoc.setTitle("Refined Document");
          const pages = pdfDoc.getPages();
          if (pages.length > 0) {
            const firstPage = pages[0];
            firstPage.drawText(customWatermark || 'Refined by AI', {
               x: 10,
               y: 10,
               size: 8,
               color: rgb(0.8, 0.8, 0.8),
               opacity: 0.5
            });
          }
          const pdfBytes = await pdfDoc.save();
          zip.file(`cleaned_${item.file.name}`, pdfBytes);
        } catch (err) {
          zip.file(`refined_${item.file.name}`, item.file);
        }
      } else if (item.file.name.match(/\.(jpeg|jpg|png|webp|gif)$/i)) {
        if (imageFilter !== 'none') {
          const blob = await applyImageFilterToBlob(item.file, imageFilter);
          zip.file(`filtered_${item.file.name}`, blob);
        } else {
          zip.file(`refined_${item.file.name}`, item.file);
        }
      } else {
        zip.file(`refined_${item.file.name}`, item.file);
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'processed_files.zip');
  };

  const completedCount = items.filter(i => i.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Background aesthetics */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 pointer-events-none -z-10" />

      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-10">
          <motion.h1 
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#6E44FF] via-[#06b6d4] to-[#6E44FF] bg-[length:200%_auto] mb-4 pb-2"
          >
            Workspace
          </motion.h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload your files below. The AI will analyze and process them based on your instructions.
          </p>
        </div>

        {/* Workspace Layout Container */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Processing Area */}
          <div className="flex-1 w-full flex flex-col gap-6">
            
            {/* Interactive Tabs */}
            <div className="flex p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl mx-auto lg:mx-0 w-full lg:w-max overflow-x-auto no-scrollbar shadow-inner">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                let activeColorClass = "text-slate-900 dark:text-white";
                if (isActive) {
                  if (tab.id === 'image') activeColorClass = "text-cyan-600 dark:text-cyan-400 font-black";
                  else if (tab.id === 'pdf') activeColorClass = "text-rose-600 dark:text-rose-400 font-black";
                  else if (tab.id === 'ppt') activeColorClass = "text-orange-600 dark:text-orange-400 font-black";
                }

                return (
                  <button
                    key={tab.id}
                    title={`Switch to ${tab.label}`}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      "relative px-4 sm:px-6 py-2.5 rounded-xl text-sm font-black transition-colors flex items-center gap-2 outline-none shrink-0",
                      isActive ? activeColorClass : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabWorkspace"
                        className="absolute inset-0 bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2">
                      <Icon size={18} />
                      {tab.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Upload Zone */}
            <div 
              title={`Drag and drop ${activeTab === 'image' ? 'images' : activeTab === 'pdf' ? 'PDF' : 'PPT'} files here, or click to upload`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => handleFileUpload(e, e.dataTransfer.files)}
              className={cn(
                "group relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-out",
                "bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
                isDragging 
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 scale-[1.02]" 
                  : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              )}
            >
              <input 
                type="file" 
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={handleFileUpload}
              />
              
              {/* Ambient background glows */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-100 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center justify-center py-20 px-6 text-center">
                <motion.div 
                  animate={isDragging ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : { y: [0, -5, 0] }}
                  transition={isDragging ? { duration: 0.5, repeat: Infinity } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm",
                    isDragging ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-slate-700"
                  )}
                >
                  {activeTab === 'image' ? <AnimatedImageProcessingIcon size={32} /> : 
                   activeTab === 'pdf' ? <AnimatedPdfProcessingIcon size={32} /> : 
                   <AnimatedPptProcessingIcon size={32} />}
                </motion.div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                  {isDragging ? "Drop to upload now" : `Drop ${activeTab === 'image' ? 'Images' : activeTab === 'pdf' ? 'PDFs' : 'Presentations'} here`}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                  {activeTab === 'image' ? 'Up to 10 MB per file.' : 'Up to 100 MB per file.'}
                </p>
              </div>
            </div>

            {/* Queue List */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-slate-800 dark:text-white text-sm">Processing Queue ({items.length})</h3>
                      {completedCount > 1 && (
                        <button
                          title="Package all successfully processed files into a ZIP and download"
                          onClick={handleDownloadAll}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-black hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
                        >
                          <Archive size={14} />
                          Download All
                        </button>
                      )}
                    </div>
                      <button
                        onClick={() => setItems([])} 
                        title="Remove all files from the queue"
                        className="text-xs font-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                  </div>
                  <Reorder.Group axis="y" values={items} onReorder={setItems} className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                      {items.map(item => (
                        <Reorder.Item 
                          value={item}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          key={item.id} 
                          className="p-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-center gap-4 w-full sm:w-[50%] lg:w-[220px] shrink-0">
                            <div className="hidden sm:flex text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors">
                              <GripVertical size={16} />
                            </div>
                            <div className={cn(
                              "p-2.5 rounded-xl shrink-0 flex items-center justify-center",
                              item.file.name.endsWith('.pdf') ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" : 
                              item.file.name.endsWith('.ppt') || item.file.name.endsWith('.pptx') ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                            )}>
                              {item.file.name.endsWith('.pdf') ? <AnimatedPdfProcessingIcon size={24} /> : 
                              item.file.name.endsWith('.ppt') || item.file.name.endsWith('.pptx') ? <AnimatedPptProcessingIcon size={24} /> : <AnimatedImageProcessingIcon size={24} />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-800 dark:text-white text-sm truncate">{item.file.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-black">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          
                          <div className="flex-1 w-full sm:px-8 sm:max-w-md">
                            <div className="flex justify-between text-xs mb-2 items-center">
                              <span className="font-black text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1.5">
                                {item.status === 'processing' && (
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                  </span>
                                )}
                                {item.status}
                              </span>
                              <span className={cn(
                                "font-black",
                                item.status === 'completed' ? "text-emerald-500" :
                                item.status === 'error' ? "text-red-500" :
                                item.status === 'processing' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                              )}>
                                {item.progress}% Complete
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full shadow-inner relative overflow-visible">
                              <motion.div 
                                className={cn(
                                  "absolute top-0 left-0 h-full rounded-full",
                                  item.status === 'completed' ? 'bg-emerald-500' : 
                                  item.status === 'error' ? 'bg-red-500' :
                                  item.status === 'processing' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%]' :
                                  'bg-indigo-500'
                                )}
                                initial={{ width: 0 }}
                                animate={
                                  item.status === 'processing' 
                                    ? { 
                                        width: `${item.progress}%`, 
                                        backgroundPosition: ["100% 0%", "0% 0%"],
                                        boxShadow: ["0 0 8px rgba(99,102,241,0.4)", "0 0 16px rgba(168,85,247,0.7)", "0 0 8px rgba(99,102,241,0.4)"]
                                      }
                                    : item.status === 'completed'
                                    ? { width: `${item.progress}%`, boxShadow: "0 0 10px rgba(16,185,129,0.5)" }
                                    : item.status === 'error'
                                    ? { width: `${item.progress}%`, boxShadow: "0 0 10px rgba(239,68,68,0.5)" }
                                    : { width: `${item.progress}%`, boxShadow: "none", backgroundPosition: "0% 0%" }
                                }
                                transition={{ 
                                  width: { ease: "easeOut", duration: 0.3 },
                                  backgroundPosition: { ease: "linear", duration: 2, repeat: Infinity },
                                  boxShadow: { ease: "easeInOut", duration: 1.5, repeat: Infinity }
                                }}
                              />
                            </div>
                            {item.status === 'error' && item.errorMessage && (
                              <p className="text-xs text-red-500 mt-2 font-black flex items-center gap-1">
                                <AlertCircle size={14} />
                                {item.errorMessage}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-end w-full sm:w-auto shrink-0 gap-2 min-w-[3rem]">
                            {item.status === 'completed' ? (
                              <>
                                <motion.button 
                                  initial={{ scale: 0, opacity: 0 }} 
                                  animate={{ scale: 1, opacity: 1 }} 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setPreviewItem(item)}
                                  title="Preview File"
                                  className="text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 dark:text-cyan-400 p-1.5 rounded-xl hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors"
                                >
                                  <Eye size={18} />
                                </motion.button>
                                <motion.button 
                                  initial={{ scale: 0, opacity: 0 }} 
                                  animate={{ scale: 1, opacity: 1 }} 
                                  whileHover={{ 
                                    scale: 1.1,
                                    boxShadow: "0 0 15px rgba(99,102,241,0.4)",
                                    transition: { repeat: Infinity, repeatType: "reverse", duration: 0.6 }
                                  }}
                                  whileTap={{ scale: 0.9, rotate: -5 }}
                                  onClick={async () => {
                                    if (item.file.name.endsWith('.pdf') || item.file.name.endsWith('.PDF')) {
                                      try {
                                        const { PDFDocument, rgb } = await import('pdf-lib');
                                        const arrayBuffer = await item.file.arrayBuffer();
                                        const pdfDoc = await PDFDocument.load(arrayBuffer);
                                        pdfDoc.setTitle("Refined Document");
                                        const pages = pdfDoc.getPages();
                                        if (pages.length > 0) {
                                          const firstPage = pages[0];
                                          firstPage.drawText(customWatermark || 'Refined by AI', {
                                             x: 10,
                                             y: 10,
                                             size: 8,
                                             color: rgb(0.8, 0.8, 0.8),
                                             opacity: 0.5
                                          });
                                        }
                                        const pdfBytes = await pdfDoc.save();
                                        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `cleaned_${item.file.name}`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                      } catch (err) {
                                        console.error('Failed to process PDF:', err);
                                        // Fallback to original
                                        const url = URL.createObjectURL(item.file);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `refined_${item.file.name}`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                      }
                                    } else if (item.file.name.match(/\.(jpeg|jpg|png|webp|gif)$/i) && imageFilter !== 'none') {
                                      const blob = await applyImageFilterToBlob(item.file, imageFilter);
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `filtered_${item.file.name}`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    } else {
                                      const url = URL.createObjectURL(item.file);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `refined_${item.file.name}`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    }
                                  }}
                                  title="Download Processed File"
                                  className="text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 p-1.5 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                >
                                  <Download size={18} />
                                </motion.button>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 p-1.5 rounded-xl flex items-center justify-center">
                                  <CheckCircle size={18} />
                                </motion.div>
                              </>
                            ) : item.status === 'error' ? (
                              <>
                                <motion.button 
                                  initial={{ scale: 0, opacity: 0 }} 
                                  animate={{ scale: 1, opacity: 1 }} 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => retryItem(item.id)}
                                  title="Retry Processing"
                                  className="text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 p-1.5 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                                >
                                  <RotateCcw size={18} />
                                </motion.button>
                                <motion.button 
                                  initial={{ scale: 0, opacity: 0 }} 
                                  animate={{ scale: 1, opacity: 1 }} 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeItem(item.id)} 
                                  title="Remove File"
                                  className="text-red-500 p-1.5 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                                >
                                  <X size={18} />
                                </motion.button>
                              </>
                            ) : item.status === 'processing' ? (
                              <Clock size={20} className="text-indigo-400 animate-pulse mx-1" />
                            ) : (
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeItem(item.id)} 
                                className="text-slate-400 mb-0 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-all p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                              >
                                <X size={18} />
                              </motion.button>
                            )}
                          </div>
                        </Reorder.Item>
                      ))}
                    </AnimatePresence>
                  </Reorder.Group>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Sidebar Settings Area */}
          <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
            {/* Presets Management */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <label className="flex items-center justify-between text-sm font-black text-slate-900 dark:text-white mb-4">
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <Bookmark size={16} className="text-emerald-500 dark:text-emerald-400" />
                  </motion.div>
                  Saved Presets
                </span>
              </label>
              
              {presets.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto no-scrollbar pr-1 mb-4">
                  {presets.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 group hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                      <button onClick={() => applyPreset(p)} className="flex-1 text-left text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate pr-2">
                        {p.name}
                      </button>
                      <button onClick={() => removePreset(p.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  No presets saved yet.
                </p>
              )}

              {/* Save Preset Controls */}
              <div className="flex flex-col gap-2">
                {showPresetSave ? (
                  <div className="flex bg-slate-50 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                    <input
                      autoFocus
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                      placeholder="Preset name..."
                      className="flex-1 bg-transparent px-3 py-2 text-sm font-extrabold text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 min-w-0"
                    />
                    <button onClick={handleSavePreset} disabled={!presetName.trim()} className="px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 disabled:opacity-50 transition-colors shrink-0">
                      <CheckCircle size={16} />
                    </button>
                    <button onClick={() => { setShowPresetSave(false); setPresetName(''); }} className="px-3 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPresetSave(true)}
                    disabled={!instruction && !customWatermark && imageFilter === 'none' && ['inpainting-fast', 'pdf-fast', 'ppt-fast', 'standard'].includes(aiModel)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-extrabold hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-slate-50 dark:bg-slate-950"
                  >
                    <Save size={16} />
                    Save Current Config
                  </button>
                )}
              </div>
            </div>

            {/* AI Engine Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Brain size={16} className="text-purple-500 dark:text-purple-400" />
                </motion.div>
                Detection Engine
              </label>
              <div className="relative" title="Select the underlying AI model algorithm to process your files">
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm font-extrabold text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
                >
                  {activeTab === 'image' && (
                    <>
                      <option value="inpainting-fast">Fast Inpainting (Standard)</option>
                      <option value="inpainting-hq">High-Quality LaMa Inpainting</option>
                      <option value="inpainting-diff">Generative Diffusional Fill</option>
                    </>
                  )}
                  {activeTab === 'pdf' && (
                    <>
                      <option value="pdf-fast">Fast Text Extraction Masking</option>
                      <option value="pdf-ocr">Deep OCR Logo & Text Removal</option>
                      <option value="pdf-vector">Structural Vector Path Analysis</option>
                    </>
                  )}
                  {activeTab === 'ppt' && (
                    <>
                      <option value="ppt-fast">Slide Layout Analysis</option>
                      <option value="ppt-object">Deep Object & Template Detection</option>
                    </>
                  )}
                  {/* Fallback for old presets or if activeTab logic requires general */}
                  {!['image', 'pdf', 'ppt'].includes(activeTab) && (
                    <>
                      <option value="standard">Standard Model</option>
                      <option value="advanced">Advanced (Deep Learning)</option>
                      <option value="aggressive">Aggressive Detection</option>
                    </>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                {aiModel === 'inpainting-fast' && "Quick standard edge-aware inpainting for simple watermarks."}
                {aiModel === 'inpainting-hq' && "Uses advanced LaMa model for complex resolution-independent fill."}
                {aiModel === 'inpainting-diff' && "Slower, high-accuracy Stable Diffusion based context-aware replacement."}
                {aiModel === 'pdf-fast' && "Quickly strips common embedded texts and simple repeating watermarks."}
                {aiModel === 'pdf-ocr' && "Runs full document OCR to find hidden embedded logos and ghost text."}
                {aiModel === 'pdf-vector' && "Analyzes PDF vectors to separate watermark overlays from content layers."}
                {aiModel === 'ppt-fast' && "Identifies and removes repeating slide master geometries."}
                {aiModel === 'ppt-object' && "Deeply scans objects across presentation for subtle brand logos."}
                {aiModel === 'standard' && "Fast, general-purpose detection for standard watermarks."}
                {aiModel === 'advanced' && "Slower, high-accuracy model trained on diverse formats to catch subtle logos."}
                {aiModel === 'aggressive' && "Maximum detection sensitivity. May remove non-watermark elements."}
              </p>
            </div>

            {/* PPT Processing Mode Selection */}
            {activeTab === 'ppt' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                  <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <Layers size={16} className="text-orange-500 dark:text-orange-400" />
                  </motion.div>
                  Processing Mode
                </label>
                <div className="relative" title="Choose how multiple PPT files are processed">
                  <select
                    value={processMode}
                    onChange={(e) => setProcessMode(e.target.value as 'sequential' | 'parallel')}
                    className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-extrabold text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
                  >
                    <option value="sequential">Sequential Processing</option>
                    <option value="parallel">Parallel Processing</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  {processMode === 'sequential' && "Processes PPTs one by one. Safer for larger presentations with complex layouts."}
                  {processMode === 'parallel' && "Processes multiple PPTs simultaneously. Faster but uses more resources."}
                </p>
              </div>
            )}

            {/* AI Instructions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                  <Sparkles size={16} className="text-indigo-500 dark:text-indigo-400" />
                </motion.div>
                Removal Instructions
              </label>
              <textarea
                title="Enter explicit instructions for the AI on what watermark to remove"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="E.g., Remove the 'NotebookLM' logo from the bottom right"
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-black text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
              />
            </div>

            {/* Custom Watermark (Add) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                <motion.div animate={{ y: [0, -2, 2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Pencil size={16} className="text-indigo-500 dark:text-indigo-400" />
                </motion.div>
                Add Custom Watermark (Optional)
              </label>
              <input
                type="text"
                title="Input a custom watermark to add to the files after removal of the original"
                value={customWatermark}
                onChange={(e) => setCustomWatermark(e.target.value)}
                placeholder="E.g., anirudha's work"
                className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-black text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Leave blank if you only want to remove existing watermarks. This will apply your custom text across all processed files.
              </p>
            </div>

            {/* Image Filter */}
            {activeTab === 'image' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                    <Palette size={16} className="text-cyan-500 dark:text-cyan-400" />
                  </motion.div>
                  Apply Filter
                </label>
                <div className="relative" title="Select a visual filter to apply to the final processed images">
                  <select
                    value={imageFilter}
                    onChange={(e) => setImageFilter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-cyan-500 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10 transition-all text-sm font-black text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
                  >
                    <option value="none">Original (No Filter)</option>
                    <option value="grayscale">Grayscale</option>
                    <option value="sepia">Sepia</option>
                    <option value="invert">Invert Colors</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>
            )}

            {/* PDF Processing Settings */}
            {activeTab === 'pdf' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-5">
                
                {/* Redaction Level */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                      <Shield size={16} className="text-rose-500 dark:text-rose-400" />
                    </motion.div>
                    Redaction Level
                  </label>
                  <div className="relative" title="Set the strength of PII and context redaction">
                    <select
                      value={redactionLevel}
                      onChange={(e) => setRedactionLevel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-rose-500 dark:focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-rose-500/10 transition-all text-sm font-black text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
                    >
                      <option value="low">Low (Explicit PII only)</option>
                      <option value="medium">Medium (PII & Contextual info)</option>
                      <option value="high">High (Aggressive redaction)</option>
                      <option value="strict">Strict (Compliance mode)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* OCR Sensitivity */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                      <ScanText size={16} className="text-emerald-500 dark:text-emerald-400" />
                    </motion.div>
                    OCR Sensitivity
                  </label>
                  <div className="relative" title="Adjust the scanner's sensitivity for recognizing complex or handwritten text">
                    <select
                      value={ocrSensitivity}
                      onChange={(e) => setOcrSensitivity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-black text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
                    >
                      <option value="low">Low (Native text only)</option>
                      <option value="normal">Normal (Standard scanning)</option>
                      <option value="high">High (Deep scan/handwriting)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* OCR Language */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                      <FileText size={16} className="text-blue-500 dark:text-blue-400" />
                    </motion.div>
                    OCR Language
                  </label>
                  <div className="relative" title="Select the primary language of the document to improve OCR accuracy">
                    <select
                      value={ocrLanguage}
                      onChange={(e) => setOcrLanguage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 px-4 py-3 pr-10 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-black text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
                    >
                      <option value="eng">English</option>
                      <option value="fra">French</option>
                      <option value="spa">Spanish</option>
                      <option value="deu">German</option>
                      <option value="chi_sim">Chinese (Simplified)</option>
                      <option value="jpn">Japanese</option>
                      <option value="kor">Korean</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

              </div>
            )}



            {/* Action Button */}
            <motion.button
              title={items.length === 0 ? "Upload files first to start processing" : "Start the selected AI operation on all queued files"}
              whileHover={{ scale: items.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: items.length > 0 ? 0.98 : 1 }}
              onClick={processFiles}
              disabled={isProcessing || items.length === 0 || items.every(i => i.status === 'completed')}
              className={cn(
                "relative overflow-hidden w-full px-8 py-4 rounded-xl font-black text-white shadow-lg transition-all",
                isProcessing || items.length === 0 || items.every(i => i.status === 'completed')
                  ? "bg-slate-300 dark:bg-slate-800 shadow-none cursor-not-allowed text-slate-500 dark:text-slate-400"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/25"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isProcessing ? (
                  <>
                    <Clock size={18} className="animate-spin text-indigo-200" />
                    Processing...
                  </>
                ) : items.length > 0 && items.every(i => i.status === 'completed') ? (
                  <>
                    <CheckCircle size={18} />
                    Completed
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Process {items.length > 0 ? `${items.length} Files` : 'Files'}
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPreviewItem(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <h3 className="font-black text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-md cursor-default" title={previewItem.file.name}>{previewItem.file.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-500 cursor-default">Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={async () => {
                      if (previewItem.file.name.match(/\.(pdf)$/i)) {
                        try {
                          const { PDFDocument, rgb } = await import('pdf-lib');
                          const originalPdfBytes = await previewItem.file.arrayBuffer();
                          const pdfDoc = await PDFDocument.load(originalPdfBytes);
                          const pages = pdfDoc.getPages();
                          if (pages.length > 0 && customWatermark) {
                             const firstPage = pages[0];
                             firstPage.drawText(customWatermark, {
                                x: 10,
                                y: 10,
                                size: 8,
                                color: rgb(0.8, 0.8, 0.8),
                                opacity: 0.5
                             });
                          }
                          const pdfBytes = await pdfDoc.save();
                          const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `cleaned_${previewItem.file.name}`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } catch (err) {
                           console.error('Failed to process previewed PDF:', err);
                           const url = URL.createObjectURL(previewItem.file);
                           const a = document.createElement('a');
                           a.href = url;
                           a.download = `refined_${previewItem.file.name}`;
                           document.body.appendChild(a);
                           a.click();
                           document.body.removeChild(a);
                           URL.revokeObjectURL(url);
                        }
                      } else {
                        const a = document.createElement('a');
                        a.href = previewUrl || '';
                        a.download = `exported_${previewItem.file.name}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    }}
                    title="Export Processed File"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black transition-colors"
                  >
                    <Download size={14} />
                    Export
                  </button>
                  <button onClick={() => setPreviewItem(null)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-full transition-colors"><X size={16} /></button>
                </div>
              </div>
              <div className={cn("flex-1 bg-slate-50 dark:bg-slate-950/50 p-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[500px]", previewItem.file.name.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? "overflow-hidden" : "overflow-auto")}>
                {previewItem.file.name.match(/\.(jpeg|jpg|png|gif|webp)$/i) && previewUrl ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <TransformWrapper
                      initialScale={1}
                      minScale={0.5}
                      maxScale={8}
                      centerOnInit={true}
                    >
                      {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                          <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <button onClick={() => zoomIn()} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Zoom In">
                              <ZoomIn size={18} />
                            </button>
                            <button onClick={() => zoomOut()} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Zoom Out">
                              <ZoomOut size={18} />
                            </button>
                            <button onClick={() => resetTransform()} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Reset Zoom">
                              <Maximize size={18} />
                            </button>
                            <button onClick={() => resetTransform()} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Fit to Screen">
                              <Expand size={18} />
                            </button>
                          </div>
                          <TransformComponent wrapperClass="!w-full !h-full flex items-center justify-center cursor-grab active:cursor-grabbing" contentClass="!w-full !h-full flex items-center justify-center">
                            <img 
                              src={previewUrl} 
                              alt={previewItem.file.name} 
                              className="max-w-full max-h-full object-contain rounded-xl shadow-sm pointer-events-none" 
                              style={{ 
                                filter: imageFilter === 'sepia' ? 'sepia(1)' : 
                                        imageFilter === 'grayscale' ? 'grayscale(1)' : 
                                        imageFilter === 'invert' ? 'invert(1)' : 'none' 
                              }}
                            />
                          </TransformComponent>
                        </>
                      )}
                    </TransformWrapper>
                  </div>
                ) : previewItem.file.name.match(/\.(pdf)$/i) && previewUrl ? (
                  <PdfOcrPreview file={previewItem.file} ocrSensitivity={ocrSensitivity} ocrLanguage={ocrLanguage} />
                ) : previewItem.file.name.match(/\.(ppt|pptx)$/i) ? (
                  <div className="w-full h-full flex flex-col justify-center max-w-4xl max-h-[70vh]">
                    <div className="w-full flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar p-4">
                       {[1, 2, 3, 4, 5].map((slideNum) => (
                         <div key={slideNum} className="shrink-0 w-[400px] sm:w-[600px] aspect-[16/9] bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 sm:p-8 relative overflow-hidden snap-center">
                           <div className="absolute top-4 left-4 text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Slide {slideNum}</div>
                           {slideNum === 1 ? (
                             <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-rose-50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-lg flex flex-col items-center justify-center relative border-4 border-white dark:border-slate-900 shadow-sm overflow-hidden">
                               <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
                               <Presentation size={48} className="text-indigo-500 mb-4 opacity-80" />
                               <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white text-center mb-2 leading-tight max-w-[80%] truncate">
                                  {previewItem.file.name.replace(/\.[^/.]+$/, "")}
                               </h2>
                               <div className="h-1 w-24 bg-indigo-400 rounded-full mb-4 opacity-50" />
                               <p className="text-xs font-bold text-slate-500">Presentation Deck</p>
                             </div>
                           ) : slideNum === 2 ? (
                             <div className="w-full h-full pt-8 flex flex-col gap-4">
                               <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                               <div className="flex-1 flex gap-4">
                                  <div className="flex-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                                    <div className="w-16 h-16 rounded-full bg-indigo-200 dark:bg-indigo-400/30" />
                                  </div>
                                  <div className="flex-1 flex flex-col justify-center gap-3">
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-2 w-4/6 bg-slate-200 dark:bg-slate-800 rounded" />
                                  </div>
                               </div>
                             </div>
                           ) : slideNum === 3 ? (
                             <div className="w-full h-full pt-8 flex flex-col gap-4">
                               <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md mx-auto" />
                               <div className="flex-1 grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 flex flex-col gap-2">
                                    <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-2 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                                  </div>
                                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 flex flex-col gap-2">
                                    <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-2 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                                  </div>
                               </div>
                             </div>
                           ) : slideNum === 4 ? (
                             <div className="w-full h-full pt-8 flex flex-col gap-4">
                               <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                               <div className="flex-1 flex flex-col gap-3 justify-center">
                                 <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded pl-4" />
                                 <div className="h-2 w-11/12 bg-slate-200 dark:bg-slate-800 rounded pl-4" />
                                 <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded pl-4" />
                                 <div className="h-2 w-4/5 bg-slate-200 dark:bg-slate-800 rounded pl-4" />
                                 <div className="h-2 w-5/6 bg-slate-200 dark:bg-slate-800 rounded pl-4" />
                               </div>
                             </div>
                           ) : (
                             <div className="w-full h-full pt-8 flex flex-col gap-4">
                               <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md mx-auto" />
                               <div className="flex-1 flex gap-2 items-end justify-center pb-4">
                                 <div className="w-8 h-12 bg-indigo-300 dark:bg-indigo-500/50 rounded-t-sm" />
                                 <div className="w-8 h-24 bg-indigo-400 dark:bg-indigo-500/70 rounded-t-sm" />
                                 <div className="w-8 h-16 bg-indigo-300 dark:bg-indigo-500/50 rounded-t-sm" />
                                 <div className="w-8 h-32 bg-indigo-500 dark:bg-indigo-500 rounded-t-sm" />
                                 <div className="w-8 h-20 bg-indigo-400 dark:bg-indigo-500/70 rounded-t-sm" />
                               </div>
                             </div>
                           )}
                         </div>
                       ))}
                    </div>
                    <p className="text-center text-xs font-black text-slate-400 mt-2 uppercase tracking-widest flex items-center justify-center gap-2">
                      <Presentation size={12} />
                      Scroll to view slides
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-full max-w-md">
                    <Presentation size={56} className="mx-auto text-indigo-400 mb-6" />
                    <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2 truncate px-4" title={previewItem.file.name}>{previewItem.file.name}</h4>
                    <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium mt-4">
                      <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <span>File Size</span>
                        <span className="font-bold">{(previewItem.file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <span>File Type</span>
                        <span className="font-bold">{previewItem.file.type || 'Unknown Type'}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 font-bold">Native preview not available in browser.</p>
                    <p className="text-xs text-slate-400 mt-2">Please download the processed file to view it.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
