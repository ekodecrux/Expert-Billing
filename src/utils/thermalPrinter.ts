export type PrinterLayoutProfile =
  | "standard-a4"
  | "thermal-58mm"
  | "thermal-76mm"
  | "thermal-80mm"
  | "thermal-112mm";

export type ThermalConnectionMode =
  | "system"
  | "webusb"
  | "webserial"
  | "network";

export interface ThermalPrinterConfig {
  layoutProfile: PrinterLayoutProfile;
  connectionMode: ThermalConnectionMode;
  serialBaudRate: 9600 | 19200 | 38400 | 115200;
  networkIp: string;
  networkPort: number;
  autoCut: boolean;
  openCashDrawer: boolean;
  pairedDeviceLabel?: string;
}

export const THERMAL_LAYOUT_SPECS: Record<
  PrinterLayoutProfile,
  {
    label: string;
    shortLabel: string;
    rollWidthMm: number;
    printableWidthMm: number;
    paddingCss: string;
    pdfWidthPt: number;
    fontSizeCss: string;
    escposCols: number;
    description: string;
  }
> = {
  "thermal-58mm": {
    label: "POS 58mm (2-inch)",
    shortLabel: "58mm",
    rollWidthMm: 58,
    printableWidthMm: 48,
    paddingCss: "2mm 2.5mm",
    pdfWidthPt: 164,
    fontSizeCss: "7.8px",
    escposCols: 32,
    description: "Mini & handheld 2-inch Bluetooth/USB thermal printers (Xprinter XP-58, Rongta, Sunmi, Epson TM-P20)."
  },
  "thermal-76mm": {
    label: "POS 76mm (3-inch Impact)",
    shortLabel: "76mm",
    rollWidthMm: 76,
    printableWidthMm: 64,
    paddingCss: "2.5mm 3mm",
    pdfWidthPt: 215,
    fontSizeCss: "8.5px",
    escposCols: 40,
    description: "76mm retail kitchen/impact & compact thermal printers (Epson TM-U220, Star SP700, Citizen)."
  },
  "thermal-80mm": {
    label: "POS 80mm (3-inch Std)",
    shortLabel: "80mm",
    rollWidthMm: 80,
    printableWidthMm: 72,
    paddingCss: "2.5mm 3mm",
    pdfWidthPt: 226,
    fontSizeCss: "9.2px",
    escposCols: 48,
    description: "Standard 3-inch desktop POS thermal printers (Epson TM-T82/T88, Star TSP100, TVS RP3200, Bixolon)."
  },
  "thermal-112mm": {
    label: "POS 112mm (4-inch Wide)",
    shortLabel: "112mm",
    rollWidthMm: 112,
    printableWidthMm: 104,
    paddingCss: "3mm 4mm",
    pdfWidthPt: 317,
    fontSizeCss: "10px",
    escposCols: 64,
    description: "4-inch wide thermal receipt & parcel printers (Brother RJ-4230B, Star TSP800II, Zebra ZQ520)."
  },
  "standard-a4": {
    label: "Office A4 / Letter",
    shortLabel: "A4",
    rollWidthMm: 210,
    printableWidthMm: 190,
    paddingCss: "8mm",
    pdfWidthPt: 595,
    fontSizeCss: "12px",
    escposCols: 64,
    description: "Normal desktop Laser or Inkjet printers using A4 / Letter sheets."
  }
};

const STORAGE_KEY = "expertpos_thermal_printer_config_v1";

export const DEFAULT_THERMAL_PRINTER_CONFIG: ThermalPrinterConfig = {
  layoutProfile: "thermal-80mm",
  connectionMode: "system",
  serialBaudRate: 9600,
  networkIp: "192.168.1.200",
  networkPort: 9100,
  autoCut: true,
  openCashDrawer: false
};

export function loadThermalPrinterConfig(): ThermalPrinterConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_THERMAL_PRINTER_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_THERMAL_PRINTER_CONFIG,
      ...parsed,
      layoutProfile: THERMAL_LAYOUT_SPECS[parsed?.layoutProfile as PrinterLayoutProfile]
        ? (parsed.layoutProfile as PrinterLayoutProfile)
        : "thermal-80mm",
      connectionMode: ["system", "webusb", "webserial", "network"].includes(parsed?.connectionMode)
        ? parsed.connectionMode
        : "system"
    };
  } catch {
    return { ...DEFAULT_THERMAL_PRINTER_CONFIG };
  }
}

export function saveThermalPrinterConfig(cfg: ThermalPrinterConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // Ignore private browsing storage quota errors
  }
}

export interface ExtractedReceiptContent {
  storeTitle: string;
  receiptHeader: string;
  branchText: string;
  addressText: string;
  contactText: string;
  metaLines: { key: string; val: string }[];
  items: { name: string; mrp: string; rate: string; qty: string; total: string }[];
  savingsLabel: string;
  savingsValue: string;
  mathLines: { key: string; val: string }[];
  footerMsg: string;
}

export function cleanEscPosText(str: string): string {
  if (!str) return "";
  return str
    .replace(/₹/g, "Rs.")
    .replace(/\u00a0/g, " ")
    .replace(/[^\x20-\x7E\n]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function extractReceiptDataFromElement(element: HTMLElement): ExtractedReceiptContent {
  const storeEl = element.querySelector("[data-receipt-store-name='true'], h4");
  const storeTitle = cleanEscPosText(storeEl?.textContent?.replace(/[⭐*]/g, "") || "RETAIL STORE RECEIPT");

  const headerEl = element.querySelector("[data-receipt-header='true']");
  const receiptHeader = cleanEscPosText(headerEl?.textContent || "OFFICIAL RETAIL CASH INVOICE");

  const branchEl = element.querySelector("[data-receipt-branch='true']");
  const branchText = cleanEscPosText(branchEl?.textContent || "");

  const addrEl = element.querySelector("[data-receipt-address='true']");
  const addressText = cleanEscPosText(addrEl?.textContent || "");

  const contactEl = element.querySelector("[data-receipt-contact='true']");
  const contactText = cleanEscPosText(contactEl?.textContent || "");

  const metaLines: { key: string; val: string }[] = [];
  const metaRows = element.querySelectorAll("[data-receipt-meta-row='true']");
  metaRows.forEach((row) => {
    const spans = row.querySelectorAll("span");
    if (spans.length >= 2) {
      metaLines.push({
        key: cleanEscPosText(spans[0].textContent || ""),
        val: cleanEscPosText(spans[spans.length - 1].textContent || "")
      });
    }
  });

  const items: { name: string; mrp: string; rate: string; qty: string; total: string }[] = [];
  const itemRows = element.querySelectorAll("[data-receipt-item-row='true']");
  itemRows.forEach((row) => {
    const spans = row.querySelectorAll("span");
    if (spans.length >= 5) {
      items.push({
        name: cleanEscPosText(spans[0].textContent || ""),
        mrp: cleanEscPosText(spans[1].textContent || ""),
        rate: cleanEscPosText(spans[2].textContent || ""),
        qty: cleanEscPosText(spans[3].textContent || ""),
        total: cleanEscPosText(spans[4].textContent || "")
      });
    }
  });

  const savingsEl = element.querySelector("[data-receipt-savings='true']");
  let savingsLabel = "";
  let savingsValue = "";
  if (savingsEl) {
    const spans = savingsEl.querySelectorAll("span");
    if (spans.length >= 2) {
      savingsLabel = cleanEscPosText(spans[0].textContent || "You Saved on MRP:");
      savingsValue = cleanEscPosText(spans[1].textContent || "");
    }
  }

  const mathLines: { key: string; val: string }[] = [];
  const mathRows = element.querySelectorAll("[data-receipt-math-row='true']");
  mathRows.forEach((row) => {
    const spans = row.querySelectorAll("span");
    if (spans.length >= 2) {
      mathLines.push({
        key: cleanEscPosText(spans[0].textContent || ""),
        val: cleanEscPosText(spans[spans.length - 1].textContent || "")
      });
    }
  });

  const footerEl = element.querySelector("[data-receipt-footer='true']");
  const footerMsg = cleanEscPosText(footerEl?.textContent || "Thank you for shopping!");

  return {
    storeTitle,
    receiptHeader,
    branchText,
    addressText,
    contactText,
    metaLines,
    items,
    savingsLabel,
    savingsValue,
    mathLines,
    footerMsg
  };
}

function wrapText(text: string, width: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if (w.length > width) {
      if (current) {
        lines.push(current);
        current = "";
      }
      for (let i = 0; i < w.length; i += width) {
        lines.push(w.slice(i, i + width));
      }
      continue;
    }
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length <= width) {
      current = candidate;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function twoColLine(left: string, right: string, width: number): string {
  const r = right.slice(0, width);
  const maxLeft = Math.max(1, width - r.length - 1);
  const l = left.length > maxLeft ? left.slice(0, maxLeft) : left;
  const spaces = Math.max(1, width - l.length - r.length);
  return `${l}${" ".repeat(spaces)}${r}`;
}

function padLeft(val: string, width: number): string {
  if (val.length >= width) return val.slice(0, width);
  return " ".repeat(width - val.length) + val;
}

function padRight(val: string, width: number): string {
  if (val.length >= width) return val.slice(0, width);
  return val + " ".repeat(width - val.length);
}

function centerPad(val: string, width: number): string {
  if (val.length >= width) return val.slice(0, width);
  const totalPad = width - val.length;
  const leftPad = Math.floor(totalPad / 2);
  return " ".repeat(leftPad) + val + " ".repeat(totalPad - leftPad);
}

/**
 * Generates universal ESC/POS binary bytes compatible with Epson, Star, Xprinter,
 * TVS, Rongta, Citizen, Bixolon, Sunmi, Munbyn, Brother, and generic thermal printers.
 */
export function buildEscPosPayload(
  element: HTMLElement,
  config: ThermalPrinterConfig
): Uint8Array {
  const spec = THERMAL_LAYOUT_SPECS[config.layoutProfile] || THERMAL_LAYOUT_SPECS["thermal-80mm"];
  const cols = spec.escposCols;
  const data = extractReceiptDataFromElement(element);

  const bytes: number[] = [];
  const pushStr = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      bytes.push(code >= 0x20 && code <= 0x7e ? code : 0x20);
    }
  };
  const pushLine = (s = "") => {
    pushStr(s);
    bytes.push(0x0a);
  };
  const setAlign = (align: 0 | 1 | 2) => bytes.push(0x1b, 0x61, align);
  const setBold = (on: boolean) => bytes.push(0x1b, 0x45, on ? 1 : 0);
  const setSize = (double: boolean) => bytes.push(0x1d, 0x21, double ? 0x11 : 0x00);

  // ESC @ - Initialize printer
  bytes.push(0x1b, 0x40);

  // Optional RJ11 cash drawer kick
  if (config.openCashDrawer) {
    bytes.push(0x1b, 0x70, 0x00, 0x19, 0xfa);
  }

  // Header block (Centered)
  setAlign(1);
  setBold(true);
  setSize(cols >= 40);
  wrapText(data.storeTitle, cols >= 40 ? Math.floor(cols / 2) : cols).forEach((ln) => pushLine(ln));
  setSize(false);

  if (data.receiptHeader) {
    wrapText(data.receiptHeader.toUpperCase(), cols).forEach((ln) => pushLine(ln));
  }
  setBold(false);
  if (data.branchText) {
    wrapText(data.branchText, cols).forEach((ln) => pushLine(ln));
  }
  if (data.addressText) {
    wrapText(data.addressText, cols).forEach((ln) => pushLine(ln));
  }
  if (data.contactText) {
    wrapText(data.contactText, cols).forEach((ln) => pushLine(ln));
  }

  setAlign(0);
  pushLine("-".repeat(cols));

  // Metadata lines
  data.metaLines.forEach((m) => {
    pushLine(twoColLine(m.key, m.val, cols));
  });

  pushLine("=".repeat(cols));

  if (cols <= 32) {
    // 58mm (32 cols): 2-line per item so MRP/Rate/Qty/Total never collide
    setBold(true);
    pushLine("Item / MRP   Rate  Qty     Total");
    setBold(false);
    pushLine("-".repeat(cols));
    data.items.forEach((it) => {
      wrapText(it.name, cols).forEach((ln) => pushLine(ln));
      const rowStr =
        padRight(it.mrp, 8) +
        padRight(it.rate, 8) +
        centerPad(`x${it.qty}`, 5) +
        padLeft(it.total, 11);
      pushLine(rowStr);
    });
  } else {
    // 76mm (40 cols), 80mm (48 cols), 112mm (64 cols)
    const mrpW = cols >= 64 ? 10 : cols >= 48 ? 8 : 7;
    const rateW = cols >= 64 ? 10 : cols >= 48 ? 8 : 7;
    const qtyW = cols >= 64 ? 6 : cols >= 48 ? 5 : 4;
    const totalW = cols >= 64 ? 12 : cols >= 48 ? 11 : 10;
    const descW = Math.max(10, cols - mrpW - rateW - qtyW - totalW);

    setBold(true);
    pushLine(
      padRight("Item", descW) +
        padLeft("MRP", mrpW) +
        padLeft("Rate", rateW) +
        centerPad("Qty", qtyW) +
        padLeft("Total", totalW)
    );
    setBold(false);
    pushLine("-".repeat(cols));

    data.items.forEach((it) => {
      const nameLines = wrapText(it.name, Math.max(8, descW - 1));
      const firstDesc = padRight(nameLines[0] || "", descW);
      pushLine(
        firstDesc +
          padLeft(it.mrp, mrpW) +
          padLeft(it.rate, rateW) +
          centerPad(it.qty, qtyW) +
          padLeft(it.total, totalW)
      );
      for (let i = 1; i < nameLines.length; i++) {
        pushLine(nameLines[i]);
      }
    });
  }

  pushLine("-".repeat(cols));

  if (data.savingsLabel && data.savingsValue) {
    setBold(true);
    pushLine(twoColLine(data.savingsLabel, data.savingsValue, cols));
    setBold(false);
    pushLine("-".repeat(cols));
  }

  data.mathLines.forEach((m) => {
    const isTotal =
      m.key.toUpperCase().includes("TOTAL PAYABLE") ||
      m.key.toUpperCase().includes("NET PAYABLE");
    if (isTotal) {
      pushLine("=".repeat(cols));
      setBold(true);
      pushLine(twoColLine(m.key, m.val, cols));
      setBold(false);
      pushLine("=".repeat(cols));
    } else {
      pushLine(twoColLine(m.key, m.val, cols));
    }
  });

  if (data.footerMsg) {
    pushLine();
    setAlign(1);
    wrapText(data.footerMsg, cols).forEach((ln) => pushLine(ln));
    setAlign(0);
  }

  // Feed 4 lines before cut
  bytes.push(0x1b, 0x64, 0x04);

  // GS V 66 3 - Partial cut with feed (universal ESC/POS)
  if (config.autoCut) {
    bytes.push(0x1d, 0x56, 0x42, 0x03);
  }

  return new Uint8Array(bytes);
}

// Keep active WebUSB / WebSerial connections cached across checkouts
let cachedUsbDevice: any = null;
let cachedSerialPort: any = null;

export function isFeatureAllowedByPolicy(feature: "usb" | "serial"): boolean {
  try {
    const doc = document as any;
    const policy = doc?.permissionsPolicy || doc?.featurePolicy;
    if (policy && typeof policy.allowsFeature === "function") {
      return Boolean(policy.allowsFeature(feature));
    }
  } catch {
    // Ignore featurePolicy errors
  }
  return true;
}

const PRINT_SNAPSHOT_KEY = "expertpos_print_snapshot_v1";

export interface PrintSnapshotPayload {
  jobId?: string;
  html: string;
  layoutProfile: PrinterLayoutProfile;
  connectionMode?: ThermalConnectionMode;
  invoiceId?: string;
  createdAt: number;
}

export function savePrintSnapshot(payload: PrintSnapshotPayload): void {
  try {
    localStorage.setItem(PRINT_SNAPSHOT_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadPrintSnapshot(): PrintSnapshotPayload | null {
  try {
    const raw = localStorage.getItem(PRINT_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.html) return null;
    return parsed as PrintSnapshotPayload;
  } catch {
    return null;
  }
}

function utf8ToBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToUtf8(b64Url: string): string {
  const padded = b64Url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64Url.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeSnapshotToHash(payload: PrintSnapshotPayload): string {
  try {
    let htmlForHash = payload.html;
    // Strip huge inline base64 images only if HTML exceeds URL-safe inline size; server spool keeps full logo
    if (htmlForHash.length > 24000) {
      htmlForHash = htmlForHash.replace(/<img[^>]+src=["']data:image\/[^"']+["'][^>]*>/gi, "");
    }
    const compact: PrintSnapshotPayload = {
      jobId: payload.jobId,
      html: htmlForHash,
      layoutProfile: payload.layoutProfile,
      connectionMode: payload.connectionMode,
      invoiceId: payload.invoiceId,
      createdAt: payload.createdAt
    };
    const encoded = utf8ToBase64Url(JSON.stringify(compact));
    if (encoded.length > 48000) return "";
    return encoded;
  } catch {
    return "";
  }
}

export function decodeSnapshotFromHash(hashStr: string): PrintSnapshotPayload | null {
  try {
    const clean = hashStr.replace(/^#/, "");
    const match = clean.match(/(?:^|&)r=([^&]+)/);
    if (!match?.[1]) return null;
    const jsonStr = base64UrlToUtf8(decodeURIComponent(match[1]));
    const parsed = JSON.parse(jsonStr);
    if (!parsed?.html) return null;
    return parsed as PrintSnapshotPayload;
  } catch {
    return null;
  }
}

export function sendPrintSnapshotToServer(jobId: string, payload: PrintSnapshotPayload): void {
  try {
    const body = JSON.stringify({ ...payload, jobId });
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function" && body.length < 60000) {
      const ok = navigator.sendBeacon("/api/print/snapshot", new Blob([body], { type: "text/plain" }));
      if (ok) return;
    }
    void fetch("/api/print/snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {});
  } catch {
    // Ignore relay failures; hash and localStorage fallbacks remain active
  }
}

export async function fetchPrintSnapshotFromServer(jobId: string): Promise<PrintSnapshotPayload | null> {
  const id = (jobId || "latest").trim() || "latest";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`/api/print/snapshot/${encodeURIComponent(id)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.snapshot?.html) {
          return data.snapshot as PrintSnapshotPayload;
        }
      }
    } catch {
      // Retry shortly
    }
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 180));
    }
  }
  return null;
}

export function buildStandalonePrintUrl(jobId: string, payload: PrintSnapshotPayload | null): string {
  const base = `/?printReceipt=1&job=${encodeURIComponent(jobId || "latest")}`;
  if (!payload) return base;
  const hashData = encodeSnapshotToHash(payload);
  return hashData ? `${base}#r=${hashData}` : base;
}

export async function hasPairedUsbPrinter(): Promise<boolean> {
  try {
    const nav = navigator as any;
    if (!nav?.usb || !isFeatureAllowedByPolicy("usb")) return false;
    if (cachedUsbDevice) return true;
    const devices = await nav.usb.getDevices();
    return Array.isArray(devices) && devices.length > 0;
  } catch {
    return false;
  }
}

export async function hasPairedSerialPrinter(): Promise<boolean> {
  try {
    const nav = navigator as any;
    if (!nav?.serial || !isFeatureAllowedByPolicy("serial")) return false;
    if (cachedSerialPort) return true;
    const ports = await nav.serial.getPorts();
    return Array.isArray(ports) && ports.length > 0;
  } catch {
    return false;
  }
}

export async function printViaWebUSB(
  payload: Uint8Array,
  forcePrompt = false
): Promise<{ ok: boolean; deviceLabel?: string; error?: string; fallbackToSystemPrint?: boolean }> {
  const nav = navigator as any;
  if (!nav?.usb) {
    return {
      ok: false,
      fallbackToSystemPrint: true,
      error: "WebUSB is unavailable in this browser — using OS Printer Dialog instead."
    };
  }

  if (!isFeatureAllowedByPolicy("usb")) {
    return {
      ok: false,
      fallbackToSystemPrint: true,
      error: "Embedded frame restricts direct USB access — using OS Printer Dialog instead."
    };
  }

  try {
    let device = forcePrompt ? null : cachedUsbDevice;

    if (!device) {
      const existing = await nav.usb.getDevices();
      if (!forcePrompt && Array.isArray(existing) && existing.length > 0) {
        device = existing[0];
      } else {
        device = await nav.usb.requestDevice({
          filters: [
            { classCode: 7 }, // Standard USB Printer Class
            { vendorId: 0x04b8 }, // Epson
            { vendorId: 0x0519 }, // Star Micronics
            { vendorId: 0x0483 }, // STMicro / Xprinter / Rongta
            { vendorId: 0x0fe6 }, // ICS / Generic POS Thermal
            { vendorId: 0x1504 }, // Bixolon
            { vendorId: 0x1fc9 }, // NXP POS Thermal
            { vendorId: 0x20d1 }, // Citizen
            { vendorId: 0x28e9 }, // GD32 / Munbyn / Xprinter
            { vendorId: 0x0416 }, // Winbond / POS80
            { vendorId: 0x1a86 } // WCH CH340 USB-POS
          ]
        });
      }
    }

    if (!device) {
      return { ok: false, error: "No USB printer selected." };
    }

    cachedUsbDevice = device;
    if (!device.opened) {
      await device.open();
    }
    if (device.configuration === null && device.configurations?.length > 0) {
      await device.selectConfiguration(device.configurations[0].configurationValue);
    }

    const interfaces = device.configuration?.interfaces || [];
    let targetInterfaceNumber: number | null = null;
    let targetAlternateSetting: number | null = null;
    let outEndpointNumber: number | null = null;

    // Prefer Bulk OUT endpoints first (standard ESC/POS thermal data channel)
    for (const iface of interfaces) {
      for (const alt of iface.alternates || []) {
        const bulkOut = (alt.endpoints || []).find(
          (ep: any) => ep.direction === "out" && ep.type === "bulk"
        );
        if (bulkOut) {
          targetInterfaceNumber = iface.interfaceNumber;
          targetAlternateSetting = alt.alternateSetting ?? null;
          outEndpointNumber = bulkOut.endpointNumber;
          break;
        }
      }
      if (targetInterfaceNumber !== null) break;
    }

    if (targetInterfaceNumber === null) {
      for (const iface of interfaces) {
        for (const alt of iface.alternates || []) {
          const outEp = (alt.endpoints || []).find((ep: any) => ep.direction === "out");
          if (outEp) {
            targetInterfaceNumber = iface.interfaceNumber;
            targetAlternateSetting = alt.alternateSetting ?? null;
            outEndpointNumber = outEp.endpointNumber;
            break;
          }
        }
        if (targetInterfaceNumber !== null) break;
      }
    }

    if (targetInterfaceNumber === null || outEndpointNumber === null) {
      return {
        ok: false,
        fallbackToSystemPrint: true,
        error: "USB printer uses standard OS spooler — printing via OS Printer Dialog."
      };
    }

    await device.claimInterface(targetInterfaceNumber);
    if (targetAlternateSetting !== null && targetAlternateSetting !== 0) {
      try {
        await device.selectAlternateInterface(targetInterfaceNumber, targetAlternateSetting);
      } catch {
        // Ignore if device already uses default alternate setting
      }
    }

    // Send in 4KB chunks for universal USB thermal controller compatibility
    const CHUNK = 4096;
    for (let offset = 0; offset < payload.length; offset += CHUNK) {
      await device.transferOut(outEndpointNumber, payload.slice(offset, offset + CHUNK));
    }
    try {
      await device.releaseInterface(targetInterfaceNumber);
    } catch {
      // Ignore release errors
    }

    const label = [device.manufacturerName, device.productName].filter(Boolean).join(" ") || "USB Thermal Printer";
    return { ok: true, deviceLabel: label };
  } catch (err: any) {
    cachedUsbDevice = null;
    const msg = String(err?.message || "");
    const lower = msg.toLowerCase();
    const policyOrDriverLock =
      lower.includes("permissions policy") ||
      lower.includes("access denied") ||
      lower.includes("unable to claim") ||
      err?.name === "SecurityError" ||
      err?.name === "NetworkError";
    return {
      ok: false,
      fallbackToSystemPrint: policyOrDriverLock,
      error: policyOrDriverLock
        ? "USB port is managed by your OS driver — routing to OS Printer Dialog."
        : err?.name === "NotFoundError"
        ? "No USB printer selected. Choose your printer and click Connect, or switch to OS / USB Driver mode."
        : msg || "USB printer selection cancelled."
    };
  }
}

export async function printViaWebSerial(
  payload: Uint8Array,
  baudRate: 9600 | 19200 | 38400 | 115200 = 9600,
  forcePrompt = false
): Promise<{ ok: boolean; deviceLabel?: string; error?: string; fallbackToSystemPrint?: boolean }> {
  const nav = navigator as any;
  if (!nav?.serial) {
    return {
      ok: false,
      fallbackToSystemPrint: true,
      error: "WebSerial is unavailable in this browser — using OS Printer Dialog instead."
    };
  }

  if (!isFeatureAllowedByPolicy("serial")) {
    return {
      ok: false,
      fallbackToSystemPrint: true,
      error: "Embedded frame restricts direct Serial access — using OS Printer Dialog instead."
    };
  }

  try {
    let port = forcePrompt ? null : cachedSerialPort;
    if (!port) {
      const ports = await nav.serial.getPorts();
      if (!forcePrompt && Array.isArray(ports) && ports.length > 0) {
        port = ports[0];
      } else {
        port = await nav.serial.requestPort();
      }
    }

    if (!port) {
      return { ok: false, error: "No Serial / Bluetooth COM printer selected." };
    }

    cachedSerialPort = port;
    const isAlreadyOpen = Boolean(port.writable);
    if (!isAlreadyOpen) {
      await port.open({ baudRate });
    }

    const writer = port.writable.getWriter();
    try {
      await writer.write(payload);
    } finally {
      writer.releaseLock();
    }

    const info = port.getInfo?.() || {};
    const label = info.usbVendorId
      ? `COM Thermal (VID:${info.usbVendorId.toString(16).toUpperCase()})`
      : `Serial/BT Thermal (${baudRate} baud)`;
    return { ok: true, deviceLabel: label };
  } catch (err: any) {
    cachedSerialPort = null;
    const msg = String(err?.message || "");
    const policyOrLock =
      msg.toLowerCase().includes("permissions policy") ||
      err?.name === "SecurityError";
    return {
      ok: false,
      fallbackToSystemPrint: policyOrLock,
      error: policyOrLock
        ? "Serial access restricted in this frame — routing to OS Printer Dialog."
        : msg || "Serial / Bluetooth COM printer connection failed."
    };
  }
}

export async function printViaNetworkSocket(
  payload: Uint8Array,
  ip: string,
  port = 9100
): Promise<{ ok: boolean; error?: string }> {
  try {
    // Convert Uint8Array to base64 safely
    let binary = "";
    for (let i = 0; i < payload.length; i++) {
      binary += String.fromCharCode(payload[i]);
    }
    const base64Data = btoa(binary);

    const res = await fetch("/api/print/escpos-network", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip: ip.trim(), port: Number(port) || 9100, base64Data })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { ok: false, error: json.error || "Network thermal printer unreachable." };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Failed to contact LAN thermal print endpoint." };
  }
}

export function downloadRawEscPosFile(payload: Uint8Array, filename = "receipt-escpos.bin"): boolean {
  try {
    const copy = new Uint8Array(payload.byteLength);
    copy.set(payload);
    const blob = new Blob([copy.buffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
    return true;
  } catch {
    return false;
  }
}
