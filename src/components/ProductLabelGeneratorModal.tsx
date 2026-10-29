import React, { useState, useMemo } from "react";
import {
  Printer,
  Tag,
  Download,
  Copy,
  Check,
  X,
  Search,
  Sliders,
  CheckSquare,
  Square,
  ShoppingBag,
  Eye,
  Layers,
  Settings2,
  Cpu,
  FileCode,
  Zap,
  RotateCcw,
  Sparkles,
  QrCode,
  HelpCircle,
  HardDrive
} from "lucide-react";
import { Product, saveElementAsPDF } from "../types";
import {
  LABEL_SIZE_PRESETS,
  LabelSizePresetId,
  LabelSizeDimension,
  LabelPrinterModel,
  LabelDesignOptions,
  DEFAULT_LABEL_DESIGN_OPTIONS,
  generateBarcodeSvgString,
  generateQrCodeSvgString,
  generateZplCommands,
  generateTsplCommands,
  generateCalibrationTestZpl,
  generateCalibrationTestTspl,
  printThermalLabelsDirect
} from "../utils/labelPrinterEngine";

export interface ProductLabelGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialSelectedProduct?: Product | null;
  storeName?: string;
  currencySymbol?: string;
}

export const ProductLabelGeneratorModal: React.FC<ProductLabelGeneratorModalProps> = ({
  isOpen,
  onClose,
  products,
  initialSelectedProduct = null,
  storeName = "EXPERT POS HYPERMARKETS",
  currencySymbol = "₹"
}) => {
  if (!isOpen) return null;

  // Mode: "single" | "batch"
  const [mode, setMode] = useState<"single" | "batch">(
    initialSelectedProduct ? "single" : "single"
  );

  // Single Product Selection
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialSelectedProduct?.id || (products[0]?.id || "")
  );

  // Batch Multi-product selection IDs
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>(
    initialSelectedProduct ? [initialSelectedProduct.id] : products.slice(0, 10).map(p => p.id)
  );

  // Search filter for products
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Printer Hardware & Profile
  const [printerModel, setPrinterModel] = useState<LabelPrinterModel>("zebra-zpl");
  const [printerDpi, setPrinterDpi] = useState<203 | 300 | 600>(203);

  // Selected Preset
  const [selectedPresetId, setSelectedPresetId] = useState<LabelSizePresetId>("roll-50x25");
  const [customWidthMm, setCustomWidthMm] = useState<number>(50);
  const [customHeightMm, setCustomHeightMm] = useState<number>(25);
  const [customGapMm, setCustomGapMm] = useState<number>(3);

  // Copies per item
  const [copiesPerProduct, setCopiesPerProduct] = useState<number>(
    initialSelectedProduct ? 2 : 1
  );

  // Label Design Config
  const [designOptions, setDesignOptions] = useState<LabelDesignOptions>({
    ...DEFAULT_LABEL_DESIGN_OPTIONS,
    storeName: storeName || "EXPERT POS HYPERMARKETS",
    currencySymbol: currencySymbol || "₹",
    dpi: 203
  });

  // Active view tab in right panel: "preview" | "raw-code" | "hardware-guide"
  const [activeRightTab, setActiveRightTab] = useState<"preview" | "raw-code" | "hardware-guide">("preview");

  // Raw command modal view (ZPL / TSPL)
  const [rawProtocol, setRawProtocol] = useState<"ZPL" | "TSPL">("ZPL");

  // Live Toast / Notification feedback
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (text: string) => {
    setFeedbackMsg(text);
    setTimeout(() => setFeedbackMsg(null), 3200);
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Current active dimension
  const currentDimension: LabelSizeDimension = useMemo(() => {
    if (selectedPresetId === "custom") {
      return {
        id: "custom",
        name: `Custom (${customWidthMm}×${customHeightMm} mm)`,
        category: "custom",
        widthMm: customWidthMm,
        heightMm: customHeightMm,
        gapMm: customGapMm,
        columnsAcross: 1,
        description: "User Defined Custom Label Dimensions",
        recommendedFor: "Custom specialty label rolls"
      };
    }
    return (
      LABEL_SIZE_PRESETS.find(p => p.id === selectedPresetId) ||
      LABEL_SIZE_PRESETS[0]
    );
  }, [selectedPresetId, customWidthMm, customHeightMm, customGapMm]);

  // Filter products for dropdown / checklist
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryFilter === "ALL" || p.category === categoryFilter;
      if (!matchCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.barcode || "").toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery, categoryFilter]);

  const activeSingleProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0] || null;
  }, [products, selectedProductId]);

  // Build the list of labels to generate
  const labelQueue = useMemo(() => {
    const queue: { product: Product; quantity: number }[] = [];
    if (mode === "single" && activeSingleProduct) {
      queue.push({
        product: activeSingleProduct,
        quantity: Math.max(1, copiesPerProduct)
      });
    } else if (mode === "batch") {
      const selected = products.filter(p => selectedBatchIds.includes(p.id));
      selected.forEach(p => {
        queue.push({
          product: p,
          quantity: Math.max(1, copiesPerProduct)
        });
      });
    }
    return queue;
  }, [mode, activeSingleProduct, copiesPerProduct, products, selectedBatchIds]);

  // Flat list of individual label instances for preview
  const flatLabelsToRender = useMemo(() => {
    const list: Product[] = [];
    labelQueue.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        list.push(item.product);
      }
    });
    return list;
  }, [labelQueue]);

  // Toggle selection for batch checklist
  const handleToggleBatchItem = (id: string) => {
    if (selectedBatchIds.includes(id)) {
      setSelectedBatchIds(selectedBatchIds.filter(item => item !== id));
    } else {
      setSelectedBatchIds([...selectedBatchIds, id]);
    }
  };

  const handleSelectAllBatch = () => {
    setSelectedBatchIds(filteredProducts.map(p => p.id));
  };

  const handleDeselectAllBatch = () => {
    setSelectedBatchIds([]);
  };

  // Copy raw barcode value
  const handleCopyBarcode = (barcodeVal?: string) => {
    const code = barcodeVal || activeSingleProduct?.barcode || activeSingleProduct?.sku || "N/A";
    navigator.clipboard.writeText(code);
    showFeedback(`Copied Barcode: ${code}`);
  };

  // Generate Raw Commands string
  const currentRawCommands = useMemo(() => {
    if (rawProtocol === "ZPL") {
      return generateZplCommands(labelQueue, designOptions, currentDimension);
    } else {
      return generateTsplCommands(labelQueue, designOptions, currentDimension);
    }
  }, [rawProtocol, labelQueue, designOptions, currentDimension]);

  // Copy Raw Commands to clipboard
  const handleCopyRawCommands = () => {
    navigator.clipboard.writeText(currentRawCommands);
    showFeedback(`Copied ${rawProtocol} printer commands to clipboard!`);
  };

  // Download Raw Command File (.zpl or .tspl / .prn)
  const handleDownloadRawFile = () => {
    const ext = rawProtocol === "ZPL" ? "zpl" : "tspl";
    const blob = new Blob([currentRawCommands], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Labels-${rawProtocol}-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showFeedback(`Downloaded ${rawProtocol} command file! Ready to send to printer.`);
  };

  // Print Thermal Alignment & Calibration Test Label
  const handlePrintTestLabel = () => {
    const testHtml = `
      <div class="label-print-page" style="padding: 3mm; border: 1px dashed #000; text-align: center; height: 100%;">
        <div style="font-size: 10px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 1mm;">
          EXPERT POS THERMAL CALIBRATION
        </div>
        <div style="font-size: 8px; margin: 1.5mm 0; font-family: monospace;">
          Size: ${currentDimension.widthMm}×${currentDimension.heightMm}mm | DPI: ${designOptions.dpi} | Dark: ${designOptions.darkness}/15
        </div>
        <div style="margin: 1.5mm auto; width: 90%;">
          ${generateBarcodeSvgString("CALIB-OK-99", 32, true)}
        </div>
        <div style="font-size: 7.5px; font-family: monospace; border-top: 1px solid #000; padding-top: 1mm;">
          ALIGNMENT MARGINS &amp; TEAR-OFF TEST
        </div>
      </div>
    `;
    printThermalLabelsDirect(testHtml, currentDimension, "Expert POS Calibration Test");
    showFeedback("Spooling calibration label to printer...");
  };

  // Primary Action: Print Labels using direct thermal browser engine
  const handleDirectThermalPrint = () => {
    if (flatLabelsToRender.length === 0) {
      showFeedback("No labels selected to print.");
      return;
    }

    // Build the clean thermal page HTML
    const isA4Sheet = currentDimension.category === "sheet";

    let combinedHtml = "";

    if (isA4Sheet) {
      // Grid based for A4 sheet
      const cols = currentDimension.columnsAcross || 3;
      combinedHtml = `
        <div style="padding: 10mm 6mm; width: 210mm; min-height: 297mm; display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 2.5mm; box-sizing: border-box;">
          ${flatLabelsToRender.map(prod => renderSingleLabelHtml(prod, currentDimension, designOptions)).join("")}
        </div>
      `;
    } else {
      // Individual continuous roll pages
      combinedHtml = flatLabelsToRender
        .map(
          prod => `
          <div class="label-print-page" style="padding: 1.5mm 2.5mm; box-sizing: border-box;">
            ${renderSingleLabelHtml(prod, currentDimension, designOptions)}
          </div>
        `
        )
        .join("");
    }

    showFeedback(`Sending ${flatLabelsToRender.length} label(s) to ${currentDimension.name}...`);
    printThermalLabelsDirect(combinedHtml, currentDimension, `Expert POS Labels (${flatLabelsToRender.length})`);
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    showFeedback("Generating printable PDF document...");
    const name = `Product-Labels-${currentDimension.id}-${Date.now()}.pdf`;
    await saveElementAsPDF("product-label-preview-container", name, "standard-a4");
    showFeedback(`Downloaded PDF: ${name}`);
  };

  // Helper: Renders pure HTML string for a single label (used by iframe direct print)
  function renderSingleLabelHtml(
    prod: Product,
    dim: LabelSizeDimension,
    opt: LabelDesignOptions
  ): string {
    const barcodeVal = prod.barcode || prod.sku;
    const hasMrp = prod.mrp && prod.mrp > prod.price;
    const disc = hasMrp ? Math.round(((prod.mrp! - prod.price) / prod.mrp!) * 100) : 0;

    const barcodeSvg =
      opt.barcodeType === "QR"
        ? generateQrCodeSvgString(barcodeVal, 48)
        : generateBarcodeSvgString(barcodeVal, dim.heightMm > 35 ? 42 : 30, opt.showBarcodeText);

    return `
      <div style="border: 0.5px solid #000; border-radius: 2px; padding: 1.5mm; background: #fff; color: #000; display: flex; flex-direction: column; justify-content: space-between; height: 100%; box-sizing: border-box; overflow: hidden; font-family: -apple-system, sans-serif;">
        ${
          opt.showStoreName
            ? `<div style="text-align: center; font-size: 7.5px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; border-bottom: 0.5px solid #000; padding-bottom: 0.5mm; margin-bottom: 0.5mm;">
                ${opt.storeName}
              </div>`
            : ""
        }
        ${
          opt.customPromoText.trim()
            ? `<div style="background: #000; color: #fff; font-size: 6.5px; font-weight: bold; text-align: center; text-transform: uppercase; padding: 0.5mm 0; margin-bottom: 0.5mm;">
                ${opt.customPromoText}
              </div>`
            : ""
        }
        ${
          opt.showProductName
            ? `<div style="text-align: center; font-size: 8.5px; font-weight: 800; line-height: 1.1; margin: 0.5mm 0; max-height: 18px; overflow: hidden;">
                ${prod.name}
              </div>`
            : ""
        }
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin: 0.5mm 0;">
          <div>
            ${
              opt.showMrp && hasMrp
                ? `<span style="font-size: 7px; text-decoration: line-through; color: #555; font-family: monospace;">MRP:${opt.currencySymbol}${prod.mrp?.toFixed(2)}</span>`
                : ""
            }
            <div style="font-size: 11px; font-weight: 900; font-family: monospace; line-height: 1;">
              ${opt.currencySymbol}${prod.price.toFixed(2)}
              <span style="font-size: 7px; font-weight: normal;">/${prod.unit || "Unit"}</span>
            </div>
          </div>
          ${
            opt.showSavingsBadge && disc > 0
              ? `<div style="background: #000; color: #fff; font-size: 7px; font-weight: bold; font-family: monospace; padding: 0.5mm 1mm; border-radius: 1px;">
                  ${disc}% OFF
                </div>`
              : ""
          }
        </div>
        ${
          opt.showBarcodeGraphic
            ? `<div style="margin: 0.5mm auto; width: 100%; text-align: center;">
                ${barcodeSvg}
              </div>`
            : ""
        }
        <div style="display: flex; justify-content: space-between; font-size: 6.5px; font-family: monospace; color: #333; border-top: 0.5px solid #ddd; padding-top: 0.5mm; margin-top: 0.5mm;">
          ${opt.showSku ? `<span>SKU: ${prod.sku}</span>` : ""}
          ${opt.showBatchNo && prod.batchNumber ? `<span>B: ${prod.batchNumber}</span>` : ""}
          ${opt.showExpiryDate && prod.expiryDate ? `<span>EXP: ${prod.expiryDate}</span>` : ""}
        </div>
      </div>
    `;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-sans">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold font-display tracking-tight text-white">
                  Universal Label &amp; Barcode Printer Studio
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold uppercase border border-emerald-500/40">
                  Thermal &amp; A4 Engine
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Direct printing support for Zebra (ZPL), TSC / TVS / Xprinter (TSPL), Epson, Dymo &amp; standard laser/inkjet sticker sheets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintTestLabel}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold rounded-lg border border-purple-500/30 transition-colors cursor-pointer"
              title="Prints a test calibration label to check alignment and darkness"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              Calibration Test Print
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Split: Controls (Left 5 Cols) + Live Workspace (Right 7 Cols) */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          
          {/* LEFT CONTROLS (5 cols) */}
          <div className="col-span-12 lg:col-span-5 border-r border-slate-200 bg-slate-50/70 p-4 sm:p-5 overflow-y-auto space-y-4">
            
            {/* Step 1: Printer Hardware & Dimension Preset */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-purple-600" />
                  1. Label Printer &amp; Roll Preset
                </label>
                <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {currentDimension.widthMm} × {currentDimension.heightMm} mm
                </span>
              </div>

              {/* Hardware Profile Picker */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Target Printer Model</label>
                  <select
                    value={printerModel}
                    onChange={(e) => {
                      const val = e.target.value as LabelPrinterModel;
                      setPrinterModel(val);
                      if (val === "zebra-zpl" || val === "citizen-cl") setRawProtocol("ZPL");
                      if (val === "tsc-tspl" || val === "tvs-lp46" || val === "xprinter-xp") setRawProtocol("TSPL");
                      if (val === "laser-a4") setSelectedPresetId("a4-sheet-24");
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
                  >
                    <option value="zebra-zpl">Zebra (ZD220, ZD230, ZD420, ZT230) - ZPL</option>
                    <option value="tsc-tspl">TSC (TE244, TTP-244, DA210) - TSPL</option>
                    <option value="tvs-lp46">TVS Electronics (LP 46 Neo / Lite) - TSPL</option>
                    <option value="xprinter-xp">Xprinter (XP-420B, XP-365B) - TSPL</option>
                    <option value="citizen-cl">Citizen (CL-S621, CL-E300)</option>
                    <option value="epson-tm">Epson (TM-L90, TM-L100)</option>
                    <option value="rollo-usb">Rollo Commercial Printer</option>
                    <option value="dymo-lw">Dymo (LabelWriter 450/550)</option>
                    <option value="laser-a4">Standard Laser / Inkjet (A4 Sheets)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Resolution (DPI)</label>
                  <select
                    value={printerDpi}
                    onChange={(e) => {
                      const dpiVal = Number(e.target.value) as 203 | 300 | 600;
                      setPrinterDpi(dpiVal);
                      setDesignOptions({ ...designOptions, dpi: dpiVal });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
                  >
                    <option value={203}>203 DPI (Standard Thermal 8 dots/mm)</option>
                    <option value={300}>300 DPI (High-Definition 12 dots/mm)</option>
                    <option value={600}>600 DPI (Ultra Fine 24 dots/mm)</option>
                  </select>
                </div>
              </div>

              {/* Label Preset Selection */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Label Dimension Preset</label>
                <select
                  value={selectedPresetId}
                  onChange={(e) => setSelectedPresetId(e.target.value as LabelSizePresetId)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-2.5 text-xs font-bold text-slate-900 outline-none focus:border-purple-600 cursor-pointer"
                >
                  <optgroup label="Direct Thermal Roll Presets (Continuous / Gap)">
                    <option value="roll-50x25">50 × 25 mm (2" × 1") - Standard Retail Shelf Tag</option>
                    <option value="roll-38x25">38 × 25 mm (1.5" × 1") - Compact Item Sticker</option>
                    <option value="roll-50x30">50 × 30 mm - Grocery &amp; Deli Shelf Roll</option>
                    <option value="roll-75x50">75 × 50 mm (3" × 2") - Medium Box / Apparel Tag</option>
                    <option value="roll-100x50">100 × 50 mm (4" × 2") - Shelf Talker &amp; Bin Tag</option>
                    <option value="roll-100x150">100 × 150 mm (4" × 6") - Shipping &amp; Pallet Label</option>
                    <option value="dual-roll-38x25">2-Up Dual Roll (2 × 38×25 mm across 80mm roll)</option>
                    <option value="jewelry-32x19">Jewelry Tag (32 × 19 mm Dumbbell Foldable)</option>
                  </optgroup>
                  <optgroup label="Laser &amp; Inkjet A4 Sheets">
                    <option value="a4-sheet-24">A4 Sheet: 24 Labels (70 × 37 mm, 3 cols × 8 rows)</option>
                    <option value="a4-sheet-40">A4 Sheet: 40 Labels (52.5 × 29.7 mm, 4 cols × 10 rows)</option>
                    <option value="a4-sheet-65">A4 Sheet: 65 Labels (38.1 × 21.2 mm, 5 cols × 13 rows)</option>
                  </optgroup>
                  <optgroup label="Custom Sizing">
                    <option value="custom">Custom Dimensions (Set Width, Height &amp; Gap)</option>
                  </optgroup>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">{currentDimension.description}</p>
              </div>

              {/* Custom Dimensions Editor */}
              {selectedPresetId === "custom" && (
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-purple-50/60 rounded-lg border border-purple-200">
                  <div>
                    <label className="text-[10px] font-bold text-purple-900 block">Width (mm)</label>
                    <input
                      type="number"
                      min={15}
                      max={220}
                      value={customWidthMm}
                      onChange={(e) => setCustomWidthMm(Math.max(10, parseInt(e.target.value) || 50))}
                      className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-purple-900 block">Height (mm)</label>
                    <input
                      type="number"
                      min={10}
                      max={350}
                      value={customHeightMm}
                      onChange={(e) => setCustomHeightMm(Math.max(10, parseInt(e.target.value) || 25))}
                      className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-purple-900 block">Gap (mm)</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.5}
                      value={customGapMm}
                      onChange={(e) => setCustomGapMm(Math.max(0, parseFloat(e.target.value) || 3))}
                      className="w-full bg-white border border-purple-300 rounded px-2 py-1 text-xs font-bold text-center"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Selection Mode & Products */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  2. Select Products to Print
                </label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMode("single")}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      mode === "single" ? "bg-white text-purple-700 shadow-2xs" : "text-slate-500"
                    }`}
                  >
                    Single
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("batch")}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      mode === "batch" ? "bg-white text-purple-700 shadow-2xs" : "text-slate-500"
                    }`}
                  >
                    Bulk ({selectedBatchIds.length})
                  </button>
                </div>
              </div>

              {mode === "single" ? (
                <div className="space-y-2">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-2.5 text-xs font-bold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.sku}] {p.name} — {currencySymbol}{p.price.toFixed(2)}
                      </option>
                    ))}
                  </select>

                  {activeSingleProduct && (
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">{activeSingleProduct.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Barcode: {activeSingleProduct.barcode || activeSingleProduct.sku} | Unit: {activeSingleProduct.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-black text-emerald-600 text-sm">
                          {currencySymbol}{activeSingleProduct.price.toFixed(2)}
                        </div>
                        {activeSingleProduct.mrp && activeSingleProduct.mrp > activeSingleProduct.price && (
                          <div className="text-[10px] text-slate-400 line-through font-mono">
                            MRP: {currencySymbol}{activeSingleProduct.mrp.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Filter by name, barcode, SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 border border-slate-300 rounded-lg text-xs outline-none bg-slate-50"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                    </div>

                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 outline-none font-semibold"
                    >
                      <option value="ALL">All Categories</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between items-center text-[10px] px-1">
                    <span className="text-slate-500 font-bold">
                      {selectedBatchIds.length} of {filteredProducts.length} selected
                    </span>
                    <div className="flex gap-2 font-bold">
                      <button
                        type="button"
                        onClick={handleSelectAllBatch}
                        className="text-purple-600 hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={handleDeselectAllBatch}
                        className="text-slate-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
                    {filteredProducts.map(p => {
                      const checked = selectedBatchIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleToggleBatchItem(p.id)}
                          className={`p-2 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                            checked ? "bg-purple-50/70" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {checked ? (
                              <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <div className="truncate">
                              <span className="font-bold text-slate-800 truncate block">{p.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {p.sku} | {p.barcode}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-slate-900 shrink-0 ml-2">
                            {currencySymbol}{p.price.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Copies Count */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600">
                  {mode === "single" ? "Copies to Print" : "Copies per Product"}
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={copiesPerProduct}
                    onChange={(e) => setCopiesPerProduct(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-center outline-none bg-slate-50"
                  />
                  <div className="flex gap-1">
                    {[1, 5, 24, 50].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCopiesPerProduct(num)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          copiesPerProduct === num
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {num}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Content Customization & Field Toggles */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-600" />
                3. Label Elements &amp; Symbology
              </label>

              {/* Barcode Type Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                {[
                  { id: "CODE128", label: "Code 128 (1D)" },
                  { id: "EAN13", label: "EAN-13 (Retail)" },
                  { id: "QR", label: "QR Code (2D)" }
                ].map((bType) => (
                  <button
                    key={bType.id}
                    type="button"
                    onClick={() => setDesignOptions({ ...designOptions, barcodeType: bType.id as any })}
                    className={`py-1 px-2 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      designOptions.barcodeType === bType.id
                        ? "bg-white text-purple-700 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {bType.label}
                  </button>
                ))}
              </div>

              {/* Toggles Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={designOptions.showStoreName}
                    onChange={(e) => setDesignOptions({ ...designOptions, showStoreName: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-0"
                  >
                  </input>
                  <span>Store Name Header</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={designOptions.showMrp}
                    onChange={(e) => setDesignOptions({ ...designOptions, showMrp: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-0"
                  >
                  </input>
                  <span>Show MRP Strikethrough</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={designOptions.showSavingsBadge}
                    onChange={(e) => setDesignOptions({ ...designOptions, showSavingsBadge: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-0"
                  >
                  </input>
                  <span>Savings % Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={designOptions.showBarcodeGraphic}
                    onChange={(e) => setDesignOptions({ ...designOptions, showBarcodeGraphic: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-0"
                  >
                  </input>
                  <span>Barcode Symbol</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={designOptions.showBatchNo}
                    onChange={(e) => setDesignOptions({ ...designOptions, showBatchNo: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-0"
                  >
                  </input>
                  <span>Batch Number</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={designOptions.showExpiryDate}
                    onChange={(e) => setDesignOptions({ ...designOptions, showExpiryDate: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-0"
                  >
                  </input>
                  <span>Expiry Date</span>
                </label>
              </div>

              {/* Darkness / Density Slider */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1">
                  <span>Thermal Print Density / Darkness</span>
                  <span className="font-mono text-purple-600">{designOptions.darkness} / 15</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={designOptions.darkness}
                  onChange={(e) => setDesignOptions({ ...designOptions, darkness: parseInt(e.target.value) || 10 })}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Promotional Ribbon Text */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  Custom Promo Banner / Tagline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SPECIAL OFFER, SUPERMARKET DEAL, FSSAI: 100..."
                  value={designOptions.customPromoText}
                  onChange={(e) => setDesignOptions({ ...designOptions, customPromoText: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-purple-600 font-sans bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* RIGHT LIVE WORKSPACE (7 cols) */}
          <div className="col-span-12 lg:col-span-7 bg-slate-100/90 p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
            
            {/* Upper View Switcher Bar */}
            <div className="flex justify-between items-center mb-3 shrink-0">
              <div className="flex bg-slate-200 p-0.5 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => setActiveRightTab("preview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeRightTab === "preview" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  Live Label Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRightTab("raw-code")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeRightTab === "raw-code" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-600" />
                  Raw Printer Commands
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRightTab("hardware-guide")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeRightTab === "hardware-guide" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                  Hardware Guide
                </button>
              </div>

              {feedbackMsg && (
                <div className="bg-slate-900 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold shadow-md animate-fadeIn flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  {feedbackMsg}
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-inner relative flex flex-col justify-start">
              
              {activeRightTab === "preview" && (
                <div id="product-label-preview-container" className="w-full space-y-4">
                  {/* Summary Ribbon */}
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">
                      Total Output: <span className="text-purple-600 font-mono font-black">{flatLabelsToRender.length}</span> labels
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Target Paper: {currentDimension.name} ({currentDimension.widthMm}×{currentDimension.heightMm} mm)
                    </span>
                  </div>

                  {/* Rendered Preview Grid */}
                  <div
                    className={`grid gap-3 w-full ${
                      currentDimension.category === "sheet"
                        ? "grid-cols-2 sm:grid-cols-3"
                        : currentDimension.widthMm <= 40
                        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                        : currentDimension.widthMm <= 60
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {flatLabelsToRender.map((product, idx) => {
                      const hasMrp = product.mrp && product.mrp > product.price;
                      const discountPercent = hasMrp
                        ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
                        : 0;
                      const barcodeVal = product.barcode || product.sku;

                      return (
                        <div
                          key={`${product.id}-${idx}`}
                          className="border border-stone-300 rounded-lg bg-white p-3 flex flex-col justify-between overflow-hidden shadow-2xs hover:border-purple-400 transition-colors"
                          style={{
                            minHeight: currentDimension.heightMm > 40 ? "160px" : "120px"
                          }}
                        >
                          {/* Store Name */}
                          {designOptions.showStoreName && (
                            <div className="text-center border-b border-stone-200 pb-1 mb-1">
                              <div className="text-[9px] font-black uppercase tracking-tight font-display text-stone-900 leading-none">
                                {designOptions.storeName}
                              </div>
                            </div>
                          )}

                          {/* Promo Banner */}
                          {designOptions.customPromoText.trim() && (
                            <div className="bg-slate-900 text-white text-[8px] font-bold uppercase tracking-wider text-center py-0.5 rounded-xs my-0.5">
                              {designOptions.customPromoText}
                            </div>
                          )}

                          {/* Product Title */}
                          {designOptions.showProductName && (
                            <div className="text-center my-0.5">
                              <div className="text-[11px] font-extrabold text-stone-900 leading-tight line-clamp-2">
                                {product.name}
                              </div>
                            </div>
                          )}

                          {/* Price Row */}
                          <div className="flex items-center justify-between my-1 px-1">
                            <div>
                              {designOptions.showMrp && hasMrp && (
                                <div className="text-[9px] text-stone-400 line-through font-mono leading-none">
                                  MRP: {currencySymbol}{product.mrp?.toFixed(2)}
                                </div>
                              )}
                              <div className="text-sm font-black font-mono text-stone-950 leading-none mt-0.5">
                                {currencySymbol}{product.price.toFixed(2)}
                                <span className="text-[9px] font-normal text-stone-500 ml-1">
                                  /{product.unit || "Unit"}
                                </span>
                              </div>
                            </div>

                            {designOptions.showSavingsBadge && hasMrp && discountPercent > 0 && (
                              <div className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded">
                                {discountPercent}% OFF
                              </div>
                            )}
                          </div>

                          {/* Barcode / QR Element */}
                          {designOptions.showBarcodeGraphic && (
                            <div className="my-1 flex flex-col items-center">
                              {designOptions.barcodeType === "QR" ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: generateQrCodeSvgString(barcodeVal, 48)
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-full"
                                  dangerouslySetInnerHTML={{
                                    __html: generateBarcodeSvgString(
                                      barcodeVal,
                                      currentDimension.heightMm > 35 ? 40 : 28,
                                      designOptions.showBarcodeText
                                    )
                                  }}
                                />
                              )}
                            </div>
                          )}

                          {/* Footer with SKU & Expiry */}
                          <div className="flex justify-between items-center text-[8px] font-mono text-stone-500 border-t border-stone-100 pt-1 mt-0.5">
                            {designOptions.showSku && <span>SKU: {product.sku}</span>}
                            {designOptions.showBatchNo && product.batchNumber && <span>B:{product.batchNumber}</span>}
                            {designOptions.showExpiryDate && product.expiryDate && <span>EXP:{product.expiryDate}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeRightTab === "raw-code" && (
                <div className="w-full space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setRawProtocol("ZPL")}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          rawProtocol === "ZPL" ? "bg-white text-purple-700 shadow-2xs" : "text-slate-600"
                        }`}
                      >
                        Zebra ZPL II (^XA...^XZ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRawProtocol("TSPL")}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                          rawProtocol === "TSPL" ? "bg-white text-purple-700 shadow-2xs" : "text-slate-600"
                        }`}
                      >
                        TSC / TVS / Xprinter TSPL (SIZE...PRINT)
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCopyRawCommands}
                        className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Code
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadRawFile}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download .{rawProtocol.toLowerCase()}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Send these commands directly to your network label printer (Raw Port 9100) or via Zebra Setup Utilities / TSC Diagnostic Tool:
                  </p>

                  <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-[420px] select-all leading-relaxed">
                    {currentRawCommands}
                  </pre>
                </div>
              )}

              {activeRightTab === "hardware-guide" && (
                <div className="space-y-4 text-xs text-slate-700">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    How to Connect &amp; Print to Industrial Label Printers
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                        Method 1: Direct Browser Print (Recommended)
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Click <strong>"Print to Label Printer"</strong> below. In the system print dialog:
                      </p>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                        <li>Select your label printer (Zebra, TSC, TVS, Rollo, Dymo).</li>
                        <li>Set Paper Size to matching preset (e.g. 50×25mm or 2"×1").</li>
                        <li>Set Margins to <strong>None</strong>.</li>
                        <li>Uncheck <strong>Headers and Footers</strong>.</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Method 2: Network TCP Port 9100 / Raw Socket
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        For Ethernet / Wi-Fi thermal printers, download the .zpl or .tspl file and transmit directly:
                      </p>
                      <code className="block p-1.5 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded">
                        nc -w 2 192.168.1.200 9100 &lt; Labels-ZPL.zpl
                      </code>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        Method 3: Zebra Setup Utilities / TSC Diagnostic
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Open manufacturer utility tool &gt; "Send File" &gt; select the downloaded .zpl or .tspl file for instant 100% hardware-rendered printing.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        Method 4: Laser / Inkjet A4 Sticker Sheets
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Select <strong>A4 Sheet 24-Up</strong> or <strong>40-Up</strong> preset, load Avery or compatible adhesive sheets into your standard office laser printer, and print!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Modal Action Bar */}
            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyBarcode()}
                  className="px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Barcode
                </button>
                <button
                  type="button"
                  onClick={handleDownloadRawFile}
                  className="px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-600" />
                  Export {rawProtocol} File
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-200/50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={handleDirectThermalPrint}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                >
                  <Printer className="w-4 h-4" />
                  Print to Label Printer ({flatLabelsToRender.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
