"use client";

import React from 'react';

export default function LogoPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#02020a] overflow-hidden">
      <style jsx global>{`
        @keyframes rotate-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-counter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.2); }
        }
        .animate-rotate-slow {
          animation: rotate-clockwise 40s linear infinite;
        }
        .animate-rotate-slower {
          animation: rotate-counter 60s linear infinite;
        }
        .animate-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-16">
        {/* The Octopo Logo Icon */}
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2ff" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>

              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur4" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur12" />
                <feMerge>
                  <feMergeNode in="blur12" />
                  <feMergeNode in="blur4" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Glow */}
            <circle cx="100" cy="100" r="90" fill="#3b82f6" fillOpacity="0.02" className="blur-3xl" />

            {/* Outer Circular Wave */}
            <g className="animate-rotate-slow origin-center" filter="url(#neonGlow)">
              {[...Array(3)].map((_, i) => (
                <path
                  key={`outer-wave-${i}`}
                  d={`
                    M ${100 + 75 * Math.cos(0)} ${100 + 75 * Math.sin(0)}
                    ${[...Array(120)].map((_, j) => {
                      const angle = (j + 1) * (Math.PI * 2 / 120);
                      const wave = Math.sin(angle * 6 + (i * Math.PI / 1.5)) * 4;
                      const r = 75 + wave;
                      return `L ${100 + r * Math.cos(angle)} ${100 + r * Math.sin(angle)}`;
                    }).join(' ')}
                    Z
                  `}
                  fill="none"
                  stroke="url(#waveGradient)"
                  strokeWidth="0.8"
                  strokeOpacity={0.7 - i * 0.2}
                  className="animate-glow"
                  style={{ animationDelay: `${i * 1}s` }}
                />
              ))}
            </g>

            {/* Middle Circular Wave */}
            <g className="animate-rotate-slower origin-center" filter="url(#neonGlow)">
              {[...Array(3)].map((_, i) => (
                <path
                  key={`mid-wave-${i}`}
                  d={`
                    M ${100 + 55 * Math.cos(0)} ${100 + 55 * Math.sin(0)}
                    ${[...Array(100)].map((_, j) => {
                      const angle = (j + 1) * (Math.PI * 2 / 100);
                      const wave = Math.cos(angle * 5 - (i * Math.PI / 1.5)) * 3.5;
                      const r = 55 + wave;
                      return `L ${100 + r * Math.cos(angle)} ${100 + r * Math.sin(angle)}`;
                    }).join(' ')}
                    Z
                  `}
                  fill="none"
                  stroke="url(#waveGradient)"
                  strokeWidth="1.2"
                  strokeOpacity={0.8 - i * 0.2}
                  className="animate-glow"
                  style={{ animationDelay: `${i * 1.5}s` }}
                />
              ))}
            </g>

            {/* Inner Circular Wave */}
            <g className="animate-rotate-slow origin-center" filter="url(#neonGlow)">
              {[...Array(2)].map((_, i) => (
                <path
                  key={`inner-wave-${i}`}
                  d={`
                    M ${100 + 35 * Math.cos(0)} ${100 + 35 * Math.sin(0)}
                    ${[...Array(80)].map((_, j) => {
                      const angle = (j + 1) * (Math.PI * 2 / 80);
                      const wave = Math.sin(angle * 4 + (i * Math.PI)) * 3;
                      const r = 35 + wave;
                      return `L ${100 + r * Math.cos(angle)} ${100 + r * Math.sin(angle)}`;
                    }).join(' ')}
                    Z
                  `}
                  fill="none"
                  stroke="url(#waveGradient)"
                  strokeWidth="1.5"
                  strokeOpacity={0.9 - i * 0.3}
                  className="animate-glow"
                  style={{ animationDelay: `${i * 2}s` }}
                />
              ))}
            </g>

            {/* Core Energy */}
            <circle cx="100" cy="100" r="1" fill="white" filter="url(#neonGlow)" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-white text-center">
          <h1 className="text-[140px] font-bold tracking-[-0.08em] font-sans leading-none">
            <span className="bg-gradient-to-r from-[#00f2ff] via-[#3b82f6] to-[#d946ef] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              octopo
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
