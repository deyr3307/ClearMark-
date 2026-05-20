'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfOcrPreviewProps {
  file: File;
  ocrLanguage?: string;
  ocrSensitivity?: string;
}

export default function PdfOcrPreview({ file, ocrLanguage = 'eng', ocrSensitivity = 'normal' }: PdfOcrPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrTextElements, setOcrTextElements] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1);
        
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context as any,
          viewport: viewport,
        };
        
        await page.render(renderContext as any).promise;
        
        if (active) {
          setImageUrl(canvas.toDataURL('image/png'));
        }
      } catch (error) {
        console.error('Error rendering PDF:', error);
      }
    };
    
    loadPdf();
    
    return () => { active = false; };
  }, [file]);

  const runOcr = async () => {
    if (!imageUrl) return;
    
    setIsProcessing(true);
    setOcrStatus('Initializing OCR engine...');
    setProgress(0);
    setOcrTextElements([]);
    
    try {
      const psmSetting = ocrSensitivity === 'high' ? '1' : 
                         ocrSensitivity === 'low' ? '3' : '3';
                         
      const langPath = ocrSensitivity === 'low' 
        ? 'https://tessdata.projectnaptha.com/4.0.0_fast'
        : 'https://tessdata.projectnaptha.com/4.0.0';
                         
      const worker = await Tesseract.createWorker(ocrLanguage, 1, {
        langPath,
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setOcrStatus(`Scanning document...`);
          } else {
            setOcrStatus(m.status);
          }
        }
      });
      
      await (worker as any).setParameters({
        tessedit_pageseg_mode: psmSetting,
      });
      
      const { data } = await (worker as any).recognize(imageUrl);
      
      const elements = data.words.map((word: any, index: number) => {
        return {
          id: index,
          text: word.text,
          bbox: word.bbox
        };
      });
      
      setOcrTextElements(elements);
      setOcrStatus('OCR Complete!');
      await worker.terminate();
    } catch (err) {
      console.error("OCR Error:", err);
      setOcrStatus('OCR Failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-[70vh] flex flex-col bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="p-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10 shrink-0">
        <div>
          <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            OCR Scanner Preview
          </h4>
          <p className="text-xs text-slate-500 mt-1">Make text within the first page of this PDF selectable</p>
        </div>
        
        <button
          onClick={runOcr}
          disabled={isProcessing || !imageUrl}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:dark:bg-slate-800 text-white font-bold rounded-lg text-sm transition-colors shadow-sm disabled:shadow-none"
        >
          {isProcessing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCw size={16} />
            </motion.div>
          ) : ocrTextElements.length > 0 ? (
            <CheckCircle size={16} />
          ) : (
            <RefreshCw size={16} />
          )}
          {isProcessing ? `Scanning ${progress}%` : ocrTextElements.length > 0 ? 'Rescan Document' : 'Run OCR'}
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-8 relative flex flex-col hide-scrollbar" ref={containerRef}>
        <div className="relative mx-auto bg-white shadow-xl" style={{ width: canvasRef.current?.width || 'auto', height: canvasRef.current?.height || 'auto' }}>
          <canvas 
            ref={canvasRef} 
            className="w-full h-full block"
          />
          
          {/* Overlay text elements */}
          {ocrTextElements.map(element => (
            <span
              key={element.id}
              className="absolute text-transparent select-text cursor-text bg-indigo-500/0 hover:bg-indigo-500/20 selection:bg-indigo-500/40 rounded transition-colors"
              title={element.text}
              style={{
                left: `${element.bbox.x0}px`,
                top: `${element.bbox.y0}px`,
                width: `${element.bbox.x1 - element.bbox.x0}px`,
                height: `${element.bbox.y1 - element.bbox.y0}px`,
                fontSize: `${(element.bbox.y1 - element.bbox.y0) * 0.8}px`,
                lineHeight: `${element.bbox.y1 - element.bbox.y0}px`,
                whiteSpace: 'nowrap'
              }}
            >
              {element.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
