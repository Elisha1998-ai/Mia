"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Send, User, Bot, Sparkles, Plus, ArrowUp, ChevronDown, Copy, Reply, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  steps?: string[];
  assets?: any[];
  intent?: string;
  template_data?: any;
  products?: any[];
  isComplete?: boolean;
}

const StepProgress = ({ steps, isComplete, onComplete }: { steps: string[], isComplete?: boolean, onComplete?: () => void }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setCurrentStepIdx(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Wait a bit after the last step before calling onComplete
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 1000);
          return prev;
        }
      });
    }, 1500); // 1.5 seconds per step

    return () => clearInterval(interval);
  }, [steps.length, isComplete, onComplete]);

  if (isComplete) return null;

  return (
    <div className="mb-4 space-y-2 pt-1">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-accent/70">Mia is working</span>
      </div>
      {steps.map((step, idx) => {
        const isPast = idx < currentStepIdx;
        const isCurrent = idx === currentStepIdx;

        return (
          <div 
            key={idx} 
            className={`flex items-center gap-2 text-[11px] transition-all duration-500 ${
              isPast ? 'opacity-40 line-through' : 
              isCurrent ? 'opacity-100 font-medium text-accent' : 
              'opacity-30'
            }`}
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              isPast ? 'bg-foreground/10' : 
              isCurrent ? 'bg-accent/20' : 
              'bg-foreground/5'
            }`}>
              {isPast ? (
                <Check className="w-2.5 h-2.5 text-foreground/50" />
              ) : isCurrent ? (
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              ) : (
                <div className="w-1 h-1 rounded-full bg-foreground/20" />
              )}
            </div>
            {step}
          </div>
        );
      })}
    </div>
  );
};

const StorefrontWireframe = ({ template, products }: { template: any, products: any[] }) => {
  return (
    <div className="mt-6 border border-border-custom rounded-xl overflow-hidden bg-background shadow-2xl">
      {/* Hero Section */}
      <div className="h-32 bg-accent/5 flex flex-col items-center justify-center p-4 text-center border-b border-border-custom">
        <h3 className="text-lg font-bold text-foreground/90">{template?.copy_fields?.hero_title}</h3>
        <p className="text-[10px] text-foreground/50 mt-1">{template?.copy_fields?.hero_subtitle}</p>
      </div>
      
      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => {
          const product = products?.[i - 1];
          return (
            <div key={i} className="space-y-2">
              <div className="aspect-[4/5] bg-foreground/5 rounded-lg flex items-center justify-center border border-dashed border-foreground/10 group hover:border-accent/30 transition-colors">
                {product ? (
                   <span className="text-[10px] text-foreground/20 font-medium">Image Frame</span>
                ) : (
                  <Sparkles className="w-4 h-4 text-foreground/10" />
                )}
              </div>
              <div className="space-y-1">
                <div className="h-2.5 w-3/4 bg-foreground/10 rounded animate-pulse" />
                <div className="h-2 w-1/2 bg-foreground/5 rounded animate-pulse" />
              </div>
              {product && (
                <div className="pt-1">
                  <p className="text-[10px] font-bold text-foreground/80">{product.name}</p>
                  <p className="text-[9px] text-accent">${product.price}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* About Section */}
      <div className="p-4 bg-foreground/5 text-center">
        <h4 className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">{template?.copy_fields?.about_title}</h4>
        <p className="text-[9px] text-foreground/50 mt-2 italic">"{template?.copy_fields?.about_content}"</p>
      </div>
    </div>
  );
};

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (content: string) => void;
  isLoading: boolean;
  onMessageComplete?: (idx: number) => void;
}

export const ChatInterface = ({ messages, onSend, isLoading, onMessageComplete }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [greeting, setGreeting] = useState('Hello');

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReply = (text: string) => {
    setInput(prev => prev + `\n> ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}\n`);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    const username = "HomePC"; // Placeholder or can be dynamic
    if (hour < 12) setGreeting(`Good morning, ${username}`);
    else if (hour < 18) setGreeting(`Good afternoon, ${username}`);
    else setGreeting(`Good evening, ${username}`);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full max-w-3xl mx-auto px-4 relative">
      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-20 pb-48 space-y-8 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-10">
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-sans font-medium text-foreground/90 tracking-tight">
                {greeting}
              </h2>
            </div>
            
            <div className="w-full space-y-4">
              <div className="relative group">
                <form onSubmit={handleSubmit} className="bg-input-bg rounded-3xl p-3 border border-border-custom focus-within:border-foreground/10 transition-all">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type / for commands"
                    className="w-full bg-transparent border-none outline-none text-lg text-foreground/90 placeholder-foreground/40 resize-none min-h-[60px] px-2 pt-1"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-1 px-1">
                    <button type="button" className="p-1.5 text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5 rounded-xl transition-all">
                      <Plus className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button type="button" className="flex items-center gap-2 px-2.5 py-1 text-xs text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5 rounded-lg transition-all border border-border-custom">
                        Mia 2.0 <ChevronDown className="w-3 h-3" />
                      </button>
                      <button 
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-1.5 bg-accent/80 hover:bg-accent text-white rounded-xl transition-all shadow-lg disabled:opacity-30"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`py-2.5 px-4 rounded-2xl text-sm leading-relaxed relative group/msg ${
                m.role === 'user' 
                  ? 'bg-foreground/5 text-foreground/80 shadow-sm' 
                  : 'bg-transparent text-foreground/80'
              }`}>
                {/* Action Buttons */}
                <div className={`absolute -top-3 ${m.role === 'user' ? '-left-16' : '-right-16'} flex flex-row gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity`}>
                  <button 
                    onClick={() => handleCopy(m.content, idx)}
                    className="p-1.5 rounded-lg bg-background border border-border-custom text-foreground/40 hover:text-accent transition-colors shadow-sm"
                    title="Copy message"
                  >
                    {copiedId === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => handleReply(m.content)}
                    className="p-1.5 rounded-lg bg-background border border-border-custom text-foreground/40 hover:text-accent transition-colors shadow-sm"
                    title="Reply to message"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Task Performing State / Steps - SHOWN BEFORE CONTENT */}
                {m.steps && m.steps.length > 0 && !m.isComplete && (
                  <StepProgress 
                    steps={m.steps} 
                    isComplete={m.isComplete} 
                    onComplete={() => onMessageComplete && onMessageComplete(idx)}
                  />
                )}

                {/* Content - ONLY SHOWN AFTER STEPS ARE COMPLETE (OR IF NO STEPS) */}
                {(m.isComplete || !m.steps || m.steps.length === 0) && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-500">
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1" {...props} />,
                          code: ({node, inline, ...props}: any) => (
                            <code className={`${inline ? 'bg-foreground/10 px-1 rounded' : 'block bg-foreground/10 p-2 rounded-lg my-2 overflow-x-auto'}`} {...props} />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>

                    {/* Assets Rendering */}
                    {m.assets && m.assets.length > 0 && !m.template_data && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {m.assets.map((asset, aIdx) => (
                          <div key={aIdx} className="relative aspect-square rounded-lg overflow-hidden border border-border-custom group">
                            <img src={asset.url} alt={asset.type} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                            <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/40 backdrop-blur-sm text-[10px] text-white">
                              {asset.type}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Storefront Wireframe */}
                    {m.template_data && m.intent !== 'store_setup' && (
                      <StorefrontWireframe template={m.template_data} products={m.products || []} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-6 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex max-w-[90%] gap-4">
              <div className="py-2.5 px-4 rounded-2xl text-sm text-foreground/40 italic flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Mia is thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Input for active chat */}
      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 pt-20 pb-8 px-4 bg-gradient-to-t from-background via-background via-80% to-transparent pointer-events-none z-10">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative pointer-events-auto">
            <div className="bg-input-bg rounded-2xl p-2 border border-border-custom focus-within:border-foreground/10 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Mia anything..."
                className="w-full bg-transparent border-none outline-none text-foreground/90 placeholder-foreground/40 resize-none min-h-[40px] max-h-40 px-2 pt-1"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex items-center justify-between mt-1 px-1">
                <button type="button" className="p-1.5 text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5 rounded-xl transition-all">
                  <Plus className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 bg-accent/80 hover:bg-accent text-white rounded-xl transition-all shadow-lg disabled:opacity-30"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
