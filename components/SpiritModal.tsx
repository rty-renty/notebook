import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Scroll, Send } from 'lucide-react';
import { consultDaoistSpirit } from '../services/geminiService';

interface SpiritModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onApplyContent?: (newContent: string) => void;
}

export const SpiritModal: React.FC<SpiritModalProps> = ({ isOpen, onClose, currentContent, onApplyContent }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'polish' | 'expand'>('chat');

  const responseEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setResponse("道友有何困惑？本座愿为你指点迷津。");
      setPrompt('');
    }
  }, [isOpen]);

  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [response]);

  if (!isOpen) return null;

  const handleConsult = async () => {
    if (!prompt.trim() && mode === 'chat') return;

    setIsLoading(true);
    let finalPrompt = prompt;
    
    // Pre-defined prompts for buttons
    if (mode === 'polish' && !prompt) finalPrompt = "请润色这段经文，使其更具道蕴。";
    if (mode === 'expand' && !prompt) finalPrompt = "请推演这段感悟，阐述其中深意。";

    const result = await consultDaoistSpirit(finalPrompt, currentContent, mode);
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1c1917] border-2 border-[#57534e] w-full max-w-2xl rounded-lg shadow-[0_0_30px_rgba(234,179,8,0.15)] flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#44403c] bg-[#292524]">
          <div className="flex items-center gap-2 text-amber-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <h2 className="font-serif text-xl tracking-wider">神识连接 · 器灵</h2>
          </div>
          <button onClick={onClose} className="text-[#78716c] hover:text-amber-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Spirit Response Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center border border-amber-700/50 shrink-0">
                <Scroll className="w-4 h-4 text-amber-500" />
             </div>
             <div className="bg-[#292524] border border-[#44403c] p-4 rounded-r-lg rounded-bl-lg text-[#d6d3d1] leading-relaxed whitespace-pre-wrap shadow-lg font-serif">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-amber-500/70">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                    <span className="text-sm ml-2">正在推演天机...</span>
                  </div>
                ) : (
                  response
                )}
                <div ref={responseEndRef} />
             </div>
          </div>
          
          {/* Action to Apply Text if not chat mode and not loading */}
          {!isLoading && response && mode !== 'chat' && onApplyContent && (
             <div className="flex justify-end">
                <button 
                  onClick={() => {
                    onApplyContent(response);
                    onClose();
                  }}
                  className="text-xs border border-amber-700 text-amber-600 hover:bg-amber-900/20 px-3 py-1 rounded transition-colors font-serif"
                >
                  铭刻于简
                </button>
             </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-[#292524] border-t border-[#44403c] space-y-3">
           <div className="flex gap-2 mb-2">
              <button 
                onClick={() => setMode('chat')}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-serif border transition-all ${mode === 'chat' ? 'bg-amber-900/30 border-amber-600 text-amber-200' : 'border-[#44403c] text-[#78716c] hover:border-[#57534e]'}`}
              >
                请教
              </button>
              <button 
                onClick={() => setMode('polish')}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-serif border transition-all ${mode === 'polish' ? 'bg-emerald-900/30 border-emerald-600 text-emerald-200' : 'border-[#44403c] text-[#78716c] hover:border-[#57534e]'}`}
              >
                润色
              </button>
              <button 
                onClick={() => setMode('expand')}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-serif border transition-all ${mode === 'expand' ? 'bg-indigo-900/30 border-indigo-600 text-indigo-200' : 'border-[#44403c] text-[#78716c] hover:border-[#57534e]'}`}
              >
                推演
              </button>
           </div>

           <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
                placeholder={mode === 'chat' ? "向器灵提问..." : "输入具体要求（可选）..."}
                className="w-full bg-[#1c1917] border border-[#44403c] rounded p-3 pr-12 text-[#d6d3d1] focus:outline-none focus:border-amber-700 placeholder-[#57534e] font-serif"
              />
              <button 
                onClick={handleConsult}
                disabled={isLoading}
                className="absolute right-2 top-2 p-1.5 text-amber-700 hover:text-amber-500 disabled:opacity-50 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};