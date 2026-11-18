/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Enterprise Thermal Label & Barcode Printer Engine
 * Supports Zebra (ZPL II), TSC / TVS / Xprinter (TSPL/TSPL2), Epson (ESC/POS),
 * full 1-Up & 2-Up Dual Roll continuous/gap labels, and high-precision browser
 * direct thermal print with exact CSS @page mm rules.
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
  | "dual-roll-25x15"  // 2-Up (2 x 25x15 mm on 54mm roll)
  | "dual-roll-32x19"  // 2-Up (2 x 32x19 mm on 68mm roll)
  | "dual-roll-35x25"  // 2-Up (2 x 35x25 mm on 74mm roll)
  | "dual-roll-38x25"  // 2-Up (2 x 38x25 mm dual roll on 80mm backing)
  | "dual-roll-40x25"  // 2-Up (2 x 40x25 mm on 84mm roll)
  | "dual-roll-40x30"  // 2-Up (2 x 40x30 mm on 84mm roll)
  | "dual-roll-48x25"  // 2-Up (2 x 48x25 mm on 100mm roll)
  | "dual-roll-50x25"  // 2-Up (2 x 50x25 mm on 104mm / 4" roll)
  | "dual-roll-50x30"  // 2-Up (2 x 50x30 mm on 104mm / 4" roll)
  | "dual-roll-50x38"  // 2-Up (2 x 50x38 mm on 104mm / 4" roll)
  | "dual-roll-50x50"  // 2-Up (2 x 50x50 mm on 104mm / 4" roll)
  | "jewelry-32x19"    // 32 x 19 mm Dumbbell / Butterfly Jewelry Tag
  | "a4-sheet-24"      // A4 24 Labels (70 x 37 mm, 3 cols x 8 rows)
  | "a4-sheet-40"      // A4 40 Labels (52.5 x 29.7 mm, 4 cols x 10 rows)
  | "a4-sheet-65"      // A4 65 Labels (38.1 x 21.2 mm, 5 cols x 13 rows)
  | "custom";

export interface LabelSizeDimension {
  id: LabelSizePresetId;
  name: string;
  category: "roll" | "multi-column" | "sheet" | "custom";
  widthMm: number;           // Total backing width (for 2-up, 2 * labelWidthMm + horizontalGapMm + 2 * sideMarginMm)
  heightMm: number;
  gapMm: number;             // Vertical gap between rows
  columnsAcross: number;
  labelWidthMm?: number;     // Width of a single sticker in multi-column roll
  horizontalGapMm?: number;  // Gap between left & right sticker in 2-up roll
  sideMarginMm?: number;     // Liner margin on left & right edge
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
  // ==================== ALL 2-UP DUAL ROLL PRESETS ====================
  {
    id: "dual-roll-25x15",
    name: "2-Up (2 × 25×15 mm)",
    category: "multi-column",
    widthMm: 54,
    heightMm: 15,
    gapMm: 2,
    columnsAcross: 2,
    labelWidthMm: 25,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up Mini Dual Roll on 54mm Backing (2 labels across)",
    recommendedFor: "Small sachets, vials, cosmetics, cables, optometry, mini stickers"
  },
  {
    id: "dual-roll-32x19",
    name: "2-Up (2 × 32×19 mm)",
    category: "multi-column",
    widthMm: 68,
    heightMm: 19,
    gapMm: 2,
    columnsAcross: 2,
    labelWidthMm: 32,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up Compact Dual Roll on 68mm Backing (2 labels across)",
    recommendedFor: "Optical frames, jewelry, small pharma bottles, boutique accessories"
  },
  {
    id: "dual-roll-35x25",
    name: "2-Up (2 × 35×25 mm)",
    category: "multi-column",
    widthMm: 74,
    heightMm: 25,
    gapMm: 2.5,
    columnsAcross: 2,
    labelWidthMm: 35,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up Grocery/Pharmacy Dual Roll on 74mm Backing",
    recommendedFor: "Pharmacy strips, bakery packets, fast-moving supermarket SKUs"
  },
  {
    id: "dual-roll-38x25",
    name: "2-Up (2 × 38×25 mm)",
    category: "multi-column",
    widthMm: 80,
    heightMm: 25,
    gapMm: 3,
    columnsAcross: 2,
    labelWidthMm: 38,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "Standard 2-Up Dual Roll on 80mm Thermal Backing Paper",
    recommendedFor: "High-volume retail tagging, double throughput on 80mm / 4-inch printers"
  },
  {
    id: "dual-roll-40x25",
    name: "2-Up (2 × 40×25 mm)",
    category: "multi-column",
    widthMm: 84,
    heightMm: 25,
    gapMm: 3,
    columnsAcross: 2,
    labelWidthMm: 40,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up Wide Retail Dual Roll on 84mm Backing",
    recommendedFor: "Garments, footwear boxes, pharmacy, grocery shelf stickers"
  },
  {
    id: "dual-roll-40x30",
    name: "2-Up (2 × 40×30 mm)",
    category: "multi-column",
    widthMm: 84,
    heightMm: 30,
    gapMm: 3,
    columnsAcross: 2,
    labelWidthMm: 40,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up Tall Dual Roll on 84mm Backing (Batch & Expiry)",
    recommendedFor: "Packaged food, FMCG, dairy, apparel price & MRP tags"
  },
  {
    id: "dual-roll-48x25",
    name: "2-Up (2 × 48×25 mm)",
    category: "multi-column",
    widthMm: 100,
    heightMm: 25,
    gapMm: 3,
    columnsAcross: 2,
    labelWidthMm: 48,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up 100mm Wide Backing Roll (2 × 48×25 mm)",
    recommendedFor: "4-inch TSC/Zebra/TVS/Xprinter dual-column high-speed shelf labels"
  },
  {
    id: "dual-roll-50x25",
    name: "2-Up Dual Roll (50×25 mm • 103mm Total)",
    category: "multi-column",
    widthMm: 103,
    heightMm: 25,
    gapMm: 3,
    columnsAcross: 2,
    labelWidthMm: 50,
    horizontalGapMm: 3,
    sideMarginMm: 0,
    description: "2-Up Dual Roll: 50×25 mm individual labels, 3 mm centre gap, 3 mm vertical gap (103 mm total width)",
    recommendedFor: "Supermarkets, apparel retail, electronics, warehouse racks (4-inch thermal printers)"
  },
  {
    id: "dual-roll-50x30",
    name: "2-Up (2 × 50×30 mm)",
    category: "multi-column",
    widthMm: 104,
    heightMm: 30,
    gapMm: 3,
    columnsAcross: 2,
    labelWidthMm: 50,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up 50×30 mm Dual Roll on 104mm (4-inch) Backing",
    recommendedFor: "Supermarkets, FMCG with batch/expiry, high-volume fulfillment"
  },
  {
    id: "dual-roll-50x38",
    name: "2-Up (2 × 50×38 mm / 2\"×1.5\")",
    category: "multi-column",
    widthMm: 104,
    heightMm: 38,
    gapMm: 3,
    columnsAcross: 2,
    labelWidthMm: 50,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up 2\"×1.5\" Dual Roll on 104mm (4-inch) Backing",
    recommendedFor: "Detailed MRP + FSSAI + batch/expiry retail & warehouse labels"
  },
  {
    id: "dual-roll-50x50",
    name: "2-Up (2 × 50×50 mm / 2\"×2\")",
    category: "multi-column",
    widthMm: 104,
    heightMm: 50,
    gapMm: 3,
    columnsAcross: 2,
    labelWidthMm: 50,
    horizontalGapMm: 2,
    sideMarginMm: 1,
    description: "2-Up Square Dual Roll on 104mm (4-inch) Backing",
    recommendedFor: "QR + Barcode box stickers, apparel hang tags, inventory bins"
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
    description: "Mini Barcode Stickers (5 cols × 13 rows)",
    recommendedFor: "Small item inventory stickers on standard office A4 printers"
  }
];

export const DUAL_ROLL_PRESETS = LABEL_SIZE_PRESETS.filter(
  (p) => p.category !== "sheet" && p.columnsAcross === 2
);

export function isDualRollPreset(dimension: LabelSizeDimension): boolean {
  return dimension.category !== "sheet" && dimension.columnsAcross === 2;
}

export function getDualRollGeometry(dimension: LabelSizeDimension): {
  isDualRoll: boolean;
  totalRollWidthMm: number;
  singleLabelWidthMm: number;
  horizontalGapMm: number;
  sideMarginMm: number;
  heightMm: number;
  col2StartMm: number;
} {
  const isDualRoll = isDualRollPreset(dimension);
  if (!isDualRoll) {
    return {
      isDualRoll: false,
      totalRollWidthMm: dimension.widthMm,
      singleLabelWidthMm: dimension.widthMm,
      horizontalGapMm: 0,
      sideMarginMm: 0,
      heightMm: dimension.heightMm,
      col2StartMm: 0
    };
  }
  const horizontalGapMm = dimension.horizontalGapMm ?? 2;
  const sideMarginMm = dimension.sideMarginMm ?? 1;
  const singleLabelWidthMm =
    dimension.labelWidthMm ??
    Math.max(15, Number(((dimension.widthMm - horizontalGapMm - sideMarginMm * 2) / 2).toFixed(2)));
  const totalRollWidthMm = Number(
    (singleLabelWidthMm * 2 + horizontalGapMm + sideMarginMm * 2).toFixed(2)
  );
  const col2StartMm = Number((sideMarginMm + singleLabelWidthMm + horizontalGapMm).toFixed(2));
  return {
    isDualRoll: true,
    totalRollWidthMm,
    singleLabelWidthMm,
    horizontalGapMm,
    sideMarginMm,
    heightMm: dimension.heightMm,
    col2StartMm
  };
}

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
  customColumnsAcross?: 1 | 2;
  customHorizontalGapMm?: number;
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
  100: "114131", 101: "311141", 102: "411131", 103: "211412", 104: "211214",
  105: "211232",
  106: "2331112"
};

export function encodeCode128B(text: string): { modules: boolean[]; code: string } {
  const clean = text.replace(/[^ -~]/g, "") || "000000";
  const codes: number[] = [104];
  let checksum = 104;

  for (let i = 0; i < clean.length; i++) {
    const val = clean.charCodeAt(i) - 32;
    codes.push(val);
    checksum += val * (i + 1);
  }

  const checkVal = checksum % 103;
  codes.push(checkVal);
  codes.push(106);

  const modules: boolean[] = [];
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

  for (let q = 0; q < 10; q++) modules.push(false);

  return { modules, code: clean };
}

export function generateBarcodeSvgString(
  text: string,
  heightPx: number = 42,
  includeHumanReadable: boolean = true
): string {
  const { modules, code } = encodeCode128B(text);
  const totalWidth = modules.length;
  const textZone = includeHumanReadable ? Math.min(13, Math.max(9, Math.round(heightPx * 0.34))) : 0;
  const barHeight = Math.max(8, heightPx - textZone);

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

  const textSize = Math.max(8, Math.min(11, textZone - 2));
  const textElement = includeHumanReadable
    ? `<text x="${totalWidth / 2}" y="${heightPx - 1}" font-family="monospace" font-size="${textSize}" font-weight="bold" text-anchor="middle" fill="#000" letter-spacing="1.2">${code}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${heightPx}" preserveAspectRatio="none" style="image-rendering: pixelated; shape-rendering: crispEdges; width: 100%; height: ${heightPx}px;">
    ${rects}
    ${textElement}
  </svg>`;
}

export function generateQrCodeSvgString(text: string, sizePx: number = 70): string {
  const matrixSize = 25;
  const cells: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

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

  stampFinder(0, 0);
  stampFinder(matrixSize - 7, 0);
  stampFinder(0, matrixSize - 7);

  for (let i = 7; i < matrixSize - 7; i++) {
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }

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
// Pair Chunking Helper for 2-Up Dual Roll Output
// ============================================================================

export interface LabelRowPair {
  left: Product;
  right: Product | null;
}

export function chunkLabelsForRows(
  products: { product: Product; quantity: number }[],
  columnsAcross: number
): LabelRowPair[] {
  const flat: Product[] = [];
  products.forEach(({ product, quantity }) => {
    const count = Math.max(0, Math.floor(quantity));
    for (let i = 0; i < count; i++) {
      flat.push(product);
    }
  });

  if (columnsAcross !== 2) {
    return flat.map((p) => ({ left: p, right: null }));
  }

  const pairs: LabelRowPair[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    pairs.push({
      left: flat[i],
      right: flat[i + 1] ?? null
    });
  }
  return pairs;
}

interface CompactPairRun {
  left: Product;
  right: Product | null;
  count: number;
}

function compressPairRuns(pairs: LabelRowPair[]): CompactPairRun[] {
  const runs: CompactPairRun[] = [];
  pairs.forEach((pair) => {
    const prev = runs[runs.length - 1];
    if (
      prev &&
      prev.left.id === pair.left.id &&
      (prev.right?.id ?? null) === (pair.right?.id ?? null)
    ) {
      prev.count += 1;
    } else {
      runs.push({ left: pair.left, right: pair.right, count: 1 });
    }
  });
  return runs;
}

// ============================================================================
// Raw Industrial Label Printer Command Generators (ZPL II & TSPL/TSPL2)
// ============================================================================

export function mmToDots(mm: number, dpi: 203 | 300 | 600 = 203): number {
  const dotsPerMm = dpi === 600 ? 23.62 : dpi === 300 ? 11.81 : 8.0;
  return Math.round(mm * dotsPerMm);
}

function renderZplSingleSlot(
  product: Product,
  options: LabelDesignOptions,
  xOriginDots: number,
  slotWidthDots: number,
  slotWidthMm: number,
  heightMm: number
): string {
  const dpi = options.dpi || 203;
  const barcodeVal = (product.barcode || product.sku || "000000").replace(/[^a-zA-Z0-9]/g, "");
  const hasMrp = product.mrp && product.mrp > product.price;
  const discountPercent = hasMrp
    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
    : 0;

  const compact = heightMm <= 20 || slotWidthMm <= 34;
  let out = "";
  let yOffset = mmToDots(compact ? 1.0 : 1.8, dpi);

  if (options.showStoreName && options.storeName) {
    const fontH = compact ? 2.2 : 2.9;
    out += `^FO${xOriginDots},${yOffset}^FB${slotWidthDots},1,0,C^A0N,${mmToDots(fontH, dpi)},${mmToDots(fontH, dpi)}^FD${options.storeName.toUpperCase().substring(0, compact ? 18 : 28)}^FS\n`;
    yOffset += mmToDots(compact ? 2.6 : 3.6, dpi);
  }

  if (options.showProductName) {
    const baseNameMm =
      options.productNameFontSize === "large" ? 3.8 : options.productNameFontSize === "small" ? 2.6 : 3.2;
    const pNameFont = compact ? Math.min(2.6, baseNameMm) : baseNameMm;
    out += `^FO${xOriginDots},${yOffset}^FB${slotWidthDots},${compact ? 1 : 2},0,C^A0N,${mmToDots(pNameFont, dpi)},${mmToDots(pNameFont, dpi)}^FD${product.name.substring(0, compact ? 22 : 38)}^FS\n`;
    yOffset += mmToDots(compact ? 3.0 : 5.0, dpi);
  }

  if (options.showSellingPrice) {
    const priceStr = `${options.currencySymbol}${product.price.toFixed(2)}`;
    const mrpStr = hasMrp && options.showMrp ? `MRP:${options.currencySymbol}${product.mrp?.toFixed(2)}` : "";
    const discStr = discountPercent > 0 && options.showSavingsBadge ? ` (${discountPercent}% OFF)` : "";

    if (mrpStr && !compact) {
      out += `^FO${xOriginDots},${yOffset}^FB${slotWidthDots},1,0,C^A0N,${mmToDots(2.5, dpi)},${mmToDots(2.5, dpi)}^FD${mrpStr}${discStr}^FS\n`;
      yOffset += mmToDots(3.3, dpi);
    }

    const priceFont = compact ? 3.2 : 4.2;
    out += `^FO${xOriginDots},${yOffset}^FB${slotWidthDots},1,0,C^A0N,${mmToDots(priceFont, dpi)},${mmToDots(priceFont, dpi)}^FD${priceStr}${compact ? "" : ` / ${product.unit || "Unit"}`}^FS\n`;
    yOffset += mmToDots(compact ? 3.6 : 5.0, dpi);
  }

  if (options.showBarcodeGraphic) {
    const barHeightMm = heightMm > 35 ? 11 : heightMm <= 20 ? 4.5 : 7;
    const barHeight = mmToDots(barHeightMm, dpi);
    const barModuleWidth = slotWidthMm <= 34 ? 1 : 2;
    const estBarWidthDots = mmToDots(Math.min(slotWidthMm - 4, 34), dpi);
    const barX = xOriginDots + Math.max(mmToDots(2, dpi), Math.round((slotWidthDots - estBarWidthDots) / 2));
    out += `^BY${barModuleWidth},2.2,${barHeight}\n`;
    out += `^FO${barX},${yOffset}^BCN,${barHeight},${options.showBarcodeText ? "Y" : "N"},N,N^FD${barcodeVal}^FS\n`;
    yOffset += barHeight + mmToDots(options.showBarcodeText ? (compact ? 2.5 : 4.0) : 1.5, dpi);
  }

  const footerParts: string[] = [];
  if (options.showSku) footerParts.push(`SKU:${product.sku}`);
  if (options.showBatchNo && product.batchNumber && !compact) footerParts.push(`B:${product.batchNumber}`);
  if (options.showExpiryDate && product.expiryDate && !compact) footerParts.push(`EXP:${product.expiryDate}`);

  if (footerParts.length > 0 && yOffset < mmToDots(heightMm - 2, dpi)) {
    out += `^FO${xOriginDots},${yOffset}^FB${slotWidthDots},1,0,C^A0N,${mmToDots(2.1, dpi)},${mmToDots(2.1, dpi)}^FD${footerParts.join(" | ")}^FS\n`;
  }

  return out;
}

/**
 * Generates Zebra ZPL II raw command string (1-Up and 2-Up Dual Roll aware)
 */
export function generateZplCommands(
  products: { product: Product; quantity: number }[],
  options: LabelDesignOptions,
  dimension: LabelSizeDimension
): string {
  const dpi = options.dpi || 203;
  const geo = getDualRollGeometry(dimension);
  const pw = mmToDots(geo.totalRollWidthMm, dpi);
  const ll = mmToDots(geo.heightMm, dpi);
  const slotWidthDots = mmToDots(geo.singleLabelWidthMm, dpi);
  const leftOriginDots = mmToDots(geo.sideMarginMm, dpi);
  const rightOriginDots = mmToDots(geo.col2StartMm, dpi);

  let zpl = "";

  if (geo.isDualRoll) {
    const pairs = chunkLabelsForRows(products, 2);
    const runs = compressPairRuns(pairs);
    runs.forEach(({ left, right, count }) => {
      zpl += `^XA\n`;
      zpl += `^PW${pw}\n`;
      zpl += `^LL${ll}\n`;
      zpl += `^PON\n`;
      zpl += `^LH0,0\n`;
      zpl += `~SD${Math.min(30, Math.max(1, options.darkness * 2))}\n`;
      zpl += renderZplSingleSlot(left, options, leftOriginDots, slotWidthDots, geo.singleLabelWidthMm, geo.heightMm);
      if (right) {
        zpl += renderZplSingleSlot(right, options, rightOriginDots, slotWidthDots, geo.singleLabelWidthMm, geo.heightMm);
      }
      zpl += `^PQ${count},0,1,Y\n`;
      zpl += `^XZ\n\n`;
    });
    return zpl;
  }

  products.forEach(({ product, quantity }) => {
    if (quantity <= 0) return;
    zpl += `^XA\n`;
    zpl += `^PW${pw}\n`;
    zpl += `^LL${ll}\n`;
    zpl += `^PON\n`;
    zpl += `^LH0,0\n`;
    zpl += `~SD${Math.min(30, Math.max(1, options.darkness * 2))}\n`;
    zpl += renderZplSingleSlot(product, options, 0, pw, geo.singleLabelWidthMm, geo.heightMm);
    zpl += `^PQ${quantity},0,1,Y\n`;
    zpl += `^XZ\n\n`;
  });

  return zpl;
}

function renderTsplSingleSlot(
  product: Product,
  options: LabelDesignOptions,
  xCenterMm: number,
  slotWidthMm: number,
  heightMm: number
): string {
  const dpi = options.dpi || 203;
  const barcodeVal = (product.barcode || product.sku || "000000").replace(/[^a-zA-Z0-9]/g, "");
  const hasMrp = product.mrp && product.mrp > product.price;
  const discountPercent = hasMrp
    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
    : 0;
  const compact = heightMm <= 20 || slotWidthMm <= 34;

  let out = "";
  let yMm = compact ? 1.0 : 1.8;
  const xDots = mmToDots(xCenterMm, dpi);

  if (options.showStoreName && options.storeName) {
    out += `TEXT ${xDots},${mmToDots(yMm, dpi)},"${compact ? "1" : "2"}",0,1,1,2,"${options.storeName.toUpperCase().substring(0, compact ? 16 : 26)}"\n`;
    yMm += compact ? 2.6 : 3.8;
  }

  if (options.showProductName) {
    out += `TEXT ${xDots},${mmToDots(yMm, dpi)},"${compact ? "2" : "3"}",0,1,1,2,"${product.name.substring(0, compact ? 18 : 28)}"\n`;
    yMm += compact ? 3.2 : 4.8;
  }

  if (options.showSellingPrice) {
    const priceText = `${options.currencySymbol}${product.price.toFixed(2)}`;
    const mrpText = hasMrp && options.showMrp ? `MRP:${options.currencySymbol}${product.mrp?.toFixed(2)}` : "";

    if (mrpText && !compact) {
      out += `TEXT ${xDots},${mmToDots(yMm, dpi)},"1",0,1,1,2,"${mrpText}${discountPercent > 0 && options.showSavingsBadge ? ` (${discountPercent}% OFF)` : ""}"\n`;
      yMm += 3.2;
    }

    out += `TEXT ${xDots},${mmToDots(yMm, dpi)},"${compact ? "3" : "4"}",0,1,1,2,"${priceText}${compact ? "" : ` / ${product.unit || "Pack"}`}"\n`;
    yMm += compact ? 3.5 : 5.2;
  }

  if (options.showBarcodeGraphic) {
    const barHeightMm = heightMm > 35 ? 11 : heightMm <= 20 ? 4.5 : 7.5;
    const barHeightDots = mmToDots(barHeightMm, dpi);
    const narrow = slotWidthMm <= 34 ? 1 : 2;
    const wide = slotWidthMm <= 34 ? 2 : 4;
    out += `BARCODE ${xDots},${mmToDots(yMm, dpi)},"128",${barHeightDots},${options.showBarcodeText ? 2 : 0},0,${narrow},${wide},"${barcodeVal}"\n`;
    yMm += barHeightMm + (options.showBarcodeText ? (compact ? 2.5 : 4.0) : 1.5);
  }

  const footerParts: string[] = [];
  if (options.showSku) footerParts.push(`SKU:${product.sku}`);
  if (options.showBatchNo && product.batchNumber && !compact) footerParts.push(`B:${product.batchNumber}`);
  if (options.showExpiryDate && product.expiryDate && !compact) footerParts.push(`EXP:${product.expiryDate}`);

  if (footerParts.length > 0 && yMm < heightMm - 2) {
    out += `TEXT ${xDots},${mmToDots(yMm, dpi)},"1",0,1,1,2,"${footerParts.join(" | ")}"\n`;
  }

  return out;
}

/**
 * Generates TSC TSPL/TSPL2 raw command string (1-Up and 2-Up Dual Roll aware)
 */
export function generateTsplCommands(
  products: { product: Product; quantity: number }[],
  options: LabelDesignOptions,
  dimension: LabelSizeDimension
): string {
  const geo = getDualRollGeometry(dimension);
  let tspl = "";

  if (geo.isDualRoll) {
    const pairs = chunkLabelsForRows(products, 2);
    const runs = compressPairRuns(pairs);
    const col1CenterMm = geo.sideMarginMm + geo.singleLabelWidthMm / 2;
    const col2CenterMm = geo.col2StartMm + geo.singleLabelWidthMm / 2;

    runs.forEach(({ left, right, count }) => {
      tspl += `SIZE ${geo.totalRollWidthMm} mm, ${geo.heightMm} mm\n`;
      tspl += `GAP ${dimension.gapMm} mm, 0 mm\n`;
      tspl += `DIRECTION 1\n`;
      tspl += `REFERENCE 0,0\n`;
      tspl += `DENSITY ${Math.min(15, Math.max(1, options.darkness))}\n`;
      tspl += `CLS\n`;
      tspl += renderTsplSingleSlot(left, options, col1CenterMm, geo.singleLabelWidthMm, geo.heightMm);
      if (right) {
        tspl += renderTsplSingleSlot(right, options, col2CenterMm, geo.singleLabelWidthMm, geo.heightMm);
      }
      tspl += `PRINT ${count},1\n\n`;
    });
    return tspl;
  }

  products.forEach(({ product, quantity }) => {
    if (quantity <= 0) return;
    tspl += `SIZE ${geo.totalRollWidthMm} mm, ${geo.heightMm} mm\n`;
    tspl += `GAP ${dimension.gapMm} mm, 0 mm\n`;
    tspl += `DIRECTION 1\n`;
    tspl += `REFERENCE 0,0\n`;
    tspl += `DENSITY ${Math.min(15, Math.max(1, options.darkness))}\n`;
    tspl += `CLS\n`;
    tspl += renderTsplSingleSlot(product, options, geo.totalRollWidthMm / 2, geo.singleLabelWidthMm, geo.heightMm);
    tspl += `PRINT ${quantity},1\n\n`;
  });

  return tspl;
}

/**
 * Generates Thermal Alignment & Sensor Calibration Test Label (ZPL)
 */
export function generateCalibrationTestZpl(options: LabelDesignOptions, dimension: LabelSizeDimension): string {
  const geo = getDualRollGeometry(dimension);
  const pw = mmToDots(geo.totalRollWidthMm, options.dpi);
  const ll = mmToDots(geo.heightMm, options.dpi);

  if (geo.isDualRoll) {
    const slotW = mmToDots(geo.singleLabelWidthMm, options.dpi);
    const x1 = mmToDots(geo.sideMarginMm, options.dpi);
    const x2 = mmToDots(geo.col2StartMm, options.dpi);
    const boxH = Math.max(40, ll - 8);
    return `^XA
^PW${pw}
^LL${ll}
^PON
^LH0,0
~SD${options.darkness * 2}
^FO${x1},4^GB${slotW},${boxH},2,B^FS
^FO${x1 + 8},12^A0N,20,20^FD2-UP LEFT (${geo.singleLabelWidthMm}x${geo.heightMm})^FS
^BY1,2,36
^FO${x1 + 14},44^BCN,36,Y,N,N^FDCALIB-L1^FS
^FO${x2},4^GB${slotW},${boxH},2,B^FS
^FO${x2 + 8},12^A0N,20,20^FD2-UP RIGHT (${geo.singleLabelWidthMm}x${geo.heightMm})^FS
^BY1,2,36
^FO${x2 + 14},44^BCN,36,Y,N,N^FDCALIB-R2^FS
^PQ1,0,1,Y
^XZ`;
  }

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
  const geo = getDualRollGeometry(dimension);

  if (geo.isDualRoll) {
    const x1 = mmToDots(geo.sideMarginMm, options.dpi);
    const x1End = mmToDots(geo.sideMarginMm + geo.singleLabelWidthMm, options.dpi);
    const x2 = mmToDots(geo.col2StartMm, options.dpi);
    const x2End = mmToDots(geo.col2StartMm + geo.singleLabelWidthMm, options.dpi);
    const c1 = mmToDots(geo.sideMarginMm + geo.singleLabelWidthMm / 2, options.dpi);
    const c2 = mmToDots(geo.col2StartMm + geo.singleLabelWidthMm / 2, options.dpi);
    const boxYEnd = mmToDots(Math.max(10, geo.heightMm - 1), options.dpi);
    return `SIZE ${geo.totalRollWidthMm} mm, ${geo.heightMm} mm
GAP ${dimension.gapMm} mm, 0 mm
DIRECTION 1
REFERENCE 0,0
DENSITY ${options.darkness}
CLS
BOX ${x1},4,${x1End},${boxYEnd},2
TEXT ${c1},12,"2",0,1,1,2,"2-UP LEFT"
TEXT ${c1},34,"1",0,1,1,2,"${geo.singleLabelWidthMm}x${geo.heightMm}mm"
BARCODE ${c1},52,"128",36,2,0,1,2,"CALIB-L1"
BOX ${x2},4,${x2End},${boxYEnd},2
TEXT ${c2},12,"2",0,1,1,2,"2-UP RIGHT"
TEXT ${c2},34,"1",0,1,1,2,"${geo.singleLabelWidthMm}x${geo.heightMm}mm"
BARCODE ${c2},52,"128",36,2,0,1,2,"CALIB-R2"
PRINT 1,1
`;
  }

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
// High-Precision HTML Builders for Direct Browser Printing (1-Up, 2-Up & A4)
// ============================================================================

export function renderSingleLabelHtml(
  prod: Product,
  dim: LabelSizeDimension,
  opt: LabelDesignOptions
): string {
  const geo = getDualRollGeometry(dim);
  const effectiveWidthMm = geo.isDualRoll ? geo.singleLabelWidthMm : dim.widthMm;
  const compact = dim.heightMm <= 20 || effectiveWidthMm <= 34;

  const barcodeVal = prod.barcode || prod.sku;
  const hasMrp = prod.mrp && prod.mrp > prod.price;
  const disc = hasMrp ? Math.round(((prod.mrp! - prod.price) / prod.mrp!) * 100) : 0;

  const barHeightPx = dim.heightMm <= 16 ? 15 : dim.heightMm <= 20 ? 19 : dim.heightMm > 35 ? 40 : 26;
  const qrSizePx = dim.heightMm <= 20 ? 28 : 44;

  const barcodeSvg =
    opt.barcodeType === "QR"
      ? generateQrCodeSvgString(barcodeVal, qrSizePx)
      : generateBarcodeSvgString(barcodeVal, barHeightPx, opt.showBarcodeText);

  const padCss = compact ? "0.6mm 1mm" : "1.2mm 1.5mm";
  const storeFont = compact ? "6px" : "7.5px";
  const nameFont = compact ? "7px" : opt.productNameFontSize === "large" ? "9.5px" : opt.productNameFontSize === "small" ? "7.5px" : "8.5px";
  const priceFont = compact ? "9px" : "11px";
  const footerFont = compact ? "5.5px" : "6.5px";

  return `
    <div style="border: 0.4px solid #000; border-radius: 1.5px; padding: ${padCss}; background: #fff; color: #000; display: flex; flex-direction: column; justify-content: space-between; width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; font-family: -apple-system, sans-serif;">
      ${
        opt.showStoreName
          ? `<div style="text-align: center; font-size: ${storeFont}; font-weight: 900; letter-spacing: 0.3px; text-transform: uppercase; border-bottom: 0.4px solid #000; padding-bottom: 0.3mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${opt.storeName}
            </div>`
          : ""
      }
      ${
        opt.customPromoText.trim() && !compact
          ? `<div style="background: #000; color: #fff; font-size: 6px; font-weight: bold; text-align: center; text-transform: uppercase; padding: 0.3mm 0;">
              ${opt.customPromoText}
            </div>`
          : ""
      }
      ${
        opt.showProductName
          ? `<div style="text-align: center; font-size: ${nameFont}; font-weight: 800; line-height: 1.1; max-height: ${compact ? "10px" : "18px"}; overflow: hidden;">
              ${prod.name}
            </div>`
          : ""
      }
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div style="display: flex; align-items: baseline; gap: 2px; flex-wrap: wrap;">
          ${
            opt.showMrp && hasMrp && !compact
              ? `<span style="font-size: 6.5px; color: #333; font-family: monospace; font-weight: 700;">MRP:${opt.currencySymbol}${prod.mrp?.toFixed(2)}</span>`
              : ""
          }
          <div style="font-size: ${priceFont}; font-weight: 900; font-family: monospace; line-height: 1;">
            ${opt.currencySymbol}${prod.price.toFixed(2)}${compact ? "" : `<span style="font-size: 6.5px; font-weight: 700;">/${prod.unit || "Unit"}</span>`}
          </div>
        </div>
        ${
          opt.showSavingsBadge && disc > 0 && !compact
            ? `<div style="background: #000; color: #fff; font-size: 6.5px; font-weight: bold; font-family: monospace; padding: 0.3mm 0.8mm; border-radius: 1px;">
                ${disc}% OFF
              </div>`
            : ""
        }
      </div>
      ${
        opt.showBarcodeGraphic
          ? `<div style="width: 100%; text-align: center; line-height: 0;">
              ${barcodeSvg}
            </div>`
          : ""
      }
      ${
        opt.showSku || (opt.showBatchNo && prod.batchNumber) || (opt.showExpiryDate && prod.expiryDate)
          ? `<div style="display: flex; justify-content: space-between; font-size: ${footerFont}; font-family: monospace; font-weight: 700; color: #000; border-top: 0.4px solid #ccc; padding-top: 0.3mm; white-space: nowrap; overflow: hidden;">
              ${opt.showSku ? `<span>${prod.sku}</span>` : ""}
              ${opt.showBatchNo && prod.batchNumber && !compact ? `<span>B:${prod.batchNumber}</span>` : ""}
              ${opt.showExpiryDate && prod.expiryDate && !compact ? `<span>EXP:${prod.expiryDate}</span>` : ""}
            </div>`
          : ""
      }
    </div>
  `;
}

export function buildLabelsPrintHtml(
  products: { product: Product; quantity: number }[],
  dim: LabelSizeDimension,
  opt: LabelDesignOptions
): string {
  if (dim.category === "sheet") {
    const flat: Product[] = [];
    products.forEach(({ product, quantity }) => {
      for (let i = 0; i < Math.max(0, quantity); i++) flat.push(product);
    });
    const cols = dim.columnsAcross || 3;
    return `
      <div style="padding: 10mm 6mm; width: 210mm; min-height: 297mm; display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 2.5mm; box-sizing: border-box;">
        ${flat.map((prod) => renderSingleLabelHtml(prod, dim, opt)).join("")}
      </div>
    `;
  }

  const geo = getDualRollGeometry(dim);

  if (geo.isDualRoll) {
    const pairs = chunkLabelsForRows(products, 2);
    return pairs
      .map(
        ({ left, right }) => `
        <div
          class="label-print-page label-dual-row"
          style="
            width: ${geo.totalRollWidthMm}mm;
            height: ${geo.heightMm}mm;
            padding: 0mm ${geo.sideMarginMm}mm;
            display: grid;
            grid-template-columns: ${geo.singleLabelWidthMm}mm ${geo.singleLabelWidthMm}mm;
            column-gap: ${geo.horizontalGapMm}mm;
            align-items: stretch;
            box-sizing: border-box;
          "
        >
          <div style="width: ${geo.singleLabelWidthMm}mm; height: ${geo.heightMm}mm; overflow: hidden;">
            ${renderSingleLabelHtml(left, dim, opt)}
          </div>
          <div style="width: ${geo.singleLabelWidthMm}mm; height: ${geo.heightMm}mm; overflow: hidden;">
            ${right ? renderSingleLabelHtml(right, dim, opt) : ""}
          </div>
        </div>
      `
      )
      .join("");
  }

  const singleRows = chunkLabelsForRows(products, 1);
  return singleRows
    .map(
      ({ left }) => `
      <div class="label-print-page" style="padding: 1mm 1.5mm; box-sizing: border-box;">
        ${renderSingleLabelHtml(left, dim, opt)}
      </div>
    `
    )
    .join("");
}

export function buildCalibrationTestHtml(
  printerName: string,
  dim: LabelSizeDimension,
  dpi: number,
  darkness: number,
  interfaceLabel: string = "BROWSER",
  sensorLabel: string = "GAP"
): string {
  const geo = getDualRollGeometry(dim);

  if (geo.isDualRoll) {
    const compact = geo.heightMm <= 20 || geo.singleLabelWidthMm <= 34;
    const renderTestSlot = (slotTag: string, code: string) => `
      <div style="padding: ${compact ? "0.6mm" : "1.2mm"}; border: 1px dashed #000; text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;">
        <div style="font-size: ${compact ? "6.5px" : "8px"}; font-weight: 900; border-bottom: 0.5px solid #000; padding-bottom: 0.4mm; text-transform: uppercase;">
          2-UP ${slotTag} (${geo.singleLabelWidthMm}×${geo.heightMm}mm)
        </div>
        <div style="font-size: ${compact ? "6px" : "7px"}; font-family: monospace; font-weight: 700;">
          DPI:${dpi} | D:${darkness}/15 | GAP:${geo.horizontalGapMm}mm
        </div>
        <div style="margin: 0 auto; width: 92%; line-height: 0;">
          ${generateBarcodeSvgString(code, compact ? 15 : 22, true)}
        </div>
      </div>
    `;

    return `
      <div
        class="label-print-page label-dual-row"
        style="
          width: ${geo.totalRollWidthMm}mm;
          height: ${geo.heightMm}mm;
          padding: 0mm ${geo.sideMarginMm}mm;
          display: grid;
          grid-template-columns: ${geo.singleLabelWidthMm}mm ${geo.singleLabelWidthMm}mm;
          column-gap: ${geo.horizontalGapMm}mm;
          align-items: stretch;
          box-sizing: border-box;
        "
      >
        ${renderTestSlot("LEFT", "CALIB-L1")}
        ${renderTestSlot("RIGHT", "CALIB-R2")}
      </div>
    `;
  }

  return `
    <div class="label-print-page" style="padding: 2mm; border: 1px dashed #000; text-align: center; height: 100%;">
      <div style="font-size: 9.5px; font-weight: 900; border-bottom: 1px solid #000; padding-bottom: 0.8mm; text-transform: uppercase;">
        ${printerName}
      </div>
      <div style="font-size: 8px; margin: 1mm 0; font-family: monospace; font-weight: 700;">
        Size: ${dim.widthMm}×${dim.heightMm}mm | DPI: ${dpi} | Dark: ${darkness}/15
      </div>
      <div style="margin: 1mm auto; width: 90%;">
        ${generateBarcodeSvgString("CALIB-OK-99", dim.heightMm <= 20 ? 18 : 28, true)}
      </div>
      <div style="font-size: 7px; font-family: monospace; font-weight: 700; border-top: 1px solid #000; padding-top: 0.8mm;">
        ${interfaceLabel} | SENSOR: ${sensorLabel}
      </div>
    </div>
  `;
}

// ============================================================================
// High-Precision Thermal Direct Browser Print Engine with CSS @page (mm)
// ============================================================================

export interface DirectLabelPrintResult {
  ok: boolean;
  blockedBySandbox?: boolean;
  printStationUrl?: string;
  reason?: string;
}

export interface LabelPrintSnapshotPayload {
  jobId?: string;
  kind: "label";
  html: string;
  layoutProfile?: string;
  pageWidthMm: number;
  pageHeightMm: number;
  isA4Sheet: boolean;
  isDualRoll: boolean;
  presetName: string;
  jobTitle: string;
  rawCommands?: string;
  rawProtocol?: "ZPL" | "TSPL";
  createdAt: number;
}

const LABEL_PRINT_SNAPSHOT_KEY = "expertpos_label_snapshot_v1";

function encodeUtf8ToBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64UrlToUtf8(b64Url: string): string {
  const padded = b64Url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64Url.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function saveLabelPrintSnapshot(payload: LabelPrintSnapshotPayload): void {
  try {
    localStorage.setItem(LABEL_PRINT_SNAPSHOT_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadLabelPrintSnapshot(): LabelPrintSnapshotPayload | null {
  try {
    const raw = localStorage.getItem(LABEL_PRINT_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.html) return null;
    return parsed as LabelPrintSnapshotPayload;
  } catch {
    return null;
  }
}

export function encodeLabelSnapshotToHash(payload: LabelPrintSnapshotPayload): string {
  try {
    const compact: LabelPrintSnapshotPayload = {
      jobId: payload.jobId,
      kind: "label",
      html: payload.html,
      pageWidthMm: payload.pageWidthMm,
      pageHeightMm: payload.pageHeightMm,
      isA4Sheet: payload.isA4Sheet,
      isDualRoll: payload.isDualRoll,
      presetName: payload.presetName,
      jobTitle: payload.jobTitle,
      createdAt: payload.createdAt
    };
    const encoded = encodeUtf8ToBase64Url(JSON.stringify(compact));
    if (encoded.length > 48000) return "";
    return encoded;
  } catch {
    return "";
  }
}

export function decodeLabelSnapshotFromHash(hashStr: string): LabelPrintSnapshotPayload | null {
  try {
    const clean = hashStr.replace(/^#/, "");
    const match = clean.match(/(?:^|&)l=([^&]+)/);
    if (!match?.[1]) return null;
    const jsonStr = decodeBase64UrlToUtf8(decodeURIComponent(match[1]));
    const parsed = JSON.parse(jsonStr);
    if (!parsed?.html) return null;
    return parsed as LabelPrintSnapshotPayload;
  } catch {
    return null;
  }
}

export function sendLabelPrintSnapshotToServer(jobId: string, payload: LabelPrintSnapshotPayload): void {
  try {
    const body = JSON.stringify({ ...payload, jobId, kind: "label", layoutProfile: payload.presetName || "label-roll" });
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
    // Ignore relay failures; hash & localStorage remain active
  }
}

export async function fetchLabelPrintSnapshotFromServer(jobId: string): Promise<LabelPrintSnapshotPayload | null> {
  const id = (jobId || "latest_label").trim() || "latest_label";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`/api/print/snapshot/${encodeURIComponent(id)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.snapshot?.html) {
          return data.snapshot as LabelPrintSnapshotPayload;
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

export function buildStandaloneLabelPrintUrl(jobId: string, payload: LabelPrintSnapshotPayload | null): string {
  const base = `/?printLabels=1&job=${encodeURIComponent(jobId || "latest_label")}`;
  if (!payload) return base;
  const hashData = encodeLabelSnapshotToHash(payload);
  return hashData ? `${base}#l=${hashData}` : base;
}

/**
 * Synchronously triggers browser/OS print dialog inside the active click gesture
 * using a dedicated @media print root (#pos-label-print-root) so thermal & A4
 * label printers receive exact mm geometry without hidden-iframe or user-gesture blocks.
 */
export function printLabelHtmlSynchronously(
  renderedHtmlContent: string,
  pageWidthMm: number,
  pageHeightMm: number,
  isA4Sheet: boolean,
  jobTitle: string = "Expert POS Thermal Label Print"
): { ok: boolean; blockedBySandbox?: boolean; reason?: string } {
  if (!renderedHtmlContent || !renderedHtmlContent.trim()) {
    return { ok: false, reason: "No label content generated to print." };
  }

  const pageWidthCss = isA4Sheet ? "210mm" : `${pageWidthMm}mm`;
  const pageHeightCss = isA4Sheet ? "297mm" : `${pageHeightMm}mm`;

  try {
    document.getElementById("pos-label-print-root")?.remove();
    document.getElementById("pos-label-print-style")?.remove();

    const styleEl = document.createElement("style");
    styleEl.id = "pos-label-print-style";
    styleEl.textContent = `
      @media screen {
        #pos-label-print-root { display: none !important; }
      }
      @media print {
        @page {
          size: ${pageWidthCss} ${pageHeightCss};
          margin: 0mm !important;
        }
        html, body {
          width: ${pageWidthCss} !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          background: #ffffff !important;
          color: #000000 !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
        body > *:not(#pos-label-print-root) { display: none !important; }
        #pos-label-print-root {
          display: block !important;
          width: ${pageWidthCss} !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          color: #000000 !important;
        }
        #pos-label-print-root * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #pos-label-print-root .label-print-page {
          width: ${pageWidthCss} !important;
          height: ${pageHeightCss} !important;
          page-break-after: always !important;
          break-after: page !important;
          overflow: hidden !important;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #ffffff !important;
        }
        #pos-label-print-root .label-print-page.label-dual-row {
          display: grid !important;
        }
        #pos-label-print-root .label-print-page:last-child {
          page-break-after: auto !important;
          break-after: auto !important;
        }
        #pos-label-print-root svg,
        #pos-label-print-root img {
          image-rendering: pixelated;
          shape-rendering: crispEdges;
        }
      }
    `;

    const portalEl = document.createElement("div");
    portalEl.id = "pos-label-print-root";
    portalEl.innerHTML = renderedHtmlContent;

    document.head.appendChild(styleEl);
    document.body.appendChild(portalEl);

    const prevTitle = document.title;
    if (jobTitle) document.title = jobTitle;

    let beforePrintFired = false;
    const onBeforePrint = () => {
      beforePrintFired = true;
    };
    const cleanupPortal = () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      portalEl.remove();
      styleEl.remove();
      document.title = prevTitle;
    };

    window.addEventListener("beforeprint", onBeforePrint, { once: true });
    window.addEventListener("afterprint", cleanupPortal, { once: true });
    setTimeout(cleanupPortal, 120000);

    const startedAt = Date.now();
    window.focus();
    window.print();
    const elapsed = Date.now() - startedAt;

    const inNestedFrame = typeof window !== "undefined" && window.self !== window.top;
    if (inNestedFrame && !beforePrintFired && elapsed < 15) {
      return {
        ok: false,
        blockedBySandbox: true,
        reason: "Embedded preview restricts direct printer dialogs. Open the Direct Label Print Window to print directly."
      };
    }

    return { ok: true };
  } catch (error: any) {
    console.error("Failed to execute thermal label print job:", error);
    return {
      ok: false,
      reason: error?.message || "Failed to invoke system label print dialog."
    };
  }
}

export function prepareLabelPrintStationSnapshot(
  renderedHtmlContent: string,
  dimension: LabelSizeDimension,
  jobTitle: string = "Expert POS Thermal Label Print",
  extra?: { rawCommands?: string; rawProtocol?: "ZPL" | "TSPL" }
): { jobId: string; snapshot: LabelPrintSnapshotPayload; printStationUrl: string } {
  const isA4Sheet = dimension.category === "sheet";
  const geo = getDualRollGeometry(dimension);
  const pageWidthMm = isA4Sheet ? 210 : geo.totalRollWidthMm;
  const pageHeightMm = isA4Sheet ? 297 : geo.heightMm;
  const jobId = `LBL-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const snapshot: LabelPrintSnapshotPayload = {
    jobId,
    kind: "label",
    html: renderedHtmlContent,
    layoutProfile: dimension.id,
    pageWidthMm,
    pageHeightMm,
    isA4Sheet,
    isDualRoll: geo.isDualRoll,
    presetName: dimension.name,
    jobTitle,
    rawCommands: extra?.rawCommands,
    rawProtocol: extra?.rawProtocol,
    createdAt: Date.now()
  };

  saveLabelPrintSnapshot(snapshot);
  sendLabelPrintSnapshotToServer(jobId, snapshot);
  const printStationUrl = buildStandaloneLabelPrintUrl(jobId, snapshot);

  return { jobId, snapshot, printStationUrl };
}

export function printThermalLabelsDirect(
  renderedHtmlContent: string,
  dimension: LabelSizeDimension,
  jobTitle: string = "Expert POS Thermal Label Print",
  extra?: { rawCommands?: string; rawProtocol?: "ZPL" | "TSPL" }
): DirectLabelPrintResult {
  const isA4Sheet = dimension.category === "sheet";
  const geo = getDualRollGeometry(dimension);
  const pageWidthMm = isA4Sheet ? 210 : geo.totalRollWidthMm;
  const pageHeightMm = isA4Sheet ? 297 : geo.heightMm;

  const { printStationUrl } = prepareLabelPrintStationSnapshot(renderedHtmlContent, dimension, jobTitle, extra);

  const printRes = printLabelHtmlSynchronously(
    renderedHtmlContent,
    pageWidthMm,
    pageHeightMm,
    isA4Sheet,
    jobTitle
  );

  return {
    ...printRes,
    printStationUrl
  };
}
