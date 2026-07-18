/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Layers,
  ShoppingBag,
  Users,
  TrendingUp,
  Store,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  User,
  Coffee,
  Database,
  Printer,
  FileText,
  Clock,
  Briefcase,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Sparkles,
  CreditCard,
  DollarSign,
  Tag,
  Percent,
  PlusCircle,
  Edit2,
  Info,
  Lock,
  LogOut,
  Unlock,
  Key,
  Copy,
  Check,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  ShieldAlert,
  Settings,
  Upload,
  Download,
  Smartphone,
  Cloud,
  Headphones,
  HelpCircle,
  Folder
} from "lucide-react";

import {
  Product,
  Supplier,
  Customer,
  Invoice,
  InvoiceItem,
  StoreBranch,
  Expense,
  CashSession,
  StockAdjustment,
  PaymentMode,
  UserRole,
  MeasurementUnit,
  Tenant,
  StockTransfer,
  printElementById,
  saveElementAsPDF
} from "./types";

import SmartCopilot from "./components/SmartCopilot";
import SuperAdminConsole from "./components/SuperAdminConsole";
import StaffRegistry from "./components/StaffRegistry";
import SettingsPanel from "./components/SettingsPanel";
import { ExpertAidLogo } from "./components/ExpertAidLogo";

const PRESET_TENANTS: Tenant[] = [
  {
    id: "TENANT-001",
    name: "Expert POS Retail Hub",
    subdomain: "hub",
    adminEmail: "admin@expertpos.com",
    phone: "+91 9988776655",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2026-01-10T08:00:00Z",
    colorTheme: "emerald",
    maxBranches: 10,
    maxProducts: 250,
    onboardingFeePaid: 150000,
    monthlySubscriptionFee: 4500,
    billingCycle: "MONTHLY",
    lastPaymentAmount: 4500,
    lastPaymentDate: "2026-05-10",
    subscriptionStartDate: "2026-01-10",
    subscriptionEndDate: "2027-01-10",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["Heavy Duty Cash Drawer", "Bluetooth Barcode Scanner", "80mm Thermal Printer"],
    onboardingNotes: "Initial sandbox isolation slice provisioned and physical hardware package dispatched.",
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07AAAAA1111A1Z1"
  },
  {
    id: "TENANT-002",
    name: "Tech Solutions Pvt. Ltd.",
    subdomain: "techsolutions",
    adminEmail: "info@techsolutions.com",
    phone: "+91 9811223344",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2024-05-20T10:00:00Z",
    colorTheme: "indigo",
    maxBranches: 5,
    maxProducts: 100,
    onboardingFeePaid: 75000,
    monthlySubscriptionFee: 4500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-20",
    subscriptionEndDate: "2025-05-20",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["Heavy Duty Cash Drawer", "80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07EXPAID2026A1Z1"
  },
  {
    id: "TENANT-003",
    name: "ABC Retailers",
    subdomain: "abcretailers",
    adminEmail: "contact@abcretailers.com",
    phone: "+91 9822334455",
    currency: "₹",
    tier: "GROWTH",
    status: "ACTIVE",
    createdAt: "2024-05-18T11:00:00Z",
    colorTheme: "amber",
    maxBranches: 3,
    maxProducts: 50,
    onboardingFeePaid: 45000,
    monthlySubscriptionFee: 2500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-18",
    subscriptionEndDate: "2025-05-18",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07ABCRE1818B2Y2"
  },
  {
    id: "TENANT-004",
    name: "Global Enterprises",
    subdomain: "globalenterprises",
    adminEmail: "hello@globalenterprises.com",
    phone: "+91 9833445566",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2024-05-15T09:30:00Z",
    colorTheme: "rose",
    maxBranches: 8,
    maxProducts: 200,
    onboardingFeePaid: 120000,
    monthlySubscriptionFee: 4500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-15",
    subscriptionEndDate: "2025-05-15",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["Heavy Duty Cash Drawer", "Bluetooth Barcode Scanner", "80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07GLOBA1515C3X3"
  },
  {
    id: "TENANT-005",
    name: "Smart Infotech",
    subdomain: "smartinfotech",
    adminEmail: "support@smartinfotech.com",
    phone: "+91 9844556677",
    currency: "₹",
    tier: "STARTER",
    status: "TRIAL",
    createdAt: "2024-05-12T14:15:00Z",
    colorTheme: "violet",
    maxBranches: 1,
    maxProducts: 20,
    onboardingFeePaid: 25000,
    monthlySubscriptionFee: 1200,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-12",
    subscriptionEndDate: "2024-11-12",
    contractDurationMonths: 6,
    renewalStatus: "MANUAL",
    onboardingSetupStatus: "SYSTEM_PROVISIONED",
    hardwareProvisioned: [],
    clientVerificationStatus: "PENDING_KYC",
    gstinRegNumber: "PENDING"
  },
  {
    id: "TENANT-006",
    name: "Digital World",
    subdomain: "digitalworld",
    adminEmail: "info@digitalworld.com",
    phone: "+91 9855667788",
    currency: "₹",
    tier: "GROWTH",
    status: "ACTIVE",
    createdAt: "2024-05-10T16:00:00Z",
    colorTheme: "emerald",
    maxBranches: 3,
    maxProducts: 50,
    onboardingFeePaid: 50000,
    monthlySubscriptionFee: 2500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-10",
    subscriptionEndDate: "2025-05-10",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07DIGIT1010D4W4"
  },
  {
    id: "TENANT-007",
    name: "Innovateech Systems",
    subdomain: "innovateech",
    adminEmail: "innovateech@gmail.com",
    phone: "+91 9866778899",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2024-05-21T08:00:00Z",
    colorTheme: "indigo",
    maxBranches: 5,
    maxProducts: 100,
    onboardingFeePaid: 80000,
    monthlySubscriptionFee: 4500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-21",
    subscriptionEndDate: "2025-05-21",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["Heavy Duty Cash Drawer", "80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07INNOV2121E5V5"
  },
  {
    id: "TENANT-008",
    name: "Shree Traders",
    subdomain: "shreetraders",
    adminEmail: "shreetraders@gmail.com",
    phone: "+91 9877889900",
    currency: "₹",
    tier: "GROWTH",
    status: "ACTIVE",
    createdAt: "2024-05-20T14:00:00Z",
    colorTheme: "amber",
    maxBranches: 3,
    maxProducts: 50,
    onboardingFeePaid: 45000,
    monthlySubscriptionFee: 2500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-20",
    subscriptionEndDate: "2025-05-20",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07SHREE2020F6U6"
  },
  {
    id: "TENANT-009",
    name: "Prime Solutions",
    subdomain: "primesolutions",
    adminEmail: "primesolutions@gmail.com",
    phone: "+91 9888990011",
    currency: "₹",
    tier: "STARTER",
    status: "ACTIVE",
    createdAt: "2024-05-19T10:00:00Z",
    colorTheme: "rose",
    maxBranches: 1,
    maxProducts: 20,
    onboardingFeePaid: 25000,
    monthlySubscriptionFee: 1200,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-19",
    subscriptionEndDate: "2024-11-19",
    contractDurationMonths: 6,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: [],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07PRIME1919G7T7"
  }
];

const LOGIN_BG_CONFIGS: Record<string, {
  name: string;
  outerBg: string;
  innerBg: string;
  isDark: boolean;
  themeColor: string;
  btnAccent: string;
  glows: string[];
}> = {
  "cosmic-aurora": {
    name: "Cosmic Aurora ✨",
    outerBg: "bg-gradient-to-br from-[#1e1b4b] via-[#311042] to-[#081c3b]",
    innerBg: "bg-[#170e28]/85 border-violet-500/20 shadow-violet-500/10",
    isDark: true,
    themeColor: "text-violet-400",
    btnAccent: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20",
    glows: [
      "absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-pink-500/15 rounded-full blur-[120px] animate-pulse pointer-events-none",
      "absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none",
      "absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"
    ]
  },
  "sunset-dream": {
    name: "Sunset Dream 🌅",
    outerBg: "bg-gradient-to-br from-[#fdba74] via-[#f87171] to-[#c084fc]",
    innerBg: "bg-white/95 border-orange-200/50 shadow-orange-500/5",
    isDark: false,
    themeColor: "text-orange-600",
    btnAccent: "bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white shadow-lg shadow-orange-500/20",
    glows: [
      "absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-400/20 rounded-full blur-[100px] pointer-events-none",
      "absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-300/25 rounded-full blur-[90px] pointer-events-none"
    ]
  },
  "neon-cyberpunk": {
    name: "Neon Cyberpunk 👾",
    outerBg: "bg-gradient-to-br from-[#020617] via-[#0b1329] to-[#1e1b4b]",
    innerBg: "bg-[#090d16]/90 border border-teal-500/30 shadow-2xl shadow-teal-500/10",
    isDark: true,
    themeColor: "text-cyan-400",
    btnAccent: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20",
    glows: [
      "absolute top-[-20%] left-[10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none",
      "absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-500/15 rounded-full blur-[100px] pointer-events-none"
    ]
  },
  "mint-refresh": {
    name: "Mint Refresh 🍃",
    outerBg: "bg-gradient-to-br from-[#a7f3d0] via-[#34d399] to-[#06b6d4]",
    innerBg: "bg-white/95 border-emerald-100 shadow-emerald-500/5",
    isDark: false,
    themeColor: "text-emerald-600",
    btnAccent: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20",
    glows: [
      "absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-teal-300/15 rounded-full blur-[100px] pointer-events-none",
      "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lime-300/15 rounded-full blur-[90px] pointer-events-none"
    ]
  },
  "classic-blue": {
    name: "Classic Slate 🏢",
    outerBg: "bg-gradient-to-br from-[#d4e2ff] to-[#eef2f9]",
    innerBg: "bg-gradient-to-tr from-[#d3e3fd]/90 via-[#e8f0fe]/90 to-[#f4f8ff]/95 border-white/60 shadow-blue-500/5",
    isDark: false,
    themeColor: "text-blue-600",
    btnAccent: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
    glows: [
      "absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-300/15 rounded-full blur-3xl pointer-events-none",
      "absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-300/10 rounded-full blur-3xl pointer-events-none"
    ]
  }
};

const PRESET_CREDENTIALS = [
  {
    role: UserRole.ADMIN,
    title: "Super Admin Master Controls",
    email: "superadmin@expertpos.com",
    password: "SuperAdminMasterKey2026",
    name: "System Sovereign (Super Admin)",
    color: "violet",
    gradient: "from-purple-500 to-indigo-600",
    bgHover: "hover:bg-purple-500/5",
    accent: "text-purple-400",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/10",
    description: "Sovereign master access credentials for cross-border tenancy. Provision corporate clients, customize database slices, switch live active workspaces, and monitor overall SaaS subscriptions.",
    privileges: ["Cross-tenant onboarding", "Global subscription audit", "Database isolation scaling", "Bypassing branch ceilings", "Modify workspace context"],
    phone: "+91 9900112233"
  },
  {
    role: UserRole.ADMIN,
    title: "Admin Full Control",
    email: "admin@expertpos.com",
    password: "AdminOverrideX99",
    name: "John Doe (Admin)",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    bgHover: "hover:bg-emerald-500/5",
    accent: "text-emerald-500",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
    description: "Full master key to POS checkout, financial ledgers, inventory catalogue, CRM, expense logs, and AI Copilot.",
    privileges: ["POS Sandbox access", "Audit profit & tax ledgers", "Modify products/suppliers", "Administer loyalty points", "Direct DB sync states"],
    phone: "+91 9911223344"
  },
  {
    role: UserRole.MANAGER,
    title: "Manager Reports & Stock",
    email: "manager@expertpos.com",
    password: "ManagerProfit77",
    name: "Alice Manager",
    color: "indigo",
    gradient: "from-indigo-500 to-violet-600",
    bgHover: "hover:bg-indigo-500/5",
    accent: "text-indigo-400",
    border: "border-indigo-500/20",
    glow: "shadow-indigo-500/10",
    description: "Manage physical store health, reconcile stock adjustment ledgers, approve utility expenses, and review reports.",
    privileges: ["Analytics dashboard view", "Adjust and count stock", "Log utility & operating expenses", "Review cash drawers & logs"],
    storeBranchId: "B1",
    phone: "+91 9922334455"
  },
  {
    role: UserRole.CASHIER,
    title: "Cashier Billing Only",
    email: "cashier@expertpos.com",
    password: "CashierBilling101",
    name: "John Cashier",
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    bgHover: "hover:bg-amber-500/5",
    accent: "text-amber-400",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/10",
    description: "Primary front-line role. Focuses on retail scanning, customer checkout flow, processing payments, and coupons.",
    privileges: ["POS checkout scanning", "Configure item quantities", "Associate loyalty members", "UPI, Cash, or Card prints"],
    storeBranchId: "B1",
    phone: "+91 9933445566"
  },
  {
    role: UserRole.STORE_KEEPER,
    title: "Store Keeper Inventory Management",
    email: "storekeeper@expertpos.com",
    password: "StoreKeeperReconcile26",
    name: "Devin Stocker",
    color: "rose",
    gradient: "from-rose-500 to-pink-600",
    bgHover: "hover:bg-rose-500/5",
    accent: "text-rose-400",
    border: "border-rose-500/20",
    glow: "shadow-rose-500/10",
    description: "Track warehouse levels, inspect batch codes, monitor nearing expiry warnings, and align supplier rosters.",
    privileges: ["Inventory levels inspection", "Filter categories & alert status", "Register new supplier entries", "Expiry count audits"],
    storeBranchId: "B2",
    phone: "+91 9944556677"
  }
];

function playThermalPrintSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Create oscillator for whirring sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sawtooth";
    // Pitch modulations to sound like a stepper motor
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(380, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.2);
    osc.frequency.setValueAtTime(340, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(390, ctx.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(310, ctx.currentTime + 0.7);
    osc.frequency.setValueAtTime(350, ctx.currentTime + 0.8);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 1.1);
    
    // Tremolo/vibrato for motor vibration
    const tremolo = ctx.createOscillator();
    const tremoloGain = ctx.createGain();
    tremolo.frequency.value = 50; // 50 Hz vibration
    tremoloGain.gain.value = 15;
    tremolo.connect(tremoloGain);
    tremoloGain.connect(osc.frequency);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    tremolo.start();
    osc.start();
    
    tremolo.stop(ctx.currentTime + 1.2);
    osc.stop(ctx.currentTime + 1.2);
    
    // Play a paper tear click at the end!
    setTimeout(() => {
      const clickNoise = ctx.createBufferSource();
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      clickNoise.buffer = buffer;
      const clickFilter = ctx.createBiquadFilter();
      clickFilter.type = "bandpass";
      clickFilter.frequency.value = 1000;
      
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.15, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      
      clickNoise.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickNoise.start();
    }, 1150);
  } catch (e) {
    console.warn("Web Audio API not supported or blocked by user gesture:", e);
  }
}

export default function App() {
  // State from server DB
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [branches, setBranches] = useState<StoreBranch[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [cashSessions, setCashSessions] = useState<CashSession[]>([]);

  // Dynamic product categories management state
  const [productCategories, setProductCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("expert_aid_product_categories");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved product categories:", e);
      }
    }
    const defaults = [
      "Fresh Fruits & Vegetables",
      "Dairy & Eggs",
      "Grains & Grocery",
      "Beverages",
      "Snacks & Sweets",
      "Household"
    ];
    localStorage.setItem("expert_aid_product_categories", JSON.stringify(defaults));
    return defaults;
  });

  // Multi-tenant client onboarding states
  const [tenantsList, setTenantsList] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem("expert_aid_tenants");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let migrated = false;
          const updated = parsed.map((t: any) => {
            let name = t.name || "";
            if (name.includes("ExpertAid") || name.includes("Expertaid") || name.includes("Expert-Aid")) {
              migrated = true;
              name = name.replace(/ExpertAid/g, "Expert POS")
                         .replace(/Expertaid/g, "Expert POS")
                         .replace(/Expert-Aid/g, "Expert POS");
            }
            return { ...t, name };
          });
          if (migrated) {
            localStorage.setItem("expert_aid_tenants", JSON.stringify(updated));
            return updated;
          }
          return parsed;
        }
      } catch (e) {
        console.error("Failed to restore tenants database:", e);
      }
    }
    localStorage.setItem("expert_aid_tenants", JSON.stringify(PRESET_TENANTS));
    return PRESET_TENANTS;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return localStorage.getItem("expert_aid_active_tenant_id") || "TENANT-001";
  });

  const activeTenant = tenantsList.find(t => t.id === activeTenantId) || tenantsList[0] || PRESET_TENANTS[0];

  const tenantProducts = products.filter(p => !p.tenantId || p.tenantId === activeTenantId);

  // Map tenants color theme dynamically
  const getThemeColorClasses = (theme: string) => {
    switch (theme) {
      case "indigo": // Elegant Royal Navy Blue
        return {
          bg: "bg-[#1E2E3D]",
          bgHover: "hover:bg-[#131F2A]",
          bgLight: "bg-[#FAF8F5]",
          bgLightTransparent: "bg-[#1E2E3D]/8",
          text: "text-[#1E2E3D]",
          textAccent: "text-[#2B4257]",
          textAccentDark: "text-[#101921]",
          hoverBg: "hover:bg-[#1E2E3D]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#1E2E3D] border border-stone-400/80"
        };
      case "amber": // Rich Antique Gold / Ochre
        return {
          bg: "bg-[#B0893E]",
          bgHover: "hover:bg-[#916E2E]",
          bgLight: "bg-[#FDFBF7]",
          bgLightTransparent: "bg-[#B0893E]/8",
          text: "text-[#8C641B]",
          textAccent: "text-[#B0893E]",
          textAccentDark: "text-[#6B4E14]",
          hoverBg: "hover:bg-[#B0893E]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#8C641B] border border-stone-400/80"
        };
      case "rose": // Deep Vintage Burgundy / Crimson
        return {
          bg: "bg-[#7A2B37]",
          bgHover: "hover:bg-[#5C1E26]",
          bgLight: "bg-[#FDFBF8]",
          bgLightTransparent: "bg-[#7A2B37]/8",
          text: "text-[#7A2B37]",
          textAccent: "text-[#9E3E4C]",
          textAccentDark: "text-[#4A161E]",
          hoverBg: "hover:bg-[#7A2B37]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#7A2B37] border border-stone-400/80"
        };
      case "violet": // Classic Royal Plum / Velvet
        return {
          bg: "bg-[#4E365E]",
          bgHover: "hover:bg-[#392647]",
          bgLight: "bg-[#FAF7F2]",
          bgLightTransparent: "bg-[#4E365E]/8",
          text: "text-[#4E365E]",
          textAccent: "text-[#6B4982]",
          textAccentDark: "text-[#2D1E38]",
          hoverBg: "hover:bg-[#4E365E]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#4E365E] border border-stone-400/80"
        };
      default: // Deep Forest Heritage Green (default)
        return {
          bg: "bg-[#1E4D3E]",
          bgHover: "hover:bg-[#12362B]",
          bgLight: "bg-[#F6F5F0]",
          bgLightTransparent: "bg-[#1E4D3E]/8",
          text: "text-[#1E4D3E]",
          textAccent: "text-[#286450]",
          textAccentDark: "text-[#0F2D23]",
          hoverBg: "hover:bg-[#1E4D3E]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#1E4D3E] border border-stone-400/50"
        };
    }
  };

  const [attractiveMode, setAttractiveMode] = useState<"mint" | "cosmic" | "cream" | "velvet" | "sunset" | "oceanic" | "cyberpunk" | "nordic" | "espresso" | "aura">(() => {
    return (localStorage.getItem("expert_aid_attractive_mode") as any) || "mint";
  });

  const getAttractiveBgClasses = (mode: string) => {
    switch (mode) {
      case "cosmic": // Midnight Cyberpunk / Cosmic Mode (Dark)
        return {
          rootBg: "bg-[#090D16]",
          contentBg: "bg-[#0F172A]",
          sidebarBg: "bg-[#090D16] border-[#1E293B]",
          cardBg: "bg-[#1E293B]/80 border-[#334155] text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xs",
          headerBg: "bg-[#0F172A] border-[#1E293B] text-slate-100",
          text: "text-slate-300",
          textMuted: "text-slate-500",
          textHeading: "text-slate-100",
          badgeBg: "bg-[#334155] border-[#475569] text-slate-300",
          badgeText: "text-slate-300",
          inputBg: "bg-[#0F172A] border-[#334155] text-slate-100 focus:bg-[#1E293B]",
          border: "border-[#1E293B]",
          borderAccent: "border-[#334155]",
          innerCard: "bg-[#0F172A]/70 border-[#334155] text-slate-200"
        };
      case "oceanic": // Deep Oceanic Abyssal Blue (Dark)
        return {
          rootBg: "bg-[#0B151F]",
          contentBg: "bg-[#101E2E]",
          sidebarBg: "bg-[#0B151F] border-[#1B324B]",
          cardBg: "bg-[#162A3F]/85 border-[#234364] text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
          headerBg: "bg-[#101E2E] border-[#1B324B] text-slate-100",
          text: "text-teal-100/90",
          textMuted: "text-slate-400",
          textHeading: "text-white",
          badgeBg: "bg-[#234364] border-[#2C557E] text-teal-300",
          badgeText: "text-teal-200",
          inputBg: "bg-[#101E2E] border-[#234364] text-white focus:bg-[#162A3F]",
          border: "border-[#1B324B]",
          borderAccent: "border-[#234364]",
          innerCard: "bg-[#101E2E]/80 border-[#234364] text-slate-200"
        };
      case "cyberpunk": // Cyberpunk Charcoal Dark with High-contrast Neon Amber (Dark)
        return {
          rootBg: "bg-[#0C0C0E]",
          contentBg: "bg-[#121214]",
          sidebarBg: "bg-[#0C0C0E] border-[#222226]",
          cardBg: "bg-[#1A1A1E] border-[#2A2A32] text-amber-100 shadow-[0_4px_16px_rgba(245,158,11,0.05)]",
          headerBg: "bg-[#121214] border-[#222226] text-amber-500",
          text: "text-slate-300",
          textMuted: "text-slate-500",
          textHeading: "text-amber-500",
          badgeBg: "bg-[#2A2A32] border-[#3A3A46] text-amber-400",
          badgeText: "text-amber-400",
          inputBg: "bg-[#121214] border-[#2A2A32] text-amber-100 focus:bg-[#1A1A1E]",
          border: "border-[#222226]",
          borderAccent: "border-[#2A2A32]",
          innerCard: "bg-[#121214]/80 border-[#2A2A32] text-amber-100/90"
        };
      case "nordic": // Nordic Sage Green (Light)
        return {
          rootBg: "bg-[#EFEFEE]",
          contentBg: "bg-[#F5F5F4]",
          sidebarBg: "bg-[#E5E5E3] border-[#D1D1CD]",
          cardBg: "bg-white border-[#D1D1CD] text-[#2F3E36] shadow-sm",
          headerBg: "bg-white border-[#D1D1CD] text-[#2F3E36]",
          text: "text-[#4F5D54]",
          textMuted: "text-[#829188]",
          textHeading: "text-[#2F3E36]",
          badgeBg: "bg-[#E5E5E3] border-[#D1D1CD] text-[#2F3E36]",
          badgeText: "text-[#2F3E36]",
          inputBg: "bg-[#F5F5F4] border-[#D1D1CD] text-[#2F3E36] focus:bg-white",
          border: "border-[#D1D1CD]",
          borderAccent: "border-[#C4C4C0]",
          innerCard: "bg-[#F5F5F4] border-[#D1D1CD] text-[#4F5D54]"
        };
      case "espresso": // Royal Chocolatier and Gold (Dark)
        return {
          rootBg: "bg-[#1A110E]",
          contentBg: "bg-[#231814]",
          sidebarBg: "bg-[#1A110E] border-[#362721]",
          cardBg: "bg-[#2E1E1A] border-[#44312A] text-amber-100 shadow-md",
          headerBg: "bg-[#231814] border-[#362721] text-amber-400",
          text: "text-[#D5C2BB]",
          textMuted: "text-[#8D766E]",
          textHeading: "text-amber-200",
          badgeBg: "bg-[#44312A] border-[#553E35] text-amber-300",
          badgeText: "text-amber-200",
          inputBg: "bg-[#231814] border-[#44312A] text-amber-100 focus:bg-[#2E1E1A]",
          border: "border-[#362721]",
          borderAccent: "border-[#44312A]",
          innerCard: "bg-[#231814]/80 border-[#44312A] text-[#D5C2BB]"
        };
      case "aura": // Aura Twilight Purple & Lavender Dream (Light)
        return {
          rootBg: "bg-[#FAF9FF]",
          contentBg: "bg-[#F3F1FE]",
          sidebarBg: "bg-[#E8E4FD] border-[#D6CFF9]",
          cardBg: "bg-white border-[#D6CFF9] text-[#2A1B6A] shadow-md",
          headerBg: "bg-white border-[#D6CFF9] text-[#2A1B6A]",
          text: "text-[#4D3F9B]",
          textMuted: "text-[#8B7EC8]",
          textHeading: "text-[#2A1B6A]",
          badgeBg: "bg-[#E8E4FD] border-[#D6CFF9] text-[#4D3F9B]",
          badgeText: "text-[#4D3F9B]",
          inputBg: "bg-[#FAF9FF] border-[#D6CFF9] text-[#2A1B6A] focus:bg-white",
          border: "border-[#D6CFF9]",
          borderAccent: "border-[#C5BCF6]",
          innerCard: "bg-[#F3F1FE] border-[#D6CFF9] text-[#4D3F9B]"
        };
      case "cream": // Warm Vintage Buttermilk / Champagne Cream (Light)
        return {
          rootBg: "bg-[#FAF5F0]",
          contentBg: "bg-[#FAF5F0]",
          sidebarBg: "bg-[#F3EAE3] border-[#E6D4C5]",
          cardBg: "bg-white border-[#E6D4C5] text-[#3E2723] shadow-md",
          headerBg: "bg-white border-[#E6D4C5] text-[#3E2723]",
          text: "text-[#5D4037]",
          textMuted: "text-[#8D6E63]",
          textHeading: "text-[#3E2723]",
          badgeBg: "bg-[#F3EAE3] border-[#E6D4C5] text-[#5D4037]",
          badgeText: "text-[#5D4037]",
          inputBg: "bg-[#FAF5F0] border-[#E6D4C5] text-[#3E2723] focus:bg-white",
          border: "border-[#E6D4C5]",
          borderAccent: "border-[#D7CCC8]",
          innerCard: "bg-[#FAF5F0] border-[#E6D4C5] text-[#5D4037]"
        };
      case "velvet": // Majestic Royal Velvet Plum / Elderberry (Dark Mode with Luxury Purple glow)
        return {
          rootBg: "bg-[#130919]",
          contentBg: "bg-[#1A0E23]",
          sidebarBg: "bg-[#130919] border-[#2D163F]",
          cardBg: "bg-[#251533]/80 border-[#3D1E58] text-purple-100 shadow-xl backdrop-blur-xs",
          headerBg: "bg-[#1A0E23] border-[#2D163F] text-purple-100",
          text: "text-purple-300",
          textMuted: "text-purple-500",
          textHeading: "text-purple-100",
          badgeBg: "bg-[#3D1E58] border-[#4E2472] text-purple-200",
          badgeText: "text-purple-200",
          inputBg: "bg-[#1A0E23] border-[#3D1E58] text-purple-100 focus:bg-[#251533]",
          border: "border-[#2D163F]",
          borderAccent: "border-[#3D1E58]",
          innerCard: "bg-[#1A0E23]/60 border-[#3D1E58] text-purple-200"
        };
      case "sunset": // Rose Gold Sunset / Blush Champagne (Sleek Warm)
        return {
          rootBg: "bg-[#FFF6F6]",
          contentBg: "bg-[#FFF9F9]",
          sidebarBg: "bg-[#FFEBEB] border-[#FFD3D3]",
          cardBg: "bg-white border-[#FFD3D3] text-[#4A2E2E] shadow-md",
          headerBg: "bg-white border-[#FFD3D3] text-[#4A2E2E]",
          text: "text-[#7A4B4B]",
          textMuted: "text-[#A87E7E]",
          textHeading: "text-[#4A2E2E]",
          badgeBg: "bg-[#FFEBEB] border-[#FFD3D3] text-[#7A4B4B]",
          badgeText: "text-[#7A4B4B]",
          inputBg: "bg-[#FFF6F6] border-[#FFD3D3] text-[#4A2E2E] focus:bg-white",
          border: "border-[#FFD3D3]",
          borderAccent: "border-[#FFC2C2]",
          innerCard: "bg-[#FFF9F9] border-[#FFD3D3] text-[#7A4B4B]"
        };
      case "mint": // Classic Clean / Soft Mint Green
      default:
        return {
          rootBg: "bg-slate-50",
          contentBg: "bg-slate-50",
          sidebarBg: "bg-slate-50 border-slate-200",
          cardBg: "bg-white border-slate-200 text-slate-800 shadow-sm",
          headerBg: "bg-white border-slate-200 text-slate-800",
          text: "text-slate-600",
          textMuted: "text-slate-400",
          textHeading: "text-slate-800",
          badgeBg: "bg-slate-100 border-slate-200 text-slate-700",
          badgeText: "text-slate-700",
          inputBg: "bg-slate-100 border-transparent text-slate-800 focus:bg-white focus:border-slate-300",
          border: "border-slate-200",
          borderAccent: "border-slate-300",
          innerCard: "bg-slate-50 border-slate-200 text-slate-700"
        };
    }
  };

  const bgMode = getAttractiveBgClasses(attractiveMode);

  const currentTheme = getThemeColorClasses(activeTenant.colorTheme);

  // User credentials state for RBAC management
  const [credentialsList, setCredentialsList] = useState<typeof PRESET_CREDENTIALS>(() => {
    const saved = localStorage.getItem("expert_aid_credentials");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore credentials directory:", e);
      }
    }
    return PRESET_CREDENTIALS;
  });

  // App UI Navigation states
  const [activeTab, setActiveTab] = useState<string>("pos");
  const [currentBranch, setCurrentBranch] = useState<StoreBranch | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentCashierName, setCurrentCashierName] = useState<string>("John Doe");
  const [loadingState, setLoadingState] = useState<boolean>(true);

  // User Authentication Portal States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [selectedLoginRole, setSelectedLoginRole] = useState<string>("admin");
  const [loginUserId, setLoginUserId] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showQuickFill, setShowQuickFill] = useState<boolean>(false);
  const [otpMode, setOtpMode] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginBgMode, setLoginBgMode] = useState<string>(() => {
    return localStorage.getItem("expert_pos_login_bg_mode") || "cosmic-aurora";
  });

  const isSuperAdmin = currentUserEmail.toLowerCase() === "superadmin@expertpos.com" && currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super");

  // Active POS cart states
  const [cartItems, setCartItems] = useState<InvoiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [barcodeSearch, setBarcodeSearch] = useState<string>("");
  const [inventorySearchQuery, setInventorySearchQuery] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [billingCustomerName, setBillingCustomerName] = useState<string>("");
  const [billingCustomerPhone, setBillingCustomerPhone] = useState<string>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.UPI);
  const [cashReceived, setCashReceived] = useState<string>("");
  
  // Dialog & Form states
  const [activeBarcodeUrl, setActiveBarcodeUrl] = useState<string | null>(null);
  const [showInvoicePrintPreview, setShowInvoicePrintPreview] = useState<Invoice | null>(null);
  const [selectedPrinterLayout, setSelectedPrinterLayout] = useState<"standard-a4" | "thermal-80mm" | "thermal-58mm">("thermal-80mm");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [reprintSearch, setReprintSearch] = useState<string>("");
  const [reprintShowAllBranches, setReprintShowAllBranches] = useState<boolean>(false);
  const [selectedReprintInvoiceId, setSelectedReprintInvoiceId] = useState<string | null>(null);
  const [isVirtualPrinting, setIsVirtualPrinting] = useState<boolean>(false);
  const [virtualPrintDone, setVirtualPrintDone] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Forms states
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    barcode: "",
    category: "Grains & Grocery",
    sku: "",
    purchasePrice: 0,
    price: 0,
    gstRate: 18,
    unit: MeasurementUnit.PIECE,
    stock: 50,
    minStockAlert: 10,
    batchNumber: "B-2026-X",
    expiryDate: "2027-12-31",
    supplierName: ""
  });

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    email: "",
    creditBalance: 0,
    loyaltyPoints: 0
  });

  const [newTransferForm, setNewTransferForm] = useState({
    productId: "",
    fromBranchId: "",
    toBranchId: "",
    quantity: 1,
    remarks: ""
  });

  // Bulk upload of Products states
  const [bulkInputText, setBulkInputText] = useState<string>("");
  const [bulkParsedProducts, setBulkParsedProducts] = useState<any[]>([]);
  const [bulkUploadTab, setBulkUploadTab] = useState<"file" | "paste">("file");
  const [bulkIsDragging, setBulkIsDragging] = useState<boolean>(false);
  const [bulkUploadError, setBulkUploadError] = useState<string | null>(null);

  // Secure iFrame safe deletion confirmation state
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: "Utility (Electricity)",
    amount: 0,
    description: "",
    approvedBy: "Manager"
  });

  const [stockAdjustmentForm, setStockAdjustmentForm] = useState({
    productId: "",
    newStock: 0,
    reason: ""
  });

  // Cash Session State
  const [activeSession, setActiveSession] = useState<CashSession | null>(null);
  const [openingBalance, setOpeningBalance] = useState<number>(2000);
  const [actualCashDrawer, setActualCashDrawer] = useState<number>(0);

  // Notifications
  const [notifText, setNotifText] = useState<string | null>(null);
  const [notifType, setNotifType] = useState<"success" | "warning">("success");

  // Fetch initial state
  const loadState = async () => {
    try {
      setLoadingState(true);
      const res = await fetch("/api/state");
      const data = await res.json();
      if (data) {
        setProducts(data.products || []);
        setSuppliers(data.suppliers || []);
        setCustomers(data.customers || []);
        setInvoices(data.invoices || []);
        setBranches(data.branches || []);
        setExpenses(data.expenses || []);
        setAdjustments(data.adjustments || []);
        setTransfers(data.transfers || []);
        setCashSessions(data.cashSessions || []);
        
        if (data.branches && data.branches.length > 0) {
          setCurrentBranch(data.branches[0]);
        }
      }
    } catch (e) {
      console.error(e);
      triggerNotification("Failed to boot database state. Playing in self-restored fallback.", "warning");
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  // Dynamic URL-based tenant / client detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tenantParam = params.get("subdomain") || params.get("tenant") || params.get("client");
    const hashParam = window.location.hash.replace("#", "").trim();

    // Check potential hostname subdomain
    const hostParts = window.location.hostname.split(".");
    let hostSubdomain: string | null = null;
    if (hostParts.length > 2) {
      const first = hostParts[0].toLowerCase();
      if (!["www", "ais-dev", "ais-pre", "localhost"].includes(first)) {
        hostSubdomain = first;
      }
    }

    const searchKeys = [tenantParam, hashParam, hostSubdomain].filter(Boolean) as string[];
    if (searchKeys.length === 0) return;

    let matchedTenant: Tenant | undefined = undefined;
    for (const key of searchKeys) {
      const cleanKey = key.toLowerCase().trim();
      matchedTenant = tenantsList.find(
        (t) => t.subdomain.toLowerCase() === cleanKey || t.id.toLowerCase() === cleanKey
      );
      if (matchedTenant) break;
    }

    if (matchedTenant && matchedTenant.id !== activeTenantId) {
      setActiveTenantId(matchedTenant.id);
      localStorage.setItem("expert_aid_active_tenant_id", matchedTenant.id);
      triggerNotification(`Auto-configured client workspace to "${matchedTenant.name}" based on URL environment!`, "success");
    }
  }, [tenantsList, activeTenantId]);

  useEffect(() => {
    if (isLoggedIn) {
      const isSuperAdmin = currentUserEmail.toLowerCase() === "superadmin@expertpos.com" && currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super");
      if (isSuperAdmin) {
        const allowedTabs = ["super-admin", "staff-registry", "analytics"];
        if (!allowedTabs.includes(activeTab)) {
          setActiveTab("super-admin");
        }
      }
    }
  }, [isLoggedIn, currentUserEmail, currentRole, currentCashierName, activeTab]);

  const triggerNotification = (text: string, type: "success" | "warning" = "success") => {
    setNotifText(text);
    setNotifType(type);
    setTimeout(() => {
      setNotifText(null);
    }, 4500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const trimmedId = loginUserId.trim().toLowerCase();
    const trimmedPassword = loginPassword.trim();

    if (!trimmedId || !trimmedPassword) {
      setLoginError("Please enter both security identifier email and password.");
      return;
    }

    const match = credentialsList.find(
      (cred) => cred.email.toLowerCase() === trimmedId && cred.password === trimmedPassword
    );

    if (match) {
      setCurrentRole(match.role);
      setCurrentCashierName(match.name);
      setCurrentUserEmail(match.email);
      setIsLoggedIn(true);

      // Lock assigned branch if profile is tied to a specific outlet
      if (match.storeBranchId) {
        const branchMatch = branches.find((b) => b.id === match.storeBranchId);
        if (branchMatch) {
          setCurrentBranch(branchMatch);
          localStorage.setItem("expert_aid_current_branch", JSON.stringify(branchMatch));
        }
      }
      
      // Auto-route based on permissions
      if (match.email.toLowerCase() === "superadmin@expertpos.com") {
        setActiveTab("super-admin");
      } else if (match.role === UserRole.CASHIER) {
        setActiveTab("pos");
      } else if (match.role === UserRole.STORE_KEEPER) {
        setActiveTab("inventory");
      } else {
        setActiveTab("pos");
      }

      // Automatically detect and select the appropriate client company tenant workspace!
      if (trimmedId !== "superadmin@expertpos.com") {
        let tenantMatch = tenantsList.find(
          (t) => t.adminEmail.toLowerCase() === trimmedId
        );

        if (!tenantMatch) {
          tenantMatch = tenantsList.find((t) => {
            const domainParts = trimmedId.split("@");
            if (domainParts.length > 1) {
              const domain = domainParts[1];
              const emailPrefixOfDomain = domain.split(".")[0];
              return (
                emailPrefixOfDomain === t.subdomain.toLowerCase() ||
                domain.toLowerCase() === t.adminEmail.toLowerCase().split("@")[1]
              );
            }
            return false;
          });
        }

        if (!tenantMatch && match.title) {
          tenantMatch = tenantsList.find((t) => {
            return match.title.toLowerCase().includes(t.name.toLowerCase()) || 
                   match.title.toLowerCase().includes(t.subdomain.toLowerCase());
          });
        }

        if (tenantMatch) {
          setActiveTenantId(tenantMatch.id);
          localStorage.setItem("expert_aid_active_tenant_id", tenantMatch.id);
        }
      }

      triggerNotification(`Access Granted: Welcome back, ${match.name}!`, "success");
    } else {
      setLoginError("Access Denied: Invalid security credentials. Please double-check or click a quick-fill card.");
    }
  };

  const handleQuickLogin = (cred: typeof PRESET_CREDENTIALS[0]) => {
    setLoginUserId(cred.email);
    setLoginPassword(cred.password);
    setCurrentRole(cred.role);
    setCurrentCashierName(cred.name);
    setCurrentUserEmail(cred.email);
    setIsLoggedIn(true);

    if (cred.email.toLowerCase() === "superadmin@expertpos.com") {
      setActiveTab("super-admin");
    } else if (cred.role === UserRole.CASHIER) {
      setActiveTab("pos");
    } else if (cred.role === UserRole.STORE_KEEPER) {
      setActiveTab("inventory");
    } else {
      setActiveTab("pos");
    }

    // Automatically detect and select the appropriate client company tenant workspace!
    const trimmedId = cred.email.toLowerCase();
    if (trimmedId !== "superadmin@expertpos.com") {
      let tenantMatch = tenantsList.find(
        (t) => t.adminEmail.toLowerCase() === trimmedId
      );

      if (!tenantMatch) {
        tenantMatch = tenantsList.find((t) => {
          const domainParts = trimmedId.split("@");
          if (domainParts.length > 1) {
            const domain = domainParts[1];
            const emailPrefixOfDomain = domain.split(".")[0];
            return (
              emailPrefixOfDomain === t.subdomain.toLowerCase() ||
              domain.toLowerCase() === t.adminEmail.toLowerCase().split("@")[1]
            );
          }
          return false;
        });
      }

      if (tenantMatch) {
        setActiveTenantId(tenantMatch.id);
        localStorage.setItem("expert_aid_active_tenant_id", tenantMatch.id);
      }
    }

    triggerNotification(`Authorized System Unlock: Logged in as ${cred.title}!`, "success");
  };

  const handleImpersonateClient = (email: string) => {
    const match = credentialsList.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (match) {
      setCurrentRole(match.role);
      setCurrentCashierName(match.name);
      setCurrentUserEmail(match.email);
      setIsLoggedIn(true);

      // Find tenant match
      let tenantMatch = tenantsList.find(
        (t) => t.adminEmail.toLowerCase() === email.toLowerCase()
      );
      if (!tenantMatch) {
        tenantMatch = tenantsList.find((t) => {
          const domainParts = email.split("@");
          if (domainParts.length > 1) {
            const domain = domainParts[1];
            const emailPrefixOfDomain = domain.split(".")[0];
            return (
              emailPrefixOfDomain === t.subdomain.toLowerCase() ||
              domain.toLowerCase() === t.adminEmail.toLowerCase().split("@")[1]
            );
          }
          return false;
        });
      }
      if (!tenantMatch && match.title) {
        tenantMatch = tenantsList.find((t) => {
          return match.title.toLowerCase().includes(t.name.toLowerCase()) || 
                 match.title.toLowerCase().includes(t.subdomain.toLowerCase());
        });
      }
      if (tenantMatch) {
        setActiveTenantId(tenantMatch.id);
        localStorage.setItem("expert_aid_active_tenant_id", tenantMatch.id);
      }
      setActiveTab("pos");
      triggerNotification(`Access Granted: Logged in as ${match.name} (Admin)!`, "success");
    } else {
      triggerNotification("Access profile not found for this client.", "warning");
    }
  };

  const handleCopyText = async (text: string, key: string) => {
    let success = false;
    
    // 1. Try modern clipboard API if available
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.warn("Modern clipboard writeText rejected, falling back...", err);
      }
    }

    // 2. Clear fallback via creating a temporary textarea element
    if (!success) {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        // Position off-screen
        el.style.position = "absolute";
        el.style.left = "-9999px";
        el.style.top = "0";
        document.body.appendChild(el);
        
        // Save focus
        const activeEl = document.activeElement as HTMLElement;
        el.select();
        el.setSelectionRange(0, 99999); // Mobile compatibility
        
        const copied = document.execCommand("copy");
        document.body.removeChild(el);
        if (copied) {
          success = true;
        }
        
        if (activeEl && typeof activeEl.focus === "function") {
          activeEl.focus();
        }
      } catch (err) {
        console.error("Textarea absolute fallback copy failed:", err);
      }
    }

    if (success) {
      setCopiedKey(key);
      triggerNotification("Copied credential to clipboard!", "success");
      setTimeout(() => setCopiedKey(null), 1500);
    } else {
      triggerNotification("Copy failed. Please manually select the text below.", "warning");
    }
  };

  // Switch role restriction handling
  const checkAccess = (allowedList: UserRole[]) => {
    return allowedList.includes(currentRole);
  };

  // Add Item to POS Cart
  const handleAddToCart = (product: Product) => {
    const availStock = getProductStock(product);
    if (availStock <= 0) {
      triggerNotification(`Product ${product.name} is out of stock in this branch!`, "warning");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        // Check stock limitation
        if (existing.quantity >= availStock) {
          triggerNotification(`Only ${availStock} units available in this branch's inventory.`, "warning");
          return prev;
        }
        return prev.map((item) => {
          if (item.productId === product.id) {
            const nextQty = item.quantity + 1;
            const subtotal = nextQty * item.price;
            const gstAmount = Number(((subtotal * item.gstRate) / (100 + item.gstRate)).toFixed(2));
            return { ...item, quantity: nextQty, subtotal, gstAmount };
          }
          return item;
        });
      }

      // Add fresh
      const gstAmount = Number(((product.price * product.gstRate) / (100 + product.gstRate)).toFixed(2));
      const newItem: InvoiceItem = {
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        quantity: 1,
        unit: product.unit,
        gstRate: product.gstRate,
        gstAmount,
        subtotal: product.price
      };
      return [...prev, newItem];
    });
  };

  // Modify quantities inside Cart
  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    const prod = tenantProducts.find((p) => p.id === productId);
    if (!prod) return;

    const availStock = getProductStock(prod);

    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null; // removal handled next
            if (nextQty > availStock) {
              triggerNotification(`Cannot exceed available branch stock (${availStock}).`, "warning");
              return item;
            }
            const subtotal = nextQty * item.price;
            const gstAmount = Number(((subtotal * item.gstRate) / (100 + item.gstRate)).toFixed(2));
            return { ...item, quantity: nextQty, subtotal, gstAmount };
          }
          return item;
        })
        .filter(Boolean) as InvoiceItem[];
    });
  };

  // Remove directly from cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Barcode simulation handler
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeSearch.trim()) return;
    const match = tenantProducts.find(
      (p) => p.barcode === barcodeSearch.trim() || p.sku.toLowerCase() === barcodeSearch.trim().toLowerCase()
    );
    if (match) {
      handleAddToCart(match);
      triggerNotification(`Scanned successfully: ${match.name}`, "success");
      setBarcodeSearch("");
    } else {
      triggerNotification(`No active product found for barcode '${barcodeSearch}'`, "warning");
    }
  };

  // Calculate pricing
  const subTotalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const taxAmountOfCart = cartItems.reduce((acc, item) => acc + item.gstAmount, 0);
  const discountAmount = Number(((subTotalAmount * appliedDiscountPercent) / 100).toFixed(2));
  const grandTotalAmount = Math.max(0, subTotalAmount - discountAmount);

  // Handle coupon check
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME5") {
      setAppliedDiscountPercent(5);
      triggerNotification("5% discount coupon WELCOME5 applied!", "success");
    } else if (code === "FESTIVE10") {
      setAppliedDiscountPercent(10);
      triggerNotification("10% festival discount code FESTIVE10 applied!", "success");
    } else if (code === "BIGBUDGET") {
      setAppliedDiscountPercent(15);
      triggerNotification("VVIP Super budget code 15% discount applied!", "success");
    } else {
      triggerNotification("Invalid or expired coupon code. Try WELCOME5 or FESTIVE10.", "warning");
    }
  };

  // Complete checkout process
  const handlePOSCheckout = async () => {
    if (cartItems.length === 0) {
      triggerNotification("Your active billing cart is empty.", "warning");
      return;
    }

    // Role restrictions
    if (!checkAccess([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER])) {
      triggerNotification("Store Keepers do not have checkout permissions.", "warning");
      return;
    }

    const valCash = Number(cashReceived);
    if (paymentMode === PaymentMode.CASH && (isNaN(valCash) || valCash < grandTotalAmount)) {
      triggerNotification(`Insufficient cash amount specified. Total target is ₹${grandTotalAmount.toFixed(2)}`, "warning");
      return;
    }

    const changeReturned = paymentMode === PaymentMode.CASH ? valCash - grandTotalAmount : 0;
    
    const invoiceId = `EAS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(
      Math.floor(1000 + Math.random() * 9000)
    )}`;

    const newInvoice: Invoice = {
      id: invoiceId,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerId: selectedCustomer?.id || undefined,
      customerName: billingCustomerName.trim() || "Regular Customer/Loyalty Guest",
      customerPhone: billingCustomerPhone.trim() || undefined,
      items: cartItems,
      subtotal: subTotalAmount,
      taxAmount: taxAmountOfCart,
      discountPercent: appliedDiscountPercent,
      discountAmount,
      couponCode: couponCode ? couponCode : undefined,
      grandTotal: grandTotalAmount,
      paymentMode,
      cashReceived: paymentMode === PaymentMode.CASH ? valCash : undefined,
      changeReturned: paymentMode === PaymentMode.CASH ? changeReturned : undefined,
      cashierName: currentCashierName,
      storeBranchId: currentBranch?.id || "B1",
      status: "PAID"
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice)
      });
      const data = await res.json();
      if (data.success) {
        // Redraw lists
        setProducts(data.state.products);
        setInvoices(data.state.invoices);
        setCustomers(data.state.customers);
        
        // Show Thermal Receipt preview
        setShowInvoicePrintPreview(newInvoice);
        triggerNotification(`Invoice checkout generated successfully! Reference ID: ${invoiceId}`, "success");
        
        // Reset POS active cart
        setCartItems([]);
        setSelectedCustomer(null);
        setBillingCustomerName("");
        setBillingCustomerPhone("");
        setCouponCode("");
        setAppliedDiscountPercent(0);
        setCashReceived("");
      }
    } catch (e) {
      triggerNotification("Failed to finalize transaction on database.", "warning");
    }
  };

  // Change branch dropdown simulator
  const handleBranchChange = (branchId: string) => {
    const selected = branches.find((b) => b.id === branchId);
    if (selected) {
      setCurrentBranch(selected);
      triggerNotification(`Switched to active branch: ${selected.name}`, "success");
    }
  };

  // Create new Product
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku || !newProduct.barcode || !newProduct.price) {
      triggerNotification("Please fill in name, SKU, Barcode, and MRP Price fields.", "warning");
      return;
    }

    // Assign dynamic product ID
    const productPayload: Product = {
      id: newProduct.id || `PROD-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newProduct.name,
      barcode: newProduct.barcode,
      category: newProduct.category || "General",
      sku: newProduct.sku,
      purchasePrice: Number(newProduct.purchasePrice || 0),
      price: Number(newProduct.price || 0),
      gstRate: Number(newProduct.gstRate || 0),
      unit: newProduct.unit || MeasurementUnit.PIECE,
      stock: Number(newProduct.stock || 0),
      minStockAlert: Number(newProduct.minStockAlert || 5),
      batchNumber: newProduct.batchNumber || "B-NEW",
      expiryDate: newProduct.expiryDate || "2027-12-31",
      supplierName: newProduct.supplierName || "Apex Retail Supplies",
      tenantId: activeTenantId
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        triggerNotification(`Product '${productPayload.name}' saved successfully in master catalogue.`, "success");
        // Reset form
        setNewProduct({
          name: "",
          barcode: "",
          category: "Grains & Grocery",
          sku: "",
          purchasePrice: 0,
          price: 0,
          gstRate: 5,
          unit: MeasurementUnit.PIECE,
          stock: 45,
          minStockAlert: 10,
          batchNumber: `B-${String(new Date().getFullYear())}-A`,
          expiryDate: "2027-12-31",
          supplierName: "Apex Retail Supplies"
        });
      }
    } catch (err) {
      triggerNotification("Database connection failure creating product catalogue.", "warning");
    }
  };

  const handleResetProductForm = () => {
    setNewProduct({
      name: "",
      barcode: "",
      category: "Grains & Grocery",
      sku: "",
      purchasePrice: 0,
      price: 0,
      gstRate: 18,
      unit: MeasurementUnit.PIECE,
      stock: 50,
      minStockAlert: 10,
      batchNumber: "B-2026-X",
      expiryDate: "2027-12-31",
      supplierName: ""
    });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setProductToDelete({ id, name });
  };

  const handleDeleteProductConfirm = async () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        triggerNotification(`Product "${name}" deleted from catalogue database.`, "success");
        if (newProduct.id === id) {
          handleResetProductForm();
        }
      } else {
        triggerNotification("Failed to delete product.", "warning");
      }
    } catch (e) {
      triggerNotification("Error connecting to catalog database.", "warning");
    } finally {
      setProductToDelete(null);
    }
  };


  const parseCSVText = (text: string) => {
    try {
      setBulkUploadError(null);
      if (!text.trim()) {
        setBulkParsedProducts([]);
        return;
      }

      const lines: string[] = [];
      let currentLine = "";
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          inQuotes = !inQuotes;
          currentLine += char;
        } else if (char === '\n' && !inQuotes) {
          lines.push(currentLine);
          currentLine = "";
        } else if (char === '\r' && !inQuotes) {
          // ignore
        } else {
          currentLine += char;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }

      const filteredLines = lines.map(l => l.trim()).filter(l => l.length > 0);
      if (filteredLines.length < 1) {
        setBulkParsedProducts([]);
        return;
      }

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let cur = "";
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQ = !inQ;
          } else if (char === ',' && !inQ) {
            result.push(cur.trim());
            cur = "";
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      };

      const firstLineTokens = parseCSVLine(filteredLines[0]);
      const hasHeader = firstLineTokens.some(tok => 
        ["name", "sku", "barcode", "category", "price", "mrp", "cost"].includes(tok.toLowerCase().replace(/\s/g, ""))
      );

      let dataLines = filteredLines;
      let headers = ["name", "sku", "barcode", "category", "purchasePrice", "price", "gstRate", "unit", "stock", "minStockAlert", "batchNumber", "expiryDate", "supplierName"];

      if (hasHeader) {
        const csvHeaders = firstLineTokens.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
        headers = csvHeaders.map(h => {
          // Check longer/more specific words first to avoid false matches (e.g. "suppliername" has "name")
          if (h.includes("supplier") || h.includes("vendor")) return "supplierName";
          if (h === "sku" || h.includes("sku") || h.includes("itemcode")) return "sku";
          if (h === "name" || h === "productname" || h === "title" || h === "description" || h === "itemname") return "name";
          if (h.includes("name") && !h.includes("brand") && !h.includes("manufacturer")) return "name";
          if (h.includes("barcode") || h.includes("upc") || h.includes("ean")) return "barcode";
          if (h.includes("category")) return "category";
          if (h.includes("purchase") || h === "cost" || h.includes("cogs")) return "purchasePrice";
          if (h === "price" || h.includes("mrp") || h.includes("selling")) return "price";
          if (h.includes("gst") || h.includes("tax")) return "gstRate";
          if (h === "unit" || h.includes("unit")) return "unit";
          if (h.includes("stock") || h === "qty" || h.includes("quantity")) return "stock";
          if (h.includes("alert") || h.includes("min")) return "minStockAlert";
          if (h.includes("batch")) return "batchNumber";
          if (h.includes("expiry") || h.includes("date")) return "expiryDate";
          return "";
        });
        dataLines = filteredLines.slice(1);
      }

      const parsed: any[] = [];
      for (const line of dataLines) {
        const tokens = parseCSVLine(line);
        if (tokens.length === 0 || (tokens.length === 1 && !tokens[0])) continue;

        const p: any = {};
        headers.forEach((key, idx) => {
          if (!key) return;
          let val = tokens[idx] || "";
          if (["purchasePrice", "price", "gstRate", "stock", "minStockAlert"].includes(key)) {
            p[key] = Number(val) || 0;
          } else {
            if (key === "barcode" && /^\d+(\.\d+)?[eE]\+?\d+$/.test(val)) {
              try {
                const num = Number(val);
                if (!isNaN(num)) {
                  val = num.toFixed(0);
                }
              } catch (e) {}
            }
            p[key] = val;
          }
        });

        p.tenantId = activeTenantId;
        p.isValid = !!(p.name && p.sku);
        p.validationError = p.isValid ? null : "Name & SKU are strictly required.";
        parsed.push(p);
      }

      setBulkParsedProducts(parsed);
    } catch (e) {
      setBulkUploadError("Failed to parse CSV block. Please check format structure.");
      setBulkParsedProducts([]);
    }
  };

  const parseJSONText = (text: string) => {
    try {
      setBulkUploadError(null);
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setBulkUploadError("JSON must be a flat array of product objects.");
        setBulkParsedProducts([]);
        return;
      }
      const mapped = parsed.map(item => {
        const getVal = (aliases: string[], fallback: any = "") => {
          // 1. Try exact match first
          for (const alias of aliases) {
            const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, "");
            for (const key of Object.keys(item)) {
              const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
              if (cleanKey === cleanAlias) {
                return item[key];
              }
            }
          }
          // 2. Try partial match with exclusions (e.g., searching for "name" shouldn't match "suppliername" or "vendorname")
          for (const alias of aliases) {
            const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, "");
            for (const key of Object.keys(item)) {
              const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
              if (cleanAlias === "name" && (cleanKey.includes("supplier") || cleanKey.includes("vendor") || cleanKey.includes("brand") || cleanKey.includes("manufacturer"))) {
                continue;
              }
              if (cleanAlias.length >= 3 && cleanKey.includes(cleanAlias)) {
                return item[key];
              }
            }
          }
          return fallback;
        };

        const name = getVal(["name", "description", "title"]);
        const sku = getVal(["sku", "itemcode"]);
        const barcode = getVal(["barcode", "upc", "ean"]);
        const category = getVal(["category", "type"]);
        const purchasePrice = getVal(["purchasePrice", "cost", "cogs", "purchase"]);
        const price = getVal(["price", "mrp", "selling"]);
        const gstRate = getVal(["gstRate", "tax", "gst"]);
        const unit = getVal(["unit", "measurement"]);
        const stock = getVal(["stock", "qty", "quantity"]);
        const minStockAlert = getVal(["minStockAlert", "alert", "min"]);
        const batchNumber = getVal(["batchNumber", "batch"]);
        const expiryDate = getVal(["expiryDate", "expiry"]);
        const supplierName = getVal(["supplierName", "vendor", "supplier"]);

        let barcodeVal = barcode;
        if (typeof barcodeVal === "string" && /^\d+(\.\d+)?[eE]\+?\d+$/.test(barcodeVal)) {
          try {
            const num = Number(barcodeVal);
            if (!isNaN(num)) {
              barcodeVal = num.toFixed(0);
            }
          } catch (e) {}
        } else if (typeof barcodeVal === "number") {
          barcodeVal = String(barcodeVal);
        }

        const p = {
          name: name || "",
          sku: sku || "",
          barcode: barcodeVal || sku || `BC-${Math.floor(100000 + Math.random() * 900000)}`,
          category: category || "General",
          purchasePrice: Number(purchasePrice || 0),
          price: Number(price || 0),
          gstRate: Number(gstRate || 0),
          unit: unit || "Pieces",
          stock: Number(stock || 0),
          minStockAlert: Number(minStockAlert || 5),
          batchNumber: batchNumber || "B-BULK",
          expiryDate: expiryDate || "2027-12-31",
          supplierName: supplierName || "Apex Retail Supplies",
          tenantId: activeTenantId
        };
        return {
          ...p,
          isValid: !!(p.name && p.sku),
          validationError: (p.name && p.sku) ? null : "Name & SKU keys are required."
        };
      });
      setBulkParsedProducts(mapped);
    } catch (e) {
      setBulkUploadError("Invalid JSON array. Paste a valid JSON list.");
      setBulkParsedProducts([]);
    }
  };

  const handleBulkInputChange = (text: string) => {
    setBulkInputText(text);
    const cleaned = text.trim();
    if (!cleaned) {
      setBulkParsedProducts([]);
      return;
    }
    if (cleaned.startsWith("[")) {
      parseJSONText(cleaned);
    } else {
      parseCSVText(cleaned);
    }
  };

  const handleBulkUploadSubmit = async () => {
    const validOnes = bulkParsedProducts.filter(p => p.isValid);
    if (validOnes.length === 0) {
      triggerNotification("No valid products parsed to commit. Please verify Name and SKU fields.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: validOnes })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        triggerNotification(`Bulk upload complete! Added ${data.addedCount} new, updated ${data.updatedCount} existing retail products in master database catalog.`, "success");
        setBulkInputText("");
        setBulkParsedProducts([]);
      } else {
        triggerNotification(data.error || "Failed to catalog bulk records.", "warning");
      }
    } catch (e) {
      triggerNotification("Database connection failed during bulk commit.", "warning");
    }
  };

  // Stock discrepancy Level Adjustment
  const handleStockAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustmentForm.productId || stockAdjustmentForm.newStock === undefined) {
      triggerNotification("Please select a target product and enter stock quantity.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/adjust-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: stockAdjustmentForm.productId,
          newStock: Number(stockAdjustmentForm.newStock),
          reason: stockAdjustmentForm.reason || "Manual warehouse evaluation",
          adjustedBy: currentCashierName,
          branchId: currentBranch?.id || "B1"
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setAdjustments(data.adjustments);
        triggerNotification("Stock adjustment level corrected successfully.", "success");
        setStockAdjustmentForm({ productId: "", newStock: 0, reason: "" });
      }
    } catch (err) {
      triggerNotification("Database offline, unable to log adjustment.", "warning");
    }
  };

  const handleCreateTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransferForm.productId || !newTransferForm.fromBranchId || !newTransferForm.toBranchId) {
      triggerNotification("Please select product, origin, and destination branches.", "warning");
      return;
    }
    if (newTransferForm.fromBranchId === newTransferForm.toBranchId) {
      triggerNotification("Source and Destination branches must be different.", "warning");
      return;
    }
    if (newTransferForm.quantity <= 0) {
      triggerNotification("Transfer quantity must be greater than zero.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: newTransferForm.productId,
          fromBranchId: newTransferForm.fromBranchId,
          toBranchId: newTransferForm.toBranchId,
          quantity: Number(newTransferForm.quantity),
          requestedBy: currentCashierName
        })
      });
      const data = await res.json();
      if (data.success) {
        setTransfers(data.transfers);
        triggerNotification(`Stock transfer request submitted successfully!`, "success");
        setNewTransferForm({
          productId: "",
          fromBranchId: "",
          toBranchId: "",
          quantity: 1,
          remarks: ""
        });
      } else {
        triggerNotification(data.error || "Failed to create transfer request", "warning");
      }
    } catch (err) {
      triggerNotification("Server error, unable to process transfer.", "warning");
    }
  };

  const handleProcessTransfer = async (transferId: string, action: "APPROVED" | "REJECTED", comments: string = "") => {
    try {
      const res = await fetch(`/api/transfers/${transferId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          actionedBy: currentCashierName,
          comments
        })
      });
      const data = await res.json();
      if (data.success) {
        setTransfers(data.transfers);
        setProducts(data.products);
        triggerNotification(`Transfer request ${transferId} has been ${action.toLowerCase()}.`, "success");
      } else {
        triggerNotification(data.error || "Failed to action transfer request", "warning");
      }
    } catch (err) {
      triggerNotification("Server error actioning transfer.", "warning");
    }
  };

  // Register loyalty client
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      triggerNotification("Please input customer name and phone digits.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
        triggerNotification(`Registered customer '${newCustomer.name}' successfully!`, "success");
        // Clear
        setNewCustomer({ name: "", phone: "", email: "", creditBalance: 0, loyaltyPoints: 0 });
      }
    } catch (err) {
      triggerNotification("Unable to link client on network database.", "warning");
    }
  };

  // Register Store Expense
  const handleCreateExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) {
      triggerNotification("Please fill in expense amount and detailed reasons.", "warning");
      return;
    }

    const payload = {
      date: new Date().toISOString().split("T")[0],
      category: newExpense.category,
      amount: Number(newExpense.amount),
      description: newExpense.description,
      approvedBy: currentCashierName,
      storeBranchId: currentBranch?.id || "B1"
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setExpenses(data.expenses);
        triggerNotification("Expense recorded on ledger, awaiting central audit.", "success");
        setNewExpense({ category: "Utility (Electricity)", amount: 0, description: "", approvedBy: "Manager" });
      }
    } catch (err) {
      triggerNotification("Database connection timeout filing expense.", "warning");
    }
  };

  // Add new Supplier/Vendor
  const handleAddSupplier = async (supplierPayload: Omit<Supplier, "id">) => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierPayload)
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.suppliers);
      } else {
        throw new Error("Failed to add supplier");
      }
    } catch (e) {
      console.error("Error adding supplier:", e);
      throw e;
    }
  };

  // Delete Supplier/Vendor
  const handleDeleteSupplier = async (id: string) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.suppliers);
      } else {
        throw new Error("Failed to delete supplier");
      }
    } catch (e) {
      console.error("Error deleting supplier:", e);
      throw e;
    }
  };

  // Add new Branch Location
  const handleAddBranch = async (branchPayload: Omit<StoreBranch, "id"> & { id?: string }) => {
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branchPayload)
      });
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches);
      } else {
        throw new Error("Failed to add branch");
      }
    } catch (e) {
      console.error("Error adding branch:", e);
      throw e;
    }
  };

  // Delete Branch Location
  const handleDeleteBranch = async (id: string) => {
    try {
      const res = await fetch(`/api/branches/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches);
        // If we deleted our current branch, default to first available
        if (currentBranch?.id === id && data.branches.length > 0) {
          setCurrentBranch(data.branches[0]);
        }
      } else {
        throw new Error("Failed to delete branch");
      }
    } catch (e) {
      console.error("Error deleting branch:", e);
      throw e;
    }
  };

  // Active product barcode generator UI view trigger
  const triggerBarcodeGenerator = (sku: string) => {
    // Generate beautiful clean SVG simulation barcode lines
    setActiveBarcodeUrl(sku);
  };

  // Active products filter categorization
  const filteredProductsBySearch = tenantProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode || "").includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === "All") return matchesSearch;
    return matchesSearch && p.category === categoryFilter;
  });

  // Unique categories list
  const productCategoriesList = ["All", ...productCategories];

  // Helper function to resolve stock of a product for the currently selected branch
  const getProductStock = (p: Product) => {
    if (currentBranch && p.branchStocks) {
      return p.branchStocks[currentBranch.id] ?? 0;
    }
    return p.stock;
  };

  // Filter invoices and expenses based on selected branch
  const tenantAndBranchInvoices = invoices.filter((inv) => {
    if (currentBranch) {
      return inv.storeBranchId === currentBranch.id;
    }
    return true;
  });

  // Filter invoices for the Reprint Hub (incorporating search query and show all branches toggle)
  const reprintFilteredInvoices = invoices.filter((inv) => {
    if (!reprintShowAllBranches && currentBranch && inv.storeBranchId !== currentBranch.id) {
      return false;
    }
    if (reprintSearch.trim() !== "") {
      const s = reprintSearch.toLowerCase();
      const idMatch = inv.id.toLowerCase().includes(s);
      const nameMatch = inv.customerName?.toLowerCase().includes(s) || false;
      const phoneMatch = inv.customerPhone?.toLowerCase().includes(s) || false;
      const cashierMatch = inv.cashierName?.toLowerCase().includes(s) || false;
      return idMatch || nameMatch || phoneMatch || cashierMatch;
    }
    return true;
  });

  const tenantAndBranchExpenses = expenses.filter((exp) => {
    if (currentBranch) {
      return exp.storeBranchId === currentBranch.id;
    }
    return true;
  });

  // Computing analytics parameters
  const totalInvoicedRevenue = tenantAndBranchInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalTaxGSTLiability = tenantAndBranchInvoices.reduce((acc, inv) => acc + inv.taxAmount, 0);
  
  // Back Office calculations (Profit = items MRP - items COGS - expenses)
  const totalWarehouseCOGS = tenantAndBranchInvoices.reduce((acc, inv) => {
    return acc + inv.items.reduce((innerAcc, item) => {
      const matchDetails = products.find((prod) => prod.id === item.productId);
      const costAmountUnit = matchDetails ? matchDetails.purchasePrice : (item.price * 0.7);
      return innerAcc + (costAmountUnit * item.quantity);
    }, 0);
  }, 0);

  const totalStoreExpenses = tenantAndBranchExpenses.reduce((acc, item) => acc + item.amount, 0);
  const calculatedOperationalNetProfit = Math.max(0, (totalInvoicedRevenue - totalWarehouseCOGS - totalStoreExpenses));

  // Low stock counter alerts
  const lowStockAlertProducts = tenantProducts.filter((p) => getProductStock(p) <= p.minStockAlert);
  const nearExpiryProductsAlert = tenantProducts.filter((p) => {
    const expDate = new Date(p.expiryDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30; // 30 day shelf-life warning
  });

  if (!isLoggedIn) {
    const handleOtpSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (otpInput.trim() === "123456") {
        // Log in as tenant admin by default
        const match = credentialsList.find(c => c.email === "admin@expertpos.com") || PRESET_CREDENTIALS[1];
        setCurrentRole(match.role);
        setCurrentCashierName(match.name);
        setCurrentUserEmail(match.email);
        setIsLoggedIn(true);
        setActiveTab("pos");
        triggerNotification("Authenticated successfully via secure OTP!", "success");
      } else {
        triggerNotification("Invalid OTP code. Please use 123456 for demo.", "warning");
      }
    };

    const activeBgConfig = LOGIN_BG_CONFIGS[loginBgMode] || LOGIN_BG_CONFIGS["cosmic-aurora"];
    const isDarkTheme = activeBgConfig.isDark;

    return (
      <div className={`min-h-screen w-screen ${activeBgConfig.outerBg} flex items-center justify-center p-3 sm:p-6 md:p-8 relative overflow-y-auto font-sans transition-all duration-700 selection:bg-blue-100 selection:text-blue-900`} id="secured-login-portal">

        {/* Floating Attractive Mode Switcher Dock */}
        <div className="absolute top-4 right-4 sm:right-8 z-50 flex items-center gap-1.5 bg-slate-900/45 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-xl max-w-full overflow-x-auto">
          <span className="text-[10px] font-black uppercase tracking-wider text-white/80 px-2.5 select-none hidden sm:inline-block font-sans">Mode:</span>
          <div className="flex items-center gap-1 shrink-0">
            {Object.entries(LOGIN_BG_CONFIGS).map(([key, config]) => {
              const isActive = loginBgMode === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setLoginBgMode(key);
                    localStorage.setItem("expert_pos_login_bg_mode", key);
                    triggerNotification(`Switched background theme to: ${config.name}`, "success");
                  }}
                  className={`relative flex items-center justify-center p-1.5 px-3 rounded-full transition-all duration-300 group hover:scale-105 cursor-pointer text-[11px] font-bold ${
                    isActive 
                      ? "bg-white text-slate-900 shadow-md font-extrabold scale-105" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  title={config.name}
                >
                  <span className="mr-1">{config.name.split(" ")[1]}</span>
                  <span className="hidden md:inline">{config.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Outer Split Canvas Wrapper matching the attachment with dynamic multi bg theme */}
        <div className={`w-full max-w-7xl ${activeBgConfig.innerBg} rounded-[2.5rem] shadow-2xl border transition-all duration-700 flex flex-col lg:flex-row overflow-hidden relative min-h-[680px] lg:min-h-[760px]`}>
          
          {/* Left Column (Branding, Features Grid & Beautiful UI Mockup illustration) */}
          <div className="w-full lg:w-[56%] p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden select-none">
            {/* Soft dynamic gradient ambient backgrounds in left panel */}
            {activeBgConfig.glows.map((gClass, idx) => (
              <div key={idx} className={gClass} />
            ))}

            <div className="relative z-10">
              {/* ExpertAid High Fidelity SVG Logo Header */}
              <ExpertAidLogo />
 
              {/* Display Header Text */}
              <div className="mt-8">
                <h1 className={`font-sans font-black text-3xl sm:text-4xl lg:text-[44px] tracking-tight leading-[1.08] transition-colors duration-500 ${isDarkTheme ? "text-white" : "text-[#0f172a]"}`}>
                  Smart Billing Software
                </h1>
                <p className={`font-sans font-medium text-sm sm:text-base mt-2.5 max-w-lg leading-relaxed transition-colors duration-500 ${isDarkTheme ? "text-slate-300" : "text-slate-600"}`}>
                  Manage your Business, Invoices, Inventory, GST & Reports in one place.
                </p>
              </div>

              {/* Two-Column Features Matrix Grid exactly mimicking screenshot icons */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-5 mt-7 max-w-xl">
                {[
                  { label: "Invoice Management", icon: FileText },
                  { label: "Customer Management", icon: Users },
                  { label: "Inventory Management", icon: ShoppingBag },
                  { label: "Sales Analytics", icon: TrendingUp },
                  { label: "Payment Tracking", icon: CreditCard },
                  { label: "Reports & Accounting", icon: Layers },
                  { label: "GST Billing", icon: Percent },
                  { label: "Role-Based Access", icon: Shield }
                ].map((feat, i) => {
                  const IconComp = feat.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 hover:translate-x-1 transition-transform duration-200">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md shrink-0 transition-all duration-500 ${isDarkTheme ? "bg-violet-600 shadow-violet-500/20" : "bg-blue-600 shadow-blue-500/10"}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`font-sans font-extrabold text-xs sm:text-[13px] tracking-tight transition-colors duration-500 ${isDarkTheme ? "text-slate-200" : "text-slate-800"}`}>
                        {feat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Desktop Software View with Live Charts & Physical Cartoon Assets */}
            <div className="mt-8 lg:mt-6 mb-8 lg:mb-0 relative w-full max-w-xl mx-auto h-72 hidden md:block">
              {/* Laptop Screen Frame with shadows */}
              <div className="w-96 h-[220px] bg-slate-900 rounded-t-2xl border-t-2 border-x-2 border-slate-700/80 shadow-[0_25px_50px_-12px_rgba(30,41,59,0.3)] relative z-20 flex flex-col overflow-hidden mx-auto">
                {/* Simulated Screen Header */}
                <div className="h-4.5 bg-slate-800 border-b border-slate-950 flex items-center justify-between px-2">
                  <div className="flex gap-1.2 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
                  </div>
                  <span className="text-[7.5px] font-mono text-slate-400 font-bold uppercase tracking-widest">Workspace Terminal</span>
                  <div className="w-5"></div>
                </div>

                {/* Dashboard Screen Content */}
                <div className="bg-slate-50 flex-1 p-2.5 flex flex-col gap-2 overflow-hidden select-none text-[8px]">
                  {/* Top Header bar inside software */}
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                    <span className="font-sans font-black text-slate-800 text-[10px]">Dashboard Overview</span>
                    <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[6px] px-1 py-0.2 rounded uppercase border border-emerald-200/50">Node Online</span>
                  </div>

                  {/* KPI Mini Bento Grid */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { title: "Total Sales", val: "₹ 45,750.00", color: "text-blue-600" },
                      { title: "Total Invoices", val: "320", color: "text-slate-800" },
                      { title: "Total Customers", val: "150", color: "text-slate-800" },
                      { title: "Total Due", val: "₹ 12,540.00", color: "text-rose-500" }
                    ].map((k, idx) => (
                      <div key={idx} className="bg-white rounded-md border border-slate-200/70 p-1 flex flex-col justify-between shadow-3xs">
                        <span className="text-slate-400 text-[5px] font-bold uppercase font-sans truncate">{k.title}</span>
                        <span className={`text-[7px] font-sans font-extrabold tracking-tight truncate ${k.color}`}>{k.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Live SVG Graph & Donut split */}
                  <div className="flex-1 flex gap-2 overflow-hidden">
                    {/* Graph Panel */}
                    <div className="bg-white rounded-md border border-slate-200/70 p-1.5 flex-1 flex flex-col justify-between relative overflow-hidden">
                      <div className="flex justify-between items-center mb-1 relative z-10">
                        <span className="text-slate-500 font-bold text-[5.5px] uppercase">Sales Trend</span>
                        <span className="text-blue-600 font-mono text-[5px] font-bold">+18.4%</span>
                      </div>
                      
                      {/* Interactive Sparkline path */}
                      <div className="flex-1 w-full relative">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid line guidelines */}
                          <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
                          <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                          {/* Filled area */}
                          <path d="M0 25 L10 20 L25 24 L40 12 L55 18 L70 6 L85 15 L100 8 L100 30 L0 30 Z" fill="url(#chartFill)" />
                          {/* Sparkline curve */}
                          <path d="M0 25 L10 20 L25 24 L40 12 L55 18 L70 6 L85 15 L100 8" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          {/* Floating dots */}
                          <circle cx="70" cy="6" r="1.5" fill="#2563eb" stroke="#ffffff" strokeWidth="0.5" />
                          <circle cx="100" cy="8" r="1.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.5" />
                        </svg>
                      </div>

                      {/* X Axis Months */}
                      <div className="flex justify-between text-slate-400 text-[4.5px] font-mono mt-0.5">
                        <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                      </div>
                    </div>

                    {/* Donut Chart Panel */}
                    <div className="bg-white rounded-md border border-slate-200/70 p-1.5 w-20 flex flex-col items-center justify-between">
                      <span className="text-slate-500 font-bold text-[5.5px] uppercase text-center block w-full truncate">Top Products</span>
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        {/* Ring Chart SVG */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.2" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="50 50" strokeDashoffset="0" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="30 70" strokeDashoffset="-50" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="-80" />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-[6px] font-black text-slate-800 leading-none">84%</span>
                          <span className="text-[4px] text-slate-400 font-bold uppercase leading-none scale-90">LTV</span>
                        </div>
                      </div>
                      <div className="flex justify-center gap-1 scale-90">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heavy Duty Bezel Frame Base for Laptop */}
              <div className="w-[430px] h-3 bg-slate-800 rounded-b-xl border-b-2 border-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.15)] absolute bottom-11 left-1/2 transform -translate-x-1/2 z-30">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-slate-900 rounded-b-sm"></div>
              </div>

              {/* Simulated Float-over Invoice Paper Sheet (Left of laptop) */}
              <div className="absolute left-2 lg:left-6 bottom-4 w-40 bg-white rounded-xl border border-slate-200/80 shadow-[0_15px_30px_rgba(0,0,0,0.08)] p-3 z-35 transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-1.5">
                  <div className="flex flex-col">
                    <span className="text-[7.5px] font-black text-slate-900 uppercase tracking-wider">TAX INVOICE</span>
                    <span className="text-[5.5px] font-mono text-slate-400 mt-0.5">INV-2024-001</span>
                  </div>
                  <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[8px] border border-emerald-100">
                    ✓
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[6px] text-slate-500 font-medium">
                    <span>A4 Printer Ink</span><span>1x</span><span>₹ 840.00</span>
                  </div>
                  <div className="flex justify-between text-[6px] text-slate-500 font-medium">
                    <span>Thermal Rolls</span><span>10x</span><span>₹ 450.00</span>
                  </div>
                  <div className="flex justify-between text-[6px] text-slate-500 font-medium">
                    <span>Barcode Reader</span><span>1x</span><span>₹ 1,290.00</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 mt-2 pt-1.5 flex justify-between items-center">
                  <span className="text-[5px] text-slate-400 font-sans font-bold">GST & SURCHARGES INCL.</span>
                  <span className="text-[8.5px] font-sans font-black text-slate-900">₹ 2,580.00</span>
                </div>
                <div className="bg-slate-50 text-[5px] text-slate-400 text-center py-1 mt-1.5 rounded uppercase font-bold tracking-wider font-mono">
                  Thank you for your business!
                </div>
              </div>

              {/* Simulated Cardboard boxes representing warehouses (Right of laptop) */}
              <div className="absolute right-4 lg:right-10 bottom-6 flex flex-col items-end z-35 transform rotate-3 hover:-rotate-1 hover:scale-105 transition-transform duration-300">
                {/* Box 3 - Top small */}
                <div className="w-10 h-8 bg-[#d97706]/85 rounded-md border border-[#b45309] shadow-sm relative flex items-center justify-center">
                  <div className="absolute top-0 w-full h-[3px] bg-[#92400e]/50"></div>
                  <div className="absolute left-[40%] w-[3px] h-full bg-[#92400e]/30"></div>
                  <span className="text-[4px] font-mono text-[#78350f] font-black uppercase">PACK-03</span>
                </div>
                {/* Box 2 - Middle medium */}
                <div className="w-13 h-10 bg-[#b45309]/90 rounded-md border border-[#92400e] shadow-sm relative flex items-center justify-center -mr-2 mt-[-4px]">
                  <div className="absolute top-0 w-full h-[4px] bg-[#78350f]/60"></div>
                  <div className="absolute left-[45%] w-[4px] h-full bg-[#78350f]/30"></div>
                  <span className="text-[5px] font-mono text-white/90 font-black uppercase">CARGO-02</span>
                </div>
                {/* Box 1 - Bottom large */}
                <div className="w-16 h-12 bg-[#92400e]/95 rounded-md border border-[#78350f] shadow-md relative flex items-center justify-center -mr-4 mt-[-4px]">
                  <div className="absolute top-0 w-full h-[5px] bg-[#451a03]/70"></div>
                  <div className="absolute left-[48%] w-[5px] h-full bg-[#451a03]/30"></div>
                  <span className="text-[6px] font-mono text-white/80 font-black uppercase tracking-wider">INV-BOX-01</span>
                </div>
              </div>

              {/* Simulated Mini Desk Calculator */}
              <div className="absolute right-20 bottom-3 w-11 h-15 bg-slate-800 rounded border border-slate-700 shadow-md p-1 z-40 transform -rotate-12 hover:rotate-0 transition-transform cursor-pointer">
                <div className="h-2.5 bg-emerald-950 text-emerald-400 font-mono text-[7px] text-right pr-1 pt-0.5 rounded-xs leading-none">
                  2580.00
                </div>
                <div className="grid grid-cols-3 gap-0.5 mt-1.5 text-white font-mono text-[4.5px] text-center">
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">7</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">8</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">9</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">4</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">5</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">6</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">1</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">2</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">3</span>
                  <span className="bg-[#f59e0b] rounded-2xs py-0.5 font-bold col-span-3 text-slate-900 font-black">TOTAL</span>
                </div>
              </div>

              {/* Holographic glowing lines in background */}
              <div className="absolute right-0 top-3 w-28 h-20 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                  <rect x="10" y="20" width="12" height="70" fill="#2563eb" />
                  <rect x="28" y="40" width="12" height="50" fill="#2563eb" />
                  <rect x="46" y="10" width="12" height="80" fill="#2563eb" />
                  <rect x="64" y="30" width="12" height="60" fill="#2563eb" />
                  <rect x="82" y="5" width="12" height="95" fill="#3b82f6" />
                </svg>
              </div>
            </div>

            {/* Bottom trust indicators block */}
            <div className={`relative z-10 flex flex-wrap items-center justify-start gap-6 pt-4 border-t mt-4 md:mt-0 transition-colors duration-500 ${isDarkTheme ? "border-slate-800/80 text-slate-300" : "border-slate-200/50 text-slate-600"}`}>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <CheckCircle className={`w-4 h-4 ${isDarkTheme ? "text-violet-400" : "text-blue-600"}`} />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Cloud className={`w-4 h-4 ${isDarkTheme ? "text-violet-400" : "text-blue-600"}`} />
                <span>Reliable</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Headphones className={`w-4 h-4 ${isDarkTheme ? "text-violet-400" : "text-blue-600"}`} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Column (Prism-White Elegant Interactive Login Card Container) */}
          <div className="w-full lg:w-[44%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative shadow-2xl lg:shadow-none">
            
            {/* Top / Title header section */}
            <div className="my-auto py-4">
              <div className="text-center mb-8">
                <h2 className="text-[#0f172a] text-3xl font-black tracking-tight font-sans">
                  Welcome Back!
                </h2>
                <p className="text-slate-500 text-sm mt-1.5 font-sans font-medium">
                  Login to your <span className={`font-extrabold transition-colors duration-500 ${isDarkTheme ? "text-violet-600" : "text-blue-600"}`}>Expert POS</span> Billing Account
                </p>
                {/* Centered themed accent bar */}
                <div className={`w-12 h-1 rounded mx-auto mt-3.5 transition-all duration-500 ${isDarkTheme ? "bg-violet-600" : "bg-blue-600"}`}></div>
              </div>

              {loginError && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex gap-2.5 items-start animate-shake">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Authentication Failure</span>
                    {loginError}
                  </div>
                </div>
              )}

              {/* Toggle-able Login Forms (Standard Email Password / OTP Code Login) */}
              {!otpMode ? (
                /* 1. Standard Credential Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Username / Email"
                        value={loginUserId}
                        onChange={(e) => setLoginUserId(e.target.value)}
                        className={`w-full bg-[#f8fafc] border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 transition-all shadow-3xs ${
                          isDarkTheme 
                            ? "focus:border-violet-500 focus:ring-violet-100" 
                            : "focus:border-blue-500 focus:ring-blue-100"
                        }`}
                        id="login-username-input"
                      />
                      <User className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={`w-full bg-[#f8fafc] border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-11 pr-11 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 transition-all shadow-3xs ${
                          isDarkTheme 
                            ? "focus:border-violet-500 focus:ring-violet-100" 
                            : "focus:border-blue-500 focus:ring-blue-100"
                        }`}
                        id="login-password-input"
                      />
                      <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="flex items-center justify-between text-xs font-sans font-extrabold select-none pt-1">
                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className={`rounded border-slate-300 w-4 h-4 cursor-pointer ${
                          isDarkTheme 
                            ? "text-violet-600 focus:ring-violet-500" 
                            : "text-blue-600 focus:ring-blue-500"
                        }`}
                      />
                      <span>Remember Me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginUserId("admin@expertpos.com");
                        setLoginPassword("AdminOverrideX99");
                        triggerNotification("Credentials quick-filled! Click 'Login' to enter.", "success");
                      }}
                      className={`transition-colors hover:underline ${
                        isDarkTheme ? "text-violet-600 hover:text-violet-800" : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button with lock icon */}
                  <button
                    type="submit"
                    className={`w-full text-white font-extrabold text-sm py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-6 ${activeBgConfig.btnAccent}`}
                  >
                    <Lock className="w-4 h-4 shrink-0 fill-current" />
                    <span>Login</span>
                  </button>
                </form>
              ) : (
                /* 2. OTP Authenticator Form */
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className={`rounded-xl p-3 text-xs flex gap-2 border transition-all duration-500 ${
                    isDarkTheme ? "bg-violet-950/40 border-violet-800/40 text-violet-300" : "bg-blue-50 border-blue-100 text-blue-800"
                  }`}>
                    <Info className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkTheme ? "text-violet-400" : "text-blue-600"}`} />
                    <div>
                      <span className="font-bold block">One-Time Password Demo</span>
                      Enter registered system OTP code to access branch nodes immediately. Use code <span className={`font-mono font-bold px-1.5 py-0.2 rounded ${
                        isDarkTheme ? "bg-violet-900/60 text-violet-200" : "bg-blue-100 text-blue-700"
                      }`}>123456</span> to pass.
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-Digit OTP Code (e.g. 123456)"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ""))}
                        className={`w-full bg-[#f8fafc] border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-11 pr-4 text-sm font-mono font-bold tracking-widest placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 transition-all text-center ${
                          isDarkTheme 
                            ? "focus:border-violet-500 focus:ring-violet-100" 
                            : "focus:border-blue-500 focus:ring-blue-100"
                        }`}
                      />
                      <Smartphone className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => setOtpInput("123456")}
                      className={`font-bold hover:underline transition-colors duration-500 ${
                        isDarkTheme ? "text-violet-400 hover:text-violet-300" : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      Auto Fill Demo OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpMode(false)}
                      className="text-slate-500 font-bold hover:underline"
                    >
                      Back to Password
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={`w-full text-white font-extrabold text-sm py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-4 ${activeBgConfig.btnAccent}`}
                  >
                    <Unlock className="w-4 h-4 shrink-0" />
                    <span>Verify & Continue</span>
                  </button>
                </form>
              )}

              {/* Standard OR Divider */}
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider font-sans">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Sign In with OTP button toggling state */}
              <button
                type="button"
                onClick={() => {
                  setOtpMode(!otpMode);
                  setOtpInput("");
                  setLoginError(null);
                }}
                className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-200 font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-3xs active:scale-98"
              >
                <Smartphone className="w-4.5 h-4.5 text-slate-500" />
                <span>{otpMode ? "Sign In with Password" : "Sign In with OTP"}</span>
              </button>


            </div>

            {/* Copyright, details, and legal footer */}
            <div className="text-center font-sans text-slate-400 text-[11px] leading-relaxed pt-6 border-t border-slate-100 mt-8 lg:mt-0">
              <p className="font-extrabold text-slate-500">Expert POS Technologies Pvt. Ltd.</p>
              <p className="mt-0.5">© 2024 All Rights Reserved.</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (isSuperAdmin) {
    return (
      <div className="h-screen w-screen bg-[#f4f7fe] text-slate-800 font-sans overflow-hidden relative" id="super-admin-layout-root">
        {notifText && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 transition-transform animate-bounce ${
            notifType === "success" 
              ? "bg-slate-900 text-emerald-400 border border-emerald-500/20" 
              : "bg-amber-950 text-amber-200 border border-amber-500/40"
          }`}>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-400">System Broadcast</p>
              <p className="text-sm font-sans text-white font-medium">{notifText}</p>
            </div>
          </div>
        )}
        <SuperAdminConsole
          credentialsList={credentialsList}
          onUpdateCredentials={(newList) => {
            setCredentialsList(newList);
            localStorage.setItem("expert_aid_credentials", JSON.stringify(newList));
          }}
          triggerNotification={triggerNotification}
          tenantsList={tenantsList}
          onUpdateTenants={(newList) => {
            setTenantsList(newList);
            localStorage.setItem("expert_aid_tenants", JSON.stringify(newList));
          }}
          activeTenantId={activeTenantId}
          onSelectTenant={(id) => {
            setActiveTenantId(id);
            localStorage.setItem("expert_aid_active_tenant_id", id);
          }}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUserEmail("");
            setCurrentCashierName("");
            setCurrentRole(UserRole.CASHIER);
            triggerNotification("Logged out of Super Admin Console successfully.", "success");
          }}
          onImpersonateClient={handleImpersonateClient}
        />
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen ${bgMode.rootBg} ${bgMode.text} overflow-hidden font-sans`} id="smart-billing-root">
      {/* Dynamic Native Alert Bar */}
      {notifText && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 transition-transform animate-bounce ${
          notifType === "success" 
            ? "bg-slate-900 text-emerald-400 border border-emerald-500/20" 
            : "bg-amber-950 text-amber-200 border border-amber-500/40"
        }`}>
          {notifType === "success" ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider font-mono">System Broadcast</p>
            <p className="text-sm font-sans text-white font-medium">{notifText}</p>
          </div>
        </div>
      )}

      {/* Sidebar Navigation - Precise Sleek Theme */}
      <aside className={`w-64 ${bgMode.sidebarBg} flex flex-col shrink-0 border-r`} id="sidebar">
        <div className={`p-6 border-b ${bgMode.border} flex flex-col items-center text-center`}>
          {/* Top-left Gate Badge portion for logged-in side */}
          <div className="mb-4">
            <span className={`inline-block ${currentTheme.bg} text-white text-[9px] font-sans font-black uppercase tracking-wider rounded-full px-2.5 py-1.5 shadow-sm`}>
              {activeTenant.subdomain.toUpperCase()} GATE
            </span>
          </div>

          <div className="flex flex-col items-center space-y-3 w-full">
            {activeTenant.companyLogo ? (
              <div className={`p-[1.5px] rounded-xl ${currentTheme.bg} shadow-md overflow-hidden transition-all hover:scale-105 ring-2 ring-slate-200 inline-block`}>
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 overflow-hidden select-none">
                  <img 
                    src={activeTenant.companyLogo} 
                    alt={`${activeTenant.name} Logo`} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ) : (
              <div className={`w-16 h-16 ${currentTheme.bg} rounded-xl flex items-center justify-center shadow-md`}>
                <span className="text-white font-display font-extrabold text-lg tracking-tighter">
                  {activeTenant.name.replace(/[^a-zA-Z ]/g, "").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "EA"}
                </span>
              </div>
            )}
            <div className="w-full">
              <h1 className={`${bgMode.textHeading} font-display font-black text-sm tracking-tight leading-tight uppercase font-sans break-words px-2`} title={activeTenant.name}>
                {activeTenant.name}
              </h1>
              <span className={`${currentTheme.text} text-[9.5px] font-mono tracking-widest font-black uppercase block mt-1.5`}>
                {activeTenant.tier} SaaS node
              </span>
            </div>
          </div>
          <p className={`${bgMode.textMuted} text-[9px] mt-4 font-mono flex items-center justify-center gap-1 font-sans`}>
            <Clock className={`w-3 h-3 ${bgMode.textMuted}`} /> UTC: 2026-05-22
          </p>
        </div>

        {/* Core Menu Tabs */}
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
          {!isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab("pos")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "pos"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Point of Sale (POS)</span>
              </button>

              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "inventory"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <Layers className="w-4 h-4" />
                <div className="flex justify-between items-center w-full">
                  <span>Stock &amp; Inventory</span>
                  {lowStockAlertProducts.length > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {lowStockAlertProducts.length}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "products"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Product Catalogue</span>
              </button>

              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "customers"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>CRM &amp; Loyalty</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("saved-bills");
                  // Clear active printing states
                  setIsVirtualPrinting(false);
                  setVirtualPrintDone(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "saved-bills"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-500" />
                <div className="flex justify-between items-center w-full">
                  <span>Saved Bills &amp; Receipts</span>
                  {invoices.length > 0 && (
                    <span className="bg-emerald-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {invoices.length}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveTab("expenses")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "expenses"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Store &amp; Cash Shifts</span>
              </button>
            </>
          )}

          {/* This tab is visible both for standard users and superadmin (as "Dashboard") */}
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
              activeTab === "analytics"
                ? `${currentTheme.bg} text-white font-bold shadow-md`
                : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>{isSuperAdmin ? "Dashboard (Analytics)" : "Reports & Analytics"}</span>
          </button>

          {!isSuperAdmin && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                activeTab === "settings"
                  ? `${currentTheme.bg} text-white font-bold shadow-md`
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <Settings className="w-4 h-4 text-purple-600 font-semibold" />
              <span>Settings</span>
            </button>
          )}

          {/* Staff Registry / Manager Panel (available for admin, manager and superadmin) */}
          {(currentRole === UserRole.ADMIN || currentRole === UserRole.MANAGER || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("staff-registry")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                activeTab === "staff-registry"
                  ? `${currentTheme.bg} text-white font-bold shadow-md`
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4 text-purple-600 font-bold" />
              <span>{currentRole === UserRole.MANAGER ? "Manager Panel" : "Staff Registry (Staff Onboarding)"}</span>
            </button>
          )}

          {/* Super Admin Panel */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab("super-admin")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                activeTab === "super-admin"
                  ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/10"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-purple-600 animate-pulse" />
              <span className="flex items-center justify-between w-full font-semibold">
                <span>Super Admin Panel</span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              </span>
            </button>
          )}
        </nav>

        {/* User Session Metadata */}
        <div className={`p-4 mt-auto border-t ${bgMode.border}`}>
          <div className={`${bgMode.innerCard} p-4 rounded-xl border space-y-3`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-9 h-9 rounded-full ${bgMode.inputBg} border ${bgMode.border} flex items-center justify-center ${bgMode.textHeading} text-xs font-bold shrink-0 font-sans`}>
                {currentCashierName ? currentCashierName.split(" ").map(n => n[0]).join("") : "U"}
              </div>
              <div className="overflow-hidden">
                <p className={`${bgMode.textHeading} text-xs font-bold truncate leading-tight`}>{currentCashierName}</p>
                <p className={`text-[10px] truncate leading-none mt-1 font-mono font-bold uppercase tracking-wider ${
                  currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super")
                    ? "text-purple-500"
                    : bgMode.textMuted
                }`}>
                  {currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super") ? "SUPERADMIN" : currentRole}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setCurrentUserEmail("");
                setLoginUserId("");
                setLoginPassword("");
                setSelectedLoginRole("admin");
                triggerNotification("Successfully logged out. All access revoked.", "warning");
              }}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-200 transition-all font-sans text-[10px] flex items-center justify-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider shadow-sm"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className={`flex-1 flex flex-col overflow-hidden ${bgMode.contentBg}`}>
        {/* Header - Styled sleek index */}
        <header className={`h-16 ${bgMode.headerBg} border-b flex items-center justify-between px-8 shrink-0`}>
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 ${bgMode.textMuted}`}>
              <Store className={`w-4 h-4 ${currentTheme.textAccent}`} />
              {currentRole === UserRole.ADMIN || isSuperAdmin ? (
                <select
                  value={currentBranch?.id}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className={`border-none bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded text-xs font-semibold ${bgMode.textHeading} focus:ring-0 outline-none cursor-pointer`}
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs font-bold text-slate-705 bg-slate-100 px-2.5 py-1 rounded">
                  📍 {currentBranch?.name || "Corporate Branch"}
                </span>
              )}
            </div>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            
            {/* Quick checkout search simulator */}
            <form onSubmit={handleBarcodeSubmit} className="relative">
              <input
                type="text"
                placeholder="Scan item barcode (e.g. 5449000133335) or search..."
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                className={`w-96 pl-9 pr-4 py-1.5 ${bgMode.inputBg} border border-transparent rounded-lg text-xs transition-all outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-slate-300`}
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <button type="submit" className="hidden" />
            </form>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick alert indicator logs */}
            {lowStockAlertProducts.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab("inventory");
                  triggerNotification("Filter through current near-critical warning lists below", "success");
                }}
                className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-100 dark:border-rose-900/30 flex-row shrink-0"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Low Stock Warning ({lowStockAlertProducts.length})
              </button>
            )}

            {/* Expiring count alerts */}
            {nearExpiryProductsAlert.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab("inventory");
                }}
                className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-100 dark:border-amber-900/30 shrink-0"
              >
                Near Expiry ({nearExpiryProductsAlert.length})
              </button>
            )}

            {/* Interactive Attractive Mode Switcher */}
            <div className={`flex items-center gap-1.5 ${bgMode.inputBg} p-1 rounded-xl border ${bgMode.border} shadow-xs shrink-0`}>
              <span className={`text-[10px] font-sans font-bold ${bgMode.textMuted} pl-1.5 hidden md:inline`}>🎨 Mode:</span>
              <select
                value={attractiveMode}
                onChange={(e) => {
                  const newMode = e.target.value as any;
                  setAttractiveMode(newMode);
                  localStorage.setItem("expert_aid_attractive_mode", newMode);
                  triggerNotification(`Switched visual canvas to ${newMode.toUpperCase()} mode!`, "success");
                }}
                className={`bg-white dark:bg-slate-850 border ${bgMode.border} rounded-lg text-[10.5px] font-bold ${bgMode.textHeading} px-2 py-0.5 outline-none cursor-pointer hover:bg-slate-50 transition-colors focus:ring-0`}
              >
                <option value="mint">🌿 Soft Mint (Classic)</option>
                <option value="cosmic">🌌 Cosmic Midnight (Dark)</option>
                <option value="oceanic">🌊 Oceanic Depth (Dark Teal)</option>
                <option value="cyberpunk">⚡ Cyber Amber (Charcoal Dark)</option>
                <option value="nordic">🏔️ Nordic Sage (Light Slate)</option>
                <option value="espresso">☕ Royal Espresso (Dark Gold)</option>
                <option value="aura">✨ Aura Indigo (Light Purple)</option>
                <option value="cream">🧁 Champagne Cream (Warm)</option>
                <option value="velvet">🔮 Royal Velvet (Plum)</option>
                <option value="sunset">🌸 Blush Sunset (Rose)</option>
              </select>
            </div>

            {/* Terminal Log In Active Session Badge */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-1.5 px-3 shadow-sm shrink-0">
              <div className="flex flex-col text-right pr-2.5 border-r border-slate-800 shrink-0">
                <span className="text-[8px] text-slate-500 font-mono font-bold leading-none mb-0.5 tracking-wider">ACTIVE SESSION</span>
                <span className={`text-[10px] font-bold leading-none uppercase ${
                  currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super")
                    ? "text-purple-400"
                    : "text-emerald-400"
                }`}>
                  {currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super") ? "SUPERADMIN" : currentRole}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentUserEmail("");
                  setLoginUserId("");
                  setLoginPassword("");
                  setSelectedLoginRole("admin");
                  triggerNotification("Successfully logged out. All access revoked.", "warning");
                }}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition-colors shrink-0"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right hidden xl:block shrink-0">
              <p className={`text-xs font-mono font-medium ${bgMode.textMuted}`}>Branch Offline Mode</p>
              <p className={`text-[10px] ${bgMode.textMuted} font-mono opacity-80`}>Sync State: Secure Local (Cloud Vault Enabled)</p>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: POINT OF SALE SYSTEM */}
          {activeTab === "pos" && (
            <div className="flex gap-6 h-full items-start" id="pos-module-layout">
              {/* Product Grid selection & Filtering */}
              <div className="flex-1 space-y-6">
                {/* Statistics line */}
                <div className="grid grid-cols-4 gap-4">
                  <div className={`p-4 rounded-xl shadow-xs border ${bgMode.cardBg}`}>
                    <p className={`text-[10px] font-bold ${bgMode.textMuted} uppercase tracking-wider mb-1`}>Today's Total Sale</p>
                    <h3 className={`text-xl font-bold font-mono ${bgMode.textHeading}`}>₹{totalInvoicedRevenue.toFixed(2)}</h3>
                    <p className="text-[9px] text-emerald-500 font-bold mt-1">✓ Live Session Sales</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow-xs border ${bgMode.cardBg}`}>
                    <p className={`text-[10px] font-bold ${bgMode.textMuted} uppercase tracking-wider mb-1`}>Invoice Count</p>
                    <h3 className={`text-xl font-bold font-mono ${bgMode.textHeading}`}>{invoices.length} checkouts</h3>
                    <p className={`text-[9px] ${bgMode.textMuted} mt-1`}>Avg basket: ₹{(totalInvoicedRevenue / Math.max(1, invoices.length)).toFixed(2)}</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow-xs border ${bgMode.cardBg}`}>
                    <p className={`text-[10px] font-bold ${bgMode.textMuted} uppercase tracking-wider mb-1`}>Tax Liability (GST)</p>
                    <h3 className="text-xl font-bold font-mono text-emerald-500">₹{totalTaxGSTLiability.toFixed(2)}</h3>
                    <p className={`text-[9px] ${bgMode.textMuted} mt-1`}>Tax logs registered</p>
                  </div>
                  <div className={`p-4 rounded-xl shadow-xs border ${bgMode.cardBg}`}>
                    <p className={`text-[10px] font-bold ${bgMode.textMuted} uppercase tracking-wider mb-1`}>Active Cashier</p>
                    <h3 className={`text-base font-bold truncate ${bgMode.textHeading}`}>{currentCashierName}</h3>
                    <p className={`text-[9px] ${bgMode.textMuted} mt-1`}>
                      {currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super") ? "SUPERADMIN" : currentRole} privilege
                    </p>
                  </div>
                </div>

                {/* Local Inventory Filters */}
                <div className={`p-4 rounded-xl border space-y-4 ${bgMode.cardBg}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold flex items-center gap-2 ${bgMode.textHeading}`}>
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      Browse Catalogue / Click item to Add to Cart
                    </h3>
                    <div className="flex gap-1">
                      {productCategoriesList.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            categoryFilter === cat
                              ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                              : `${bgMode.inputBg} ${bgMode.textMuted} hover:opacity-80`
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual search query */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search barcode, description, SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 border rounded-lg text-xs outline-none ${bgMode.inputBg} ${bgMode.border}`}
                    />
                    <Search className={`w-3.5 h-3.5 absolute left-3 top-3 ${bgMode.textMuted}`} />
                  </div>

                  {/* Catalogue Grid */}
                  <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[360px] pr-2">
                    {filteredProductsBySearch.length > 0 ? (
                      filteredProductsBySearch.map((product) => {
                        const localStock = getProductStock(product);
                        const isLowStock = localStock <= product.minStockAlert;
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleAddToCart(product)}
                            className={`p-3 rounded-lg hover:border-emerald-500 cursor-pointer transition-all hover:shadow-sm relative group flex flex-col justify-between border ${bgMode.innerCard}`}
                          >
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono uppercase ${bgMode.inputBg} ${bgMode.textMuted}`}>
                                  {product.category.substring(0, 10)}
                                </span>
                                <span className={`text-[10px] font-bold ${isLowStock ? "text-rose-500" : "text-emerald-500"}`}>
                                  {localStock} {product.unit}s
                                </span>
                              </div>
                              <h4 className={`text-xs font-bold line-clamp-2 min-h-[32px] group-hover:text-emerald-500 transition-colors ${bgMode.textHeading}`}>
                                {product.name}
                              </h4>
                              <p className={`text-[10px] font-mono mt-1 ${bgMode.textMuted}`}>SKU: {product.sku}</p>
                              <p className={`text-[10px] font-mono ${bgMode.textMuted}`}>Barcode: {product.barcode}</p>
                            </div>
                            <div className={`mt-2 pt-2 border-t flex items-center justify-between ${bgMode.border}`}>
                              <span className={`text-sm font-black font-mono ${bgMode.textHeading}`}>
                                ₹{product.price.toFixed(2)}
                              </span>
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 rounded font-bold">
                                GST {product.gstRate}%
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-3 text-center py-12 text-slate-400 text-xs">
                        ⚠️ No matching inventory item. Create the product catalog in the Product tab.
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated POS Integrations Panel: Barcode scanner + Thermal preview trigger */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-emerald-400 mb-2">
                      Barcode Scanner Simulator
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      Scan product quickly using ready test inputs. Type or click below:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tenantProducts.slice(0, 6).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setBarcodeSearch(p.barcode);
                            triggerNotification(`Inserted barcode: ${p.barcode}`, "success");
                          }}
                          className="px-2 py-1 text-[9px] bg-slate-800 text-slate-300 rounded font-mono border border-slate-700 hover:text-white"
                        >
                          🎫 {p.name.substring(0, 15)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-emerald-400 mb-2">
                      Simulated APIs &amp; Integrations
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      Expert POS incorporates full digital POS checkout integrations with thermal printer simulators:
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                        <span>GST Invoice Payload:</span>
                        <span className="text-emerald-400 font-mono text-[9px]">✓ Validated 200 OK</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                        <span>WhatsApp SMS Engine:</span>
                        <span className="text-emerald-400 font-mono text-[9px]">✓ Integrated Callback</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pb-1">
                        <span>Cloud Database Sync:</span>
                        <span className="text-blue-400 font-mono text-[9px]">✓ Active Auto-Vaulting</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAST BILLS & REPRINT CENTER */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 mt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Printer className="w-4 h-4 text-emerald-500 animate-pulse" />
                        Past Bills &amp; Invoice Reprint Hub
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Reprint receipts or inspect completed checkouts ({reprintFilteredInvoices.length} matched)
                      </p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search Bill ID, Customer..."
                          value={reprintSearch}
                          onChange={(e) => setReprintSearch(e.target.value)}
                          className="pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-slate-300 w-44"
                        />
                        <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                      </div>

                      <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none border border-slate-200 bg-slate-50 px-2.5 py-1.5 rounded-lg hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={reprintShowAllBranches}
                          onChange={(e) => setReprintShowAllBranches(e.target.checked)}
                          className="accent-slate-800 rounded cursor-pointer"
                        />
                        <span>Show all branches</span>
                      </label>
                    </div>
                  </div>

                  {reprintFilteredInvoices.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-1">
                      <p className="text-sm">📂 No bills or checkout receipts found.</p>
                      <p className="text-[10px] text-slate-400 max-w-md mx-auto">
                        If you have saved bills under a different branch, try checking <strong>"Show all branches"</strong> or adjust your search query.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead className="sticky top-0 bg-slate-50 shadow-sm z-10">
                          <tr className="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
                            <th className="px-3 py-2 bg-slate-50">Invoice ID</th>
                            <th className="px-3 py-2 bg-slate-50">Customer</th>
                            <th className="px-3 py-2 bg-slate-50">Date / Time</th>
                            <th className="px-3 py-2 text-right bg-slate-50">Mode</th>
                            <th className="px-3 py-2 text-right bg-slate-50">Total</th>
                            <th className="px-3 py-2 text-center bg-slate-50">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {reprintFilteredInvoices.slice().reverse().map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-3 py-2 font-mono text-[10px] font-bold text-slate-500">{inv.id}</td>
                              <td className="px-3 py-2">
                                <p className="font-bold text-slate-800">{inv.customerName || "Guest Client"}</p>
                                <p className="text-[9px] text-slate-400 font-mono">Cashier: {inv.cashierName}</p>
                              </td>
                              <td className="px-3 py-2 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                                {inv.date} {inv.time}
                              </td>
                              <td className="px-3 py-2 text-right font-mono">
                                <span className="text-[9.5px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded uppercase">
                                  {inv.paymentMode}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                                ₹{inv.grandTotal.toFixed(2)}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  onClick={() => {
                                    setShowInvoicePrintPreview(inv);
                                    triggerNotification(`Loaded Invoice ${inv.id} for printing.`, "success");
                                  }}
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all mx-auto border border-emerald-200/30 cursor-pointer"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>Reprint</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Smart AI copilot right in the system dashboard */}
                <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
                  <SmartCopilot
                    currentRole={currentRole}
                    currentBranch={currentBranch}
                    products={products}
                  />
                </div>
              </div>

              {/* ACTIVE CART DRAWER (RIGHT PANEL) - Exact Sleek Style */}
              <div className={`w-80 shrink-0 border rounded-2xl shadow-xl flex flex-col h-[750px] ${bgMode.cardBg}`}>
                <div className="bg-slate-900 p-4 text-white rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                      <ShoppingCart className="w-4 h-4 text-emerald-400" />
                      Active Checkout Cart
                    </h4>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-500 text-slate-900 font-bold rounded">
                      SESSION #{invoices.length + 120}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cashier: {currentCashierName} • Branch: {currentBranch?.id}
                  </p>
                </div>

                {/* Customer Billing Info */}
                <div className={`p-3 border-b space-y-2 ${bgMode.innerCard} ${bgMode.border}`}>
                  <div className="flex justify-between items-center">
                    <label className={`text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${bgMode.textHeading}`}>
                      <User className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Billing Customer
                    </label>
                    <button
                      onClick={() => {
                        setActiveTab("customers");
                        triggerNotification("Redirected to Loyalty registration form", "success");
                      }}
                      className="text-[10px] text-emerald-500 font-bold hover:underline"
                    >
                      + Register Client
                    </button>
                  </div>
                  
                  {/* Select Customer Dropdown */}
                  <div>
                    <select
                      value={selectedCustomer?.id || ""}
                      onChange={(e) => {
                        const cust = customers.find((c) => c.id === e.target.value);
                        setSelectedCustomer(cust || null);
                        if (cust) {
                          setBillingCustomerName(cust.name);
                          setBillingCustomerPhone(cust.phone);
                          triggerNotification(`Linked Loyalty VIP: ${cust.name}`, "success");
                        } else {
                          setBillingCustomerName("");
                          setBillingCustomerPhone("");
                        }
                      }}
                      className={`w-full text-[11px] border rounded p-1 font-medium ${bgMode.inputBg} ${bgMode.border}`}
                    >
                      <option value="">-- Guest Checkout (Select Loyalty) --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manual Billing Inputs */}
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[8.5px] text-slate-500 font-bold block mb-0.5">CUSTOMER NAME:</span>
                      <input
                        type="text"
                        value={billingCustomerName}
                        onChange={(e) => setBillingCustomerName(e.target.value)}
                        placeholder="Regular Customer/Loyalty Guest"
                        className="w-full text-xs font-semibold border border-slate-200 rounded p-1 block bg-white h-7 focus:ring-1 focus:ring-emerald-500/50"
                      />
                    </div>
                    <div>
                      <span className="text-[8.5px] text-slate-500 font-bold block mb-0.5">MOBILE NUMBER:</span>
                      <input
                        type="text"
                        value={billingCustomerPhone}
                        maxLength={15}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBillingCustomerPhone(val);
                          // Auto match with existing registered phone
                          const normalizedInput = val.replace(/\D/g, "");
                          if (normalizedInput.length >= 10) {
                            const matched = customers.find(c => {
                              const normPhone = c.phone.replace(/\D/g, "");
                              return normPhone.endsWith(normalizedInput) || normalizedInput.endsWith(normPhone);
                            });
                            if (matched) {
                              setSelectedCustomer(matched);
                              setBillingCustomerName(matched.name);
                              triggerNotification(`Linked registered VIP: ${matched.name}`, "success");
                            }
                          }
                        }}
                        placeholder="Customer Mobile No."
                        className="w-full text-xs font-mono font-bold border border-slate-200 rounded p-1 block bg-white h-7 focus:ring-1 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>

                  {selectedCustomer && (
                    <div className="p-1 px-2 bg-emerald-50 border border-emerald-200/50 rounded text-[9px] text-emerald-800 flex justify-between items-center font-mono">
                      <span>Points: <b>{selectedCustomer.loyaltyPoints}</b></span>
                      <span>Credit: <b>₹{selectedCustomer.creditBalance}</b></span>
                    </div>
                  )}
                </div>

                {/* Cart Active Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item.productId} className="flex justify-between items-start border-b border-slate-100 pb-2 gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{item.name}</p>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
                            <span>₹{item.price.toFixed(2)} / {item.unit}</span>
                            <span>{item.gstRate}% Tax</span>
                          </div>
                          
                          {/* Quantity selector */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              onClick={() => handleUpdateCartQuantity(item.productId, -1)}
                              className="w-4 h-4 bg-slate-100 text-slate-700 rounded flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold font-mono text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateCartQuantity(item.productId, 1)}
                              className="w-4 h-4 bg-slate-100 text-slate-700 rounded flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <span className="text-xs font-bold font-mono text-slate-800">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="text-slate-300 hover:text-rose-500 mt-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs py-12 space-y-2 text-center">
                      <ShoppingCart className="w-10 h-10 text-slate-300 stroke-1" />
                      <span>Shopping cart empty.<br />Click catalog products or scan barcode to checkout items.</span>
                    </div>
                  )}
                </div>

                {/* Coupon handling entry */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. WELCOME5)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 outline-none uppercase font-mono"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold font-display"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Try: <b>WELCOME5</b> (5% off) </span>
                    <span><b>FESTIVE10</b> (10% off)</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Cart Subtotal</span>
                    <span>₹{subTotalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated GST ({taxAmountOfCart > 0 ? "Inclusive" : "0%"})</span>
                    <span>₹{taxAmountOfCart.toFixed(2)}</span>
                  </div>
                  {appliedDiscountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedDiscountPercent}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center">
                    <p className="text-slate-600 font-sans font-bold">TOTAL PAYABLE</p>
                    <p className="text-lg font-black font-mono text-slate-900">₹{grandTotalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Checkout selection & Cash trigger */}
                <div className="p-4 bg-slate-100 border-t border-slate-200 space-y-3">
                  <div className="grid grid-cols-3 gap-1">
                    {Object.values(PaymentMode).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPaymentMode(mode)}
                        className={`py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          paymentMode === mode
                            ? `${currentTheme.bg} text-white border-transparent shadow`
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* Cash payment drawer change calculation */}
                  {paymentMode === PaymentMode.CASH && (
                    <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono font-bold text-slate-500">CASH RECEIVED</label>
                        <span className="text-[10px] text-slate-400 font-mono">Target: ₹{grandTotalAmount.toFixed(2)}</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Amt cash given (e.g. 500, 1000)"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="w-full text-xs font-mono font-bold border border-slate-200 rounded p-1 text-slate-800"
                      />
                      {Number(cashReceived) >= grandTotalAmount && (
                        <div className={`flex justify-between items-center text-[11px] font-mono ${currentTheme.textAccentDark} ${currentTheme.bgLight} p-1.5 rounded border border-dashed`}>
                          <span>CHANGE RE-DELIVERED:</span>
                          <span className="font-bold font-mono">
                            ₹{(Number(cashReceived) - grandTotalAmount).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Checkout CTA */}
                  <button
                    onClick={handlePOSCheckout}
                    disabled={cartItems.length === 0}
                    className={`w-full py-3 ${currentTheme.bg} ${currentTheme.bgHover} text-white rounded-xl font-bold font-display shadow-lg ${currentTheme.glow} active:scale-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Checkout Store Invoice
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-400 font-mono">
                    ✓ Instant SMS &amp; GST tax callback simulated
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & STOCK EXPIRES SYSTEM */}
          {activeTab === "inventory" && (
            <div className="space-y-6" id="inventory-module-layout">
              {/* Stats highlights */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Count Valuation</h4>
                  <p className="text-2xl font-black font-mono text-slate-950">
                    ₹{tenantProducts.reduce((acc, p) => acc + (p.purchasePrice * getProductStock(p)), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Valuation at Cost Price (COGS Index)</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm bg-gradient-to-br from-amber-50 to-white">
                  <div className="flex justify-between items-center text-amber-700">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Critical Low Stock Limits</h4>
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black font-mono text-amber-900">{lowStockAlertProducts.length} SKU Alerts</p>
                  <p className="text-xs text-amber-700 mt-2">Requires instant purchase supply restock</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm bg-gradient-to-br from-rose-50 to-white">
                  <div className="flex justify-between items-center text-rose-700">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Near Expiry Alert List</h4>
                    <Info className="w-5 h-5 text-rose-500 font-bold" />
                  </div>
                  <p className="text-2xl font-black font-mono text-rose-900">{nearExpiryProductsAlert.length} Batches</p>
                  <p className="text-xs text-rose-700 mt-2">Expires in less than 30 days time</p>
                </div>
              </div>

              {/* Master Inventory Tracking Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-secondary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Warehouse Inventory Tracking &amp; Replaces Logbook</h3>
                    <p className="text-xs text-slate-400 font-mono">Total tracking of {tenantProducts.length} products</p>
                  </div>
                  <div className="relative w-full sm:w-80">
                    <input
                      type="text"
                      placeholder="Search stock by name, SKU, barcode, supplier..."
                      value={inventorySearchQuery}
                      onChange={(e) => setInventorySearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-slate-400 placeholder-slate-400 text-slate-800 font-sans shadow-sm"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[600px] overflow-y-auto relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                      <tr className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 select-none">
                        <th className="px-6 py-3 bg-slate-50">Product Catalog Description</th>
                        <th className="px-6 py-3 bg-slate-50">Batch Number</th>
                        <th className="px-6 py-3 bg-slate-50">Supplier Source</th>
                        <th className="px-6 py-3 text-right bg-slate-50">Unit Price</th>
                        <th className="px-6 py-3 text-right bg-slate-50">Available Stock</th>
                        <th className="px-6 py-3 bg-slate-50">Expiration Date</th>
                        <th className="px-6 py-3 bg-slate-50">Stock Status Alert</th>
                        <th className="px-6 py-3 text-center bg-slate-50">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filtered = tenantProducts.filter((p) => {
                          const query = (inventorySearchQuery || "").trim().toLowerCase();
                          if (!query) return true;
                          return (
                            p.name.toLowerCase().includes(query) ||
                            p.sku.toLowerCase().includes(query) ||
                            (p.barcode || "").toLowerCase().includes(query) ||
                            (p.batchNumber && p.batchNumber.toLowerCase().includes(query)) ||
                            (p.supplierName && p.supplierName.toLowerCase().includes(query)) ||
                            (p.category && p.category.toLowerCase().includes(query))
                          );
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="px-6 py-10 text-center text-slate-400 font-medium">
                                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                No stock inventory items matched "{inventorySearchQuery}"
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((p) => {
                          const localStock = getProductStock(p);
                          const isLowStock = localStock <= p.minStockAlert;
                          
                          // Check if expiring soon
                          const expDate = new Date(p.expiryDate);
                          const today = new Date();
                          const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          const isExpired = diffDays < 0;
                          const isExpiringSoon = diffDays >= 0 && diffDays <= 30;
                          const displayStock = localStock;

                          return (
                            <tr key={p.id} className="text-xs hover:bg-slate-50">
                              <td className="px-6 py-3.5">
                                <p className="font-bold text-slate-900">{p.name}</p>
                                <div className="flex gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <span>SKU: {p.sku}</span>
                                  <span>•</span>
                                  <span>Barcode: {p.barcode}</span>
                                  <span>•</span>
                                  <span className="text-slate-500 font-semibold uppercase">{p.category}</span>
                                </div>
                              </td>
                              <td className="px-6 py-3.5 font-mono text-slate-600">{p.batchNumber}</td>
                              <td className="px-6 py-3.5 text-slate-500">{p.supplierName}</td>
                              <td className="px-6 py-3.5 text-right font-mono text-slate-900 font-bold">
                                ₹{p.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-3.5 text-right font-mono font-bold">
                                <span className={isLowStock ? "text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded" : "text-slate-800"}>
                                  {displayStock} {p.unit}s
                                </span>
                              </td>
                              <td className="px-6 py-3.5 font-mono">
                                <span className={isExpired ? "text-rose-600 font-bold" : isExpiringSoon ? "text-amber-600 font-semibold" : "text-slate-600"}>
                                  {p.expiryDate} {isExpiringSoon && `(${diffDays} days left)`} {isExpired && "(Expired)"}
                                </span>
                              </td>
                              <td className="px-6 py-3.5">
                                {isLowStock ? (
                                  <span className="bg-rose-50 text-rose-600 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-rose-100 flex items-center gap-1 w-max">
                                    ⚠️ Critical Low Check
                                  </span>
                                ) : isExpiringSoon ? (
                                  <span className="bg-amber-50 text-amber-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-amber-100 flex items-center gap-1 w-max">
                                    ⏳ Expiry Warning
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1 w-max">
                                    ✓ Stock Healthy
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3.5 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewProduct(p);
                                      triggerNotification(`Product "${p.name}" loaded into the editor form.`, "success");
                                      const element = document.getElementById("products-module-layout");
                                      if (element) {
                                        element.scrollIntoView({ behavior: "smooth" });
                                      }
                                    }}
                                    title="Edit Product"
                                    className="p-1 px-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-transparent hover:border-amber-100"
                                  >
                                    <Edit2 className="w-3 h-3" /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                    title="Delete Product"
                                    className="p-1 px-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-transparent hover:border-rose-100"
                                  >
                                    <Trash2 className="w-3 h-3" /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Adjust Inventory Stock levels drawer */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-emerald-500" />
                    Verify Discrepancies / Stock adjustment level Form
                  </h3>
                  <form onSubmit={handleStockAdjustmentSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Target Product SKU</label>
                      <select
                        value={stockAdjustmentForm.productId}
                        onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, productId: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2"
                      >
                        <option value="">-- Choose Product --</option>
                        {tenantProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Current: {getProductStock(p)} {p.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">New Stock Quantity Level</label>
                        <input
                          type="number"
                          value={stockAdjustmentForm.newStock}
                          onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, newStock: Number(e.target.value) })}
                          className="w-full border border-slate-200 rounded p-2 font-mono font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">Adjustment Reason</label>
                        <input
                          type="text"
                          placeholder="e.g. Broken packaging, Discarded fruits"
                          value={stockAdjustmentForm.reason}
                          onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, reason: e.target.value })}
                          className="w-full border border-slate-200 rounded p-2"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display rounded-lg transition-transform text-xs"
                    >
                      Process Level Correction
                    </button>
                  </form>
                </div>

                {/* Adjustments history logs */}
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Valuation Adjustments Audit Trail
                  </h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                    {adjustments.slice().reverse().map((adj) => (
                      <div key={adj.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] font-mono flex justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{adj.productName}</p>
                          <p className="text-slate-500 text-[10px] mt-0.5">Reason: "{adj.reason}"</p>
                          <p className="text-slate-400 text-[9px]">Adjuster: {adj.adjustedBy} • {adj.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-slate-400 font-semibold text-[10px]">Stock modification</p>
                          <p className="text-amber-700 font-extrabold text-sm font-mono mt-0.5">
                            {adj.previousStock} &rarr; {adj.newStock}
                          </p>
                        </div>
                      </div>
                    ))}
                    {adjustments.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-xs text-sans">
                        No custom adjustments logged yet in database.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inter-Branch Inventory Transfers */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                    Inter-Branch Stock Transfers &amp; Approvals Tracking
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Ship inventory surplus between regional outlets with structural safety checks and balance transfers.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                  {/* Left Column: Initiate Form */}
                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Request New Stock Transfer</h4>
                    <form onSubmit={handleCreateTransferSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">Select Product</label>
                        <select
                          value={newTransferForm.productId}
                          onChange={(e) => setNewTransferForm({ ...newTransferForm, productId: e.target.value })}
                          className="w-full border border-slate-200 rounded p-2"
                        >
                          <option value="">-- Choose Product --</option>
                          {tenantProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Global SKU: {p.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-mono font-semibold mb-1">From Branch</label>
                          <select
                            value={newTransferForm.fromBranchId}
                            onChange={(e) => setNewTransferForm({ ...newTransferForm, fromBranchId: e.target.value })}
                            className="w-full border border-slate-200 rounded p-2"
                          >
                            <option value="">-- Origin --</option>
                            {branches.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-mono font-semibold mb-1">To Branch</label>
                          <select
                            value={newTransferForm.toBranchId}
                            onChange={(e) => setNewTransferForm({ ...newTransferForm, toBranchId: e.target.value })}
                            className="w-full border border-slate-200 rounded p-2"
                          >
                            <option value="">-- Destination --</option>
                            {branches.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">Transfer Qty</label>
                        <input
                          type="number"
                          value={newTransferForm.quantity}
                          onChange={(e) => setNewTransferForm({ ...newTransferForm, quantity: Number(e.target.value) })}
                          min="1"
                          className="w-full border border-slate-200 rounded p-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">Reason / Shift Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Stock replenishment, High Demand"
                          value={newTransferForm.remarks}
                          onChange={(e) => setNewTransferForm({ ...newTransferForm, remarks: e.target.value })}
                          className="w-full border border-slate-200 rounded p-2"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-xs cursor-pointer text-center"
                      >
                        File Transfer Proposal
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Ledger List / Actions */}
                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm col-span-2 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Branch Stock Shifting Ledger ({transfers.length} requests)</h4>
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                      {transfers.slice().reverse().map((t) => {
                        const fromName = branches.find((b) => b.id === t.fromBranchId)?.name || t.fromBranchId;
                        const toName = branches.find((b) => b.id === t.toBranchId)?.name || t.toBranchId;
                        const pDetail = tenantProducts.find((p) => p.id === t.productId);
                        const fromBranchStock = pDetail && pDetail.branchStocks ? (pDetail.branchStocks[t.fromBranchId] ?? 0) : 0;

                        return (
                          <div key={t.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-200 text-slate-700 font-black font-mono text-[9px] px-1.5 py-0.5 rounded leading-none">
                                  {t.id}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase leading-none ${
                                  t.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                                  t.status === "APPROVED" ? "bg-emerald-100 text-emerald-800 font-bold" :
                                  "bg-rose-100 text-rose-800"
                                }`}>
                                  {t.status}
                                </span>
                              </div>
                              <p className="font-bold text-slate-800 text-[12px]">{t.productName}</p>
                              <p className="text-[10px] text-slate-500">
                                Path: <span className="font-semibold text-slate-700 font-mono">{fromName}</span> &rarr; <span className="font-semibold text-slate-700 font-mono">{toName}</span>
                              </p>
                              <p className="text-[9px] text-slate-400">
                                Requested by: {t.requestedBy || "Staff Member"} on {t.requestedDate || "Today"}
                              </p>
                              {t.comments && (
                                <p className="text-[10px] bg-slate-100 border border-slate-200/50 p-1 rounded font-mono text-slate-500 mt-1">
                                  Response Note: "{t.comments}"
                                </p>
                              )}
                            </div>

                            <div className="text-right shrink-0 flex flex-col items-end gap-1">
                              <p className="text-[10px] text-slate-400 font-medium">Shipment payload</p>
                              <p className="text-slate-900 font-black font-mono text-base">
                                {t.quantity} <span className="text-xs font-normal text-slate-500">units</span>
                              </p>
                              <p className="text-[9px] font-mono text-slate-400">
                                (Origin Stock: {fromBranchStock} units)
                              </p>

                              {t.status === "PENDING" && (
                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={() => handleProcessTransfer(t.id, "APPROVED", "Accepted & cleared by store overseer")}
                                    className="px-2 py-0.5 text-[10px] bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded cursor-pointer font-bold"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleProcessTransfer(t.id, "REJECTED", "Denied due to local stock shortage")}
                                    className="px-2 py-0.5 text-[10px] bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded cursor-pointer font-bold"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {transfers.length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          ⚠️ No branch-wise stock transfers filed yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG CATALOGUE & BARCODE CREATION */}
          {activeTab === "products" && (
            <div className="grid grid-cols-3 gap-6 animate-fadeIn" id="products-module-layout">
              {/* Product Creation Form */}
              <div className="col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {newProduct.id ? (
                      <Edit2 className="w-5 h-5 text-amber-500" />
                    ) : (
                      <PlusCircle className="w-5 h-5 text-emerald-500" />
                    )}
                    {newProduct.id ? "Edit Catalog Product" : "Define New Retail Product Catalogue"}
                  </h3>
                
                <form onSubmit={handleCreateProductSubmit} className="space-y-3.5 text-xs text-slate-700">
                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Product Description Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Kirkland Signature Organic Milk 1.5L"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">SKU Code *</label>
                      <input
                        type="text"
                        placeholder="e.g. BEV-MILK-K1"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">UPC Barcode *</label>
                      <input
                        type="text"
                        placeholder="e.g. 8901262020213"
                        value={newProduct.barcode}
                        onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Category Bracket</label>
                      <select
                        value={newProduct.category || (productCategories.length > 0 ? productCategories[0] : "")}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2"
                      >
                        {productCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Measurement Unit</label>
                      <select
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value as MeasurementUnit })}
                        className="w-full border border-slate-200 rounded p-2"
                      >
                        <option value={MeasurementUnit.KG}>Kilogram (Kg)</option>
                        <option value={MeasurementUnit.LITER}>Liters (Liters)</option>
                        <option value={MeasurementUnit.PIECE}>Pieces (pcs)</option>
                        <option value={MeasurementUnit.PACK}>Packs (pk)</option>
                        <option value={MeasurementUnit.GRAM}>Grams (g)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">COGS Purchase (₹)</label>
                      <input
                        type="number"
                        value={newProduct.purchasePrice}
                        onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">MRP Price (₹)</label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">GST Slabs %</label>
                      <select
                        value={newProduct.gstRate}
                        onChange={(e) => setNewProduct({ ...newProduct, gstRate: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-1.5"
                      >
                        <option value={0}>0% GST</option>
                        <option value={5}>5% GST</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% GST</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Opening Stock</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Min Alert Stock Limit</label>
                      <input
                        type="number"
                        value={newProduct.minStockAlert}
                        onChange={(e) => setNewProduct({ ...newProduct, minStockAlert: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Batch Number</label>
                      <input
                        type="text"
                        value={newProduct.batchNumber}
                        onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={newProduct.expiryDate}
                        onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Assigned Vendor Supplier</label>
                    <select
                      value={newProduct.supplierName}
                      onChange={(e) => setNewProduct({ ...newProduct, supplierName: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2"
                    >
                      <option value="">-- Select Vendor --</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {newProduct.id && (
                      <button
                        type="button"
                        onClick={handleResetProductForm}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-sans rounded-lg tracking-wide transition-all uppercase shadow-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`py-2.5 text-white text-xs font-bold font-display rounded-lg tracking-wide transition-all uppercase shadow-sm cursor-pointer ${
                        newProduct.id 
                          ? "bg-amber-600 hover:bg-amber-700 flex-2" 
                          : "bg-emerald-600 hover:bg-emerald-700 w-full"
                      }`}
                    >
                      {newProduct.id ? "Update Product" : "Save Catalog Product Information"}
                    </button>
                  </div>
                </form>
              </div>

              {/* BULK ONBOARDING CARD */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4" id="bulk-onboarding-container">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-indigo-600" />
                    Bulk Retail Product Upload
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Register multiple inventory units at once. Drag/drop a catalog CSV or paste bulk rows below.
                  </p>
                </div>

                {/* Sample CSV Download and Tabs */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setBulkUploadTab("file")}
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition-colors ${
                        bulkUploadTab === "file" ? "bg-indigo-55 text-indigo-600" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      File
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkUploadTab("paste")}
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition-colors ${
                        bulkUploadTab === "paste" ? "bg-indigo-55 text-indigo-600" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      Paste Row
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const csvContent = "Name,SKU,Barcode,Category,PurchasePrice,Price,GSTRate,Unit,Stock,MinStockAlert,BatchNumber,ExpiryDate,SupplierName\n" +
                        '"Premium Basmati Rice 10Kg","GRN-BAS-R10","8901234567801","Grains & Grocery",890,1200,5,"Kg",60,15,"B-2026-X1","2027-12-31","Apex Retail Supplies"\n' +
                        '"Whole Wheat Flour 5Kg","GRN-ATT-W5","8901234567802","Grains & Grocery",180,240,0,"Kg",45,10,"B-2026-F2","2027-11-20","Apex Retail Supplies"';
                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.setAttribute("href", url);
                      link.setAttribute("download", "retail_products_bulk_template.csv");
                      link.style.visibility = "hidden";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      triggerNotification("Bulk template CSV file download triggered successfully.", "success");
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-755 rounded transition-colors flex shrink-0"
                  >
                    <Download className="w-3 h-3" /> Template
                  </button>
                </div>

                {/* UI Tab: File Upload (Drag & Drop) */}
                {bulkUploadTab === "file" && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setBulkIsDragging(true);
                    }}
                    onDragLeave={() => setBulkIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setBulkIsDragging(false);
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        if (file.name.endsWith(".csv") || file.name.endsWith(".json")) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const content = evt.target?.result as string;
                            handleBulkInputChange(content);
                          };
                          reader.readAsText(file);
                        } else {
                          triggerNotification("Please upload a valid .csv or .json formatted catalog file.", "warning");
                        }
                      }
                    }}
                    className={`border border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors ${
                      bulkIsDragging
                        ? "border-indigo-500 bg-indigo-50/20"
                        : bulkParsedProducts.length > 0
                        ? "border-emerald-300 bg-emerald-50/10"
                        : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50"
                    }`}
                    onClick={() => {
                      const fileInput = document.getElementById("bulk-file-selector2") as HTMLInputElement;
                      if (fileInput) fileInput.click();
                    }}
                  >
                    <input
                      type="file"
                      id="bulk-file-selector2"
                      accept=".csv,.json"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const file = files[0];
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const content = evt.target?.result as string;
                            handleBulkInputChange(content);
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                    <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <p className="text-[10px] font-bold text-slate-700">Drag &amp; Drop CSV / JSON file</p>
                    <p className="text-[9px] text-slate-400">or click to browse local folders</p>
                  </div>
                )}

                {/* UI Tab: Textarea paste */}
                {bulkUploadTab === "paste" && (
                  <div className="space-y-1.5">
                    <textarea
                      value={bulkInputText}
                      onChange={(e) => handleBulkInputChange(e.target.value)}
                      placeholder="Paste CSV lines or JSON array..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-colors"
                    />
                  </div>
                )}

                {/* Error Banner */}
                {bulkUploadError && (
                  <p className="text-[10px] text-rose-500 font-sans font-semibold bg-rose-50 p-2 rounded border border-rose-100 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {bulkUploadError}
                  </p>
                )}

                {/* Preview of Parsed Products */}
                {bulkParsedProducts.length > 0 && (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-2 py-1 text-[9px] font-extrabold text-slate-500 tracking-wider flex justify-between items-center border-b border-slate-100">
                      <span>PREVIEW ({bulkParsedProducts.length} items)</span>
                      <span className="text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                        {bulkParsedProducts.filter(p => p.isValid).length} READY
                      </span>
                    </div>
                    
                    <div className="max-h-[120px] overflow-y-auto divide-y divide-slate-100 text-[10px] font-sans">
                      {bulkParsedProducts.map((p, idx) => (
                        <div key={idx} className="p-1.5 flex items-start justify-between gap-1 bg-white">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800 truncate">{p.name || <em className="text-slate-400">No Name</em>}</p>
                            <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                              SKU: {p.sku || "--"} | Price: ₹{p.price || 0}
                            </p>
                          </div>
                          <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold uppercase shrink-0 ${
                            p.isValid ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          }`}>
                            {p.isValid ? "OK" : "Err"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 p-1.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkInputText("");
                          setBulkParsedProducts([]);
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-850 font-semibold px-1"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={handleBulkUploadSubmit}
                        disabled={bulkParsedProducts.filter(p => p.isValid).length === 0}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] uppercase px-3 py-1 rounded transition-colors flex items-center gap-1 font-sans cursor-pointer shadow-sm"
                      >
                        <Check className="w-3 h-3" /> Import Valid
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Master Barcode visual rendering engine */}
            <div className="col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Dynamic Simulated Barcode Catalogue &amp; Pricing</h3>
                      <p className="text-xs text-slate-400">Click SKU to view dynamic vector barcode representation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {tenantProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between hover:border-slate-400 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">{p.sku}</span>
                            <h4 className="text-xs font-bold text-slate-900 mt-0.5">{p.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">MRP: ₹{p.price.toFixed(2)} | Cost: ₹{p.purchasePrice.toFixed(2)}</p>
                            <p className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">Margin: +{Math.round(((p.price - p.purchasePrice) / p.price) * 100)}%</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setNewProduct(p);
                                triggerNotification(`Product "${p.name}" loaded into the editor form.`, "success");
                                const element = document.getElementById("products-module-layout");
                                if (element) {
                                  element.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-amber-50 hover:border-amber-200 flex items-center justify-center cursor-pointer transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-500 hover:text-amber-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center cursor-pointer transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerBarcodeGenerator(p.sku)}
                              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                              title="Print label barcode banner"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                          </div>
                        </div>

                        {/* Rendering dynamic SVG lines representing proper standard UPC-12 code simulated layout */}
                        <div className="mt-3 bg-white p-3 rounded border border-slate-100 flex flex-col items-center">
                          {activeBarcodeUrl === p.sku ? (
                            <div className="flex flex-col items-center space-y-1 select-none pointer-events-none">
                              {/* Custom SVG Barcode */}
                              <svg className="w-48 h-10 text-slate-950" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <rect x="2" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="4" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="7" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="9" y="0" width="3" height="20" fill="currentColor" />
                                <rect x="14" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="16" y="0" width="2" height="20" fill="currentColor" />
                                <rect x="20" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="23" y="0" width="2.5" height="20" fill="currentColor" />
                                <rect x="27" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="29" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="32" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="35" y="0" width="2.5" height="20" fill="currentColor" />
                                <rect x="39" y="0" width="3" height="20" fill="currentColor" />
                                <rect x="44" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="47" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="50" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="53" y="0" width="2" height="20" fill="currentColor" />
                                <rect x="57" y="0" width="4" height="20" fill="currentColor" />
                                <rect x="63" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="66" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="68" y="0" width="2.5" height="20" fill="currentColor" />
                                <rect x="72" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="75" y="0" width="3" height="20" fill="currentColor" />
                                <rect x="80" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="83" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="86" y="0" width="2" height="20" fill="currentColor" />
                                <rect x="89" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="91" y="0" width="3.5" height="20" fill="currentColor" />
                                <rect x="96" y="0" width="1.5" height="20" fill="currentColor" />
                              </svg>
                              <span className="text-[10px] font-mono tracking-widest text-slate-800 font-bold">{p.barcode}</span>
                              <span className="text-[8px] font-mono text-emerald-600 font-bold uppercase tracking-widest">label printed</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => triggerBarcodeGenerator(p.sku)}
                              className="text-[11px] font-mono text-slate-500 font-bold hover:text-emerald-600 cursor-pointer"
                            >
                              [ Click to preview scannable barcode tag ]
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIP CRM CUSTOMER MANAGEMENT & CREDITS */}
          {activeTab === "customers" && (
            <div className="grid grid-cols-3 gap-6 animate-fadeIn" id="crm-module-layout">
              {/* New Customer loyalty sign-up */}
              <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-max">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-500" />
                  Customer Registration
                </h3>
                <p className="text-xs text-slate-400">Add clients to automatically track loyalty points wallet and outstanding cash credits</p>

                <form onSubmit={handleCreateCustomerSubmit} className="space-y-3.5 text-xs text-slate-700">
                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar Patel"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9812456789"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Email Coordinates</label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@gmail.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Opening Loyalty Pts</label>
                      <input
                        type="number"
                        value={newCustomer.loyaltyPoints}
                        onChange={(e) => setNewCustomer({ ...newCustomer, loyaltyPoints: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Store Credit Wallet (₹)</label>
                      <input
                        type="number"
                        value={newCustomer.creditBalance}
                        onChange={(e) => setNewCustomer({ ...newCustomer, creditBalance: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display rounded-lg uppercase tracking-wide text-xs shadow-sm mt-3"
                  >
                    Register VIP Client Account
                  </button>
                </form>
              </div>

              {/* Verified Loyalty Lists */}
              <div className="col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">VIP Loyalty CRM Directory Database</h3>
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto relative">
                    <table className="w-full text-left font-sans text-xs">
                      <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                        <tr className="text-[10px] font-bold text-slate-400 bg-slate-50 uppercase select-none">
                          <th className="px-4 py-2.5 bg-slate-50">Loyalty Member ID</th>
                          <th className="px-4 py-2.5 bg-slate-50">Customer Name / Contact</th>
                          <th className="px-4 py-2.5 text-right font-mono bg-slate-50">Loyalty Points Balance</th>
                          <th className="px-4 py-2.5 text-right font-mono bg-slate-50">Assigned Credit Balance</th>
                          <th className="px-4 py-2.5 bg-slate-50">Account Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customers.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-mono text-slate-500 font-bold text-[11px]">{c.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-900">{c.name}</p>
                              <p className="text-[10px] font-mono text-slate-400">{c.phone} | {c.email || "No email"}</p>
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                              ⭐ {c.loyaltyPoints} Pts
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-rose-600 font-bold">
                              ₹{c.creditBalance.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-[10px] font-mono">{c.createdAt.slice(0, 10)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Simulated CRM metrics */}
                <div className="bg-gradient-to-r from-emerald-950 to-slate-900 p-6 rounded-xl text-white shadow-sm flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest mb-1">Smart Loyalty Conversion</h4>
                    <p className="text-sm text-slate-300">Award standard point calculations rule set: spend ₹100 to obtain 1 Loyalty Point automatically.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 px-2 py-1 rounded font-mono font-bold">
                      WhatsApp Billing Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SAVED BILLS & IN-SYSTEM VIRTUAL PRINTER SIMULATOR */}
          {activeTab === "saved-bills" && (
            <div className="grid grid-cols-12 gap-6 animate-fadeIn" id="saved-bills-module">
              {/* Left Side: Invoice/Receipt Registry - 5 Columns */}
              <div className="col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[750px]">
                <div className="space-y-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-500" />
                      Invoice Registry &amp; Reprint Center
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Search, view, and simulate printing of bills generated across all sessions.
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search Invoice ID, Cashier, Customer..."
                        value={reprintSearch}
                        onChange={(e) => setReprintSearch(e.target.value)}
                        className="pl-8 pr-3 py-2 w-full bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 font-sans"
                      />
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={reprintShowAllBranches}
                          onChange={(e) => setReprintShowAllBranches(e.target.checked)}
                          className="accent-slate-800 rounded cursor-pointer"
                        />
                        <span>Show other outlets/branches</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
                        {reprintFilteredInvoices.length} checkouts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Directory List Container */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                  {reprintFilteredInvoices.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-1.5 bg-slate-50/50">
                      <p className="font-bold text-slate-600 text-sm">No bills found</p>
                      <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto">
                        Check "Show other outlets" or adjust search keywords.
                      </p>
                    </div>
                  ) : (
                    reprintFilteredInvoices.slice().reverse().map((inv) => {
                      const isSelected = selectedReprintInvoiceId === inv.id;
                      return (
                        <div
                          key={inv.id}
                          onClick={() => {
                            setSelectedReprintInvoiceId(inv.id);
                            setIsVirtualPrinting(false);
                            setVirtualPrintDone(false);
                          }}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-start gap-2 ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20"
                              : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="space-y-1 overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10.5px] font-extrabold text-slate-900 leading-none">
                                #{inv.id.substring(inv.id.lastIndexOf("-") + 1 || 0)}
                              </span>
                              <span className="text-[9px] bg-slate-100 border text-slate-500 px-1.5 py-0.2 rounded font-mono font-bold leading-none">
                                {inv.storeBranchId}
                              </span>
                            </div>
                            <p className="font-sans font-bold text-slate-800 text-xs truncate">
                              {inv.customerName || "Guest Client"}
                            </p>
                            <p className="text-[9px] text-slate-400 font-mono leading-none">
                              Cashier: {inv.cashierName} • {inv.date} {inv.time}
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1 shrink-0">
                            <span className="font-mono font-black text-slate-900 text-xs">
                              ₹{inv.grandTotal.toFixed(2)}
                            </span>
                            <span className="text-[8.5px] font-mono font-bold uppercase px-1 rounded bg-slate-950 text-white">
                              {inv.paymentMode}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Side: Virtual Printer Terminal Console & Spooled Paper Preview - 7 Columns */}
              <div className="col-span-7 flex flex-col h-[750px] gap-6">
                {/* Simulator Options Panel */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <Printer className="w-5 h-5 text-emerald-500" />
                        Virtual Terminal Printer Simulator
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Test full thermal formatting, feed receipts, or run a high-fidelity sound-integrated print job.
                      </p>
                    </div>

                    {/* Sound and format control */}
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={soundEnabled}
                          onChange={(e) => setSoundEnabled(e.target.checked)}
                          className="accent-slate-800 rounded cursor-pointer"
                        />
                        <span>🔌 Play Sound FX</span>
                      </label>
                    </div>
                  </div>

                  {/* Formatting selectors */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-1 text-xs font-bold text-slate-500 flex items-center">
                      Paper Width:
                    </div>
                    <div className="col-span-3 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedPrinterLayout("thermal-80mm")}
                        className={`py-1.5 rounded-lg border font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          selectedPrinterLayout === "thermal-80mm"
                            ? "bg-slate-900 text-white border-slate-900 shadow"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>🧾 80mm POS Roll</span>
                      </button>
                      <button
                        onClick={() => setSelectedPrinterLayout("thermal-58mm")}
                        className={`py-1.5 rounded-lg border font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          selectedPrinterLayout === "thermal-58mm"
                            ? "bg-slate-900 text-white border-slate-900 shadow"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>🎟️ 58mm Handheld</span>
                      </button>
                      <button
                        onClick={() => setSelectedPrinterLayout("standard-a4")}
                        className={`py-1.5 rounded-lg border font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          selectedPrinterLayout === "standard-a4"
                            ? "bg-slate-900 text-white border-slate-900 shadow"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>🖨️ Office A4 Page</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Virtual Hardware Terminal Cabinet & Tape Roll */}
                <div className="flex-1 bg-slate-900 rounded-2xl border-4 border-slate-950 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                  {/* Skeuomorphic hardware status lights */}
                  <div className="absolute top-4 left-6 flex items-center gap-3 z-20">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                      <span className={`w-2.5 h-2.5 rounded-full ${isVirtualPrinting ? "bg-amber-500 animate-ping" : "bg-emerald-500"} shadow-inner`}></span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        {isVirtualPrinting ? "PRINTING..." : "PRINTER READY / ONLINE"}
                      </span>
                    </div>
                  </div>

                  {/* Top Feed Paper Slot / Blade Cut representation */}
                  <div className="absolute top-14 left-0 right-0 h-4 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800 shadow-inner z-10 flex items-center justify-center">
                    <div className="w-[90%] h-[2px] bg-slate-950 rounded-full shadow-[0_0_8px_rgba(0,0,0,1)]"></div>
                  </div>

                  {/* Virtual Thermal Paper roll scrolling container */}
                  <div className="flex-1 flex justify-center items-start pt-14 pb-16 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                    {selectedReprintInvoiceId ? (
                      (() => {
                        const selectedInv = invoices.find(inv => inv.id === selectedReprintInvoiceId);
                        if (!selectedInv) return null;
                        return (
                          <div
                            id="virtual-receipt-roll-wrapper"
                            className={`transition-all duration-1000 origin-top shadow-[0_15px_30px_rgba(0,0,0,0.4)] ${
                              isVirtualPrinting 
                                ? "animate-printFeed max-h-[800px] opacity-100" 
                                : virtualPrintDone 
                                ? "max-h-[800px] opacity-100" 
                                : "max-h-0 opacity-0 pointer-events-none"
                            }`}
                          >
                            {/* Inner receipt paper tape */}
                            <div 
                              className={`bg-white text-slate-900 font-mono text-[10px] p-5 border-x-2 border-dashed border-slate-300 relative ${
                                selectedPrinterLayout === "thermal-58mm" ? "w-[240px]" : selectedPrinterLayout === "standard-a4" ? "w-[450px]" : "w-[330px]"
                              }`}
                              style={{ 
                                backgroundImage: "linear-gradient(rgba(240,240,240,0.1) 1px, transparent 1px)",
                                backgroundSize: "100% 20px"
                              }}
                            >
                              {/* Thermal paper header teeth */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-[radial-gradient(circle,transparent_20%,#0f172a_21%)] bg-repeat-x bg-[length:6px_6px]" style={{ transform: "translateY(-4px)" }}></div>
                              
                              <div className="text-center space-y-1 mb-4 font-sans">
                                <h4 className="font-display font-black text-xs uppercase tracking-tight text-slate-950">
                                  ⭐ EXPERT POS HYPERMARKETS ⭐
                                </h4>
                                <p className="text-[9px] text-slate-500 font-mono font-semibold">
                                  {branches.find(b => b.id === selectedInv.storeBranchId)?.name || "Downtown Smart Hypermarket"}
                                </p>
                                <p className="text-[9.5px] text-slate-500 font-mono leading-tight">
                                  {branches.find(b => b.id === selectedInv.storeBranchId)?.address || "Central Plaza, Main Avenue, New Delhi"}
                                </p>
                                <p className="text-[8.5px] text-slate-400 font-mono">
                                  Phone: {branches.find(b => b.id === selectedInv.storeBranchId)?.phone || "811-23456789"}
                                </p>
                              </div>

                              <div className="border-t border-dashed border-slate-300 py-2 space-y-0.5 text-[9.5px]">
                                <div className="flex justify-between">
                                  <span>Invoice ID:</span>
                                  <span className="font-bold">{selectedInv.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>GSTIN Check:</span>
                                  <span className="font-bold uppercase">07AAAAA1111A1Z1</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Sales Cashier:</span>
                                  <span>{selectedInv.cashierName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Timestamp:</span>
                                  <span>{selectedInv.date} {selectedInv.time}</span>
                                </div>
                                {selectedInv.customerName && (
                                  <div className="flex justify-between border-t border-dashed border-slate-300 pt-1">
                                    <span>Loyalty Customer:</span>
                                    <span className="font-bold truncate max-w-[150px]">{selectedInv.customerName}</span>
                                  </div>
                                )}
                                {selectedInv.customerPhone && (
                                  <div className="flex justify-between">
                                    <span>Mobile No:</span>
                                    <span className="font-bold">{selectedInv.customerPhone}</span>
                                  </div>
                                )}
                              </div>

                              {/* Items list */}
                              <div className="border-t border-slate-300 py-2 space-y-1 text-[9px]">
                                <div className="grid grid-cols-4 font-bold border-b border-slate-200 pb-1 text-slate-950">
                                  <span className="col-span-2">Description Particular</span>
                                  <span className="text-right">Qty</span>
                                  <span className="text-right">Total</span>
                                </div>
                                {selectedInv.items.map((it, idx) => (
                                  <div key={idx} className="grid grid-cols-4 gap-1 text-slate-800">
                                    <span className="col-span-2 truncate font-sans text-[9.5px]">{it.name}</span>
                                    <span className="text-right">{it.quantity} {it.unit}</span>
                                    <span className="text-right font-bold">₹{(it.price * it.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Calculations */}
                              <div className="border-t border-dashed border-slate-300 pt-2 space-y-0.5 text-[9.5px]">
                                <div className="flex justify-between">
                                  <span>Basket Tax (GST):</span>
                                  <span>₹{selectedInv.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Promo discount code:</span>
                                  <span>{selectedInv.couponCode ? `-${showInvoicePrintPercentApplied(selectedInv)}` : "₹0.00"}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black text-slate-950 border-t border-dashed border-slate-300 pt-1.5">
                                  <span>TOTAL NET PAYABLE:</span>
                                  <span>₹{selectedInv.grandTotal.toFixed(2)}</span>
                                </div>
                                {selectedInv.paymentMode === PaymentMode.CASH && (
                                  <>
                                    <div className="flex justify-between p-0.5 mt-1 bg-slate-100 rounded text-slate-700">
                                      <span>Tendered Cash:</span>
                                      <span>₹{Number(selectedInv.cashReceived || selectedInv.grandTotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-700">
                                      <span>Returned Change:</span>
                                      <span>₹{Number(selectedInv.changeReturned || 0).toFixed(2)}</span>
                                    </div>
                                  </>
                                )}
                                <div className="flex justify-between items-center pt-1">
                                  <span>Tender Mode:</span>
                                  <span className="font-extrabold text-[8.5px] bg-slate-950 text-white px-1.5 py-0.2 rounded">{selectedInv.paymentMode}</span>
                                </div>
                              </div>

                              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[8.5px] font-sans leading-normal text-center text-slate-500 mt-4">
                                ⭐ Loyalty members: spent ₹{selectedInv.grandTotal} to award +{Math.floor(selectedInv.grandTotal/10)} Loyalty Points dynamically.<br />Thank you for shopping at Expert POS!
                              </div>

                              {/* Thermal paper tear teeth at bottom */}
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[radial-gradient(circle,transparent_20%,#0f172a_21%)] bg-repeat-x bg-[length:6px_6px] rotate-180" style={{ transform: "translateY(4px)" }}></div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center py-24 text-slate-500 max-w-sm space-y-4 font-sans select-none my-auto">
                        <div className="w-16 h-16 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center mx-auto shadow-inner text-2xl">
                          📥
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-200">No Receipt Loaded</p>
                          <p className="text-[11px] text-slate-400">
                            Select any invoice bill from the left registry panel to inspect its print layout and print-preview without physical printers.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom mechanical/visual bezel controls */}
                  <div className="h-14 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-slate-800 -mx-6 -mb-6 px-6 flex items-center justify-between shadow-2xl z-10">
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-black">
                      EXP-AID Virtual Spooler Node 2.4
                    </span>

                    <div className="flex gap-2">
                      {selectedReprintInvoiceId && (
                        <>
                          <button
                            type="button"
                            disabled={isVirtualPrinting}
                            onClick={async () => {
                              setIsVirtualPrinting(true);
                              setVirtualPrintDone(false);
                              if (soundEnabled) {
                                playThermalPrintSound();
                              }
                              triggerNotification("Sending print job to virtual paper spooler...", "success");
                              setTimeout(() => {
                                setIsVirtualPrinting(false);
                                setVirtualPrintDone(true);
                                triggerNotification("Printed successfully! Receipt is spooled on-screen. Copy text or save offline PDF below.", "success");
                              }, 1300);
                            }}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-extrabold uppercase rounded border border-emerald-600 shadow-sm shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{virtualPrintDone ? "Feed Paper Print again" : "Virtual Print / Spool Paper"}</span>
                          </button>

                          {virtualPrintDone && (
                            <>
                              <button
                                type="button"
                                onClick={async () => {
                                  const selectedInv = invoices.find(inv => inv.id === selectedReprintInvoiceId);
                                  if (!selectedInv) return;
                                  triggerNotification("Downloading high-fidelity PDF...", "success");
                                  const success = await saveElementAsPDF("virtual-receipt-roll-wrapper", `Receipt-${selectedInv.id}.pdf`, selectedPrinterLayout);
                                  if (success) {
                                    triggerNotification("PDF receipt downloaded successfully to local system.", "success");
                                  } else {
                                    triggerNotification("Failed to generate PDF receipt.", "warning");
                                  }
                                }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-extrabold uppercase rounded border border-blue-700 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Save PDF</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const selectedInv = invoices.find(inv => inv.id === selectedReprintInvoiceId);
                                  if (!selectedInv) return;
                                  
                                  const itemsText = selectedInv.items.map(it => `[${it.quantity} ${it.unit}] ${it.name} @ ₹${it.price} = ₹${(it.price * it.quantity).toFixed(2)}`).join("\n");
                                  const textCopy = `
========================================
        EXPERT POS HYPERMARKETS
========================================
Invoice ID: ${selectedInv.id}
Timestamp:  ${selectedInv.date} ${selectedInv.time}
Cashier:    ${selectedInv.cashierName}
----------------------------------------
Particular Description:
${itemsText}
----------------------------------------
Basket Tax GST: ₹${selectedInv.taxAmount.toFixed(2)}
Promo Code:     ${selectedInv.couponCode || "None"}
TOTAL PAYABLE:  ₹${selectedInv.grandTotal.toFixed(2)}
Payment Mode:   ${selectedInv.paymentMode}
========================================
  Thank you for shopping at Expert POS!
========================================
`;
                                  navigator.clipboard.writeText(textCopy.trim());
                                  triggerNotification("Copied high-fidelity plain text receipt to system clipboard!", "success");
                                }}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-extrabold uppercase rounded border border-slate-700 shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Text</span>
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BRANCH STORES, EXPENSES, & CASH SESSIONS */}
          {activeTab === "expenses" && (
            <div className="grid grid-cols-2 gap-6 animate-fadeIn" id="stores-module-layout">
              {/* Cash shifting session management */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    Retail Drawer Sessions / Cashier terminal Shift
                  </h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${activeSession ? "bg-emerald-500 text-slate-950 animate-pulse" : "bg-slate-200 text-slate-600"}`}>
                    {activeSession ? "TERMINAL ACTIVE" : "DRAWER LOCKED"}
                  </span>
                </div>

                {!activeSession ? (
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                    <p className="text-xs text-slate-500">
                      Open a local checkout session register to audit drawer transactions. Supply float cash amount:
                    </p>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">DRAWER FLOAT CASH balance (₹)</label>
                      <input
                        type="number"
                        value={openingBalance}
                        onChange={(e) => setOpeningBalance(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded p-2 text-xs font-mono font-bold text-slate-800"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const sess: CashSession = {
                          id: `SESS-${Date.now()}`,
                          cashierId: "CS-042",
                          cashierName: currentCashierName,
                          startTime: new Date().toLocaleTimeString(),
                          openingBalance,
                          salesCash: totalInvoicedRevenue * 0.4, // compute simulation split
                          salesUpi: totalInvoicedRevenue * 0.4,
                          salesCard: totalInvoicedRevenue * 0.2,
                          status: "OPEN"
                        };
                        setActiveSession(sess);
                        setCashSessions((prev) => [...prev, sess]);
                        triggerNotification(`Cashier drawer shift opened float: ₹${openingBalance}`, "success");
                      }}
                      className="w-full py-2 bg-emerald-600 text-slate-950 hover:bg-emerald-500 font-bold text-xs rounded-lg transition-transform"
                    >
                      Initialize Register Opening
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-4 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Shift Leader Cashier:</span>
                      <span className="text-white font-bold font-sans">{activeSession.cashierName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shift Start Time:</span>
                      <span className="text-white">{activeSession.startTime}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span>Opening Drawer Cash:</span>
                        <span>₹{activeSession.openingBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Simulated Card POS Log:</span>
                        <span>₹{activeSession.salesCard.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Simulated UPI Digital:</span>
                        <span>₹{activeSession.salesUpi.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold text-xs">
                        <span>Simulated CASH Payments:</span>
                        <span>+₹{activeSession.salesCash.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-2">
                      <label className="block text-slate-400 mb-1">AUDITED CASH IN DRAWER AT CLOSE (₹)</label>
                      <input
                        type="number"
                        placeholder="Type counted paper money"
                        value={actualCashDrawer}
                        onChange={(e) => setActualCashDrawer(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded text-slate-100 p-2 text-xs font-mono font-extrabold text-emerald-400"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const targetAmt = activeSession.openingBalance + activeSession.salesCash;
                        const difference = actualCashDrawer - targetAmt;
                        const finalCopy = {
                          ...activeSession,
                          endTime: new Date().toLocaleTimeString(),
                          closingBalance: targetAmt,
                          actualCashInDrawer: actualCashDrawer,
                          difference,
                          status: "CLOSED" as "CLOSED"
                        };
                        setCashSessions((prev) => prev.map(s => s.id === activeSession.id ? finalCopy : s));
                        setActiveSession(null);
                        setActualCashDrawer(0);
                        triggerNotification(
                          `Register shift terminated. Drawer difference is ₹${difference.toFixed(2)}`,
                          difference < 0 ? "warning" : "success"
                        );
                      }}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg uppercase tracking-wide"
                    >
                      Audit &amp; Terminate Cash Drawer Session
                    </button>
                  </div>
                )}

                {/* Audit trail list */}
                <div>
                  <h4 className="text-[11px] font-mono font-bold uppercase text-slate-400 mb-2">Previous Registers Cash Shifts</h4>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto font-mono text-[10px]">
                    {cashSessions.map((c) => (
                      <div key={c.id} className="p-2 bg-slate-50 border border-slate-100 rounded flex justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{c.cashierName} shift</p>
                          <p className="text-[9px] text-slate-400">Opened float: ₹{c.openingBalance} | Start: {c.startTime}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-1.5 rounded font-bold uppercase text-[9px] ${c.status === "CLOSED" ? "bg-slate-200 text-slate-700" : "bg-emerald-500/20 text-emerald-700 animate-pulse"}`}>
                            {c.status}
                          </span>
                          {c.difference !== undefined && (
                            <p className={`font-mono font-black mt-1 ${c.difference < 0 ? "text-rose-600" : "text-emerald-700"}`}>
                              Var: ₹{c.difference.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expense Tracker Logbook */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-rose-500" />
                    Branch operational utility &amp; payroll Expense Ledgers
                  </h3>
                  <span className="text-rose-600 font-mono font-bold text-xs">Total payout: ₹{totalStoreExpenses}</span>
                </div>

                <form onSubmit={handleCreateExpenseSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Expense Category</label>
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        className="w-full border border-slate-200 rounded p-1.5"
                      >
                        <option value="Utility (Electricity)">Utility (Electricity)</option>
                        <option value="Store Branding">Store Branding</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Staff Refreshments">Staff Refreshments</option>
                        <option value="Emergency Maintenance">Emergency Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Cash amount (₹) *</label>
                      <input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-1.5 font-mono font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Voucher Description details *</label>
                    <input
                      type="text"
                      placeholder="e.g. Paid tea supply & custom sign repairs"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2 text-slate-800"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-950 text-emerald-400 font-bold text-xs font-display rounded-lg uppercase transition-transform"
                  >
                    File Ledger Payout
                  </button>
                </form>

                {/* Expenses register */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 font-mono text-[11px]">
                  {expenses.slice().reverse().map((exp) => (
                    <div key={exp.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{exp.category}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">"{exp.description}"</p>
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded uppercase">{exp.storeBranchId}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-rose-600 font-extrabold text-sm font-mono">-₹{exp.amount}</p>
                        <p className="text-slate-400 text-[9px] mt-1">{exp.approvedBy} approved</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS & SALES REPORT */}
          {activeTab === "analytics" && (
            <div className="space-y-6" id="analytics-module-layout">
              {/* Gross stats grid */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/10 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-6 opacity-10">
                    <TrendingUp className="w-20 h-20 text-emerald-600" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gross Sales Revenue</h4>
                  <p className="text-3xl font-black font-mono text-slate-900">₹{totalInvoicedRevenue.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Simulated overall POS turnovers</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Suppliers Cost of Goods (COGS)</h4>
                  <p className="text-3xl font-black font-mono text-slate-900">₹{totalWarehouseCOGS.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Valued purchase cost ledger</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-rose-500/10 bg-rose-50/5 shadow-sm relative overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Filed Store Expenses</h4>
                  <p className="text-3xl font-black font-mono text-rose-600">₹{totalStoreExpenses.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Utility costs & Logistics paid</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-250 bg-gradient-to-br from-emerald-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono mb-1">Calculated Net Profit</h4>
                  <p className="text-3xl font-black font-mono text-emerald-400">₹{calculatedOperationalNetProfit.toFixed(2)}</p>
                  <p className="text-xs text-slate-300 mt-2">Revenue minus COGS & Expenses</p>
                </div>
              </div>

              {/* Dynamic SVG Visual Charts */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center text-slate-800">
                    <h3 className="text-sm font-bold">Category Distribution (Stock Items Volume)</h3>
                    <span className="text-xs text-slate-500 font-mono">Dynamic Bar visualization</span>
                  </div>

                  {/* Built responsive HTML/CSS bar visualization for complete stability */}
                  <div className="space-y-3 pt-4">
                    {Array.from(new Set(tenantProducts.map(p => p.category))).map((cat) => {
                      const categoryVolume = tenantProducts.filter(p => p.category === cat).reduce((acc, currentItem) => acc + getProductStock(currentItem), 0);
                      const totalStockAll = tenantProducts.reduce((acc, p) => acc + getProductStock(p), 1);
                      const percentage = Math.round((categoryVolume / totalStockAll) * 100);

                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700">{cat}</span>
                            <span className="font-mono font-medium text-slate-500">{categoryVolume} items ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.max(4, percentage)}%` }}
                              className="h-full bg-emerald-600 rounded-full transition-all"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tax Ledger Liability breakdown list */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">GST / VAT Liability Ledgers</h3>
                  <p className="text-xs text-slate-400">Total legal taxable values registered across tax brackets</p>
                  
                  <div className="space-y-3.5 pt-2 text-xs font-mono">
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Standard Luxury Tax bracket (18% GST)</p>
                        <p className="text-[10px] text-slate-400">Applies to beverages and snack items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          ₹{(totalTaxGSTLiability * 0.45).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Filed</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Intermediate Groceries slab (12% GST)</p>
                        <p className="text-[10px] text-slate-400 font-sans font-normal">Dairy, spreads & butter commodities</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          ₹{(totalTaxGSTLiability * 0.35).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Filed</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Essential Produce slab (5% GST)</p>
                        <p className="text-[10px] text-slate-400">Fresh imports, apples, premium milk</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          ₹{(totalTaxGSTLiability * 0.20).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Filed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "super-admin" && currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super") && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              <SuperAdminConsole
                credentialsList={credentialsList}
                onUpdateCredentials={(newList) => {
                  setCredentialsList(newList);
                  localStorage.setItem("expert_aid_credentials", JSON.stringify(newList));
                }}
                triggerNotification={triggerNotification}
                tenantsList={tenantsList}
                onUpdateTenants={setTenantsList}
                activeTenantId={activeTenantId}
                onSelectTenant={(id) => {
                  setActiveTenantId(id);
                  localStorage.setItem("expert_aid_active_tenant_id", id);
                }}
              />
            </div>
          )}

          {activeTab === "staff-registry" && (currentRole === UserRole.ADMIN || currentRole === UserRole.MANAGER) && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              <StaffRegistry
                credentialsList={credentialsList}
                onUpdateCredentials={(newList) => {
                  setCredentialsList(newList);
                  localStorage.setItem("expert_aid_credentials", JSON.stringify(newList));
                }}
                triggerNotification={triggerNotification}
                activeTenant={activeTenant}
                branches={branches}
                currentRole={currentRole}
                currentBranch={currentBranch}
                currentTheme={currentTheme}
              />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              <SettingsPanel
                currentUserEmail={currentUserEmail}
                currentRole={currentRole}
                currentCashierName={currentCashierName}
                onUpdateCashierName={setCurrentCashierName}
                credentialsList={credentialsList}
                onUpdateCredentials={(newList) => {
                  setCredentialsList(newList);
                  localStorage.setItem("expert_aid_credentials", JSON.stringify(newList));
                }}
                activeTenant={activeTenant}
                onUpdateTenant={(updatedTenant) => {
                  const updatedList = tenantsList.map(t => t.id === updatedTenant.id ? updatedTenant : t);
                  setTenantsList(updatedList);
                  localStorage.setItem("expert_aid_tenants", JSON.stringify(updatedList));
                }}
                triggerNotification={triggerNotification}
                productCategories={productCategories}
                onUpdateProductCategories={(newCats) => {
                  setProductCategories(newCats);
                  localStorage.setItem("expert_aid_product_categories", JSON.stringify(newCats));
                }}
                suppliers={suppliers}
                onAddSupplier={handleAddSupplier}
                onDeleteSupplier={handleDeleteSupplier}
                branches={branches}
                onAddBranch={handleAddBranch}
                onDeleteBranch={handleDeleteBranch}
                currentBranch={currentBranch}
                onSwitchBranch={handleBranchChange}
              />
            </div>
          )}

        </div>
      </div>

      {/* RETAIL THERMAL INVOICE PRINT SIMULATION (MODAL LAYER) */}
      {showInvoicePrintPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 py-12 px-4 flex items-center justify-center no-print">
          <div className="bg-white max-w-sm w-full p-6 h-auto max-h-[90vh] overflow-y-auto rounded-3xl border-4 border-slate-900 shadow-2xl space-y-4 ring-8 ring-slate-900/30">
            {/* Modal Heading */}
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                Print preview
              </span>
              <button
                onClick={() => setShowInvoicePrintPreview(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                [ close window ]
              </button>
            </div>

            {/* Target Printer Layout Selector */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                Select Printer Type / Page Layout
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[9px]">
                <button
                  type="button"
                  onClick={() => setSelectedPrinterLayout("standard-a4")}
                  className={`py-1.5 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedPrinterLayout === "standard-a4"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm mb-0.5">🖨️</span>
                  <span>Office A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPrinterLayout("thermal-80mm")}
                  className={`py-1.5 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedPrinterLayout === "thermal-80mm"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm mb-0.5">🧾</span>
                  <span>POS 80mm</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPrinterLayout("thermal-58mm")}
                  className={`py-1.5 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedPrinterLayout === "thermal-58mm"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm mb-0.5">🎟️</span>
                  <span>POS 58mm</span>
                </button>
              </div>
              <p className="text-[9px] text-slate-500 font-medium leading-tight text-center pt-0.5">
                {selectedPrinterLayout === "standard-a4" 
                  ? "✓ Formats beautifully for any normal Laser/Inkjet (A4 / Letter) desktop printer." 
                  : selectedPrinterLayout === "thermal-80mm"
                  ? "✓ Formats perfectly for standard 3-inch roll POS receipt printers."
                  : "✓ Formats tightly for mini 2-inch roll handheld thermal printers."}
              </p>
              {typeof window !== "undefined" && window.self !== window.top && (
                <div className="mt-1.5 p-2 bg-amber-50 rounded-xl border border-amber-200 text-[9px] font-semibold leading-normal text-amber-800 text-left">
                  <strong>ℹ️ Print Preview & Saving:</strong> Since you are running in the sandbox workspace, browser print popups are restricted in the iframe. Click <strong>"Save PDF Receipt"</strong> below to instantly compile and download a high-fidelity PDF formatted to your choice to save locally!
                </div>
              )}
            </div>

            {/* Thermal Receipt Body */}
            <div className="bg-amber-50/20 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-3" id="invoice-receipt-theme">
              <div className="text-center font-sans space-y-1">
                <h4 className="font-display font-black text-sm tracking-tight text-slate-900">
                  EXPERT POS HYPERMARKETS
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  {currentBranch?.name || "Branch #01 Outlet"}
                </p>
                <p className="text-[10px] text-slate-500 font-mono leading-none">
                  {currentBranch?.address}, {currentBranch?.city}
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  Contact: {currentBranch?.phone}
                </p>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Invoice ID:</span>
                  <span className="font-bold">{showInvoicePrintPreview.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>GSTIN Check:</span>
                  <span className="font-bold uppercase">07AAAAA1111A1Z1</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Cashier:</span>
                  <span>{showInvoicePrintPreview.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span>{showInvoicePrintPreview.date} {showInvoicePrintPreview.time}</span>
                </div>
                {showInvoicePrintPreview.customerName && (
                  <div className="flex justify-between border-t border-dashed border-slate-300 pt-1">
                    <span>Customer:</span>
                    <span className="font-bold truncate max-w-[150px]">{showInvoicePrintPreview.customerName}</span>
                  </div>
                )}
                {showInvoicePrintPreview.customerPhone && (
                  <div className="flex justify-between">
                    <span>Mobile No:</span>
                    <span className="font-bold">{showInvoicePrintPreview.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border-t border-slate-300 pt-2 space-y-2">
                <div className="grid grid-cols-4 font-bold border-b border-slate-300 pb-1 text-slate-900">
                  <span className="col-span-2">Particular Description</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Price</span>
                </div>
                {showInvoicePrintPreview.items.map((it) => (
                  <div key={it.productId} className="grid grid-cols-4 gap-1">
                    <span className="col-span-2 truncate font-sans text-[10px]">{it.name}</span>
                    <span className="text-right">{it.quantity} {it.unit}</span>
                    <span className="text-right font-bold">₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Math */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Basket Tax value:</span>
                  <span>₹{showInvoicePrintPreview.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Promo discount code:</span>
                  <span>{showInvoicePrintPreview.couponCode ? `-${showInvoicePrintPercentApplied(showInvoicePrintPreview)}` : "₹0.00"}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-950 border-t border-dashed border-slate-300 pt-1.5">
                  <span>TOTAL PAYABLE:</span>
                  <span>₹{showInvoicePrintPreview.grandTotal.toFixed(2)}</span>
                </div>
                {showInvoicePrintPreview.paymentMode === PaymentMode.CASH && (
                  <>
                    <div className="flex justify-between p-0.5 mt-1 bg-slate-100 rounded">
                      <span>Paper Cash Tendered:</span>
                      <span>₹{Number(showInvoicePrintPreview.cashReceived).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Change Re-delivered:</span>
                      <span>₹{Number(showInvoicePrintPreview.changeReturned).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-bold font-sans text-[10px] bg-slate-900 text-white px-1.5 rounded">{showInvoicePrintPreview.paymentMode}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded text-[9px] font-sans leading-tight text-center text-slate-500 border border-slate-200">
                ⭐ Loyalty members: spent ₹{showInvoicePrintPreview.grandTotal} to award +{Math.floor(showInvoicePrintPreview.grandTotal/10)} Loyalty Points dynamically.<br />Thank you for shopping at Expert POS!
              </div>
            </div>

            {/* Print triggers */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={async () => {
                  triggerNotification(`Initiating print receipt request for ${selectedPrinterLayout === 'standard-a4' ? 'Standard Printer' : 'Thermal Printer'}...`, "success");
                  const success = await printElementById("invoice-receipt-theme", selectedPrinterLayout);
                  if (success) {
                    triggerNotification("Print job compiled successfully! Check your printer dialog or downloads folder.", "success");
                  } else {
                    triggerNotification("Print spool / PDF compilation failed.", "warning");
                  }
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold font-display tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                Spool Paper Print Receipt
              </button>

              <button
                type="button"
                onClick={async () => {
                  triggerNotification(`Compiling high-fidelity PDF copy of receipt and launching local downloader...`, "success");
                  const success = await saveElementAsPDF("invoice-receipt-theme", `Receipt-${showInvoicePrintPreview.id}.pdf`, selectedPrinterLayout);
                  if (success) {
                    triggerNotification("PDF receipt downloaded successfully to local system.", "success");
                  } else {
                    triggerNotification("Failed to generate PDF receipt.", "warning");
                  }
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold font-display tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4 text-blue-100" />
                Save PDF Receipt
              </button>

              <div className="border-t border-slate-200 pt-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    const billId = showInvoicePrintPreview.id;
                    setShowInvoicePrintPreview(null);
                    setSelectedReprintInvoiceId(billId);
                    setActiveTab("saved-bills");
                    setIsVirtualPrinting(false);
                    setVirtualPrintDone(false);
                    triggerNotification("Opened Virtual Printer Simulator! Click 'Virtual Print / Spool Paper' below.", "success");
                  }}
                  className="w-full py-2 bg-emerald-550 hover:bg-emerald-600 text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🔌 Open Virtual Printer Simulator</span>
                </button>
                <p className="text-[8.5px] text-slate-400 font-mono text-center mt-1 leading-normal">
                  No hardware printer connected? Use our in-system skeuomorphic virtual spooler with mechanical sounds and paper feed effects!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DELETION CONFIRMATION DIALOG (IFRAME SECURE MODAL) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl border border-slate-200 shadow-2xl space-y-4 animate-scaleUp">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Delete Product from Catalogue?</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Are you sure you want to permanently delete <strong className="text-rose-600 font-semibold">"{productToDelete.name}"</strong>? This action will remove the product and update your store catalog instantly.
              </p>
            </div>
            
            <div className="flex gap-2.5 pt-1.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProductConfirm}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-sans font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm shadow-rose-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Discount amount formatter helper inside Print modal
function showInvoicePrintPercentApplied(inv: Invoice) {
  return `${inv.discountPercent}% (-₹${inv.discountAmount.toFixed(2)})`;
}
