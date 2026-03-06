"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export function WelcomeHero({
    onSend,
    isAnalyzing
}: {
    onSend: (message: string) => void;
    isAnalyzing?: boolean;
}) {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isAnalyzing) {
            onSend(prompt);
        }
    };

    const suggestions = [
        "I'm a personal trainer selling a 12-week workout PDF...",
        "I need a store for my 'Mastering Notion' video course...",
        "I sell Notion templates for project management...",
        "I want to sell my music production sample pack...",
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-background p-6 animate-in fade-in duration-500 min-h-screen">
            <div className="max-w-xl w-full flex flex-col items-center text-center gap-6">

                {/* Logo / Badge */}
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mb-2 shadow-lg shadow-accent/5">
                    <Sparkles className="w-8 h-8" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        Meet Pony.
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/60 leading-relaxed font-medium">
                        Your AI Copilot for Digital Commerce.<br className="hidden md:block" />
                        Describe what you're selling, and Pony will build your store.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full mt-8 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-purple-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-foreground/5 border border-border-custom rounded-2xl p-2 shadow-lg backdrop-blur-sm transition-all focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="e.g. I am selling an ebook on real estate investing in Lagos..."
                            className="w-full bg-transparent border-none resize-none px-4 py-3 min-h-[60px] max-h-[160px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-0 text-lg sm:text-lg rounded-xl"
                            rows={1}
                            disabled={isAnalyzing}
                        />
                        <button
                            type="submit"
                            disabled={!prompt.trim() || isAnalyzing}
                            className="bg-accent text-white p-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-all flex-shrink-0 ml-2"
                        >
                            {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                        </button>
                    </div>
                </form>

                <div className="w-full mt-8 flex flex-col items-center gap-3">
                    <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Or try a suggestion</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setPrompt(s)}
                                className="px-4 py-2 rounded-full border border-border-custom bg-foreground/5 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
