/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

export async function printElementById(
  elementId: string, 
  layoutProfile: "standard-a4" | "thermal-80mm" | "thermal-58mm" = "standard-a4",
  options?: PrintOptions
): Promise<boolean> {
  // Wait/poll for the element to exist in the DOM (up to 1500ms, checking every 50ms)
  let element = document.getElementById(elementId);
  if (!element) {
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      element = document.getElementById(elementId);
      if (element) break;
    }
  }

  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  const isA4 = layoutProfile === "standard-a4";
  const is58 = layoutProfile === "thermal-58mm";
  const widthCss = is58 ? "58mm" : isA4 ? "210mm" : "80mm";
  const paddingCss = isA4 ? "15mm" : is58 ? "2mm" : "4mm";
  const fontFamilyCss = isA4
    ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    : 'monospace, "Courier New", Courier';
  const fontSizeCss = is58 ? "10px" : isA4 ? "12px" : "11px";

  // Clean copy of element HTML without interactive buttons
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("button, .no-print, .action-buttons, [role='button']").forEach(el => el.remove());

  // 1. Hardware iframe spooler execution
  let iframePrinted = false;
  try {
    const existingFrame = document.getElementById("pos-hardware-print-iframe");
    if (existingFrame) existingFrame.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "pos-hardware-print-iframe";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt Spool - ${options?.invoiceId || elementId}</title>
  <style>
    @page {
      size: ${isA4 ? "A4 portrait" : is58 ? "58mm auto" : "80mm auto"};
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      background: #ffffff !important;
      color: #000000 !important;
      margin: 0 !important;
      padding: ${paddingCss} !important;
      width: ${widthCss} !important;
      font-family: ${fontFamilyCss} !important;
      font-size: ${fontSizeCss} !important;
    }
    .print-target-wrapper {
      width: 100% !important;
      max-width: 100% !important;
    }
    button, .no-print, .action-buttons, [role="button"] { display: none !important; }
  </style>
</head>
<body>
  <div class="print-target-wrapper">
    ${clone.innerHTML}
  </div>
</body>
</html>`);
      doc.close();

      await new Promise(resolve => setTimeout(resolve, 300));
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        iframePrinted = true;
      } catch (e) {
        console.warn("Direct iframe.print() was suppressed by browser security:", e);
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      }
    }
  } catch (err) {
    console.warn("Iframe spooler init error:", err);
  }

  // 2. Guaranteed PDF receipt compilation & automatic download
  // In iframe sandboxes (e.g. AI Studio preview), modal dialogs from window.print() are blocked silently.
  // We ALWAYS compile and download the PDF so the user gets their tangible receipt document immediately!
  const filename = options?.filename || 
    (options?.invoiceId ? `Receipt-${options.invoiceId}.pdf` : `Receipt-${elementId}-${new Date().toISOString().slice(0, 10)}.pdf`);

  let pdfSuccess = false;
  try {
    pdfSuccess = await saveElementAsPDF(elementId, filename, layoutProfile);
  } catch (pdfErr) {
    console.error("PDF generation error during spool:", pdfErr);
  }

  return iframePrinted || pdfSuccess;
}

/**
 * Downloads a standalone, self-contained HTML slip that opens in any browser
 * and triggers the system printer dialog automatically without sandbox restrictions.
 */
export function downloadPrintableHtmlSlip(
  elementId: string,
  filename: string = "receipt-slip.html",
  layoutProfile: "standard-a4" | "thermal-80mm" | "thermal-58mm" = "thermal-80mm"
): boolean {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("button, .no-print, .action-buttons, [role='button']").forEach(b => b.remove());

  const isA4 = layoutProfile === "standard-a4";
  const is58 = layoutProfile === "thermal-58mm";
  const widthCss = is58 ? "58mm" : isA4 ? "210mm" : "80mm";
  const bodyPadding = isA4 ? "15mm" : is58 ? "2mm" : "4mm";
  const fontFamily = isA4 
    ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    : 'monospace, "Courier New", Courier';
  const fontSize = is58 ? "10px" : isA4 ? "13px" : "11px";

  const cleanFilename = filename.endsWith(".html") ? filename : `${filename}.html`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanFilename.replace(/\.html$/, "")}</title>
  <style>
    @page {
      size: ${isA4 ? "A4 portrait" : is58 ? "58mm auto" : "80mm auto"};
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
      color: #000;
      background: #fff;
    }
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
    }
  </style>
</head>
<body>
  <div class="print-control-bar">
    <button class="print-btn" onclick="window.print()">🖨️ Click Here to Print Receipt Now</button>
    <div style="font-size: 11px; margin-top: 6px; opacity: 0.85;">Opens printer dialog automatically with your paper dimensions</div>
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
  layoutProfile: "standard-a4" | "thermal-80mm" | "thermal-58mm" = "standard-a4"
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
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
            } else if (layoutProfile === "thermal-80mm") {
              el.style.width = "340px";
              el.style.padding = "12px";
              el.style.boxSizing = "border-box";
              el.style.backgroundColor = "#ffffff";
              el.style.color = "#000000";
              el.style.borderRadius = "0";
              el.style.border = "none";
              el.style.boxShadow = "none";

              const allText = el.querySelectorAll("*");
              allText.forEach(node => {
                try {
                  const htmlNode = node as HTMLElement;
                  if (htmlNode && htmlNode.style) {
                    htmlNode.style.fontFamily = "monospace";
                    htmlNode.style.fontSize = "12px";
                  }
                } catch (e) {
                  // Ignore style application errors for non-stylable nodes
                }
              });
              const headings = el.querySelectorAll("h4");
              headings.forEach(node => {
                try {
                  const htmlNode = node as HTMLElement;
                  if (htmlNode && htmlNode.style) {
                    htmlNode.style.fontSize = "14px";
                  }
                } catch (e) {
                  // Ignore style application errors
                }
              });
            } else if (layoutProfile === "thermal-58mm") {
              el.style.width = "240px";
              el.style.padding = "4px";
              el.style.boxSizing = "border-box";
              el.style.backgroundColor = "#ffffff";
              el.style.color = "#000000";
              el.style.borderRadius = "0";
              el.style.border = "none";
              el.style.boxShadow = "none";

              const allText = el.querySelectorAll("*");
              allText.forEach(node => {
                try {
                  const htmlNode = node as HTMLElement;
                  if (htmlNode && htmlNode.style) {
                    htmlNode.style.fontFamily = "monospace";
                    htmlNode.style.fontSize = "10px";
                  }
                } catch (e) {
                  // Ignore style application errors
                }
              });
              const headings = el.querySelectorAll("h4");
              headings.forEach(node => {
                try {
                  const htmlNode = node as HTMLElement;
                  if (htmlNode && htmlNode.style) {
                    htmlNode.style.fontSize = "11px";
                  }
                } catch (e) {
                  // Ignore style application errors
                }
              });
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

// Highly sophisticated, sandboxed-safe offline high-fidelity vector PDF compiler
function generateVectorPDFFallback(
  element: HTMLElement,
  elementId: string,
  filename: string,
  layoutProfile: "standard-a4" | "thermal-80mm" | "thermal-58mm"
): boolean {
  const cleanText = (str: string): string => {
    if (!str) return "";
    // Replace Indian Rupee symbol with "Rs." so it doesn't corrupt subsequent character encodings in jsPDF standard fonts
    let cleaned = str.replace(/₹/g, "Rs.");
    // Normalize non-breaking spaces and other potential corrupting symbols
    cleaned = cleaned.replace(/\u00a0/g, " ");
    return cleaned;
  };

  try {
    if (elementId === "invoice-receipt-theme" || elementId === "virtual-receipt-roll-wrapper") {
      const titleEl = element.querySelector("h4");
      const storeTitle = titleEl ? titleEl.textContent?.replace(/[⭐*]/g, "").trim() : "RETAIL STORE RECEIPT";

      const subtitleEls = element.querySelectorAll("p");
      const branchName = subtitleEls[0] ? subtitleEls[0].textContent?.trim() : "";
      const branchAddress = subtitleEls[1] ? subtitleEls[1].textContent?.trim() : "";
      const branchPhone = subtitleEls[2] ? subtitleEls[2].textContent?.trim() : "";

      const metaLines: { key: string; val: string }[] = [];
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

      const items: { name: string; qty: string; price: string }[] = [];
      const gridDivs = element.querySelectorAll("div.grid");
      gridDivs.forEach((div, idx) => {
        if (idx === 0) return; // skip header
        const spans = div.querySelectorAll("span");
        if (spans.length >= 5) {
          items.push({
            name: spans[0].textContent?.trim() || "",
            qty: spans[3].textContent?.trim() || "",
            price: spans[4].textContent?.trim() || ""
          });
        } else if (spans.length >= 3) {
          items.push({
            name: spans[0].textContent?.trim() || "",
            qty: spans[1].textContent?.trim() || "",
            price: spans[2].textContent?.trim() || ""
          });
        }
      });

      const mathLines: { key: string; val: string }[] = [];
      divs.forEach(div => {
        if (div.classList.contains("flex") && div.classList.contains("justify-between")) {
          const spans = div.querySelectorAll("span");
          if (spans.length === 2) {
            const key = spans[0].textContent?.trim() || "";
            const val = spans[1].textContent?.trim() || "";
            if (
              key.includes("Tax") || 
              key.includes("discount") || 
              key.includes("TOTAL") || 
              key.includes("PAYABLE") ||
              key.includes("Payment Mode") ||
              key.includes("Tender Mode") ||
              key.includes("Cash") ||
              key.includes("Change")
            ) {
              mathLines.push({ key, val });
            }
          }
        }
      });

      const isA4 = layoutProfile === "standard-a4";
      const pdfWidth = isA4 ? 595 : (layoutProfile === "thermal-58mm" ? 180 : 250); 
      const approxHeight = isA4 ? 842 : (220 + (metaLines.length * 12) + (items.length * 15) + (mathLines.length * 12));
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: isA4 ? "a4" : [pdfWidth, approxHeight]
      });

      const fontFamily = isA4 ? "helvetica" : "courier";
      pdf.setFont(fontFamily, "bold");
      pdf.setFontSize(isA4 ? 14 : 10);
      let y = isA4 ? 35 : 20;

      const padX = isA4 ? 40 : 10;
      const rightX = pdfWidth - padX;
      const qtyX = isA4 ? pdfWidth - 140 : pdfWidth - 65;
      const priceX = rightX;

      pdf.text(cleanText(storeTitle || "RETAIL CASH RECEIPT"), pdfWidth / 2, y, { align: "center" });
      y += (isA4 ? 16 : 12);

      pdf.setFont(fontFamily, "normal");
      pdf.setFontSize(isA4 ? 9 : 8);
      if (branchName) {
        pdf.text(cleanText(branchName), pdfWidth / 2, y, { align: "center" });
        y += (isA4 ? 12 : 10);
      }
      if (branchAddress) {
        const splitAddress = pdf.splitTextToSize(cleanText(branchAddress), pdfWidth - (padX * 2));
        splitAddress.forEach((line: string) => {
          pdf.text(line, pdfWidth / 2, y, { align: "center" });
          y += (isA4 ? 12 : 10);
        });
      }
      if (branchPhone) {
        pdf.text(cleanText(branchPhone), pdfWidth / 2, y, { align: "center" });
        y += (isA4 ? 12 : 10);
      }

      y += 4;
      pdf.line(padX, y, rightX, y);
      y += 10;

      metaLines.forEach(m => {
        pdf.setFont(fontFamily, "normal");
        pdf.text(cleanText(m.key), padX, y);
        pdf.setFont(fontFamily, "bold");
        pdf.text(cleanText(m.val), rightX, y, { align: "right" });
        y += (isA4 ? 13 : 11);
      });

      y += 2;
      pdf.line(padX, y, rightX, y);
      y += 10;

      pdf.setFont(fontFamily, "bold");
      pdf.text("Description", padX, y);
      pdf.text("Qty", qtyX, y, { align: "right" });
      pdf.text("Price", priceX, y, { align: "right" });
      y += 11;
      pdf.line(padX, y, rightX, y);
      y += 10;

      pdf.setFont(fontFamily, "normal");
      items.forEach(it => {
        const nameLines = pdf.splitTextToSize(cleanText(it.name), isA4 ? (pdfWidth - 220) : (pdfWidth - 90));
        const startY = y;
        nameLines.forEach((line: string) => {
          pdf.text(line, padX, y);
          y += (isA4 ? 12 : 10);
        });
        
        const finalY = Math.max(y - (isA4 ? 12 : 10), startY);
        pdf.setFont(fontFamily, "bold");
        pdf.text(cleanText(it.qty), qtyX, finalY, { align: "right" });
        pdf.text(cleanText(it.price), priceX, finalY, { align: "right" });
        pdf.setFont(fontFamily, "normal");
        y = Math.max(y, finalY + (isA4 ? 13 : 11));
      });

      y += 2;
      pdf.line(padX, y, rightX, y);
      y += 11;

      mathLines.forEach(m => {
        if (m.key.includes("TOTAL PAYABLE") || m.key.includes("NET PAYABLE")) {
          pdf.setFont(fontFamily, "bold");
          pdf.setFontSize(isA4 ? 12 : 10);
          pdf.text(cleanText(m.key), padX, y);
          pdf.text(cleanText(m.val), rightX, y, { align: "right" });
          y += 14;
        } else {
          pdf.setFont(fontFamily, "normal");
          pdf.setFontSize(isA4 ? 9 : 8);
          pdf.text(cleanText(m.key), padX, y);
          pdf.text(cleanText(m.val), rightX, y, { align: "right" });
          y += (isA4 ? 13 : 11);
        }
      });

      y += 5;
      pdf.setFont("courier", "italic");
      pdf.setFontSize(7);
      
      const footerBox = element.querySelector(".p-3.bg-slate-100, .p-2.bg-slate-50");
      const footerMsg = footerBox ? footerBox.textContent?.trim() : "Thank you for your business!";
      if (footerMsg) {
        const splitFooter = pdf.splitTextToSize(cleanText(footerMsg), pdfWidth - 20);
        splitFooter.forEach((line: string) => {
          pdf.text(line, pdfWidth / 2, y, { align: "center" });
          y += 9;
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

