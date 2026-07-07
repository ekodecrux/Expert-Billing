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

export enum MeasurementUnit {
  KG = "Kg",
  LITER = "Liters",
  PIECE = "Pieces",
  PACK = "Packs",
  GRAM = "Grams"
}

export interface Product {
  id: string; // SKU
  name: string;
  barcode: string;
  category: string;
  sku: string;
  purchasePrice: number;
  price: number;
  gstRate: number; // e.g. 5, 12, 18 for GST percentage
  unit: MeasurementUnit;
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
  price: number; // pricing after item discount
  quantity: number;
  unit: MeasurementUnit;
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

// AI Billing Assistant Types
export interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  suggestions?: string[];
  suggestedAction?: {
    type: "APPLY_DISCOUNT" | "ADD_TO_CART" | "REORDER_PRODUCT" | "TRANSFER_STOCK";
    payload: any;
  };
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

export async function printElementById(
  elementId: string, 
  layoutProfile: "standard-a4" | "thermal-80mm" | "thermal-58mm" = "standard-a4"
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  // Gather stylesheet markup to pass into the popup window for exact layout replication
  const stylesHtml = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
    .map(style => style.outerHTML)
    .join("\n");

  let layoutCssOverride = "";
  if (layoutProfile === "standard-a4") {
    layoutCssOverride = `
      body, html {
        background: white !important;
        color: black !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .print-target-wrapper, #${elementId}, #print-temporary-container {
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 40px !important;
        box-sizing: border-box !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      /* Remove forced narrow scroll bounds on standard A4 printers */
      .max-w-sm, .max-w-md, .max-w-lg {
        max-width: 100% !important;
        width: 100% !important;
      }
      /* Expand layout grids beautifully */
      .grid {
        display: grid !important;
        width: 100% !important;
      }
    `;
  } else if (layoutProfile === "thermal-58mm") {
    layoutCssOverride = `
      body, html {
        background: white !important;
        color: black !important;
        width: 58mm !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .print-target-wrapper, #${elementId}, #print-temporary-container {
        max-width: 52mm !important;
        width: 52mm !important;
        margin: 0 auto !important;
        padding: 4px !important;
        box-sizing: border-box !important;
        font-family: monospace !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        font-size: 10px !important;
      }
      * {
        font-size: 10px !important;
      }
      h4 {
        font-size: 11px !important;
      }
    `;
  } else { // thermal-80mm
    layoutCssOverride = `
      body, html {
        background: white !important;
        color: black !important;
        width: 80mm !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .print-target-wrapper, #${elementId}, #print-temporary-container {
        max-width: 76mm !important;
        width: 76mm !important;
        margin: 0 auto !important;
        padding: 12px !important;
        box-sizing: border-box !important;
        font-family: monospace !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        font-size: 12px !important;
      }
      * {
        font-size: 12px !important;
      }
      h4 {
        font-size: 14px !important;
      }
    `;
  }

  let printSuccess = false;

  // Add printing-active class to body
  document.body.classList.add("printing-active");

  const printStyle = document.createElement("style");
  printStyle.id = "print-element-style";
  printStyle.innerHTML = `
    @media print {
      html, body {
        background: white !important;
        color: black !important;
        height: auto !important;
        overflow: visible !important;
      }
      body > *:not(#print-temporary-container) {
        display: none !important;
      }
      #print-temporary-container {
        display: block !important;
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        background: white !important;
        color: black !important;
        z-index: 999999 !important;
      }
      button, .no-print, .action-buttons, [role="button"] {
        display: none !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      ${layoutCssOverride}
    }
  `;
  document.head.appendChild(printStyle);

  const tempContainer = document.createElement("div");
  tempContainer.id = "print-temporary-container";
  tempContainer.className = "print-target-wrapper";
  // Copy innerHTML to avoid ID duplication clashing
  tempContainer.innerHTML = element.innerHTML;

  // Clean up buttons & interactive elements inside the copy
  const interactiveElements = tempContainer.querySelectorAll("button, .no-print, .action-buttons, [role='button']");
  interactiveElements.forEach(el => {
    (el as HTMLElement).style.display = "none";
  });

  document.body.appendChild(tempContainer);

  try {
    window.print();
    printSuccess = true;
  } catch (error) {
    console.warn("In-page browser printing failed or was blocked by sandbox security. Instantly triggering high-fidelity PDF compile...", error);
    // Fallback: Direct high-fidelity PDF compile and downloader
    const filename = `Print-${elementId}-${new Date().toISOString().slice(0, 10)}.pdf`;
    printSuccess = await saveElementAsPDF(elementId, filename);
  }

  // Clean up our temporary DOM nodes and styles safely
  setTimeout(() => {
    document.body.classList.remove("printing-active");
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
    const styleEl = document.getElementById("print-element-style");
    if (styleEl) {
      styleEl.remove();
    }
  }, 1000);

  return printSuccess;
}

export async function saveElementAsPDF(elementId: string, filename: string): Promise<boolean> {
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
        // Ensure any styling adjustment for printable clone is handled here if needed
        const el = clonedDoc.getElementById(elementId);
        if (el) {
          el.style.maxHeight = "none"; // Let the full table expand so it is captured fully
          el.style.overflow = "visible";
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
    console.error("Error generating PDF:", error);
    return false;
  }
}

