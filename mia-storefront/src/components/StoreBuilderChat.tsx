import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowUp, Plus, User } from 'lucide-react';
import { FONTS } from '@/hooks/useStoreBuilder';

interface StoreBuilderChatProps {
  messages: { role: 'user' | 'ai'; text: string }[];
  isGenerating: boolean;
  prompt: string;
  setPrompt: (value: string) => void;
  handleGenerate: (e: React.FormEvent) => void;
  handleFontSelection: (font: string) => void;
  stage: 'initial' | 'asking_color' | 'asking_font' | 'generating' | 'completed';
  progressStep: number;
  PROGRESS_STEPS: string[];
}

export function StoreBuilderChat({
  messages,
  isGenerating,
  prompt,
  setPrompt,
  handleGenerate,
  handleFontSelection,
  stage,
  progressStep,
  PROGRESS_STEPS
}: StoreBuilderChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, progressStep]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate(e as any);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-64"
      >
        <div className={`max-w-3xl mx-auto w-full space-y-6 ${messages.length === 0 ? 'h-full flex flex-col justify-center' : ''}`}>
          
          {/* Welcome / Empty State */}
          {messages.length === 0 && (
            <div className="text-center space-y-4 px-4">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center text-background mx-auto mb-4">
                <Sparkles size={32} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Mia Store Builder</h2>
              <p className="text-sm text-muted-foreground">Describe your dream store, and I'll build it for you in seconds.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Message Bubble */}
                <div 
                  className={`py-2.5 px-4 rounded-2xl text-sm leading-relaxed relative group/msg ${
                    msg.role === 'user' 
                      ? 'bg-foreground/[0.05] dark:bg-foreground/[0.1] text-foreground/80' 
                      : 'bg-transparent text-foreground/80'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Progress / Generating State */}
          {isGenerating && (
            <div className="flex gap-6 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex max-w-[90%] gap-4">
                  <div className="bg-transparent p-4 rounded-2xl text-sm text-muted-foreground flex flex-col gap-3 min-w-[200px]">
                    {PROGRESS_STEPS.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                          idx < progressStep 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : idx === progressStep 
                              ? 'border-foreground border-t-transparent animate-spin' 
                              : 'border-muted-foreground/30'
                        }`}>
                          {idx < progressStep && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`transition-colors duration-300 ${
                          idx < progressStep 
                            ? 'text-foreground/40 line-through' 
                            : idx === progressStep 
                              ? 'text-foreground font-medium' 
                              : 'text-muted-foreground/60'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 pt-20 pb-8 px-4 bg-gradient-to-t from-background via-background via-80% to-transparent pointer-events-none z-10">
        <div className="max-w-3xl mx-auto w-full relative pointer-events-auto flex flex-col items-center">
          
          {/* Font Selection (Special Case) */}
          {stage === 'asking_font' ? (
            <div className="w-full grid grid-cols-2 gap-3 pb-2 mb-2">
              {FONTS.map((font) => (
                <button
                  key={font}
                  onClick={() => handleFontSelection(font)}
                  className="p-3 border border-border-custom rounded-xl bg-background hover:border-foreground hover:shadow-md transition-all text-left shadow-sm"
                >
                  <span className="block text-xs text-muted-foreground mb-1">{font}</span>
                  <span className="text-lg text-foreground" style={{ fontFamily: font }}>Ag</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="w-full bg-input-bg border-x border-b border-border-custom rounded-2xl border-t p-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  stage === 'initial' || stage === 'completed' ? "Describe your store..." :
                  stage === 'asking_color' ? "e.g., Blue, #FF5733..." :
                  "Please wait..."
                }
                disabled={isGenerating}
                className="w-full bg-transparent border-none focus:ring-0 text-foreground/80 placeholder:text-foreground/30 resize-none py-3 px-4 min-h-[60px] max-h-[150px] text-base leading-relaxed outline-none disabled:opacity-50"
                rows={1}
                onKeyDown={onKeyDown}
              />
              <div className="flex items-center justify-between mt-1 px-1">
                <button type="button" className="p-1.5 text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5 rounded-xl transition-all">
                  <Plus className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className="p-1.5 bg-accent/80 hover:bg-accent text-white dark:text-black rounded-xl transition-all shadow-lg disabled:opacity-30"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
