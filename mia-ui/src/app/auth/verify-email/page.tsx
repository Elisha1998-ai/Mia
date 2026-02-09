"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Sun, Moon, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || (!savedTheme && document.documentElement.classList.contains("dark"));

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    }

    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12 relative justify-center items-center">
        {/* Theme Toggle Button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={toggleTheme}
            className="p-3 transition-all group hover:opacity-70 active:scale-95"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-foreground group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-6 h-6 text-foreground group-hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>

        <div className="max-w-[400px] w-full mx-auto">
          <div className="mb-6 flex justify-start">
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
              <Mail className="w-6 h-6 text-accent" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold mb-2">
            Check your email
          </h1>
          <p className="text-muted-foreground mb-8">
            We've sent a magic link to your email. Click the link in the email to verify your account.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => window.open('mailto:', '_blank')}
              className="w-full bg-accent text-background py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all border-b-2 border-black/20 dark:border-white/20 active:border-b-0 active:translate-y-[1px]"
            >
              Open email app
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 text-sm text-center">
            <p className="text-muted-foreground">
              Didn't receive the email?{" "}
              <button className="text-accent font-semibold hover:underline">
                Resend link
              </button>
            </p>
            <Link href="/auth/signin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to log in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image Frame with Outer Padding and Rounded Corners */}
      <div className="hidden lg:flex lg:w-1/2 p-[5px]">
        <div className="w-full h-full bg-sidebar rounded-tl-[32px] rounded-bl-[32px] transition-colors duration-300">
        </div>
      </div>
    </div>
  );
}
