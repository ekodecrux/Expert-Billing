import React from "react";

interface ExpertAidLogoProps {
  className?: string;
  showSubtitle?: boolean;
  layout?: "horizontal" | "vertical" | "compact";
}

export const ExpertAidLogo: React.FC<ExpertAidLogoProps> = ({
  className = "",
  showSubtitle = true,
  layout = "horizontal",
}) => {
  // The gorgeous high-fidelity POS badge SVG code
  const renderBadgeSVG = (sizeClasses: string) => (
    <svg
      viewBox="0 0 500 500"
      className={`${sizeClasses} filter drop-shadow-sm select-none shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#31106a" />
        </linearGradient>
        <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="barGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="barGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="barGrad3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="barGrad4" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
      </defs>

      {/* 1. Top Coding Brackets <> */}
      <path
        d="M 235 30 L 205 50 L 235 70"
        stroke="#0284c7"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 265 30 L 295 50 L 265 70"
        stroke="#1d4ed8"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Hexagon Boundary Lines with premium style */}
      <path d="M 190 60 L 75 125" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" />
      <path d="M 310 60 L 425 125" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" />

      {/* Left vertical line with breaks and circles */}
      <path d="M 60 145 L 60 270" stroke="#1e1b4b" strokeWidth="8" strokeLinecap="round" />
      <circle cx="60" cy="295" r="14" fill="#1e1b4b" />
      <circle cx="60" cy="295" r="6" fill="#38bdf8" />
      
      {/* Lower left segment ending in bottom node */}
      <path
        d="M 60 320 L 60 375 C 60 395 70 410 90 425 L 230 495"
        stroke="#1e1b4b"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="230" cy="495" r="12" fill="#1e1b4b" />

      {/* Right vertical segment of hexagon */}
      <path d="M 440 145 L 440 275" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" />

      {/* 3. Curved Upward Arrow (SaaS/sales growth vector) */}
      <path
        d="M 240 435 C 310 435 385 405 425 365 L 450 310"
        stroke="url(#arrowGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrow Head */}
      <path d="M 430 300 L 465 290 L 458 325 Z" fill="#06b6d4" />

      {/* 4. Slanted Slats/Bars at the Bottom-Right representing stats / charts */}
      <path d="M 270 455 L 305 450 L 305 490 L 270 495 Z" fill="url(#barGrad1)" />
      <path d="M 320 440 L 355 430 L 355 480 L 320 488 Z" fill="url(#barGrad2)" />
      <path d="M 370 415 L 405 395 L 405 465 L 370 478 Z" fill="url(#barGrad3)" />
      <path d="M 420 380 L 445 350 L 445 440 L 420 460 Z" fill="url(#barGrad4)" />

      {/* 5. Central POS Graphic Illustration (Computer & Printer) */}
      <g transform="translate(130, 105)">
        {/* Baseline table */}
        <path d="M -10 115 L 240 115" stroke="#1e1b4b" strokeWidth="5" strokeLinecap="round" />

        {/* Desktop Monitor */}
        <path d="M 60 90 L 45 110 L 115 110 L 100 90 Z" fill="#111827" />
        <path d="M 75 80 L 75 95" stroke="#111827" strokeWidth="14" strokeLinecap="round" />
        <rect x="15" y="10" width="130" height="80" rx="16" fill="#1e1b4b" stroke="#111827" strokeWidth="5" />
        <rect x="23" y="16" width="114" height="60" rx="10" fill="#1e293b" />
        
        {/* Grid elements on screen (simulated apps) */}
        <rect x="30" y="24" width="16" height="12" rx="3" fill="#60a5fa" />
        <rect x="52" y="24" width="16" height="12" rx="3" fill="#3b82f6" />
        <rect x="74" y="24" width="16" height="12" rx="3" fill="#2563eb" />
        <rect x="96" y="24" width="16" height="12" rx="3" fill="#9ca3af" />
        <rect x="30" y="42" width="16" height="12" rx="3" fill="#9ca3af" />
        <rect x="52" y="42" width="16" height="12" rx="3" fill="#1d4ed8" />
        <rect x="74" y="42" width="16" height="12" rx="3" fill="#1e3a8a" />
        <rect x="96" y="42" width="16" height="12" rx="3" fill="#3b82f6" />
        <rect x="30" y="60" width="16" height="12" rx="3" fill="#2563eb" />
        <rect x="52" y="60" width="16" height="12" rx="3" fill="#60a5fa" />
        <rect x="74" y="60" width="16" height="12" rx="3" fill="#9ca3af" />
        <rect x="96" y="60" width="16" height="12" rx="3" fill="#1e1b4b" />

        {/* Receipt Printer */}
        <g transform="translate(145, 45)">
          <path
            d="M 10 35 L 30 15 L 75 15 L 85 35 L 85 68 L 10 68 Z"
            fill="#1e1b4b"
            stroke="#111827"
            strokeWidth="4"
          />
          <rect x="15" y="40" width="65" height="23" rx="5" fill="#0f172a" />
          <circle cx="55" cy="52" r="4" fill="#38bdf8" />
          <path
            d="M 33 15 L 33 -15 C 33 -20 62 -20 62 -15 L 62 15 Z"
            fill="#ffffff"
            stroke="#111827"
            strokeWidth="2.5"
          />
          <line x1="38" y1="-10" x2="57" y2="-10" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="38" y1="-4" x2="57" y2="-4" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="2" x2="52" y2="2" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="8" x2="57" y2="8" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>

      {/* 6. Bold Wordmark "POS" inside hexagon */}
      {/* Letter P */}
      <path
        d="M 90 230 L 140 230 C 160 230 175 242 175 262 C 175 282 160 294 140 294 L 116 294 L 116 345 L 90 345 Z M 116 253 L 116 272 L 138 272 C 145 272 150 268 150 262 C 150 256 145 253 138 253 Z"
        fill="#1e1b4b"
      />

      {/* Letter O (Circular Badge with Shopping Cart inside) */}
      <circle cx="235" cy="288" r="54" fill="#025cc4" />
      <circle cx="235" cy="288" r="41" fill="#ffffff" />
      <circle cx="235" cy="288" r="34" fill="#0284c7" />
      {/* Shopping Cart Icon */}
      <g
        transform="translate(213, 268) scale(1.1)"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <circle cx="7" cy="21" r="1.5" fill="#ffffff" />
        <circle cx="17" cy="21" r="1.5" fill="#ffffff" />
        <path d="M 1 1 L 4 1 L 7 15 L 19 15 L 22 5 L 5.5 5" />
        <path d="M 7 10 L 17 10" />
        <path d="M 12 5 L 12 15" />
      </g>

      {/* Letter S */}
      <path
        d="M 305 320 C 305 336 322 348 345 348 C 368 348 378 338 378 326 C 378 300 305 305 305 266 C 305 244 324 230 350 230 C 376 230 395 244 395 264 L 369 264 C 369 252 358 248 348 248 C 334 248 331 254 331 262 C 331 285 395 280 395 322 C 395 348 372 365 344 365 C 314 365 292 348 292 320 Z"
        fill="#1e1b4b"
      />

      {/* Subtitle "POINT OF SALE" */}
      <line x1="90" y1="385" x2="135" y2="385" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
      <text
        x="245"
        y="392"
        fill="#111827"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="21"
        letterSpacing="5"
        textAnchor="middle"
      >
        POINT OF SALE
      </text>
      <line x1="355" y1="385" x2="400" y2="385" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );

  if (layout === "compact") {
    return renderBadgeSVG(className || "w-16 h-16 sm:w-20 sm:h-20");
  }

  if (layout === "vertical") {
    return (
      <div className={`flex flex-col items-center select-none ${className}`} id="expertpos-fidelity-logo-vertical">
        {renderBadgeSVG("w-full max-w-[200px] sm:max-w-[240px]")}
        {showSubtitle && (
          <div className="mt-3 bg-gradient-to-r from-[#1e1b4b] via-[#1d4ed8] to-[#0284c7] rounded-full px-4 py-1 inline-block shadow-sm w-full max-w-[200px] sm:max-w-[240px] text-center">
            <span className="text-white text-[8px] sm:text-[9px] font-sans font-black tracking-[0.18em] uppercase block leading-none">
              DESTINY OF EXCELLENCE
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default: Horizontal layout, which fits beautifully on navigation rails and headers
  return (
    <div className={`flex items-center gap-3.5 select-none text-slate-800 ${className}`} id="expertpos-fidelity-logo-horizontal">
      {/* Left Icon Badge */}
      <div className="relative shrink-0 hover:scale-105 transition-transform duration-300">
        {renderBadgeSVG("w-14 h-14 sm:w-16 sm:h-16")}
      </div>

      {/* Right Wordmark */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center leading-none">
          {/* 'E' */}
          <span className="text-current font-sans font-black text-2xl sm:text-3xl md:text-[32px] tracking-tight leading-none uppercase mr-0.5">
            E
          </span>

          {/* Styled Custom Ribbon 'X' */}
          <div className="w-7 h-7 sm:w-8.5 sm:h-8.5 flex items-center justify-center shrink-0 mx-[-1px] sm:mx-[-2px]">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="purpleRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#31106a" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="blueRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="-1"
                    dy="2"
                    stdDeviation="2"
                    floodColor="#000000"
                    floodOpacity="0.3"
                  />
                </filter>
              </defs>
              <path
                d="M 24 20 C 35 34, 65 66, 76 80"
                stroke="url(#purpleRibbon)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 76 20 C 65 34, 35 66, 24 80"
                stroke="url(#blueRibbon)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
                filter="url(#ribbonShadow)"
              />
            </svg>
          </div>

          {/* 'pert POS' */}
          <span className="text-current font-sans font-black text-2xl sm:text-3xl md:text-[32px] tracking-tighter leading-none lowercase ml-[-2px]">
            pert
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-sans font-black text-2xl sm:text-3xl md:text-[32px] tracking-tight leading-none uppercase ml-2">
            POS
          </span>
        </div>

        {/* Subtitle */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 opacity-90">
            <span className="text-current font-sans font-black text-[8.5px] sm:text-[10px] tracking-[0.14em] uppercase leading-none">
              POINT OF SALE
            </span>
            <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
            <span className="text-blue-600 dark:text-blue-400 font-sans font-bold text-[8.5px] sm:text-[9.5px] tracking-[0.08em] uppercase leading-none">
              Smart Billing
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
