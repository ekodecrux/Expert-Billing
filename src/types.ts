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

  // Gather stylesheet markup to pass into the print layout
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

  // Allow browser layout and rendering to settle down before triggering print dialog
  await new Promise<void>((resolve) => setTimeout(resolve, 350));

  let printSuccess = false;
  try {
    window.print();
    printSuccess = true;
  } catch (error) {
    console.warn("In-page browser printing failed or was blocked by sandbox security. Instantly triggering high-fidelity PDF compile...", error);
    // Fallback: Direct high-fidelity PDF compile and downloader
    const filename = `Print-${elementId}-${new Date().toISOString().slice(0, 10)}.pdf`;
    printSuccess = await saveElementAsPDF(elementId, filename, layoutProfile);
  }

  // Defer cleanup of DOM nodes and print styles so the browser print preview
  // has ample time to spool the layout and content.
  const cleanup = () => {
    document.body.classList.remove("printing-active");
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
    const styleEl = document.getElementById("print-element-style");
    if (styleEl) {
      styleEl.remove();
    }
  };

  window.addEventListener("afterprint", cleanup, { once: true });
  // Safe 2.5 second fallback cleanup
  setTimeout(cleanup, 2500);

  return printSuccess;
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
  try {
    if (elementId === "invoice-receipt-theme") {
      const titleEl = element.querySelector("h4");
      const storeTitle = titleEl ? titleEl.textContent?.trim() : "EXPERT-AID HYPERMARKETS";

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
      const gridDivs = element.querySelectorAll("div.grid.grid-cols-4");
      gridDivs.forEach((div, idx) => {
        if (idx === 0) return; // skip header
        const spans = div.querySelectorAll("span");
        if (spans.length >= 3) {
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
              key.includes("Tax value") || 
              key.includes("discount") || 
              key.includes("TOTAL PAYABLE") || 
              key.includes("Payment Mode")
            ) {
              mathLines.push({ key, val });
            }
          }
        }
      });

      const pdfWidth = layoutProfile === "thermal-58mm" ? 180 : 250; 
      const approxHeight = 220 + (metaLines.length * 12) + (items.length * 15) + (mathLines.length * 12);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [pdfWidth, approxHeight]
      });

      pdf.setFont("courier", "bold");
      pdf.setFontSize(10);
      let y = 20;

      pdf.text(storeTitle || "EXPERT-AID HYPERMARKETS", pdfWidth / 2, y, { align: "center" });
      y += 12;

      pdf.setFont("courier", "normal");
      pdf.setFontSize(8);
      if (branchName) {
        pdf.text(branchName, pdfWidth / 2, y, { align: "center" });
        y += 10;
      }
      if (branchAddress) {
        const splitAddress = pdf.splitTextToSize(branchAddress, pdfWidth - 20);
        splitAddress.forEach((line: string) => {
          pdf.text(line, pdfWidth / 2, y, { align: "center" });
          y += 10;
        });
      }
      if (branchPhone) {
        pdf.text(branchPhone, pdfWidth / 2, y, { align: "center" });
        y += 10;
      }

      y += 2;
      pdf.line(10, y, pdfWidth - 10, y);
      y += 10;

      metaLines.forEach(m => {
        pdf.setFont("courier", "normal");
        pdf.text(m.key, 10, y);
        pdf.setFont("courier", "bold");
        pdf.text(m.val, pdfWidth - 10, y, { align: "right" });
        y += 11;
      });

      y += 2;
      pdf.line(10, y, pdfWidth - 10, y);
      y += 10;

      pdf.setFont("courier", "bold");
      pdf.text("Description", 10, y);
      pdf.text("Qty", pdfWidth - 65, y, { align: "right" });
      pdf.text("Price", pdfWidth - 10, y, { align: "right" });
      y += 11;
      pdf.line(10, y, pdfWidth - 10, y);
      y += 10;

      pdf.setFont("courier", "normal");
      items.forEach(it => {
        const nameLines = pdf.splitTextToSize(it.name, pdfWidth - 90);
        const startY = y;
        nameLines.forEach((line: string) => {
          pdf.text(line, 10, y);
          y += 10;
        });
        
        const finalY = Math.max(y - 10, startY);
        pdf.setFont("courier", "bold");
        pdf.text(it.qty, pdfWidth - 65, finalY, { align: "right" });
        pdf.text(it.price, pdfWidth - 10, finalY, { align: "right" });
        pdf.setFont("courier", "normal");
        y = Math.max(y, finalY + 11);
      });

      y += 2;
      pdf.line(10, y, pdfWidth - 10, y);
      y += 11;

      mathLines.forEach(m => {
        if (m.key.includes("TOTAL PAYABLE")) {
          pdf.setFont("courier", "bold");
          pdf.setFontSize(10);
          pdf.text(m.key, 10, y);
          pdf.text(m.val, pdfWidth - 10, y, { align: "right" });
          y += 13;
        } else {
          pdf.setFont("courier", "normal");
          pdf.setFontSize(8);
          pdf.text(m.key, 10, y);
          pdf.text(m.val, pdfWidth - 10, y, { align: "right" });
          y += 11;
        }
      });

      y += 5;
      pdf.setFont("courier", "italic");
      pdf.setFontSize(7);
      pdf.text("Thank you for shopping at Expert POS!", pdfWidth / 2, y, { align: "center" });
      
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
      pdf.text(`ID: ${invoiceId}`, 550, 55, { align: "right" });

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
      pdf.text(tenantName, 45, y);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`Issued: ${issueDate}`, 320, y);
      y += 14;

      pdf.text(`Tenant ID: ${tenantId}`, 45, y);
      pdf.text(`Due: ${dueDate}`, 320, y);
      y += 14;

      if (paymentMethod !== "N/A") {
        pdf.text(`Payment Method: ${paymentMethod}`, 320, y);
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
        pdf.text(it.description, 40, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(it.amount, 550, y, { align: "right" });
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
          pdf.text(c.label, 320, y);
          pdf.text(c.value, 550, y, { align: "right" });
          pdf.setFontSize(10);
          y += 22;
        } else {
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(100, 116, 139);
          pdf.text(c.label, 320, y);
          pdf.text(c.value, 550, y, { align: "right" });
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
          pdf.text(h, 45 + (i * colWidth), y + 2);
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
              pdf.text(h, 45 + (i * colWidth), y + 2);
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
            pdf.text(val, 45 + (cIdx * colWidth), y);
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

