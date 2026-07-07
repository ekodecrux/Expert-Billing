/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Layers,
  ShoppingBag,
  Users,
  TrendingUp,
  Store,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  User,
  Coffee,
  Database,
  Printer,
  FileText,
  Clock,
  Briefcase,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Sparkles,
  CreditCard,
  DollarSign,
  Tag,
  Percent,
  PlusCircle,
  Edit2,
  Info,
  Lock,
  LogOut,
  Unlock,
  Key,
  Copy,
  Check,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  ShieldAlert,
  Settings,
  Upload,
  Download,
  Smartphone,
  Cloud,
  Headphones,
  HelpCircle,
  Folder
} from "lucide-react";

import {
  Product,
  Supplier,
  Customer,
  Invoice,
  InvoiceItem,
  StoreBranch,
  Expense,
  CashSession,
  StockAdjustment,
  PaymentMode,
  UserRole,
  MeasurementUnit,
  Tenant,
  StockTransfer,
  printElementById
} from "./types";

import SmartCopilot from "./components/SmartCopilot";
import SuperAdminConsole from "./components/SuperAdminConsole";
import StaffRegistry from "./components/StaffRegistry";
import SettingsPanel from "./components/SettingsPanel";
import { ExpertAidLogo } from "./components/ExpertAidLogo";

const PRESET_TENANTS: Tenant[] = [
  {
    id: "TENANT-001",
    name: "ExpertAid Retail Hub",
    subdomain: "hub",
    adminEmail: "admin@expertaid.com",
    phone: "+91 9988776655",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2026-01-10T08:00:00Z",
    colorTheme: "emerald",
    maxBranches: 10,
    maxProducts: 250,
    onboardingFeePaid: 150000,
    monthlySubscriptionFee: 4500,
    billingCycle: "MONTHLY",
    lastPaymentAmount: 4500,
    lastPaymentDate: "2026-05-10",
    subscriptionStartDate: "2026-01-10",
    subscriptionEndDate: "2027-01-10",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["Heavy Duty Cash Drawer", "Bluetooth Barcode Scanner", "80mm Thermal Printer"],
    onboardingNotes: "Initial sandbox isolation slice provisioned and physical hardware package dispatched.",
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07AAAAA1111A1Z1"
  },
  {
    id: "TENANT-002",
    name: "Tech Solutions Pvt. Ltd.",
    subdomain: "techsolutions",
    adminEmail: "info@techsolutions.com",
    phone: "+91 9811223344",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2024-05-20T10:00:00Z",
    colorTheme: "indigo",
    maxBranches: 5,
    maxProducts: 100,
    onboardingFeePaid: 75000,
    monthlySubscriptionFee: 4500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-20",
    subscriptionEndDate: "2025-05-20",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["Heavy Duty Cash Drawer", "80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07EXPAID2026A1Z1"
  },
  {
    id: "TENANT-003",
    name: "ABC Retailers",
    subdomain: "abcretailers",
    adminEmail: "contact@abcretailers.com",
    phone: "+91 9822334455",
    currency: "₹",
    tier: "GROWTH",
    status: "ACTIVE",
    createdAt: "2024-05-18T11:00:00Z",
    colorTheme: "amber",
    maxBranches: 3,
    maxProducts: 50,
    onboardingFeePaid: 45000,
    monthlySubscriptionFee: 2500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-18",
    subscriptionEndDate: "2025-05-18",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07ABCRE1818B2Y2"
  },
  {
    id: "TENANT-004",
    name: "Global Enterprises",
    subdomain: "globalenterprises",
    adminEmail: "hello@globalenterprises.com",
    phone: "+91 9833445566",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2024-05-15T09:30:00Z",
    colorTheme: "rose",
    maxBranches: 8,
    maxProducts: 200,
    onboardingFeePaid: 120000,
    monthlySubscriptionFee: 4500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-15",
    subscriptionEndDate: "2025-05-15",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["Heavy Duty Cash Drawer", "Bluetooth Barcode Scanner", "80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07GLOBA1515C3X3"
  },
  {
    id: "TENANT-005",
    name: "Smart Infotech",
    subdomain: "smartinfotech",
    adminEmail: "support@smartinfotech.com",
    phone: "+91 9844556677",
    currency: "₹",
    tier: "STARTER",
    status: "TRIAL",
    createdAt: "2024-05-12T14:15:00Z",
    colorTheme: "violet",
    maxBranches: 1,
    maxProducts: 20,
    onboardingFeePaid: 25000,
    monthlySubscriptionFee: 1200,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-12",
    subscriptionEndDate: "2024-11-12",
    contractDurationMonths: 6,
    renewalStatus: "MANUAL",
    onboardingSetupStatus: "SYSTEM_PROVISIONED",
    hardwareProvisioned: [],
    clientVerificationStatus: "PENDING_KYC",
    gstinRegNumber: "PENDING"
  },
  {
    id: "TENANT-006",
    name: "Digital World",
    subdomain: "digitalworld",
    adminEmail: "info@digitalworld.com",
    phone: "+91 9855667788",
    currency: "₹",
    tier: "GROWTH",
    status: "ACTIVE",
    createdAt: "2024-05-10T16:00:00Z",
    colorTheme: "emerald",
    maxBranches: 3,
    maxProducts: 50,
    onboardingFeePaid: 50000,
    monthlySubscriptionFee: 2500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-10",
    subscriptionEndDate: "2025-05-10",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07DIGIT1010D4W4"
  },
  {
    id: "TENANT-007",
    name: "Innovateech Systems",
    subdomain: "innovateech",
    adminEmail: "innovateech@gmail.com",
    phone: "+91 9866778899",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2024-05-21T08:00:00Z",
    colorTheme: "indigo",
    maxBranches: 5,
    maxProducts: 100,
    onboardingFeePaid: 80000,
    monthlySubscriptionFee: 4500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-21",
    subscriptionEndDate: "2025-05-21",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["Heavy Duty Cash Drawer", "80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07INNOV2121E5V5"
  },
  {
    id: "TENANT-008",
    name: "Shree Traders",
    subdomain: "shreetraders",
    adminEmail: "shreetraders@gmail.com",
    phone: "+91 9877889900",
    currency: "₹",
    tier: "GROWTH",
    status: "ACTIVE",
    createdAt: "2024-05-20T14:00:00Z",
    colorTheme: "amber",
    maxBranches: 3,
    maxProducts: 50,
    onboardingFeePaid: 45000,
    monthlySubscriptionFee: 2500,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-20",
    subscriptionEndDate: "2025-05-20",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: ["80mm Thermal Printer"],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07SHREE2020F6U6"
  },
  {
    id: "TENANT-009",
    name: "Prime Solutions",
    subdomain: "primesolutions",
    adminEmail: "primesolutions@gmail.com",
    phone: "+91 9888990011",
    currency: "₹",
    tier: "STARTER",
    status: "ACTIVE",
    createdAt: "2024-05-19T10:00:00Z",
    colorTheme: "rose",
    maxBranches: 1,
    maxProducts: 20,
    onboardingFeePaid: 25000,
    monthlySubscriptionFee: 1200,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2024-05-19",
    subscriptionEndDate: "2024-11-19",
    contractDurationMonths: 6,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: [],
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "07PRIME1919G7T7"
  }
];

const PRESET_CREDENTIALS = [
  {
    role: UserRole.ADMIN,
    title: "Super Admin Master Controls",
    email: "superadmin@expertaid.com",
    password: "SuperAdminMasterKey2026",
    name: "System Sovereign (Super Admin)",
    color: "violet",
    gradient: "from-purple-500 to-indigo-600",
    bgHover: "hover:bg-purple-500/5",
    accent: "text-purple-400",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/10",
    description: "Sovereign master access credentials for cross-border tenancy. Provision corporate clients, customize database slices, switch live active workspaces, and monitor overall SaaS subscriptions.",
    privileges: ["Cross-tenant onboarding", "Global subscription audit", "Database isolation scaling", "Bypassing branch ceilings", "Modify workspace context"],
    phone: "+91 9900112233"
  },
  {
    role: UserRole.ADMIN,
    title: "Admin Full Control",
    email: "admin@expertaid.com",
    password: "AdminOverrideX99",
    name: "John Doe (Admin)",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    bgHover: "hover:bg-emerald-500/5",
    accent: "text-emerald-500",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
    description: "Full master key to POS checkout, financial ledgers, inventory catalogue, CRM, expense logs, and AI Copilot.",
    privileges: ["POS Sandbox access", "Audit profit & tax ledgers", "Modify products/suppliers", "Administer loyalty points", "Direct DB sync states"],
    phone: "+91 9911223344"
  },
  {
    role: UserRole.MANAGER,
    title: "Manager Reports & Stock",
    email: "manager@expertaid.com",
    password: "ManagerProfit77",
    name: "Alice Manager",
    color: "indigo",
    gradient: "from-indigo-500 to-violet-600",
    bgHover: "hover:bg-indigo-500/5",
    accent: "text-indigo-400",
    border: "border-indigo-500/20",
    glow: "shadow-indigo-500/10",
    description: "Manage physical store health, reconcile stock adjustment ledgers, approve utility expenses, and review reports.",
    privileges: ["Analytics dashboard view", "Adjust and count stock", "Log utility & operating expenses", "Review cash drawers & logs"],
    storeBranchId: "B1",
    phone: "+91 9922334455"
  },
  {
    role: UserRole.CASHIER,
    title: "Cashier Billing Only",
    email: "cashier@expertaid.com",
    password: "CashierBilling101",
    name: "John Cashier",
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    bgHover: "hover:bg-amber-500/5",
    accent: "text-amber-400",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/10",
    description: "Primary front-line role. Focuses on retail scanning, customer checkout flow, processing payments, and coupons.",
    privileges: ["POS checkout scanning", "Configure item quantities", "Associate loyalty members", "UPI, Cash, or Card prints"],
    storeBranchId: "B1",
    phone: "+91 9933445566"
  },
  {
    role: UserRole.STORE_KEEPER,
    title: "Store Keeper Inventory Management",
    email: "storekeeper@expertaid.com",
    password: "StoreKeeperReconcile26",
    name: "Devin Stocker",
    color: "rose",
    gradient: "from-rose-500 to-pink-600",
    bgHover: "hover:bg-rose-500/5",
    accent: "text-rose-400",
    border: "border-rose-500/20",
    glow: "shadow-rose-500/10",
    description: "Track warehouse levels, inspect batch codes, monitor nearing expiry warnings, and align supplier rosters.",
    privileges: ["Inventory levels inspection", "Filter categories & alert status", "Register new supplier entries", "Expiry count audits"],
    storeBranchId: "B2",
    phone: "+91 9944556677"
  }
];

export default function App() {
  // State from server DB
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [branches, setBranches] = useState<StoreBranch[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [cashSessions, setCashSessions] = useState<CashSession[]>([]);

  // Dynamic product categories management state
  const [productCategories, setProductCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("expert_aid_product_categories");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved product categories:", e);
      }
    }
    const defaults = [
      "Fresh Fruits & Vegetables",
      "Dairy & Eggs",
      "Grains & Grocery",
      "Beverages",
      "Snacks & Sweets",
      "Household"
    ];
    localStorage.setItem("expert_aid_product_categories", JSON.stringify(defaults));
    return defaults;
  });

  // Multi-tenant client onboarding states
  const [tenantsList, setTenantsList] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem("expert_aid_tenants");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to restore tenants database:", e);
      }
    }
    localStorage.setItem("expert_aid_tenants", JSON.stringify(PRESET_TENANTS));
    return PRESET_TENANTS;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return localStorage.getItem("expert_aid_active_tenant_id") || "TENANT-001";
  });

  const activeTenant = tenantsList.find(t => t.id === activeTenantId) || tenantsList[0] || PRESET_TENANTS[0];

  const tenantProducts = products.filter(p => (p.tenantId || "TENANT-001") === activeTenantId);

  // Map tenants color theme dynamically
  const getThemeColorClasses = (theme: string) => {
    switch (theme) {
      case "indigo": // Elegant Royal Navy Blue
        return {
          bg: "bg-[#1E2E3D]",
          bgHover: "hover:bg-[#131F2A]",
          bgLight: "bg-[#FAF8F5]",
          bgLightTransparent: "bg-[#1E2E3D]/8",
          text: "text-[#1E2E3D]",
          textAccent: "text-[#2B4257]",
          textAccentDark: "text-[#101921]",
          hoverBg: "hover:bg-[#1E2E3D]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#1E2E3D] border border-stone-400/80"
        };
      case "amber": // Rich Antique Gold / Ochre
        return {
          bg: "bg-[#B0893E]",
          bgHover: "hover:bg-[#916E2E]",
          bgLight: "bg-[#FDFBF7]",
          bgLightTransparent: "bg-[#B0893E]/8",
          text: "text-[#8C641B]",
          textAccent: "text-[#B0893E]",
          textAccentDark: "text-[#6B4E14]",
          hoverBg: "hover:bg-[#B0893E]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#8C641B] border border-stone-400/80"
        };
      case "rose": // Deep Vintage Burgundy / Crimson
        return {
          bg: "bg-[#7A2B37]",
          bgHover: "hover:bg-[#5C1E26]",
          bgLight: "bg-[#FDFBF8]",
          bgLightTransparent: "bg-[#7A2B37]/8",
          text: "text-[#7A2B37]",
          textAccent: "text-[#9E3E4C]",
          textAccentDark: "text-[#4A161E]",
          hoverBg: "hover:bg-[#7A2B37]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#7A2B37] border border-stone-400/80"
        };
      case "violet": // Classic Royal Plum / Velvet
        return {
          bg: "bg-[#4E365E]",
          bgHover: "hover:bg-[#392647]",
          bgLight: "bg-[#FAF7F2]",
          bgLightTransparent: "bg-[#4E365E]/8",
          text: "text-[#4E365E]",
          textAccent: "text-[#6B4982]",
          textAccentDark: "text-[#2D1E38]",
          hoverBg: "hover:bg-[#4E365E]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#4E365E] border border-stone-400/80"
        };
      default: // Deep Forest Heritage Green (default)
        return {
          bg: "bg-[#1E4D3E]",
          bgHover: "hover:bg-[#12362B]",
          bgLight: "bg-[#F6F5F0]",
          bgLightTransparent: "bg-[#1E4D3E]/8",
          text: "text-[#1E4D3E]",
          textAccent: "text-[#286450]",
          textAccentDark: "text-[#0F2D23]",
          hoverBg: "hover:bg-[#1E4D3E]",
          border: "border-stone-300",
          borderAccent: "border-stone-400",
          borderLight: "border-stone-200",
          glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
          activeTab: "bg-stone-200/50 text-[#1E4D3E] border border-stone-400/50"
        };
    }
  };

  const currentTheme = getThemeColorClasses(activeTenant.colorTheme);

  // User credentials state for RBAC management
  const [credentialsList, setCredentialsList] = useState<typeof PRESET_CREDENTIALS>(() => {
    const saved = localStorage.getItem("expert_aid_credentials");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore credentials directory:", e);
      }
    }
    return PRESET_CREDENTIALS;
  });

  // App UI Navigation states
  const [activeTab, setActiveTab] = useState<string>("pos");
  const [currentBranch, setCurrentBranch] = useState<StoreBranch | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentCashierName, setCurrentCashierName] = useState<string>("John Doe");
  const [loadingState, setLoadingState] = useState<boolean>(true);

  // User Authentication Portal States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [selectedLoginRole, setSelectedLoginRole] = useState<string>("admin");
  const [loginUserId, setLoginUserId] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showQuickFill, setShowQuickFill] = useState<boolean>(false);
  const [otpMode, setOtpMode] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isSuperAdmin = currentUserEmail.toLowerCase() === "superadmin@expertaid.com" && currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super");

  // Active POS cart states
  const [cartItems, setCartItems] = useState<InvoiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [barcodeSearch, setBarcodeSearch] = useState<string>("");
  const [inventorySearchQuery, setInventorySearchQuery] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [billingCustomerName, setBillingCustomerName] = useState<string>("");
  const [billingCustomerPhone, setBillingCustomerPhone] = useState<string>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.UPI);
  const [cashReceived, setCashReceived] = useState<string>("");
  
  // Dialog & Form states
  const [activeBarcodeUrl, setActiveBarcodeUrl] = useState<string | null>(null);
  const [showInvoicePrintPreview, setShowInvoicePrintPreview] = useState<Invoice | null>(null);
  const [selectedPrinterLayout, setSelectedPrinterLayout] = useState<"standard-a4" | "thermal-80mm" | "thermal-58mm">("thermal-80mm");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  
  // Forms states
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    barcode: "",
    category: "Grains & Grocery",
    sku: "",
    purchasePrice: 0,
    price: 0,
    gstRate: 18,
    unit: MeasurementUnit.PIECE,
    stock: 50,
    minStockAlert: 10,
    batchNumber: "B-2026-X",
    expiryDate: "2027-12-31",
    supplierName: ""
  });

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    phone: "",
    email: "",
    creditBalance: 0,
    loyaltyPoints: 0
  });

  const [newTransferForm, setNewTransferForm] = useState({
    productId: "",
    fromBranchId: "",
    toBranchId: "",
    quantity: 1,
    remarks: ""
  });

  // Bulk upload of Products states
  const [bulkInputText, setBulkInputText] = useState<string>("");
  const [bulkParsedProducts, setBulkParsedProducts] = useState<any[]>([]);
  const [bulkUploadTab, setBulkUploadTab] = useState<"file" | "paste">("file");
  const [bulkIsDragging, setBulkIsDragging] = useState<boolean>(false);
  const [bulkUploadError, setBulkUploadError] = useState<string | null>(null);

  // Secure iFrame safe deletion confirmation state
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    category: "Utility (Electricity)",
    amount: 0,
    description: "",
    approvedBy: "Manager"
  });

  const [stockAdjustmentForm, setStockAdjustmentForm] = useState({
    productId: "",
    newStock: 0,
    reason: ""
  });

  // Cash Session State
  const [activeSession, setActiveSession] = useState<CashSession | null>(null);
  const [openingBalance, setOpeningBalance] = useState<number>(2000);
  const [actualCashDrawer, setActualCashDrawer] = useState<number>(0);

  // Notifications
  const [notifText, setNotifText] = useState<string | null>(null);
  const [notifType, setNotifType] = useState<"success" | "warning">("success");

  // Fetch initial state
  const loadState = async () => {
    try {
      setLoadingState(true);
      const res = await fetch("/api/state");
      const data = await res.json();
      if (data) {
        setProducts(data.products || []);
        setSuppliers(data.suppliers || []);
        setCustomers(data.customers || []);
        setInvoices(data.invoices || []);
        setBranches(data.branches || []);
        setExpenses(data.expenses || []);
        setAdjustments(data.adjustments || []);
        setTransfers(data.transfers || []);
        setCashSessions(data.cashSessions || []);
        
        if (data.branches && data.branches.length > 0) {
          setCurrentBranch(data.branches[0]);
        }
      }
    } catch (e) {
      console.error(e);
      triggerNotification("Failed to boot database state. Playing in self-restored fallback.", "warning");
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  // Dynamic URL-based tenant / client detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tenantParam = params.get("subdomain") || params.get("tenant") || params.get("client");
    const hashParam = window.location.hash.replace("#", "").trim();

    // Check potential hostname subdomain
    const hostParts = window.location.hostname.split(".");
    let hostSubdomain: string | null = null;
    if (hostParts.length > 2) {
      const first = hostParts[0].toLowerCase();
      if (!["www", "ais-dev", "ais-pre", "localhost"].includes(first)) {
        hostSubdomain = first;
      }
    }

    const searchKeys = [tenantParam, hashParam, hostSubdomain].filter(Boolean) as string[];
    if (searchKeys.length === 0) return;

    let matchedTenant: Tenant | undefined = undefined;
    for (const key of searchKeys) {
      const cleanKey = key.toLowerCase().trim();
      matchedTenant = tenantsList.find(
        (t) => t.subdomain.toLowerCase() === cleanKey || t.id.toLowerCase() === cleanKey
      );
      if (matchedTenant) break;
    }

    if (matchedTenant && matchedTenant.id !== activeTenantId) {
      setActiveTenantId(matchedTenant.id);
      localStorage.setItem("expert_aid_active_tenant_id", matchedTenant.id);
      triggerNotification(`Auto-configured client workspace to "${matchedTenant.name}" based on URL environment!`, "success");
    }
  }, [tenantsList, activeTenantId]);

  useEffect(() => {
    if (isLoggedIn) {
      const isSuperAdmin = currentUserEmail.toLowerCase() === "superadmin@expertaid.com" && currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super");
      if (isSuperAdmin) {
        const allowedTabs = ["super-admin", "staff-registry", "analytics"];
        if (!allowedTabs.includes(activeTab)) {
          setActiveTab("super-admin");
        }
      }
    }
  }, [isLoggedIn, currentUserEmail, currentRole, currentCashierName, activeTab]);

  const triggerNotification = (text: string, type: "success" | "warning" = "success") => {
    setNotifText(text);
    setNotifType(type);
    setTimeout(() => {
      setNotifText(null);
    }, 4500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const trimmedId = loginUserId.trim().toLowerCase();
    const trimmedPassword = loginPassword.trim();

    if (!trimmedId || !trimmedPassword) {
      setLoginError("Please enter both security identifier email and password.");
      return;
    }

    const match = credentialsList.find(
      (cred) => cred.email.toLowerCase() === trimmedId && cred.password === trimmedPassword
    );

    if (match) {
      setCurrentRole(match.role);
      setCurrentCashierName(match.name);
      setCurrentUserEmail(match.email);
      setIsLoggedIn(true);

      // Lock assigned branch if profile is tied to a specific outlet
      if (match.storeBranchId) {
        const branchMatch = branches.find((b) => b.id === match.storeBranchId);
        if (branchMatch) {
          setCurrentBranch(branchMatch);
          localStorage.setItem("expert_aid_current_branch", JSON.stringify(branchMatch));
        }
      }
      
      // Auto-route based on permissions
      if (match.email.toLowerCase() === "superadmin@expertaid.com") {
        setActiveTab("super-admin");
      } else if (match.role === UserRole.CASHIER) {
        setActiveTab("pos");
      } else if (match.role === UserRole.STORE_KEEPER) {
        setActiveTab("inventory");
      } else {
        setActiveTab("pos");
      }

      // Automatically detect and select the appropriate client company tenant workspace!
      if (trimmedId !== "superadmin@expertaid.com") {
        let tenantMatch = tenantsList.find(
          (t) => t.adminEmail.toLowerCase() === trimmedId
        );

        if (!tenantMatch) {
          tenantMatch = tenantsList.find((t) => {
            const domainParts = trimmedId.split("@");
            if (domainParts.length > 1) {
              const domain = domainParts[1];
              const emailPrefixOfDomain = domain.split(".")[0];
              return (
                emailPrefixOfDomain === t.subdomain.toLowerCase() ||
                domain.toLowerCase() === t.adminEmail.toLowerCase().split("@")[1]
              );
            }
            return false;
          });
        }

        if (!tenantMatch && match.title) {
          tenantMatch = tenantsList.find((t) => {
            return match.title.toLowerCase().includes(t.name.toLowerCase()) || 
                   match.title.toLowerCase().includes(t.subdomain.toLowerCase());
          });
        }

        if (tenantMatch) {
          setActiveTenantId(tenantMatch.id);
          localStorage.setItem("expert_aid_active_tenant_id", tenantMatch.id);
        }
      }

      triggerNotification(`Access Granted: Welcome back, ${match.name}!`, "success");
    } else {
      setLoginError("Access Denied: Invalid security credentials. Please double-check or click a quick-fill card.");
    }
  };

  const handleQuickLogin = (cred: typeof PRESET_CREDENTIALS[0]) => {
    setLoginUserId(cred.email);
    setLoginPassword(cred.password);
    setCurrentRole(cred.role);
    setCurrentCashierName(cred.name);
    setCurrentUserEmail(cred.email);
    setIsLoggedIn(true);

    if (cred.email.toLowerCase() === "superadmin@expertaid.com") {
      setActiveTab("super-admin");
    } else if (cred.role === UserRole.CASHIER) {
      setActiveTab("pos");
    } else if (cred.role === UserRole.STORE_KEEPER) {
      setActiveTab("inventory");
    } else {
      setActiveTab("pos");
    }

    // Automatically detect and select the appropriate client company tenant workspace!
    const trimmedId = cred.email.toLowerCase();
    if (trimmedId !== "superadmin@expertaid.com") {
      let tenantMatch = tenantsList.find(
        (t) => t.adminEmail.toLowerCase() === trimmedId
      );

      if (!tenantMatch) {
        tenantMatch = tenantsList.find((t) => {
          const domainParts = trimmedId.split("@");
          if (domainParts.length > 1) {
            const domain = domainParts[1];
            const emailPrefixOfDomain = domain.split(".")[0];
            return (
              emailPrefixOfDomain === t.subdomain.toLowerCase() ||
              domain.toLowerCase() === t.adminEmail.toLowerCase().split("@")[1]
            );
          }
          return false;
        });
      }

      if (tenantMatch) {
        setActiveTenantId(tenantMatch.id);
        localStorage.setItem("expert_aid_active_tenant_id", tenantMatch.id);
      }
    }

    triggerNotification(`Authorized System Unlock: Logged in as ${cred.title}!`, "success");
  };

  const handleImpersonateClient = (email: string) => {
    const match = credentialsList.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (match) {
      setCurrentRole(match.role);
      setCurrentCashierName(match.name);
      setCurrentUserEmail(match.email);
      setIsLoggedIn(true);

      // Find tenant match
      let tenantMatch = tenantsList.find(
        (t) => t.adminEmail.toLowerCase() === email.toLowerCase()
      );
      if (!tenantMatch) {
        tenantMatch = tenantsList.find((t) => {
          const domainParts = email.split("@");
          if (domainParts.length > 1) {
            const domain = domainParts[1];
            const emailPrefixOfDomain = domain.split(".")[0];
            return (
              emailPrefixOfDomain === t.subdomain.toLowerCase() ||
              domain.toLowerCase() === t.adminEmail.toLowerCase().split("@")[1]
            );
          }
          return false;
        });
      }
      if (!tenantMatch && match.title) {
        tenantMatch = tenantsList.find((t) => {
          return match.title.toLowerCase().includes(t.name.toLowerCase()) || 
                 match.title.toLowerCase().includes(t.subdomain.toLowerCase());
        });
      }
      if (tenantMatch) {
        setActiveTenantId(tenantMatch.id);
        localStorage.setItem("expert_aid_active_tenant_id", tenantMatch.id);
      }
      setActiveTab("pos");
      triggerNotification(`Access Granted: Logged in as ${match.name} (Admin)!`, "success");
    } else {
      triggerNotification("Access profile not found for this client.", "warning");
    }
  };

  const handleCopyText = async (text: string, key: string) => {
    let success = false;
    
    // 1. Try modern clipboard API if available
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.warn("Modern clipboard writeText rejected, falling back...", err);
      }
    }

    // 2. Clear fallback via creating a temporary textarea element
    if (!success) {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "");
        // Position off-screen
        el.style.position = "absolute";
        el.style.left = "-9999px";
        el.style.top = "0";
        document.body.appendChild(el);
        
        // Save focus
        const activeEl = document.activeElement as HTMLElement;
        el.select();
        el.setSelectionRange(0, 99999); // Mobile compatibility
        
        const copied = document.execCommand("copy");
        document.body.removeChild(el);
        if (copied) {
          success = true;
        }
        
        if (activeEl && typeof activeEl.focus === "function") {
          activeEl.focus();
        }
      } catch (err) {
        console.error("Textarea absolute fallback copy failed:", err);
      }
    }

    if (success) {
      setCopiedKey(key);
      triggerNotification("Copied credential to clipboard!", "success");
      setTimeout(() => setCopiedKey(null), 1500);
    } else {
      triggerNotification("Copy failed. Please manually select the text below.", "warning");
    }
  };

  // Switch role restriction handling
  const checkAccess = (allowedList: UserRole[]) => {
    return allowedList.includes(currentRole);
  };

  // Add Item to POS Cart
  const handleAddToCart = (product: Product) => {
    const availStock = getProductStock(product);
    if (availStock <= 0) {
      triggerNotification(`Product ${product.name} is out of stock in this branch!`, "warning");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        // Check stock limitation
        if (existing.quantity >= availStock) {
          triggerNotification(`Only ${availStock} units available in this branch's inventory.`, "warning");
          return prev;
        }
        return prev.map((item) => {
          if (item.productId === product.id) {
            const nextQty = item.quantity + 1;
            const subtotal = nextQty * item.price;
            const gstAmount = Number(((subtotal * item.gstRate) / (100 + item.gstRate)).toFixed(2));
            return { ...item, quantity: nextQty, subtotal, gstAmount };
          }
          return item;
        });
      }

      // Add fresh
      const gstAmount = Number(((product.price * product.gstRate) / (100 + product.gstRate)).toFixed(2));
      const newItem: InvoiceItem = {
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        price: product.price,
        quantity: 1,
        unit: product.unit,
        gstRate: product.gstRate,
        gstAmount,
        subtotal: product.price
      };
      return [...prev, newItem];
    });
  };

  // Modify quantities inside Cart
  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    const prod = tenantProducts.find((p) => p.id === productId);
    if (!prod) return;

    const availStock = getProductStock(prod);

    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null; // removal handled next
            if (nextQty > availStock) {
              triggerNotification(`Cannot exceed available branch stock (${availStock}).`, "warning");
              return item;
            }
            const subtotal = nextQty * item.price;
            const gstAmount = Number(((subtotal * item.gstRate) / (100 + item.gstRate)).toFixed(2));
            return { ...item, quantity: nextQty, subtotal, gstAmount };
          }
          return item;
        })
        .filter(Boolean) as InvoiceItem[];
    });
  };

  // Remove directly from cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Barcode simulation handler
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeSearch.trim()) return;
    const match = tenantProducts.find(
      (p) => p.barcode === barcodeSearch.trim() || p.sku.toLowerCase() === barcodeSearch.trim().toLowerCase()
    );
    if (match) {
      handleAddToCart(match);
      triggerNotification(`Scanned successfully: ${match.name}`, "success");
      setBarcodeSearch("");
    } else {
      triggerNotification(`No active product found for barcode '${barcodeSearch}'`, "warning");
    }
  };

  // Calculate pricing
  const subTotalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const taxAmountOfCart = cartItems.reduce((acc, item) => acc + item.gstAmount, 0);
  const discountAmount = Number(((subTotalAmount * appliedDiscountPercent) / 100).toFixed(2));
  const grandTotalAmount = Math.max(0, subTotalAmount - discountAmount);

  // Handle coupon check
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME5") {
      setAppliedDiscountPercent(5);
      triggerNotification("5% discount coupon WELCOME5 applied!", "success");
    } else if (code === "FESTIVE10") {
      setAppliedDiscountPercent(10);
      triggerNotification("10% festival discount code FESTIVE10 applied!", "success");
    } else if (code === "BIGBUDGET") {
      setAppliedDiscountPercent(15);
      triggerNotification("VVIP Super budget code 15% discount applied!", "success");
    } else {
      triggerNotification("Invalid or expired coupon code. Try WELCOME5 or FESTIVE10.", "warning");
    }
  };

  // Complete checkout process
  const handlePOSCheckout = async () => {
    if (cartItems.length === 0) {
      triggerNotification("Your active billing cart is empty.", "warning");
      return;
    }

    // Role restrictions
    if (!checkAccess([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER])) {
      triggerNotification("Store Keepers do not have checkout permissions.", "warning");
      return;
    }

    const valCash = Number(cashReceived);
    if (paymentMode === PaymentMode.CASH && (isNaN(valCash) || valCash < grandTotalAmount)) {
      triggerNotification(`Insufficient cash amount specified. Total target is ₹${grandTotalAmount.toFixed(2)}`, "warning");
      return;
    }

    const changeReturned = paymentMode === PaymentMode.CASH ? valCash - grandTotalAmount : 0;
    
    const invoiceId = `EAS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(
      Math.floor(1000 + Math.random() * 9000)
    )}`;

    const newInvoice: Invoice = {
      id: invoiceId,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerId: selectedCustomer?.id || undefined,
      customerName: billingCustomerName.trim() || "Regular Customer/Loyalty Guest",
      customerPhone: billingCustomerPhone.trim() || undefined,
      items: cartItems,
      subtotal: subTotalAmount,
      taxAmount: taxAmountOfCart,
      discountPercent: appliedDiscountPercent,
      discountAmount,
      couponCode: couponCode ? couponCode : undefined,
      grandTotal: grandTotalAmount,
      paymentMode,
      cashReceived: paymentMode === PaymentMode.CASH ? valCash : undefined,
      changeReturned: paymentMode === PaymentMode.CASH ? changeReturned : undefined,
      cashierName: currentCashierName,
      storeBranchId: currentBranch?.id || "B1",
      status: "PAID"
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice)
      });
      const data = await res.json();
      if (data.success) {
        // Redraw lists
        setProducts(data.state.products);
        setInvoices(data.state.invoices);
        setCustomers(data.state.customers);
        
        // Show Thermal Receipt preview
        setShowInvoicePrintPreview(newInvoice);
        triggerNotification(`Invoice checkout generated successfully! Reference ID: ${invoiceId}`, "success");
        
        // Reset POS active cart
        setCartItems([]);
        setSelectedCustomer(null);
        setBillingCustomerName("");
        setBillingCustomerPhone("");
        setCouponCode("");
        setAppliedDiscountPercent(0);
        setCashReceived("");
      }
    } catch (e) {
      triggerNotification("Failed to finalize transaction on database.", "warning");
    }
  };

  // Change branch dropdown simulator
  const handleBranchChange = (branchId: string) => {
    const selected = branches.find((b) => b.id === branchId);
    if (selected) {
      setCurrentBranch(selected);
      triggerNotification(`Switched to active branch: ${selected.name}`, "success");
    }
  };

  // Create new Product
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku || !newProduct.barcode || !newProduct.price) {
      triggerNotification("Please fill in name, SKU, Barcode, and MRP Price fields.", "warning");
      return;
    }

    // Assign dynamic product ID
    const productPayload: Product = {
      id: newProduct.id || `PROD-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newProduct.name,
      barcode: newProduct.barcode,
      category: newProduct.category || "General",
      sku: newProduct.sku,
      purchasePrice: Number(newProduct.purchasePrice || 0),
      price: Number(newProduct.price || 0),
      gstRate: Number(newProduct.gstRate || 0),
      unit: newProduct.unit || MeasurementUnit.PIECE,
      stock: Number(newProduct.stock || 0),
      minStockAlert: Number(newProduct.minStockAlert || 5),
      batchNumber: newProduct.batchNumber || "B-NEW",
      expiryDate: newProduct.expiryDate || "2027-12-31",
      supplierName: newProduct.supplierName || "Apex Retail Supplies",
      tenantId: activeTenantId
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        triggerNotification(`Product '${productPayload.name}' saved successfully in master catalogue.`, "success");
        // Reset form
        setNewProduct({
          name: "",
          barcode: "",
          category: "Grains & Grocery",
          sku: "",
          purchasePrice: 0,
          price: 0,
          gstRate: 5,
          unit: MeasurementUnit.PIECE,
          stock: 45,
          minStockAlert: 10,
          batchNumber: `B-${String(new Date().getFullYear())}-A`,
          expiryDate: "2027-12-31",
          supplierName: "Apex Retail Supplies"
        });
      }
    } catch (err) {
      triggerNotification("Database connection failure creating product catalogue.", "warning");
    }
  };

  const handleResetProductForm = () => {
    setNewProduct({
      name: "",
      barcode: "",
      category: "Grains & Grocery",
      sku: "",
      purchasePrice: 0,
      price: 0,
      gstRate: 18,
      unit: MeasurementUnit.PIECE,
      stock: 50,
      minStockAlert: 10,
      batchNumber: "B-2026-X",
      expiryDate: "2027-12-31",
      supplierName: ""
    });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setProductToDelete({ id, name });
  };

  const handleDeleteProductConfirm = async () => {
    if (!productToDelete) return;
    const { id, name } = productToDelete;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        triggerNotification(`Product "${name}" deleted from catalogue database.`, "success");
        if (newProduct.id === id) {
          handleResetProductForm();
        }
      } else {
        triggerNotification("Failed to delete product.", "warning");
      }
    } catch (e) {
      triggerNotification("Error connecting to catalog database.", "warning");
    } finally {
      setProductToDelete(null);
    }
  };


  const parseCSVText = (text: string) => {
    try {
      setBulkUploadError(null);
      if (!text.trim()) {
        setBulkParsedProducts([]);
        return;
      }

      const lines: string[] = [];
      let currentLine = "";
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          inQuotes = !inQuotes;
          currentLine += char;
        } else if (char === '\n' && !inQuotes) {
          lines.push(currentLine);
          currentLine = "";
        } else if (char === '\r' && !inQuotes) {
          // ignore
        } else {
          currentLine += char;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }

      const filteredLines = lines.map(l => l.trim()).filter(l => l.length > 0);
      if (filteredLines.length < 1) {
        setBulkParsedProducts([]);
        return;
      }

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let cur = "";
        let inQ = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQ = !inQ;
          } else if (char === ',' && !inQ) {
            result.push(cur.trim());
            cur = "";
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      };

      const firstLineTokens = parseCSVLine(filteredLines[0]);
      const hasHeader = firstLineTokens.some(tok => 
        ["name", "sku", "barcode", "category", "price", "mrp", "cost"].includes(tok.toLowerCase().replace(/\s/g, ""))
      );

      let dataLines = filteredLines;
      let headers = ["name", "sku", "barcode", "category", "purchasePrice", "price", "gstRate", "unit", "stock", "minStockAlert", "batchNumber", "expiryDate", "supplierName"];

      if (hasHeader) {
        const csvHeaders = firstLineTokens.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
        headers = csvHeaders.map(h => {
          // Check longer/more specific words first to avoid false matches (e.g. "suppliername" has "name")
          if (h.includes("supplier") || h.includes("vendor")) return "supplierName";
          if (h === "sku" || h.includes("sku") || h.includes("itemcode")) return "sku";
          if (h === "name" || h === "productname" || h === "title" || h === "description" || h === "itemname") return "name";
          if (h.includes("name") && !h.includes("brand") && !h.includes("manufacturer")) return "name";
          if (h.includes("barcode") || h.includes("upc") || h.includes("ean")) return "barcode";
          if (h.includes("category")) return "category";
          if (h.includes("purchase") || h === "cost" || h.includes("cogs")) return "purchasePrice";
          if (h === "price" || h.includes("mrp") || h.includes("selling")) return "price";
          if (h.includes("gst") || h.includes("tax")) return "gstRate";
          if (h === "unit" || h.includes("unit")) return "unit";
          if (h.includes("stock") || h === "qty" || h.includes("quantity")) return "stock";
          if (h.includes("alert") || h.includes("min")) return "minStockAlert";
          if (h.includes("batch")) return "batchNumber";
          if (h.includes("expiry") || h.includes("date")) return "expiryDate";
          return "";
        });
        dataLines = filteredLines.slice(1);
      }

      const parsed: any[] = [];
      for (const line of dataLines) {
        const tokens = parseCSVLine(line);
        if (tokens.length === 0 || (tokens.length === 1 && !tokens[0])) continue;

        const p: any = {};
        headers.forEach((key, idx) => {
          if (!key) return;
          let val = tokens[idx] || "";
          if (["purchasePrice", "price", "gstRate", "stock", "minStockAlert"].includes(key)) {
            p[key] = Number(val) || 0;
          } else {
            if (key === "barcode" && /^\d+(\.\d+)?[eE]\+?\d+$/.test(val)) {
              try {
                const num = Number(val);
                if (!isNaN(num)) {
                  val = num.toFixed(0);
                }
              } catch (e) {}
            }
            p[key] = val;
          }
        });

        p.tenantId = activeTenantId;
        p.isValid = !!(p.name && p.sku);
        p.validationError = p.isValid ? null : "Name & SKU are strictly required.";
        parsed.push(p);
      }

      setBulkParsedProducts(parsed);
    } catch (e) {
      setBulkUploadError("Failed to parse CSV block. Please check format structure.");
      setBulkParsedProducts([]);
    }
  };

  const parseJSONText = (text: string) => {
    try {
      setBulkUploadError(null);
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setBulkUploadError("JSON must be a flat array of product objects.");
        setBulkParsedProducts([]);
        return;
      }
      const mapped = parsed.map(item => {
        const getVal = (aliases: string[], fallback: any = "") => {
          // 1. Try exact match first
          for (const alias of aliases) {
            const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, "");
            for (const key of Object.keys(item)) {
              const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
              if (cleanKey === cleanAlias) {
                return item[key];
              }
            }
          }
          // 2. Try partial match with exclusions (e.g., searching for "name" shouldn't match "suppliername" or "vendorname")
          for (const alias of aliases) {
            const cleanAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, "");
            for (const key of Object.keys(item)) {
              const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
              if (cleanAlias === "name" && (cleanKey.includes("supplier") || cleanKey.includes("vendor") || cleanKey.includes("brand") || cleanKey.includes("manufacturer"))) {
                continue;
              }
              if (cleanAlias.length >= 3 && cleanKey.includes(cleanAlias)) {
                return item[key];
              }
            }
          }
          return fallback;
        };

        const name = getVal(["name", "description", "title"]);
        const sku = getVal(["sku", "itemcode"]);
        const barcode = getVal(["barcode", "upc", "ean"]);
        const category = getVal(["category", "type"]);
        const purchasePrice = getVal(["purchasePrice", "cost", "cogs", "purchase"]);
        const price = getVal(["price", "mrp", "selling"]);
        const gstRate = getVal(["gstRate", "tax", "gst"]);
        const unit = getVal(["unit", "measurement"]);
        const stock = getVal(["stock", "qty", "quantity"]);
        const minStockAlert = getVal(["minStockAlert", "alert", "min"]);
        const batchNumber = getVal(["batchNumber", "batch"]);
        const expiryDate = getVal(["expiryDate", "expiry"]);
        const supplierName = getVal(["supplierName", "vendor", "supplier"]);

        let barcodeVal = barcode;
        if (typeof barcodeVal === "string" && /^\d+(\.\d+)?[eE]\+?\d+$/.test(barcodeVal)) {
          try {
            const num = Number(barcodeVal);
            if (!isNaN(num)) {
              barcodeVal = num.toFixed(0);
            }
          } catch (e) {}
        } else if (typeof barcodeVal === "number") {
          barcodeVal = String(barcodeVal);
        }

        const p = {
          name: name || "",
          sku: sku || "",
          barcode: barcodeVal || sku || `BC-${Math.floor(100000 + Math.random() * 900000)}`,
          category: category || "General",
          purchasePrice: Number(purchasePrice || 0),
          price: Number(price || 0),
          gstRate: Number(gstRate || 0),
          unit: unit || "Pieces",
          stock: Number(stock || 0),
          minStockAlert: Number(minStockAlert || 5),
          batchNumber: batchNumber || "B-BULK",
          expiryDate: expiryDate || "2027-12-31",
          supplierName: supplierName || "Apex Retail Supplies",
          tenantId: activeTenantId
        };
        return {
          ...p,
          isValid: !!(p.name && p.sku),
          validationError: (p.name && p.sku) ? null : "Name & SKU keys are required."
        };
      });
      setBulkParsedProducts(mapped);
    } catch (e) {
      setBulkUploadError("Invalid JSON array. Paste a valid JSON list.");
      setBulkParsedProducts([]);
    }
  };

  const handleBulkInputChange = (text: string) => {
    setBulkInputText(text);
    const cleaned = text.trim();
    if (!cleaned) {
      setBulkParsedProducts([]);
      return;
    }
    if (cleaned.startsWith("[")) {
      parseJSONText(cleaned);
    } else {
      parseCSVText(cleaned);
    }
  };

  const handleBulkUploadSubmit = async () => {
    const validOnes = bulkParsedProducts.filter(p => p.isValid);
    if (validOnes.length === 0) {
      triggerNotification("No valid products parsed to commit. Please verify Name and SKU fields.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: validOnes })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        triggerNotification(`Bulk upload complete! Added ${data.addedCount} new, updated ${data.updatedCount} existing retail products in master database catalog.`, "success");
        setBulkInputText("");
        setBulkParsedProducts([]);
      } else {
        triggerNotification(data.error || "Failed to catalog bulk records.", "warning");
      }
    } catch (e) {
      triggerNotification("Database connection failed during bulk commit.", "warning");
    }
  };

  // Stock discrepancy Level Adjustment
  const handleStockAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustmentForm.productId || stockAdjustmentForm.newStock === undefined) {
      triggerNotification("Please select a target product and enter stock quantity.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/adjust-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: stockAdjustmentForm.productId,
          newStock: Number(stockAdjustmentForm.newStock),
          reason: stockAdjustmentForm.reason || "Manual warehouse evaluation",
          adjustedBy: currentCashierName,
          branchId: currentBranch?.id || "B1"
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setAdjustments(data.adjustments);
        triggerNotification("Stock adjustment level corrected successfully.", "success");
        setStockAdjustmentForm({ productId: "", newStock: 0, reason: "" });
      }
    } catch (err) {
      triggerNotification("Database offline, unable to log adjustment.", "warning");
    }
  };

  const handleCreateTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransferForm.productId || !newTransferForm.fromBranchId || !newTransferForm.toBranchId) {
      triggerNotification("Please select product, origin, and destination branches.", "warning");
      return;
    }
    if (newTransferForm.fromBranchId === newTransferForm.toBranchId) {
      triggerNotification("Source and Destination branches must be different.", "warning");
      return;
    }
    if (newTransferForm.quantity <= 0) {
      triggerNotification("Transfer quantity must be greater than zero.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: newTransferForm.productId,
          fromBranchId: newTransferForm.fromBranchId,
          toBranchId: newTransferForm.toBranchId,
          quantity: Number(newTransferForm.quantity),
          requestedBy: currentCashierName
        })
      });
      const data = await res.json();
      if (data.success) {
        setTransfers(data.transfers);
        triggerNotification(`Stock transfer request submitted successfully!`, "success");
        setNewTransferForm({
          productId: "",
          fromBranchId: "",
          toBranchId: "",
          quantity: 1,
          remarks: ""
        });
      } else {
        triggerNotification(data.error || "Failed to create transfer request", "warning");
      }
    } catch (err) {
      triggerNotification("Server error, unable to process transfer.", "warning");
    }
  };

  const handleProcessTransfer = async (transferId: string, action: "APPROVED" | "REJECTED", comments: string = "") => {
    try {
      const res = await fetch(`/api/transfers/${transferId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          actionedBy: currentCashierName,
          comments
        })
      });
      const data = await res.json();
      if (data.success) {
        setTransfers(data.transfers);
        setProducts(data.products);
        triggerNotification(`Transfer request ${transferId} has been ${action.toLowerCase()}.`, "success");
      } else {
        triggerNotification(data.error || "Failed to action transfer request", "warning");
      }
    } catch (err) {
      triggerNotification("Server error actioning transfer.", "warning");
    }
  };

  // Register loyalty client
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      triggerNotification("Please input customer name and phone digits.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
      });
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
        triggerNotification(`Registered customer '${newCustomer.name}' successfully!`, "success");
        // Clear
        setNewCustomer({ name: "", phone: "", email: "", creditBalance: 0, loyaltyPoints: 0 });
      }
    } catch (err) {
      triggerNotification("Unable to link client on network database.", "warning");
    }
  };

  // Register Store Expense
  const handleCreateExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.description) {
      triggerNotification("Please fill in expense amount and detailed reasons.", "warning");
      return;
    }

    const payload = {
      date: new Date().toISOString().split("T")[0],
      category: newExpense.category,
      amount: Number(newExpense.amount),
      description: newExpense.description,
      approvedBy: currentCashierName,
      storeBranchId: currentBranch?.id || "B1"
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setExpenses(data.expenses);
        triggerNotification("Expense recorded on ledger, awaiting central audit.", "success");
        setNewExpense({ category: "Utility (Electricity)", amount: 0, description: "", approvedBy: "Manager" });
      }
    } catch (err) {
      triggerNotification("Database connection timeout filing expense.", "warning");
    }
  };

  // Add new Supplier/Vendor
  const handleAddSupplier = async (supplierPayload: Omit<Supplier, "id">) => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierPayload)
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.suppliers);
      } else {
        throw new Error("Failed to add supplier");
      }
    } catch (e) {
      console.error("Error adding supplier:", e);
      throw e;
    }
  };

  // Delete Supplier/Vendor
  const handleDeleteSupplier = async (id: string) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.suppliers);
      } else {
        throw new Error("Failed to delete supplier");
      }
    } catch (e) {
      console.error("Error deleting supplier:", e);
      throw e;
    }
  };

  // Add new Branch Location
  const handleAddBranch = async (branchPayload: Omit<StoreBranch, "id"> & { id?: string }) => {
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branchPayload)
      });
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches);
      } else {
        throw new Error("Failed to add branch");
      }
    } catch (e) {
      console.error("Error adding branch:", e);
      throw e;
    }
  };

  // Delete Branch Location
  const handleDeleteBranch = async (id: string) => {
    try {
      const res = await fetch(`/api/branches/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches);
        // If we deleted our current branch, default to first available
        if (currentBranch?.id === id && data.branches.length > 0) {
          setCurrentBranch(data.branches[0]);
        }
      } else {
        throw new Error("Failed to delete branch");
      }
    } catch (e) {
      console.error("Error deleting branch:", e);
      throw e;
    }
  };

  // Active product barcode generator UI view trigger
  const triggerBarcodeGenerator = (sku: string) => {
    // Generate beautiful clean SVG simulation barcode lines
    setActiveBarcodeUrl(sku);
  };

  // Active products filter categorization
  const filteredProductsBySearch = tenantProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === "All") return matchesSearch;
    return matchesSearch && p.category === categoryFilter;
  });

  // Unique categories list
  const productCategoriesList = ["All", ...productCategories];

  // Helper function to resolve stock of a product for the currently selected branch
  const getProductStock = (p: Product) => {
    if (currentBranch && p.branchStocks) {
      return p.branchStocks[currentBranch.id] ?? 0;
    }
    return p.stock;
  };

  // Filter invoices and expenses based on selected branch
  const tenantAndBranchInvoices = invoices.filter((inv) => {
    if (currentBranch) {
      return inv.storeBranchId === currentBranch.id;
    }
    return true;
  });

  const tenantAndBranchExpenses = expenses.filter((exp) => {
    if (currentBranch) {
      return exp.storeBranchId === currentBranch.id;
    }
    return true;
  });

  // Computing analytics parameters
  const totalInvoicedRevenue = tenantAndBranchInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);
  const totalTaxGSTLiability = tenantAndBranchInvoices.reduce((acc, inv) => acc + inv.taxAmount, 0);
  
  // Back Office calculations (Profit = items MRP - items COGS - expenses)
  const totalWarehouseCOGS = tenantAndBranchInvoices.reduce((acc, inv) => {
    return acc + inv.items.reduce((innerAcc, item) => {
      const matchDetails = products.find((prod) => prod.id === item.productId);
      const costAmountUnit = matchDetails ? matchDetails.purchasePrice : (item.price * 0.7);
      return innerAcc + (costAmountUnit * item.quantity);
    }, 0);
  }, 0);

  const totalStoreExpenses = tenantAndBranchExpenses.reduce((acc, item) => acc + item.amount, 0);
  const calculatedOperationalNetProfit = Math.max(0, (totalInvoicedRevenue - totalWarehouseCOGS - totalStoreExpenses));

  // Low stock counter alerts
  const lowStockAlertProducts = tenantProducts.filter((p) => getProductStock(p) <= p.minStockAlert);
  const nearExpiryProductsAlert = tenantProducts.filter((p) => {
    const expDate = new Date(p.expiryDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30; // 30 day shelf-life warning
  });

  if (!isLoggedIn) {
    const handleOtpSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (otpInput.trim() === "123456") {
        // Log in as tenant admin by default
        const match = credentialsList.find(c => c.email === "admin@expertaid.com") || PRESET_CREDENTIALS[1];
        setCurrentRole(match.role);
        setCurrentCashierName(match.name);
        setCurrentUserEmail(match.email);
        setIsLoggedIn(true);
        setActiveTab("pos");
        triggerNotification("Authenticated successfully via secure OTP!", "success");
      } else {
        triggerNotification("Invalid OTP code. Please use 123456 for demo.", "warning");
      }
    };

    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-[#d4e2ff] to-[#eef2f9] flex items-center justify-center p-3 sm:p-6 md:p-8 relative overflow-y-auto font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900" id="secured-login-portal">


        {/* Outer Split Canvas Wrapper matching the attachment */}
        <div className="w-full max-w-7xl bg-gradient-to-tr from-[#d3e3fd] via-[#e8f0fe] to-[#f4f8ff] rounded-[2.5rem] shadow-2xl border border-white/60 flex flex-col lg:flex-row overflow-hidden relative min-h-[680px] lg:min-h-[760px]">
          
          {/* Left Column (Branding, Features Grid & Beautiful UI Mockup illustration) */}
          <div className="w-full lg:w-[56%] p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden select-none">
            {/* Soft ambient backgrounds in left panel */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-300/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              {/* ExpertAid High Fidelity SVG Logo Header */}
              <ExpertAidLogo />

              {/* Display Header Text */}
              <div className="mt-8">
                <h1 className="text-[#0f172a] font-sans font-black text-3xl sm:text-4xl lg:text-[44px] tracking-tight leading-[1.08]">
                  Smart Billing Software
                </h1>
                <p className="text-slate-600 font-sans font-medium text-sm sm:text-base mt-2.5 max-w-lg leading-relaxed">
                  Manage your Business, Invoices, Inventory, GST & Reports in one place.
                </p>
              </div>

              {/* Two-Column Features Matrix Grid exactly mimicking screenshot icons */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-5 mt-7 max-w-xl">
                {[
                  { label: "Invoice Management", icon: FileText },
                  { label: "Customer Management", icon: Users },
                  { label: "Inventory Management", icon: ShoppingBag },
                  { label: "Sales Analytics", icon: TrendingUp },
                  { label: "Payment Tracking", icon: CreditCard },
                  { label: "Reports & Accounting", icon: Layers },
                  { label: "GST Billing", icon: Percent },
                  { label: "Role-Based Access", icon: Shield }
                ].map((feat, i) => {
                  const IconComp = feat.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 hover:translate-x-1 transition-transform duration-200">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-slate-800 font-sans font-extrabold text-xs sm:text-[13px] tracking-tight">
                        {feat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Desktop Software View with Live Charts & Physical Cartoon Assets */}
            <div className="mt-8 lg:mt-6 mb-8 lg:mb-0 relative w-full max-w-xl mx-auto h-72 hidden md:block">
              {/* Laptop Screen Frame with shadows */}
              <div className="w-96 h-[220px] bg-slate-900 rounded-t-2xl border-t-2 border-x-2 border-slate-700/80 shadow-[0_25px_50px_-12px_rgba(30,41,59,0.3)] relative z-20 flex flex-col overflow-hidden mx-auto">
                {/* Simulated Screen Header */}
                <div className="h-4.5 bg-slate-800 border-b border-slate-950 flex items-center justify-between px-2">
                  <div className="flex gap-1.2 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
                  </div>
                  <span className="text-[7.5px] font-mono text-slate-400 font-bold uppercase tracking-widest">Workspace Terminal</span>
                  <div className="w-5"></div>
                </div>

                {/* Dashboard Screen Content */}
                <div className="bg-slate-50 flex-1 p-2.5 flex flex-col gap-2 overflow-hidden select-none text-[8px]">
                  {/* Top Header bar inside software */}
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                    <span className="font-sans font-black text-slate-800 text-[10px]">Dashboard Overview</span>
                    <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-[6px] px-1 py-0.2 rounded uppercase border border-emerald-200/50">Node Online</span>
                  </div>

                  {/* KPI Mini Bento Grid */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { title: "Total Sales", val: "₹ 45,750.00", color: "text-blue-600" },
                      { title: "Total Invoices", val: "320", color: "text-slate-800" },
                      { title: "Total Customers", val: "150", color: "text-slate-800" },
                      { title: "Total Due", val: "₹ 12,540.00", color: "text-rose-500" }
                    ].map((k, idx) => (
                      <div key={idx} className="bg-white rounded-md border border-slate-200/70 p-1 flex flex-col justify-between shadow-3xs">
                        <span className="text-slate-400 text-[5px] font-bold uppercase font-sans truncate">{k.title}</span>
                        <span className={`text-[7px] font-sans font-extrabold tracking-tight truncate ${k.color}`}>{k.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Live SVG Graph & Donut split */}
                  <div className="flex-1 flex gap-2 overflow-hidden">
                    {/* Graph Panel */}
                    <div className="bg-white rounded-md border border-slate-200/70 p-1.5 flex-1 flex flex-col justify-between relative overflow-hidden">
                      <div className="flex justify-between items-center mb-1 relative z-10">
                        <span className="text-slate-500 font-bold text-[5.5px] uppercase">Sales Trend</span>
                        <span className="text-blue-600 font-mono text-[5px] font-bold">+18.4%</span>
                      </div>
                      
                      {/* Interactive Sparkline path */}
                      <div className="flex-1 w-full relative">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid line guidelines */}
                          <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
                          <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                          {/* Filled area */}
                          <path d="M0 25 L10 20 L25 24 L40 12 L55 18 L70 6 L85 15 L100 8 L100 30 L0 30 Z" fill="url(#chartFill)" />
                          {/* Sparkline curve */}
                          <path d="M0 25 L10 20 L25 24 L40 12 L55 18 L70 6 L85 15 L100 8" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          {/* Floating dots */}
                          <circle cx="70" cy="6" r="1.5" fill="#2563eb" stroke="#ffffff" strokeWidth="0.5" />
                          <circle cx="100" cy="8" r="1.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.5" />
                        </svg>
                      </div>

                      {/* X Axis Months */}
                      <div className="flex justify-between text-slate-400 text-[4.5px] font-mono mt-0.5">
                        <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                      </div>
                    </div>

                    {/* Donut Chart Panel */}
                    <div className="bg-white rounded-md border border-slate-200/70 p-1.5 w-20 flex flex-col items-center justify-between">
                      <span className="text-slate-500 font-bold text-[5.5px] uppercase text-center block w-full truncate">Top Products</span>
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        {/* Ring Chart SVG */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.2" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="50 50" strokeDashoffset="0" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="30 70" strokeDashoffset="-50" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="-80" />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-[6px] font-black text-slate-800 leading-none">84%</span>
                          <span className="text-[4px] text-slate-400 font-bold uppercase leading-none scale-90">LTV</span>
                        </div>
                      </div>
                      <div className="flex justify-center gap-1 scale-90">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heavy Duty Bezel Frame Base for Laptop */}
              <div className="w-[430px] h-3 bg-slate-800 rounded-b-xl border-b-2 border-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.15)] absolute bottom-11 left-1/2 transform -translate-x-1/2 z-30">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-slate-900 rounded-b-sm"></div>
              </div>

              {/* Simulated Float-over Invoice Paper Sheet (Left of laptop) */}
              <div className="absolute left-2 lg:left-6 bottom-4 w-40 bg-white rounded-xl border border-slate-200/80 shadow-[0_15px_30px_rgba(0,0,0,0.08)] p-3 z-35 transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-1.5">
                  <div className="flex flex-col">
                    <span className="text-[7.5px] font-black text-slate-900 uppercase tracking-wider">TAX INVOICE</span>
                    <span className="text-[5.5px] font-mono text-slate-400 mt-0.5">INV-2024-001</span>
                  </div>
                  <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-[8px] border border-emerald-100">
                    ✓
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[6px] text-slate-500 font-medium">
                    <span>A4 Printer Ink</span><span>1x</span><span>₹ 840.00</span>
                  </div>
                  <div className="flex justify-between text-[6px] text-slate-500 font-medium">
                    <span>Thermal Rolls</span><span>10x</span><span>₹ 450.00</span>
                  </div>
                  <div className="flex justify-between text-[6px] text-slate-500 font-medium">
                    <span>Barcode Reader</span><span>1x</span><span>₹ 1,290.00</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 mt-2 pt-1.5 flex justify-between items-center">
                  <span className="text-[5px] text-slate-400 font-sans font-bold">GST & SURCHARGES INCL.</span>
                  <span className="text-[8.5px] font-sans font-black text-slate-900">₹ 2,580.00</span>
                </div>
                <div className="bg-slate-50 text-[5px] text-slate-400 text-center py-1 mt-1.5 rounded uppercase font-bold tracking-wider font-mono">
                  Thank you for your business!
                </div>
              </div>

              {/* Simulated Cardboard boxes representing warehouses (Right of laptop) */}
              <div className="absolute right-4 lg:right-10 bottom-6 flex flex-col items-end z-35 transform rotate-3 hover:-rotate-1 hover:scale-105 transition-transform duration-300">
                {/* Box 3 - Top small */}
                <div className="w-10 h-8 bg-[#d97706]/85 rounded-md border border-[#b45309] shadow-sm relative flex items-center justify-center">
                  <div className="absolute top-0 w-full h-[3px] bg-[#92400e]/50"></div>
                  <div className="absolute left-[40%] w-[3px] h-full bg-[#92400e]/30"></div>
                  <span className="text-[4px] font-mono text-[#78350f] font-black uppercase">PACK-03</span>
                </div>
                {/* Box 2 - Middle medium */}
                <div className="w-13 h-10 bg-[#b45309]/90 rounded-md border border-[#92400e] shadow-sm relative flex items-center justify-center -mr-2 mt-[-4px]">
                  <div className="absolute top-0 w-full h-[4px] bg-[#78350f]/60"></div>
                  <div className="absolute left-[45%] w-[4px] h-full bg-[#78350f]/30"></div>
                  <span className="text-[5px] font-mono text-white/90 font-black uppercase">CARGO-02</span>
                </div>
                {/* Box 1 - Bottom large */}
                <div className="w-16 h-12 bg-[#92400e]/95 rounded-md border border-[#78350f] shadow-md relative flex items-center justify-center -mr-4 mt-[-4px]">
                  <div className="absolute top-0 w-full h-[5px] bg-[#451a03]/70"></div>
                  <div className="absolute left-[48%] w-[5px] h-full bg-[#451a03]/30"></div>
                  <span className="text-[6px] font-mono text-white/80 font-black uppercase tracking-wider">INV-BOX-01</span>
                </div>
              </div>

              {/* Simulated Mini Desk Calculator */}
              <div className="absolute right-20 bottom-3 w-11 h-15 bg-slate-800 rounded border border-slate-700 shadow-md p-1 z-40 transform -rotate-12 hover:rotate-0 transition-transform cursor-pointer">
                <div className="h-2.5 bg-emerald-950 text-emerald-400 font-mono text-[7px] text-right pr-1 pt-0.5 rounded-xs leading-none">
                  2580.00
                </div>
                <div className="grid grid-cols-3 gap-0.5 mt-1.5 text-white font-mono text-[4.5px] text-center">
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">7</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">8</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">9</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">4</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">5</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">6</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">1</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">2</span>
                  <span className="bg-slate-700 rounded-2xs py-0.5 font-bold">3</span>
                  <span className="bg-[#f59e0b] rounded-2xs py-0.5 font-bold col-span-3 text-slate-900 font-black">TOTAL</span>
                </div>
              </div>

              {/* Holographic glowing lines in background */}
              <div className="absolute right-0 top-3 w-28 h-20 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                  <rect x="10" y="20" width="12" height="70" fill="#2563eb" />
                  <rect x="28" y="40" width="12" height="50" fill="#2563eb" />
                  <rect x="46" y="10" width="12" height="80" fill="#2563eb" />
                  <rect x="64" y="30" width="12" height="60" fill="#2563eb" />
                  <rect x="82" y="5" width="12" height="95" fill="#3b82f6" />
                </svg>
              </div>
            </div>

            {/* Bottom trust indicators block */}
            <div className="relative z-10 flex flex-wrap items-center justify-start gap-6 pt-4 border-t border-slate-200/50 mt-4 md:mt-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span>Reliable</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
                <Headphones className="w-4 h-4 text-blue-600" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Column (Prism-White Elegant Interactive Login Card Container) */}
          <div className="w-full lg:w-[44%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative shadow-2xl lg:shadow-none">
            
            {/* Top / Title header section */}
            <div className="my-auto py-4">
              <div className="text-center mb-8">
                <h2 className="text-[#0f172a] text-3xl font-black tracking-tight font-sans">
                  Welcome Back!
                </h2>
                <p className="text-slate-500 text-sm mt-1.5 font-sans font-medium">
                  Login to your <span className="text-[#2563eb] font-extrabold">ExpertAid</span> Billing Account
                </p>
                {/* Centered blue accent bar */}
                <div className="w-12 h-1 bg-blue-600 rounded mx-auto mt-3.5"></div>
              </div>

              {loginError && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex gap-2.5 items-start animate-shake">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Authentication Failure</span>
                    {loginError}
                  </div>
                </div>
              )}

              {/* Toggle-able Login Forms (Standard Email Password / OTP Code Login) */}
              {!otpMode ? (
                /* 1. Standard Credential Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Username / Email"
                        value={loginUserId}
                        onChange={(e) => setLoginUserId(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-3xs"
                        id="login-username-input"
                      />
                      <User className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-11 pr-11 text-sm font-semibold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-3xs"
                        id="login-password-input"
                      />
                      <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="flex items-center justify-between text-xs font-sans font-extrabold select-none pt-1">
                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Remember Me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginUserId("admin@expertaid.com");
                        setLoginPassword("AdminOverrideX99");
                        triggerNotification("Credentials quick-filled! Click 'Login' to enter.", "success");
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Login Button with lock icon */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 active:scale-98 mt-6"
                  >
                    <Lock className="w-4 h-4 shrink-0 fill-current" />
                    <span>Login</span>
                  </button>
                </form>
              ) : (
                /* 2. OTP Authenticator Form */
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 flex gap-2">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">One-Time Password Demo</span>
                      Enter registered system OTP code to access branch nodes immediately. Use code <span className="font-mono font-bold bg-blue-100 px-1.5 py-0.2 rounded text-blue-700">123456</span> to pass.
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-Digit OTP Code (e.g. 123456)"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full bg-[#f8fafc] border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-11 pr-4 text-sm font-mono font-bold tracking-widest placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-center"
                      />
                      <Smartphone className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => setOtpInput("123456")}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Auto Fill Demo OTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpMode(false)}
                      className="text-slate-500 font-bold hover:underline"
                    >
                      Back to Password
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 active:scale-98 mt-4"
                  >
                    <Unlock className="w-4 h-4 shrink-0" />
                    <span>Verify & Continue</span>
                  </button>
                </form>
              )}

              {/* Standard OR Divider */}
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider font-sans">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Sign In with OTP button toggling state */}
              <button
                type="button"
                onClick={() => {
                  setOtpMode(!otpMode);
                  setOtpInput("");
                  setLoginError(null);
                }}
                className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-200 font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-3xs active:scale-98"
              >
                <Smartphone className="w-4.5 h-4.5 text-slate-500" />
                <span>{otpMode ? "Sign In with Password" : "Sign In with OTP"}</span>
              </button>


            </div>

            {/* Copyright, details, and legal footer */}
            <div className="text-center font-sans text-slate-400 text-[11px] leading-relaxed pt-6 border-t border-slate-100 mt-8 lg:mt-0">
              <p className="font-extrabold text-slate-500">Expertaid Technologies Pvt. Ltd.</p>
              <p className="mt-0.5">© 2024 All Rights Reserved.</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (isSuperAdmin) {
    return (
      <div className="h-screen w-screen bg-[#f4f7fe] text-slate-800 font-sans overflow-hidden relative" id="super-admin-layout-root">
        {notifText && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 transition-transform animate-bounce ${
            notifType === "success" 
              ? "bg-slate-900 text-emerald-400 border border-emerald-500/20" 
              : "bg-amber-950 text-amber-200 border border-amber-500/40"
          }`}>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-400">System Broadcast</p>
              <p className="text-sm font-sans text-white font-medium">{notifText}</p>
            </div>
          </div>
        )}
        <SuperAdminConsole
          credentialsList={credentialsList}
          onUpdateCredentials={(newList) => {
            setCredentialsList(newList);
            localStorage.setItem("expert_aid_credentials", JSON.stringify(newList));
          }}
          triggerNotification={triggerNotification}
          tenantsList={tenantsList}
          onUpdateTenants={(newList) => {
            setTenantsList(newList);
            localStorage.setItem("expert_aid_tenants", JSON.stringify(newList));
          }}
          activeTenantId={activeTenantId}
          onSelectTenant={(id) => {
            setActiveTenantId(id);
            localStorage.setItem("expert_aid_active_tenant_id", id);
          }}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUserEmail("");
            setCurrentCashierName("");
            setCurrentRole(UserRole.CASHIER);
            triggerNotification("Logged out of Super Admin Console successfully.", "success");
          }}
          onImpersonateClient={handleImpersonateClient}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans text-slate-800" id="smart-billing-root">
      {/* Dynamic Native Alert Bar */}
      {notifText && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 transition-transform animate-bounce ${
          notifType === "success" 
            ? "bg-slate-900 text-emerald-400 border border-emerald-500/20" 
            : "bg-amber-950 text-amber-200 border border-amber-500/40"
        }`}>
          {notifType === "success" ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider font-mono">System Broadcast</p>
            <p className="text-sm font-sans text-white font-medium">{notifText}</p>
          </div>
        </div>
      )}

      {/* Sidebar Navigation - Precise Sleek Theme */}
      <aside className="w-64 bg-slate-50 flex flex-col shrink-0 border-r border-slate-200" id="sidebar">
        <div className="p-6 border-b border-slate-200 flex flex-col items-center text-center">
          {/* Top-left Gate Badge portion for logged-in side */}
          <div className="mb-4">
            <span className={`inline-block ${currentTheme.bg} text-white text-[9px] font-sans font-black uppercase tracking-wider rounded-full px-2.5 py-1.5 shadow-sm`}>
              {activeTenant.subdomain.toUpperCase()} GATE
            </span>
          </div>

          <div className="flex flex-col items-center space-y-3 w-full">
            {activeTenant.companyLogo ? (
              <div className={`p-[1.5px] rounded-xl ${currentTheme.bg} shadow-md overflow-hidden transition-all hover:scale-105 ring-2 ring-slate-200 inline-block`}>
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 overflow-hidden select-none">
                  <img 
                    src={activeTenant.companyLogo} 
                    alt={`${activeTenant.name} Logo`} 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ) : (
              <div className={`w-16 h-16 ${currentTheme.bg} rounded-xl flex items-center justify-center shadow-md`}>
                <span className="text-white font-display font-extrabold text-lg tracking-tighter">
                  {activeTenant.name.replace(/[^a-zA-Z ]/g, "").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "EA"}
                </span>
              </div>
            )}
            <div className="w-full">
              <h1 className="text-slate-900 font-display font-black text-sm tracking-tight leading-tight uppercase font-sans break-words px-2" title={activeTenant.name}>
                {activeTenant.name}
              </h1>
              <span className={`${currentTheme.text} text-[9.5px] font-mono tracking-widest font-black uppercase block mt-1.5`}>
                {activeTenant.tier} SaaS node
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-[9px] mt-4 font-mono flex items-center justify-center gap-1 font-sans">
            <Clock className="w-3 h-3 text-slate-400" /> UTC: 2026-05-22
          </p>
        </div>

        {/* Core Menu Tabs */}
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
          {!isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab("pos")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "pos"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Point of Sale (POS)</span>
              </button>

              <button
                onClick={() => setActiveTab("inventory")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "inventory"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <Layers className="w-4 h-4" />
                <div className="flex justify-between items-center w-full">
                  <span>Stock &amp; Inventory</span>
                  {lowStockAlertProducts.length > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {lowStockAlertProducts.length}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "products"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Product Catalogue</span>
              </button>

              <button
                onClick={() => setActiveTab("customers")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "customers"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>CRM &amp; Loyalty</span>
              </button>

              <button
                onClick={() => setActiveTab("expenses")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                  activeTab === "expenses"
                    ? `${currentTheme.bg} text-white font-bold shadow-md`
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Store &amp; Cash Shifts</span>
              </button>
            </>
          )}

          {/* This tab is visible both for standard users and superadmin (as "Dashboard") */}
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
              activeTab === "analytics"
                ? `${currentTheme.bg} text-white font-bold shadow-md`
                : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>{isSuperAdmin ? "Dashboard (Analytics)" : "Reports & Analytics"}</span>
          </button>

          {!isSuperAdmin && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                activeTab === "settings"
                  ? `${currentTheme.bg} text-white font-bold shadow-md`
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <Settings className="w-4 h-4 text-purple-600 font-semibold" />
              <span>Settings</span>
            </button>
          )}

          {/* Staff Registry / Manager Panel (available for admin, manager and superadmin) */}
          {(currentRole === UserRole.ADMIN || currentRole === UserRole.MANAGER || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("staff-registry")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                activeTab === "staff-registry"
                  ? `${currentTheme.bg} text-white font-bold shadow-md`
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4 text-purple-600 font-bold" />
              <span>{currentRole === UserRole.MANAGER ? "Manager Panel" : "Staff Registry (Staff Onboarding)"}</span>
            </button>
          )}

          {/* Super Admin Panel */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab("super-admin")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors font-sans text-xs font-medium cursor-pointer ${
                activeTab === "super-admin"
                  ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/10"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-purple-600 animate-pulse" />
              <span className="flex items-center justify-between w-full font-semibold">
                <span>Super Admin Panel</span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              </span>
            </button>
          )}
        </nav>

        {/* User Session Metadata */}
        <div className="p-4 mt-auto border-t border-slate-200">
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-805 text-xs font-bold shrink-0 font-sans text-slate-800">
                {currentCashierName ? currentCashierName.split(" ").map(n => n[0]).join("") : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-slate-900 text-xs font-bold truncate leading-tight">{currentCashierName}</p>
                <p className={`text-[10px] truncate leading-none mt-1 font-mono font-bold uppercase tracking-wider ${
                  currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super")
                    ? "text-purple-700"
                    : "text-slate-500"
                }`}>
                  {currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super") ? "SUPERADMIN" : currentRole}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setCurrentUserEmail("");
                setLoginUserId("");
                setLoginPassword("");
                setSelectedLoginRole("admin");
                triggerNotification("Successfully logged out. All access revoked.", "warning");
              }}
              className="w-full py-2 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg border border-slate-200 hover:border-rose-200 transition-all font-sans text-[10px] flex items-center justify-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider shadow-sm"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Header - Styled sleek index */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Store className={`w-4 h-4 ${currentTheme.textAccent}`} />
              {currentRole === UserRole.ADMIN || isSuperAdmin ? (
                <select
                  value={currentBranch?.id}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="border-none bg-transparent hover:bg-slate-100 p-1 rounded text-xs font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs font-bold text-slate-705 bg-slate-100 px-2.5 py-1 rounded">
                  📍 {currentBranch?.name || "Corporate Branch"}
                </span>
              )}
            </div>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            
            {/* Quick checkout search simulator */}
            <form onSubmit={handleBarcodeSubmit} className="relative">
              <input
                type="text"
                placeholder="Scan item barcode (e.g. 5449000133335) or search..."
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                className="w-96 pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent rounded-lg text-xs focus:bg-white focus:border-slate-300 transition-all outline-none"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <button type="submit" className="hidden" />
            </form>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick alert indicator logs */}
            {lowStockAlertProducts.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab("inventory");
                  triggerNotification("Filter through current near-critical warning lists below", "success");
                }}
                className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-100 flex-row"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Low Stock Warning ({lowStockAlertProducts.length})
              </button>
            )}

            {/* Expiring count alerts */}
            {nearExpiryProductsAlert.length > 0 && (
              <button
                onClick={() => {
                  setActiveTab("inventory");
                }}
                className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-100"
              >
                Near Expiry ({nearExpiryProductsAlert.length})
              </button>
            )}

            {/* Terminal Log In Active Session Badge */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-1.5 px-3 shadow-sm">
              <div className="flex flex-col text-right pr-2.5 border-r border-slate-800 shrink-0">
                <span className="text-[8px] text-slate-500 font-mono font-bold leading-none mb-0.5 tracking-wider">ACTIVE SESSION</span>
                <span className={`text-[10px] font-bold leading-none uppercase ${
                  currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super")
                    ? "text-purple-400"
                    : "text-emerald-400"
                }`}>
                  {currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super") ? "SUPERADMIN" : currentRole}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setCurrentUserEmail("");
                  setLoginUserId("");
                  setLoginPassword("");
                  setSelectedLoginRole("admin");
                  triggerNotification("Successfully logged out. All access revoked.", "warning");
                }}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition-colors shrink-0"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-mono font-medium text-slate-500">Branch Offline Mode</p>
              <p className="text-[10px] text-slate-400 font-mono">Sync State: Secure Local (Cloud Vault Enabled)</p>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: POINT OF SALE SYSTEM */}
          {activeTab === "pos" && (
            <div className="flex gap-6 h-full items-start" id="pos-module-layout">
              {/* Product Grid selection & Filtering */}
              <div className="flex-1 space-y-6">
                {/* Statistics line */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Total Sale</p>
                    <h3 className="text-xl font-bold font-mono text-slate-900">₹{totalInvoicedRevenue.toFixed(2)}</h3>
                    <p className="text-[9px] text-emerald-600 font-bold mt-1">✓ Live Session Sales</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Invoice Count</p>
                    <h3 className="text-xl font-bold font-mono text-slate-900">{invoices.length} checkouts</h3>
                    <p className="text-[9px] text-slate-400 mt-1">Avg basket: ₹{(totalInvoicedRevenue / Math.max(1, invoices.length)).toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tax Liability (GST)</p>
                    <h3 className="text-xl font-bold font-mono text-emerald-600">₹{totalTaxGSTLiability.toFixed(2)}</h3>
                    <p className="text-[9px] text-slate-500 mt-1">Tax logs registered</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Cashier</p>
                    <h3 className="text-base font-bold text-slate-900 truncate">{currentCashierName}</h3>
                    <p className="text-[9px] text-slate-400 mt-1">
                      {currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super") ? "SUPERADMIN" : currentRole} privilege
                    </p>
                  </div>
                </div>

                {/* Local Inventory Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      Browse Catalogue / Click item to Add to Cart
                    </h3>
                    <div className="flex gap-1">
                      {productCategoriesList.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            categoryFilter === cat
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual search query */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search barcode, description, SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white outline-none"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  </div>

                  {/* Catalogue Grid */}
                  <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[360px] pr-2">
                    {filteredProductsBySearch.length > 0 ? (
                      filteredProductsBySearch.map((product) => {
                        const localStock = getProductStock(product);
                        const isLowStock = localStock <= product.minStockAlert;
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleAddToCart(product)}
                            className="bg-white border border-slate-200/80 p-3 rounded-lg hover:border-emerald-500 cursor-pointer transition-all hover:shadow-sm relative group flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <span className="bg-slate-100 text-[9px] px-1.5 py-0.5 rounded font-bold font-mono text-slate-600 uppercase">
                                  {product.category.substring(0, 10)}
                                </span>
                                <span className={`text-[10px] font-bold ${isLowStock ? "text-rose-500" : "text-emerald-600"}`}>
                                  {localStock} {product.unit}s
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-emerald-600 transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">SKU: {product.sku}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Barcode: {product.barcode}</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-sm font-black text-slate-900 font-mono">
                                ₹{product.price.toFixed(2)}
                              </span>
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1 rounded font-bold">
                                GST {product.gstRate}%
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-3 text-center py-12 text-slate-400 text-xs">
                        ⚠️ No matching inventory item. Create the product catalog in the Product tab.
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated POS Integrations Panel: Barcode scanner + Thermal preview trigger */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-emerald-400 mb-2">
                      Barcode Scanner Simulator
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      Scan product quickly using ready test inputs. Type or click below:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tenantProducts.slice(0, 6).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setBarcodeSearch(p.barcode);
                            triggerNotification(`Inserted barcode: ${p.barcode}`, "success");
                          }}
                          className="px-2 py-1 text-[9px] bg-slate-800 text-slate-300 rounded font-mono border border-slate-700 hover:text-white"
                        >
                          🎫 {p.name.substring(0, 15)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold uppercase font-mono tracking-wider text-emerald-400 mb-2">
                      Simulated APIs &amp; Integrations
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      ExpertAid incorporates full digital POS checkout integrations with thermal printer simulators:
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                        <span>GST Invoice Payload:</span>
                        <span className="text-emerald-400 font-mono text-[9px]">✓ Validated 200 OK</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                        <span>WhatsApp SMS Engine:</span>
                        <span className="text-emerald-400 font-mono text-[9px]">✓ Integrated Callback</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pb-1">
                        <span>Cloud Database Sync:</span>
                        <span className="text-blue-400 font-mono text-[9px]">✓ Active Auto-Vaulting</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAST BILLS & REPRINT CENTER */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Printer className="w-4 h-4 text-emerald-500 animate-pulse" />
                        Past Bills &amp; Invoice Reprint Hub
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Reprint receipts or inspect completed checkouts for this branch session ({tenantAndBranchInvoices.length} checkouts)
                      </p>
                    </div>
                  </div>

                  {tenantAndBranchInvoices.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      📂 No bills generated in this session yet. Complete checkout above to log receipts.
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead className="sticky top-0 bg-slate-50 shadow-sm z-10">
                          <tr className="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
                            <th className="px-3 py-2 bg-slate-50">Invoice ID</th>
                            <th className="px-3 py-2 bg-slate-50">Customer</th>
                            <th className="px-3 py-2 bg-slate-50">Date / Time</th>
                            <th className="px-3 py-2 text-right bg-slate-50">Mode</th>
                            <th className="px-3 py-2 text-right bg-slate-50">Total</th>
                            <th className="px-3 py-2 text-center bg-slate-50">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {tenantAndBranchInvoices.slice().reverse().map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-3 py-2 font-mono text-[10px] font-bold text-slate-500">{inv.id}</td>
                              <td className="px-3 py-2">
                                <p className="font-bold text-slate-800">{inv.customerName || "Guest Client"}</p>
                                <p className="text-[9px] text-slate-400 font-mono">Cashier: {inv.cashierName}</p>
                              </td>
                              <td className="px-3 py-2 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                                {inv.date} {inv.time}
                              </td>
                              <td className="px-3 py-2 text-right font-mono">
                                <span className="text-[9.5px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded uppercase">
                                  {inv.paymentMode}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">
                                ₹{inv.grandTotal.toFixed(2)}
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  onClick={() => {
                                    setShowInvoicePrintPreview(inv);
                                    triggerNotification(`Loaded Invoice ${inv.id} for printing.`, "success");
                                  }}
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 font-bold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all mx-auto border border-emerald-200/30 cursor-pointer"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>Reprint</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Smart AI copilot right in the system dashboard */}
                <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
                  <SmartCopilot
                    currentRole={currentRole}
                    currentBranch={currentBranch}
                    products={products}
                  />
                </div>
              </div>

              {/* ACTIVE CART DRAWER (RIGHT PANEL) - Exact Sleek Style */}
              <div className="w-80 shrink-0 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col h-[750px]">
                <div className="bg-slate-900 p-4 text-white rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                      <ShoppingCart className="w-4 h-4 text-emerald-400" />
                      Active Checkout Cart
                    </h4>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-500 text-slate-900 font-bold rounded">
                      SESSION #{invoices.length + 120}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cashier: {currentCashierName} • Branch: {currentBranch?.id}
                  </p>
                </div>

                {/* Customer Billing Info */}
                <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono font-bold text-slate-600 uppercase flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Billing Customer
                    </label>
                    <button
                      onClick={() => {
                        setActiveTab("customers");
                        triggerNotification("Redirected to Loyalty registration form", "success");
                      }}
                      className="text-[10px] text-emerald-600 font-bold hover:underline"
                    >
                      + Register Client
                    </button>
                  </div>
                  
                  {/* Select Customer Dropdown */}
                  <div>
                    <select
                      value={selectedCustomer?.id || ""}
                      onChange={(e) => {
                        const cust = customers.find((c) => c.id === e.target.value);
                        setSelectedCustomer(cust || null);
                        if (cust) {
                          setBillingCustomerName(cust.name);
                          setBillingCustomerPhone(cust.phone);
                          triggerNotification(`Linked Loyalty VIP: ${cust.name}`, "success");
                        } else {
                          setBillingCustomerName("");
                          setBillingCustomerPhone("");
                        }
                      }}
                      className="w-full text-[11px] border border-slate-200 rounded p-1 bg-white font-medium"
                    >
                      <option value="">-- Guest Checkout (Select Loyalty) --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manual Billing Inputs */}
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-[8.5px] text-slate-500 font-bold block mb-0.5">CUSTOMER NAME:</span>
                      <input
                        type="text"
                        value={billingCustomerName}
                        onChange={(e) => setBillingCustomerName(e.target.value)}
                        placeholder="Regular Customer/Loyalty Guest"
                        className="w-full text-xs font-semibold border border-slate-200 rounded p-1 block bg-white h-7 focus:ring-1 focus:ring-emerald-500/50"
                      />
                    </div>
                    <div>
                      <span className="text-[8.5px] text-slate-500 font-bold block mb-0.5">MOBILE NUMBER:</span>
                      <input
                        type="text"
                        value={billingCustomerPhone}
                        maxLength={15}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBillingCustomerPhone(val);
                          // Auto match with existing registered phone
                          const normalizedInput = val.replace(/\D/g, "");
                          if (normalizedInput.length >= 10) {
                            const matched = customers.find(c => {
                              const normPhone = c.phone.replace(/\D/g, "");
                              return normPhone.endsWith(normalizedInput) || normalizedInput.endsWith(normPhone);
                            });
                            if (matched) {
                              setSelectedCustomer(matched);
                              setBillingCustomerName(matched.name);
                              triggerNotification(`Linked registered VIP: ${matched.name}`, "success");
                            }
                          }
                        }}
                        placeholder="Customer Mobile No."
                        className="w-full text-xs font-mono font-bold border border-slate-200 rounded p-1 block bg-white h-7 focus:ring-1 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>

                  {selectedCustomer && (
                    <div className="p-1 px-2 bg-emerald-50 border border-emerald-200/50 rounded text-[9px] text-emerald-800 flex justify-between items-center font-mono">
                      <span>Points: <b>{selectedCustomer.loyaltyPoints}</b></span>
                      <span>Credit: <b>₹{selectedCustomer.creditBalance}</b></span>
                    </div>
                  )}
                </div>

                {/* Cart Active Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item.productId} className="flex justify-between items-start border-b border-slate-100 pb-2 gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{item.name}</p>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
                            <span>₹{item.price.toFixed(2)} / {item.unit}</span>
                            <span>{item.gstRate}% Tax</span>
                          </div>
                          
                          {/* Quantity selector */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              onClick={() => handleUpdateCartQuantity(item.productId, -1)}
                              className="w-4 h-4 bg-slate-100 text-slate-700 rounded flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold font-mono text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateCartQuantity(item.productId, 1)}
                              className="w-4 h-4 bg-slate-100 text-slate-700 rounded flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <span className="text-xs font-bold font-mono text-slate-800">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="text-slate-300 hover:text-rose-500 mt-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs py-12 space-y-2 text-center">
                      <ShoppingCart className="w-10 h-10 text-slate-300 stroke-1" />
                      <span>Shopping cart empty.<br />Click catalog products or scan barcode to checkout items.</span>
                    </div>
                  )}
                </div>

                {/* Coupon handling entry */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. WELCOME5)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 outline-none uppercase font-mono"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold font-display"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Try: <b>WELCOME5</b> (5% off) </span>
                    <span><b>FESTIVE10</b> (10% off)</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Cart Subtotal</span>
                    <span>₹{subTotalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated GST ({taxAmountOfCart > 0 ? "Inclusive" : "0%"})</span>
                    <span>₹{taxAmountOfCart.toFixed(2)}</span>
                  </div>
                  {appliedDiscountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedDiscountPercent}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center">
                    <p className="text-slate-600 font-sans font-bold">TOTAL PAYABLE</p>
                    <p className="text-lg font-black font-mono text-slate-900">₹{grandTotalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Checkout selection & Cash trigger */}
                <div className="p-4 bg-slate-100 border-t border-slate-200 space-y-3">
                  <div className="grid grid-cols-3 gap-1">
                    {Object.values(PaymentMode).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPaymentMode(mode)}
                        className={`py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          paymentMode === mode
                            ? `${currentTheme.bg} text-white border-transparent shadow`
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* Cash payment drawer change calculation */}
                  {paymentMode === PaymentMode.CASH && (
                    <div className="bg-white p-2.5 rounded border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono font-bold text-slate-500">CASH RECEIVED</label>
                        <span className="text-[10px] text-slate-400 font-mono">Target: ₹{grandTotalAmount.toFixed(2)}</span>
                      </div>
                      <input
                        type="number"
                        placeholder="Amt cash given (e.g. 500, 1000)"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="w-full text-xs font-mono font-bold border border-slate-200 rounded p-1 text-slate-800"
                      />
                      {Number(cashReceived) >= grandTotalAmount && (
                        <div className={`flex justify-between items-center text-[11px] font-mono ${currentTheme.textAccentDark} ${currentTheme.bgLight} p-1.5 rounded border border-dashed`}>
                          <span>CHANGE RE-DELIVERED:</span>
                          <span className="font-bold font-mono">
                            ₹{(Number(cashReceived) - grandTotalAmount).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Checkout CTA */}
                  <button
                    onClick={handlePOSCheckout}
                    disabled={cartItems.length === 0}
                    className={`w-full py-3 ${currentTheme.bg} ${currentTheme.bgHover} text-white rounded-xl font-bold font-display shadow-lg ${currentTheme.glow} active:scale-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Checkout Store Invoice
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-400 font-mono">
                    ✓ Instant SMS &amp; GST tax callback simulated
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & STOCK EXPIRES SYSTEM */}
          {activeTab === "inventory" && (
            <div className="space-y-6" id="inventory-module-layout">
              {/* Stats highlights */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Count Valuation</h4>
                  <p className="text-2xl font-black font-mono text-slate-950">
                    ₹{tenantProducts.reduce((acc, p) => acc + (p.purchasePrice * getProductStock(p)), 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Valuation at Cost Price (COGS Index)</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm bg-gradient-to-br from-amber-50 to-white">
                  <div className="flex justify-between items-center text-amber-700">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Critical Low Stock Limits</h4>
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black font-mono text-amber-900">{lowStockAlertProducts.length} SKU Alerts</p>
                  <p className="text-xs text-amber-700 mt-2">Requires instant purchase supply restock</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm bg-gradient-to-br from-rose-50 to-white">
                  <div className="flex justify-between items-center text-rose-700">
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Near Expiry Alert List</h4>
                    <Info className="w-5 h-5 text-rose-500 font-bold" />
                  </div>
                  <p className="text-2xl font-black font-mono text-rose-900">{nearExpiryProductsAlert.length} Batches</p>
                  <p className="text-xs text-rose-700 mt-2">Expires in less than 30 days time</p>
                </div>
              </div>

              {/* Master Inventory Tracking Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-secondary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Warehouse Inventory Tracking &amp; Replaces Logbook</h3>
                    <p className="text-xs text-slate-400 font-mono">Total tracking of {tenantProducts.length} products</p>
                  </div>
                  <div className="relative w-full sm:w-80">
                    <input
                      type="text"
                      placeholder="Search stock by name, SKU, barcode, supplier..."
                      value={inventorySearchQuery}
                      onChange={(e) => setInventorySearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-slate-400 placeholder-slate-400 text-slate-800 font-sans shadow-sm"
                    />
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[600px] overflow-y-auto relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                      <tr className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 select-none">
                        <th className="px-6 py-3 bg-slate-50">Product Catalog Description</th>
                        <th className="px-6 py-3 bg-slate-50">Batch Number</th>
                        <th className="px-6 py-3 bg-slate-50">Supplier Source</th>
                        <th className="px-6 py-3 text-right bg-slate-50">Unit Price</th>
                        <th className="px-6 py-3 text-right bg-slate-50">Available Stock</th>
                        <th className="px-6 py-3 bg-slate-50">Expiration Date</th>
                        <th className="px-6 py-3 bg-slate-50">Stock Status Alert</th>
                        <th className="px-6 py-3 text-center bg-slate-50">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filtered = tenantProducts.filter((p) => {
                          const query = (inventorySearchQuery || "").trim().toLowerCase();
                          if (!query) return true;
                          return (
                            p.name.toLowerCase().includes(query) ||
                            p.sku.toLowerCase().includes(query) ||
                            p.barcode.toLowerCase().includes(query) ||
                            (p.batchNumber && p.batchNumber.toLowerCase().includes(query)) ||
                            (p.supplierName && p.supplierName.toLowerCase().includes(query)) ||
                            (p.category && p.category.toLowerCase().includes(query))
                          );
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="px-6 py-10 text-center text-slate-400 font-medium">
                                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                No stock inventory items matched "{inventorySearchQuery}"
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((p) => {
                          const localStock = getProductStock(p);
                          const isLowStock = localStock <= p.minStockAlert;
                          
                          // Check if expiring soon
                          const expDate = new Date(p.expiryDate);
                          const today = new Date();
                          const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          const isExpired = diffDays < 0;
                          const isExpiringSoon = diffDays >= 0 && diffDays <= 30;
                          const displayStock = localStock;

                          return (
                            <tr key={p.id} className="text-xs hover:bg-slate-50">
                              <td className="px-6 py-3.5">
                                <p className="font-bold text-slate-900">{p.name}</p>
                                <div className="flex gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <span>SKU: {p.sku}</span>
                                  <span>•</span>
                                  <span>Barcode: {p.barcode}</span>
                                  <span>•</span>
                                  <span className="text-slate-500 font-semibold uppercase">{p.category}</span>
                                </div>
                              </td>
                              <td className="px-6 py-3.5 font-mono text-slate-600">{p.batchNumber}</td>
                              <td className="px-6 py-3.5 text-slate-500">{p.supplierName}</td>
                              <td className="px-6 py-3.5 text-right font-mono text-slate-900 font-bold">
                                ₹{p.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-3.5 text-right font-mono font-bold">
                                <span className={isLowStock ? "text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded" : "text-slate-800"}>
                                  {displayStock} {p.unit}s
                                </span>
                              </td>
                              <td className="px-6 py-3.5 font-mono">
                                <span className={isExpired ? "text-rose-600 font-bold" : isExpiringSoon ? "text-amber-600 font-semibold" : "text-slate-600"}>
                                  {p.expiryDate} {isExpiringSoon && `(${diffDays} days left)`} {isExpired && "(Expired)"}
                                </span>
                              </td>
                              <td className="px-6 py-3.5">
                                {isLowStock ? (
                                  <span className="bg-rose-50 text-rose-600 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-rose-100 flex items-center gap-1 w-max">
                                    ⚠️ Critical Low Check
                                  </span>
                                ) : isExpiringSoon ? (
                                  <span className="bg-amber-50 text-amber-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-amber-100 flex items-center gap-1 w-max">
                                    ⏳ Expiry Warning
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 text-emerald-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1 w-max">
                                    ✓ Stock Healthy
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3.5 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewProduct(p);
                                      triggerNotification(`Product "${p.name}" loaded into the editor form.`, "success");
                                      const element = document.getElementById("products-module-layout");
                                      if (element) {
                                        element.scrollIntoView({ behavior: "smooth" });
                                      }
                                    }}
                                    title="Edit Product"
                                    className="p-1 px-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-transparent hover:border-amber-100"
                                  >
                                    <Edit2 className="w-3 h-3" /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                    title="Delete Product"
                                    className="p-1 px-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-transparent hover:border-rose-100"
                                  >
                                    <Trash2 className="w-3 h-3" /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Adjust Inventory Stock levels drawer */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-emerald-500" />
                    Verify Discrepancies / Stock adjustment level Form
                  </h3>
                  <form onSubmit={handleStockAdjustmentSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Target Product SKU</label>
                      <select
                        value={stockAdjustmentForm.productId}
                        onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, productId: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2"
                      >
                        <option value="">-- Choose Product --</option>
                        {tenantProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Current: {getProductStock(p)} {p.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">New Stock Quantity Level</label>
                        <input
                          type="number"
                          value={stockAdjustmentForm.newStock}
                          onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, newStock: Number(e.target.value) })}
                          className="w-full border border-slate-200 rounded p-2 font-mono font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">Adjustment Reason</label>
                        <input
                          type="text"
                          placeholder="e.g. Broken packaging, Discarded fruits"
                          value={stockAdjustmentForm.reason}
                          onChange={(e) => setStockAdjustmentForm({ ...stockAdjustmentForm, reason: e.target.value })}
                          className="w-full border border-slate-200 rounded p-2"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display rounded-lg transition-transform text-xs"
                    >
                      Process Level Correction
                    </button>
                  </form>
                </div>

                {/* Adjustments history logs */}
                <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    Valuation Adjustments Audit Trail
                  </h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                    {adjustments.slice().reverse().map((adj) => (
                      <div key={adj.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] font-mono flex justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{adj.productName}</p>
                          <p className="text-slate-500 text-[10px] mt-0.5">Reason: "{adj.reason}"</p>
                          <p className="text-slate-400 text-[9px]">Adjuster: {adj.adjustedBy} • {adj.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-slate-400 font-semibold text-[10px]">Stock modification</p>
                          <p className="text-amber-700 font-extrabold text-sm font-mono mt-0.5">
                            {adj.previousStock} &rarr; {adj.newStock}
                          </p>
                        </div>
                      </div>
                    ))}
                    {adjustments.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-xs text-sans">
                        No custom adjustments logged yet in database.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inter-Branch Inventory Transfers */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin-slow" />
                    Inter-Branch Stock Transfers &amp; Approvals Tracking
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Ship inventory surplus between regional outlets with structural safety checks and balance transfers.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                  {/* Left Column: Initiate Form */}
                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Request New Stock Transfer</h4>
                    <form onSubmit={handleCreateTransferSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">Select Product</label>
                        <select
                          value={newTransferForm.productId}
                          onChange={(e) => setNewTransferForm({ ...newTransferForm, productId: e.target.value })}
                          className="w-full border border-slate-200 rounded p-2"
                        >
                          <option value="">-- Choose Product --</option>
                          {tenantProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Global SKU: {p.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 font-mono font-semibold mb-1">From Branch</label>
                          <select
                            value={newTransferForm.fromBranchId}
                            onChange={(e) => setNewTransferForm({ ...newTransferForm, fromBranchId: e.target.value })}
                            className="w-full border border-slate-200 rounded p-2"
                          >
                            <option value="">-- Origin --</option>
                            {branches.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-mono font-semibold mb-1">To Branch</label>
                          <select
                            value={newTransferForm.toBranchId}
                            onChange={(e) => setNewTransferForm({ ...newTransferForm, toBranchId: e.target.value })}
                            className="w-full border border-slate-200 rounded p-2"
                          >
                            <option value="">-- Destination --</option>
                            {branches.map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">Transfer Qty</label>
                        <input
                          type="number"
                          value={newTransferForm.quantity}
                          onChange={(e) => setNewTransferForm({ ...newTransferForm, quantity: Number(e.target.value) })}
                          min="1"
                          className="w-full border border-slate-200 rounded p-2 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-mono font-semibold mb-1">Reason / Shift Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Stock replenishment, High Demand"
                          value={newTransferForm.remarks}
                          onChange={(e) => setNewTransferForm({ ...newTransferForm, remarks: e.target.value })}
                          className="w-full border border-slate-200 rounded p-2"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-xs cursor-pointer text-center"
                      >
                        File Transfer Proposal
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Ledger List / Actions */}
                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm col-span-2 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Branch Stock Shifting Ledger ({transfers.length} requests)</h4>
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                      {transfers.slice().reverse().map((t) => {
                        const fromName = branches.find((b) => b.id === t.fromBranchId)?.name || t.fromBranchId;
                        const toName = branches.find((b) => b.id === t.toBranchId)?.name || t.toBranchId;
                        const pDetail = tenantProducts.find((p) => p.id === t.productId);
                        const fromBranchStock = pDetail && pDetail.branchStocks ? (pDetail.branchStocks[t.fromBranchId] ?? 0) : 0;

                        return (
                          <div key={t.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-slate-200 text-slate-700 font-black font-mono text-[9px] px-1.5 py-0.5 rounded leading-none">
                                  {t.id}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase leading-none ${
                                  t.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                                  t.status === "APPROVED" ? "bg-emerald-100 text-emerald-800 font-bold" :
                                  "bg-rose-100 text-rose-800"
                                }`}>
                                  {t.status}
                                </span>
                              </div>
                              <p className="font-bold text-slate-800 text-[12px]">{t.productName}</p>
                              <p className="text-[10px] text-slate-500">
                                Path: <span className="font-semibold text-slate-700 font-mono">{fromName}</span> &rarr; <span className="font-semibold text-slate-700 font-mono">{toName}</span>
                              </p>
                              <p className="text-[9px] text-slate-400">
                                Requested by: {t.requestedBy || "Staff Member"} on {t.requestedDate || "Today"}
                              </p>
                              {t.comments && (
                                <p className="text-[10px] bg-slate-100 border border-slate-200/50 p-1 rounded font-mono text-slate-500 mt-1">
                                  Response Note: "{t.comments}"
                                </p>
                              )}
                            </div>

                            <div className="text-right shrink-0 flex flex-col items-end gap-1">
                              <p className="text-[10px] text-slate-400 font-medium">Shipment payload</p>
                              <p className="text-slate-900 font-black font-mono text-base">
                                {t.quantity} <span className="text-xs font-normal text-slate-500">units</span>
                              </p>
                              <p className="text-[9px] font-mono text-slate-400">
                                (Origin Stock: {fromBranchStock} units)
                              </p>

                              {t.status === "PENDING" && (
                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={() => handleProcessTransfer(t.id, "APPROVED", "Accepted & cleared by store overseer")}
                                    className="px-2 py-0.5 text-[10px] bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded cursor-pointer font-bold"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleProcessTransfer(t.id, "REJECTED", "Denied due to local stock shortage")}
                                    className="px-2 py-0.5 text-[10px] bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded cursor-pointer font-bold"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {transfers.length === 0 && (
                        <div className="text-center py-12 text-slate-400 text-xs">
                          ⚠️ No branch-wise stock transfers filed yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT CATALOG CATALOGUE & BARCODE CREATION */}
          {activeTab === "products" && (
            <div className="grid grid-cols-3 gap-6 animate-fadeIn" id="products-module-layout">
              {/* Product Creation Form */}
              <div className="col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {newProduct.id ? (
                      <Edit2 className="w-5 h-5 text-amber-500" />
                    ) : (
                      <PlusCircle className="w-5 h-5 text-emerald-500" />
                    )}
                    {newProduct.id ? "Edit Catalog Product" : "Define New Retail Product Catalogue"}
                  </h3>
                
                <form onSubmit={handleCreateProductSubmit} className="space-y-3.5 text-xs text-slate-700">
                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Product Description Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Kirkland Signature Organic Milk 1.5L"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">SKU Code *</label>
                      <input
                        type="text"
                        placeholder="e.g. BEV-MILK-K1"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">UPC Barcode *</label>
                      <input
                        type="text"
                        placeholder="e.g. 8901262020213"
                        value={newProduct.barcode}
                        onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Category Bracket</label>
                      <select
                        value={newProduct.category || (productCategories.length > 0 ? productCategories[0] : "")}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2"
                      >
                        {productCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Measurement Unit</label>
                      <select
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value as MeasurementUnit })}
                        className="w-full border border-slate-200 rounded p-2"
                      >
                        <option value={MeasurementUnit.KG}>Kilogram (Kg)</option>
                        <option value={MeasurementUnit.LITER}>Liters (Liters)</option>
                        <option value={MeasurementUnit.PIECE}>Pieces (pcs)</option>
                        <option value={MeasurementUnit.PACK}>Packs (pk)</option>
                        <option value={MeasurementUnit.GRAM}>Grams (g)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">COGS Purchase (₹)</label>
                      <input
                        type="number"
                        value={newProduct.purchasePrice}
                        onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">MRP Price (₹)</label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">GST Slabs %</label>
                      <select
                        value={newProduct.gstRate}
                        onChange={(e) => setNewProduct({ ...newProduct, gstRate: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-1.5"
                      >
                        <option value={0}>0% GST</option>
                        <option value={5}>5% GST</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% GST</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Opening Stock</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Min Alert Stock Limit</label>
                      <input
                        type="number"
                        value={newProduct.minStockAlert}
                        onChange={(e) => setNewProduct({ ...newProduct, minStockAlert: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Batch Number</label>
                      <input
                        type="text"
                        value={newProduct.batchNumber}
                        onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={newProduct.expiryDate}
                        onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                        className="w-full border border-slate-200 rounded p-2 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Assigned Vendor Supplier</label>
                    <select
                      value={newProduct.supplierName}
                      onChange={(e) => setNewProduct({ ...newProduct, supplierName: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2"
                    >
                      <option value="">-- Select Vendor --</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {newProduct.id && (
                      <button
                        type="button"
                        onClick={handleResetProductForm}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-sans rounded-lg tracking-wide transition-all uppercase shadow-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`py-2.5 text-white text-xs font-bold font-display rounded-lg tracking-wide transition-all uppercase shadow-sm cursor-pointer ${
                        newProduct.id 
                          ? "bg-amber-600 hover:bg-amber-700 flex-2" 
                          : "bg-emerald-600 hover:bg-emerald-700 w-full"
                      }`}
                    >
                      {newProduct.id ? "Update Product" : "Save Catalog Product Information"}
                    </button>
                  </div>
                </form>
              </div>

              {/* BULK ONBOARDING CARD */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4" id="bulk-onboarding-container">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-indigo-600" />
                    Bulk Retail Product Upload
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Register multiple inventory units at once. Drag/drop a catalog CSV or paste bulk rows below.
                  </p>
                </div>

                {/* Sample CSV Download and Tabs */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setBulkUploadTab("file")}
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition-colors ${
                        bulkUploadTab === "file" ? "bg-indigo-55 text-indigo-600" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      File
                    </button>
                    <button
                      type="button"
                      onClick={() => setBulkUploadTab("paste")}
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition-colors ${
                        bulkUploadTab === "paste" ? "bg-indigo-55 text-indigo-600" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      Paste Row
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const csvContent = "Name,SKU,Barcode,Category,PurchasePrice,Price,GSTRate,Unit,Stock,MinStockAlert,BatchNumber,ExpiryDate,SupplierName\n" +
                        '"Premium Basmati Rice 10Kg","GRN-BAS-R10","8901234567801","Grains & Grocery",890,1200,5,"Kg",60,15,"B-2026-X1","2027-12-31","Apex Retail Supplies"\n' +
                        '"Whole Wheat Flour 5Kg","GRN-ATT-W5","8901234567802","Grains & Grocery",180,240,0,"Kg",45,10,"B-2026-F2","2027-11-20","Apex Retail Supplies"';
                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.setAttribute("href", url);
                      link.setAttribute("download", "retail_products_bulk_template.csv");
                      link.style.visibility = "hidden";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      triggerNotification("Bulk template CSV file download triggered successfully.", "success");
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-755 rounded transition-colors flex shrink-0"
                  >
                    <Download className="w-3 h-3" /> Template
                  </button>
                </div>

                {/* UI Tab: File Upload (Drag & Drop) */}
                {bulkUploadTab === "file" && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setBulkIsDragging(true);
                    }}
                    onDragLeave={() => setBulkIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setBulkIsDragging(false);
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        if (file.name.endsWith(".csv") || file.name.endsWith(".json")) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const content = evt.target?.result as string;
                            handleBulkInputChange(content);
                          };
                          reader.readAsText(file);
                        } else {
                          triggerNotification("Please upload a valid .csv or .json formatted catalog file.", "warning");
                        }
                      }
                    }}
                    className={`border border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors ${
                      bulkIsDragging
                        ? "border-indigo-500 bg-indigo-50/20"
                        : bulkParsedProducts.length > 0
                        ? "border-emerald-300 bg-emerald-50/10"
                        : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50"
                    }`}
                    onClick={() => {
                      const fileInput = document.getElementById("bulk-file-selector2") as HTMLInputElement;
                      if (fileInput) fileInput.click();
                    }}
                  >
                    <input
                      type="file"
                      id="bulk-file-selector2"
                      accept=".csv,.json"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const file = files[0];
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const content = evt.target?.result as string;
                            handleBulkInputChange(content);
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                    <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <p className="text-[10px] font-bold text-slate-700">Drag &amp; Drop CSV / JSON file</p>
                    <p className="text-[9px] text-slate-400">or click to browse local folders</p>
                  </div>
                )}

                {/* UI Tab: Textarea paste */}
                {bulkUploadTab === "paste" && (
                  <div className="space-y-1.5">
                    <textarea
                      value={bulkInputText}
                      onChange={(e) => handleBulkInputChange(e.target.value)}
                      placeholder="Paste CSV lines or JSON array..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-400 transition-colors"
                    />
                  </div>
                )}

                {/* Error Banner */}
                {bulkUploadError && (
                  <p className="text-[10px] text-rose-500 font-sans font-semibold bg-rose-50 p-2 rounded border border-rose-100 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {bulkUploadError}
                  </p>
                )}

                {/* Preview of Parsed Products */}
                {bulkParsedProducts.length > 0 && (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-2 py-1 text-[9px] font-extrabold text-slate-500 tracking-wider flex justify-between items-center border-b border-slate-100">
                      <span>PREVIEW ({bulkParsedProducts.length} items)</span>
                      <span className="text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                        {bulkParsedProducts.filter(p => p.isValid).length} READY
                      </span>
                    </div>
                    
                    <div className="max-h-[120px] overflow-y-auto divide-y divide-slate-100 text-[10px] font-sans">
                      {bulkParsedProducts.map((p, idx) => (
                        <div key={idx} className="p-1.5 flex items-start justify-between gap-1 bg-white">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800 truncate">{p.name || <em className="text-slate-400">No Name</em>}</p>
                            <p className="text-[9px] font-mono text-slate-400 mt-0.5">
                              SKU: {p.sku || "--"} | Price: ₹{p.price || 0}
                            </p>
                          </div>
                          <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold uppercase shrink-0 ${
                            p.isValid ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                          }`}>
                            {p.isValid ? "OK" : "Err"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 p-1.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkInputText("");
                          setBulkParsedProducts([]);
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-850 font-semibold px-1"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={handleBulkUploadSubmit}
                        disabled={bulkParsedProducts.filter(p => p.isValid).length === 0}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[10px] uppercase px-3 py-1 rounded transition-colors flex items-center gap-1 font-sans cursor-pointer shadow-sm"
                      >
                        <Check className="w-3 h-3" /> Import Valid
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Master Barcode visual rendering engine */}
            <div className="col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Dynamic Simulated Barcode Catalogue &amp; Pricing</h3>
                      <p className="text-xs text-slate-400">Click SKU to view dynamic vector barcode representation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {tenantProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex flex-col justify-between hover:border-slate-400 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">{p.sku}</span>
                            <h4 className="text-xs font-bold text-slate-900 mt-0.5">{p.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">MRP: ₹{p.price.toFixed(2)} | Cost: ₹{p.purchasePrice.toFixed(2)}</p>
                            <p className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">Margin: +{Math.round(((p.price - p.purchasePrice) / p.price) * 100)}%</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setNewProduct(p);
                                triggerNotification(`Product "${p.name}" loaded into the editor form.`, "success");
                                const element = document.getElementById("products-module-layout");
                                if (element) {
                                  element.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-amber-50 hover:border-amber-200 flex items-center justify-center cursor-pointer transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-500 hover:text-amber-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center cursor-pointer transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerBarcodeGenerator(p.sku)}
                              className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
                              title="Print label barcode banner"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                          </div>
                        </div>

                        {/* Rendering dynamic SVG lines representing proper standard UPC-12 code simulated layout */}
                        <div className="mt-3 bg-white p-3 rounded border border-slate-100 flex flex-col items-center">
                          {activeBarcodeUrl === p.sku ? (
                            <div className="flex flex-col items-center space-y-1 select-none pointer-events-none">
                              {/* Custom SVG Barcode */}
                              <svg className="w-48 h-10 text-slate-950" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <rect x="2" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="4" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="7" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="9" y="0" width="3" height="20" fill="currentColor" />
                                <rect x="14" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="16" y="0" width="2" height="20" fill="currentColor" />
                                <rect x="20" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="23" y="0" width="2.5" height="20" fill="currentColor" />
                                <rect x="27" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="29" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="32" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="35" y="0" width="2.5" height="20" fill="currentColor" />
                                <rect x="39" y="0" width="3" height="20" fill="currentColor" />
                                <rect x="44" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="47" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="50" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="53" y="0" width="2" height="20" fill="currentColor" />
                                <rect x="57" y="0" width="4" height="20" fill="currentColor" />
                                <rect x="63" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="66" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="68" y="0" width="2.5" height="20" fill="currentColor" />
                                <rect x="72" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="75" y="0" width="3" height="20" fill="currentColor" />
                                <rect x="80" y="0" width="1.5" height="20" fill="currentColor" />
                                <rect x="83" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="86" y="0" width="2" height="20" fill="currentColor" />
                                <rect x="89" y="0" width="1" height="20" fill="currentColor" />
                                <rect x="91" y="0" width="3.5" height="20" fill="currentColor" />
                                <rect x="96" y="0" width="1.5" height="20" fill="currentColor" />
                              </svg>
                              <span className="text-[10px] font-mono tracking-widest text-slate-800 font-bold">{p.barcode}</span>
                              <span className="text-[8px] font-mono text-emerald-600 font-bold uppercase tracking-widest">label printed</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => triggerBarcodeGenerator(p.sku)}
                              className="text-[11px] font-mono text-slate-500 font-bold hover:text-emerald-600 cursor-pointer"
                            >
                              [ Click to preview scannable barcode tag ]
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIP CRM CUSTOMER MANAGEMENT & CREDITS */}
          {activeTab === "customers" && (
            <div className="grid grid-cols-3 gap-6 animate-fadeIn" id="crm-module-layout">
              {/* New Customer loyalty sign-up */}
              <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-max">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-500" />
                  Customer Registration
                </h3>
                <p className="text-xs text-slate-400">Add clients to automatically track loyalty points wallet and outstanding cash credits</p>

                <form onSubmit={handleCreateCustomerSubmit} className="space-y-3.5 text-xs text-slate-700">
                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar Patel"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9812456789"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Email Coordinates</label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@gmail.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Opening Loyalty Pts</label>
                      <input
                        type="number"
                        value={newCustomer.loyaltyPoints}
                        onChange={(e) => setNewCustomer({ ...newCustomer, loyaltyPoints: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Store Credit Wallet (₹)</label>
                      <input
                        type="number"
                        value={newCustomer.creditBalance}
                        onChange={(e) => setNewCustomer({ ...newCustomer, creditBalance: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-2 text-slate-800 focus:border-slate-400 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold font-display rounded-lg uppercase tracking-wide text-xs shadow-sm mt-3"
                  >
                    Register VIP Client Account
                  </button>
                </form>
              </div>

              {/* Verified Loyalty Lists */}
              <div className="col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">VIP Loyalty CRM Directory Database</h3>
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto relative">
                    <table className="w-full text-left font-sans text-xs">
                      <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                        <tr className="text-[10px] font-bold text-slate-400 bg-slate-50 uppercase select-none">
                          <th className="px-4 py-2.5 bg-slate-50">Loyalty Member ID</th>
                          <th className="px-4 py-2.5 bg-slate-50">Customer Name / Contact</th>
                          <th className="px-4 py-2.5 text-right font-mono bg-slate-50">Loyalty Points Balance</th>
                          <th className="px-4 py-2.5 text-right font-mono bg-slate-50">Assigned Credit Balance</th>
                          <th className="px-4 py-2.5 bg-slate-50">Account Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customers.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-mono text-slate-500 font-bold text-[11px]">{c.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-900">{c.name}</p>
                              <p className="text-[10px] font-mono text-slate-400">{c.phone} | {c.email || "No email"}</p>
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                              ⭐ {c.loyaltyPoints} Pts
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-rose-600 font-bold">
                              ₹{c.creditBalance.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-slate-400 text-[10px] font-mono">{c.createdAt.slice(0, 10)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Simulated CRM metrics */}
                <div className="bg-gradient-to-r from-emerald-950 to-slate-900 p-6 rounded-xl text-white shadow-sm flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest mb-1">Smart Loyalty Conversion</h4>
                    <p className="text-sm text-slate-300">Award standard point calculations rule set: spend ₹100 to obtain 1 Loyalty Point automatically.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 px-2 py-1 rounded font-mono font-bold">
                      WhatsApp Billing Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BRANCH STORES, EXPENSES, & CASH SESSIONS */}
          {activeTab === "expenses" && (
            <div className="grid grid-cols-2 gap-6 animate-fadeIn" id="stores-module-layout">
              {/* Cash shifting session management */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    Retail Drawer Sessions / Cashier terminal Shift
                  </h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${activeSession ? "bg-emerald-500 text-slate-950 animate-pulse" : "bg-slate-200 text-slate-600"}`}>
                    {activeSession ? "TERMINAL ACTIVE" : "DRAWER LOCKED"}
                  </span>
                </div>

                {!activeSession ? (
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                    <p className="text-xs text-slate-500">
                      Open a local checkout session register to audit drawer transactions. Supply float cash amount:
                    </p>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">DRAWER FLOAT CASH balance (₹)</label>
                      <input
                        type="number"
                        value={openingBalance}
                        onChange={(e) => setOpeningBalance(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded p-2 text-xs font-mono font-bold text-slate-800"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const sess: CashSession = {
                          id: `SESS-${Date.now()}`,
                          cashierId: "CS-042",
                          cashierName: currentCashierName,
                          startTime: new Date().toLocaleTimeString(),
                          openingBalance,
                          salesCash: totalInvoicedRevenue * 0.4, // compute simulation split
                          salesUpi: totalInvoicedRevenue * 0.4,
                          salesCard: totalInvoicedRevenue * 0.2,
                          status: "OPEN"
                        };
                        setActiveSession(sess);
                        setCashSessions((prev) => [...prev, sess]);
                        triggerNotification(`Cashier drawer shift opened float: ₹${openingBalance}`, "success");
                      }}
                      className="w-full py-2 bg-emerald-600 text-slate-950 hover:bg-emerald-500 font-bold text-xs rounded-lg transition-transform"
                    >
                      Initialize Register Opening
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-4 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Shift Leader Cashier:</span>
                      <span className="text-white font-bold font-sans">{activeSession.cashierName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shift Start Time:</span>
                      <span className="text-white">{activeSession.startTime}</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span>Opening Drawer Cash:</span>
                        <span>₹{activeSession.openingBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Simulated Card POS Log:</span>
                        <span>₹{activeSession.salesCard.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Simulated UPI Digital:</span>
                        <span>₹{activeSession.salesUpi.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold text-xs">
                        <span>Simulated CASH Payments:</span>
                        <span>+₹{activeSession.salesCash.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-2">
                      <label className="block text-slate-400 mb-1">AUDITED CASH IN DRAWER AT CLOSE (₹)</label>
                      <input
                        type="number"
                        placeholder="Type counted paper money"
                        value={actualCashDrawer}
                        onChange={(e) => setActualCashDrawer(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded text-slate-100 p-2 text-xs font-mono font-extrabold text-emerald-400"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const targetAmt = activeSession.openingBalance + activeSession.salesCash;
                        const difference = actualCashDrawer - targetAmt;
                        const finalCopy = {
                          ...activeSession,
                          endTime: new Date().toLocaleTimeString(),
                          closingBalance: targetAmt,
                          actualCashInDrawer: actualCashDrawer,
                          difference,
                          status: "CLOSED" as "CLOSED"
                        };
                        setCashSessions((prev) => prev.map(s => s.id === activeSession.id ? finalCopy : s));
                        setActiveSession(null);
                        setActualCashDrawer(0);
                        triggerNotification(
                          `Register shift terminated. Drawer difference is ₹${difference.toFixed(2)}`,
                          difference < 0 ? "warning" : "success"
                        );
                      }}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg uppercase tracking-wide"
                    >
                      Audit &amp; Terminate Cash Drawer Session
                    </button>
                  </div>
                )}

                {/* Audit trail list */}
                <div>
                  <h4 className="text-[11px] font-mono font-bold uppercase text-slate-400 mb-2">Previous Registers Cash Shifts</h4>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto font-mono text-[10px]">
                    {cashSessions.map((c) => (
                      <div key={c.id} className="p-2 bg-slate-50 border border-slate-100 rounded flex justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{c.cashierName} shift</p>
                          <p className="text-[9px] text-slate-400">Opened float: ₹{c.openingBalance} | Start: {c.startTime}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-1.5 rounded font-bold uppercase text-[9px] ${c.status === "CLOSED" ? "bg-slate-200 text-slate-700" : "bg-emerald-500/20 text-emerald-700 animate-pulse"}`}>
                            {c.status}
                          </span>
                          {c.difference !== undefined && (
                            <p className={`font-mono font-black mt-1 ${c.difference < 0 ? "text-rose-600" : "text-emerald-700"}`}>
                              Var: ₹{c.difference.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expense Tracker Logbook */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-rose-500" />
                    Branch operational utility &amp; payroll Expense Ledgers
                  </h3>
                  <span className="text-rose-600 font-mono font-bold text-xs">Total payout: ₹{totalStoreExpenses}</span>
                </div>

                <form onSubmit={handleCreateExpenseSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Expense Category</label>
                      <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        className="w-full border border-slate-200 rounded p-1.5"
                      >
                        <option value="Utility (Electricity)">Utility (Electricity)</option>
                        <option value="Store Branding">Store Branding</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Staff Refreshments">Staff Refreshments</option>
                        <option value="Emergency Maintenance">Emergency Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-mono font-semibold mb-1">Cash amount (₹) *</label>
                      <input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                        className="w-full border border-slate-200 rounded p-1.5 font-mono font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 font-mono font-semibold mb-1">Voucher Description details *</label>
                    <input
                      type="text"
                      placeholder="e.g. Paid tea supply & custom sign repairs"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="w-full border border-slate-200 rounded p-2 text-slate-800"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-950 text-emerald-400 font-bold text-xs font-display rounded-lg uppercase transition-transform"
                  >
                    File Ledger Payout
                  </button>
                </form>

                {/* Expenses register */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 font-mono text-[11px]">
                  {expenses.slice().reverse().map((exp) => (
                    <div key={exp.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{exp.category}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">"{exp.description}"</p>
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded uppercase">{exp.storeBranchId}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-rose-600 font-extrabold text-sm font-mono">-₹{exp.amount}</p>
                        <p className="text-slate-400 text-[9px] mt-1">{exp.approvedBy} approved</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANALYTICS & SALES REPORT */}
          {activeTab === "analytics" && (
            <div className="space-y-6" id="analytics-module-layout">
              {/* Gross stats grid */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-emerald-500/20 bg-emerald-50/10 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-6 opacity-10">
                    <TrendingUp className="w-20 h-20 text-emerald-600" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Gross Sales Revenue</h4>
                  <p className="text-3xl font-black font-mono text-slate-900">₹{totalInvoicedRevenue.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Simulated overall POS turnovers</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Suppliers Cost of Goods (COGS)</h4>
                  <p className="text-3xl font-black font-mono text-slate-900">₹{totalWarehouseCOGS.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Valued purchase cost ledger</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-rose-500/10 bg-rose-50/5 shadow-sm relative overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Filed Store Expenses</h4>
                  <p className="text-3xl font-black font-mono text-rose-600">₹{totalStoreExpenses.toFixed(2)}</p>
                  <p className="text-xs text-slate-500 mt-2">Utility costs & Logistics paid</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-250 bg-gradient-to-br from-emerald-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono mb-1">Calculated Net Profit</h4>
                  <p className="text-3xl font-black font-mono text-emerald-400">₹{calculatedOperationalNetProfit.toFixed(2)}</p>
                  <p className="text-xs text-slate-300 mt-2">Revenue minus COGS & Expenses</p>
                </div>
              </div>

              {/* Dynamic SVG Visual Charts */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center text-slate-800">
                    <h3 className="text-sm font-bold">Category Distribution (Stock Items Volume)</h3>
                    <span className="text-xs text-slate-500 font-mono">Dynamic Bar visualization</span>
                  </div>

                  {/* Built responsive HTML/CSS bar visualization for complete stability */}
                  <div className="space-y-3 pt-4">
                    {Array.from(new Set(tenantProducts.map(p => p.category))).map((cat) => {
                      const categoryVolume = tenantProducts.filter(p => p.category === cat).reduce((acc, currentItem) => acc + getProductStock(currentItem), 0);
                      const totalStockAll = tenantProducts.reduce((acc, p) => acc + getProductStock(p), 1);
                      const percentage = Math.round((categoryVolume / totalStockAll) * 100);

                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-700">{cat}</span>
                            <span className="font-mono font-medium text-slate-500">{categoryVolume} items ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${Math.max(4, percentage)}%` }}
                              className="h-full bg-emerald-600 rounded-full transition-all"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tax Ledger Liability breakdown list */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">GST / VAT Liability Ledgers</h3>
                  <p className="text-xs text-slate-400">Total legal taxable values registered across tax brackets</p>
                  
                  <div className="space-y-3.5 pt-2 text-xs font-mono">
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Standard Luxury Tax bracket (18% GST)</p>
                        <p className="text-[10px] text-slate-400">Applies to beverages and snack items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          ₹{(totalTaxGSTLiability * 0.45).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Filed</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Intermediate Groceries slab (12% GST)</p>
                        <p className="text-[10px] text-slate-400 font-sans font-normal">Dairy, spreads & butter commodities</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          ₹{(totalTaxGSTLiability * 0.35).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Filed</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-lg flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">Essential Produce slab (5% GST)</p>
                        <p className="text-[10px] text-slate-400">Fresh imports, apples, premium milk</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">
                          ₹{(totalTaxGSTLiability * 0.20).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Filed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "super-admin" && currentRole === UserRole.ADMIN && currentCashierName.toLowerCase().includes("super") && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              <SuperAdminConsole
                credentialsList={credentialsList}
                onUpdateCredentials={(newList) => {
                  setCredentialsList(newList);
                  localStorage.setItem("expert_aid_credentials", JSON.stringify(newList));
                }}
                triggerNotification={triggerNotification}
                tenantsList={tenantsList}
                onUpdateTenants={setTenantsList}
                activeTenantId={activeTenantId}
                onSelectTenant={(id) => {
                  setActiveTenantId(id);
                  localStorage.setItem("expert_aid_active_tenant_id", id);
                }}
              />
            </div>
          )}

          {activeTab === "staff-registry" && (currentRole === UserRole.ADMIN || currentRole === UserRole.MANAGER) && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              <StaffRegistry
                credentialsList={credentialsList}
                onUpdateCredentials={(newList) => {
                  setCredentialsList(newList);
                  localStorage.setItem("expert_aid_credentials", JSON.stringify(newList));
                }}
                triggerNotification={triggerNotification}
                activeTenant={activeTenant}
                branches={branches}
                currentRole={currentRole}
                currentBranch={currentBranch}
                currentTheme={currentTheme}
              />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              <SettingsPanel
                currentUserEmail={currentUserEmail}
                currentRole={currentRole}
                currentCashierName={currentCashierName}
                onUpdateCashierName={setCurrentCashierName}
                credentialsList={credentialsList}
                onUpdateCredentials={(newList) => {
                  setCredentialsList(newList);
                  localStorage.setItem("expert_aid_credentials", JSON.stringify(newList));
                }}
                activeTenant={activeTenant}
                onUpdateTenant={(updatedTenant) => {
                  const updatedList = tenantsList.map(t => t.id === updatedTenant.id ? updatedTenant : t);
                  setTenantsList(updatedList);
                  localStorage.setItem("expert_aid_tenants", JSON.stringify(updatedList));
                }}
                triggerNotification={triggerNotification}
                productCategories={productCategories}
                onUpdateProductCategories={(newCats) => {
                  setProductCategories(newCats);
                  localStorage.setItem("expert_aid_product_categories", JSON.stringify(newCats));
                }}
                suppliers={suppliers}
                onAddSupplier={handleAddSupplier}
                onDeleteSupplier={handleDeleteSupplier}
                branches={branches}
                onAddBranch={handleAddBranch}
                onDeleteBranch={handleDeleteBranch}
                currentBranch={currentBranch}
                onSwitchBranch={handleBranchChange}
              />
            </div>
          )}

        </div>
      </div>

      {/* RETAIL THERMAL INVOICE PRINT SIMULATION (MODAL LAYER) */}
      {showInvoicePrintPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 py-12 px-4 flex items-center justify-center no-print">
          <div className="bg-white max-w-sm w-full p-6 h-auto max-h-[90vh] overflow-y-auto rounded-3xl border-4 border-slate-900 shadow-2xl space-y-4 ring-8 ring-slate-900/30">
            {/* Modal Heading */}
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                Print preview
              </span>
              <button
                onClick={() => setShowInvoicePrintPreview(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                [ close window ]
              </button>
            </div>

            {/* Target Printer Layout Selector */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                Select Printer Type / Page Layout
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[9px]">
                <button
                  type="button"
                  onClick={() => setSelectedPrinterLayout("standard-a4")}
                  className={`py-1.5 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedPrinterLayout === "standard-a4"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm mb-0.5">🖨️</span>
                  <span>Office A4</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPrinterLayout("thermal-80mm")}
                  className={`py-1.5 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedPrinterLayout === "thermal-80mm"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm mb-0.5">🧾</span>
                  <span>POS 80mm</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPrinterLayout("thermal-58mm")}
                  className={`py-1.5 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedPrinterLayout === "thermal-58mm"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm mb-0.5">🎟️</span>
                  <span>POS 58mm</span>
                </button>
              </div>
              <p className="text-[9px] text-slate-500 font-medium leading-tight text-center pt-0.5">
                {selectedPrinterLayout === "standard-a4" 
                  ? "✓ Formats beautifully for any normal Laser/Inkjet (A4 / Letter) desktop printer." 
                  : selectedPrinterLayout === "thermal-80mm"
                  ? "✓ Formats perfectly for standard 3-inch roll POS receipt printers."
                  : "✓ Formats tightly for mini 2-inch roll handheld thermal printers."}
              </p>
            </div>

            {/* Thermal Receipt Body */}
            <div className="bg-amber-50/20 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-3" id="invoice-receipt-theme">
              <div className="text-center font-sans space-y-1">
                <h4 className="font-display font-black text-sm tracking-tight text-slate-900">
                  EXPERT-AID HYPERMARKETS
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  {currentBranch?.name || "Branch #01 Outlet"}
                </p>
                <p className="text-[10px] text-slate-500 font-mono leading-none">
                  {currentBranch?.address}, {currentBranch?.city}
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  Contact: {currentBranch?.phone}
                </p>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Invoice ID:</span>
                  <span className="font-bold">{showInvoicePrintPreview.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>GSTIN Check:</span>
                  <span className="font-bold uppercase">07AAAAA1111A1Z1</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Cashier:</span>
                  <span>{showInvoicePrintPreview.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span>{showInvoicePrintPreview.date} {showInvoicePrintPreview.time}</span>
                </div>
                {showInvoicePrintPreview.customerName && (
                  <div className="flex justify-between border-t border-dashed border-slate-300 pt-1">
                    <span>Customer:</span>
                    <span className="font-bold truncate max-w-[150px]">{showInvoicePrintPreview.customerName}</span>
                  </div>
                )}
                {showInvoicePrintPreview.customerPhone && (
                  <div className="flex justify-between">
                    <span>Mobile No:</span>
                    <span className="font-bold">{showInvoicePrintPreview.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border-t border-slate-300 pt-2 space-y-2">
                <div className="grid grid-cols-4 font-bold border-b border-slate-300 pb-1 text-slate-900">
                  <span className="col-span-2">Particular Description</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Price</span>
                </div>
                {showInvoicePrintPreview.items.map((it) => (
                  <div key={it.productId} className="grid grid-cols-4 gap-1">
                    <span className="col-span-2 truncate font-sans text-[10px]">{it.name}</span>
                    <span className="text-right">{it.quantity} {it.unit}</span>
                    <span className="text-right font-bold">₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Math */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Basket Tax value:</span>
                  <span>₹{showInvoicePrintPreview.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Promo discount code:</span>
                  <span>{showInvoicePrintPreview.couponCode ? `-${showInvoicePrintPercentApplied(showInvoicePrintPreview)}` : "₹0.00"}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-slate-950 border-t border-dashed border-slate-300 pt-1.5">
                  <span>TOTAL PAYABLE:</span>
                  <span>₹{showInvoicePrintPreview.grandTotal.toFixed(2)}</span>
                </div>
                {showInvoicePrintPreview.paymentMode === PaymentMode.CASH && (
                  <>
                    <div className="flex justify-between p-0.5 mt-1 bg-slate-100 rounded">
                      <span>Paper Cash Tendered:</span>
                      <span>₹{Number(showInvoicePrintPreview.cashReceived).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Change Re-delivered:</span>
                      <span>₹{Number(showInvoicePrintPreview.changeReturned).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-bold font-sans text-[10px] bg-slate-900 text-white px-1.5 rounded">{showInvoicePrintPreview.paymentMode}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded text-[9px] font-sans leading-tight text-center text-slate-500 border border-slate-200">
                ⭐ Loyalty members: spent ₹{showInvoicePrintPreview.grandTotal} to award +{Math.floor(showInvoicePrintPreview.grandTotal/10)} Loyalty Points dynamically.<br />Thank you for shopping at ExpertAid!
              </div>
            </div>

            {/* Print trigger simulated */}
            <div className="pt-2">
              <button
                onClick={async () => {
                  triggerNotification(`Initiating print receipt request for ${selectedPrinterLayout === 'standard-a4' ? 'Standard Printer' : 'Thermal Printer'}...`, "success");
                  const success = await printElementById("invoice-receipt-theme", selectedPrinterLayout);
                  if (success) {
                    triggerNotification("Print job compiled successfully! Check your printer dialog or downloads folder.", "success");
                  } else {
                    triggerNotification("Print spool / PDF compilation failed.", "warning");
                  }
                }}
                className="w-full py-2.5 bg-slate-900 border hover:bg-slate-800 text-white rounded-lg text-xs font-bold font-display tracking-wider uppercase transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                Spool Paper Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DELETION CONFIRMATION DIALOG (IFRAME SECURE MODAL) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-2xl border border-slate-200 shadow-2xl space-y-4 animate-scaleUp">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Delete Product from Catalogue?</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Are you sure you want to permanently delete <strong className="text-rose-600 font-semibold">"{productToDelete.name}"</strong>? This action will remove the product and update your store catalog instantly.
              </p>
            </div>
            
            <div className="flex gap-2.5 pt-1.5">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProductConfirm}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-sans font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm shadow-rose-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Discount amount formatter helper inside Print modal
function showInvoicePrintPercentApplied(inv: Invoice) {
  return `${inv.discountPercent}% (-₹${inv.discountAmount.toFixed(2)})`;
}
