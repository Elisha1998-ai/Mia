"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
    "Build a digital products store for an organic skincare guide",
    "Set up a storefront for my fitness coaching ebooks",
    "I want to sell my music production sample packs",
    "Create a store for my recipe books and meal plans",
];

export function AgenticLanding() {
    const [prompt, setPrompt] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Typing animation state
    const [placeholderText, setPlaceholderText] = useState("");
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        const currentSuggestion = "e.g. " + SUGGESTIONS[suggestionIndex];

        if (isDeleting) {
            // Deleting text
            timer = setTimeout(() => {
                setPlaceholderText(currentSuggestion.substring(0, placeholderText.length - 1));
                if (placeholderText.length <= 4) { // keep "e.g. "
                    setIsDeleting(false);
                    setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
                }
            }, 50);
        } else {
            // Typing text
            timer = setTimeout(() => {
                setPlaceholderText(currentSuggestion.substring(0, placeholderText.length + 1));
                if (placeholderText === currentSuggestion) {
                    // Pause at the end before deleting
                    timer = setTimeout(() => setIsDeleting(true), 2000);
                }
            }, 100);
        }

        return () => clearTimeout(timer);
    }, [placeholderText, isDeleting, suggestionIndex]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isSubmitting) {
            setIsSubmitting(true);
            // Save prompt to local storage so it survives the NextAuth redirect
            localStorage.setItem("pony_onboarding_prompt", prompt);

            // Simple intent detection for routing
            const lowerPrompt = prompt.toLowerCase();
            const digitalKeywords = ['ebook', 'e-book', 'course', 'pdf', 'audio', 'video', 'digital', 'template', 'software', 'preset'];
            const isDigital = digitalKeywords.some(kw => lowerPrompt.includes(kw));

            // Redirect to appropriate dashboard (which will kick off auth if needed)
            if (isDigital) {
                router.push("/digital");
            } else {
                router.push("/dashboard");
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-background p-6 animate-in fade-in duration-500 min-h-screen relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-2xl w-full flex flex-col items-center text-center gap-8 relative z-10">

                {/* Header Section */}
                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-accent/10 text-accent rounded-full mb-4">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                        Let's do some business.
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/60 leading-relaxed font-medium max-w-lg mx-auto">
                        Tell me about your business and I'll set it up.
                    </p>
                </div>

                {/* Central Input Area */}
                <form onSubmit={handleSubmit} className="w-full mt-4 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-purple-500/20 blur-2xl rounded-[2rem] opacity-30 group-hover:opacity-70 transition-opacity duration-700" />

                    <div className="relative flex items-center bg-background/50 border-2 border-border/50 hover:border-border rounded-[2rem] p-3 shadow-2xl backdrop-blur-xl transition-all focus-within:ring-4 focus-within:ring-accent/20 focus-within:border-accent">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder={placeholderText}
                            className="w-full bg-transparent border-none resize-none px-6 py-4 min-h-[80px] max-h-[200px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-0 text-lg md:text-xl rounded-[1.5rem]"
                            rows={1}
                            disabled={isSubmitting}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!prompt.trim() || isSubmitting}
                            className="bg-accent text-white p-4 md:p-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all flex-shrink-0 ml-2 shadow-lg shadow-accent/20"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                        </button>
                    </div>
                </form>

                {/* Quick Suggestions */}
                <div className="w-full mt-6 flex flex-col items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                    <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">or pick a starting point</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {SUGGESTIONS.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setPrompt(s)}
                                className="px-5 py-2.5 rounded-full border border-border/50 bg-foreground/5 hover:bg-foreground/10 text-sm font-medium text-foreground/70 hover:text-foreground transition-all hover:scale-105 active:scale-95"
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
