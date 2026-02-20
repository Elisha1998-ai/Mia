"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Loader2 } from "lucide-react";
import Link from "next/link";
import { login, loginWithGoogle } from "@/actions/auth";

export default function SignInPage() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial theme from localStorage or DOM class
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

  // Add basic error boundary or logging
  useEffect(() => {
    console.log("SignInPage mounted");
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-semibold mb-2">
            Log in
          </h1>
          <p className="text-muted-foreground mb-8">Welcome back! Please enter your details.</p>

          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoading(true);
              const formData = new FormData(e.currentTarget);
              try {
                await login(formData);
              } catch (error) {
                console.error(error);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <div className="space-y-2.5">
              <label className="block text-sm font-medium">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-input-bg border border-border-custom rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted-foreground/30"
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-accent text-background py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all mt-2 border-b-2 border-black/20 dark:border-white/20 active:border-b-0 active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Continue with email
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border-custom"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={async () => {
                setIsGoogleLoading(true);
                try {
                  await loginWithGoogle();
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsGoogleLoading(false);
                }
              }}
              className="w-full flex items-center justify-center gap-3 bg-sidebar border border-border-custom py-2.5 rounded-lg font-semibold hover:opacity-80 transition-all border-b-2 border-black/10 dark:border-white/10 active:border-b-0 active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Log in with Google
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-2 text-sm text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth" className="text-accent font-semibold hover:underline">
                Sign up
              </Link>
            </p>
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
