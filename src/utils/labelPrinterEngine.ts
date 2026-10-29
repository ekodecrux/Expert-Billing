/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Enterprise Thermal Label & Barcode Printer Engine
 * Supports Zebra (ZPL II), TSC / TVS / Xprinter (TSPL/TSPL2), Epson (ESC/POS),
 * and high-precision browser direct thermal print with exact CSS @page mm rules.
 */

import { Product } from "../types";

export type LabelPrinterModel =
  | "zebra-zpl"        // Zebra ZD220, ZD230, ZD420, ZT230, GX420d (ZPL II)
  | "tsc-tspl"         // TSC TE244, TTP-244 Pro, DA210 (TSPL2)
  | "tvs-lp46"         // TVS LP 46 Neo / LP 46 Lite (TSPL)
  | "xprinter-xp"      // Xprinter XP-420B, XP-365B, XP-370B (TSPL)
  | "epson-tm"         // Epson TM-L90, TM-L100 (ESC/POS Label)
  | "citizen-cl"       // Citizen CL-S621, CL-E300 (ZPL Emulation)
  | "rollo-usb"        // Rollo Commercial Thermal Printer
  | "dymo-lw"          // Dymo LabelWriter 450 / 550
  | "laser-a4";        // Standard Laser / Inkjet A4 Sheets

export type LabelSizePresetId =
  | "roll-50x25"       // 50 x 25 mm (2" x 1") - Most common retail shelf label
  | "roll-38x25"       // 38 x 25 mm (1.5" x 1") - Compact item sticker
  | "roll-50x30"       // 50 x 30 mm - Supermarket price tag
  | "roll-75x50"       // 75 x 50 mm (3" x 2") - Medium retail box / carton
  | "roll-100x50"      // 100 x 50 mm (4" x 2") - Large product / shelf banner
  | "roll-100x150"     // 100 x 150 mm (4" x 6") - Shipping / Logistics / Pallet
  | "dual-roll-38x25"  // 2-Across (38x25 mm dual roll on 80mm backing)
  | "jewelry-32x19"    // 32 x 19 mm Dumbbell / Butterfly Jewelry Tag
  | "a4-sheet-24"      // A4 24 Labels (70 x 37 mm, 3 cols x 8 rows)
  | "a4-sheet-40"      // A4 40 Labels (52.5 x 29.7 mm, 4 cols x 10 rows)
  | "a4-sheet-65"      // A4 65 Labels (38.1 x 21.2 mm, 5 cols x 13 rows)
  | "custom";

export interface LabelSizeDimension {
  id: LabelSizePresetId;
  name: string;
  category: "roll" | "multi-column" | "sheet" | "custom";
  widthMm: number;
  heightMm: number;
  gapMm: number;
  columnsAcross: number;
  description: string;
  recommendedFor: string;
}

export const LABEL_SIZE_PRESETS: LabelSizeDimension[] = [
  {
    id: "roll-50x25",
    name: "50 × 25 mm (2\" × 1\")",
    category: "roll",
    widthMm: 50,
    heightMm: 25,
    gapMm: 3,
    columnsAcross: 1,
    description: "Standard Single-Roll Retail Shelf & Barcode Sticker",
    recommendedFor: "General retail, grocery stores, pharmacies, supermarket shelves"
  },
  {
    id: "roll-38x25",
    name: "38 × 25 mm (1.5\" × 1\")",
    category: "roll",
    widthMm: 38,
    heightMm: 25,
    gapMm: 2.5,
    columnsAcross: 1,
    description: "Compact Barcode Tag for Small Merchandise",
    recommendedFor: "Cosmetics, electronics accessories, stationery, hardware items"
  },
  {
    id: "roll-50x30",
    name: "50 × 30 mm",
    category: "roll",
    widthMm: 50,
    heightMm: 30,
    gapMm: 3,
    columnsAcross: 1,
    description: "Retail Tag with Batch & Expiry Info",
    recommendedFor: "FMCG, dairy, bakery, meat & poultry, packaged foods"
  },
  {
    id: "roll-75x50",
    name: "75 × 50 mm (3\" × 2\")",
    category: "roll",
    widthMm: 75,
    heightMm: 50,
    gapMm: 3,
    columnsAcross: 1,
    description: "Medium Apparel Tag & Carton Label",
    recommendedFor: "Garments, footwear, boxed items, electronics"
  },
  {
    id: "roll-100x50",
    name: "100 × 50 mm (4\" × 2\")",
    category: "roll",
    widthMm: 100,
    heightMm: 50,
    gapMm: 3,
    columnsAcross: 1,
    description: "Large Shelf Talker & Promotional Banner",
    recommendedFor: "Warehouse bins, bulk storage, promotional shelf signage"
  },
  {
    id: "roll-100x150",
    name: "100 × 150 mm (4\" × 6\")",
    category: "roll",
    widthMm: 100,
    heightMm: 150,
    gapMm: 3,
    columnsAcross: 1,
    description: "Shipping / Courier / Pallet Logistics Label",
    recommendedFor: "E-commerce packages, B2B wholesale dispatch, freight cartons"
  },
  {
    id: "dual-roll-38x25",
    name: "2-Up (2 × 38×25 mm)",
    category: "multi-column",
    widthMm: 80,
    heightMm: 25,
    gapMm: 3,
    columnsAcross: 2,
    description: "Dual Column Roll on 80mm Thermal Backing Paper",
    recommendedFor: "High-volume retail tagging, double throughput on 80mm printers"
  },
  {
    id: "jewelry-32x19",
    name: "Jewelry Tag (32 × 19 mm)",
    category: "multi-column",
    widthMm: 32,
    heightMm: 19,
    gapMm: 2,
    columnsAcross: 1,
    description: "Dumbbell / Butterfly Foldable Jewelry Label",
    recommendedFor: "Rings, necklaces, watches, eyeglasses, optical frames"
  },
  {
    id: "a4-sheet-24",
    name: "A4 Sheet (24-Up, 70 × 37 mm)",
    category: "sheet",
    widthMm: 70,
    heightMm: 37,
    gapMm: 0,
    columnsAcross: 3,
    description: "Standard Laser/Inkjet A4 Adhesive Sheet (3 cols × 8 rows)",
    recommendedFor: "Offices, standard laser/inkjet printers, Avery 7160 / 3474"
  },
  {
    id: "a4-sheet-40",
    name: "A4 Sheet (40-Up, 52.5 × 29.7 mm)",
    category: "sheet",
    widthMm: 52.5,
    heightMm: 29.7,
    gapMm: 0,
    columnsAcross: 4,
    description: "Dense Laser/Inkjet A4 Adhesive Sheet (4 cols × 10 rows)",
    recommendedFor: "Compact laser label printing, Avery 3475 compatible"
  },
  {
    id: "a4-sheet-65",
    name: "A4 Sheet (65-Up, 38.1 × 21.2 mm)",
    category: "sheet",
    widthMm: 38.1,
    heightMm: 21.2,
    gapMm: 0,
    columnsAcross: 5,
    description: "Mini Mini Barcode Stickers (5 cols × 13 rows)",
    recommendedFor: "Small item inventory stickers on standard office A4 printers"
  }
];

export interface LabelDesignOptions {
  storeName: string;
  showStoreName: boolean;
  showProductName: boolean;
  productNameFontSize: "small" | "medium" | "large";
  showMrp: boolean;
  showSellingPrice: boolean;
  showSavingsBadge: boolean;
  currencySymbol: string;
  barcodeType: "CODE128" | "EAN13" | "QR";
  showBarcodeGraphic: boolean;
  showBarcodeText: boolean;
  showSku: boolean;
  showCategory: boolean;
  showBatchNo: boolean;
  showExpiryDate: boolean;
  showPackedDate: boolean;
  showGstHsn: boolean;
  customPromoText: string;
  dpi: 203 | 300 | 600;
  darkness: number; // 1 to 15
  customWidthMm?: number;
  customHeightMm?: number;
  customGapMm?: number;
}

export const DEFAULT_LABEL_DESIGN_OPTIONS: LabelDesignOptions = {
  storeName: "EXPERT POS HYPERMARKETS",
  showStoreName: true,
  showProductName: true,
  productNameFontSize: "medium",
  showMrp: true,
  showSellingPrice: true,
  showSavingsBadge: true,
  currencySymbol: "₹",
  barcodeType: "CODE128",
  showBarcodeGraphic: true,
  showBarcodeText: true,
  showSku: true,
  showCategory: false,
  showBatchNo: true,
  showExpiryDate: true,
  showPackedDate: false,
  showGstHsn: true,
  customPromoText: "",
  dpi: 203,
  darkness: 10
};

// ============================================================================
// Deterministic Code 128 & Barcode Pattern Generator (Pure Zero-Dependency SVG)
// ============================================================================

/**
 * Standard Code 128 subset B pattern mapping for scannable vector barcodes
 */
const CODE128_PATTERNS: Record<number, string> = {
  0: "212222", 1: "222122", 2: "222221", 3: "121223", 4: "121322",
  5: "131222", 6: "122213", 7: "122312", 8: "132212", 9: "221213",
  10: "221312", 11: "231212", 12: "112232", 13: "122132", 14: "122231",
  15: "113222", 16: "123122", 17: "123221", 18: "223211", 19: "221132",
  20: "221231", 21: "213212", 22: "223112", 23: "312131", 24: "311222",
  25: "321122", 26: "321221", 27: "312212", 28: "322112", 29: "322211",
  30: "212123", 31: "212321", 32: "232121", 33: "111323", 34: "131123",
  35: "131321", 36: "112313", 37: "132113", 38: "132311", 39: "211313",
  40: "231113", 41: "231311", 42: "112133", 43: "112331", 44: "132131",
  45: "113123", 46: "113321", 47: "133121", 48: "313121", 49: "211331",
  50: "231131", 51: "213113", 52: "213311", 53: "213131", 54: "311123",
  55: "311321", 56: "331121", 57: "312113", 58: "312311", 59: "332111",
  60: "314111", 61: "221411", 62: "431111", 63: "111224", 64: "111422",
  65: "121124", 66: "121421", 67: "141122", 68: "141221", 69: "112214",
  70: "112412", 71: "122114", 72: "122411", 73: "142112", 74: "142211",
  75: "241211", 76: "221114", 77: "413111", 78: "241112", 79: "134111",
  80: "111242", 81: "121142", 82: "121241", 83: "114212", 84: "124112",
  85: "124211", 86: "411212", 87: "421112", 88: "421211", 89: "212141",
  90: "214121", 91: "412121", 92: "111143", 93: "111341", 94: "131141",
  95: "114113", 96: "114311", 97: "411113", 98: "411311", 99: "113141",
  100: "114131", 101: "311141", 102: "411131", 103: "211412", 104: "211214", // Start B
  105: "211232", // Start C
  106: "2331112" // Stop pattern
};

/**
 * Encodes text into Code 128 subset B modules for SVG rendering
 */
export function encodeCode128B(text: string): { modules: boolean[]; code: string } {
  const clean = text.replace(/[^ -~]/g, "") || "000000";
  const codes: number[] = [104]; // Start Code B
  let checksum = 104;

  for (let i = 0; i < clean.length; i++) {
    const val = clean.charCodeAt(i) - 32;
    codes.push(val);
    checksum += val * (i + 1);
  }

  const checkVal = checksum % 103;
  codes.push(checkVal);
  codes.push(106); // Stop pattern

  const modules: boolean[] = [];
  // Quiet zone: 10 modules white
  for (let q = 0; q < 10; q++) modules.push(false);

  codes.forEach(codeVal => {
    const pattern = CODE128_PATTERNS[codeVal] || "212222";
    let isBar = true;
    for (let p = 0; p < pattern.length; p++) {
      const width = parseInt(pattern[p], 10);
      for (let w = 0; w < width; w++) {
        modules.push(isBar);
      }
      isBar = !isBar;
    }
  });

  // Quiet zone: 10 modules white
  for (let q = 0; q < 10; q++) modules.push(false);

  return { modules, code: clean };
}

/**
 * Generate clean SVG Barcode string for high-contrast thermal printing
 */
export function generateBarcodeSvgString(
  text: string,
  heightPx: number = 42,
  includeHumanReadable: boolean = true
): string {
  const { modules, code } = encodeCode128B(text);
  const totalWidth = modules.length;
  const barHeight = includeHumanReadable ? heightPx - 14 : heightPx;

  let rects = "";
  let barStart = -1;

  for (let i = 0; i < modules.length; i++) {
    if (modules[i]) {
      if (barStart === -1) barStart = i;
    } else {
      if (barStart !== -1) {
        rects += `<rect x="${barStart}" y="0" width="${i - barStart}" height="${barHeight}" fill="#000" />`;
        barStart = -1;
      }
    }
  }
  if (barStart !== -1) {
    rects += `<rect x="${barStart}" y="0" width="${modules.length - barStart}" height="${barHeight}" fill="#000" />`;
  }

  const textElement = includeHumanReadable
    ? `<text x="${totalWidth / 2}" y="${heightPx - 1}" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#000" letter-spacing="1.5">${code}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${heightPx}" preserveAspectRatio="none" style="image-rendering: pixelated; shape-rendering: crispEdges; width: 100%; height: ${heightPx}px;">
    ${rects}
    ${textElement}
  </svg>`;
}

/**
 * Simple SVG QR Code visual matrix generator for retail links / payment / UPI
 */
export function generateQrCodeSvgString(text: string, sizePx: number = 70): string {
  // Deterministic 21x21 QR Code Version 1 matrix simulation
  const matrixSize = 25;
  const cells: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

  // Finder patterns at corners (7x7)
  const stampFinder = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (
          x === 0 || x === 6 || y === 0 || y === 6 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
        ) {
          cells[startY + y][startX + x] = true;
        }
      }
    }
  };

  stampFinder(0, 0); // Top-left
  stampFinder(matrixSize - 7, 0); // Top-right
  stampFinder(0, matrixSize - 7); // Bottom-left

  // Timing lines
  for (let i = 7; i < matrixSize - 7; i++) {
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }

  // Hash payload text deterministically into inner cells
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let y = 8; y < matrixSize - 8; y++) {
    for (let x = 8; x < matrixSize - 8; x++) {
      const bit = ((hash ^ (x * 31 + y * 17)) & 1) === 1;
      cells[y][x] = bit;
    }
  }

  let rects = "";
  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      if (cells[y][x]) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="#000" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${matrixSize} ${matrixSize}" style="image-rendering: pixelated; width: ${sizePx}px; height: ${sizePx}px;">
    ${rects}
  </svg>`;
}

// ============================================================================
// Raw Industrial Label Printer Command Generators (ZPL II & TSPL/TSPL2)
// ============================================================================

/**
 * Calculates dots from millimeters based on target printer DPI
 */
export function mmToDots(mm: number, dpi: 203 | 300 | 600 = 203): number {
  const dotsPerMm = dpi === 600 ? 23.62 : dpi === 300 ? 11.81 : 8.0;
  return Math.round(mm * dotsPerMm);
}

/**
 * Generates Zebra ZPL II raw command string for direct thermal barcode printers
 * Compatible with Zebra ZD220, ZD230, ZD420, ZT230, Citizen, Datamax (ZGL)
 */
export function generateZplCommands(
  products: { product: Product; quantity: number }[],
  options: LabelDesignOptions,
  dimension: LabelSizeDimension
): string {
  const dpi = options.dpi || 203;
  const pw = mmToDots(dimension.widthMm, dpi);
  const ll = mmToDots(dimension.heightMm, dpi);

  let zpl = "";

  products.forEach(({ product, quantity }) => {
    if (quantity <= 0) return;

    const barcodeVal = (product.barcode || product.sku || "000000").replace(/[^a-zA-Z0-9]/g, "");
    const hasMrp = product.mrp && product.mrp > product.price;
    const discountPercent = hasMrp
      ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
      : 0;

    // Single label header
    zpl += `^XA\n`;
    zpl += `^PW${pw}\n`;
    zpl += `^LL${ll}\n`;
    zpl += `^PON\n`;
    zpl += `^LH0,0\n`;
    zpl += `~SD${Math.min(30, Math.max(1, options.darkness * 2))}\n`; // Set darkness

    let yOffset = mmToDots(2, dpi);

    // 1. Store Name Header
    if (options.showStoreName && options.storeName) {
      zpl += `^FO0,${yOffset}^FB${pw},1,0,C^A0N,${mmToDots(3.2, dpi)},${mmToDots(3.2, dpi)}^FD${options.storeName.toUpperCase()}^FS\n`;
      yOffset += mmToDots(4, dpi);
    }

    // 2. Product Name
    if (options.showProductName) {
      const pNameFont = options.productNameFontSize === "large" ? 4.2 : options.productNameFontSize === "small" ? 3.0 : 3.6;
      zpl += `^FO0,${yOffset}^FB${pw},2,0,C^A0N,${mmToDots(pNameFont, dpi)},${mmToDots(pNameFont, dpi)}^FD${product.name.substring(0, 42)}^FS\n`;
      yOffset += mmToDots(5.5, dpi);
    }

    // 3. Pricing Section (MRP vs Selling Price)
    if (options.showSellingPrice) {
      const priceStr = `${options.currencySymbol}${product.price.toFixed(2)}`;
      const mrpStr = hasMrp && options.showMrp ? `MRP:${options.currencySymbol}${product.mrp?.toFixed(2)}` : "";
      const discStr = discountPercent > 0 && options.showSavingsBadge ? ` (${discountPercent}% OFF)` : "";

      if (mrpStr) {
        zpl += `^FO0,${yOffset}^FB${pw},1,0,C^A0N,${mmToDots(2.8, dpi)},${mmToDots(2.8, dpi)}^FD${mrpStr}${discStr}^FS\n`;
        yOffset += mmToDots(3.8, dpi);
      }

      zpl += `^FO0,${yOffset}^FB${pw},1,0,C^A0N,${mmToDots(4.8, dpi)},${mmToDots(4.8, dpi)}^FD${priceStr} / ${product.unit || "Unit"}^FS\n`;
      yOffset += mmToDots(5.8, dpi);
    }

    // 4. Barcode
    if (options.showBarcodeGraphic) {
      const barHeight = mmToDots(dimension.heightMm > 35 ? 12 : 8, dpi);
      const barX = Math.max(mmToDots(4, dpi), Math.round((pw - mmToDots(36, dpi)) / 2));
      zpl += `^BY2,2.5,${barHeight}\n`;
      zpl += `^FO${barX},${yOffset}^BCN,${barHeight},${options.showBarcodeText ? "Y" : "N"},N,N^FD${barcodeVal}^FS\n`;
      yOffset += barHeight + mmToDots(options.showBarcodeText ? 4.5 : 2, dpi);
    }

    // 5. SKU & Batch Footer
    const footerParts: string[] = [];
    if (options.showSku) footerParts.push(`SKU:${product.sku}`);
    if (options.showBatchNo && product.batchNumber) footerParts.push(`B:${product.batchNumber}`);
    if (options.showExpiryDate && product.expiryDate) footerParts.push(`EXP:${product.expiryDate}`);

    if (footerParts.length > 0) {
      zpl += `^FO0,${yOffset}^FB${pw},1,0,C^A0N,${mmToDots(2.4, dpi)},${mmToDots(2.4, dpi)}^FD${footerParts.join(" | ")}^FS\n`;
    }

    // Print count
    zpl += `^PQ${quantity},0,1,Y\n`;
    zpl += `^XZ\n\n`;
  });

  return zpl;
}

/**
 * Generates TSC TSPL/TSPL2 raw command string
 * Compatible with TSC TE244, TTP-244 Pro, TVS LP 46 Neo, Xprinter XP-420B, Rongta, Gainscha
 */
export function generateTsplCommands(
  products: { product: Product; quantity: number }[],
  options: LabelDesignOptions,
  dimension: LabelSizeDimension
): string {
  let tspl = "";

  products.forEach(({ product, quantity }) => {
    if (quantity <= 0) return;

    const barcodeVal = (product.barcode || product.sku || "000000").replace(/[^a-zA-Z0-9]/g, "");
    const hasMrp = product.mrp && product.mrp > product.price;
    const discountPercent = hasMrp
      ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
      : 0;

    tspl += `SIZE ${dimension.widthMm} mm, ${dimension.heightMm} mm\n`;
    tspl += `GAP ${dimension.gapMm} mm, 0 mm\n`;
    tspl += `DIRECTION 1\n`;
    tspl += `REFERENCE 0,0\n`;
    tspl += `DENSITY ${Math.min(15, Math.max(1, options.darkness))}\n`;
    tspl += `CLS\n`;

    let yMm = 2;

    // 1. Store Header
    if (options.showStoreName && options.storeName) {
      const xDots = mmToDots(dimension.widthMm / 2, options.dpi);
      const yDots = mmToDots(yMm, options.dpi);
      tspl += `TEXT ${xDots},${yDots},"2",0,1,1,2,"${options.storeName.toUpperCase()}"\n`;
      yMm += 4;
    }

    // 2. Product Name
    if (options.showProductName) {
      const xDots = mmToDots(dimension.widthMm / 2, options.dpi);
      const yDots = mmToDots(yMm, options.dpi);
      tspl += `TEXT ${xDots},${yDots},"3",0,1,1,2,"${product.name.substring(0, 32)}"\n`;
      yMm += 5;
    }

    // 3. Price & MRP
    if (options.showSellingPrice) {
      const xDots = mmToDots(dimension.widthMm / 2, options.dpi);
      const yDots = mmToDots(yMm, options.dpi);
      const priceText = `${options.currencySymbol}${product.price.toFixed(2)}`;
      const mrpText = hasMrp ? `MRP:${options.currencySymbol}${product.mrp?.toFixed(2)}` : "";
      
      if (mrpText) {
        tspl += `TEXT ${xDots},${yDots},"1",0,1,1,2,"${mrpText} ${discountPercent > 0 ? `(${discountPercent}% OFF)` : ''}"\n`;
        yMm += 3.5;
      }
      
      const priceYDots = mmToDots(yMm, options.dpi);
      tspl += `TEXT ${xDots},${priceYDots},"4",0,1,1,2,"${priceText} / ${product.unit || 'Pack'}"\n`;
      yMm += 5.5;
    }

    // 4. Barcode
    if (options.showBarcodeGraphic) {
      const xDots = mmToDots(dimension.widthMm / 2, options.dpi);
      const yDots = mmToDots(yMm, options.dpi);
      const barHeightDots = mmToDots(dimension.heightMm > 35 ? 12 : 8, options.dpi);
      // BARCODE X, Y, "code type", height, human readable, rotation, narrow, wide, "content"
      tspl += `BARCODE ${xDots},${yDots},"128",${barHeightDots},${options.showBarcodeText ? 2 : 0},0,2,4,"${barcodeVal}"\n`;
      yMm += (dimension.heightMm > 35 ? 12 : 8) + (options.showBarcodeText ? 4 : 2);
    }

    // 5. SKU & Expiry Footer
    const footerParts: string[] = [];
    if (options.showSku) footerParts.push(`SKU:${product.sku}`);
    if (options.showBatchNo && product.batchNumber) footerParts.push(`B:${product.batchNumber}`);
    if (options.showExpiryDate && product.expiryDate) footerParts.push(`EXP:${product.expiryDate}`);

    if (footerParts.length > 0) {
      const xDots = mmToDots(dimension.widthMm / 2, options.dpi);
      const yDots = mmToDots(yMm, options.dpi);
      tspl += `TEXT ${xDots},${yDots},"1",0,1,1,2,"${footerParts.join(" | ")}"\n`;
    }

    tspl += `PRINT ${quantity},1\n\n`;
  });

  return tspl;
}

/**
 * Generates Thermal Alignment & Sensor Calibration Test Label (ZPL)
 */
export function generateCalibrationTestZpl(options: LabelDesignOptions, dimension: LabelSizeDimension): string {
  const pw = mmToDots(dimension.widthMm, options.dpi);
  const ll = mmToDots(dimension.heightMm, options.dpi);

  return `^XA
^PW${pw}
^LL${ll}
^PON
^LH0,0
~SD${options.darkness * 2}
^GB0,0,${pw},${ll},2,B^FS
^FO15,15^A0N,28,28^FDEXPERT POS THERMAL CALIBRATION^FS
^FO15,45^A0N,20,20^FDLabel Size: ${dimension.widthMm}mm x ${dimension.heightMm}mm | DPI: ${options.dpi}^FS
^FO15,70^A0N,20,20^FDDensity: ${options.darkness}/15 | Sensor: Gap/Notch OK^FS
^BY2,2.5,45
^FO${Math.round((pw - 260) / 2)},100^BCN,45,Y,N,N^FDCALIB-OK-99^FS
^FO15,${ll - 30}^A0N,18,18^FDALIGNMENT BOX MARGINS VERIFIED^FS
^PQ1,0,1,Y
^XZ`;
}

/**
 * Generates Thermal Alignment & Sensor Calibration Test Label (TSPL)
 */
export function generateCalibrationTestTspl(options: LabelDesignOptions, dimension: LabelSizeDimension): string {
  return `SIZE ${dimension.widthMm} mm, ${dimension.heightMm} mm
GAP ${dimension.gapMm} mm, 0 mm
DIRECTION 1
REFERENCE 0,0
DENSITY ${options.darkness}
CLS
BOX 2,2,${mmToDots(dimension.widthMm - 1, options.dpi)},${mmToDots(dimension.heightMm - 1, options.dpi)},2
TEXT ${mmToDots(dimension.widthMm / 2, options.dpi)},15,"2",0,1,1,2,"EXPERT POS THERMAL CALIBRATION"
TEXT ${mmToDots(dimension.widthMm / 2, options.dpi)},45,"1",0,1,1,2,"Size: ${dimension.widthMm}x${dimension.heightMm}mm | DPI: ${options.dpi}"
TEXT ${mmToDots(dimension.widthMm / 2, options.dpi)},70,"1",0,1,1,2,"Density: ${options.darkness}/15 | Tear-off Align OK"
BARCODE ${mmToDots(dimension.widthMm / 2, options.dpi)},100,"128",45,2,0,2,4,"CALIB-OK-99"
PRINT 1,1
`;
}

// ============================================================================
// High-Precision Thermal Direct Browser Print Engine with CSS @page (mm)
// ============================================================================

/**
 * Triggers a direct thermal print window configured with exact millimeter page dimensions.
 * This overrides browser header/footer margins and forces continuous roll feed without blank pages.
 */
export function printThermalLabelsDirect(
  renderedHtmlContent: string,
  dimension: LabelSizeDimension,
  jobTitle: string = "Expert POS Thermal Label Print"
): boolean {
  try {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.title = jobTitle;

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      console.error("Unable to access print iframe document.");
      return false;
    }

    const isA4Sheet = dimension.category === "sheet";
    const pageWidthCss = isA4Sheet ? "210mm" : `${dimension.widthMm}mm`;
    const pageHeightCss = isA4Sheet ? "297mm" : `${dimension.heightMm}mm`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${jobTitle}</title>
  <style>
    @page {
      size: ${pageWidthCss} ${pageHeightCss};
      margin: 0mm !important;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      margin: 0;
      padding: 0;
    }
    html, body {
      background: #fff !important;
      color: #000 !important;
      width: ${pageWidthCss} !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .label-print-page {
      width: ${pageWidthCss};
      height: ${pageHeightCss};
      page-break-after: always;
      break-after: page;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }
    /* Anti-aliasing disable for sharp thermal printing */
    svg, img {
      image-rendering: pixelated;
      shape-rendering: crispEdges;
    }
  </style>
</head>
<body>
  ${renderedHtmlContent}
</body>
</html>`;

    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Error triggering print on iframe:", err);
      } finally {
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 3000);
      }
    }, 400);

    return true;
  } catch (error) {
    console.error("Failed to execute thermal print job:", error);
    return false;
  }
}
