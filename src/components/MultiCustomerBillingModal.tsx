import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  Printer,
  Copy,
  ShoppingCart,
  X,
  Check,
  Search,
  CreditCard,
  Download,
  UserPlus,
  ExternalLink,
  Receipt,
  CheckSquare,
  Square,
  RotateCcw
} from "lucide-react";
import {
  Product,
  Customer,
  Invoice,
  InvoiceItem,
  Tenant,
  StoreBranch,
  UserRole,
  PaymentMode,
  normalizeUserRole,
  saveElementAsPDF
} from "../types";
import {
  ThermalPrinterConfig,
  THERMAL_LAYOUT_SPECS,
  getReceiptTypographySpec
} from "../utils/thermalPrinter";

export interface CustomerBillDraft {
  draftId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  billerName: string;
  billerRole: string;
  items: InvoiceItem[];
  couponCode: string;
  discountPercent: number;
  paymentMode: PaymentMode;
  cashReceived: string;
  generatedInvoice?: Invoice | null;
}

export interface StaffBillerOption {
  name: string;
  role: UserRole | string;
  email?: string;
}

export interface MultiCustomerBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  customers: Customer[];
  activeTenant: Tenant;
  currentBranch: StoreBranch | undefined;
  currentCashierName: string;
  currentRole: UserRole;
  isSuperAdmin?: boolean;
  staffProfiles?: StaffBillerOption[];
  branches: StoreBranch[];
  opsSettings: { receiptHeader?: string; receiptFooter?: string };
  printerConfig: ThermalPrinterConfig;
  initialCartItems: InvoiceItem[];
  initialCustomer: Customer | null;
  initialCustomerName: string;
  initialCustomerPhone: string;
  getProductStock: (product: Product) => number;
  onBatchCompleted: (state: any, createdInvoices: Invoice[]) => void;
  onPrintBatchElement: (elementId: string, invoiceId?: string) => void;
  onPrepareBatchSnapshot: (elementId: string, invoiceId?: string) => string;
  printSandboxNotice: boolean;
  printTabUrl: string;
  triggerNotification: (msg: string, type: "success" | "warning") => void;
}

function createEmptyBillDraft(
  index: number,
  defaultBillerName: string,
  defaultBillerRole: string,
  customer?: Customer | null,
  seedItems?: InvoiceItem[]
): CustomerBillDraft {
  return {
    draftId: `bill-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    customerId: customer?.id || "",
    customerName: customer?.name || "",
    customerPhone: customer?.phone || "",
    billerName: defaultBillerName,
    billerRole: defaultBillerRole,
    items: seedItems ? seedItems.map((it) => ({ ...it })) : [],
    couponCode: "",
    discountPercent: 0,
    paymentMode: PaymentMode.UPI,
    cashReceived: "",
    generatedInvoice: null
  };
}

function computeDraftTotals(draft: CustomerBillDraft) {
  const subtotal = draft.items.reduce((acc, it) => acc + it.subtotal, 0);
  const taxAmount = draft.items.reduce((acc, it) => acc + it.gstAmount, 0);
  const discountAmount = Number(((subtotal * draft.discountPercent) / 100).toFixed(2));
  const grandTotal = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));
  return { subtotal, taxAmount, discountAmount, grandTotal };
}

export const MultiCustomerBillingModal: React.FC<MultiCustomerBillingModalProps> = ({
  isOpen,
  onClose,
  products,
  customers,
  activeTenant,
  currentBranch,
  currentCashierName,
  currentRole,
  isSuperAdmin = false,
  staffProfiles = [],
  branches,
  opsSettings,
  printerConfig,
  initialCartItems,
  initialCustomer,
  initialCustomerName,
  initialCustomerPhone,
  getProductStock,
  onBatchCompleted,
  onPrintBatchElement,
  onPrepareBatchSnapshot,
  printSandboxNotice,
  printTabUrl,
  triggerNotification
}) => {
  const defaultBillerRole = isSuperAdmin ? "SUPERADMIN" : normalizeUserRole(currentRole);

  const [billDrafts, setBillDrafts] = useState<CustomerBillDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [showCustomerPicker, setShowCustomerPicker] = useState<boolean>(false);
  const [pickedCustomerIds, setPickedCustomerIds] = useState<string[]>([]);
  const [cloneActiveItemsOnPick, setCloneActiveItemsOnPick] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittingDraftId, setSubmittingDraftId] = useState<string | null>(null);
  const [generatedInvoices, setGeneratedInvoices] = useState<Invoice[]>([]);
  const [activeView, setActiveView] = useState<"builder" | "receipts">("builder");
  const [modalNotice, setModalNotice] = useState<string | null>(null);

  const currency = activeTenant.currency || "₹";
  const receiptTypography = getReceiptTypographySpec(
    printerConfig.layoutProfile,
    printerConfig.receiptFontStyle,
    printerConfig.receiptFontSize
  );
  const layoutSpec =
    THERMAL_LAYOUT_SPECS[printerConfig.layoutProfile] || THERMAL_LAYOUT_SPECS["thermal-80mm"];

  const gstinValue =
    activeTenant.gstinRegNumber ||
    (currentBranch?.id ? branches.find((b) => b.id === currentBranch.id)?.gstin : "") ||
    "07AAAAA1111A1Z1";
  const billerPhone = activeTenant.phone || currentBranch?.phone || "N/A";
  const billerBranchLabel =
    activeTenant.businessLocation &&
    activeTenant.businessLocation.trim().toLowerCase() !== activeTenant.name.trim().toLowerCase()
      ? activeTenant.businessLocation
      : currentBranch?.name || currentBranch?.id || "Main Branch";

  const uniqueBillerOptions = useMemo(() => {
    const map = new Map<string, { name: string; role: string }>();
    if (currentCashierName) {
      map.set(currentCashierName.toLowerCase(), {
        name: currentCashierName,
        role: defaultBillerRole
      });
    }
    staffProfiles.forEach((sp) => {
      if (!sp?.name) return;
      const key = sp.name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, { name: sp.name, role: String(sp.role || "CASHIER") });
      }
    });
    return Array.from(map.values());
  }, [currentCashierName, defaultBillerRole, staffProfiles]);

  useEffect(() => {
    if (!isOpen) return;
    setGeneratedInvoices([]);
    setActiveView("builder");
    setShowCustomerPicker(false);
    setPickedCustomerIds([]);
    setModalNotice(null);

    const first = createEmptyBillDraft(
      1,
      currentCashierName,
      defaultBillerRole,
      initialCustomer,
      initialCartItems.length > 0 ? initialCartItems : undefined
    );
    if (!initialCustomer && (initialCustomerName || initialCustomerPhone)) {
      first.customerName = initialCustomerName;
      first.customerPhone = initialCustomerPhone;
    }
    const second = createEmptyBillDraft(2, currentCashierName, defaultBillerRole);
    setBillDrafts([first, second]);
    setActiveDraftId(first.draftId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || generatedInvoices.length === 0 || activeView !== "receipts") return;
    const t = setTimeout(() => {
      onPrepareBatchSnapshot("multi-receipt-print-sheet", `BATCH-${generatedInvoices.length}`);
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeView, generatedInvoices, printerConfig.layoutProfile, printerConfig.connectionMode, printerConfig.receiptFontStyle, printerConfig.receiptFontSize]);

  const activeDraft = useMemo(
    () => billDrafts.find((d) => d.draftId === activeDraftId) || billDrafts[0] || null,
    [billDrafts, activeDraftId]
  );

  useEffect(() => {
    if (!isOpen || activeView !== "builder" || !activeDraft?.generatedInvoice) return;
    const inv = activeDraft.generatedInvoice;
    const t = setTimeout(() => {
      onPrepareBatchSnapshot(`single-counter-receipt-${inv.id}`, inv.id);
    }, 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeView, activeDraft?.generatedInvoice, printerConfig.layoutProfile, printerConfig.receiptFontStyle, printerConfig.receiptFontSize]);

  const pendingDrafts = useMemo(
    () => billDrafts.filter((d) => !d.generatedInvoice),
    [billDrafts]
  );

  // Total allocated quantity across PENDING customer bills to prevent cross-bill overselling
  const allocatedByProduct = useMemo(() => {
    const map: Record<string, number> = {};
    billDrafts.forEach((draft) => {
      if (draft.generatedInvoice) return;
      draft.items.forEach((it) => {
        map[it.productId] = (map[it.productId] || 0) + it.quantity;
      });
    });
    return map;
  }, [billDrafts]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return products.filter((p) => {
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    });
  }, [products, productSearch]);

  const batchSummary = useMemo(() => {
    const nonEmpty = billDrafts.filter((d) => !d.generatedInvoice && d.items.length > 0);
    const totalRevenue = nonEmpty.reduce(
      (acc, d) => acc + computeDraftTotals(d).grandTotal,
      0
    );
    const totalUnits = nonEmpty.reduce(
      (acc, d) => acc + d.items.reduce((s, it) => s + it.quantity, 0),
      0
    );
    return {
      readyCount: nonEmpty.length,
      totalRevenue,
      totalUnits
    };
  }, [billDrafts]);

  if (!isOpen) return null;

  const updateDraft = (draftId: string, updater: (d: CustomerBillDraft) => CustomerBillDraft) => {
    setBillDrafts((prev) => prev.map((d) => (d.draftId === draftId ? updater(d) : d)));
  };

  const handleAddBillTab = () => {
    const next = createEmptyBillDraft(
      billDrafts.length + 1,
      currentCashierName,
      defaultBillerRole
    );
    setBillDrafts((prev) => [...prev, next]);
    setActiveDraftId(next.draftId);
    setActiveView("builder");
  };

  const handleResetCounterToNewCustomer = (draftId: string) => {
    updateDraft(draftId, (d) => ({
      ...createEmptyBillDraft(1, d.billerName || currentCashierName, d.billerRole || defaultBillerRole),
      draftId: d.draftId
    }));
  };

  const handleRemoveBillTab = (draftId: string) => {
    if (billDrafts.length <= 1) {
      setModalNotice("At least 1 customer bill must remain open.");
      return;
    }
    const nextList = billDrafts.filter((d) => d.draftId !== draftId);
    setBillDrafts(nextList);
    if (activeDraftId === draftId && nextList[0]) {
      setActiveDraftId(nextList[0].draftId);
    }
  };

  const handleAddProductToDraft = (product: Product, targetDraftId: string) => {
    const targetDraft = billDrafts.find((d) => d.draftId === targetDraftId);
    if (!targetDraft || targetDraft.generatedInvoice) {
      triggerNotification("This bill is already finalized. Select a pending bill or open a new bill.", "warning");
      return;
    }

    const availStock = getProductStock(product);
    const totalAllocated = allocatedByProduct[product.id] || 0;
    if (totalAllocated + 1 > availStock) {
      triggerNotification(
        `Cannot exceed available branch stock (${availStock}) across simultaneous bills.`,
        "warning"
      );
      return;
    }

    updateDraft(targetDraftId, (draft) => {
      if (draft.generatedInvoice) return draft;
      const existing = draft.items.find((it) => it.productId === product.id);
      const itemMrp = (product as any).mrp
        ? Number((product as any).mrp)
        : product.price > 0
        ? Number((product.price * 1.15).toFixed(2))
        : product.price;

      if (existing) {
        const nextItems = draft.items.map((it) => {
          if (it.productId !== product.id) return it;
          const nextQty = it.quantity + 1;
          const subtotal = nextQty * it.price;
          const gstAmount = Number(((subtotal * it.gstRate) / (100 + it.gstRate)).toFixed(2));
          return { ...it, quantity: nextQty, subtotal, gstAmount, mrp: it.mrp || itemMrp };
        });
        return { ...draft, items: nextItems };
      }

      const gstAmount = Number(((product.price * product.gstRate) / (100 + product.gstRate)).toFixed(2));
      const newItem: InvoiceItem = {
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        mrp: itemMrp,
        quantity: 1,
        unit: product.unit,
        gstRate: product.gstRate,
        gstAmount,
        subtotal: product.price
      };
      return { ...draft, items: [...draft.items, newItem] };
    });
  };

  const handleUpdateDraftItemQty = (draftId: string, productId: string, delta: number) => {
    if (delta > 0) {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        const avail = getProductStock(prod);
        const totalAllocated = allocatedByProduct[productId] || 0;
        if (totalAllocated + delta > avail) {
          triggerNotification(
            `Cannot exceed available branch stock (${avail}) across simultaneous bills.`,
            "warning"
          );
          return;
        }
      }
    }

    updateDraft(draftId, (draft) => ({
      ...draft,
      items: draft.items
        .map((it) => {
          if (it.productId !== productId) return it;
          const nextQty = it.quantity + delta;
          if (nextQty <= 0) return null;
          const subtotal = nextQty * it.price;
          const gstAmount = Number(((subtotal * it.gstRate) / (100 + it.gstRate)).toFixed(2));
          return { ...it, quantity: nextQty, subtotal, gstAmount };
        })
        .filter(Boolean) as InvoiceItem[]
    }));
  };

  const handleCloneItemsToAllBills = () => {
    if (!activeDraft || activeDraft.items.length === 0) {
      triggerNotification("Add items to the active bill first before cloning to all bills.", "warning");
      return;
    }
    const targetDrafts = billDrafts.filter((d) => !d.generatedInvoice);
    const targetCount = targetDrafts.length;
    for (const it of activeDraft.items) {
      const prod = products.find((p) => p.id === it.productId);
      if (prod) {
        const avail = getProductStock(prod);
        if (it.quantity * targetCount > avail) {
          triggerNotification(
            `Cannot clone '${prod.name}' to all ${targetCount} pending bills (requires ${it.quantity * targetCount}, available ${avail}).`,
            "warning"
          );
          return;
        }
      }
    }
    setBillDrafts((prev) =>
      prev.map((d) =>
        d.draftId === activeDraft.draftId || d.generatedInvoice
          ? d
          : { ...d, items: activeDraft.items.map((it) => ({ ...it })) }
      )
    );
    triggerNotification(`Copied active basket to all ${targetCount} pending customer bills!`, "success");
  };

  const handleAddPickedCustomers = () => {
    if (pickedCustomerIds.length === 0) {
      triggerNotification("Select at least one customer.", "warning");
      return;
    }
    const seedItems = cloneActiveItemsOnPick && activeDraft?.items.length ? activeDraft.items : undefined;

    if (seedItems) {
      const futureBillCount =
        billDrafts.filter((d) => !d.generatedInvoice && d.items.length > 0).length + pickedCustomerIds.length;
      for (const it of seedItems) {
        const prod = products.find((p) => p.id === it.productId);
        if (prod) {
          const avail = getProductStock(prod);
          if (it.quantity * futureBillCount > avail) {
            triggerNotification(
              `Not enough stock of '${prod.name}' (${avail} left) to pre-fill ${pickedCustomerIds.length} additional bills.`,
              "warning"
            );
            return;
          }
        }
      }
    }

    const newDrafts: CustomerBillDraft[] = [];
    let nextList = [...billDrafts];

    pickedCustomerIds.forEach((cid, idx) => {
      const cust = customers.find((c) => c.id === cid);
      if (!cust) return;
      // Fill an unlinked empty pending placeholder draft first if present
      const emptyIdx = nextList.findIndex(
        (d) => !d.generatedInvoice && !d.customerId && !d.customerName && d.items.length === 0
      );
      if (emptyIdx !== -1) {
        nextList[emptyIdx] = {
          ...nextList[emptyIdx],
          customerId: cust.id,
          customerName: cust.name,
          customerPhone: cust.phone,
          items: seedItems ? seedItems.map((it) => ({ ...it })) : nextList[emptyIdx].items
        };
      } else {
        const fresh = createEmptyBillDraft(
          nextList.length + idx + 1,
          currentCashierName,
          defaultBillerRole,
          cust,
          seedItems
        );
        newDrafts.push(fresh);
      }
    });

    const combined = [...nextList, ...newDrafts];
    setBillDrafts(combined);
    if (newDrafts[0]) setActiveDraftId(newDrafts[0].draftId);
    setShowCustomerPicker(false);
    setPickedCustomerIds([]);
    triggerNotification(`Prepared ${pickedCustomerIds.length} customer bill(s) simultaneously!`, "success");
  };

  const handleApplyCouponToDraft = (draftId: string) => {
    const target = billDrafts.find((d) => d.draftId === draftId);
    if (!target) return;
    const code = target.couponCode.trim().toUpperCase();
    if (code === "WELCOME5") {
      updateDraft(draftId, (d) => ({ ...d, discountPercent: 5 }));
      triggerNotification("5% coupon WELCOME5 applied!", "success");
    } else if (code === "FESTIVE10") {
      updateDraft(draftId, (d) => ({ ...d, discountPercent: 10 }));
      triggerNotification("10% coupon FESTIVE10 applied!", "success");
    } else if (code === "BIGBUDGET") {
      updateDraft(draftId, (d) => ({ ...d, discountPercent: 15 }));
      triggerNotification("15% coupon BIGBUDGET applied!", "success");
    } else {
      triggerNotification("Invalid coupon code. Try WELCOME5, FESTIVE10, or BIGBUDGET.", "warning");
    }
  };

  const buildInvoiceFromDraft = (
    d: CustomerBillDraft,
    indexLabel: number,
    batchBase: number,
    dateStamp: string,
    dateStr: string,
    timeStr: string,
    includeBatchSuffix: boolean
  ): Invoice => {
    const { subtotal, taxAmount, discountAmount, grandTotal } = computeDraftTotals(d);
    const cashVal =
      d.paymentMode === PaymentMode.CASH
        ? d.cashReceived.trim() === ""
          ? grandTotal
          : Number(d.cashReceived)
        : undefined;
    const changeRet =
      d.paymentMode === PaymentMode.CASH && cashVal !== undefined
        ? Number((cashVal - grandTotal).toFixed(2))
        : undefined;

    const id = includeBatchSuffix
      ? `EAS-${dateStamp}-${batchBase}-${String(indexLabel).padStart(2, "0")}`
      : `EAS-${dateStamp}-${batchBase}`;

    return {
      id,
      date: dateStr,
      time: timeStr,
      customerId: d.customerId || undefined,
      customerName: d.customerName.trim() || `Walk-in Customer #${indexLabel}`,
      customerPhone: d.customerPhone.trim() || undefined,
      items: d.items,
      subtotal,
      taxAmount,
      discountPercent: d.discountPercent,
      discountAmount,
      couponCode: d.couponCode.trim() ? d.couponCode.trim().toUpperCase() : undefined,
      grandTotal,
      paymentMode: d.paymentMode,
      cashReceived: cashVal,
      changeReturned: changeRet,
      cashierName: d.billerName.trim() || currentCashierName,
      storeBranchId: currentBranch?.id || "B1",
      status: "PAID"
    };
  };

  const handleGenerateSingleBillAndReceipt = async (draftId: string) => {
    const role = normalizeUserRole(currentRole);
    if (
      !isSuperAdmin &&
      role !== UserRole.ADMIN &&
      role !== UserRole.MANAGER &&
      role !== UserRole.CASHIER
    ) {
      triggerNotification("Store Keepers do not have checkout permissions.", "warning");
      return;
    }

    const idx = billDrafts.findIndex((d) => d.draftId === draftId);
    const target = idx !== -1 ? billDrafts[idx] : null;
    if (!target || target.generatedInvoice) {
      triggerNotification("This customer bill is already generated.", "warning");
      return;
    }
    if (target.items.length === 0) {
      triggerNotification("Add items to this customer's bill before generating an invoice.", "warning");
      return;
    }

    const { grandTotal } = computeDraftTotals(target);
    if (target.paymentMode === PaymentMode.CASH) {
      const cashVal = target.cashReceived.trim() === "" ? grandTotal : Number(target.cashReceived);
      if (isNaN(cashVal) || cashVal < grandTotal) {
        triggerNotification(
          `Bill #${idx + 1} has insufficient cash entered. Target: ${currency}${grandTotal.toFixed(2)}`,
          "warning"
        );
        return;
      }
    }

    for (const it of target.items) {
      const prod = products.find((p) => p.id === it.productId);
      if (prod) {
        const avail = getProductStock(prod);
        if (it.quantity > avail) {
          triggerNotification(
            `Stock exceeded for '${prod.name}': requires ${it.quantity}, branch has ${avail}.`,
            "warning"
          );
          return;
        }
      }
    }

    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const dateStr = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const singleBase = Math.floor(1000 + Math.random() * 8999);
    const invoiceToCreate = buildInvoiceFromDraft(
      target,
      idx + 1,
      singleBase,
      dateStamp,
      dateStr,
      timeStr,
      false
    );

    setSubmittingDraftId(draftId);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceToCreate)
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        triggerNotification(data?.error || "Failed to generate individual customer bill.", "warning");
        return;
      }
      onBatchCompleted(data.state, [invoiceToCreate]);
      setBillDrafts((prev) =>
        prev.map((d) => (d.draftId === draftId ? { ...d, generatedInvoice: invoiceToCreate } : d))
      );
      setGeneratedInvoices((prev) => [...prev, invoiceToCreate]);
      triggerNotification(
        `Generated individual invoice ${invoiceToCreate.id} for ${invoiceToCreate.customerName}!`,
        "success"
      );
    } catch {
      triggerNotification("Network error while generating individual customer bill.", "warning");
    } finally {
      setSubmittingDraftId(null);
    }
  };

  const handleGenerateAllBillsAndReceipts = async () => {
    const role = normalizeUserRole(currentRole);
    if (
      !isSuperAdmin &&
      role !== UserRole.ADMIN &&
      role !== UserRole.MANAGER &&
      role !== UserRole.CASHIER
    ) {
      triggerNotification("Store Keepers do not have checkout permissions.", "warning");
      return;
    }

    const readyDrafts = billDrafts.filter((d) => !d.generatedInvoice && d.items.length > 0);
    if (readyDrafts.length === 0) {
      if (generatedInvoices.length > 0) {
        setActiveView("receipts");
        return;
      }
      triggerNotification("Add items to at least one customer bill before checkout.", "warning");
      return;
    }

    // Validate cash payments & combined branch stock
    const combinedQty: Record<string, number> = {};
    for (let i = 0; i < readyDrafts.length; i++) {
      const d = readyDrafts[i];
      const { grandTotal } = computeDraftTotals(d);
      if (d.paymentMode === PaymentMode.CASH) {
        const cashVal = d.cashReceived.trim() === "" ? grandTotal : Number(d.cashReceived);
        if (isNaN(cashVal) || cashVal < grandTotal) {
          setActiveDraftId(d.draftId);
          triggerNotification(
            `Bill #${i + 1} (${d.customerName || "Walk-in"}) has insufficient cash entered. Target: ${currency}${grandTotal.toFixed(2)}`,
            "warning"
          );
          return;
        }
      }
      d.items.forEach((it) => {
        combinedQty[it.productId] = (combinedQty[it.productId] || 0) + it.quantity;
      });
    }

    for (const [prodId, qtyNeeded] of Object.entries(combinedQty)) {
      const prod = products.find((p) => p.id === prodId);
      if (prod) {
        const avail = getProductStock(prod);
        if (qtyNeeded > avail) {
          triggerNotification(
            `Stock exceeded for '${prod.name}': combined bills need ${qtyNeeded}, branch has ${avail}.`,
            "warning"
          );
          return;
        }
      }
    }

    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const dateStr = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const batchBase = Math.floor(1000 + Math.random() * 8999);

    const createdByDraftId: Record<string, Invoice> = {};
    const invoicesToCreate: Invoice[] = readyDrafts.map((d, idx) => {
      const inv = buildInvoiceFromDraft(d, idx + 1, batchBase, dateStamp, dateStr, timeStr, true);
      createdByDraftId[d.draftId] = inv;
      return inv;
    });

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/invoices/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoices: invoicesToCreate })
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        triggerNotification(data?.error || "Failed to generate simultaneous customer bills.", "warning");
        return;
      }
      onBatchCompleted(data.state, invoicesToCreate);
      setBillDrafts((prev) =>
        prev.map((d) =>
          createdByDraftId[d.draftId] ? { ...d, generatedInvoice: createdByDraftId[d.draftId] } : d
        )
      );
      setGeneratedInvoices((prev) => [...prev, ...invoicesToCreate]);
      setActiveView("receipts");
      triggerNotification(
        `Generated ${invoicesToCreate.length} customer bills & receipts simultaneously!`,
        "success"
      );
    } catch {
      triggerNotification("Network error while generating simultaneous bills.", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOfficialReceiptCard = (
    inv: Invoice,
    isLast = false,
    domIdOverride?: string,
    isBatchCard = true
  ) => {
    const totalMrp = inv.items.reduce((acc, it) => {
      const itemMrp = it.mrp || (it.price > 0 ? Number((it.price * 1.15).toFixed(2)) : it.price);
      return acc + itemMrp * it.quantity;
    }, 0);
    const totalSavings = Math.max(0, totalMrp - inv.grandTotal);
    const addrParts = [activeTenant.address, activeTenant.city, activeTenant.state].filter(Boolean);
    const addressLine =
      addrParts.length > 0
        ? addrParts.join(", ") + (activeTenant.pincode ? ` - ${activeTenant.pincode}` : "")
        : currentBranch?.address
        ? `${currentBranch.address}, ${currentBranch.city || ""}`.trim().replace(/,\s*$/, "")
        : "Registered Store Location";
    const invBranch = branches.find((b) => b.id === inv.storeBranchId);
    const billedByBranch = invBranch?.name || billerBranchLabel;

    return (
      <div
        id={domIdOverride || `multi-receipt-card-${inv.id}`}
        data-multi-receipt-card={isBatchCard ? "true" : undefined}
        data-last-receipt-card={isBatchCard && isLast ? "true" : undefined}
        className="bg-amber-50/20 p-4 rounded-xl border border-slate-300 font-bold text-slate-950 space-y-2.5"
        style={{
          fontFamily: receiptTypography.cssFamily,
          fontSize: receiptTypography.previewFontSizeCss,
          fontWeight: 700
        }}
      >
        <div className="text-center space-y-1 font-bold text-slate-950">
          {activeTenant.companyLogo && (
            <div className="flex justify-center mb-1">
              <img
                src={activeTenant.companyLogo}
                alt={`${activeTenant.name} Logo`}
                data-receipt-logo="true"
                className="h-9 max-w-[140px] object-contain"
              />
            </div>
          )}
          <h4 data-receipt-store-name="true" className="font-black text-[1.22em] tracking-tight text-slate-950">
            {activeTenant.name}
          </h4>
          <p data-receipt-header="true" className="text-[0.88em] font-bold text-slate-950 uppercase tracking-wide">
            {opsSettings.receiptHeader || "OFFICIAL RETAIL CASH INVOICE"}
          </p>
          {activeTenant.businessLocation &&
            activeTenant.businessLocation.trim().toLowerCase() !== activeTenant.name.trim().toLowerCase() && (
              <p data-receipt-branch="true" className="text-[0.88em] text-slate-950 font-bold">
                Branch: {activeTenant.businessLocation}
              </p>
            )}
          <p data-receipt-address="true" className="text-[0.86em] text-slate-950 font-bold leading-tight">
            {addressLine}
          </p>
          <p data-receipt-contact="true" className="text-[0.84em] text-slate-950 font-bold">
            Contact: {billerPhone}
          </p>
        </div>

        <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 font-bold text-slate-950">
          <div className="flex justify-between" data-receipt-meta-row="true">
            <span className="font-bold">Invoice ID:</span>
            <span className="font-black">{inv.id}</span>
          </div>
          <div className="flex justify-between" data-receipt-meta-row="true">
            <span className="font-bold">GSTIN Check:</span>
            <span className="font-black uppercase">{gstinValue}</span>
          </div>
          <div className="flex justify-between" data-receipt-meta-row="true">
            <span className="font-bold">Sales Cashier:</span>
            <span className="font-bold">{inv.cashierName || currentCashierName}</span>
          </div>
          <div className="flex justify-between" data-receipt-meta-row="true">
            <span className="font-bold">Timestamp:</span>
            <span className="font-bold">
              {inv.date} {inv.time}
            </span>
          </div>
          {inv.customerName && (
            <div className="flex justify-between border-t border-dashed border-slate-400 pt-1" data-receipt-meta-row="true">
              <span className="font-bold">Customer:</span>
              <span className="font-black text-right break-words max-w-[180px]">{inv.customerName}</span>
            </div>
          )}
          {inv.customerPhone && (
            <div className="flex justify-between" data-receipt-meta-row="true">
              <span className="font-bold">Mobile No:</span>
              <span className="font-black">{inv.customerPhone}</span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-400 pt-2 space-y-1.5 font-bold text-slate-950">
          <div
            data-receipt-items-grid="true"
            className="grid grid-cols-[minmax(0,1fr)_42px_42px_22px_46px] gap-1 font-black border-b border-slate-400 pb-1 text-slate-950 text-[0.9em]"
          >
            <span>Item Description</span>
            <span className="text-right">MRP</span>
            <span className="text-right">Rate</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Total</span>
          </div>
          {inv.items.map((it) => {
            const itemMrp = it.mrp || (it.price > 0 ? Number((it.price * 1.15).toFixed(2)) : it.price);
            return (
              <div
                key={`${inv.id}-${it.productId}`}
                data-receipt-items-grid="true"
                data-receipt-item-row="true"
                className="grid grid-cols-[minmax(0,1fr)_42px_42px_22px_46px] gap-1 text-[0.9em] font-bold text-slate-950 items-start"
              >
                <div className="min-w-0">
                  <span className="font-bold block break-words leading-tight text-slate-950">{it.name}</span>
                </div>
                <span className="text-right font-bold text-slate-950 text-[0.88em]">
                  {currency}
                  {itemMrp.toFixed(2)}
                </span>
                <span className="text-right font-bold text-slate-950">
                  {currency}
                  {it.price.toFixed(2)}
                </span>
                <span className="text-center font-black text-slate-950 text-[0.95em]">{it.quantity}</span>
                <span className="text-right font-black text-slate-950">
                  {currency}
                  {(it.price * it.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Biller Details directly under the product section */}
        <div
          data-receipt-biller="true"
          className="border-t border-dashed border-slate-400 pt-2 space-y-0.5 text-[0.88em] font-bold text-slate-950"
        >
          <p className="font-black uppercase tracking-wide text-[0.92em] text-slate-950">
            Biller Details
          </p>
          <div className="flex justify-between gap-2" data-receipt-biller-row="true">
            <span className="font-bold">Biller / Cashier:</span>
            <span className="font-black text-right">{inv.cashierName || currentCashierName}</span>
          </div>
          <div className="flex justify-between gap-2" data-receipt-biller-row="true">
            <span className="font-bold">Billed By:</span>
            <span className="font-bold text-right">
              {activeTenant.name} ({billedByBranch})
            </span>
          </div>
          <div className="flex justify-between gap-2" data-receipt-biller-row="true">
            <span className="font-bold">Biller Contact:</span>
            <span className="font-bold text-right">{billerPhone}</span>
          </div>
          <div className="flex justify-between gap-2" data-receipt-biller-row="true">
            <span className="font-bold">GSTIN:</span>
            <span className="font-black uppercase text-right">{gstinValue}</span>
          </div>
        </div>

        {totalSavings > 0 && (
          <div
            data-receipt-savings="true"
            className="p-1.5 bg-emerald-50 border border-emerald-400 rounded text-emerald-950 text-[0.88em] font-black flex justify-between items-center"
          >
            <span>🎉 You Saved on MRP:</span>
            <span className="font-black">
              {currency}
              {totalSavings.toFixed(2)} ({Math.round((totalSavings / totalMrp) * 100)}% OFF)
            </span>
          </div>
        )}

        <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 font-bold text-slate-950">
          <div className="flex justify-between" data-receipt-math-row="true">
            <span className="font-bold">Total MRP Value:</span>
            <span className="font-bold">
              {currency}
              {totalMrp.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between" data-receipt-math-row="true">
            <span className="font-bold">Basket Tax value:</span>
            <span className="font-bold">
              {currency}
              {inv.taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between" data-receipt-math-row="true">
            <span className="font-bold">Promo discount code:</span>
            <span className="font-bold">
              {inv.couponCode && inv.discountAmount > 0
                ? `-${currency}${inv.discountAmount.toFixed(2)} (${inv.couponCode})`
                : `${currency}0.00`}
            </span>
          </div>
          <div
            className="flex justify-between text-[1.12em] font-black text-slate-950 border-t border-dashed border-slate-400 pt-1.5"
            data-receipt-math-row="true"
          >
            <span>TOTAL PAYABLE:</span>
            <span>
              {currency}
              {inv.grandTotal.toFixed(2)}
            </span>
          </div>
          {inv.paymentMode === PaymentMode.CASH && inv.cashReceived !== undefined && (
            <>
              <div className="flex justify-between p-0.5 bg-slate-100 rounded text-slate-950 font-bold" data-receipt-math-row="true">
                <span>Cash Received:</span>
                <span>
                  {currency}
                  {Number(inv.cashReceived).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-950 font-bold" data-receipt-math-row="true">
                <span>Change Returned:</span>
                <span>
                  {currency}
                  {Number(inv.changeReturned || 0).toFixed(2)}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between" data-receipt-math-row="true">
            <span className="font-bold">Payment Mode:</span>
            <span className="font-black text-[0.9em] bg-slate-950 text-white px-1.5 rounded">
              {inv.paymentMode}
            </span>
          </div>
        </div>

        <div
          data-receipt-footer="true"
          className="p-2.5 bg-slate-100 rounded text-[0.86em] font-bold leading-tight text-center text-slate-950 border border-slate-400"
        >
          {opsSettings.receiptFooter || `Thank you for shopping at ${activeTenant.name}!`}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 font-sans">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-extrabold font-display tracking-tight text-white">
                  {activeView === "receipts" && generatedInvoices.length > 0
                    ? `Simultaneous Customer Receipts Ready (${generatedInvoices.length})`
                    : "Multi-Customer Simultaneous Billing & Receipts"}
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold uppercase border border-emerald-500/40">
                  {pendingDrafts.length} Open • {generatedInvoices.length} Generated
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {activeView === "receipts" && generatedInvoices.length > 0
                  ? `Formatted for ${layoutSpec.label} • Print all receipts at once or individually.`
                  : "Build & generate separate individual bills per customer, or batch-generate all receipts simultaneously."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {generatedInvoices.length > 0 && (
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveView("builder")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    activeView === "builder"
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Bill Counters ({billDrafts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("receipts")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    activeView === "receipts"
                      ? "bg-emerald-500 text-slate-950"
                      : "text-emerald-300 hover:text-white"
                  }`}
                >
                  Generated Receipts ({generatedInvoices.length})
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Multi-Bill Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PHASE 2: GENERATED BATCH RECEIPTS VIEW */}
        {activeView === "receipts" && generatedInvoices.length > 0 ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Batch Print Toolbar */}
            <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-slate-900">
                  {generatedInvoices.length} Independent Invoice{generatedInvoices.length === 1 ? "" : "s"} Generated
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-mono font-bold text-emerald-700">
                  Combined Total: {currency}
                  {generatedInvoices.reduce((a, inv) => a + inv.grandTotal, 0).toFixed(2)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView("builder")}
                  className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  Back to Bill Counters
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGeneratedInvoices([]);
                    setActiveView("builder");
                    const first = createEmptyBillDraft(1, currentCashierName, defaultBillerRole);
                    const second = createEmptyBillDraft(2, currentCashierName, defaultBillerRole);
                    setBillDrafts([first, second]);
                    setActiveDraftId(first.draftId);
                  }}
                  className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Batch
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await saveElementAsPDF(
                      "multi-receipt-print-sheet",
                      `Batch-Receipts-${Date.now()}.pdf`,
                      printerConfig.layoutProfile
                    );
                    triggerNotification("Downloaded combined customer receipts PDF!", "success");
                  }}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download All PDF
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onPrintBatchElement("multi-receipt-print-sheet", `BATCH-${generatedInvoices.length}`)
                  }
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print All {generatedInvoices.length} Receipts Simultaneously
                </button>
              </div>
            </div>

            {printSandboxNotice && (
              <div className="mx-6 mt-3 p-3 bg-amber-50 border border-amber-300 rounded-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
                <p className="text-xs font-bold text-amber-900">
                  Preview iframe restricts direct printer dialogs. Open the Direct Print Window to print all {generatedInvoices.length} customer receipts at once:
                </p>
                <a
                  href={printTabUrl}
                  target="expertpos_print_station"
                  rel="noopener noreferrer"
                  onMouseDown={() =>
                    onPrepareBatchSnapshot("multi-receipt-print-sheet", `BATCH-${generatedInvoices.length}`)
                  }
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Direct Print Window ({generatedInvoices.length} Receipts)
                </a>
              </div>
            )}

            {/* Visual Grid of All Customer Receipts + Unified Print Target */}
            <div className="flex-1 overflow-y-auto p-5">
              <div
                id="multi-receipt-print-sheet"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start"
              >
                {generatedInvoices.map((inv, idx) => (
                  <div
                    key={inv.id}
                    data-multi-receipt-wrapper="true"
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 no-print">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          RECEIPT #{idx + 1} • {inv.id}
                        </span>
                        <p className="text-xs font-bold text-slate-900 truncate mt-1">
                          {inv.customerName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onPrintBatchElement(`multi-receipt-card-${inv.id}`, inv.id)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Printer className="w-3 h-3 text-emerald-400" />
                        Print
                      </button>
                    </div>

                    {renderOfficialReceiptCard(inv, idx === generatedInvoices.length - 1)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* PHASE 1: SIMULTANEOUS BILL BUILDER */
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* LEFT: PRODUCT CATALOG & BATCH TOOLS (6 COLS) */}
            <div className="col-span-12 lg:col-span-6 border-r border-slate-200 bg-slate-50/70 flex flex-col overflow-hidden">
              {/* Top Quick Actions */}
              <div className="p-3.5 bg-white border-b border-slate-200 space-y-2.5 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider font-mono">
                    Customer Bill Counters ({billDrafts.length})
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {initialCartItems.length > 0 && activeDraft && (
                      <button
                        type="button"
                        onClick={() => {
                          updateDraft(activeDraft.draftId, (d) => ({
                            ...d,
                            items: initialCartItems.map((it) => ({ ...it }))
                          }));
                          triggerNotification("Imported current POS cart into active bill!", "success");
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Import Cart
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowCustomerPicker((v) => !v)}
                      className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" />
                      Pick Multiple Customers
                    </button>
                    <button
                      type="button"
                      onClick={handleCloneItemsToAllBills}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      title="Copy active bill items to every open customer bill"
                    >
                      <Copy className="w-3 h-3" />
                      Clone Items to All
                    </button>
                    <button
                      type="button"
                      onClick={handleAddBillTab}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      New Bill
                    </button>
                  </div>
                </div>

                {/* Multi-Customer Quick Picker Panel */}
                {showCustomerPicker && (
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-purple-950">
                        Select Registered Customers to Open Simultaneous Bills
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowCustomerPicker(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                    <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {customers.map((c) => {
                        const checked = pickedCustomerIds.includes(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() =>
                              setPickedCustomerIds((prev) =>
                                checked ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                              )
                            }
                            className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs cursor-pointer transition-colors ${
                              checked
                                ? "bg-purple-600 text-white border-purple-600"
                                : "bg-white text-slate-800 border-purple-200 hover:bg-purple-50"
                            }`}
                          >
                            {checked ? (
                              <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="truncate font-semibold">
                              {c.name} ({c.phone})
                            </span>
                          </button>
                        );
                      })}
                      {customers.length === 0 && (
                        <p className="text-xs text-slate-500 col-span-2">No registered customers yet.</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-purple-200">
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cloneActiveItemsOnPick}
                          onChange={(e) => setCloneActiveItemsOnPick(e.target.checked)}
                          className="accent-purple-600"
                        />
                        Pre-fill selected bills with active bill items
                      </label>
                      <button
                        type="button"
                        onClick={handleAddPickedCustomers}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Create {pickedCustomerIds.length} Customer Bills
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer Bill Tabs Strip */}
                <div className="flex flex-wrap gap-1.5">
                  {billDrafts.map((d, idx) => {
                    const { grandTotal } = computeDraftTotals(d);
                    const isSelected = activeDraft?.draftId === d.draftId;
                    const isGenerated = Boolean(d.generatedInvoice);
                    return (
                      <div
                        key={d.draftId}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : isGenerated
                            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                        onClick={() => setActiveDraftId(d.draftId)}
                      >
                        <Receipt
                          className={`w-3.5 h-3.5 ${
                            isSelected
                              ? "text-emerald-400"
                              : isGenerated
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        />
                        <div className="leading-tight">
                          <div className="font-bold max-w-[135px] truncate flex items-center gap-1">
                            <span>#{idx + 1}</span>
                            <span>{d.customerName.trim() || "Walk-in"}</span>
                            {isGenerated && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">
                                PAID
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-[10px] font-mono ${
                              isSelected ? "text-emerald-300" : isGenerated ? "text-emerald-700" : "text-slate-500"
                            }`}
                          >
                            {isGenerated
                              ? `${d.generatedInvoice?.id} • ${currency}${d.generatedInvoice?.grandTotal.toFixed(0)}`
                              : `${d.items.reduce((s, it) => s + it.quantity, 0)} items • ${currency}${grandTotal.toFixed(0)}`}
                          </div>
                        </div>
                        {billDrafts.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveBillTab(d.draftId);
                            }}
                            className="p-0.5 rounded hover:bg-rose-500 hover:text-white cursor-pointer text-slate-400"
                            title="Remove bill"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Product Catalog Search & Quick Add */}
              <div className="p-3.5 border-b border-slate-200 bg-white shrink-0">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by Name, SKU, or Barcode..."
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 content-start">
                {filteredProducts.map((prod) => {
                  const totalBranchStock = getProductStock(prod);
                  const allocated = allocatedByProduct[prod.id] || 0;
                  const remaining = Math.max(0, totalBranchStock - allocated);
                  const canAddToActive = Boolean(activeDraft && !activeDraft.generatedInvoice && remaining > 0);
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      disabled={!canAddToActive}
                      onClick={() => activeDraft && handleAddProductToDraft(prod, activeDraft.draftId)}
                      className="bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 disabled:opacity-45 disabled:cursor-not-allowed rounded-xl p-3 flex flex-col justify-between gap-2 shadow-2xs text-left cursor-pointer transition-all"
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-tight line-clamp-2">
                            {prod.name}
                          </h4>
                          <span className="text-xs font-mono font-black text-emerald-700 shrink-0">
                            {currency}
                            {prod.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1.5">
                          <span>SKU: {prod.sku}</span>
                          <span className={remaining <= 2 ? "text-rose-600 font-bold" : "text-slate-600"}>
                            Avail: {remaining}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: ACTIVE CUSTOMER BILL DETAILS & INDEPENDENT/BATCH CHECKOUT (6 COLS) */}
            <div className="col-span-12 lg:col-span-6 bg-white flex flex-col overflow-hidden">
              {modalNotice && (
                <div className="mx-4 mt-3 px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900">
                  {modalNotice}
                </div>
              )}

              {activeDraft && activeDraft.generatedInvoice ? (
                /* INDIVIDUAL GENERATED INVOICE & RECEIPT VIEW FOR THIS COUNTER */
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                  <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                    <div>
                      <span className="text-[10px] font-mono font-black text-emerald-800 uppercase">
                        Individual Bill #{billDrafts.findIndex((d) => d.draftId === activeDraft.draftId) + 1} Finalized
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        {activeDraft.generatedInvoice.id} • {activeDraft.generatedInvoice.customerName}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleResetCounterToNewCustomer(activeDraft.draftId)}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        New Customer
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!activeDraft.generatedInvoice) return;
                          await saveElementAsPDF(
                            `single-counter-receipt-${activeDraft.generatedInvoice.id}`,
                            `${activeDraft.generatedInvoice.id}.pdf`,
                            printerConfig.layoutProfile
                          );
                          triggerNotification("Downloaded individual customer receipt PDF!", "success");
                        }}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          activeDraft.generatedInvoice &&
                          onPrintBatchElement(
                            `single-counter-receipt-${activeDraft.generatedInvoice.id}`,
                            activeDraft.generatedInvoice.id
                          )
                        }
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3 text-emerald-400" />
                        Print Receipt
                      </button>
                    </div>
                  </div>

                  {printSandboxNotice && (
                    <div className="mx-4 mt-3 p-2.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-amber-900">
                        Open Direct Print Window to print this invoice:
                      </span>
                      <a
                        href={printTabUrl}
                        target="expertpos_print_station"
                        rel="noopener noreferrer"
                        onMouseDown={() =>
                          activeDraft.generatedInvoice &&
                          onPrepareBatchSnapshot(
                            `single-counter-receipt-${activeDraft.generatedInvoice.id}`,
                            activeDraft.generatedInvoice.id
                          )
                        }
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Direct Print
                      </a>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start">
                    <div className="w-full max-w-sm">
                      {renderOfficialReceiptCard(
                        activeDraft.generatedInvoice,
                        true,
                        `single-counter-receipt-${activeDraft.generatedInvoice.id}`,
                        false
                      )}
                    </div>
                  </div>
                </div>
              ) : activeDraft ? (
                <>
                  {/* Customer Info for Selected Bill */}
                  <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-2.5 shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
                        Customer Details — Bill #
                        {billDrafts.findIndex((d) => d.draftId === activeDraft.draftId) + 1}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-700">
                        {activeDraft.items.length} line item(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={activeDraft.customerId}
                        onChange={(e) => {
                          const cust = customers.find((c) => c.id === e.target.value);
                          updateDraft(activeDraft.draftId, (d) => ({
                            ...d,
                            customerId: cust?.id || "",
                            customerName: cust ? cust.name : "",
                            customerPhone: cust ? cust.phone : ""
                          }));
                        }}
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600"
                      >
                        <option value="">-- Walk-in Guest --</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.phone})
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={activeDraft.customerName}
                        onChange={(e) =>
                          updateDraft(activeDraft.draftId, (d) => ({ ...d, customerName: e.target.value }))
                        }
                        placeholder="Customer Name"
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 outline-none focus:border-emerald-600"
                      />

                      <input
                        type="text"
                        value={activeDraft.customerPhone}
                        maxLength={15}
                        onChange={(e) => {
                          const val = e.target.value;
                          const norm = val.replace(/\D/g, "");
                          const matched =
                            norm.length >= 10
                              ? customers.find((c) => {
                                  const pNorm = c.phone.replace(/\D/g, "");
                                  return pNorm.endsWith(norm) || norm.endsWith(pNorm);
                                })
                              : undefined;
                          updateDraft(activeDraft.draftId, (d) => ({
                            ...d,
                            customerPhone: val,
                            customerId: matched ? matched.id : d.customerId,
                            customerName: matched ? matched.name : d.customerName
                          }));
                        }}
                        placeholder="Mobile Number"
                        className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Active Bill Product Line Items */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                    {activeDraft.items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-6 space-y-2">
                        <ShoppingCart className="w-10 h-10 stroke-1 opacity-60" />
                        <p className="text-xs font-semibold">
                          No items in this customer's bill yet.
                          <br />
                          Click any product on the left to add items to Bill #{billDrafts.findIndex((d) => d.draftId === activeDraft.draftId) + 1}.
                        </p>
                      </div>
                    ) : (
                      activeDraft.items.map((it) => (
                        <div
                          key={it.productId}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/40"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{it.name}</p>
                            <p className="text-[10px] font-mono text-slate-500">
                              {currency}
                              {it.price.toFixed(2)} / {it.unit} • Tax {it.gstRate}%
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateDraftItemQty(activeDraft.draftId, it.productId, -1)}
                              className="w-6 h-6 rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold text-slate-900">
                              {it.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateDraftItemQty(activeDraft.draftId, it.productId, 1)}
                              className="w-6 h-6 rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-[70px]">
                            <div className="text-xs font-mono font-black text-slate-900">
                              {currency}
                              {it.subtotal.toFixed(2)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateDraft(activeDraft.draftId, (d) => ({
                                ...d,
                                items: d.items.filter((x) => x.productId !== it.productId)
                              }))
                            }
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}

                    {/* BILLER DETAILS SECTION UNDER PRODUCT ITEMS IN EACH CUSTOMER'S BILL */}
                    <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider font-mono">
                          Biller Details — Bill #{billDrafts.findIndex((d) => d.draftId === activeDraft.draftId) + 1}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-600">
                          {activeDraft.billerRole} • GSTIN: {gstinValue}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                            Biller / Cashier Name
                          </label>
                          <div className="flex gap-1.5">
                            {uniqueBillerOptions.length > 1 && (
                              <select
                                value={
                                  uniqueBillerOptions.some(
                                    (b) => b.name.toLowerCase() === activeDraft.billerName.toLowerCase()
                                  )
                                    ? activeDraft.billerName
                                    : "__custom__"
                                }
                                onChange={(e) => {
                                  if (e.target.value === "__custom__") return;
                                  const match = uniqueBillerOptions.find((b) => b.name === e.target.value);
                                  updateDraft(activeDraft.draftId, (d) => ({
                                    ...d,
                                    billerName: e.target.value,
                                    billerRole: match?.role || d.billerRole
                                  }));
                                }}
                                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 outline-none focus:border-emerald-600 max-w-[130px]"
                              >
                                {uniqueBillerOptions.map((b) => (
                                  <option key={b.name} value={b.name}>
                                    {b.name}
                                  </option>
                                ))}
                                <option value="__custom__">Custom</option>
                              </select>
                            )}
                            <input
                              type="text"
                              value={activeDraft.billerName}
                              onChange={(e) =>
                                updateDraft(activeDraft.draftId, (d) => ({ ...d, billerName: e.target.value }))
                              }
                              placeholder="Enter biller name"
                              className="flex-1 min-w-0 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                            />
                          </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] leading-snug">
                          <div className="font-bold text-slate-900 truncate">
                            {activeTenant.name} ({billerBranchLabel})
                          </div>
                          <div className="text-[10px] font-mono text-slate-600 truncate">
                            Contact: {billerPhone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Bill Coupon + Payment Mode + Total + Individual Generation */}
                  {(() => {
                    const totals = computeDraftTotals(activeDraft);
                    const activeIdx = billDrafts.findIndex((d) => d.draftId === activeDraft.draftId) + 1;
                    const isGeneratingThis = submittingDraftId === activeDraft.draftId;
                    return (
                      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={activeDraft.couponCode}
                              onChange={(e) =>
                                updateDraft(activeDraft.draftId, (d) => ({ ...d, couponCode: e.target.value }))
                              }
                              placeholder="Coupon (WELCOME5 / FESTIVE10)"
                              className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyCouponToDraft(activeDraft.draftId)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Apply
                            </button>
                          </div>

                          <div className="grid grid-cols-4 gap-1">
                            {Object.values(PaymentMode).map((pm) => (
                              <button
                                key={pm}
                                type="button"
                                onClick={() =>
                                  updateDraft(activeDraft.draftId, (d) => ({ ...d, paymentMode: pm }))
                                }
                                className={`py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                                  activeDraft.paymentMode === pm
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                                }`}
                              >
                                {pm.replace("_", " ")}
                              </button>
                            ))}
                          </div>
                        </div>

                        {activeDraft.paymentMode === PaymentMode.CASH && (
                          <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-slate-200">
                            <span className="text-[11px] font-mono font-bold text-slate-600">
                              Cash Tendered (Target {currency}
                              {totals.grandTotal.toFixed(2)}):
                            </span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={activeDraft.cashReceived}
                                onChange={(e) =>
                                  updateDraft(activeDraft.draftId, (d) => ({
                                    ...d,
                                    cashReceived: e.target.value
                                  }))
                                }
                                placeholder={totals.grandTotal.toFixed(2)}
                                className="w-28 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold text-right"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateDraft(activeDraft.draftId, (d) => ({
                                    ...d,
                                    cashReceived: totals.grandTotal.toFixed(2)
                                  }))
                                }
                                className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold cursor-pointer"
                              >
                                Exact
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pt-1 border-t border-slate-200">
                          <span className="text-slate-600">
                            Bill #{activeIdx} Payable:{" "}
                            <strong className="text-slate-900 text-sm">
                              {currency}
                              {totals.grandTotal.toFixed(2)}
                            </strong>
                            {activeDraft.discountPercent > 0 && (
                              <span className="text-emerald-700 ml-1.5">
                                (-{activeDraft.discountPercent}%)
                              </span>
                            )}
                          </span>

                          <button
                            type="button"
                            disabled={isGeneratingThis || isSubmitting || activeDraft.items.length === 0}
                            onClick={() => handleGenerateSingleBillAndReceipt(activeDraft.draftId)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                            {isGeneratingThis
                              ? `Generating Bill #${activeIdx}...`
                              : `Generate Bill #${activeIdx} & Receipt`}
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : null}

              {/* Bottom Simultaneous Checkout Bar */}
              <div className="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="text-xs font-mono">
                  <span className="text-slate-300">Pending Ready:</span>{" "}
                  <strong className="text-emerald-400">
                    {batchSummary.readyCount} Customer Bill{batchSummary.readyCount === 1 ? "" : "s"}
                  </strong>{" "}
                  <span className="text-slate-400">
                    ({batchSummary.totalUnits} units • {currency}
                    {batchSummary.totalRevenue.toFixed(2)})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    {generatedInvoices.length > 0 ? "Done" : "Cancel"}
                  </button>
                  {generatedInvoices.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveView("receipts")}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Receipts ({generatedInvoices.length})
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isSubmitting || Boolean(submittingDraftId) || batchSummary.readyCount === 0}
                    onClick={handleGenerateAllBillsAndReceipts}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-black inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <CreditCard className="w-4 h-4" />
                    {isSubmitting
                      ? "Generating Bills..."
                      : `Generate All ${batchSummary.readyCount} Bills & Receipts`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
