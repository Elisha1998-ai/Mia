'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, Plus, Sparkles, RotateCcw, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { StoreBuilderMessage, FontOption } from '@/hooks/useStoreBuilder';

interface StoreBuilderChatProps {
  messages: StoreBuilderMessage[];
  isLoading: boolean;
  isBuilding: boolean;
  buildProgress: number;
  builtStoreUrl: string | null;
  PROGRESS_STEPS: string[];
  sendMessage: (content: string) => void;
  handleFontSelection: (font: FontOption) => void;
  reset: () => void;
}

const FONT_PREVIEW_TEXT = 'Aa';

function FontPickerWidget({
  fonts,
  onSelect,
}: {
  fonts: FontOption[];
  onSelect: (font: FontOption) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (font: FontOption) => {
    setSelected(font.id);
    setTimeout(() => onSelect(font), 300);
  };

  return (
    <div className="flex flex-col gap-2 mt-2 w-full">
      {fonts.map((font) => (
        <button
          key={font.id}
          onClick={() => handleSelect(font)}
          className={`flex items-center gap-4 p-3.5 border rounded-2xl text-left transition-all duration-200 hover:border-foreground hover:shadow-md ${selected === font.id
            ? 'border-foreground bg-foreground/5 shadow-md'
            : 'border-border bg-background'
            }`}
        >
          {/* Large letter preview */}
          <p
            className="text-4xl font-medium text-foreground leading-none w-12 flex-shrink-0 text-center"
            style={{ fontFamily: font.heading }}
          >
            {FONT_PREVIEW_TEXT}
          </p>
          {/* Label */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground/90">{font.name}</p>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{font.description}</p>
          </div>
          {/* Heading + body badge */}
          <div className="text-right hidden sm:block flex-shrink-0">
            <p className="text-[10px] text-muted-foreground">{font.heading}</p>
            <p className="text-[10px] text-muted-foreground/60">{font.body}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ProgressWidget({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex flex-col gap-2.5 mt-1">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${idx < currentStep
              ? 'bg-green-500 border-green-500'
              : idx === currentStep
                ? 'border-foreground border-t-transparent animate-spin'
                : 'border-muted-foreground/30'
              }`}
          >
            {idx < currentStep && (
              <svg viewBox="0 0 8 8" className="w-2.5 h-2.5 text-white" fill="none">
                <path
                  d="M1.5 4L3 5.5L6.5 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span
            className={`text-sm transition-colors duration-300 ${idx < currentStep
              ? 'text-foreground/40 line-through'
              : idx === currentStep
                ? 'text-foreground font-medium'
                : 'text-muted-foreground/40'
              }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export function StoreBuilderChat({
  messages,
  isLoading,
  isBuilding,
  buildProgress,
  builtStoreUrl,
  PROGRESS_STEPS,
  sendMessage,
  handleFontSelection,
  reset,
}: StoreBuilderChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    const storedPrompt = localStorage.getItem('pony_onboarding_prompt');
    if (storedPrompt) {
      setInput(storedPrompt);
      localStorage.removeItem('pony_onboarding_prompt');
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isBuilding, buildProgress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isBuilding) return;
    sendMessage(input.trim());
    setInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="text-sm font-semibold text-foreground">Store Builder</span>
        </div>
        <button
          onClick={reset}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
          title="Start over"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 pb-40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="max-w-2xl mx-auto w-full space-y-5">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-2'
                  }`}
              >
                {/* Bubble */}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-foreground/[0.07] text-foreground rounded-br-sm'
                    : 'bg-transparent text-foreground/85 rounded-bl-sm'
                    }`}
                >
                  {msg.isTyping ? (
                    <TypingIndicator />
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-0 last:mb-0">{children}</p>,
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">{children}</strong>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>

                {/* Font Picker Widget */}
                {msg.widget?.type === 'font_picker' && msg.widget.fonts && (
                  <FontPickerWidget fonts={msg.widget.fonts} onSelect={handleFontSelection} />
                )}

                {/* Progress Widget (shown inline when building) */}
                {msg.intent === 'store_setup' && isBuilding && (
                  <div className="mt-3 px-4 py-4 rounded-2xl border border-border bg-foreground/[0.02]">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                      Building your store
                    </p>
                    <ProgressWidget steps={PROGRESS_STEPS} currentStep={buildProgress} />
                  </div>
                )}

                {/* Store ready — show link */}
                {msg.intent === 'store_setup' && !isBuilding && builtStoreUrl && (
                  <div className="mt-3 px-4 py-4 rounded-2xl border border-green-500/30 bg-green-500/5">
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
                      Your store is live!
                    </p>
                    <a
                      href={builtStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
                    >
                      Preview Store <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 pt-16 pb-6 px-4 bg-gradient-to-t from-background via-background via-70% to-transparent pointer-events-none z-10">
        <div className="max-w-2xl mx-auto w-full pointer-events-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full bg-input-bg border border-border rounded-2xl p-2 shadow-sm"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={isBuilding ? 'Building your store...' : 'Tell me about your store...'}
              disabled={isLoading || isBuilding}
              rows={1}
              className="w-full bg-transparent border-none focus:ring-0 text-foreground/80 placeholder:text-foreground/30 resize-none py-2.5 px-3 min-h-[44px] max-h-[130px] text-sm leading-relaxed outline-none disabled:opacity-40"
            />
            <div className="flex items-center justify-between mt-1 px-1">
              <button
                type="button"
                className="p-1.5 text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={isLoading || isBuilding || !input.trim()}
                className="p-1.5 bg-foreground text-background rounded-xl transition-all shadow disabled:opacity-20 hover:opacity-80"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
