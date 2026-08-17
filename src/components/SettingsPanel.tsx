import React, { useState, useEffect } from "react";
import { 
  User, Store, Printer, Database, Save, HelpCircle, 
  Volume2, VolumeX, RefreshCw, Trash2, Key, List, 
  Settings, CheckCircle, Smartphone, Globe, Plus, Trash, Users,
  Eye, Edit, X, Check, Mail, Lock, ShieldAlert,
  Sliders, Briefcase, Package, Clock, Plug, Layout, Zap, Percent, Cpu, Laptop, ChevronRight, Receipt, DollarSign,
  Upload, Image as ImageIcon, Building, RotateCcw, Camera, Sparkles
} from "lucide-react";
import { UserRole, normalizeUserRole, Tenant, Product, Customer, Invoice, Expense, Supplier, StoreBranch } from "../types";

export interface AppSettings {
  autoPrintReceipt: boolean;
  enableSound: boolean;
  receiptHeader: string;
  receiptFooter: string;
  maxDiscountAllowed: number;
}

interface SettingsPanelProps {
  currentUserEmail: string;
  currentRole: UserRole;
  currentCashierName: string;
  onUpdateCashierName: (name: string) => void;
  credentialsList: any[];
  onUpdateCredentials: (newList: any[]) => void;
  activeTenant: Tenant;
  onUpdateTenant: (updatedTenant: Tenant) => void;
  opsSettings?: AppSettings;
  onUpdateOpsSettings?: (settings: AppSettings) => void;
  triggerNotification: (msg: string, type: "success" | "warning") => void;
  productCategories: string[];
  onUpdateProductCategories: (categories: string[]) => void;
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, "id"> & { id?: string }) => Promise<void>;
  onDeleteSupplier: (id: string) => Promise<void>;
  branches: StoreBranch[];
  onAddBranch: (branch: Omit<StoreBranch, "id"> & { id?: string }) => Promise<void>;
  onDeleteBranch: (id: string) => Promise<void>;
  currentBranch?: StoreBranch | null;
  onSwitchBranch?: (branchId: string) => void;
}

export default function SettingsPanel({
  currentUserEmail,
  currentRole,
  currentCashierName,
  onUpdateCashierName,
  credentialsList,
  onUpdateCredentials,
  activeTenant,
  onUpdateTenant,
  opsSettings: propOpsSettings,
  onUpdateOpsSettings,
  triggerNotification,
  productCategories,
  onUpdateProductCategories,
  suppliers,
  onAddSupplier,
  onDeleteSupplier,
  branches,
  onAddBranch,
  onDeleteBranch,
  currentBranch,
  onSwitchBranch
 }: SettingsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "tenant" | "categories" | "suppliers" | "branches" | "pos" | "system" | "enterprise">("profile");

  // --- Enterprise settings states ---
  const [enterpriseSettings, setEnterpriseSettings] = useState({
    // A. Business Settings
    companyName: "Expert POS Solutions",
    businessLocations: "Main Street HQ, Branch Block A, South Logistics Port",
    aivoviaActive: true,
    businessGoals: "Achieve 10,000 transactions/month, 99.9% printer uptime",

    // B. Localisation
    systemCurrency: "INR (₹) - Indian Rupee",
    systemLanguage: "English (Global), Hindi (Standard)",
    systemDateFormat: "DD-MM-YYYY HH:mm:ss",
    systemTheme: "Elegant Light Mint Theme",

    // C. Miscellaneous Settings
    softwareVersion: "v4.12.0-stable (Enterprise build)",
    emailSmtpServer: "smtp.expertpos-billing.net:587",
    transactionCategoryList: "Sales, Returns, Restocking, Vendor Settlement, Petty Cash",
    emailAlertsEnabled: true,
    aboutText: "SaaS Enterprise ERP platform with localized Indian taxation modules.",

    // D. Advanced Settings
    restApiEnabled: true,
    cronJobSchedule: "0 0 * * * (Every midnight UTC)",
    customFieldsCount: 4,
    dualEntryEnabled: true,
    activityLogRetention: 180,
    debugModeActive: false,

    // E. Billing Settings
    billingGracePeriod: 14,
    discountAllowedMax: 25,
    invoicePrefix: "INV-EP-2026-",
    billingTermsText: "Net 15 days. 2% interest per month on delayed payments.",
    autoSmsEnabled: true,
    defaultWarehouseCode: "WH-SOUTH-01",
    posStyleVariant: "Dual Column Layout with Split Bill controls",

    // F. Tax Settings
    systemGstRate: 18,
    otherTaxActive: false,

    // G. Product Settings
    defaultUnit: "PCS - Pieces",
    variationActive: true,
    variationVariablesCount: 5,

    // H. Payment Settings
    paymentGateway: "Razorpay Enterprise API Gateway",
    supportedCurrencies: "INR, USD, EUR",
    exchangeRateSync: true,
    bankAccountName: "State Bank of India (A/C ...8901)",

    // I. CRM & HRM Settings
    selfAttendanceEnabled: true,
    crmLeadTracking: true,
    securityAccessLevel: "High - MFA & SHA256 Device Signatures Required",
    supportTicketUptime: "2 Hours SLA target",

    // J. Plugins Settings
    recaptchaKey: "6Lcxxxxxxxxxxxxxxxxxxxxxxxxx",
    urlShortenerUrl: "https://shrt.expertpos.in/api",
    smsGatewayProvider: "Twilio Enterprise SMS Router",
    currencyExchangeApiKey: "ex_api_live_xxxxxxxxxxx",

    // K. Templates Settings
    emailTemplateBody: "Dear {customer_name}, thank you for shopping at Expert POS. Your invoice {invoice_no} total is {invoice_total}.",
    smsTemplateBody: "Txn Alert: Paid {amount} on {date}. Ref: {invoice_no}.",
    printInvoiceTemplate: "Classic Thermal 80mm Layout with Custom GST breakdown",
    templateThemeAccent: "#2563EB",

    // L. POS Printers
    posPrinterName: "Epson TM-T88VI Thermal Receipt Printer",
    activePrintersList: "PRN-OFFICE-01 (Active), PRN-WAREHOUSE-02 (Offline)"
  });

  const [activeSettingsItem, setActiveSettingsItem] = useState<{
    catId: string;
    itemId: string;
    itemLabel: string;
  } | null>(null);

  const [enterpriseNotification, setEnterpriseNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const triggerEnterpriseNotification = (msg: string, type: "success" | "error" | "info" = "success") => {
    setEnterpriseNotification({ message: msg, type });
    setTimeout(() => {
      setEnterpriseNotification(null);
    }, 4000);
  };

  // --- Profile state variables ---
  const [profName, setProfName] = useState(currentCashierName);
  const [profEmail, setProfEmail] = useState(currentUserEmail);
  const [profPassword, setProfPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Category state variables ---
  const [newCategoryName, setNewCategoryName] = useState("");
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const startEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setEditCategoryName(cat);
  };

  const handleSaveEditedCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const catToSave = editCategoryName.trim();
    if (!catToSave) {
      triggerNotification("Category bracket name cannot be empty.", "warning");
      return;
    }
    if (catToSave.toLowerCase() !== editingCategory.toLowerCase() && 
        productCategories.some(c => c.toLowerCase() === catToSave.toLowerCase())) {
      triggerNotification("This category range already exists.", "warning");
      return;
    }

    const updated = productCategories.map(c => c === editingCategory ? catToSave : c);
    onUpdateProductCategories(updated);
    setEditingCategory(null);
    triggerNotification(`Successfully updated category bracket to "${catToSave}"!`, "success");
  };

  // --- Supplier state variables ---
  const [supName, setSupName] = useState("");
  const [supContact, setSupContact] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [supGstin, setSupGstin] = useState("");

  // Interactive supplier options states
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editSupName, setEditSupName] = useState("");
  const [editSupContact, setEditSupContact] = useState("");
  const [editSupPhone, setEditSupPhone] = useState("");
  const [editSupEmail, setEditSupEmail] = useState("");
  const [editSupGstin, setEditSupGstin] = useState("");
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const startEditSupplier = (sup: Supplier) => {
    setEditingSupplier(sup);
    setEditSupName(sup.name);
    setEditSupContact(sup.contact);
    setEditSupPhone(sup.phone);
    setEditSupEmail(sup.email);
    setEditSupGstin(sup.gstin);
  };

  const handleSaveEditedSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;
    if (!editSupName.trim()) {
      triggerNotification("Supplier corporate name is required.", "warning");
      return;
    }

    const nameExists = suppliers?.some(
      (s) => s.id !== editingSupplier.id && s.name.toLowerCase() === editSupName.trim().toLowerCase()
    );
    if (nameExists) {
      triggerNotification("Another supplier with this name is already registered.", "warning");
      return;
    }

    try {
      await onAddSupplier({
        id: editingSupplier.id,
        name: editSupName.trim(),
        contact: editSupContact.trim(),
        phone: editSupPhone.trim(),
        email: editSupEmail.trim().toLowerCase(),
        gstin: editSupGstin.trim().toUpperCase()
      });
      setEditingSupplier(null);
      triggerNotification(`Successfully updated registry for ${editSupName}!`, "success");
    } catch (e) {
      triggerNotification("Could not update supplier partner information.", "warning");
    }
  };

  // --- Branch state variables ---
  const [brName, setBrName] = useState("");
  const [brAddress, setBrAddress] = useState("");
  const [brCity, setBrCity] = useState("");
  const [brPhone, setBrPhone] = useState("");

  const [viewingBranch, setViewingBranch] = useState<StoreBranch | null>(null);
  const [editingBranch, setEditingBranch] = useState<StoreBranch | null>(null);
  const [editBrName, setEditBrName] = useState("");
  const [editBrAddress, setEditBrAddress] = useState("");
  const [editBrCity, setEditBrCity] = useState("");
  const [editBrPhone, setEditBrPhone] = useState("");
  const [deletingBranch, setDeletingBranch] = useState<StoreBranch | null>(null);

  const startEditBranch = (b: StoreBranch) => {
    setEditingBranch(b);
    setEditBrName(b.name);
    setEditBrAddress(b.address);
    setEditBrCity(b.city);
    setEditBrPhone(b.phone || "");
  };

  const handleSaveEditedBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;
    const name = editBrName.trim();
    const address = editBrAddress.trim();
    const city = editBrCity.trim();
    const phone = editBrPhone.trim();

    if (!name) {
      triggerNotification("Please provide a store/branch name.", "warning");
      return;
    }
    if (!address || !city) {
      triggerNotification("Please specify the branch's local address and city.", "warning");
      return;
    }

    const nameExists = branches?.some(
      (b) => b.id !== editingBranch.id && b.name.toLowerCase() === name.toLowerCase()
    );
    if (nameExists) {
      triggerNotification("Another branch with this location name is already registered.", "warning");
      return;
    }

    try {
      await onAddBranch({
        id: editingBranch.id,
        name,
        address,
        city,
        phone
      });
      setEditingBranch(null);
      triggerNotification(`Successfully updated brand branch "${name}"!`, "success");
    } catch (err) {
      triggerNotification("Failed to update branch params.", "warning");
    }
  };

  // Tenant corporate state variables
  const [tenantName, setTenantName] = useState(activeTenant.name);
  const [tenantEmail, setTenantEmail] = useState(activeTenant.adminEmail || "");
  const [tenantPhone, setTenantPhone] = useState(activeTenant.phone || "");
  const [tenantGstin, setTenantGstin] = useState(activeTenant.gstinRegNumber || "");
  const [tenantSubdomain, setTenantSubdomain] = useState(activeTenant.subdomain);
  const [tenantCurrency, setTenantCurrency] = useState(activeTenant.currency);
  const [tenantTheme, setTenantTheme] = useState(activeTenant.colorTheme);
  const [tenantLogo, setTenantLogo] = useState(activeTenant.companyLogo || "");
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isSavingTenant, setIsSavingTenant] = useState(false);

  const logoFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const lastLoadedTenantIdRef = React.useRef<string>(activeTenant?.id);

  const isAdmin = normalizeUserRole(currentRole) === UserRole.ADMIN || String(currentRole).toUpperCase().includes("ADMIN") || currentUserEmail.toLowerCase().includes("admin");

  // --- POS Operational state variables ---
  const [opsSettings, setOpsSettings] = useState<AppSettings>(() => {
    if (propOpsSettings) return propOpsSettings;
    const saved = localStorage.getItem("expert_aid_terminal_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback default
      }
    }
    return {
      autoPrintReceipt: true,
      enableSound: true,
      receiptHeader: "OFFICIAL RETAIL CASH INVOICE",
      receiptFooter: "Thank you for shopping! Powered by Expert POS SaaS",
      maxDiscountAllowed: 25
    };
  });

  useEffect(() => {
    if (propOpsSettings) {
      setOpsSettings(propOpsSettings);
    }
  }, [propOpsSettings]);

  // Database stats state
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    invoices: 0,
    expenses: 0,
    storageSizeKb: 0
  });

  useEffect(() => {
    // Load local storage item counts
    const productsSaved = localStorage.getItem("expert_aid_products") || "[]";
    const customersSaved = localStorage.getItem("expert_aid_customers") || "[]";
    const invoicesSaved = localStorage.getItem("expert_aid_invoices") || "[]";
    const expensesSaved = localStorage.getItem("expert_aid_expenses") || "[]";

    let size = 0;
    try {
      size = parseFloat(((JSON.stringify(localStorage).length) / 1024).toFixed(2));
    } catch (_) {}

    try {
      setStats({
        products: JSON.parse(productsSaved).length,
        customers: JSON.parse(customersSaved).length,
        invoices: JSON.parse(invoicesSaved).length,
        expenses: JSON.parse(expensesSaved).length,
        storageSizeKb: size
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Sync profile details when user changes
  useEffect(() => {
    setProfName(currentCashierName);
    setProfEmail(currentUserEmail);
    const existingCred = credentialsList.find(c => c.email === currentUserEmail);
    if (existingCred) {
      setProfPassword(existingCred.password || "");
    }
  }, [currentCashierName, currentUserEmail]);

  // Sync tenant details when activeTenant changes
  useEffect(() => {
    if (activeTenant) {
      lastLoadedTenantIdRef.current = activeTenant.id;
      setTenantName(activeTenant.name);
      setTenantEmail(activeTenant.adminEmail || "");
      setTenantPhone(activeTenant.phone || "");
      setTenantGstin(activeTenant.gstinRegNumber || "");
      setTenantSubdomain(activeTenant.subdomain);
      setTenantCurrency(activeTenant.currency);
      setTenantTheme(activeTenant.colorTheme);
      setTenantLogo(activeTenant.companyLogo || "");
    }
  }, [
    activeTenant?.id,
    activeTenant?.name,
    activeTenant?.adminEmail,
    activeTenant?.phone,
    activeTenant?.gstinRegNumber,
    activeTenant?.companyLogo,
    activeTenant?.colorTheme,
    activeTenant?.currency
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName.trim()) {
      triggerNotification("Profile Name cannot be blank.", "warning");
      return;
    }

    // 1. Update the master states
    onUpdateCashierName(profName.trim());

    // 2. Update the credentials list so password & name are persisted correctly
    const updatedList = credentialsList.map(c => {
      if (c.email === currentUserEmail) {
        return {
          ...c,
          name: profName.trim(),
          password: profPassword.trim() || c.password
        };
      }
      return c;
    });

    onUpdateCredentials(updatedList);
    localStorage.setItem("expert_aid_credentials", JSON.stringify(updatedList));

    triggerNotification("Your security credentials & user profile settings updated successfully!", "success");
  };

  const handleSaveTenant = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAdmin) {
      triggerNotification("Access Denied: Company details and store configurations are restricted to Administrators.", "warning");
      return;
    }

    if (!tenantName.trim()) {
      triggerNotification("Company name cannot be empty.", "warning");
      return;
    }

    setIsSavingTenant(true);

    const updatedTenant: Tenant = {
      ...activeTenant,
      name: tenantName.trim(),
      adminEmail: tenantEmail.trim(),
      phone: tenantPhone.trim(),
      gstinRegNumber: tenantGstin.trim().toUpperCase(),
      subdomain: tenantSubdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, ""),
      currency: tenantCurrency,
      colorTheme: tenantTheme,
      companyLogo: tenantLogo.trim()
    };

    onUpdateTenant(updatedTenant);
    triggerNotification("Company details, settings, and branding logo saved successfully!", "success");
    setTimeout(() => setIsSavingTenant(false), 600);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      triggerNotification("Image file size should be less than 5MB.", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setTenantLogo(result);
        triggerNotification("Company logo uploaded successfully! Click 'Save Company Details & Logo' to apply.", "success");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    if (!isAdmin) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      triggerNotification("Please drop a valid image file (PNG, JPG, SVG, WebP).", "warning");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      triggerNotification("Image file size should be less than 5MB.", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setTenantLogo(result);
        triggerNotification("Company logo dropped and loaded! Click 'Save Company Details & Logo' to apply.", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePOSSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("expert_aid_terminal_settings", JSON.stringify(opsSettings));
    onUpdateOpsSettings?.(opsSettings);
    triggerNotification("Point of Sale (POS) operational terminal preferences saved!", "success");
    
    // Broadcast setting changes for receipt rendering and sound configs
    window.dispatchEvent(new Event("expert_aid_settings_updated"));
  };

  const handleExportBackup = () => {
    const backupData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("expert_aid_")) {
        try {
          backupData[key] = localStorage.getItem(key);
        } catch (_) {}
      }
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expertpos_${activeTenant.subdomain}_backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerNotification("Database backup file downloaded! Keep this safe for secure rollbacks.", "success");
  };

  const handleClearSystemData = () => {
    setShowClearConfirm(true);
  };

  const executeClearSystemData = () => {
    // Keys to remove
    const keysToRemove = [
      "expert_aid_products",
      "expert_aid_customers",
      "expert_aid_invoices",
      "expert_aid_expenses",
      "expert_aid_adjustments"
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));

    triggerNotification("All transactions, CRM files, and products cleared. Reloading core values...", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 text-slate-800 font-sans shadow-md">
      {/* Upper Hub Section */}
      <div className="flex flex-col pb-6 border-b border-slate-200 gap-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 font-display leading-tight tracking-tight">
            <Settings className="w-6 h-6 text-slate-500" />
            <span>Workspace Operations Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure credentials, branding, default margins, sound cues, and offline system database backups.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start shrink-0 select-none overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab("profile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSubTab === "profile" ? "bg-white text-slate-900 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" /> My Profile
          </button>
          <button
            onClick={() => setActiveSubTab("tenant")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSubTab === "tenant" ? "bg-white text-slate-900 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Store Settings
          </button>
          <button
            onClick={() => setActiveSubTab("branches")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSubTab === "branches" ? "bg-white text-slate-900 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Store Branches
          </button>
          <button
            onClick={() => setActiveSubTab("categories")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSubTab === "categories" ? "bg-white text-slate-900 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <List className="w-3.5 h-3.5" /> Product Categories
          </button>
          <button
            onClick={() => setActiveSubTab("suppliers")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSubTab === "suppliers" ? "bg-white text-slate-900 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Vendors &amp; Suppliers
          </button>
          <button
            onClick={() => setActiveSubTab("pos")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSubTab === "pos" ? "bg-white text-slate-900 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Printer className="w-3.5 h-3.5" /> POS Preferences
          </button>
          <button
            onClick={() => setActiveSubTab("system")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSubTab === "system" ? "bg-white text-slate-900 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Data Backup
          </button>
          <button
            onClick={() => setActiveSubTab("enterprise")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeSubTab === "enterprise" ? "bg-white text-slate-900 shadow border border-slate-200/50" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Enterprise Config
          </button>
        </div>
      </div>

      {activeSubTab === "profile" && (
        /* ================= SUB-TAB: USER PROFILE SETTINGS ================= */
        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-700 flex items-center justify-center text-lg font-black shrink-0 border border-purple-200">
                {currentCashierName.substring(0,2).toUpperCase()}
              </div>
              <div>
                <p className="font-extrabold text-sm text-slate-900 leading-snug">{currentCashierName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-700 font-mono select-all shrink-0 bg-white border border-slate-200 px-2 py-0.5 rounded leading-none uppercase font-bold">{currentRole}</span>
                  <p className="text-[10px] text-slate-500 font-medium">{currentUserEmail}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-1.5 font-sans">
                Full Display Name / Identity Signature
              </label>
              <input
                type="text"
                required
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-sans shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-1.5 font-sans">
                Terminal Email Address/ID (Locked for security)
              </label>
              <input
                type="text"
                disabled
                value={profEmail}
                className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl py-2 px-3 text-xs focus:outline-none cursor-not-allowed font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">To update your coordinate email, please request support from the SaaS tenant sovereign.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider font-sans">
                  Change Access Password Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-purple-600 hover:text-purple-800 font-bold"
                >
                  {showPassword ? "Hide password" : "Show password"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new security password to use inside terminals..."
                value={profPassword}
                onChange={(e) => setProfPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-mono shadow-2xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider font-sans whitespace-nowrap"
            >
              <Save className="w-4 h-4 shrink-0" />
              Update Profile Credentials
            </button>
          </div>
        </form>
      )}

      {activeSubTab === "tenant" && (
        /* ================= SUB-TAB: BRANDING AND STORE CONFIG ================= */
        <form onSubmit={handleSaveTenant} className="space-y-6 max-w-3xl">
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs leading-relaxed font-medium flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
              <div>
                <strong className="text-emerald-950 font-bold">Company Profile & Store Settings:</strong> As an Administrator, you can customize your corporate details, store name, GSTIN, currency, and upload your official logo.
              </div>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleSaveTenant()}
                disabled={isSavingTenant}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingTenant ? "Saving..." : "Save Now"}</span>
              </button>
            )}
          </div>

          {/* Company Logo Section */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 font-mono">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                  Company Branding Logo
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Upload or drop your company logo to display across store navigation headers, receipts, invoices, and reports.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {tenantLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      setTenantLogo("");
                      triggerNotification("Company logo removed. Remember to click Save to apply.", "warning");
                    }}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Logo</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              {/* Logo Preview & Drag-Drop Box */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDraggingLogo(true); }}
                onDragLeave={() => setIsDraggingLogo(false)}
                onDrop={handleLogoDrop}
                onClick={() => isAdmin && logoFileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-3 bg-white border-2 border-dashed rounded-xl space-y-2 cursor-pointer transition-all ${
                  isDraggingLogo 
                    ? "border-purple-600 bg-purple-50/50 scale-[1.02]" 
                    : "border-slate-300 hover:border-purple-400 hover:bg-slate-50/50"
                }`}
                title="Click or drag & drop an image to upload logo"
              >
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-[9.5px] font-bold uppercase text-slate-500 tracking-wider">Logo Preview</span>
                  <span className="text-[9px] text-purple-600 font-bold">Click/Drop to upload</span>
                </div>
                <div className="flex gap-3 items-center">
                  {/* Light background preview */}
                  <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 border border-slate-300 shadow-sm flex items-center justify-center overflow-hidden">
                    {tenantLogo ? (
                      <img
                        src={tenantLogo}
                        alt="Company Logo Preview Light"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-slate-800 font-black text-sm uppercase">
                        {tenantName ? tenantName.substring(0, 2) : "LOGO"}
                      </span>
                    )}
                  </div>
                  {/* Dark background preview */}
                  <div className="w-16 h-16 bg-slate-900 rounded-xl p-2 border border-slate-700 shadow-sm flex items-center justify-center overflow-hidden">
                    {tenantLogo ? (
                      <img
                        src={tenantLogo}
                        alt="Company Logo Preview Dark"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-purple-300 font-black text-sm uppercase">
                        {tenantName ? tenantName.substring(0, 2) : "LOGO"}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[8.5px] text-slate-500 italic">Light & Dark display preview</span>
              </div>

              {/* File Upload Controls */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5 font-sans">
                    Upload Logo File (PNG / JPG / SVG / WebP)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp, image/*"
                      disabled={!isAdmin}
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={!isAdmin}
                      onClick={() => logoFileInputRef.current?.click()}
                      className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                        !isAdmin ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Logo File</span>
                    </button>
                    <span className="text-[10px] text-slate-500 font-medium">Supports drag & drop, Max 5MB</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5 font-sans">
                    Or Enter Logo Image URL / Base64 Data
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={tenantLogo}
                    onChange={(e) => setTenantLogo(e.target.value)}
                    placeholder="https://example.com/logo.png or data:image/png..."
                    className={`w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-mono shadow-2xs ${!isAdmin ? "cursor-not-allowed text-slate-500 bg-slate-100" : ""}`}
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 font-sans">
                    Sample Logo Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Retail Mall", url: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=120&auto=format&fit=crop&q=80" },
                      { name: "Electronics", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&auto=format&fit=crop&q=80" },
                      { name: "Grocery Superstore", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80" },
                      { name: "Apparel & Fashion", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80" }
                    ].map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        disabled={!isAdmin}
                        onClick={() => {
                          setTenantLogo(preset.url);
                          triggerNotification(`Selected ${preset.name} sample logo!`, "success");
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <Camera className="w-3 h-3 text-purple-600" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details & Contact Info */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 font-mono">
                <Building className="w-4 h-4 text-emerald-600" />
                Company Details & Contact Information
              </h3>
              {isAdmin && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                  Editing Enabled (Admin)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5 font-sans">
                  Corporate Company / Store Name *
                </label>
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Company / Store Name"
                  className={`w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-medium font-sans shadow-2xs ${!isAdmin ? "cursor-not-allowed text-slate-500 bg-slate-100" : ""}`}
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5 font-sans">
                  Contact Email Address *
                </label>
                <input
                  type="email"
                  required
                  disabled={!isAdmin}
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className={`w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-mono shadow-2xs ${!isAdmin ? "cursor-not-allowed text-slate-500 bg-slate-100" : ""}`}
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5 font-sans">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className={`w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-mono shadow-2xs ${!isAdmin ? "cursor-not-allowed text-slate-500 bg-slate-100" : ""}`}
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5 font-sans">
                  GSTIN / Tax Reg. Number
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={tenantGstin}
                  onChange={(e) => setTenantGstin(e.target.value)}
                  placeholder="07AAAAA1111A1Z1"
                  className={`w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-mono uppercase font-semibold shadow-2xs ${!isAdmin ? "cursor-not-allowed text-slate-500 bg-slate-100" : ""}`}
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5 font-sans">
                  Corporate Domain Gateway
                </label>
                <div className="flex items-center bg-white border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-600 overflow-hidden font-sans shadow-2xs">
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={tenantSubdomain}
                    onChange={(e) => setTenantSubdomain(e.target.value)}
                    placeholder="domain-prefix"
                    className={`flex-1 bg-transparent border-0 text-slate-900 py-2.5 px-3 text-xs focus:outline-none placeholder-slate-400 font-sans ${!isAdmin ? "cursor-not-allowed text-slate-500" : ""}`}
                  />
                  <span className="bg-slate-100 border-l border-slate-300 text-[10px] font-bold text-slate-600 px-3 py-2.5 shrink-0 select-none">
                    .expertpos.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider mb-1.5 font-sans">
                  Base Currency Symbol (Global)
                </label>
                <select
                  disabled={!isAdmin}
                  value={tenantCurrency}
                  onChange={(e) => setTenantCurrency(e.target.value)}
                  className={`w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-sans cursor-pointer shadow-2xs ${!isAdmin ? "cursor-not-allowed text-slate-500 bg-slate-100" : ""}`}
                >
                  <option value="₹">₹ - Indian Rupee (INR)</option>
                  <option value="$">$ - US Dollar (USD)</option>
                  <option value="€">€ - Euro (EUR)</option>
                  <option value="£">£ - British Pound (GBP)</option>
                  <option value="¥">¥ - Japanese Yen (JPY)</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                  <option value="৳">৳ - Bangladeshi Taka (BDT)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theme Palette */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-[11px] text-slate-700 font-bold uppercase tracking-wider font-sans">
              Corporate Palette Hue / Theme Color Accent
            </label>
            <div className="grid grid-cols-5 gap-3 max-w-lg">
              {[
                { id: "emerald", label: "Emerald Green", bg: "bg-emerald-500", text: "text-emerald-600" },
                { id: "indigo", label: "Indigo Mist", bg: "bg-indigo-500", text: "text-indigo-600" },
                { id: "amber", label: "Amber Orange", bg: "bg-amber-500", text: "text-amber-600" },
                { id: "rose", label: "Rose Pink", bg: "bg-rose-500", text: "text-rose-600" },
                { id: "violet", label: "Violet Purple", bg: "bg-purple-500", text: "text-purple-600" }
              ].map((themeOpt) => (
                <button
                  type="button"
                  key={themeOpt.id}
                  disabled={!isAdmin}
                  onClick={() => setTenantTheme(themeOpt.id)}
                  className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all ${
                    tenantTheme === themeOpt.id 
                    ? "bg-white border-purple-600 ring-2 ring-purple-500/20 shadow font-extrabold text-slate-900" 
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full ${themeOpt.bg} shrink-0 shadow-inner`}></span>
                  <span className="text-[9.5px] uppercase tracking-wide truncate max-w-full font-bold">{themeOpt.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {isAdmin ? (
              <button
                type="submit"
                disabled={isSavingTenant}
                className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider font-sans"
              >
                <Save className="w-4 h-4 shrink-0" />
                <span>{isSavingTenant ? "Saving Changes..." : "Save Company Details & Logo"}</span>
              </button>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                🔒 You must log in as terminal <strong className="text-slate-700">ADMIN</strong> or <strong className="text-slate-700">SUPERADMIN</strong> to change company details or upload logos.
              </p>
            )}
          </div>
        </form>
      )}

      {activeSubTab === "categories" && (
        /* ================= SUB-TAB: PRODUCT CATEGORIES BRANDING ================= */
        <div className="space-y-6 max-w-2xl font-sans">
          <div className="p-4 bg-purple-50 text-purple-800 rounded-xl border border-purple-200 text-xs leading-relaxed font-medium mt-2">
            💡 <strong className="text-purple-950 font-bold">Product Categories Manager:</strong> Create and prune product taxonomy brackets. Brackets declared here instantly populate product onboarding registries and listing catalogues.
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Plus className="w-4 h-4 text-purple-600" /> Create Custom Category Range
            </h3>
            
            <div className="flex gap-3 max-w-md">
              <input
                type="text"
                placeholder="e.g. Organic Beverages, Gourmet Chocolates..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const catToAdd = newCategoryName.trim();
                    if (!catToAdd) return;
                    if (productCategories.some(c => c.toLowerCase() === catToAdd.toLowerCase())) {
                      triggerNotification("This category already exists inside taxonomic lists.", "warning");
                      return;
                    }
                    onUpdateProductCategories([...productCategories, catToAdd]);
                    setNewCategoryName("");
                    triggerNotification(`Added custom category bracket "${catToAdd}" successfully!`, "success");
                  }
                }}
                className="flex-1 bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-sans shadow-2xs"
              />
              <button
                type="button"
                onClick={() => {
                  const catToAdd = newCategoryName.trim();
                  if (!catToAdd) {
                    triggerNotification("Please enter a category name first.", "warning");
                    return;
                  }
                  if (productCategories.some(c => c.toLowerCase() === catToAdd.toLowerCase())) {
                    triggerNotification("This category already exists inside taxonomic lists.", "warning");
                    return;
                  }
                  onUpdateProductCategories([...productCategories, catToAdd]);
                  setNewCategoryName("");
                  triggerNotification(`Added custom category bracket "${catToAdd}" successfully!`, "success");
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            <p className="text-[10px] text-slate-500">Press Enter or click Add to save the bracket to inventory defaults.</p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <List className="w-4 h-4 text-purple-600" /> Catalogued Brackets ({productCategories.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {productCategories.map((cat, index) => (
                <div 
                  key={cat + index} 
                  className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between hover:border-slate-300 transition-all shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors text-[10px] font-mono font-bold shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 truncate">{cat}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewingCategory(cat)}
                      className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      title="View category details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => startEditCategory(cat)}
                      className="p-1 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      title="Edit category info"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Delete category range"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "suppliers" && (
        /* ================= SUB-TAB: VENDORS & SUPPLIERS ================= */
        <div className="space-y-6 max-w-4xl font-sans">
          <div className="p-4 bg-purple-50 text-purple-800 rounded-xl border border-purple-200 text-xs leading-relaxed font-medium mt-2">
            💡 <strong className="text-purple-950 font-bold">Vendor & Supplier Hub:</strong> Configure your distribution partner rosters. Registries configured here automatically refresh dynamic item onboarding source listings and inventory cost-of-goods ledgers.
          </div>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const name = supName.trim();
              const contact = supContact.trim();
              const phone = supPhone.trim();
              const email = supEmail.trim();
              const gstin = supGstin.trim();

              if (!name) {
                triggerNotification("Please provide a supplier or corporation name.", "warning");
                return;
              }
              if (!contact) {
                triggerNotification("Please specify a primary contact agent's name.", "warning");
                return;
              }
              if (!phone) {
                triggerNotification("Please record a communication phone number.", "warning");
                return;
              }

              if (suppliers?.some(s => s.name.toLowerCase() === name.toLowerCase())) {
                triggerNotification("A supplier with this name is already registered.", "warning");
                return;
              }

              try {
                await onAddSupplier({ name, contact, phone, email, gstin });
                setSupName("");
                setSupContact("");
                setSupPhone("");
                setSupEmail("");
                setSupGstin("");
                triggerNotification(`Successfully registered "${name}" as a verified distributor partner!`, "success");
              } catch (err) {
                triggerNotification("Failed to upload supplier parameters.", "warning");
              }
            }}
            className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn"
          >
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Plus className="w-4 h-4 text-purple-600" /> Register New Distributor/Vendor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">Company/Vendor Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Supreme Agro Foods Ltd."
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-sans shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">Primary Contact Agent *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-sans shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">Communication Phone *</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-sans shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">Corporate Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. sales@supremeagro.com"
                  value={supEmail}
                  onChange={(e) => setSupEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-sans shadow-2xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">GSTIN / Tax Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. 07AAAAA1111A1Z1"
                  value={supGstin}
                  onChange={(e) => setSupGstin(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 placeholder-slate-400 font-mono uppercase font-semibold shadow-2xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                Register Partner
              </button>
            </div>
          </form>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono pb-2 border-b border-slate-200">
              <Users className="w-4 h-4 text-purple-600" /> Active Vendor & Distributor Partners ({suppliers?.length || 0})
            </h3>

            {(!suppliers || suppliers.length === 0) ? (
              <p className="text-xs text-slate-500 py-6 text-center font-medium">No verified supplier partners registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers.map((sup, index) => (
                  <div 
                    key={sup.id || index}
                    className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group relative"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 pr-24 font-sans">
                          <p className="text-xs font-black text-slate-900 truncate font-sans">{sup.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {sup.id}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 absolute right-3 top-3">
                          <button
                            type="button"
                            onClick={() => setViewingSupplier(sup)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title={`Detailed vendor claims index for ${sup.name}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => startEditSupplier(sup)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title={`Edit vendor record for ${sup.name}`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setDeletingSupplier(sup)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title={`Discard vendor partner ${sup.name}`}
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[10px] text-slate-600 pt-2 border-t border-slate-100">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold">Contact Agent</span>
                          <span className="font-bold text-slate-800">{sup.contact || "—"}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold">Phone No.</span>
                          <span className="font-bold text-slate-800 font-mono">{sup.phone || "—"}</span>
                        </div>
                        {sup.email && (
                          <div className="col-span-2">
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold">Email Address</span>
                            <span className="text-purple-700 font-semibold truncate block max-w-full font-mono">{sup.email}</span>
                          </div>
                        )}
                        {sup.gstin && (
                          <div className="col-span-2">
                            <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold">GSTIN ID</span>
                            <span className="text-slate-900 font-mono uppercase select-all font-semibold">{sup.gstin}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "branches" && (
        /* ================= SUB-TAB: STORE BRANCHES ================= */
        <div className="space-y-6 max-w-4xl font-sans">
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs leading-relaxed font-medium mt-2">
            💡 <strong className="text-emerald-950 font-bold">Multi-Branch System Hub:</strong> Configure your brand's physical location nodes and retail warehouses. Each branch manages its active drawers, local sales, and utility registers independently.
          </div>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const name = brName.trim();
              const address = brAddress.trim();
              const city = brCity.trim();
              const phone = brPhone.trim();

              if (!name) {
                triggerNotification("Please provide a store/branch name.", "warning");
                return;
              }
              if (!address || !city) {
                triggerNotification("Please specify the branch's local address and city.", "warning");
                return;
              }

              if (branches && branches.length >= activeTenant.maxBranches) {
                triggerNotification(`Branch quota limit exceeded (${activeTenant.maxBranches} Nodes max allowed). Please upgrade your subscription tier in Multi-Tenant Super Admin console.`, "warning");
                return;
              }

              if (branches?.some(b => b.name.toLowerCase() === name.toLowerCase())) {
                triggerNotification("A branch with this location name is already registered.", "warning");
                return;
              }

              try {
                await onAddBranch({ name, address, city, phone });
                setBrName("");
                setBrAddress("");
                setBrCity("");
                setBrPhone("");
                triggerNotification(`Successfully provisioned brand branch "${name}"!`, "success");
              } catch (err) {
                triggerNotification("Failed to upload branch parameters.", "warning");
              }
            }}
            className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Plus className="w-4 h-4 text-emerald-600" /> Provision New Location Branch Node
              </h3>
              <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                QUOTA: {branches?.length || 0} / {activeTenant.maxBranches} NODES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">Branch / Outlet Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Westside Express Grocery"
                  value={brName}
                  onChange={(e) => setBrName(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder-slate-400 font-sans shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">Contact Phone No.</label>
                <input
                  type="text"
                  placeholder="e.g. 011-87654321"
                  value={brPhone}
                  onChange={(e) => setBrPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder-slate-400 font-sans shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">Full Physical Address *</label>
                <input
                  type="text"
                  placeholder="e.g. Shop 4, Lotus Circle View Lane"
                  value={brAddress}
                  onChange={(e) => setBrAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder-slate-400 font-sans shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans text-slate-600 font-bold uppercase tracking-wider mb-1.5">Town / City *</label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi"
                  value={brCity}
                  onChange={(e) => setBrCity(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder-slate-400 font-sans shadow-2xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={branches && branches.length >= activeTenant.maxBranches}
                className={`font-bold text-xs py-2.5 px-6 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans whitespace-nowrap ${
                  branches && branches.length >= activeTenant.maxBranches
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Provision Node
              </button>
            </div>
          </form>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono pb-2 border-b border-slate-200">
              <Globe className="w-4 h-4 text-emerald-600" /> Active Branch Nodes ({branches?.length || 0})
            </h3>

            {(!branches || branches.length === 0) ? (
              <p className="text-xs text-slate-500 py-6 text-center font-medium">No store branches registered yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((b, idx) => (
                  <div 
                    key={b.id || idx}
                    className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group relative"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 pr-24 font-sans">
                          <p className="text-xs font-black text-slate-900 truncate font-sans">{b.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Node ID: {b.id}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 absolute right-3 top-3">
                          <button
                            type="button"
                            onClick={() => setViewingBranch(b)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title={`Detailed location record for ${b.name}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => startEditBranch(b)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title={`Edit location descriptor for ${b.name}`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          
                          {b.id !== "B1" && (
                            <button
                              type="button"
                              onClick={() => setDeletingBranch(b)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title={`Discard branch location ${b.name}`}
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-y-1 text-[10px] text-slate-600 pt-2 border-t border-slate-100 font-sans">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold block">Branch Address</span>
                          <span className="font-semibold text-slate-800">{b.address || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold block">Location / City</span>
                          <span className="font-mono text-slate-800">{b.city || "—"}</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold block">Direct Helpline</span>
                          <span className="font-mono text-slate-800">{b.phone || "—"}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-1 flex items-center justify-between">
                        {currentBranch?.id === b.id ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> Selected Operating Outlet
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (onSwitchBranch) {
                                onSwitchBranch(b.id);
                              }
                            }}
                            className="text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-2.5 py-1.25 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Globe className="w-3 h-3 text-emerald-600" /> Switch &amp; Operate Branch
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "pos" && (
        /* ================= SUB-TAB: POS OPERATIONAL PREFERENCES ================= */
        <form onSubmit={handleSavePOSSettings} className="space-y-6 max-w-2xl font-sans">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Printer className="w-4 h-4 text-purple-600" /> POS Operational Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Auto-Print Cash Receipts</span>
                    <span className="text-[10px] text-slate-500">Trigger invoice print on POS Checkout</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={opsSettings.autoPrintReceipt}
                    onChange={(e) => setOpsSettings({ ...opsSettings, autoPrintReceipt: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Scanner Beep Sound FX</span>
                    <span className="text-[10px] text-slate-500">Trigger POS click and alert audio tones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOpsSettings({ ...opsSettings, enableSound: !opsSettings.enableSound })}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                        opsSettings.enableSound 
                          ? "bg-purple-50 text-purple-700 border-purple-200" 
                          : "bg-white text-slate-400 border-slate-200"
                      }`}
                    >
                      {opsSettings.enableSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-extrabold text-slate-900 block">Maximum Checkout Discount</span>
                    <span className="text-xs font-mono font-bold text-amber-600">{opsSettings.maxDiscountAllowed}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={opsSettings.maxDiscountAllowed}
                    onChange={(e) => setOpsSettings({ ...opsSettings, maxDiscountAllowed: parseInt(e.target.value) })}
                    className="w-full accent-purple-600 bg-slate-200 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Prevents cashier staff from entering excessively high retail discounts.</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-1.5 font-sans">
                    Receipt Header Memo Title
                  </label>
                  <input
                    type="text"
                    required
                    value={opsSettings.receiptHeader}
                    onChange={(e) => setOpsSettings({ ...opsSettings, receiptHeader: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-mono shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Example: OFFICIAL RETAIL CASH INVOICE</span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-1.5 font-sans">
                    Receipt Footer Disclaimer / Greeting
                  </label>
                  <input
                    type="text"
                    required
                    value={opsSettings.receiptFooter}
                    onChange={(e) => setOpsSettings({ ...opsSettings, receiptFooter: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-mono shadow-2xs"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Example: Thank you for shopping with us! No returns after 7 days.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider font-sans"
            >
              <Save className="w-4 h-4 shrink-0" />
              Save Operational Settings
            </button>
          </div>
        </form>
      )}

      {activeSubTab === "system" && (
        /* ================= SUB-TAB: SYSTEM MAINTENANCE & LOCAL DATABASE ================= */
        <div className="space-y-6 max-w-2xl font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Database stats */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Database className="w-4 h-4 text-purple-600" /> Database Cache Metrics
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider block font-bold font-sans">Catalogue Count</span>
                  <span className="text-slate-900 text-base font-extrabold block mt-1">{stats.products} products</span>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider block font-bold font-sans">CRM Directory</span>
                  <span className="text-slate-900 text-base font-extrabold block mt-1">{stats.customers} clients</span>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider block font-bold font-sans">Invoices Log</span>
                  <span className="text-slate-900 text-base font-extrabold block mt-1">{stats.invoices} bills</span>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider block font-bold font-sans">Cache Load</span>
                  <span className="text-slate-900 text-base font-extrabold block mt-1">{stats.storageSizeKb} KB</span>
                </div>
              </div>

              <div className="flex gap-2 text-[10px] text-slate-600 font-medium items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                <span>Local Sync Ledger Connected and Active (Normal State)</span>
              </div>
            </div>

            {/* Backups trigger */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              <h3 className="text-xs font-black text-rose-700 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                🛡️ Backup &amp; Rollbacks
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Expert POS operates with zero-knowledge local client-side encryption. Secure exports pack full inventory sheets, sales journals, and custom registers to safeguard against loss.
              </p>

              <div className="flex flex-col gap-2 pt-1.5">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  📥 Export Database Backup
                </button>

                <button
                  type="button"
                  onClick={handleClearSystemData}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Purge Cache Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "enterprise" && (
        /* ================= SUB-TAB: ENTERPRISE SETTINGS MODULES ================= */
        <div className="space-y-6 max-w-7xl font-sans" id="enterprise-settings-subtab">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Enterprise Operations Control Board</h3>
              <p className="text-xs text-slate-500 font-medium">SaaS platform settings registry, multi-tenant sandbox modules, and localisation parameters.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerEnterpriseNotification("All twelve system configurations synced successfully to cluster databases.", "success");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Sync Controls</span>
              </button>
            </div>
          </div>

          {enterpriseNotification && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              enterpriseNotification.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                : "bg-blue-50 border-blue-100 text-blue-800"
            }`}>
              <span>{enterpriseNotification.message}</span>
              <button onClick={() => setEnterpriseNotification(null)} className="font-bold hover:text-slate-900"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* 4-column Master Grid for 12 Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 align-start items-start">
            
            {/* ================= COLUMN 1 ================= */}
            <div className="space-y-6">
              
              {/* A. Business Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Business Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "companyName", label: "Company Settings", desc: enterpriseSettings.companyName },
                    { id: "businessLocations", label: "Business Locations", desc: enterpriseSettings.businessLocations },
                    { id: "aivoviaActive", label: "*AIVOVIA*", desc: enterpriseSettings.aivoviaActive ? "Active Premium Engine" : "Inactive" },
                    { id: "businessGoals", label: "Set Goals", desc: enterpriseSettings.businessGoals }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "business", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* B. Localisation */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Localisation</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "systemCurrency", label: "Currency", desc: enterpriseSettings.systemCurrency },
                    { id: "systemLanguage", label: "Languages", desc: enterpriseSettings.systemLanguage },
                    { id: "systemDateFormat", label: "Date & Time Format", desc: enterpriseSettings.systemDateFormat },
                    { id: "systemTheme", label: "Theme", desc: enterpriseSettings.systemTheme }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "localisation", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* C. Miscellaneous Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Miscellaneous Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "softwareVersion", label: "Software Update", desc: enterpriseSettings.softwareVersion },
                    { id: "emailSmtpServer", label: "Email Config", desc: enterpriseSettings.emailSmtpServer },
                    { id: "transactionCategoryList", label: "Transaction Categories", desc: enterpriseSettings.transactionCategoryList },
                    { id: "emailAlertsEnabled", label: "Email Alert", desc: enterpriseSettings.emailAlertsEnabled ? "Enabled" : "Disabled" },
                    { id: "aboutText", label: "About", desc: enterpriseSettings.aboutText }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "miscellaneous", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ================= COLUMN 2 ================= */}
            <div className="space-y-6">

              {/* D. Advanced Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Advanced Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "restApiEnabled", label: "REST API", desc: enterpriseSettings.restApiEnabled ? "Enabled" : "Disabled" },
                    { id: "cronJobSchedule", label: "Automatic Cron Job", desc: enterpriseSettings.cronJobSchedule },
                    { id: "customFieldsCount", label: "Custom Fields", desc: `${enterpriseSettings.customFieldsCount} schemas configured` },
                    { id: "dualEntryEnabled", label: "Dual Entry Accounting", desc: enterpriseSettings.dualEntryEnabled ? "Enforced" : "Standard" },
                    { id: "activityLogRetention", label: "Application Activity Log", desc: `Keep logs: ${enterpriseSettings.activityLogRetention} days` },
                    { id: "debugModeActive", label: "Debug Mode", desc: enterpriseSettings.debugModeActive ? "Active" : "Disabled" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "advanced", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* E. Billing Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Billing Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "billingGracePeriod", label: "Billing Settings", desc: `Grace: ${enterpriseSettings.billingGracePeriod} days` },
                    { id: "discountAllowedMax", label: "Discount & Shipping", desc: `Max: ${enterpriseSettings.discountAllowedMax}%` },
                    { id: "invoicePrefix", label: "Prefix", desc: `Invoices: "${enterpriseSettings.invoicePrefix}"` },
                    { id: "billingTermsText", label: "Billing Terms", desc: enterpriseSettings.billingTermsText },
                    { id: "autoSmsEnabled", label: "Auto Email SMS", desc: enterpriseSettings.autoSmsEnabled ? "Enabled" : "Disabled" },
                    { id: "defaultWarehouseCode", label: "Default Warehouse", desc: enterpriseSettings.defaultWarehouseCode },
                    { id: "posStyleVariant", label: "POS Style & Settings", desc: enterpriseSettings.posStyleVariant }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "billing", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* F. Tax Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Percent className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Tax Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "systemGstRate", label: "Tax", desc: `${enterpriseSettings.systemGstRate}% standard GST` },
                    { id: "otherTaxActive", label: "Other Tax Settings", desc: enterpriseSettings.otherTaxActive ? "Active" : "None" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "tax", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ================= COLUMN 3 ================= */}
            <div className="space-y-6">

              {/* G. Products Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Products Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "defaultUnit", label: "Measurement Unit", desc: enterpriseSettings.defaultUnit },
                    { id: "variationActive", label: "Products Variations", desc: enterpriseSettings.variationActive ? "Enabled" : "Standard" },
                    { id: "variationVariablesCount", label: "Products Variations Variables", desc: `${enterpriseSettings.variationVariablesCount} matrix variables` }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "products", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* H. Payment Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Payment Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "paymentGateway", label: "Payment Settings", desc: enterpriseSettings.paymentGateway },
                    { id: "paymentGateway", label: "Payment Gateways", desc: "Razorpay Enterprise API" },
                    { id: "supportedCurrencies", label: "Payment Currencies", desc: enterpriseSettings.supportedCurrencies },
                    { id: "exchangeRateSync", label: "Currency Exchange", desc: enterpriseSettings.exchangeRateSync ? "Automated Sync" : "Manual" },
                    { id: "bankAccountName", label: "Bank Accounts", desc: enterpriseSettings.bankAccountName }
                  ].map((item, idx) => (
                    <button
                      key={item.id + "-" + idx}
                      onClick={() => setActiveSettingsItem({ catId: "payment", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* I. CRM & HRM Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">CRM &amp; HRM Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "selfAttendanceEnabled", label: "Self Attendance", desc: enterpriseSettings.selfAttendanceEnabled ? "Active (Web/App)" : "Disabled" },
                    { id: "crmLeadTracking", label: "CRM Settings", desc: enterpriseSettings.crmLeadTracking ? "Dynamic lead tracking" : "Standard" },
                    { id: "securityAccessLevel", label: "Security", desc: enterpriseSettings.securityAccessLevel },
                    { id: "supportTicketUptime", label: "Support Tickets", desc: `SLA target: ${enterpriseSettings.supportTicketUptime}` }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "crm_hrm", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ================= COLUMN 4 ================= */}
            <div className="space-y-6">

              {/* J. Plugins Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Plugins Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "recaptchaKey", label: "reCaptcha Security", desc: enterpriseSettings.recaptchaKey },
                    { id: "urlShortenerUrl", label: "URL Shortener", desc: enterpriseSettings.urlShortenerUrl },
                    { id: "smsGatewayProvider", label: "SMS Configuration", desc: enterpriseSettings.smsGatewayProvider },
                    { id: "currencyExchangeApiKey", label: "Currency Exchange API", desc: enterpriseSettings.currencyExchangeApiKey }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "plugins", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* K. Templates Settings */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">Templates Settings</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "emailTemplateBody", label: "Email", desc: enterpriseSettings.emailTemplateBody },
                    { id: "smsTemplateBody", label: "SMS", desc: enterpriseSettings.smsTemplateBody },
                    { id: "printInvoiceTemplate", label: "Print Invoice", desc: enterpriseSettings.printInvoiceTemplate },
                    { id: "templateThemeAccent", label: "Theme", desc: `Accent code: ${enterpriseSettings.templateThemeAccent}` }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "templates", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* L. POS Printers */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest font-mono">POS Printers</span>
                </div>
                <div className="p-2 divide-y divide-slate-100">
                  {[
                    { id: "posPrinterName", label: "Add Printer", desc: enterpriseSettings.posPrinterName },
                    { id: "activePrintersList", label: "List Printers", desc: enterpriseSettings.activePrintersList }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSettingsItem({ catId: "pos_printers", itemId: item.id, itemLabel: item.label })}
                      className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Localized Modal Editor inside Admin settings */}
          {activeSettingsItem && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn" id="admin-settings-editor-modal">
              <div className="bg-white text-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
                
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-900">{activeSettingsItem.itemLabel}</h3>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">SaaS Operational Variable Registry</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveSettingsItem(null)} 
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer transition-all"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                      Configure Option Value
                    </label>

                    {/* Check if the selected key is a boolean toggle */}
                    {[
                      "aivoviaActive", "emailAlertsEnabled", "restApiEnabled", "dualEntryEnabled", 
                      "debugModeActive", "autoSmsEnabled", "otherTaxActive", "variationActive", 
                      "exchangeRateSync", "selfAttendanceEnabled", "crmLeadTracking"
                    ].includes(activeSettingsItem.itemId) ? (
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="font-extrabold text-slate-800 text-[11px]">Enforce / Enable parameter</span>
                        <button
                          type="button"
                          onClick={() => {
                            const curVal = (enterpriseSettings as any)[activeSettingsItem.itemId];
                            setEnterpriseSettings({
                              ...enterpriseSettings,
                              [activeSettingsItem.itemId]: !curVal
                            });
                          }}
                          className={`w-11 h-6 rounded-full transition-all relative p-1 cursor-pointer ${
                            (enterpriseSettings as any)[activeSettingsItem.itemId] ? "bg-blue-600" : "bg-slate-200"
                          }`}
                        >
                          <span className={`w-4 h-4 bg-white rounded-full block transition-all shadow-md ${
                            (enterpriseSettings as any)[activeSettingsItem.itemId] ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </button>
                      </div>
                    ) : [
                      "customFieldsCount", "activityLogRetention", "billingGracePeriod", 
                      "discountAllowedMax", "systemGstRate", "variationVariablesCount"
                    ].includes(activeSettingsItem.itemId) ? (
                      <input
                        type="number"
                        value={(enterpriseSettings as any)[activeSettingsItem.itemId] || 0}
                        onChange={(e) => setEnterpriseSettings({
                          ...enterpriseSettings,
                          [activeSettingsItem.itemId]: Number(e.target.value)
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <textarea
                        rows={3}
                        value={(enterpriseSettings as any)[activeSettingsItem.itemId] || ""}
                        onChange={(e) => setEnterpriseSettings({
                          ...enterpriseSettings,
                          [activeSettingsItem.itemId]: e.target.value
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 placeholder:text-slate-400 leading-relaxed font-sans"
                      />
                    )}
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-[10px] text-slate-600 flex items-start gap-2 leading-relaxed">
                    <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      Modifications apply live across all tenant execution modules and are synchronized during the next background network cycle.
                    </span>
                  </div>

                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setActiveSettingsItem(null)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer transition-all text-slate-500"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerEnterpriseNotification(`Operational specification for '${activeSettingsItem.itemLabel}' updated live.`, "success");
                      setActiveSettingsItem(null);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 cursor-pointer transition-all"
                  >
                    Apply Setting
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= MODAL: SUPPLIER DETAILED VIEW ================= */}
      {viewingSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="supplier-details-modal">
          <div className="bg-slate-900 border border-slate-800 text-white max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-slate-950/40">
            {/* Top purple accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

            {/* Header */}
            <div className="px-6 pt-7 pb-4 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base font-sans bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-lg uppercase leading-none">
                  {viewingSupplier.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans leading-none">{viewingSupplier.name}</h3>
                  <span className="px-1.5 py-0.5 mt-1.5 text-[8.5px] font-bold uppercase tracking-wider rounded border inline-block bg-slate-800 border-slate-700 text-slate-300">
                    Registered Vendor Partner
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingSupplier(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Supplier ID:</span>
                  <span className="text-slate-200 font-medium font-sans font-semibold">{viewingSupplier.id}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Contact Person:</span>
                  <span className="text-slate-200 select-all font-sans font-medium">{viewingSupplier.contact || "—"}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Phone Number:</span>
                  <span className="text-teal-400 font-bold bg-slate-900 px-2 py-0.5 rounded text-[11px] border border-slate-800 select-all">{viewingSupplier.phone || "—"}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Email Address:</span>
                  <span className="text-purple-400 select-all font-medium font-mono">{viewingSupplier.email || "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">GSTIN State Tax ID:</span>
                  <span className="text-amber-400 font-black tracking-wide uppercase text-[10.5px] select-all">{viewingSupplier.gstin || "—"}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] uppercase tracking-wider text-slate-500 font-extrabold font-sans">Corporate Supplier Guidelines</label>
                <p className="text-slate-300 p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/40 text-[11px] leading-relaxed leading-normal">
                  Distribution partner registered under active commercial codes. Products purchased through this vendor channel inherit automatic mapping inside the catalog, maintaining trace documentation for margins and accounting journals.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center">
              <button 
                onClick={() => {
                  const sup = viewingSupplier;
                  setViewingSupplier(null);
                  startEditSupplier(sup);
                }}
                className="bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 font-bold text-xs px-3.5 py-2 rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5 border border-purple-500/20"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Record
              </button>
              <button 
                onClick={() => setViewingSupplier(null)}
                className="bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all font-sans cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUPPLIER RECORD EDIT & OVERRIDE ================= */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="supplier-edit-modal">
          <div className="bg-slate-900 border border-slate-800 text-white max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-slate-950/40">
            {/* Top amber accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"></div>

            {/* Header */}
            <div className="px-6 pt-7 pb-4 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-none font-sans">Edit Supplier Registry</h3>
                  <p className="text-[10.5px] text-slate-400 mt-1 font-sans">Modify corporate entities, direct contacts, tax registries and communications identifiers.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingSupplier(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditedSupplier}>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Firm Name */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-sans">
                    Supplier / Firm Corporate Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Global Logistics"
                      value={editSupName}
                      onChange={(e) => setEditSupName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-slate-500 focus:outline-none focus:border-slate-705 transition-all shadow-inner"
                    />
                    <Users className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  </div>
                </div>

                {/* Primary Contact Person */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-sans">
                    Contact Person Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Devendra Singh"
                      value={editSupContact}
                      onChange={(e) => setEditSupContact(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-slate-500 focus:outline-none focus:border-slate-705 focus:bg-slate-950"
                    />
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-sans">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 XXXXX XXXXX"
                      value={editSupPhone}
                      onChange={(e) => setEditSupPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-600 focus:outline-none focus:border-slate-705 focus:bg-slate-950 transition-all"
                    />
                  </div>

                  {/* Email ID */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-sans">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="billing@apex.com"
                      value={editSupEmail}
                      onChange={(e) => setEditSupEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-slate-705 focus:bg-slate-950"
                    />
                  </div>
                </div>

                {/* GSTIN */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-sans">
                    GSTIN Tax ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 07AAAAA1111A1Z1"
                    value={editSupGstin}
                    onChange={(e) => setEditSupGstin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-slate-705 focus:bg-slate-950 uppercase"
                  />
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="px-6 py-4 bg-slate-950 border-t border-slate-800/80 flex justify-end gap-2 text-xs font-sans">
                <button 
                  type="button"
                  onClick={() => setEditingSupplier(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl transition-all font-sans cursor-pointer"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="bg-purple-600 text-white hover:bg-purple-700 font-bold px-5 py-2.5 rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5 shadow-md uppercase tracking-wider"
                >
                  <Check className="w-4 h-4" /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUPPLIER ACCESS DISCARD OVERLAY ================= */}
      {deletingSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="supplier-discard-modal">
          <div className="bg-slate-900 border border-slate-850 text-white max-w-md w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-slate-950/40">
            {/* Top red header warning */}
            <div className="h-1.5 bg-rose-600"></div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-none font-sans">Decommission Supplier Partner</h3>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-sans">You are about to discard this supplier profile from unified ledger dropboards.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <p className="text-xs font-sans text-slate-300 font-bold">Discard Partnership Details:</p>
                <div className="grid grid-cols-2 gap-y-1.5 text-[10.5px] font-mono text-slate-400">
                  <span className="font-sans font-medium text-slate-500 text-left">Partner Firm:</span>
                  <span className="text-white font-bold font-sans text-right">{deletingSupplier.name}</span>
                  <span className="font-sans font-medium text-slate-500 text-left">Primary Contact:</span>
                  <span className="text-white font-sans text-right">{deletingSupplier.contact || "—"}</span>
                  <span className="font-sans font-medium text-slate-500 text-left">GSTIN State Tax ID:</span>
                  <span className="text-rose-400 font-bold text-right text-[10px] uppercase font-mono">{deletingSupplier.gstin || "—"}</span>
                </div>
              </div>

              <p className="text-[10.5px] text-slate-400 leading-normal leading-relaxed font-sans">
                Removing this record deletes them from active selection registries. Catalog files mapping inventory sheets to this supplier will retain legacy fields, but new supply sheets won't be able to map to them unless registered again.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800/80 flex justify-end gap-2 text-xs font-sans">
              <button
                type="button"
                onClick={() => setDeletingSupplier(null)}
                className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                No, Retain Partner
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await onDeleteSupplier(deletingSupplier.id);
                    triggerNotification(`Supplier "${deletingSupplier.name}" registry decommissioned.`, "success");
                  } catch (e) {
                    triggerNotification("Could not delete supplier partner record.", "warning");
                  }
                  setDeletingSupplier(null);
                }}
                className="bg-rose-600 text-white hover:bg-rose-700 font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-rose-600/10 cursor-pointer flex items-center gap-1 uppercase tracking-wider"
              >
                <Trash className="w-3.5 h-3.5" /> Yes, Discard Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRODUCT CATEGORY DETAILED VIEW ================= */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="category-details-modal">
          <div className="bg-slate-900 border border-slate-800 text-white max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-slate-950/40 animate-fadeIn">
            {/* Top purple accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

            {/* Header */}
            <div className="px-6 pt-7 pb-4 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base font-sans bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-lg uppercase leading-none">
                  {viewingCategory.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans leading-none">{viewingCategory}</h3>
                  <span className="px-1.5 py-0.5 mt-1.5 text-[8.5px] font-bold uppercase tracking-wider rounded border inline-block bg-slate-800 border-slate-700 text-slate-300 animate-fadeIn">
                    Product Category Taxonomic Node
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingCategory(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3 font-mono text-xs animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80 animate-fadeIn">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Taxonomy Label:</span>
                  <span className="text-slate-200 font-bold font-sans">{viewingCategory}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80 animate-fadeIn">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">System Key Index:</span>
                  <span className="text-slate-400 font-mono text-[11px]">cat_{viewingCategory.toLowerCase().replace(/[^a-z0-9]/g, "_")}</span>
                </div>
                <div className="flex justify-between items-center animate-fadeIn animate-fadeIn">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Operational Status:</span>
                  <span className="text-emerald-400 font-black tracking-wide uppercase text-[10px]">ACTIVE &amp; ONLINE</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] uppercase tracking-wider text-slate-500 font-extrabold font-sans">Corporate Taxonomy Guidelines</label>
                <p className="text-slate-300 p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/40 text-[11px] leading-relaxed leading-normal mt-1 text-slate-450 font-sans">
                  Products registered inside the "{viewingCategory}" category bracket instantly receive classification tags inside stock reports, cashiers checkout desks, and unified tax ledgers.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center">
              <button 
                onClick={() => {
                  const cat = viewingCategory;
                  setViewingCategory(null);
                  startEditCategory(cat);
                }}
                className="bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 font-bold text-xs px-3.5 py-2 rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5 border border-purple-500/20"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Bracket Name
              </button>
              <button 
                onClick={() => setViewingCategory(null)}
                className="bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all font-sans cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRODUCT CATEGORY EDIT & OVERRIDE ================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="category-edit-modal">
          <div className="bg-slate-900 border border-slate-800 text-white max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-slate-950/40 animate-fadeIn">
            {/* Top amber accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"></div>

            {/* Header */}
            <div className="px-6 pt-7 pb-4 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-none font-sans">Edit Category Range Label</h3>
                  <p className="text-[10.5px] text-slate-400 mt-1 font-sans">Modify taxonomy defaults. Changes apply dynamically across system interfaces.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditedCategory}>
              <div className="p-6 space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 font-sans">
                    Category Taxonomic Range name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wellness Products"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-slate-500 focus:outline-none focus:border-slate-705 transition-all shadow-inner font-sans"
                    />
                    <List className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="px-6 py-4 bg-slate-950 border-t border-slate-800/80 flex justify-end gap-2 text-xs font-sans">
                <button 
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl transition-all font-sans cursor-pointer"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="bg-purple-600 text-white hover:bg-purple-700 font-bold px-5 py-2.5 rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5 shadow-md uppercase tracking-wider animate-fadeIn"
                >
                  <Check className="w-4 h-4" /> Save Taxonomy Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CATEGORY DELETE CONFIRMATION ================= */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="category-discard-modal">
          <div className="bg-slate-900 border border-slate-850 text-white max-w-md w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-slate-950/40 animate-fadeIn">
            {/* Top red header warning */}
            <div className="h-1.5 bg-rose-600"></div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-none font-sans">Decommission Taxonomy Node</h3>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-sans">You are about to discard this category range descriptor from taxonomic dropdown directories.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <p className="text-xs font-sans text-slate-300 font-bold">Discard Category Target:</p>
                <div className="grid grid-cols-2 gap-y-1.5 text-[10.5px] font-mono text-slate-400">
                  <span className="font-sans font-medium text-slate-500 text-left font-sans">Category Label:</span>
                  <span className="text-white font-bold font-sans text-right">{deletingCategory}</span>
                </div>
              </div>

              <p className="text-[10.5px] text-slate-400 leading-normal leading-relaxed font-sans">
                Removing this record deletes it from active selection registries. Catalog files mapping products to this category will retain legacy tags, but new product onboarding descriptors won't be able to map to it.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800/80 flex justify-end gap-2 text-xs font-sans animate-fadeIn">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                No, Retain Taxonomy
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateProductCategories(productCategories.filter(c => c !== deletingCategory));
                  triggerNotification(`Category "${deletingCategory}" has been decommissioned.`, "success");
                  setDeletingCategory(null);
                }}
                className="bg-rose-600 text-white hover:bg-rose-700 font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-rose-600/10 cursor-pointer flex items-center gap-1 uppercase tracking-wider animate-fadeIn"
              >
                <Trash className="w-3.5 h-3.5" /> Yes, Discard Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STORE BRANCH DETAILED VIEW ================= */}
      {viewingBranch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="branch-details-modal">
          <div className="bg-slate-900 border border-slate-800 text-white max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-slate-950/40 animate-fadeIn">
            {/* Top green accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

            {/* Header */}
            <div className="px-6 pt-7 pb-4 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base font-sans bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg uppercase leading-none">
                  {viewingBranch.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-sans leading-none">{viewingBranch.name}</h3>
                  <span className="px-1.5 py-0.5 mt-1.5 text-[8.5px] font-bold uppercase tracking-wider rounded border inline-block bg-slate-800 border-slate-700 text-slate-300">
                    Retail Branch Node
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingBranch(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Branch ID:</span>
                  <span className="text-slate-200 font-medium font-sans font-semibold">{viewingBranch.id}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Direct Helpline:</span>
                  <span className="text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded text-[11px] border border-slate-800 select-all">{viewingBranch.phone || "—"}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Physical City:</span>
                  <span className="text-slate-200 select-all font-sans font-medium">{viewingBranch.city || "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] font-black">Full Location:</span>
                  <span className="text-slate-200 select-all font-medium font-sans text-right max-w-[70%]">{viewingBranch.address || "—"}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9.5px] uppercase tracking-wider text-slate-500 font-extrabold font-sans">Corporate Operation Guidelines</label>
                <p className="text-slate-300 p-2.5 bg-slate-950/40 rounded-lg border border-slate-800/40 text-[11px] leading-relaxed leading-normal font-sans">
                  Branch outlet linked to unified ERP ledger. Cash registers, cashier drawer logins, and transaction sequences created here dynamically synchronize with corporate inventory lists.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center">
              <button 
                onClick={() => {
                  const b = viewingBranch;
                  setViewingBranch(null);
                  startEditBranch(b);
                }}
                className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-bold text-xs px-3.5 py-2 rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5 border border-emerald-500/20"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Details
              </button>
              <button 
                onClick={() => setViewingBranch(null)}
                className="bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all font-sans cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STORE BRANCH RECORD EDIT & OVERRIDE ================= */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="branch-edit-modal">
          <div className="bg-slate-900 border border-slate-800 text-white max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-slate-950/40 animate-fadeIn">
            {/* Top amber accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"></div>

            {/* Header */}
            <div className="px-6 pt-7 pb-4 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-none font-sans">Edit Branch Outlet</h3>
                  <p className="text-[10.5px] text-slate-400 mt-1 font-sans">Modify outlet location, physical address, and contact numbers.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingBranch(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditedBranch}>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto font-sans bg-white">
                {/* Branch Name */}
                <div>
                  <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-1 font-sans">
                    Branch Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Westside Super Store"
                      value={editBrName}
                      onChange={(e) => setEditBrName(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-sans shadow-2xs"
                    />
                    <Store className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                {/* Direct Helpline */}
                <div>
                  <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-1 font-sans">
                    Direct Helpline / Phone
                  </label>
                  <div className="relative font-sans">
                    <input
                      type="text"
                      placeholder="e.g. +91 11-4321-8765"
                      value={editBrPhone}
                      onChange={(e) => setEditBrPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-sans shadow-2xs"
                    />
                    <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* Full Location Address */}
                  <div>
                    <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-1 font-sans">
                      Physical Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shop 4, Lotus Circle View"
                      value={editBrAddress}
                      onChange={(e) => setEditBrAddress(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-sans shadow-2xs"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-1 font-sans">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={editBrCity}
                      onChange={(e) => setEditBrCity(e.target.value)}
                      className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-sans shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs font-sans">
                <button 
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-4 py-2 rounded-xl transition-all font-sans cursor-pointer shadow-2xs"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold px-5 py-2.5 rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5 shadow-md uppercase tracking-wider"
                >
                  <Check className="w-4 h-4" /> Save Outlet Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: STORE BRANCH ACCESS DISCARD OVERLAY ================= */}
      {deletingBranch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm py-12 px-4 flex items-center justify-center no-print" id="branch-discard-modal">
          <div className="bg-white border border-slate-200 text-slate-900 max-w-md w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans animate-fadeIn">
            {/* Top red header warning */}
            <div className="h-1.5 bg-rose-600"></div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-none font-sans">Decommission Branch Node</h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-sans">You are about to discard this physical/operation outlet from unified system ledger directories.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-xs font-sans text-slate-900 font-bold">Discard Branch Context:</p>
                <div className="grid grid-cols-2 gap-y-1.5 text-[10.5px] font-mono text-slate-600">
                  <span className="font-sans font-medium text-slate-500 text-left font-sans">Branch Node:</span>
                  <span className="text-slate-900 font-bold font-sans text-right">{deletingBranch.name}</span>
                  <span className="font-sans font-medium text-slate-500 text-left font-sans">Town / City:</span>
                  <span className="text-slate-900 font-sans text-right">{deletingBranch.city || "—"}</span>
                  <span className="font-sans font-medium text-slate-500 text-left font-sans">Direct Helpline:</span>
                  <span className="text-rose-600 font-bold text-right text-[10px] uppercase font-mono">{deletingBranch.phone || "—"}</span>
                </div>
              </div>

              <p className="text-[10.5px] text-slate-600 leading-normal leading-relaxed font-sans">
                Removing this store coordinates denies any further cashier logins, sale entries, drawer sheets or reporting metrics on behalf of this specific location ID. All legacy logs of this branch will remain archived, but new operations will be locked.
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs font-sans">
              <button
                type="button"
                onClick={() => setDeletingBranch(null)}
                className="bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer font-sans shadow-2xs"
              >
                No, Retain Outlet
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await onDeleteBranch(deletingBranch.id);
                    triggerNotification(`Branch "${deletingBranch.name}" registry decommissioned.`, "success");
                  } catch (e) {
                    triggerNotification("Could not delete branch outlet record.", "warning");
                  }
                  setDeletingBranch(null);
                }}
                className="bg-rose-600 text-white hover:bg-rose-700 font-bold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1 uppercase tracking-wider font-sans"
              >
                <Trash className="w-3.5 h-3.5" /> Yes, Discard Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Clear System Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" id="clear-confirm-modal">
          <div className="bg-white text-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 text-center text-xs font-medium">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto border border-rose-100 shadow-sm">
              <Trash className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-950 font-sans tracking-tight">Clear Session Records?</h3>
              <p className="text-slate-500 leading-relaxed">Are you sure you want to completely clear local operational data (Products, CRM, Invoices, Expenses, Staff) for this active session? This cannot be undone.</p>
            </div>
            <div className="flex items-center gap-2.5 justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer font-sans"
              >
                No, Retain Data
              </button>
              <button
                type="button"
                onClick={() => {
                  executeClearSystemData();
                  setShowClearConfirm(false);
                }}
                className="bg-rose-600 text-white hover:bg-rose-700 font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-rose-600/10 cursor-pointer flex items-center gap-1 uppercase tracking-wider font-sans"
              >
                <Trash className="w-3.5 h-3.5" /> Yes, Purge Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
