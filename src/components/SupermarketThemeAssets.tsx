import React from "react";

interface KpiSparklineProps {
  variant:
    | "wave-green"
    | "bars-amber"
    | "wave-emerald"
    | "wave-teal"
    | "wave-blue"
    | "bars-blue"
    | "wave-orange"
    | "bars-orange"
    | "wave-purple"
    | "wave-amber";
}

export const KpiSparkline: React.FC<KpiSparklineProps> = ({ variant }) => {
  if (variant === "bars-amber" || variant === "bars-blue" || variant === "bars-orange") {
    const heights = [10, 14, 12, 18, 22, 19, 25, 29, 34, 38];
    const hiFill =
      variant === "bars-blue" ? "#0d78d6" : variant === "bars-orange" ? "#ea580c" : "#22c55e";
    const loFill =
      variant === "bars-blue" ? "#93c5fd" : variant === "bars-orange" ? "#fdba74" : "#86efac";
    return (
      <svg
        viewBox="0 0 80 42"
        className="w-16 h-9 shrink-0 opacity-85 pointer-events-none select-none"
        aria-hidden="true"
      >
        {heights.map((h, idx) => (
          <rect
            key={idx}
            x={idx * 8 + 1}
            y={42 - h}
            width="5"
            height={h}
            rx="1.5"
            fill={idx >= 7 ? hiFill : loFill}
          />
        ))}
      </svg>
    );
  }

  const fillColors: Record<
    Exclude<KpiSparklineProps["variant"], "bars-amber" | "bars-blue" | "bars-orange">,
    { stop1: string; stop2: string; stroke: string }
  > = {
    "wave-green": { stop1: "#86efac", stop2: "#dcfce7", stroke: "#22c55e" },
    "wave-emerald": { stop1: "#6ee7b7", stop2: "#d1fae5", stroke: "#10b981" },
    "wave-teal": { stop1: "#99f6e4", stop2: "#ccfbf1", stroke: "#14b8a6" },
    "wave-blue": { stop1: "#93c5fd", stop2: "#dbeafe", stroke: "#0d78d6" },
    "wave-orange": { stop1: "#fdba74", stop2: "#ffedd5", stroke: "#f97316" },
    "wave-purple": { stop1: "#c4b5fd", stop2: "#ede9fe", stroke: "#8b5cf6" },
    "wave-amber": { stop1: "#fcd34d", stop2: "#fef3c7", stroke: "#f59e0b" }
  };

  const palette = fillColors[variant];
  const gradId = `kpi-grad-${variant}`;

  return (
    <svg
      viewBox="0 0 90 42"
      className="w-20 h-9 shrink-0 opacity-90 pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.stop1} stopOpacity="0.8" />
          <stop offset="100%" stopColor={palette.stop2} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M0 36 C12 34, 18 20, 30 22 C42 24, 48 12, 60 15 C70 18, 78 6, 90 4 L90 42 L0 42 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M0 36 C12 34, 18 20, 30 22 C42 24, 48 12, 60 15 C70 18, 78 6, 90 4"
        fill="none"
        stroke={palette.stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ProduceBasketIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 210 86"
      className="h-16 w-40 shrink-0 pointer-events-none select-none hidden xl:block"
      aria-hidden="true"
    >
      {/* Soft leafy backdrop */}
      <ellipse cx="115" cy="74" rx="82" ry="9" fill="#bbf7d0" opacity="0.6" />

      {/* Leafy greens */}
      <path d="M58 50 C44 26, 62 12, 78 24 C86 30, 82 48, 72 54 Z" fill="#16a34a" />
      <path d="M72 48 C64 22, 86 8, 98 22 C104 30, 96 48, 86 54 Z" fill="#22c55e" />
      <path d="M132 46 C132 20, 156 12, 166 26 C172 34, 162 48, 148 52 Z" fill="#15803d" />

      {/* Yellow bell pepper */}
      <path
        d="M92 34 C92 22, 108 20, 118 24 C128 28, 128 46, 120 52 C110 58, 92 54, 92 34 Z"
        fill="#facc15"
      />
      <path d="M106 23 C106 16, 112 14, 114 18" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Red apple / tomato */}
      <circle cx="140" cy="40" r="14" fill="#ef4444" />
      <ellipse cx="135" cy="34" rx="4" ry="2.5" fill="#fca5a5" opacity="0.65" />
      <path d="M140 26 C140 21, 145 19, 147 22" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Orange carrot */}
      <path d="M154 44 L190 30 C194 34, 192 42, 184 46 L154 54 Z" fill="#f97316" />
      <path d="M188 34 L200 24 M190 38 L204 34" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />

      {/* Green pear / broccoli */}
      <circle cx="76" cy="40" r="11" fill="#4ade80" />
      <circle cx="84" cy="36" r="9" fill="#16a34a" />
      <circle cx="122" cy="44" r="11" fill="#84cc16" />

      {/* Woven basket */}
      <path
        d="M44 48 L174 48 L160 76 C158 80, 152 82, 146 82 L72 82 C66 82, 60 80, 58 76 Z"
        fill="#b45309"
      />
      <rect x="38" y="44" width="142" height="8" rx="4" fill="#d97706" />
      {/* Basket weave lines */}
      <path d="M52 58 H166 M56 67 H162 M62 75 H156" stroke="#92400e" strokeWidth="2" />
      <path d="M74 52 L78 82 M100 52 L102 82 M126 52 L124 82 M150 52 L144 82" stroke="#92400e" strokeWidth="2" opacity="0.7" />
    </svg>
  );
};

interface GroceryProductThumbProps {
  name: string;
  category: string;
}

export const GroceryProductThumb: React.FC<GroceryProductThumbProps> = ({ name, category }) => {
  const lower = `${name} ${category}`.toLowerCase();

  // Dairy & Milk / Ghee / Butter
  if (lower.includes("milk") || lower.includes("dairy") || lower.includes("ghee") || lower.includes("butter") || lower.includes("curd")) {
    const isGhee = lower.includes("ghee") || lower.includes("butter");
    return (
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${isGhee ? "bg-amber-50 border-amber-200" : "bg-sky-50 border-sky-200"}`}>
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          {isGhee ? (
            <>
              <rect x="11" y="12" width="18" height="21" rx="3" fill="#fbbf24" />
              <rect x="10" y="9" width="20" height="4" rx="1.5" fill="#b45309" />
              <rect x="13" y="17" width="14" height="10" rx="1.5" fill="#fef3c7" />
              <circle cx="20" cy="22" r="3" fill="#d97706" />
            </>
          ) : (
            <>
              <path d="M12 14 L15 8 H25 L28 14 V33 C28 34, 27 35, 26 35 H14 C13 35, 12 34, 12 33 Z" fill="#38bdf8" />
              <rect x="12" y="18" width="16" height="11" fill="#ffffff" opacity="0.9" />
              <path d="M15 8 H25 L23 11 H17 Z" fill="#0284c7" />
              <circle cx="20" cy="23.5" r="2.8" fill="#0ea5e9" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // Fruits & Vegetables
  if (lower.includes("apple") || lower.includes("banana") || lower.includes("fruit") || lower.includes("veg") || lower.includes("produce") || lower.includes("tomato") || lower.includes("onion")) {
    const isBanana = lower.includes("banana");
    return (
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${isBanana ? "bg-yellow-50 border-yellow-200" : "bg-rose-50 border-rose-200"}`}>
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          {isBanana ? (
            <>
              <path d="M10 25 C14 33, 28 31, 31 14 C28 18, 21 25, 12 22 Z" fill="#facc15" stroke="#eab308" strokeWidth="1" />
              <path d="M12 19 C16 27, 27 25, 29 10 C26 14, 20 20, 13 17 Z" fill="#fde047" />
              <path d="M29 10 L31 8" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="20" cy="23" r="10.5" fill="#ef4444" />
              <ellipse cx="16.5" cy="19" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.7" />
              <path d="M20 12.5 C20 9, 23 8, 25 9" stroke="#15803d" strokeWidth="2" strokeLinecap="round" fill="none" />
              <ellipse cx="23.5" cy="11" rx="3.5" ry="1.8" fill="#22c55e" transform="rotate(-20 23.5 11)" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // Grains / Dal / Rice / Muesli / Grocery
  if (lower.includes("dal") || lower.includes("rice") || lower.includes("grain") || lower.includes("muesli") || lower.includes("atta") || lower.includes("flour")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-50 border-emerald-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <rect x="10" y="9" width="20" height="24" rx="4" fill="#f59e0b" />
          <rect x="13" y="14" width="14" height="12" rx="2" fill="#fef3c7" />
          <path d="M16 20 Q20 16 24 20 Q20 24 16 20 Z" fill="#16a34a" />
          <rect x="14" y="7" width="12" height="3" rx="1" fill="#b45309" />
        </svg>
      </div>
    );
  }

  // Snacks / Peanuts / Chips / Biscuits
  if (lower.includes("snack") || lower.includes("peanut") || lower.includes("chip") || lower.includes("biscuit") || lower.includes("chocolate")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-orange-50 border-orange-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <rect x="11" y="9" width="18" height="23" rx="3" fill="#ea580c" />
          <circle cx="20" cy="20" r="5.5" fill="#fed7aa" />
          <circle cx="18.5" cy="19.5" r="2" fill="#9a3412" />
          <circle cx="21.5" cy="21" r="2" fill="#9a3412" />
        </svg>
      </div>
    );
  }

  // Beverages / Tea / Coffee / Juice
  if (lower.includes("tea") || lower.includes("coffee") || lower.includes("juice") || lower.includes("cola") || lower.includes("drink") || lower.includes("bever")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-teal-50 border-teal-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <rect x="13" y="11" width="14" height="22" rx="3" fill="#0d9488" />
          <rect x="15" y="16" width="10" height="9" rx="1.5" fill="#ccfbf1" />
          <rect x="16" y="8" width="8" height="3" rx="1" fill="#115e59" />
        </svg>
      </div>
    );
  }

  // Default grocery basket icon
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-50 border-emerald-200">
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <rect x="10" y="15" width="20" height="16" rx="3" fill="#16a34a" />
        <path d="M14 15 L17 9 M26 15 L23 9" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="14" y="19" width="12" height="3" rx="1" fill="#bbf7d0" />
        <rect x="14" y="24" width="8" height="3" rx="1" fill="#bbf7d0" />
      </svg>
    </div>
  );
};

export const MedicalCrossIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-white" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
  </svg>
);

export const PharmaKpiIllustration: React.FC = () => (
  <svg
    viewBox="0 0 110 72"
    className="w-24 h-16 shrink-0 pointer-events-none select-none opacity-90 hidden sm:block"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="pharma-card-glow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <path d="M12 72 C24 38, 52 14, 110 10 L110 72 Z" fill="url(#pharma-card-glow)" />
    {/* Pill Bottle */}
    <rect x="64" y="22" width="22" height="28" rx="4" fill="#f59e0b" />
    <rect x="62" y="17" width="26" height="6" rx="2" fill="#e2e8f0" />
    <rect x="67" y="29" width="16" height="12" rx="1.5" fill="#ffffff" opacity="0.95" />
    <path d="M75 31.5 v7 M71.5 35 h7" stroke="#0d78d6" strokeWidth="2" strokeLinecap="round" />
    {/* Capsules */}
    <rect x="44" y="49" width="14" height="7" rx="3.5" fill="#0d78d6" transform="rotate(-22 51 52.5)" />
    <rect x="86" y="48" width="13" height="6.5" rx="3.25" fill="#10b981" transform="rotate(28 92 51)" />
    {/* Heartbeat EKG Wave */}
    <path
      d="M8 58 H28 L33 50 L39 64 L45 45 L50 58 H60"
      fill="none"
      stroke="#0284c7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.7"
    />
  </svg>
);

export const PharmaProductThumb: React.FC<GroceryProductThumbProps> = ({ name, category }) => {
  const lower = `${name} ${category}`.toLowerCase();

  // Tablets / Capsules / Medicines / Rx
  if (lower.includes("tab") || lower.includes("paracetamol") || lower.includes("cap") || lower.includes("rx") || lower.includes("med") || lower.includes("strip")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-sky-50 border-sky-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <rect x="8" y="9" width="24" height="22" rx="3" fill="#0d78d6" />
          <rect x="10" y="11" width="20" height="18" rx="2" fill="#ffffff" />
          <circle cx="15" cy="16" r="2.2" fill="#93c5fd" />
          <circle cx="20" cy="16" r="2.2" fill="#93c5fd" />
          <circle cx="25" cy="16" r="2.2" fill="#93c5fd" />
          <circle cx="15" cy="23" r="2.2" fill="#38bdf8" />
          <circle cx="20" cy="23" r="2.2" fill="#38bdf8" />
          <circle cx="25" cy="23" r="2.2" fill="#38bdf8" />
        </svg>
      </div>
    );
  }

  // Vitamins / Supplements / Bottles
  if (lower.includes("vitamin") || lower.includes("supp") || lower.includes("omega") || lower.includes("protein") || lower.includes("syrup")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-amber-50 border-amber-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <rect x="12" y="13" width="16" height="20" rx="3" fill="#f59e0b" />
          <rect x="11" y="8" width="18" height="5" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
          <rect x="14" y="18" width="12" height="10" rx="1.5" fill="#ffffff" />
          <path d="M20 20.5 v5 M17.5 23 h5" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Sanitizer / Spray / Liquid / Care
  if (lower.includes("sanit") || lower.includes("liquid") || lower.includes("wash") || lower.includes("gel") || lower.includes("lotion") || lower.includes("drop")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-cyan-50 border-cyan-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <path d="M16 9 H24 M20 9 V13" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="13" y="14" width="14" height="20" rx="3" fill="#38bdf8" />
          <rect x="15" y="18" width="10" height="10" rx="1.5" fill="#ffffff" />
          <path d="M20 20.5 v5 M17.5 23 h5" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Masks / Devices / Bandage / First Aid
  if (lower.includes("mask") || lower.includes("aid") || lower.includes("device") || lower.includes("therm") || lower.includes("oxim") || lower.includes("kit")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-blue-50 border-blue-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <rect x="8" y="13" width="24" height="18" rx="3" fill="#07569e" />
          <rect x="10" y="15" width="20" height="14" rx="2" fill="#e0f2fe" />
          <path d="M20 18 v8 M16 22 h8" stroke="#07569e" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Default medical bottle/cross badge
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-sky-50 border-sky-200">
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <rect x="10" y="10" width="20" height="20" rx="5" fill="#0d78d6" />
        <path d="M20 14 v12 M14 20 h12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const ChefHatIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-white" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 3a4.2 4.2 0 0 0-3.82 2.46A3.75 3.75 0 0 0 4 9.15c0 1.48.86 2.77 2.12 3.38V17.5A1.5 1.5 0 0 0 7.62 19h8.76a1.5 1.5 0 0 0 1.5-1.5v-4.97A3.75 3.75 0 0 0 20 9.15a3.75 3.75 0 0 0-4.18-3.69A4.2 4.2 0 0 0 12 3zm-4 17.5a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H8z" />
  </svg>
);

export const RestaurantKpiIllustration: React.FC = () => (
  <svg
    viewBox="0 0 110 72"
    className="w-24 h-16 shrink-0 pointer-events-none select-none opacity-95 hidden sm:block"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="rest-card-glow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#fdba74" stopOpacity="0.55" />
      </linearGradient>
    </defs>
    <path d="M10 72 C24 38, 52 14, 110 8 L110 72 Z" fill="url(#rest-card-glow)" />
    {/* Gourmet Pizza Pie */}
    <circle cx="80" cy="48" r="24" fill="#d97706" />
    <circle cx="80" cy="48" r="20" fill="#fde047" />
    <circle cx="80" cy="48" r="18" fill="#facc15" opacity="0.7" />
    {/* Pepperoni & toppings */}
    <circle cx="72" cy="40" r="3.4" fill="#b91c1c" />
    <circle cx="87" cy="41" r="3.2" fill="#b91c1c" />
    <circle cx="78" cy="54" r="3.5" fill="#b91c1c" />
    <circle cx="90" cy="53" r="3" fill="#b91c1c" />
    {/* Basil leaves */}
    <ellipse cx="81" cy="46" rx="3.2" ry="1.7" fill="#15803d" transform="rotate(-25 81 46)" />
    <ellipse cx="70" cy="51" rx="2.8" ry="1.5" fill="#16a34a" transform="rotate(20 70 51)" />
    {/* Slice lines */}
    <path d="M60 48 H100 M80 28 V68 M66 34 L94 62" stroke="#b45309" strokeWidth="1" opacity="0.45" />
  </svg>
);

export const RestaurantProductThumb: React.FC<GroceryProductThumbProps> = ({ name, category }) => {
  const lower = `${name} ${category}`.toLowerCase();

  // Pizza / Flatbread
  if (lower.includes("pizza") || lower.includes("margherita") || lower.includes("pepperoni")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-amber-50 border-amber-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <circle cx="20" cy="20" r="13" fill="#d97706" />
          <circle cx="20" cy="20" r="10.5" fill="#fde047" />
          <circle cx="16.5" cy="16.5" r="2.2" fill="#b91c1c" />
          <circle cx="23.5" cy="17.5" r="2" fill="#b91c1c" />
          <circle cx="19.5" cy="24" r="2.2" fill="#b91c1c" />
          <ellipse cx="23" cy="22.5" rx="2" ry="1.1" fill="#15803d" transform="rotate(-20 23 22.5)" />
        </svg>
      </div>
    );
  }

  // Burger / Sandwich / Slider / Roll
  if (lower.includes("burger") || lower.includes("sandwich") || lower.includes("bun") || lower.includes("slider") || lower.includes("wrap")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-orange-50 border-orange-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <path d="M9 18 C9 11, 31 11, 31 18 Z" fill="#f59e0b" />
          <rect x="8" y="19" width="24" height="3" rx="1.5" fill="#16a34a" />
          <rect x="9" y="22.5" width="22" height="4" rx="1.5" fill="#78350f" />
          <rect x="9" y="27" width="22" height="4.5" rx="2" fill="#d97706" />
          <circle cx="16" cy="14.5" r="0.8" fill="#fef3c7" />
          <circle cx="21" cy="13.5" r="0.8" fill="#fef3c7" />
          <circle cx="25" cy="15" r="0.8" fill="#fef3c7" />
        </svg>
      </div>
    );
  }

  // Coffee / Tea / Beverages / Mocktails / Drinks / Shakes
  if (lower.includes("coffee") || lower.includes("tea") || lower.includes("chai") || lower.includes("drink") || lower.includes("bever") || lower.includes("mocktail") || lower.includes("shake") || lower.includes("cola") || lower.includes("juice")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-stone-50 border-amber-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <path d="M13 13 H27 L25 32 C24.8 33.5, 23.5 34.5, 22 34.5 H18 C16.5 34.5, 15.2 33.5, 15 32 Z" fill="#78350f" />
          <ellipse cx="20" cy="13" rx="7" ry="2.4" fill="#fde68a" />
          <path d="M22 6 L20 13" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Cake / Dessert / Pastry / Ice Cream / Brownie / Sweet
  if (lower.includes("cake") || lower.includes("dessert") || lower.includes("pastry") || lower.includes("sweet") || lower.includes("ice") || lower.includes("brownie") || lower.includes("gulab")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-rose-50 border-rose-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <rect x="10" y="18" width="20" height="14" rx="3" fill="#5c2d16" />
          <rect x="10" y="23" width="20" height="3" fill="#fde68a" />
          <path d="M10 18 C13 15, 27 15, 30 18 Z" fill="#92400e" />
          <circle cx="20" cy="13" r="3" fill="#b91c1c" />
        </svg>
      </div>
    );
  }

  // Biryani / Thali / Rice / Main Course / Curry / Paneer / Dosa / Noodles
  if (lower.includes("biryani") || lower.includes("thali") || lower.includes("curry") || lower.includes("paneer") || lower.includes("main") || lower.includes("dosa") || lower.includes("noodle") || lower.includes("rice")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-amber-50 border-amber-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <ellipse cx="20" cy="24" rx="12" ry="7" fill="#b45309" />
          <ellipse cx="20" cy="21" rx="10" ry="5" fill="#fbbf24" />
          <circle cx="17" cy="20" r="1.5" fill="#dc2626" />
          <circle cx="22" cy="21.5" r="1.5" fill="#16a34a" />
          <circle cx="24" cy="19" r="1.3" fill="#dc2626" />
        </svg>
      </div>
    );
  }

  // Default Gourmet Cloche / Dish Icon
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-[#fdf4e3] border-amber-200">
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <path d="M9 26 C9 17, 31 17, 31 26 Z" fill="#7a111a" />
        <circle cx="20" cy="15" r="2.2" fill="#f59e0b" />
        <rect x="7" y="27" width="26" height="3" rx="1.5" fill="#b45309" />
      </svg>
    </div>
  );
};

export const PgHostelProductThumb: React.FC<GroceryProductThumbProps> = ({ name, category }) => {
  const lower = `${name} ${category}`.toLowerCase();

  // Room Rent / Sharing / Single Bed
  if (lower.includes("rent") || lower.includes("sharing") || lower.includes("single") || lower.includes("room") || lower.includes("bed")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-teal-50 border-teal-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <rect x="6" y="20" width="28" height="9" rx="2.5" fill="#0f766e" />
          <rect x="8" y="14" width="9" height="6" rx="2" fill="#5eead4" />
          <rect x="18" y="15" width="14" height="5" rx="2" fill="#99f6e4" />
          <rect x="7" y="29" width="3" height="4" rx="1" fill="#115e59" />
          <rect x="30" y="29" width="3" height="4" rx="1" fill="#115e59" />
        </svg>
      </div>
    );
  }

  // Mess & Meal Plan
  if (lower.includes("mess") || lower.includes("meal") || lower.includes("tiffin") || lower.includes("food")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-amber-50 border-amber-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <circle cx="20" cy="21" r="11" fill="#f59e0b" />
          <circle cx="20" cy="21" r="8" fill="#fef3c7" />
          <circle cx="17" cy="19" r="2" fill="#d97706" />
          <circle cx="23" cy="22" r="2.2" fill="#16a34a" />
          <circle cx="19" cy="24" r="1.6" fill="#dc2626" />
        </svg>
      </div>
    );
  }

  // Security & Caution Deposit
  if (lower.includes("deposit") || lower.includes("caution") || lower.includes("security")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-50 border-emerald-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <path d="M20 7 L31 12 V20 C31 27, 26 32, 20 34 C14 32, 9 27, 9 20 V12 Z" fill="#0d9488" />
          <path d="M15.5 20.5 L18.5 23.5 L25 16.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
    );
  }

  // Electricity & Utility
  if (lower.includes("electr") || lower.includes("utility") || lower.includes("meter") || lower.includes("power") || lower.includes("wifi")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-sky-50 border-sky-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <circle cx="20" cy="20" r="12" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <path d="M21 11 L15 21 H20 L19 29 L25 19 H20 Z" fill="#0284c7" />
        </svg>
      </div>
    );
  }

  // Laundry & Housekeeping
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-cyan-50 border-cyan-200">
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <rect x="9" y="8" width="22" height="24" rx="3.5" fill="#0891b2" />
        <rect x="11" y="10" width="18" height="4" rx="1" fill="#cffafe" />
        <circle cx="20" cy="22" r="6" fill="#ecfeff" />
        <circle cx="20" cy="22" r="3.5" fill="#22d3ee" />
      </svg>
    </div>
  );
};

export const FashionProductThumb: React.FC<GroceryProductThumbProps> = ({ name, category }) => {
  const lower = `${name} ${category}`.toLowerCase();

  // Ethnic / Kurta / Dress / Saree / Gown
  if (lower.includes("kurta") || lower.includes("ethnic") || lower.includes("saree") || lower.includes("dress") || lower.includes("lehenga") || lower.includes("chanderi")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-rose-50 border-rose-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <path d="M15 9 L20 13 L25 9 L29 14 L26 17 L29 33 H11 L14 17 L11 14 Z" fill="#9d174d" />
          <path d="M17 11 L20 15 L23 11" stroke="#fbcfe8" strokeWidth="1.5" fill="none" />
          <path d="M15 27 H25" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Denim / Trousers / Jeans
  if (lower.includes("denim") || lower.includes("jean") || lower.includes("trouser") || lower.includes("pant")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-indigo-50 border-indigo-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <path d="M12 9 H28 L29 33 H22 L20 20 L18 33 H11 Z" fill="#1e3a8a" />
          <path d="M12 13 H28" stroke="#93c5fd" strokeWidth="1.4" />
          <circle cx="20" cy="11" r="1" fill="#fbbf24" />
        </svg>
      </div>
    );
  }

  // Footwear / Bags / Tote / Clutch
  if (lower.includes("bag") || lower.includes("tote") || lower.includes("clutch") || lower.includes("shoe") || lower.includes("footwear") || lower.includes("heel")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-amber-50 border-amber-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <path d="M15 15 C15 9, 25 9, 25 15" stroke="#92400e" strokeWidth="2.2" fill="none" />
          <rect x="9" y="15" width="22" height="17" rx="3.5" fill="#b45309" />
          <rect x="13" y="20" width="14" height="3" rx="1" fill="#fde68a" />
        </svg>
      </div>
    );
  }

  // Tailoring / Alteration / Stitching
  if (lower.includes("tailor") || lower.includes("alter") || lower.includes("hem") || lower.includes("stitch")) {
    return (
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-fuchsia-50 border-fuchsia-200">
        <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
          <circle cx="14" cy="27" r="4" fill="none" stroke="#86198f" strokeWidth="2.2" />
          <circle cx="26" cy="27" r="4" fill="none" stroke="#86198f" strokeWidth="2.2" />
          <path d="M16.5 24 L26 10 M23.5 24 L14 10" stroke="#a21caf" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Shirts / Kids / Default Apparel
  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-pink-50 border-pink-200">
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <path d="M14 9 L20 12 L26 9 L32 14 L29 19 L26 17 V32 H14 V17 L11 19 L8 14 Z" fill="#be185d" />
        <path d="M16 9 L20 14 L24 9" stroke="#fce7f3" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="19" r="1" fill="#fce7f3" />
        <circle cx="20" cy="24" r="1" fill="#fce7f3" />
      </svg>
    </div>
  );
};




