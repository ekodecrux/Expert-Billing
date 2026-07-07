import React from "react";

interface ExpertAidLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const ExpertAidLogo: React.FC<ExpertAidLogoProps> = ({
  className = "",
  showSubtitle = true,
}) => {
  return (
    <div className={`flex flex-col select-none ${className}`} id="expertaid-fidelity-logo">
      {/* Upper Logo Row: Hexagon Icon + Wordmark */}
      <div className="flex items-center gap-4">
        {/* 1. Left Hexagonal Speech Bubble Icon */}
        <div className="relative shrink-0 hover:scale-105 transition-transform duration-300">
          <svg
            className="w-14 h-14 sm:w-16 sm:h-16 filter drop-shadow-md"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hexagon bubble with bottom-left tail (single path for perfect render) */}
            <path
              d="M 60 10 L 102 34 L 102 84 L 60 108 L 36 94 C 29 101 16 110 16 110 C 16 110 21 98 23 90 L 18 84 L 18 34 Z"
              fill="#2c1e75"
            />
            {/* Left Bracket < (Sky Blue) */}
            <path
              d="M 52 42 L 34 60 L 52 78"
              stroke="#38bdf8"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Right Bracket > (White) */}
            <path
              d="M 68 42 L 86 60 L 68 78"
              stroke="#ffffff"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* 2. Wordmark EXpertAid */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center leading-none">
            {/* 'E' */}
            <span className="text-[#22252a] font-sans font-black text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none uppercase mr-0.5">
              E
            </span>

            {/* Styled Custom SVG 'X' */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center shrink-0 mx-[-2px] sm:mx-[-4px]">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Purple Ribbon Gradient */}
                  <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2c155a" />
                    <stop offset="60%" stopColor="#4c1d95" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>

                  {/* Blue Ribbon Gradient */}
                  <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1d4ed8" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>

                  {/* Soft crossing shadow */}
                  <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow
                      dx="-1"
                      dy="2"
                      stdDeviation="2"
                      floodColor="#000000"
                      floodOpacity="0.4"
                    />
                  </filter>
                </defs>

                {/* Left-to-Right Stroke (Purple Ribbon, underneath) */}
                <path
                  d="M 24 20 C 35 34, 65 66, 76 80"
                  stroke="url(#purpleGrad)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Right-to-Left Stroke (Blue Ribbon, goes over with a shadow) */}
                <path
                  d="M 76 20 C 65 34, 35 66, 24 80"
                  stroke="url(#blueGrad)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#shadowFilter)"
                />
              </svg>
            </div>

            {/* 'pert' */}
            <span className="text-[#22252a] font-sans font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-none lowercase ml-[-2px] sm:ml-[-3px]">
              pert
            </span>

            {/* 'Aid' */}
            <span className="text-[#22252a] font-sans font-black text-3xl sm:text-4xl md:text-5xl tracking-tighter leading-none ml-[-1px]">
              Aid
            </span>
          </div>

          {/* Subtitle: Technologies */}
          <div className="w-full flex justify-end mt-0.5 sm:mt-1">
            <span className="text-[#4c1d95] font-sans font-black text-[9px] sm:text-[11px] tracking-[0.12em] uppercase leading-none mr-1">
              Technologies
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Gradient Capsule: Destiny of Excellence */}
      {showSubtitle && (
        <div className="mt-2.5 bg-gradient-to-r from-[#2c155a] via-[#1e2e7c] to-[#205cb9] rounded-full px-4 sm:px-6 py-1 inline-block shadow-sm w-full text-center">
          <span className="text-white text-[8px] sm:text-[10px] font-sans font-black tracking-[0.2em] uppercase block leading-none">
            DESTINY OF EXCELLENCE
          </span>
        </div>
      )}
    </div>
  );
};
