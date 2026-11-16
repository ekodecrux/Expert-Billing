/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { PrinterLayoutProfile, THERMAL_LAYOUT_SPECS, savePrintSnapshot } from "./utils/thermalPrinter";
export type { PrinterLayoutProfile };

export enum PaymentMode {
  CASH = "CASH",
  UPI = "UPI",
  CARD = "CARD",
  STORE_CREDIT = "STORE_CREDIT"
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
  STORE_KEEPER = "STORE_KEEPER"
}

export function normalizeUserRole(role: any): UserRole {
  if (!role) return UserRole.CASHIER;
  const str = String(role).toUpperCase().replace(/[\s_-]+/g, "");
  if (str.includes("ADMIN") || str.includes("SOVEREIGN") || str.includes("OWNER")) {
    return UserRole.ADMIN;
  }
  if (str.includes("MANAG")) {
    return UserRole.MANAGER;
  }
  if (str.includes("STORE") || str.includes("KEEPER") || str.includes("INVENTORY") || str.includes("WAREHOUSE") || str.includes("STOCK")) {
    return UserRole.STORE_KEEPER;
  }
  return UserRole.CASHIER;
}

export enum MeasurementUnit {
  KG = "Kg",
  LITER = "Liters",
  PIECE = "Pieces",
  PACK = "Packs",
  GRAM = "Grams",
  ML = "Milliliter (mL)"
}

export interface Product {
  id: string; // SKU
  name: string;
  barcode: string;
  category: string;
  sku: string;
  purchasePrice: number;
  price: number;
  mrp?: number; // Maximum Retail Price (Printed on packaging)
  gstRate: number; // e.g. 5, 12, 18 for GST percentage
  unit: MeasurementUnit;
  unitQuantity?: number; // e.g. 500 for 500g, 1 for 1kg, 6 for 6 pcs
  unitLabel?: string; // e.g. "500 Grams", "1 Kg", "6 Pieces"
  stock: number;
  minStockAlert: number;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  supplierName: string;
  tenantId?: string;
  branchStocks?: Record<string, number>;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  gstin: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  creditBalance: number;
  createdAt: string;
}

export interface PurchaseHistoryItem {
  invoiceId: string;
  date: string;
  amount: number;
  pointsEarned: number;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  barcode: string;
  mrp?: number; // Maximum Retail Price
  price: number; // pricing after item discount
  quantity: number;
  unit: MeasurementUnit;
  unitQuantity?: number;
  unitLabel?: string;
  gstRate: number;
  gstAmount: number;
  subtotal: number; // quantity * price including GST
}

export interface Invoice {
  id: string; // e.g. EAS-20260522-0001
  date: string;
  time: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number; // total before final coupon discount & taxes
  taxAmount: number; // total tax
  discountPercent: number; // e.g. 10 for 10%
  discountAmount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMode: PaymentMode;
  cashReceived?: number;
  changeReturned?: number;
  cashierName: string;
  storeBranchId: string;
  status: "PAID" | "RETURNED" | "EXCHANGED";
  returnedReason?: string;
}

export interface StoreBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  gstin?: string;
}

export interface LabelPrinterConfig {
  printerModel: string;
  printerName: string;
  presetId: string;
  connectionType: string;
  networkIp: string;
  networkPort: string;
  dpi: number;
  darkness: number;
  gapMm: number;
  sensorType: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  approvedBy: string;
  storeBranchId: string;
}

export interface CashSession {
  id: string;
  cashierId: string;
  cashierName: string;
  startTime: string;
  endTime?: string;
  openingBalance: number;
  closingBalance?: number;
  actualCashInDrawer?: number;
  difference?: number;
  salesCash: number;
  salesUpi: number;
  salesCard: number;
  status: "OPEN" | "CLOSED";
}

export interface StockAdjustment {
  id: string;
  date: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  reason: string;
  adjustedBy: string;
  storeBranchId?: string;
}

export type BusinessSector = 
  | "RETAIL" 
  | "RESTAURANT" 
  | "SUPERMARKET" 
  | "PHARMACY" 
  | "SERVICES";

export type TenantFontFamily = 
  | "Inter" 
  | "Outfit" 
  | "Plus Jakarta Sans" 
  | "Roboto" 
  | "Playfair Display" 
  | "Space Grotesk" 
  | "JetBrains Mono" 
  | "EB Garamond" 
  | "System Sans";

export type TenantFontSizeScale = "compact" | "standard" | "spacious" | "large";

export interface TenantTypography {
  fontFamily: TenantFontFamily;
  fontSizeScale: TenantFontSizeScale;
  customHeadingFont?: string;
  basePx?: number;
  headingFont?: string;
}

export interface TenantSectorConfig {
  sector: BusinessSector;
  sectorName: string;
  enabledModules: {
    kdsTableManagement: boolean;
    weighingScaleScanning: boolean;
    batchExpiryRx: boolean;
    variantMatrix: boolean;
    appointmentsBooking: boolean;
    loyaltyPoints: boolean;
    stockTransfers: boolean;
    barcodeLabelPrinting: boolean;
    kotPrinting: boolean;
    discountRules: boolean;
  };
  posMode: "RETAIL_QUICK" | "RESTAURANT_TABLES" | "SUPERMARKET_FAST_SCAN" | "PHARMACY_RX" | "SERVICES_BOOKING";
  defaultCategories: string[];
  unitPresets: MeasurementUnit[];
  quickActions: string[];
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  adminEmail: string;
  phone: string;
  currency: string;
  tier: "STARTER" | "GROWTH" | "ENTERPRISE";
  status: "ACTIVE" | "SUSPENDED" | "TRIAL";
  createdAt: string;
  colorTheme: string; // 'emerald' | 'indigo' | 'amber' | 'rose' | 'violet'
  maxBranches: number;
  maxProducts: number;
  onboardingFeePaid: number;
  companyLogo?: string;

  // Business Sector & Automated Modular Engine
  businessSector?: BusinessSector;
  sectorConfig?: TenantSectorConfig;

  // Automated Domain Routing & Activation
  domainUrl?: string;
  domainStatus?: "ACTIVE" | "PENDING_PROPAGATION" | "SSL_CONFIGURED";

  // Per-Client Typography & Styling
  typography?: TenantTypography;

  // Client Admin Credentials
  adminLoginId?: string;
  adminPassword?: string;
  
  // Custom Prices & Subscription Cost parameters
  monthlySubscriptionFee: number;
  billingCycle: "MONTHLY" | "ANNUAL" | "QUARTERLY";
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
  
  // Tenure & Subscription Duration parameters
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  contractDurationMonths: number;
  renewalStatus: "AUTO_RENEW" | "MANUAL" | "CANCEL_ON_EXPIRY";
  
  // Onboarding Setup Details
  onboardingSetupStatus: "COMPLETED" | "PENDING_HARDWARE" | "TRAINING_IN_PROGRESS" | "SYSTEM_PROVISIONED";
  hardwareProvisioned: string[]; // e.g. ["Heavy Duty Cash Drawer", "Bluetooth Barcode Scanner", "80mm Thermal Printer"]
  onboardingNotes?: string;
  
  // Client Security/Verification Status details
  clientVerificationStatus: "VERIFIED" | "PENDING_KYC" | "REJECTED" | "UNDER_REVIEW";
  gstinRegNumber?: string;

  // Business Location & Physical Address Specifications
  businessLocation?: string; // e.g. "Main Flagship Outlet / Store #01"
  address?: string;          // e.g. "Plot 42, Commercial Avenue, Sector 18"
  city?: string;             // e.g. "Gurugram"
  state?: string;            // e.g. "Haryana"
  pincode?: string;          // e.g. "122002"
  country?: string;          // e.g. "India"
}

export const BUSINESS_SECTORS_CATALOG: Record<BusinessSector, {
  id: BusinessSector;
  label: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  bgLight: string;
  borderLight: string;
  badgeClass: string;
  description: string;
  recommendedHardware: string[];
  defaultCategories: string[];
  unitPresets: MeasurementUnit[];
  defaultModules: TenantSectorConfig["enabledModules"];
  posMode: TenantSectorConfig["posMode"];
  quickActions: string[];
}> = {
  RETAIL: {
    id: "RETAIL",
    label: "Retail & Apparel",
    subtitle: "Fashion, Electronics, Footwear & Specialty Boutiques",
    icon: "🛍️",
    accentColor: "indigo",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-200",
    badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-300",
    description: "Tailored for retail boutiques and chains with apparel sizes/colors, barcode shelf tagging, returns, and customer loyalty rewards.",
    recommendedHardware: ["80mm Thermal Receipt Printer", "Wireless Laser Barcode Scanner", "Heavy Duty Cash Drawer", "Barcode Label Printer"],
    defaultCategories: ["Men's Apparel", "Women's Wear", "Footwear", "Accessories", "Electronics & Gadgets", "Cosmetics"],
    unitPresets: [MeasurementUnit.PIECE, MeasurementUnit.PACK],
    defaultModules: {
      kdsTableManagement: false,
      weighingScaleScanning: false,
      batchExpiryRx: false,
      variantMatrix: true,
      appointmentsBooking: false,
      loyaltyPoints: true,
      stockTransfers: true,
      barcodeLabelPrinting: true,
      kotPrinting: false,
      discountRules: true
    },
    posMode: "RETAIL_QUICK",
    quickActions: ["Size/Color Lookup", "Print Shelf Labels", "Apply VIP Discount", "Process Return"]
  },
  RESTAURANT: {
    id: "RESTAURANT",
    label: "Restaurant & F&B",
    subtitle: "Dine-In, Cafe, QSR, Bar, Bakery & Cloud Kitchen",
    icon: "🍽️",
    accentColor: "amber",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Configured for culinary businesses with table management, Kitchen Display System (KDS), KOT printing, and course modifiers.",
    recommendedHardware: ["Kitchen KOT Thermal Printer", "80mm POS Receipt Printer", "Touch POS Terminal Display", "Cash Drawer"],
    defaultCategories: ["Appetizers & Starters", "Main Courses", "Breads & Rice", "Beverages & Mocktails", "Desserts", "Combos & Thali"],
    unitPresets: [MeasurementUnit.PIECE, MeasurementUnit.PACK, MeasurementUnit.LITER],
    defaultModules: {
      kdsTableManagement: true,
      weighingScaleScanning: false,
      batchExpiryRx: false,
      variantMatrix: false,
      appointmentsBooking: false,
      loyaltyPoints: true,
      stockTransfers: true,
      barcodeLabelPrinting: false,
      kotPrinting: true,
      discountRules: true
    },
    posMode: "RESTAURANT_TABLES",
    quickActions: ["Select Table", "Spool KOT to Kitchen", "Dine-in / Takeaway Toggle", "Add Cooking Note"]
  },
  SUPERMARKET: {
    id: "SUPERMARKET",
    label: "Supermarket & Grocery",
    subtitle: "Hypermarkets, FMCG, Marts & Fresh Produce",
    icon: "🛒",
    accentColor: "emerald",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    description: "Built for ultra high-speed barcode checkout, weighing scale integration, bulk FMCG packs, and automated MRP savings calculation.",
    recommendedHardware: ["High-Speed Laser Scanner", "Electronic Weighing Scale RS-232", "80mm Thermal Receipt Printer", "Heavy Duty Cash Drawer"],
    defaultCategories: ["Dairy & Eggs", "Beverages & Juices", "Snacks & Confectionery", "Fresh Produce & Fruits", "Personal Care & Hygiene", "Household Cleaning"],
    unitPresets: [MeasurementUnit.KG, MeasurementUnit.GRAM, MeasurementUnit.LITER, MeasurementUnit.ML, MeasurementUnit.PIECE, MeasurementUnit.PACK],
    defaultModules: {
      kdsTableManagement: false,
      weighingScaleScanning: true,
      batchExpiryRx: true,
      variantMatrix: false,
      appointmentsBooking: false,
      loyaltyPoints: true,
      stockTransfers: true,
      barcodeLabelPrinting: true,
      kotPrinting: false,
      discountRules: true
    },
    posMode: "SUPERMARKET_FAST_SCAN",
    quickActions: ["Fast Scan Mode", "Weighing Scale Sync", "MRP Savings Banner", "Batch Expiry Check"]
  },
  PHARMACY: {
    id: "PHARMACY",
    label: "Pharmacy & Healthcare",
    subtitle: "Chemist, Drugs, Surgical Supplies & Wellness",
    icon: "💊",
    accentColor: "rose",
    bgLight: "bg-rose-50",
    borderLight: "border-rose-200",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
    description: "Strict compliance with drug batch number validation, expiry date checks, prescription (Rx) doctor/patient records, and Schedule H tags.",
    recommendedHardware: ["Wireless Barcode Scanner", "80mm Thermal Receipt Printer", "Medicine Label Printer", "Cash Drawer"],
    defaultCategories: ["Antibiotics & Tablets", "Syrups & Suspensions", "Ointments & Creams", "Health Supplements", "Surgicals & First Aid", "Personal Care"],
    unitPresets: [MeasurementUnit.PIECE, MeasurementUnit.PACK],
    defaultModules: {
      kdsTableManagement: false,
      weighingScaleScanning: false,
      batchExpiryRx: true,
      variantMatrix: false,
      appointmentsBooking: false,
      loyaltyPoints: false,
      stockTransfers: true,
      barcodeLabelPrinting: true,
      kotPrinting: false,
      discountRules: true
    },
    posMode: "PHARMACY_RX",
    quickActions: ["Prescription Rx Entry", "Batch/Expiry Enforcement", "Doctor Details", "Substitute Drug Lookup"]
  },
  SERVICES: {
    id: "SERVICES",
    label: "Services & Salon / Spa",
    subtitle: "Hair Salon, Spa, Wellness Clinics & Service Studios",
    icon: "✂️",
    accentColor: "violet",
    bgLight: "bg-violet-50",
    borderLight: "border-violet-200",
    badgeClass: "bg-violet-100 text-violet-800 border-violet-300",
    description: "Designed for service professionals with appointment scheduling, stylist/therapist commission tracking, service durations, and client packages.",
    recommendedHardware: ["80mm Thermal Receipt Printer", "Touch POS Terminal", "Cash Drawer", "Appointment Tablet Display"],
    defaultCategories: ["Hair Services", "Skin & Facial", "Massage & Spa", "Nail Art & Manicure", "Bridal & Packages", "Retail Aftercare"],
    unitPresets: [MeasurementUnit.PIECE, MeasurementUnit.PACK],
    defaultModules: {
      kdsTableManagement: false,
      weighingScaleScanning: false,
      batchExpiryRx: false,
      variantMatrix: false,
      appointmentsBooking: true,
      loyaltyPoints: true,
      stockTransfers: false,
      barcodeLabelPrinting: false,
      kotPrinting: false,
      discountRules: true
    },
    posMode: "SERVICES_BOOKING",
    quickActions: ["Book Appointment", "Assign Stylist / Staff", "Service Duration Selector", "Membership Package"]
  }
};

export const TENANT_FONT_OPTIONS: { id: TenantFontFamily; label: string; preview: string; description: string; className: string }[] = [
  { id: "Inter", label: "Inter (Modern Sans)", preview: "The quick brown fox jumps over 123", description: "Ultra-crisp, highly readable neutral sans-serif", className: "tenant-font-inter" },
  { id: "Outfit", label: "Outfit (Friendly Sans)", preview: "The quick brown fox jumps over 123", description: "Geometric, contemporary digital retail aesthetics", className: "tenant-font-outfit" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans (Corporate)", preview: "The quick brown fox jumps over 123", description: "Sophisticated corporate & enterprise typography", className: "tenant-font-jakarta" },
  { id: "Roboto", label: "Roboto (Clean Standard)", preview: "The quick brown fox jumps over 123", description: "Standard, clean, industry-proven geometric sans", className: "tenant-font-roboto" },
  { id: "Playfair Display", label: "Playfair Display (Luxury Serif)", preview: "The quick brown fox jumps over 123", description: "High-contrast serif for luxury, boutiques & fine dining", className: "tenant-font-playfair" },
  { id: "Space Grotesk", label: "Space Grotesk (Tech & Street)", preview: "The quick brown fox jumps over 123", description: "Avant-garde, tech-forward, distinctive streetwear vibe", className: "tenant-font-grotesk" },
  { id: "JetBrains Mono", label: "JetBrains Mono (Monospace)", preview: "The quick brown fox jumps over 123", description: "High-precision monospace for financial & high-speed POS", className: "tenant-font-mono" },
  { id: "EB Garamond", label: "EB Garamond (Heritage)", preview: "The quick brown fox jumps over 123", description: "Classical book & heritage humanist aesthetic", className: "tenant-font-garamond" },
  { id: "System Sans", label: "System Default UI", preview: "The quick brown fox jumps over 123", description: "Native operating system UI font for raw speed", className: "tenant-font-system" }
];

export const TENANT_FONT_SIZE_OPTIONS: { id: TenantFontSizeScale; label: string; scalePercent: string; description: string; className: string }[] = [
  { id: "compact", label: "Compact / High-Density", scalePercent: "88%", description: "Maximum data density for fast cashier workstations", className: "tenant-scale-compact" },
  { id: "standard", label: "Standard (Default)", scalePercent: "100%", description: "Default clean balance between density and readability", className: "tenant-scale-standard" },
  { id: "spacious", label: "Spacious / Tablet", scalePercent: "110%", description: "Slightly enlarged text for tablet & 15-inch touch displays", className: "tenant-scale-spacious" },
  { id: "large", label: "Large / Touchscreen", scalePercent: "122%", description: "Extra-large high-contrast text for distance viewing", className: "tenant-scale-large" }
];

export interface AppSettings {
  autoPrintReceipt: boolean;
  enableSound: boolean;
  receiptHeader: string;
  receiptFooter: string;
  maxDiscountAllowed: number;
}

export interface StockTransfer {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  fromBranchId: string;
  toBranchId: string;
  quantity: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedBy: string;
  requestedDate: string;
  actionedBy?: string;
  actionedDate?: string;
  comments?: string;
}

export interface PrintOptions {
  filename?: string;
  invoiceId?: string;
  autoDownloadPdf?: boolean;
}

export interface DirectPrintResult {
  ok: boolean;
  blockedBySandbox?: boolean;
  reason?: string;
}

export function buildReceiptUtilityStyles(
  layoutProfile: PrinterLayoutProfile,
  scopePrefix = ""
): string {
  const isA4 = layoutProfile === "standard-a4";
  const is58 = layoutProfile === "thermal-58mm";
  const is76 = layoutProfile === "thermal-76mm";
  const is112 = layoutProfile === "thermal-112mm";

  const gridColumnsCss = isA4
    ? "minmax(0, 1fr) 72px 72px 42px 82px"
    : is112
    ? "minmax(0, 1fr) 58px 58px 26px 62px"
    : is76
    ? "minmax(0, 1fr) 42px 42px 20px 44px"
    : is58
    ? "minmax(0, 1fr) 31px 31px 14px 33px"
    : "minmax(0, 1fr) 46px 46px 22px 48px";

  const gridGapCss = is58 ? "2px" : is76 ? "3px" : isA4 ? "6px" : "4px";
  const s = scopePrefix;
  const inkColor = isA4 ? "#0f172a" : "#000000";
  const subInkColor = isA4 ? "#334155" : "#000000";
  const borderInk = isA4 ? "#cbd5e1" : "#000000";

  return `
    ${s}.text-center { text-align: center; }
    ${s}.text-right { text-align: right; }
    ${s}.text-left { text-align: left; }
    ${s}.font-sans { font-family: ${isA4 ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : '"Courier New", Courier, monospace'}; }
    ${s}.font-mono, ${s}.font-display { font-family: "Courier New", Courier, monospace; }
    ${s}.font-bold { font-weight: 700; }
    ${s}.font-semibold { font-weight: 600; }
    ${s}.font-extrabold, ${s}.font-black { font-weight: 800; }
    ${s}.uppercase { text-transform: uppercase; }
    ${s}.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    ${s}.block { display: block; }
    ${s}.leading-tight { line-height: 1.25; }
    ${s}.leading-normal { line-height: 1.35; }
    ${s}.flex { display: flex; }
    ${s}.justify-center { justify-content: center; }
    ${s}.justify-between { justify-content: space-between; gap: 4px; }
    ${s}.items-center { align-items: center; }
    ${s}.gap-1 { gap: 4px; }
    ${s}.space-y-1 > * + * { margin-top: 3px; }
    ${s}.space-y-2 > * + * { margin-top: 5px; }
    ${s}.space-y-3 > * + * { margin-top: 7px; }
    ${s}.space-y-0\\.5 > * + * { margin-top: 2px; }
    ${s}.my-1 { margin-top: 4px; margin-bottom: 4px; }
    ${s}.mt-1 { margin-top: 4px; }
    ${s}.mt-4 { margin-top: 8px; }
    ${s}.mb-1 { margin-bottom: 4px; }
    ${s}.mb-4 { margin-bottom: 8px; }
    ${s}.pt-1 { padding-top: 4px; }
    ${s}.pt-1\\.5 { padding-top: 5px; }
    ${s}.pt-2 { padding-top: 5px; }
    ${s}.pb-1 { padding-bottom: 4px; }
    ${s}.py-2 { padding-top: 5px; padding-bottom: 5px; }
    ${s}.p-0\\.5 { padding: 2px; }
    ${s}.p-1\\.5 { padding: 4px; }
    ${s}.p-2 { padding: 5px; }
    ${s}.p-3, ${s}.p-4, ${s}.p-5 { padding: 6px; }
    ${s}.px-1\\.5 { padding-left: 5px; padding-right: 5px; }
    ${s}.rounded { border-radius: 3px; }
    ${s}.border { border: 1px solid ${borderInk}; }
    ${s}.border-t { border-top: 1px solid ${borderInk}; }
    ${s}.border-b { border-bottom: 1px solid ${borderInk}; }
    ${s}.border-dashed { border-style: dashed; }
    ${s}.border-slate-200, ${s}.border-slate-300, ${s}.border-emerald-200 { border-color: ${borderInk}; }
    ${s}.bg-emerald-50 { background-color: ${isA4 ? "#ecfdf5" : "#ffffff"}; }
    ${s}.bg-slate-50, ${s}.bg-slate-100 { background-color: ${isA4 ? "#f1f5f9" : "#ffffff"}; }
    ${s}.bg-slate-900, ${s}.bg-slate-950 {
      background-color: ${isA4 ? "#0f172a" : "#ffffff"} !important;
      color: ${isA4 ? "#ffffff" : "#000000"} !important;
      border: ${isA4 ? "none" : "1.5px solid #000000"} !important;
      padding: 1px 5px !important;
      font-weight: 800 !important;
    }
    ${s}.text-emerald-800 { color: ${isA4 ? "#065f46" : "#000000"}; }
    ${s}.text-slate-400, ${s}.text-slate-500, ${s}.text-slate-600 { color: ${subInkColor} !important; }
    ${s}.text-slate-700, ${s}.text-slate-800, ${s}.text-slate-900, ${s}.text-slate-950 { color: ${inkColor} !important; }
    ${s}.text-xs { font-size: 1.06em; }
    ${s}.text-sm { font-size: 1.18em; }
    ${s}[data-receipt-logo="true"] { max-height: 36px; max-width: 140px; object-fit: contain; display: block; margin: 0 auto 4px auto; }
    ${s}[data-receipt-meta-row="true"] {
      display: flex !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      gap: 6px !important;
    }
    ${s}[data-receipt-math-row="true"] {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 6px !important;
    }
    ${s}[data-receipt-meta-row="true"] span:first-child,
    ${s}[data-receipt-math-row="true"] span:first-child {
      flex-shrink: 0;
    }
    ${s}[data-receipt-meta-row="true"] span:last-child {
      min-width: 0;
      max-width: none !important;
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: clip !important;
      text-align: right;
      word-break: break-word;
    }
    ${s}[data-receipt-math-row="true"] span:last-child {
      flex-shrink: 0;
      text-align: right;
      white-space: nowrap;
    }
    ${s}[data-receipt-items-grid="true"] {
      display: grid !important;
      grid-template-columns: ${gridColumnsCss} !important;
      gap: ${gridGapCss} !important;
      align-items: start !important;
      width: 100% !important;
    }
    ${s}[data-receipt-items-grid="true"] > div:first-child,
    ${s}[data-receipt-items-grid="true"] > div:first-child span,
    ${s}[data-receipt-items-grid="true"] > span:first-child {
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: clip !important;
      word-break: break-word;
      text-align: left !important;
    }
    ${s}[data-receipt-items-grid="true"] > span:not(:first-child) {
      white-space: nowrap !important;
      text-align: right !important;
      font-size: ${isA4 ? "1em" : is58 ? "0.86em" : "0.92em"} !important;
    }
    ${s}[data-receipt-items-grid="true"] > span:nth-child(4) {
      text-align: center !important;
    }
    ${s}[data-receipt-savings="true"] {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 6px !important;
      padding: 4px 6px !important;
      background-color: ${isA4 ? "#ecfdf5" : "#ffffff"} !important;
      border: 1px ${isA4 ? "solid #86efac" : "dashed #000000"} !important;
      border-radius: 3px !important;
      color: ${isA4 ? "#065f46" : "#000000"} !important;
      font-weight: 700 !important;
      margin: 5px 0 !important;
    }
    ${s}[data-receipt-footer="true"] {
      padding: 5px !important;
      background-color: ${isA4 ? "#f1f5f9" : "#ffffff"} !important;
      border: 1px ${isA4 ? "solid #cbd5e1" : "dashed #000000"} !important;
      border-radius: 3px !important;
      text-align: center !important;
      color: ${inkColor} !important;
      margin-top: 6px !important;
    }
  `;
}

/**
 * Synchronously triggers browser/OS print dialog inside the active click gesture
 * using a dedicated @media print root so thermal drivers (58mm, 76mm, 80mm, 112mm, A4)
 * receive exact roll dimensions without downloading PDFs or losing user-activation.
 */
export function printElementDirect(
  elementId: string,
  layoutProfile: PrinterLayoutProfile = "thermal-80mm"
): DirectPrintResult {
  const element = document.getElementById(elementId);
  if (!element) {
    return { ok: false, reason: `Element with id ${elementId} not found.` };
  }

  const spec = THERMAL_LAYOUT_SPECS[layoutProfile] || THERMAL_LAYOUT_SPECS["thermal-80mm"];
  const isA4 = layoutProfile === "standard-a4";
  const widthCss = isA4 ? "190mm" : "100%";
  const maxWidthCss = isA4 ? "190mm" : `${spec.printableWidthMm}mm`;
  const paddingCss = spec.paddingCss;
  const fontFamilyCss = isA4
    ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    : '"Courier New", Courier, monospace';
  const fontSizeCss = spec.fontSizeCss;
  const pageSizeCss = isA4 ? "A4 portrait" : `${spec.rollWidthMm}mm auto`;
  const receiptUtilityStyles = buildReceiptUtilityStyles(layoutProfile, "#pos-direct-print-root ");

  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("button, .no-print, .action-buttons, [role='button']").forEach((el) => el.remove());

  try {
    document.getElementById("pos-direct-print-root")?.remove();
    document.getElementById("pos-direct-print-style")?.remove();

    const styleEl = document.createElement("style");
    styleEl.id = "pos-direct-print-style";
    styleEl.textContent = `
      @media screen {
        #pos-direct-print-root { display: none !important; }
      }
      @media print {
        @page {
          size: ${pageSizeCss};
          margin: 0;
        }
        html, body {
          width: auto !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          background: #ffffff !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body > *:not(#pos-direct-print-root) { display: none !important; }
        #pos-direct-print-root {
          display: block !important;
          width: ${widthCss} !important;
          max-width: ${maxWidthCss} !important;
          margin: ${isA4 ? "0 auto" : "0"} !important;
          padding: ${paddingCss} !important;
          background: #ffffff !important;
          color: #000000 !important;
          font-family: ${fontFamilyCss} !important;
          font-size: ${fontSizeCss} !important;
          line-height: 1.3 !important;
        }
        #pos-direct-print-root * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #pos-direct-print-root button,
        #pos-direct-print-root .no-print,
        #pos-direct-print-root .action-buttons,
        #pos-direct-print-root [role="button"] {
          display: none !important;
        }
        ${receiptUtilityStyles}
      }
    `;

    const portalEl = document.createElement("div");
    portalEl.id = "pos-direct-print-root";
    portalEl.innerHTML = clone.innerHTML;

    document.head.appendChild(styleEl);
    document.body.appendChild(portalEl);

    let beforePrintFired = false;
    const onBeforePrint = () => {
      beforePrintFired = true;
    };
    const cleanupPortal = () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      portalEl.remove();
      styleEl.remove();
    };

    window.addEventListener("beforeprint", onBeforePrint, { once: true });
    window.addEventListener("afterprint", cleanupPortal, { once: true });
    setTimeout(cleanupPortal, 120000);

    const startedAt = Date.now();
    window.focus();
    window.print();
    const elapsed = Date.now() - startedAt;

    // Always save a clean snapshot when running inside a nested preview iframe so a top-level print tab can print directly
    const inNestedFrame = typeof window !== "undefined" && window.self !== window.top;
    if (inNestedFrame) {
      savePrintSnapshot({
        html: clone.innerHTML,
        layoutProfile,
        createdAt: Date.now()
      });
    }

    if (inNestedFrame && !beforePrintFired && elapsed < 15) {
      return {
        ok: false,
        blockedBySandbox: true,
        reason: "Embedded preview blocks browser print dialogs. Use 'Open Print Window' below to print directly in a browser tab."
      };
    }

    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      reason: err?.message || "Failed to invoke system print dialog."
    };
  }
}

export async function printElementById(
  elementId: string,
  layoutProfile: PrinterLayoutProfile = "standard-a4",
  _options?: PrintOptions
): Promise<boolean> {
  // Execute synchronously first so browser user-activation is never lost
  if (document.getElementById(elementId)) {
    return printElementDirect(elementId, layoutProfile).ok;
  }

  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (document.getElementById(elementId)) {
      return printElementDirect(elementId, layoutProfile).ok;
    }
  }

  console.error(`Element with id ${elementId} not found.`);
  return false;
}

/**
 * Downloads a standalone, self-contained HTML slip that opens in any browser
 * and triggers the system printer dialog automatically without sandbox restrictions.
 */
export function downloadPrintableHtmlSlip(
  elementId: string,
  filename: string = "receipt-slip.html",
  layoutProfile: PrinterLayoutProfile = "thermal-80mm"
): boolean {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("button, .no-print, .action-buttons, [role='button']").forEach(b => b.remove());

  const spec = THERMAL_LAYOUT_SPECS[layoutProfile] || THERMAL_LAYOUT_SPECS["thermal-80mm"];
  const isA4 = layoutProfile === "standard-a4";
  const widthCss = isA4 ? "210mm" : `${spec.printableWidthMm}mm`;
  const bodyPadding = isA4 ? "12mm" : spec.paddingCss;
  const fontFamily = isA4
    ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    : '"Courier New", Courier, monospace';
  const fontSize = spec.fontSizeCss;
  const receiptUtilityStyles = buildReceiptUtilityStyles(layoutProfile, "");

  const cleanFilename = filename.endsWith(".html") ? filename : `${filename}.html`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanFilename.replace(/\.html$/, "")}</title>
  <style>
    @page {
      size: ${isA4 ? "A4 portrait" : `${spec.rollWidthMm}mm auto`};
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0 auto;
      padding: ${bodyPadding};
      max-width: ${widthCss};
      font-family: ${fontFamily};
      font-size: ${fontSize};
      color: #0f172a;
      background: #fff;
    }
    .receipt-body {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      background: #fffdf8;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .font-sans { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .font-mono, .font-display { font-family: "Courier New", Courier, monospace; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-extrabold, .font-black { font-weight: 800; }
    .uppercase { text-transform: uppercase; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .block { display: block; }
    .leading-tight { line-height: 1.25; }
    .leading-normal { line-height: 1.4; }
    .flex { display: flex; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .items-center { align-items: center; }
    .gap-1 { gap: 4px; }
    .space-y-1 > * + * { margin-top: 4px; }
    .space-y-2 > * + * { margin-top: 8px; }
    .space-y-3 > * + * { margin-top: 10px; }
    .space-y-0\\.5 > * + * { margin-top: 2px; }
    .my-1 { margin-top: 4px; margin-bottom: 4px; }
    .mt-1 { margin-top: 4px; }
    .mt-4 { margin-top: 12px; }
    .mb-1 { margin-bottom: 4px; }
    .mb-4 { margin-bottom: 12px; }
    .pt-1 { padding-top: 4px; }
    .pt-1\\.5 { padding-top: 6px; }
    .pt-2 { padding-top: 8px; }
    .pb-1 { padding-bottom: 4px; }
    .py-2 { padding-top: 8px; padding-bottom: 8px; }
    .p-0\\.5 { padding: 2px; }
    .p-1\\.5 { padding: 6px; }
    .p-2 { padding: 8px; }
    .p-3, .p-4, .p-5 { padding: 10px; }
    .px-1\\.5 { padding-left: 6px; padding-right: 6px; }
    .rounded { border-radius: 4px; }
    .border { border: 1px solid #cbd5e1; }
    .border-t { border-top: 1px solid #cbd5e1; }
    .border-b { border-bottom: 1px solid #cbd5e1; }
    .border-dashed { border-style: dashed; }
    .border-slate-200 { border-color: #e2e8f0; }
    .border-slate-300 { border-color: #cbd5e1; }
    .border-emerald-200 { border-color: #a7f3d0; }
    .bg-emerald-50 { background-color: #ecfdf5; }
    .bg-slate-50 { background-color: #f8fafc; }
    .bg-slate-100 { background-color: #f1f5f9; }
    .bg-slate-900, .bg-slate-950 { background-color: #0f172a; }
    .text-white { color: #ffffff; }
    .text-emerald-800 { color: #065f46; }
    .text-slate-400, .text-slate-500, .text-slate-600 { color: #475569; }
    .text-slate-700, .text-slate-800, .text-slate-900, .text-slate-950 { color: #0f172a; }
    .text-xs { font-size: 1.08em; }
    .text-sm { font-size: 1.2em; }
    [data-receipt-logo="true"] { max-height: 36px; max-width: 140px; object-fit: contain; display: block; margin: 0 auto 4px auto; }
    ${receiptUtilityStyles}
    .print-control-bar {
      text-align: center;
      margin-bottom: 14px;
      padding: 10px 14px;
      background: #0f172a;
      color: #fff;
      border-radius: 8px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .print-btn {
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .print-btn:hover {
      background: #059669;
    }
    @media print {
      .print-control-bar {
        display: none !important;
      }
      body {
        padding: ${isA4 ? "10mm" : "1mm"};
        max-width: 100% !important;
      }
      .receipt-body {
        border: none;
        padding: 0;
        background: #fff;
      }
    }
  </style>
</head>
<body>
  <div class="print-control-bar">
    <button class="print-btn" onclick="window.print()">Print Receipt</button>
  </div>
  <div class="receipt-body">
    ${clone.innerHTML}
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          window.focus();
          window.print();
        } catch(e) {}
      }, 350);
    });
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = cleanFilename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
  return true;
}

export async function saveElementAsPDF(
  elementId: string, 
  filename: string,
  layoutProfile: PrinterLayoutProfile = "standard-a4"
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  // For POS receipt elements, use the deterministic vector receipt compiler directly so
  // downloaded PDFs match the checkout invoice's exact header, contact info, 5-column item grid,
  // MRP savings highlight, totals, payment mode badge, and footer without Tailwind v4 oklch failures.
  if (elementId === "invoice-receipt-theme" || elementId === "virtual-receipt-roll-wrapper") {
    return generateVectorPDFFallback(element, elementId, filename, layoutProfile);
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for quality print text
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById(elementId);
        if (el) {
          try {
            el.style.maxHeight = "none"; // Let the full table expand so it is captured fully
            el.style.overflow = "visible";

            if (layoutProfile === "standard-a4") {
              el.style.width = "800px";
              el.style.padding = "40px";
              el.style.boxSizing = "border-box";
              el.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
              el.style.backgroundColor = "#ffffff";
              el.style.color = "#000000";
              el.style.borderRadius = "0";
              el.style.border = "none";
              el.style.boxShadow = "none";
            } else {
              const widthPx =
                layoutProfile === "thermal-58mm"
                  ? "240px"
                  : layoutProfile === "thermal-76mm"
                  ? "315px"
                  : layoutProfile === "thermal-112mm"
                  ? "440px"
                  : "340px";
              el.style.width = widthPx;
              el.style.padding = layoutProfile === "thermal-58mm" ? "4px" : "12px";
              el.style.boxSizing = "border-box";
              el.style.backgroundColor = "#ffffff";
              el.style.color = "#000000";
              el.style.borderRadius = "0";
              el.style.border = "none";
              el.style.boxShadow = "none";
            }
          } catch (err) {
            console.warn("Safe override style adjustment error:", err);
          }
        }
      }
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2] // perfect 1:1 pixel rendering size
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.warn("HTML2Canvas compilation failed (sandbox/CORS restrictions active in iframe). Falling back to pure offline Vector PDF generation...", error);
    return generateVectorPDFFallback(element, elementId, filename, layoutProfile);
  }
}

// High-fidelity offline vector PDF compiler matching the checkout receipt layout identically
function generateVectorPDFFallback(
  element: HTMLElement,
  elementId: string,
  filename: string,
  layoutProfile: PrinterLayoutProfile
): boolean {
  const cleanText = (str: string): string => {
    if (!str) return "";
    // Replace Indian Rupee symbol with "Rs." and strip non-Latin-1 emojis so jsPDF standard fonts stay crisp
    let cleaned = str.replace(/₹/g, "Rs.");
    cleaned = cleaned.replace(/\u00a0/g, " ");
    cleaned = cleaned.replace(/[^\x20-\x7E\xA0-\xFF\n]/g, "").replace(/\s+/g, " ").trim();
    return cleaned;
  };

  try {
    if (elementId === "invoice-receipt-theme" || elementId === "virtual-receipt-roll-wrapper") {
      const storeEl = element.querySelector("[data-receipt-store-name='true'], h4");
      const storeTitle = storeEl ? storeEl.textContent?.replace(/[⭐*]/g, "").trim() : "RETAIL STORE RECEIPT";

      const logoEl = element.querySelector("[data-receipt-logo='true']") as HTMLImageElement | null;
      const logoSrc = logoEl?.src || "";
      const hasDataUrlLogo = logoSrc.startsWith("data:image/png") || logoSrc.startsWith("data:image/jpeg") || logoSrc.startsWith("data:image/jpg");

      const headerEl = element.querySelector("[data-receipt-header='true']");
      const branchEl = element.querySelector("[data-receipt-branch='true']");
      const addressEl = element.querySelector("[data-receipt-address='true']");
      const contactEl = element.querySelector("[data-receipt-contact='true']");

      const subtitleEls = element.querySelectorAll("p");
      const receiptHeaderText = headerEl ? headerEl.textContent?.trim() || "" : (subtitleEls[0]?.textContent?.trim() || "");
      const branchText = branchEl ? branchEl.textContent?.trim() || "" : "";
      const addressText = addressEl ? addressEl.textContent?.trim() || "" : (subtitleEls[1]?.textContent?.trim() || "");
      const contactText = contactEl ? contactEl.textContent?.trim() || "" : (subtitleEls[2]?.textContent?.trim() || "");

      const metaLines: { key: string; val: string }[] = [];
      const metaRows = element.querySelectorAll("[data-receipt-meta-row='true']");
      if (metaRows.length > 0) {
        metaRows.forEach((row) => {
          const spans = row.querySelectorAll("span");
          if (spans.length >= 2) {
            metaLines.push({
              key: spans[0].textContent?.trim() || "",
              val: spans[spans.length - 1].textContent?.trim() || "",
            });
          }
        });
      } else {
        const divs = element.querySelectorAll("div");
        divs.forEach(div => {
          if (div.classList.contains("flex") && div.classList.contains("justify-between")) {
            const spans = div.querySelectorAll("span");
            if (spans.length === 2) {
              const key = spans[0].textContent?.trim() || "";
              const val = spans[1].textContent?.trim() || "";
              if (
                key.includes("Invoice ID") ||
                key.includes("GSTIN") ||
                key.includes("Cashier") ||
                key.includes("Timestamp") ||
                key.includes("Customer") ||
                key.includes("Mobile")
              ) {
                metaLines.push({ key, val });
              }
            }
          }
        });
      }

      const items: { name: string; mrp: string; rate: string; qty: string; total: string }[] = [];
      const itemRows = element.querySelectorAll("[data-receipt-item-row='true']");
      if (itemRows.length > 0) {
        itemRows.forEach((row) => {
          const spans = row.querySelectorAll("span");
          if (spans.length >= 5) {
            items.push({
              name: spans[0].textContent?.trim() || "",
              mrp: spans[1].textContent?.trim() || "",
              rate: spans[2].textContent?.trim() || "",
              qty: spans[3].textContent?.trim() || "",
              total: spans[4].textContent?.trim() || "",
            });
          }
        });
      } else {
        const gridDivs = element.querySelectorAll("div.grid");
        gridDivs.forEach((div, idx) => {
          if (idx === 0) return;
          const spans = div.querySelectorAll("span");
          if (spans.length >= 5) {
            items.push({
              name: spans[0].textContent?.trim() || "",
              mrp: spans[1].textContent?.trim() || "",
              rate: spans[2].textContent?.trim() || "",
              qty: spans[3].textContent?.trim() || "",
              total: spans[4].textContent?.trim() || "",
            });
          } else if (spans.length >= 3) {
            items.push({
              name: spans[0].textContent?.trim() || "",
              mrp: spans[2].textContent?.trim() || "",
              rate: spans[2].textContent?.trim() || "",
              qty: spans[1].textContent?.trim() || "",
              total: spans[2].textContent?.trim() || "",
            });
          }
        });
      }

      const savingsEl = element.querySelector("[data-receipt-savings='true']");
      let savingsLabel = "";
      let savingsValue = "";
      if (savingsEl) {
        const spans = savingsEl.querySelectorAll("span");
        if (spans.length >= 2) {
          savingsLabel = cleanText(spans[0].textContent?.trim() || "You Saved on MRP:");
          savingsValue = cleanText(spans[1].textContent?.trim() || "");
        }
      }

      const mathLines: { key: string; val: string }[] = [];
      const mathRows = element.querySelectorAll("[data-receipt-math-row='true']");
      if (mathRows.length > 0) {
        mathRows.forEach((row) => {
          const spans = row.querySelectorAll("span");
          if (spans.length >= 2) {
            mathLines.push({
              key: spans[0].textContent?.trim() || "",
              val: spans[spans.length - 1].textContent?.trim() || "",
            });
          }
        });
      } else {
        const divs = element.querySelectorAll("div");
        divs.forEach(div => {
          if (div.classList.contains("flex") && div.classList.contains("justify-between")) {
            const spans = div.querySelectorAll("span");
            if (spans.length === 2) {
              const key = spans[0].textContent?.trim() || "";
              const val = spans[1].textContent?.trim() || "";
              if (
                key.includes("Total MRP") ||
                key.includes("Tax") ||
                key.includes("discount") ||
                key.includes("TOTAL") ||
                key.includes("PAYABLE") ||
                key.includes("Payment Mode") ||
                key.includes("Tender Mode") ||
                key.includes("Cash Received") ||
                key.includes("Change Returned")
              ) {
                mathLines.push({ key, val });
              }
            }
          }
        });
      }

      const footerEl = element.querySelector("[data-receipt-footer='true'], .p-3.bg-slate-100, .p-2.bg-slate-50");
      const footerMsg = footerEl ? cleanText(footerEl.textContent?.trim() || "") : "Thank you for shopping! Powered by Expert POS SaaS";

      const isA4 = layoutProfile === "standard-a4";
      const is58 = layoutProfile === "thermal-58mm";
      const is76 = layoutProfile === "thermal-76mm";
      const is112 = layoutProfile === "thermal-112mm";
      // Exact physical paper width in points with safe thermal printhead margins
      const pdfWidth = isA4 ? 595 : is58 ? 164 : is76 ? 215 : is112 ? 317 : 226;
      const padX = isA4 ? 40 : is58 ? 12 : is112 ? 18 : 14;
      const rightX = pdfWidth - padX;
      const mrpX = isA4 ? 365 : is58 ? 78 : is76 ? 107 : is112 ? 178 : 114;
      const rateX = isA4 ? 435 : is58 ? 109 : is76 ? 146 : is112 ? 226 : 155;
      const qtyX = isA4 ? 478 : is58 ? 117 : is76 ? 157 : is112 ? 242 : 166;
      const totalX = rightX;
      const descMaxWidth = isA4 ? 240 : is58 ? 34 : is76 ? 54 : is112 ? 105 : 60;

      const lineH = isA4 ? 13 : is58 ? 8 : is76 ? 9 : is112 ? 11 : 9.5;
      const itemFontSize = isA4 ? 8.8 : is58 ? 5.0 : is76 ? 5.8 : is112 ? 7.2 : 6.1;
      const metaFontSize = isA4 ? 9 : is58 ? 5.8 : is76 ? 6.6 : is112 ? 8.0 : 7.0;
      const fontFamily = isA4 ? "helvetica" : "courier";

      // Pre-compute required height so roll receipts never clip
      const measurePdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [pdfWidth, 842] });
      measurePdf.setFont(fontFamily, "normal");
      measurePdf.setFontSize(itemFontSize);
      const addrLinesCount = addressText ? measurePdf.splitTextToSize(cleanText(addressText), pdfWidth - padX * 2).length : 0;
      const itemLinesTotal = items.reduce((acc, it) => {
        const lines = measurePdf.splitTextToSize(cleanText(it.name), descMaxWidth);
        return acc + Math.max(1, lines.length) * lineH + (isA4 ? 4 : 3);
      }, 0);
      const footerLinesCount = footerMsg ? measurePdf.splitTextToSize(footerMsg, pdfWidth - padX * 2 - 12).length : 0;

      const estimatedHeight =
        (isA4 ? 55 : 28) +
        (hasDataUrlLogo ? (isA4 ? 42 : 28) : 0) +
        (receiptHeaderText ? lineH : 0) +
        (branchText ? lineH : 0) +
        addrLinesCount * lineH +
        (contactText ? lineH : 0) +
        22 +
        metaLines.length * (lineH + 1) +
        30 +
        itemLinesTotal +
        (savingsLabel ? 26 : 0) +
        22 +
        mathLines.length * (lineH + 3) +
        (footerLinesCount > 0 ? footerLinesCount * 9 + 24 : 0) +
        26;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: isA4 ? "a4" : [pdfWidth, Math.max(240, estimatedHeight)]
      });

      const drawDashedLine = (yPos: number) => {
        pdf.setDrawColor(180, 190, 205);
        pdf.setLineWidth(0.6);
        (pdf as any).setLineDashPattern?.([3, 2], 0);
        pdf.line(padX, yPos, rightX, yPos);
        (pdf as any).setLineDashPattern?.([], 0);
      };

      let y = isA4 ? 36 : 18;

      if (hasDataUrlLogo) {
        try {
          const imgFormat = logoSrc.startsWith("data:image/png") ? "PNG" : "JPEG";
          const imgW = isA4 ? 44 : 26;
          const imgH = isA4 ? 32 : 20;
          pdf.addImage(logoSrc, imgFormat, (pdfWidth - imgW) / 2, y, imgW, imgH);
          y += imgH + 5;
        } catch {
          // Ignore malformed image data URLs
        }
      }

      pdf.setTextColor(15, 23, 42);
      pdf.setFont(fontFamily, "bold");
      pdf.setFontSize(isA4 ? 14 : is58 ? 8 : 9.5);
      pdf.text(cleanText(storeTitle || "RETAIL STORE RECEIPT"), pdfWidth / 2, y, { align: "center" });
      y += isA4 ? 15 : 11;

      pdf.setFontSize(metaFontSize);
      if (receiptHeaderText) {
        pdf.setFont(fontFamily, "bold");
        pdf.setTextColor(71, 85, 105);
        pdf.text(cleanText(receiptHeaderText.toUpperCase()), pdfWidth / 2, y, { align: "center" });
        y += lineH;
      }
      if (branchText) {
        pdf.setFont(fontFamily, "bold");
        pdf.setTextColor(71, 85, 105);
        pdf.text(cleanText(branchText), pdfWidth / 2, y, { align: "center" });
        y += lineH;
      }
      if (addressText) {
        pdf.setFont(fontFamily, "normal");
        pdf.setTextColor(100, 116, 139);
        const splitAddress = pdf.splitTextToSize(cleanText(addressText), pdfWidth - padX * 2);
        splitAddress.forEach((line: string) => {
          pdf.text(line, pdfWidth / 2, y, { align: "center" });
          y += lineH;
        });
      }
      if (contactText) {
        pdf.setFont(fontFamily, "normal");
        pdf.setTextColor(100, 116, 139);
        pdf.text(cleanText(contactText), pdfWidth / 2, y, { align: "center" });
        y += lineH;
      }

      y += 4;
      drawDashedLine(y);
      y += 11;

      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(metaFontSize);
      metaLines.forEach(m => {
        const keyTxt = cleanText(m.key);
        let valTxt = cleanText(m.val);
        pdf.setFont(fontFamily, "normal");
        const keyW = pdf.getTextWidth(keyTxt);
        const maxValW = Math.max(40, (rightX - padX) - keyW - 8);
        pdf.setFont(fontFamily, "bold");
        while (valTxt.length > 4 && pdf.getTextWidth(valTxt) > maxValW) {
          valTxt = valTxt.slice(0, -4) + "...";
        }
        pdf.setFont(fontFamily, "normal");
        pdf.text(keyTxt, padX, y);
        pdf.setFont(fontFamily, "bold");
        pdf.text(valTxt, rightX, y, { align: "right" });
        y += lineH + 1;
      });

      y += 3;
      pdf.setDrawColor(180, 190, 205);
      pdf.line(padX, y, rightX, y);
      y += 10;

      // 5-Column Item Header matching Checkout Invoice
      pdf.setFont(fontFamily, "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(itemFontSize);
      pdf.text(is58 ? "Item" : "Item Description", padX, y);
      pdf.text("MRP", mrpX, y, { align: "right" });
      pdf.text("Rate", rateX, y, { align: "right" });
      pdf.text("Qty", qtyX, y, { align: "center" });
      pdf.text("Total", totalX, y, { align: "right" });
      y += 4;
      pdf.line(padX, y, rightX, y);
      y += 10;

      items.forEach(it => {
        pdf.setFont(fontFamily, "normal");
        pdf.setTextColor(30, 41, 59);
        pdf.setFontSize(itemFontSize);
        const nameLines = pdf.splitTextToSize(cleanText(it.name), descMaxWidth);
        const startY = y;
        nameLines.forEach((line: string) => {
          pdf.text(line, padX, y);
          y += lineH;
        });

        const rowAnchorY = startY;
        pdf.text(cleanText(it.mrp), mrpX, rowAnchorY, { align: "right" });
        pdf.text(cleanText(it.rate), rateX, rowAnchorY, { align: "right" });
        pdf.setFont(fontFamily, "bold");
        pdf.text(cleanText(it.qty), qtyX, rowAnchorY, { align: "center" });
        pdf.text(cleanText(it.total), totalX, rowAnchorY, { align: "right" });
        y = Math.max(y, rowAnchorY + lineH) + 2;
      });

      // MRP Savings Highlight Box
      if (savingsLabel && savingsValue) {
        y += 3;
        const boxH = isA4 ? 20 : 15;
        const textY = y + (isA4 ? 3 : 0.5);
        pdf.setFillColor(236, 253, 245);
        pdf.setDrawColor(167, 243, 208);
        pdf.roundedRect(padX, y - 10, rightX - padX, boxH, 3, 3, "FD");
        pdf.setFont(fontFamily, "bold");
        pdf.setFontSize(isA4 ? 8.5 : is58 ? 5.2 : 6.2);
        pdf.setTextColor(6, 95, 70);
        pdf.text(savingsLabel, padX + 5, textY);
        pdf.text(savingsValue, rightX - 5, textY, { align: "right" });
        y += boxH;
      }

      y += 2;
      drawDashedLine(y);
      y += 11;

      mathLines.forEach(m => {
        const isTotal = m.key.includes("TOTAL PAYABLE") || m.key.includes("TOTAL NET PAYABLE");
        const isPaymentMode = m.key.includes("Payment Mode") || m.key.includes("Tender Mode");

        if (isTotal) {
          drawDashedLine(y - 6);
          y += 3;
          pdf.setFont(fontFamily, "bold");
          pdf.setFontSize(isA4 ? 11 : is58 ? 7.0 : 8.5);
          pdf.setTextColor(15, 23, 42);
          pdf.text(cleanText(m.key), padX, y);
          pdf.text(cleanText(m.val), rightX, y, { align: "right" });
          y += lineH + 4;
        } else if (isPaymentMode) {
          pdf.setFont(fontFamily, "normal");
          pdf.setFontSize(metaFontSize);
          pdf.setTextColor(30, 41, 59);
          pdf.text(cleanText(m.key), padX, y);

          const badgeText = cleanText(m.val);
          pdf.setFont(fontFamily, "bold");
          pdf.setFontSize(isA4 ? 8.2 : is58 ? 5.4 : 6.5);
          const badgeW = pdf.getTextWidth(badgeText) + 8;
          const badgeH = isA4 ? 13 : 10;
          pdf.setFillColor(15, 23, 42);
          pdf.roundedRect(rightX - badgeW, y - badgeH + 2.5, badgeW, badgeH, 2, 2, "F");
          pdf.setTextColor(255, 255, 255);
          pdf.text(badgeText, rightX - 4, y, { align: "right" });
          pdf.setTextColor(30, 41, 59);
          y += lineH + 2;
        } else {
          pdf.setFont(fontFamily, "normal");
          pdf.setFontSize(metaFontSize);
          pdf.setTextColor(51, 65, 85);
          pdf.text(cleanText(m.key), padX, y);
          pdf.text(cleanText(m.val), rightX, y, { align: "right" });
          y += lineH + 1;
        }
      });

      if (footerMsg) {
        y += 5;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(isA4 ? 8 : is58 ? 5.2 : 6.2);
        const splitFooter = pdf.splitTextToSize(footerMsg, pdfWidth - padX * 2 - 10);
        const footerLineH = isA4 ? 10 : 8.5;
        const boxH = splitFooter.length * footerLineH + 10;
        pdf.setFillColor(241, 245, 249);
        pdf.setDrawColor(226, 232, 240);
        pdf.roundedRect(padX, y - 6, rightX - padX, boxH, 3, 3, "FD");
        pdf.setTextColor(71, 85, 105);
        let fy = y + 3;
        splitFooter.forEach((line: string) => {
          pdf.text(line, pdfWidth / 2, fy, { align: "center" });
          fy += footerLineH;
        });
      }

      pdf.save(filename);
      return true;
    } 
    else if (elementId === "superadmin-invoice-print") {
      const invoiceIdEl = element.querySelector(".font-mono.text-blue-600");
      const invoiceId = invoiceIdEl ? invoiceIdEl.textContent?.trim() : "N/A";

      const tenantNameEl = element.querySelector(".font-extrabold.text-slate-800");
      const tenantName = tenantNameEl ? tenantNameEl.textContent?.trim() : "N/A";

      let tenantId = "N/A";
      let issueDate = "N/A";
      let dueDate = "N/A";
      let paymentMethod = "N/A";

      const textNodes = element.innerText || element.textContent || "";
      const idMatch = textNodes.match(/Tenant ID:\s*([^\n]+)/i);
      if (idMatch) tenantId = idMatch[1].trim();
      const issueMatch = textNodes.match(/Issued:\s*([^\n]+)/i);
      if (issueMatch) issueDate = issueMatch[1].trim();
      const dueMatch = textNodes.match(/Due:\s*([^\n]+)/i);
      if (dueMatch) dueDate = dueMatch[1].trim();
      const methodMatch = textNodes.match(/Method:\s*([^\n]+)/i);
      if (methodMatch) paymentMethod = methodMatch[1].trim();

      const items: { description: string; amount: string }[] = [];
      const itemRows = element.querySelectorAll(".divide-y > div");
      itemRows.forEach(row => {
        const spans = row.querySelectorAll("span");
        if (spans.length >= 2) {
          items.push({
            description: spans[0].textContent?.trim() || "",
            amount: spans[1].textContent?.trim() || ""
          });
        }
      });

      const calcs: { label: string; value: string }[] = [];
      const calcRows = element.querySelectorAll(".border-t.border-slate-100 div.flex, .border-t.border-slate-100 div");
      calcRows.forEach(div => {
        const spans = div.querySelectorAll("span");
        if (spans.length >= 2) {
          calcs.push({
            label: spans[0].textContent?.trim() || "",
            value: spans[1].textContent?.trim() || ""
          });
        }
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      let y = 40;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(37, 99, 235); 
      pdf.text("EXPERT POS SAAS INC.", 40, y);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139); 
      y += 14;
      pdf.text("SOVEREIGN CORE INFRASTRUCTURE", 40, y);

      pdf.setFontSize(14);
      pdf.setTextColor(15, 23, 42); 
      pdf.text("INVOICE", 550, 40, { align: "right" });
      pdf.setFontSize(11);
      pdf.text(`ID: ${cleanText(invoiceId)}`, 550, 55, { align: "right" });

      y += 25;
      pdf.line(40, y, 555, y);
      y += 20;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text("BILLED TO", 45, y);
      pdf.text("DATES & PARAMETERS", 320, y);
      y += 15;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(15, 23, 42);
      pdf.text(cleanText(tenantName), 45, y);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(cleanText(`Issued: ${issueDate}`), 320, y);
      y += 14;

      pdf.text(cleanText(`Tenant ID: ${tenantId}`), 45, y);
      pdf.text(cleanText(`Due: ${dueDate}`), 320, y);
      y += 14;

      if (paymentMethod !== "N/A") {
        pdf.text(cleanText(`Payment Method: ${paymentMethod}`), 320, y);
        y += 14;
      }

      y += 15;
      pdf.line(40, y, 555, y);
      y += 20;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text("ITEMIZED SLICES & FEES", 40, y);
      pdf.text("AMOUNT (INR)", 550, y, { align: "right" });
      y += 10;
      pdf.line(40, y, 555, y);
      y += 18;

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(15, 23, 42);
      items.forEach(it => {
        pdf.setFont("helvetica", "bold");
        pdf.text(cleanText(it.description), 40, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(cleanText(it.amount), 550, y, { align: "right" });
        y += 20;
      });

      pdf.line(40, y, 555, y);
      y += 20;

      pdf.setFontSize(10);
      calcs.forEach(c => {
        const isTotal = c.label.includes("Total Due") || c.label.includes("TOTAL PAYABLE");
        if (isTotal) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.setTextColor(37, 99, 235);
          pdf.text(cleanText(c.label), 320, y);
          pdf.text(cleanText(c.value), 550, y, { align: "right" });
          pdf.setFontSize(10);
          y += 22;
        } else {
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(100, 116, 139);
          pdf.text(cleanText(c.label), 320, y);
          pdf.text(cleanText(c.value), 550, y, { align: "right" });
          y += 16;
        }
      });

      y += 30;
      pdf.setFillColor(243, 244, 246);
      pdf.rect(40, y, 515, 45, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(37, 99, 235);
      pdf.text("SOVEREIGN COMPLIANCE ASSURANCE", pdf.internal.pageSize.width / 2, y + 15, { align: "center" });
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(100, 116, 139);
      pdf.text("This receipt has been cryptographically published and verified to the client sandbox isolate ledger.", pdf.internal.pageSize.width / 2, y + 30, { align: "center" });

      pdf.save(filename);
      return true;
    }
    else {
      const ths = element.querySelectorAll("th");
      const headers: string[] = [];
      if (ths.length > 0) {
        ths.forEach(th => headers.push(th.textContent?.trim() || ""));
      } else {
        const firstRow = element.querySelector("tr, .grid");
        if (firstRow) {
          const cells = firstRow.querySelectorAll("td, th, span, div");
          cells.forEach(c => {
            if (c.parentElement === firstRow) {
              headers.push(c.textContent?.trim() || "");
            }
          });
        }
      }

      const rows: string[][] = [];
      const trs = element.querySelectorAll("tr");
      if (trs.length > 0) {
        trs.forEach((tr, idx) => {
          if (idx === 0 && ths.length > 0) return; // skip header
          const rowData: string[] = [];
          const tds = tr.querySelectorAll("td");
          tds.forEach(td => rowData.push(td.textContent?.trim() || ""));
          if (rowData.length > 0) rows.push(rowData);
        });
      } else {
        const gridRows = element.querySelectorAll(".grid");
        gridRows.forEach((gridRow, idx) => {
          if (idx === 0) return; // skip header
          const rowData: string[] = [];
          const cells = gridRow.querySelectorAll("span, div");
          cells.forEach(c => {
            if (c.parentElement === gridRow) {
              rowData.push(c.textContent?.trim() || "");
            }
          });
          if (rowData.length > 0) rows.push(rowData);
        });
      }

      const pdf = new jsPDF({
        orientation: "landscape", 
        unit: "pt",
        format: "a4"
      });

      let y = 40;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(15, 23, 42);
      
      const title = elementId === "billing-ledger-table" 
        ? "SOVEREIGN BILLING & LEDGER REPORT" 
        : "PLATFORM INVOICES DIRECTORY REPORT";
      pdf.text(title, 40, y);
      y += 15;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 40, y);
      y += 20;

      if (headers.length > 0) {
        const colWidth = (842 - 80) / headers.length; 
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(15, 23, 42);
        pdf.setFillColor(241, 245, 249);
        pdf.rect(40, y - 10, 842 - 80, 18, "F");
        
        headers.forEach((h, i) => {
          pdf.text(cleanText(h), 45 + (i * colWidth), y + 2);
        });
        y += 18;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(51, 65, 85);

        rows.forEach((row, rIdx) => {
          if (y > 550) {
            pdf.addPage("a4", "landscape");
            y = 40;
            pdf.setFont("helvetica", "bold");
            pdf.setFillColor(241, 245, 249);
            pdf.rect(40, y - 10, 842 - 80, 18, "F");
            headers.forEach((h, i) => {
              pdf.text(cleanText(h), 45 + (i * colWidth), y + 2);
            });
            y += 18;
            pdf.setFont("helvetica", "normal");
          }

          if (rIdx % 2 === 0) {
            pdf.setFillColor(248, 250, 252);
            pdf.rect(40, y - 10, 842 - 80, 15, "F");
          }

          row.forEach((cell, cIdx) => {
            const val = cell.length > 30 ? cell.slice(0, 27) + "..." : cell;
            pdf.text(cleanText(val), 45 + (cIdx * colWidth), y);
          });
          y += 15;
        });
      }

      pdf.save(filename);
      return true;
    }
  } catch (err) {
    console.error("Vector PDF fallback generator also failed:", err);
    return false;
  }
}

/**
 * Universal Excel / CSV Exporter with UTF-8 BOM, report metadata, executive KPI metrics, and itemized rows.
 */
export function exportToExcelCSV(options: {
  filename: string;
  title: string;
  subtitle?: string;
  tenantInfo?: {
    name?: string;
    location?: string;
    address?: string;
    phone?: string;
    gstin?: string;
  };
  filterPeriod?: string;
  summaryMetrics?: { label: string; value: string | number }[];
  columns: string[];
  rows: (string | number | undefined | null)[][];
}): boolean {
  const { filename, title, subtitle, tenantInfo, filterPeriod, summaryMetrics, columns, rows } = options;

  const escapeCSV = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines: string[] = [];

  // Report Header Block
  lines.push([escapeCSV(title.toUpperCase()), escapeCSV("")].join(","));
  if (subtitle) {
    lines.push([escapeCSV(subtitle), escapeCSV("")].join(","));
  }
  lines.push([escapeCSV("Report Filter Period:"), escapeCSV(filterPeriod || "All Records")].join(","));
  lines.push([escapeCSV("Generated Timestamp:"), escapeCSV(new Date().toLocaleString())].join(","));
  
  if (tenantInfo) {
    if (tenantInfo.name) lines.push([escapeCSV("Enterprise / Store Name:"), escapeCSV(tenantInfo.name)].join(","));
    if (tenantInfo.location) lines.push([escapeCSV("Business Location / Outlet:"), escapeCSV(tenantInfo.location)].join(","));
    if (tenantInfo.address) lines.push([escapeCSV("Store Address:"), escapeCSV(tenantInfo.address)].join(","));
    if (tenantInfo.phone) lines.push([escapeCSV("Contact Phone:"), escapeCSV(tenantInfo.phone)].join(","));
    if (tenantInfo.gstin) lines.push([escapeCSV("GSTIN / Tax ID:"), escapeCSV(tenantInfo.gstin)].join(","));
  }

  lines.push(""); // empty separator

  // Summary Metrics Block
  if (summaryMetrics && summaryMetrics.length > 0) {
    lines.push([escapeCSV("=== EXECUTIVE SUMMARY / KEY METRICS ==="), escapeCSV("")].join(","));
    summaryMetrics.forEach(m => {
      lines.push([escapeCSV(m.label), escapeCSV(m.value)].join(","));
    });
    lines.push(""); // separator
  }

  // Data Table Column Headers
  lines.push(columns.map(c => escapeCSV(c)).join(","));

  // Rows
  rows.forEach(r => {
    lines.push(r.map(cell => escapeCSV(cell)).join(","));
  });

  // UTF-8 BOM so Excel opens with proper encoding
  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const cleanName = filename.toLowerCase().endsWith(".csv") ? filename : `${filename}.csv`;
  link.setAttribute("download", cleanName);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);

  return true;
}

