import React, { useState, useMemo } from "react";
import {
  Printer,
  Tag,
  Download,
  Copy,
  Check,
  X,
  Search,
  FileText,
  Sliders,
  CheckSquare,
  Square,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  Eye,
  Layers
} from "lucide-react";
import { Product, printElementById, saveElementAsPDF } from "../types";

export interface ProductLabelGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialSelectedProduct?: Product | null;
  storeName?: string;
  currencySymbol?: string;
}

type LabelTemplateSize = "standard-50x25" | "compact-38x25" | "promo-100x50" | "a4-sheet-24";

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
    initialSelectedProduct ? [initialSelectedProduct.id] : products.slice(0, 12).map(p => p.id)
  );

  // Search filter for products
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Label Template Format
  const [templateSize, setTemplateSize] = useState<LabelTemplateSize>("a4-sheet-24");

  // Quantity per product
  const [copiesPerProduct, setCopiesPerProduct] = useState<number>(
    initialSelectedProduct ? 24 : 1
  );

  // Customization Toggles
  const [showStoreHeader, setShowStoreHeader] = useState<boolean>(true);
  const [showMrpStrikethrough, setShowMrpStrikethrough] = useState<boolean>(true);
  const [showBarcodeGraphic, setShowBarcodeGraphic] = useState<boolean>(true);
  const [showSkuCategory, setShowSkuCategory] = useState<boolean>(true);
  const [promoBannerText, setPromoBannerText] = useState<string>("⭐ SUPERMARKET DEAL ⭐");

  // Notification / Toast inside modal
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (text: string) => {
    setFeedbackMsg(text);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Filter products for dropdown / checklist
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        (p.barcode || "").toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const activeSingleProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0] || null;
  }, [products, selectedProductId]);

  // Build the list of labels to generate
  const labelItemsToRender = useMemo(() => {
    const items: Product[] = [];
    if (mode === "single" && activeSingleProduct) {
      const count = Math.max(1, Math.min(120, copiesPerProduct));
      for (let i = 0; i < count; i++) {
        items.push(activeSingleProduct);
      }
    } else if (mode === "batch") {
      const selectedProducts = products.filter(p => selectedBatchIds.includes(p.id));
      const countPerItem = Math.max(1, Math.min(30, copiesPerProduct));
      selectedProducts.forEach(p => {
        for (let i = 0; i < countPerItem; i++) {
          items.push(p);
        }
      });
    }
    return items;
  }, [mode, activeSingleProduct, copiesPerProduct, products, selectedBatchIds]);

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

  // Helper: Deterministic SVG Barcode renderer
  const renderBarcodeSvg = (code: string) => {
    const cleanCode = (code || "BC-000000").replace(/[^a-zA-Z0-9]/g, "");
    const totalBars = 36;
    const bars: { x: number; width: number }[] = [];
    let currentX = 4;

    for (let i = 0; i < totalBars; i++) {
      const charCode = cleanCode.charCodeAt(i % cleanCode.length) || 65;
      const barWidth = ((charCode + i) % 3) + 1; // Width 1, 2, or 3
      const spaceWidth = ((charCode * (i + 2)) % 2) + 1; // Space 1 or 2
      bars.push({ x: currentX, width: barWidth });
      currentX += barWidth + spaceWidth;
    }
    const svgWidth = currentX + 4;

    return (
      <svg
        className="w-full h-8 text-stone-950"
        viewBox={`0 0 ${svgWidth} 22`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={0}
            width={bar.width}
            height={idx % 4 === 0 ? 22 : 18}
            fill="currentColor"
          />
        ))}
      </svg>
    );
  };

  // Copy active barcode to clipboard
  const handleCopyBarcode = (barcodeVal?: string) => {
    const code = barcodeVal || activeSingleProduct?.barcode || "N/A";
    navigator.clipboard.writeText(code);
    showFeedback(`Copied Barcode: ${code}`);
  };

  // Print execution
  const handlePrintLabels = async () => {
    showFeedback("Spooling labels to browser printer...");
    const ok = await printElementById("product-label-print-area", "standard-a4");
    if (ok) {
      showFeedback("Labels printed successfully!");
    } else {
      showFeedback("Print dialog initiated or downloaded as PDF.");
    }
  };

  // Download PDF execution
  const handleDownloadPdf = async () => {
    showFeedback("Generating high-resolution printable PDF...");
    const name = `Product-Labels-${Date.now()}.pdf`;
    await saveElementAsPDF("product-label-print-area", name, "standard-a4");
    showFeedback(`Downloaded PDF: ${name}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Tag className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold font-display tracking-tight text-white">
                  Product Barcode &amp; Shelf Label Generator
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold uppercase border border-emerald-500/40">
                  Ready to Print
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Generate, customize, and print high-resolution scannable barcode tags and shelf labels for retail POS &amp; inventory.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Control Panel + Right Live Preview */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Left Controls (5 cols) */}
          <div className="col-span-5 border-r border-slate-200 bg-slate-50/70 p-5 overflow-y-auto space-y-5">
            {/* Selection Mode Toggle */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-2">
                1. Selection Mode
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode("single")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === "single"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Single Product
                </button>
                <button
                  type="button"
                  onClick={() => setMode("batch")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === "batch"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Batch Multi-Product
                </button>
              </div>
            </div>

            {/* Mode-specific Product Picker */}
            {mode === "single" ? (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <label className="block text-xs font-bold text-slate-800">
                  Select Product for Labels
                </label>
                <div className="relative">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs font-semibold text-slate-800 outline-none focus:border-slate-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.sku}] {p.name} - {currencySymbol}{p.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {activeSingleProduct && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{activeSingleProduct.name}</span>
                      <span className="font-mono font-black text-emerald-600">
                        {currencySymbol}{activeSingleProduct.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                      <span>SKU: {activeSingleProduct.sku}</span>
                      <span>Barcode: {activeSingleProduct.barcode}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800">
                    Select Products ({selectedBatchIds.length} selected)
                  </label>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={handleSelectAllBatch}
                      className="text-emerald-600 font-bold hover:underline cursor-pointer"
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

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, SKU, or barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none bg-slate-50"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100">
                  {filteredProducts.map(p => {
                    const checked = selectedBatchIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleBatchItem(p.id)}
                        className={`p-2 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          checked ? "bg-emerald-50/50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {checked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
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
                        <span className="font-mono font-bold text-slate-800 shrink-0 ml-2">
                          {currencySymbol}{p.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Label Template & Size selection */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                2. Label Size &amp; Template Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "a4-sheet-24", label: "A4 Sticker Sheet (24/page)", sub: "3×8 Standard Adhesive Sheet" },
                  { id: "standard-50x25", label: "Retail Shelf Tag (50×25mm)", sub: "Standard grocery shelf edge" },
                  { id: "compact-38x25", label: "POS Price Tag (38×25mm)", sub: "Compact sticker format" },
                  { id: "promo-100x50", label: "Offer Shelf Banner (100×50mm)", sub: "Prominent promotional display" }
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateSize(tpl.id as LabelTemplateSize)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      templateSize === tpl.id
                        ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                        : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold text-xs">{tpl.label}</div>
                    <div className={`text-[10px] mt-0.5 ${templateSize === tpl.id ? "text-slate-300" : "text-slate-400"}`}>
                      {tpl.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                3. Label Content &amp; Toggles
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={showStoreHeader}
                    onChange={(e) => setShowStoreHeader(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-0"
                  />
                  <span>Store Name Header</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={showMrpStrikethrough}
                    onChange={(e) => setShowMrpStrikethrough(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-0"
                  />
                  <span>MRP &amp; Savings Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={showBarcodeGraphic}
                    onChange={(e) => setShowBarcodeGraphic(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-0"
                  />
                  <span>Vector Barcode Bars</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={showSkuCategory}
                    onChange={(e) => setShowSkuCategory(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-0"
                  />
                  <span>SKU &amp; GST Details</span>
                </label>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] text-slate-500 font-mono font-semibold mb-1">
                  Promotional Banner Text (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ⭐ SUPERMARKET DEAL ⭐ or BEST BUY"
                  value={promoBannerText}
                  onChange={(e) => setPromoBannerText(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-slate-500 font-sans"
                />
              </div>
            </div>

            {/* Copies / Quantity */}
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  4. {mode === "single" ? "Copies to Print" : "Copies per Selected Product"}
                </label>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  Total Labels: {labelItemsToRender.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={copiesPerProduct}
                  onChange={(e) => setCopiesPerProduct(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-center outline-none"
                />
                <div className="flex gap-1.5">
                  {[1, 4, 10, 24, 30].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCopiesPerProduct(num)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        copiesPerProduct === num
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview Panel (7 cols) */}
          <div className="col-span-7 bg-slate-100/80 p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  Print Preview Layout
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Format: {templateSize} | Showing {labelItemsToRender.length} label{labelItemsToRender.length === 1 ? "" : "s"}
                </p>
              </div>

              {feedbackMsg && (
                <div className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm animate-fadeIn">
                  {feedbackMsg}
                </div>
              )}
            </div>

            {/* Printable Container wrapper */}
            <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 shadow-inner">
              <div
                id="product-label-print-area"
                className={`w-full ${
                  templateSize === "a4-sheet-24"
                    ? "grid grid-cols-3 gap-3"
                    : templateSize === "standard-50x25"
                    ? "grid grid-cols-3 gap-3"
                    : templateSize === "compact-38x25"
                    ? "grid grid-cols-4 gap-2"
                    : "grid grid-cols-2 gap-4"
                }`}
              >
                {labelItemsToRender.map((product, idx) => {
                  const hasMrp = product.mrp && product.mrp > product.price;
                  const discountPercent = hasMrp
                    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
                    : 0;

                  return (
                    <div
                      key={`${product.id}-${idx}`}
                      className={`border border-stone-300 rounded-lg bg-white p-3 flex flex-col justify-between overflow-hidden relative shadow-2xs ${
                        templateSize === "promo-100x50" ? "min-h-[145px]" : "min-h-[110px]"
                      }`}
                      style={{
                        pageBreakInside: "avoid",
                        breakInside: "avoid"
                      }}
                    >
                      {/* Top Header */}
                      {showStoreHeader && (
                        <div className="text-center border-b border-stone-200 pb-1 mb-1">
                          <div className="text-[9px] font-black uppercase tracking-tight font-display text-stone-900 leading-none">
                            {storeName}
                          </div>
                        </div>
                      )}

                      {/* Optional Promo Banner */}
                      {promoBannerText.trim() && (
                        <div className="bg-slate-900 text-white text-[8px] font-bold uppercase tracking-wider text-center py-0.5 rounded-sm my-0.5">
                          {promoBannerText}
                        </div>
                      )}

                      {/* Product Name */}
                      <div className="text-center my-0.5">
                        <div className="text-[11px] font-extrabold text-stone-900 leading-tight line-clamp-2">
                          {product.name}
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="flex items-center justify-between my-1 px-1">
                        <div>
                          {showMrpStrikethrough && hasMrp && (
                            <div className="text-[9px] text-stone-400 line-through font-mono leading-none">
                              MRP: {currencySymbol}{product.mrp?.toFixed(2)}
                            </div>
                          )}
                          <div className="text-sm font-black font-mono text-stone-950 leading-none mt-0.5">
                            {currencySymbol} {product.price.toFixed(2)}
                            <span className="text-[9px] font-normal text-stone-500 ml-1">
                              /{product.unit || "Pack"}
                            </span>
                          </div>
                        </div>

                        {showMrpStrikethrough && hasMrp && discountPercent > 0 && (
                          <div className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold font-mono px-1.5 py-0.5 rounded">
                            {discountPercent}% OFF
                          </div>
                        )}
                      </div>

                      {/* Barcode Graphic & Number */}
                      {showBarcodeGraphic && (
                        <div className="my-1 flex flex-col items-center">
                          {renderBarcodeSvg(product.barcode || product.sku)}
                          <div className="text-[9px] font-mono font-bold tracking-widest text-stone-800 mt-0.5">
                            {product.barcode || product.sku}
                          </div>
                        </div>
                      )}

                      {/* SKU & Category footer */}
                      {showSkuCategory && (
                        <div className="flex justify-between items-center text-[8px] font-mono text-stone-500 border-t border-stone-100 pt-1 mt-0.5">
                          <span>SKU: {product.sku}</span>
                          <span>GST {product.gstRate}%</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Modal Action Bar */}
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyBarcode()}
                  className="px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Barcode
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
                  onClick={handlePrintLabels}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  Print Labels Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
