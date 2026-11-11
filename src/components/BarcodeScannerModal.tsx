import React, { useState, useRef, useEffect } from "react";
import { Product, MeasurementUnit } from "../types";
import { 
  Scan, 
  Upload, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Package, 
  History, 
  X,
  Keyboard,
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign,
  AlertCircle,
  Clock,
  Layers,
  RefreshCw,
  Building2,
  Barcode
} from "lucide-react";
import { 
  resolveAutoScannedProduct, 
  QUICK_FILL_PRESET_TEMPLATES 
} from "../utils/productCatalogResolver";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  activeTenantId: string;
  productCategories: string[];
  suppliers: Array<{ id: string; name: string }>;
  onSaveProduct: (product: Product) => Promise<boolean>;
  onBulkUploadProducts: (products: Product[]) => Promise<boolean>;
  triggerNotification: (msg: string, type: "success" | "warning" | "error" | "info") => void;
  initialScannedBarcode?: string;
}

interface ScanLogEntry {
  id: string;
  timestamp: string;
  barcode: string;
  productName: string;
  action: "UPDATED" | "REGISTERED" | "RESTOCKED";
  quantity: number;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  activeTenantId,
  productCategories,
  suppliers,
  onSaveProduct,
  onBulkUploadProducts,
  triggerNotification,
  initialScannedBarcode
}) => {
  const [activeTab, setActiveTab] = useState<"scan" | "bulk" | "history">("scan");
  const [scannedInput, setScannedInput] = useState<string>("");
  const [activeBarcode, setActiveBarcode] = useState<string>("");
  const [isExistingProduct, setIsExistingProduct] = useState<boolean>(false);
  const [matchedProductId, setMatchedProductId] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanLogEntry[]>([]);

  // Comprehensive Product Details State (Displayed and fully modifiable)
  const [name, setName] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [category, setCategory] = useState<string>(productCategories[0] || "Grains & Grocery");
  const [unit, setUnit] = useState<MeasurementUnit>(MeasurementUnit.PIECE);
  const [unitQuantity, setUnitQuantity] = useState<number>(1);
  const [purchasePrice, setPurchasePrice] = useState<number>(50);
  const [mrp, setMrp] = useState<number>(85);
  const [price, setPrice] = useState<number>(75);
  const [stock, setStock] = useState<number>(50);
  const [minStockAlert, setMinStockAlert] = useState<number>(10);
  const [gstRate, setGstRate] = useState<number>(5);
  const [batchNumber, setBatchNumber] = useState<string>("B-2026-X1");
  const [expiryDate, setExpiryDate] = useState<string>("2027-12-31");
  const [supplierName, setSupplierName] = useState<string>(suppliers[0]?.name || "Apex Retail Supplies");

  const scanInputRef = useRef<HTMLInputElement>(null);

  // Audio feedback synthesizer
  const playScanBeep = (isSuccess = true) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(isSuccess ? 2200 : 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio context might be restricted
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scanInputRef.current?.focus();
      }, 100);
      if (initialScannedBarcode) {
        processBarcode(initialScannedBarcode);
      }
    } else {
      resetScanForm();
    }
  }, [isOpen, initialScannedBarcode]);

  const resetScanForm = () => {
    setScannedInput("");
    setActiveBarcode("");
    setIsExistingProduct(false);
    setMatchedProductId(null);
    setName("");
    setSku("");
    setCategory(productCategories[0] || "Grains & Grocery");
    setUnit(MeasurementUnit.PIECE);
    setUnitQuantity(1);
    setPurchasePrice(50);
    setMrp(85);
    setPrice(75);
    setStock(50);
    setMinStockAlert(10);
    setGstRate(5);
    setBatchNumber("B-2026-X1");
    setExpiryDate("2027-12-31");
    setSupplierName(suppliers[0]?.name || "Apex Retail Supplies");
  };

  // Adjust unit quantity defaults when unit changes
  const handleUnitChange = (newUnit: MeasurementUnit) => {
    setUnit(newUnit);
    if (newUnit === MeasurementUnit.GRAM) {
      setUnitQuantity(500);
    } else if (newUnit === MeasurementUnit.ML) {
      setUnitQuantity(250);
    } else if (newUnit === MeasurementUnit.KG) {
      setUnitQuantity(1);
    } else if (newUnit === MeasurementUnit.LITER) {
      setUnitQuantity(1);
    } else if (newUnit === MeasurementUnit.PIECE) {
      setUnitQuantity(1);
    } else if (newUnit === MeasurementUnit.PACK) {
      setUnitQuantity(1);
    }
  };

  // Process barcode lookup & automatically populate ALL product details
  const processBarcode = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setActiveBarcode(trimmed);

    // Automatically resolve all product details from active inventory, master retail catalog, or smart generator
    const resolved = resolveAutoScannedProduct(trimmed, products, productCategories, suppliers as any);

    setIsExistingProduct(resolved.isExisting);
    setMatchedProductId(resolved.id || null);
    setName(resolved.name);
    setSku(resolved.sku);
    setCategory(resolved.category);
    setUnit(resolved.unit);
    setUnitQuantity(resolved.unitQuantity);
    setPurchasePrice(resolved.purchasePrice);
    setMrp(resolved.mrp);
    setPrice(resolved.price);
    setStock(resolved.stock);
    setMinStockAlert(resolved.minStockAlert);
    setGstRate(resolved.gstRate);
    setBatchNumber(resolved.batchNumber);
    setExpiryDate(resolved.expiryDate);
    setSupplierName(resolved.supplierName);

    playScanBeep(true);

    if (resolved.isExisting) {
      triggerNotification(
        `✓ Product "${resolved.name}" details loaded automatically. You can view & modify any details before saving.`,
        "success"
      );
    } else {
      triggerNotification(
        `✓ Scanned [${trimmed}]: Product details ("${resolved.name}") displayed automatically. View & modify before saving.`,
        "success"
      );
    }
  };

  // Quick preset template application
  const applyPresetTemplate = (tmpl: typeof QUICK_FILL_PRESET_TEMPLATES[0]) => {
    setName(tmpl.name);
    setSku(tmpl.sku || `SKU-${activeBarcode.slice(-6) || Math.floor(1000 + Math.random() * 9000)}`);
    setCategory(tmpl.category);
    setUnit(tmpl.unit);
    setUnitQuantity(tmpl.unitQuantity);
    setPurchasePrice(tmpl.cost);
    setMrp(tmpl.mrp);
    setPrice(tmpl.price);
    setGstRate(tmpl.gst);
    triggerNotification(`✓ Applied template "${tmpl.name}". You can view and edit any details before saving.`, "info");
  };

  const handleScanInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processBarcode(scannedInput);
    setScannedInput("");
  };

  // Quick stock increase buttons (+5, +10, +25, +50, +100)
  const handleAddStock = (amount: number) => {
    setStock((prev) => Math.max(0, Number(prev || 0) + amount));
    triggerNotification(`Added +${amount} units to stock count (New total: ${Number(stock || 0) + amount})`, "info");
  };

  // Save or update product details
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerNotification("Product description name is required.", "warning");
      return;
    }
    if (!sku.trim()) {
      triggerNotification("SKU Code is required.", "warning");
      return;
    }

    const payload: Product = {
      id: matchedProductId || `PROD-${Date.now()}`,
      name: name.trim(),
      barcode: activeBarcode,
      sku: sku.trim(),
      category,
      unit,
      unitQuantity: Number(unitQuantity) || 1,
      unitLabel: `${Number(unitQuantity) || 1} ${unit}`,
      purchasePrice: Number(purchasePrice) || 0,
      mrp: Number(mrp) || Number(price),
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      minStockAlert: Number(minStockAlert) || 5,
      gstRate: Number(gstRate) || 0,
      batchNumber: batchNumber.trim() || `B-${new Date().getFullYear()}`,
      expiryDate: expiryDate || "2027-12-31",
      supplierName: supplierName || (suppliers[0]?.name || "Apex Retail Supplies"),
      tenantId: activeTenantId
    };

    const success = await onSaveProduct(payload);
    if (success) {
      playScanBeep(true);
      setScanHistory((prev) => [
        {
          id: `SCAN-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          barcode: activeBarcode,
          productName: name.trim(),
          action: isExistingProduct ? "UPDATED" : "REGISTERED",
          quantity: Number(stock)
        },
        ...prev
      ]);

      triggerNotification(
        isExistingProduct 
          ? `✓ Product "${name.trim()}" successfully updated with new details!`
          : `✓ Product "${name.trim()}" registered into catalogue with barcode [${activeBarcode}]!`,
        "success"
      );

      // Reset to be ready for next barcode
      resetScanForm();
      setTimeout(() => scanInputRef.current?.focus(), 150);
    } else {
      triggerNotification("Failed to save product details to catalogue.", "error");
    }
  };

  // CSV Bulk Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          triggerNotification("CSV file does not contain valid data rows.", "warning");
          return;
        }

        const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, "").toLowerCase());
        const barcodeIdx = headers.findIndex(h => h.includes("barcode") || h.includes("upc") || h.includes("code"));
        const nameIdx = headers.findIndex(h => h.includes("name") || h.includes("title") || h.includes("desc"));
        const priceIdx = headers.findIndex(h => h === "price" || h.includes("selling") || h.includes("rate"));
        const costIdx = headers.findIndex(h => h.includes("purchase") || h.includes("cost") || h.includes("cogs"));
        const mrpIdx = headers.findIndex(h => h.includes("mrp"));
        const stockIdx = headers.findIndex(h => h.includes("stock") || h.includes("qty") || h.includes("quantity"));
        const unitIdx = headers.findIndex(h => h.includes("unit"));
        const unitQtyIdx = headers.findIndex(h => h.includes("unitquantity") || h.includes("measure") || h.includes("packsize"));
        const catIdx = headers.findIndex(h => h.includes("category") || h.includes("bracket"));

        const parsedProducts: Product[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(",").map(cell => cell.trim().replace(/^["']|["']$/g, ""));
          if (!row[0]) continue;

          const barcodeVal = barcodeIdx >= 0 ? row[barcodeIdx] : `PRE-${100000 + i}`;
          const nameVal = nameIdx >= 0 ? row[nameIdx] : `Retail Item ${i}`;
          const priceVal = priceIdx >= 0 ? Number(row[priceIdx]) || 100 : 100;
          const costVal = costIdx >= 0 ? Number(row[costIdx]) || priceVal * 0.7 : priceVal * 0.7;
          const mrpVal = mrpIdx >= 0 ? Number(row[mrpIdx]) || priceVal * 1.15 : priceVal * 1.15;
          const stockVal = stockIdx >= 0 ? Number(row[stockIdx]) || 50 : 50;
          const unitRaw = unitIdx >= 0 ? row[unitIdx] : "Pieces";
          const unitQtyVal = unitQtyIdx >= 0 ? Number(row[unitQtyIdx]) || 1 : 1;
          const categoryVal = catIdx >= 0 ? row[catIdx] : "Grains & Grocery";

          let unitVal: MeasurementUnit = MeasurementUnit.PIECE;
          const uLower = unitRaw.toLowerCase();
          if (uLower.includes("kg") || uLower.includes("kilo")) unitVal = MeasurementUnit.KG;
          else if (uLower.includes("ml") || uLower.includes("milli")) unitVal = MeasurementUnit.ML;
          else if (uLower.includes("gram") || uLower === "g") unitVal = MeasurementUnit.GRAM;
          else if (uLower.includes("liter") || uLower === "l") unitVal = MeasurementUnit.LITER;
          else if (uLower.includes("pack") || uLower === "pk") unitVal = MeasurementUnit.PACK;

          parsedProducts.push({
            id: `PROD-CSV-${Date.now()}-${i}`,
            name: nameVal,
            barcode: barcodeVal,
            sku: `SKU-${barcodeVal.slice(-6) || i}`,
            category: categoryVal,
            unit: unitVal,
            unitQuantity: unitQtyVal,
            unitLabel: `${unitQtyVal} ${unitVal}`,
            purchasePrice: costVal,
            price: priceVal,
            mrp: mrpVal,
            gstRate: 5,
            stock: stockVal,
            minStockAlert: 10,
            batchNumber: "B-BULK-2026",
            expiryDate: "2027-12-31",
            supplierName: suppliers[0]?.name || "Apex Retail Supplies",
            tenantId: activeTenantId
          });
        }

        if (parsedProducts.length > 0) {
          const ok = await onBulkUploadProducts(parsedProducts);
          if (ok) {
            triggerNotification(`✓ Successfully uploaded ${parsedProducts.length} pre-printed barcode products!`, "success");
            onClose();
          }
        }
      } catch (err) {
        triggerNotification("Failed to parse barcode CSV file.", "error");
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleTemplate = () => {
    const csvContent = 
      "Barcode,Name,Category,Unit,UnitQuantity,PurchasePrice,MRP,SellingPrice,Stock,MinStockAlert,BatchNumber,ExpiryDate,SupplierName\n" +
      '8901031200051,"Golden Delicious Apples (Imported)","Fresh Fruits & Vegetables","Kg",1,120,200,180,75,20,"B-APL-05A","2026-06-15","Organica Green Farm Producers"\n' +
      '8901262010115,"Classic Salted Butter 500g","Dairy & Eggs","Grams",500,210,299,260,48,15,"MFT-BUT-C6","2026-08-10","Supreme Agro Foods Ltd."\n' +
      '8901262020213,"Full Cream Milk 1L Tetra","Dairy & Eggs","Liters",1,62,85,78,35,10,"MFT-MLK-M1","2026-07-20","Supreme Agro Foods Ltd."\n' +
      '8904000100018,"Whole Wheat Atta 10Kg","Grains & Grocery","Kg",10,380,520,460,60,15,"B-ATT-2026","2027-05-15","Supreme Agro Foods Ltd."';

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "preprinted_barcode_product_catalog_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification("Downloaded pre-printed barcode catalog template CSV.", "success");
  };

  // Calculations for live profit metrics
  const calculatedProfit = Math.max(0, Number(price || 0) - Number(purchasePrice || 0));
  const calculatedMarginPct = Number(price || 0) > 0 
    ? ((calculatedProfit / Number(price || 1)) * 100).toFixed(1) 
    : "0.0";
  const calculatedMrpDiscount = Number(mrp || 0) > Number(price || 0)
    ? Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>Pre-Printed Barcode Scanner &amp; Ingestion Hub</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  Hardware Gun &amp; Live Details Editor
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Scan any barcode with your handheld scanner. All product details are displayed automatically to view and modify before saving.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("scan")}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "scan"
                ? "bg-white text-emerald-700 border-t border-x border-slate-200 shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Interactive Barcode Gun Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bulk")}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "bulk"
                ? "bg-white text-indigo-700 border-t border-x border-slate-200 shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Barcode File Upload (CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Session Scanned Queue ({scanHistory.length})</span>
          </button>
        </div>

        {/* Tab 1: Interactive Scanner */}
        {activeTab === "scan" && (
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Active Scanner Input Box */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-white relative overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Scanner Gun Listener Ready
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Hardware USB / Bluetooth Scanner or Manual Input
                </span>
              </div>

              <form onSubmit={handleScanInputSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={scanInputRef}
                    type="text"
                    value={scannedInput}
                    onChange={(e) => setScannedInput(e.target.value)}
                    placeholder="Aim handheld barcode gun at product and pull trigger..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 shadow-inner"
                  />
                  <Scan className="w-4 h-4 absolute left-3 top-3.5 text-emerald-400" />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
                >
                  <span>Scan &amp; Display Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick simulation buttons for testing */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                  Test Barcodes:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => processBarcode("89099846033")}
                    className="px-2 py-0.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 rounded font-mono text-[10px] border border-amber-700 cursor-pointer font-bold"
                  >
                    89099846033 (Pre-Printed Pack)
                  </button>
                  <button
                    type="button"
                    onClick={() => processBarcode("8901031200051")}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px] border border-slate-700 cursor-pointer"
                  >
                    8901031200051 (Apples)
                  </button>
                  <button
                    type="button"
                    onClick={() => processBarcode("8901262010115")}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px] border border-slate-700 cursor-pointer"
                  >
                    8901262010115 (Butter)
                  </button>
                  <button
                    type="button"
                    onClick={() => processBarcode("8901262020213")}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px] border border-slate-700 cursor-pointer"
                  >
                    8901262020213 (Milk)
                  </button>
                  <button
                    type="button"
                    onClick={() => processBarcode("8901725181222")}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px] border border-slate-700 cursor-pointer"
                  >
                    8901725181222 (Atta 10Kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => processBarcode(`89099${Math.floor(100000 + Math.random() * 900000)}`)}
                    className="px-2.5 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded font-mono text-[10px] border border-emerald-800 cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    + Scan New Barcode
                  </button>
                </div>
              </div>
            </div>

            {/* FULLY DISPLAYED & MODIFIABLE PRODUCT DETAILS FORM */}
            {activeBarcode ? (
              <form onSubmit={handleSaveProduct} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 animate-fadeIn">
                {/* Status Bar */}
                <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isExistingProduct 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950" 
                    : "bg-amber-50 border-amber-200 text-amber-950"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isExistingProduct ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {isExistingProduct ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider ${
                          isExistingProduct ? "bg-emerald-200 text-emerald-900" : "bg-amber-200 text-amber-900"
                        }`}>
                          {isExistingProduct ? "✓ Existing Product Found" : "🆕 Pre-Printed Barcode Scanned"}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          Barcode: {activeBarcode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 font-medium">
                        ✓ All product details (Description Name, SKU, Category, Measurement Unit, Pack Size, Cost, MRP, Price, Stock) are displayed automatically. You can view and modify any details before saving.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        resetScanForm();
                        setTimeout(() => scanInputRef.current?.focus(), 100);
                      }}
                      className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Scan Another Item
                    </button>
                  </div>
                </div>

                {/* Section 1: Product Identification */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      <span>Product Identification &amp; Barcode Coordinates</span>
                    </h4>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Auto-Populated • Fully Modifiable
                    </span>
                  </div>

                  {/* Quick-Fill Preset Template Chips */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Quick-Fill Product Description Presets:
                      </span>
                      <span className="text-[10px] text-slate-400">Click any preset to auto-fill or modify freely</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {QUICK_FILL_PRESET_TEMPLATES.map((tmpl) => (
                        <button
                          key={tmpl.label}
                          type="button"
                          onClick={() => applyPresetTemplate(tmpl)}
                          className="px-2 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
                        >
                          {tmpl.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-slate-600 font-semibold mb-1 text-xs">
                        Product Description Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Premium Basmati Rice 5Kg, or Handcrafted Chocolate Butter Cookies"
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1 text-xs">
                        SKU Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        placeholder="e.g. GRN-BAS-R5"
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Category & Measurement Unit / Pack Size */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Category &amp; Measurement Pack Specification</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1 text-xs">Category Bracket</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-800 bg-white"
                      >
                        {productCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1 text-xs">Measurement Unit</label>
                      <select
                        value={unit}
                        onChange={(e) => handleUnitChange(e.target.value as MeasurementUnit)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 bg-white"
                      >
                        <option value={MeasurementUnit.PIECE}>Pieces (pcs)</option>
                        <option value={MeasurementUnit.GRAM}>Grams (g)</option>
                        <option value={MeasurementUnit.KG}>Kilogram (Kg)</option>
                        <option value={MeasurementUnit.LITER}>Liters (Liters)</option>
                        <option value={MeasurementUnit.ML}>Milliliter (mL)</option>
                        <option value={MeasurementUnit.PACK}>Packs (pk)</option>
                      </select>
                    </div>
                  </div>

                  {/* Number of Units / Pack Size Specification with dynamic presets */}
                  <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Number of Units based on {unit} (Pack Size) *</span>
                      </label>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                        Specification: {unitQuantity} {unit}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap">
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        placeholder="e.g. 500 for 500g, 1 for 1kg, 250 for 250mL"
                        value={unitQuantity}
                        onChange={(e) => setUnitQuantity(Number(e.target.value))}
                        className="w-28 bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-xs font-bold text-slate-900"
                        required
                      />
                      <span className="text-xs text-slate-600 font-medium">{unit}</span>

                      {/* Quick preset chips */}
                      <div className="flex gap-1 ml-auto flex-wrap">
                        {unit === MeasurementUnit.GRAM && (
                          [100, 200, 250, 500, 1000].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setUnitQuantity(val)}
                              className={`text-[10px] px-2 py-1 rounded font-mono font-bold transition-colors cursor-pointer ${
                                unitQuantity === val ? "bg-emerald-700 text-white" : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {val}g
                            </button>
                          ))
                        )}
                        {unit === MeasurementUnit.ML && (
                          [50, 100, 200, 250, 500, 750].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setUnitQuantity(val)}
                              className={`text-[10px] px-2 py-1 rounded font-mono font-bold transition-colors cursor-pointer ${
                                unitQuantity === val ? "bg-emerald-700 text-white" : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {val}mL
                            </button>
                          ))
                        )}
                        {unit === MeasurementUnit.KG && (
                          [0.5, 1, 2, 5, 10, 25].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setUnitQuantity(val)}
                              className={`text-[10px] px-2 py-1 rounded font-mono font-bold transition-colors cursor-pointer ${
                                unitQuantity === val ? "bg-emerald-700 text-white" : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {val}kg
                            </button>
                          ))
                        )}
                        {unit === MeasurementUnit.LITER && (
                          [0.25, 0.5, 1, 2, 5].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setUnitQuantity(val)}
                              className={`text-[10px] px-2 py-1 rounded font-mono font-bold transition-colors cursor-pointer ${
                                unitQuantity === val ? "bg-emerald-700 text-white" : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {val}L
                            </button>
                          ))
                        )}
                        {unit === MeasurementUnit.PIECE && (
                          [1, 2, 4, 6, 12].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setUnitQuantity(val)}
                              className={`text-[10px] px-2 py-1 rounded font-mono font-bold transition-colors cursor-pointer ${
                                unitQuantity === val ? "bg-emerald-700 text-white" : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {val === 12 ? "12 (Dozen)" : `${val} pcs`}
                            </button>
                          ))
                        )}
                        {unit === MeasurementUnit.PACK && (
                          [1, 5, 10, 24].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setUnitQuantity(val)}
                              className={`text-[10px] px-2 py-1 rounded font-mono font-bold transition-colors cursor-pointer ${
                                unitQuantity === val ? "bg-emerald-700 text-white" : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {val} pk
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Financial & Pricing Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pricing &amp; Profit Valuation Matrix</span>
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">
                      Margin: ₹{calculatedProfit.toFixed(2)} (+{calculatedMarginPct}%) {calculatedMrpDiscount > 0 && `• ${calculatedMrpDiscount}% OFF MRP`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="block text-slate-500 font-semibold mb-1 text-xs">
                        COGS Purchase Cost (₹)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-sm font-bold text-slate-800"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Cost paid to supplier</span>
                    </div>

                    <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                      <label className="block text-amber-900 font-semibold mb-1 text-xs">
                        MRP Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={mrp}
                        onChange={(e) => setMrp(Number(e.target.value))}
                        className="w-full bg-white border border-amber-300 rounded p-1.5 font-mono text-sm font-bold text-amber-950"
                      />
                      <span className="text-[10px] text-amber-700 mt-1 block">Printed Maximum Retail Price</span>
                    </div>

                    <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                      <label className="block text-emerald-900 font-semibold mb-1 text-xs">
                        Selling / Retail Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-white border border-emerald-300 rounded p-1.5 font-mono text-sm font-black text-emerald-900"
                      />
                      <span className="text-[10px] text-emerald-700 mt-1 block">Customer checkout rate</span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Available Stock & Inventory Controls */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>Available Stock &amp; Restock Controls</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-700 font-bold text-xs">
                          Available / On-Hand Stock ({unit}s) *
                        </label>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Directly editable
                        </span>
                      </div>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-base font-black text-slate-900"
                        required
                      />

                      {/* Quick stock additions */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-slate-400 font-semibold">Quick Add:</span>
                        {[5, 10, 25, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => handleAddStock(amt)}
                            className="px-2 py-0.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-300 hover:border-emerald-300 rounded font-mono text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                          >
                            +{amt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-xs">
                        Min Alert Stock Limit
                      </label>
                      <input
                        type="number"
                        value={minStockAlert}
                        onChange={(e) => setMinStockAlert(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-xs font-semibold text-slate-800"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Triggers low-stock warnings when inventory drops below this number
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 5: Batch, Expiry, Tax & Vendor */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Batch, Expiry Date, GST &amp; Supplier Source</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">GST Tax Slab</label>
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2"
                      >
                        <option value={0}>0% GST</option>
                        <option value={5}>5% GST</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% GST</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Batch Number</label>
                      <input
                        type="text"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Vendor / Supplier</label>
                      <select
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2"
                      >
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500 font-mono">
                    {isExistingProduct 
                      ? "⚠️ Modifying existing catalogue item will update store stock & pricing immediately."
                      : "✨ New product will be registered with scanned barcode and available in POS."}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        resetScanForm();
                        setTimeout(() => scanInputRef.current?.focus(), 100);
                      }}
                      className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      Clear &amp; Scan Next
                    </button>

                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isExistingProduct ? "Update Product Details & Scan Next" : "Save Product Catalogue Details & Scan Next"}</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Awaiting Scan State */
              <div className="text-center py-12 text-slate-400 space-y-3 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                  <Scan className="w-8 h-8 animate-pulse text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">Awaiting Handheld Barcode Scan</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Aim your barcode gun at the item's barcode. Once scanned, <strong>all product details will be displayed automatically</strong> for you to view, inspect, and modify before saving.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bulk CSV Upload */}
        {activeTab === "bulk" && (
          <div className="p-6 overflow-y-auto space-y-5">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                  Bulk Pre-Printed Barcode Catalogue Ingestion
                </h4>
                <p className="text-[11px] text-indigo-800 mt-0.5">
                  Import a spreadsheet containing pre-printed barcode numbers, product descriptions, units, pack sizes, MRPs, and stock counts.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Template</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors bg-slate-50">
              <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h5 className="text-sm font-bold text-slate-800 mb-1">
                Select or Drop Pre-Printed Barcodes CSV File
              </h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Upload your CSV file containing columns for Barcode, Name, Category, Unit, UnitQuantity, PurchasePrice, MRP, and Stock.
              </p>
              <label className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Browse Local CSV / Excel File</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: Session Scanned History */}
        {activeTab === "history" && (
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Session Scanned Queue ({scanHistory.length} Barcodes)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Log of all pre-printed barcodes scanned, inspected, and saved during this session.
                </p>
              </div>
              {scanHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const csv = "Timestamp,Barcode,ProductName,Action,Quantity\n" +
                      scanHistory.map(h => `"${h.timestamp}","${h.barcode}","${h.productName}","${h.action}",${h.quantity}`).join("\n");
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `scanned_barcodes_log_${Date.now()}.csv`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Log to CSV</span>
                </button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <History className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-600">No Barcodes Scanned In This Session</p>
                <p className="text-[11px] text-slate-400">
                  Switch to the scanner tab to scan, view, and modify products.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Time</th>
                      <th className="px-4 py-2.5">Barcode</th>
                      <th className="px-4 py-2.5">Product Name</th>
                      <th className="px-4 py-2.5">Action Taken</th>
                      <th className="px-4 py-2.5 text-right">Available Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {scanHistory.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2 text-slate-500">{entry.timestamp}</td>
                        <td className="px-4 py-2 font-bold text-slate-800">{entry.barcode}</td>
                        <td className="px-4 py-2 font-sans font-semibold text-slate-900">{entry.productName}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            entry.action === "UPDATED"
                              ? "bg-amber-100 text-amber-800"
                              : entry.action === "RESTOCKED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}>
                            {entry.action}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-slate-800">{entry.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px]">
            Total Active Products: <strong className="text-slate-800">{products.length}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
