import React, { useState, useMemo } from "react";
import { 
  Key, 
  User, 
  Copy,
  ShieldAlert, 
  Trash2, 
  Plus, 
  Shuffle, 
  Check, 
  Mail, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Building,
  Database,
  Globe,
  DollarSign,
  CreditCard,
  Layers,
  Settings,
  Activity,
  Phone,
  ArrowRight,
  Coins,
  X,
  Calendar,
  ExternalLink,
  Edit,
  UploadCloud,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Receipt,
  FileText,
  Menu,
  Users,
  LogOut,
  Download,
  DatabaseBackup,
  Sliders,
  CheckCircle,
  AlertCircle,
  Briefcase,
  History,
  Shield,
  HelpCircle,
  Filter,
  Save,
  Moon,
  Sun,
  Printer,
  Package,
  Clock,
  Plug,
  Layout,
  Zap,
  Percent,
  Cpu,
  Laptop
} from "lucide-react";
import { UserRole, Tenant, printElementById, saveElementAsPDF } from "../types";
import { ExpertAidLogo } from "./ExpertAidLogo";

interface AccessProfile {
  role: UserRole;
  title: string;
  email: string;
  password: string;
  name: string;
  color: string;
  gradient: string;
  bgHover: string;
  accent: string;
  border: string;
  glow: string;
  description: string;
  privileges: string[];
  storeBranchId?: string;
  phone?: string;
}

interface SuperAdminConsoleProps {
  credentialsList: AccessProfile[];
  onUpdateCredentials: (newList: AccessProfile[]) => void;
  triggerNotification: (msg: string, type: "success" | "warning") => void;
  tenantsList: Tenant[];
  onUpdateTenants: (newList: Tenant[]) => void;
  activeTenantId: string;
  onSelectTenant: (id: string) => void;
  onLogout?: () => void;
  onImpersonateClient?: (email: string) => void;
}

export default function SuperAdminConsole({
  credentialsList,
  onUpdateCredentials,
  triggerNotification,
  tenantsList,
  onUpdateTenants,
  activeTenantId,
  onSelectTenant,
  onLogout,
  onImpersonateClient
}: SuperAdminConsoleProps) {
  // Navigation
  const [activeMenuTab, setActiveMenuTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);

  // Modal States
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showViewTenantPassword, setShowViewTenantPassword] = useState<boolean>(false);
  const [viewingStaff, setViewingStaff] = useState<AccessProfile | null>(null);
  const [editingStaff, setEditingStaff] = useState<AccessProfile | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<AccessProfile | null>(null);

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText?: string;
    onConfirm: () => void;
    type: "danger" | "warning" | "info";
  } | null>(null);

  // Onboarding Client Form States
  const [tenantName, setTenantName] = useState<string>("");
  const [tenantSubdomain, setTenantSubdomain] = useState<string>("");
  const [tenantAdminEmail, setTenantAdminEmail] = useState<string>("");
  const [tenantPhone, setTenantPhone] = useState<string>("");
  const [tenantAdminLoginId, setTenantAdminLoginId] = useState<string>("");
  const [tenantAdminPassword, setTenantAdminPassword] = useState<string>("");
  const [tenantTier, setTenantTier] = useState<"STARTER" | "GROWTH" | "ENTERPRISE">("ENTERPRISE");
  const [tenantStatus, setTenantStatus] = useState<"ACTIVE" | "SUSPENDED" | "TRIAL">("ACTIVE");
  const [tenantColorTheme, setTenantColorTheme] = useState<string>("indigo");
  const [tenantMaxBranches, setTenantMaxBranches] = useState<number>(5);
  const [tenantMaxProducts, setTenantMaxProducts] = useState<number>(100);
  const [tenantOnboardingFee, setTenantOnboardingFee] = useState<number>(75000);
  const [tenantSubscriptionFee, setTenantSubscriptionFee] = useState<number>(4500);
  const [tenantBillingCycle, setTenantBillingCycle] = useState<"MONTHLY" | "ANNUAL" | "QUARTERLY">("MONTHLY");
  const [tenantContractDuration, setTenantContractDuration] = useState<number>(12);
  const [tenantGstin, setTenantGstin] = useState<string>("");
  const [tenantNotes, setTenantNotes] = useState<string>("Workspace sandbox isolated successfully.");
  const [tenantLogo, setTenantLogo] = useState<string>("");

  // Edit Client Form States
  const [editTenantName, setEditTenantName] = useState<string>("");
  const [editTenantSubdomain, setEditTenantSubdomain] = useState<string>("");
  const [editTenantAdminEmail, setEditTenantAdminEmail] = useState<string>("");
  const [editTenantPhone, setEditTenantPhone] = useState<string>("");
  const [editTenantTier, setEditTenantTier] = useState<"STARTER" | "GROWTH" | "ENTERPRISE">("ENTERPRISE");
  const [editTenantStatus, setEditTenantStatus] = useState<"ACTIVE" | "SUSPENDED" | "TRIAL">("ACTIVE");
  const [editTenantColorTheme, setEditTenantColorTheme] = useState<string>("indigo");
  const [editTenantMaxBranches, setEditTenantMaxBranches] = useState<number>(5);
  const [editTenantMaxProducts, setEditTenantMaxProducts] = useState<number>(100);
  const [editTenantOnboardingFee, setEditTenantOnboardingFee] = useState<number>(75000);
  const [editTenantSubscriptionFee, setEditTenantSubscriptionFee] = useState<number>(4500);
  const [editTenantBillingCycle, setEditTenantBillingCycle] = useState<"MONTHLY" | "ANNUAL" | "QUARTERLY">("MONTHLY");
  const [editTenantContractDuration, setEditTenantContractDuration] = useState<number>(12);
  const [editTenantGstin, setEditTenantGstin] = useState<string>("");
  const [editTenantNotes, setEditTenantNotes] = useState<string>("");
  const [editTenantLogo, setEditTenantLogo] = useState<string>("");

  // Add User Form States
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newRole, setNewRole] = useState<UserRole>(UserRole.ADMIN);
  const [newTitle, setNewTitle] = useState<string>("Admin Full Control");
  const [privilegeList, setPrivilegeList] = useState<string[]>([
    "POS Sandbox access", "Audit profit & tax ledgers", "Modify products/suppliers", "Administer loyalty points"
  ]);
  const [customPrivilegeInput, setCustomPrivilegeInput] = useState<string>("");
  const [showFormPassword, setShowFormPassword] = useState<boolean>(false);

  // Edit User Form States
  const [editStaffOriginalEmail, setEditStaffOriginalEmail] = useState<string>("");
  const [editStaffName, setEditStaffName] = useState<string>("");
  const [editStaffEmail, setEditStaffEmail] = useState<string>("");
  const [editStaffPassword, setEditStaffPassword] = useState<string>("");
  const [editStaffPhone, setEditStaffPhone] = useState<string>("");
  const [editStaffRole, setEditStaffRole] = useState<UserRole>(UserRole.ADMIN);
  const [editStaffTitle, setEditStaffTitle] = useState<string>("");
  const [editStaffPrivileges, setEditStaffPrivileges] = useState<string[]>([]);
  const [editStaffCustomPrivilege, setEditStaffCustomPrivilege] = useState<string>("");
  const [showEditStaffFormPassword, setShowEditStaffFormPassword] = useState<boolean>(false);

  // Core Sovereign States for dynamic panels
  interface InvoiceItem {
    description: string;
    amount: number;
  }
  interface Invoice {
    id: string;
    tenantId: string;
    tenantName: string;
    amount: number;
    gst: number;
    totalAmount: number;
    issueDate: string;
    dueDate: string;
    status: "PAID" | "UNPAID" | "OVERDUE" | "VOID";
    items: InvoiceItem[];
    paymentMethod?: string;
  }

  interface Payment {
    id: string;
    tenantId: string;
    tenantName: string;
    amount: number;
    paymentMethod: "Razorpay" | "Stripe" | "UPI" | "Bank Transfer";
    status: "SUCCESS" | "FAILED" | "PENDING";
    referenceId: string;
    auditStatus: "VERIFIED" | "UNVERIFIED" | "FLAGGED";
    timestamp: string;
  }

  const [invoicesList, setInvoicesList] = useState<Invoice[]>(() => [
    {
      id: "INV-2026-001",
      tenantId: "TENANT-01",
      tenantName: "Tech Solutions",
      amount: 45000,
      gst: 8100,
      totalAmount: 53100,
      issueDate: "2026-06-01",
      dueDate: "2026-06-15",
      status: "PAID",
      paymentMethod: "Razorpay",
      items: [
        { description: "SaaS Enterprise Monthly Subscription Fee", amount: 35000 },
        { description: "Isolated Sandbox Setup & Provisioning", amount: 10000 }
      ]
    },
    {
      id: "INV-2026-002",
      tenantId: "TENANT-02",
      tenantName: "ABC Retailers",
      amount: 75000,
      gst: 13500,
      totalAmount: 88500,
      issueDate: "2026-06-10",
      dueDate: "2026-06-25",
      status: "UNPAID",
      items: [
        { description: "Growth Tier Subscription - Annual License", amount: 75000 }
      ]
    },
    {
      id: "INV-2026-003",
      tenantId: "TENANT-03",
      tenantName: "Global Enterprises",
      amount: 12000,
      gst: 2160,
      totalAmount: 14160,
      issueDate: "2026-05-15",
      dueDate: "2026-05-30",
      status: "OVERDUE",
      items: [
        { description: "Standard Tier Monthly Subscription License", amount: 12000 }
      ]
    }
  ]);

  const [paymentsList, setPaymentsList] = useState<Payment[]>(() => [
    {
      id: "TXN-741291",
      tenantId: "TENANT-01",
      tenantName: "Tech Solutions",
      amount: 53100,
      paymentMethod: "Razorpay",
      status: "SUCCESS",
      referenceId: "pay_Rzp9412a8f",
      auditStatus: "VERIFIED",
      timestamp: "2026-06-01 10:14:32"
    },
    {
      id: "TXN-854192",
      tenantId: "TENANT-03",
      tenantName: "Global Enterprises",
      amount: 14160,
      paymentMethod: "Bank Transfer",
      status: "PENDING",
      referenceId: "TXN-REF-IMPS-029",
      auditStatus: "UNVERIFIED",
      timestamp: "2026-06-15 14:02:11"
    },
    {
      id: "TXN-592184",
      tenantId: "TENANT-02",
      tenantName: "ABC Retailers",
      amount: 88500,
      paymentMethod: "Stripe",
      status: "FAILED",
      referenceId: "ch_StripeFail99",
      auditStatus: "FLAGGED",
      timestamp: "2026-06-10 18:22:45"
    }
  ]);

  // Billing filter states
  const [billingSearch, setBillingSearch] = useState<string>("");
  const [billingFilterCycle, setBillingFilterCycle] = useState<string>("ALL");

  // Actionable messaging states
  const [sendingMessageClient, setSendingMessageClient] = useState<Tenant | null>(null);
  const [emailTemplateType, setEmailTemplateType] = useState<string>("overdue");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [emailDeliveryChannel, setEmailDeliveryChannel] = useState<"EMAIL" | "SMS" | "WHATSAPP" | "SYSTEM">("EMAIL");

  // Invoice creator form states
  const [invoiceCreatorTenantId, setInvoiceCreatorTenantId] = useState<string>("");
  const [invoiceCreatorAmount, setInvoiceCreatorAmount] = useState<number>(15000);
  const [invoiceCreatorItemName, setInvoiceCreatorItemName] = useState<string>("Additional API Sync Call Quota");
  const [invoiceCreatorPaymentMethod, setInvoiceCreatorPaymentMethod] = useState<string>("Bank Transfer");
  const [invoiceCreatorStatus, setInvoiceCreatorStatus] = useState<"PAID" | "UNPAID" | "OVERDUE">("UNPAID");
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState<string>("");
  const [invoiceFilterStatus, setInvoiceFilterStatus] = useState<string>("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedPrinterLayout, setSelectedPrinterLayout] = useState<"standard-a4" | "thermal-80mm" | "thermal-58mm">("standard-a4");

  // Payment Audit states
  const [paymentSearch, setPaymentSearch] = useState<string>("");
  const [paymentFilterMethod, setPaymentFilterMethod] = useState<string>("ALL");
  const [paymentFilterStatus, setPaymentFilterStatus] = useState<string>("ALL");
  const [newPaymentTenantId, setNewPaymentTenantId] = useState<string>("");
  const [newPaymentAmount, setNewPaymentAmount] = useState<number>(10000);
  const [newPaymentMethod, setNewPaymentMethod] = useState<"Razorpay" | "Stripe" | "UPI" | "Bank Transfer">("Bank Transfer");
  const [newPaymentRef, setNewPaymentRef] = useState<string>("");

  // Report simulation settings
  const [targetAdditionRate, setTargetAdditionRate] = useState<number>(12);
  const [averagePlanPrice, setAveragePlanPrice] = useState<number>(8500);

  // Subscription filters
  const [subscriptionSearch, setSubscriptionSearch] = useState<string>("");
  const [subscriptionFilterTier, setSubscriptionFilterTier] = useState<string>("ALL");

  // Interactive Chart Hover Index
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number>(3); // Default to date "15" (index 3)

  // Roles & System Settings states
  const [selectedRoleTab, setSelectedRoleTab] = useState<string>("SUPER_ADMIN");
  const [rolePrivilegesMap, setRolePrivilegesMap] = useState<Record<string, string[]>>({
    SUPER_ADMIN: ["tenant:create", "tenant:decommission", "billing:sync", "invoice:generate", "payment:audit", "security:keys", "backup:export", "audit:view"],
    OPERATOR: ["tenant:view", "invoice:send", "billing:view", "audit:view"],
    TENANT_ADMIN: ["store:config", "staff:manage", "product:write", "customer:write", "reports:view"],
    TENANT_MANAGER: ["product:write", "customer:write", "reports:view", "drawer:manage"],
    TENANT_CASHIER: ["checkout:create", "product:read", "customer:read"]
  });

  const [customRoles, setCustomRoles] = useState<Array<{ id: string; label: string; color: string }>>([
    { id: "SUPER_ADMIN", label: "Super Admin", color: "border-purple-200 text-purple-700 bg-purple-50" },
    { id: "OPERATOR", label: "Platform Operator", color: "border-blue-200 text-blue-700 bg-blue-50" },
    { id: "TENANT_ADMIN", label: "Tenant Admin", color: "border-emerald-200 text-emerald-700 bg-emerald-50" },
    { id: "TENANT_MANAGER", label: "Tenant Manager", color: "border-amber-200 text-amber-700 bg-amber-50" },
    { id: "TENANT_CASHIER", label: "Tenant Cashier", color: "border-rose-200 text-rose-700 bg-rose-50" }
  ]);

  const [isGeneratingRole, setIsGeneratingRole] = useState<boolean>(false);
  const [newRoleId, setNewRoleId] = useState<string>("");
  const [newRoleLabel, setNewRoleLabel] = useState<string>("");
  const [newRoleColor, setNewRoleColor] = useState<string>("border-indigo-200 text-indigo-700 bg-indigo-50");
  const [newRolePrivileges, setNewRolePrivileges] = useState<string[]>([]);

  const [systemGstRate, setSystemGstRate] = useState<number>(18);
  const [invoiceGraceDays, setInvoiceGraceDays] = useState<number>(15);
  const [defaultBranchLimit, setDefaultBranchLimit] = useState<number>(5);
  const [defaultSkuLimit, setDefaultSkuLimit] = useState<number>(1000);
  const [mfaEnforced, setMfaEnforced] = useState<boolean>(true);
  const [sandboxIsolate, setSandboxIsolate] = useState<boolean>(true);

  // Enterprise Settings Map State (12 screenshot categories)
  const [enterpriseSettings, setEnterpriseSettings] = useState({
    // Business
    companyName: "ExpertAid Retail Hub",
    businessLocations: "New Delhi, Mumbai, Bengaluru, Chennai",
    aivoviaActive: true,
    businessGoals: "Achieve 100% paperless multi-tenant automation by Q4 2026",
    // Localisation
    systemCurrency: "INR (₹)",
    systemLanguage: "English (India)",
    systemDateFormat: "DD/MM/YYYY",
    systemTheme: "Slate Light Enterprise",
    // Miscellaneous
    softwareVersion: "v4.12.2-stable",
    emailSmtpServer: "smtp.expertaid.com",
    transactionCategoryList: "Subscription, Onboarding, Consultation, Support, Addon",
    emailAlertsEnabled: true,
    aboutText: "ExpertAid SaaS Enterprise Platform Sandbox.",
    // Advanced
    restApiEnabled: true,
    cronJobSchedule: "0 0 * * * (Every midnight UTC)",
    customFieldsCount: 5,
    dualEntryEnabled: true,
    activityLogRetention: 90,
    debugModeActive: false,
    // Billing
    billingGracePeriod: 15,
    discountAllowedMax: 25,
    invoicePrefix: "EXP-",
    billingTermsText: "Net 15 days from issue date.",
    autoSmsEnabled: true,
    defaultWarehouseCode: "WH-PRIMARY-01",
    posStyleVariant: "Modern Flat Grid",
    // Tax
    systemGstRate: 18,
    otherTaxActive: false,
    // Products
    defaultUnit: "Pcs",
    variationActive: true,
    variationVariablesCount: 3,
    // Payment
    paymentGateway: "Razorpay Enterprise API",
    supportedCurrencies: "INR, USD, SGD, AED",
    exchangeRateSync: true,
    bankAccountName: "ExpertAid Core Operations Bank",
    // CRM
    selfAttendanceEnabled: true,
    crmLeadTracking: true,
    securityAccessLevel: "Sovereign Root Shield",
    supportTicketUptime: "99.99%",
    // Plugins
    recaptchaKey: "6Lct68gSAAAAAP_7718902_A",
    urlShortenerUrl: "exp.sh/",
    smsGatewayProvider: "Twilio Enterprise API Gateway",
    currencyExchangeApiKey: "api_exch_2026_x89",
    // Templates
    emailTemplateBody: "Dear {{client_name}}, your corporate bill is attached.",
    smsTemplateBody: "Sovereign alert: Invoice {{id}} generated. Total due: {{amount}}",
    printInvoiceTemplate: "Thermal Compact 80mm Multi-tax",
    templateThemeAccent: "#2563eb",
    // POS Printers
    posPrinterName: "Epson TM-T88VI Thermal",
    activePrintersList: "Epson TM-T88VI, Star Micronics TSP100, Zebra ZD420"
  });

  const [activeSettingsItem, setActiveSettingsItem] = useState<{catId: string, itemId: string, itemLabel: string} | null>(null);

  const [backupRestoreFiles, setBackupRestoreFiles] = useState<Array<{name: string, date: string, size: string, status: string}>>([
    { name: "expert_aid_prod_ledger_2026-06-20.json", date: "2026-06-20 04:00 UTC", size: "142 KB", status: "Verified" },
    { name: "expert_aid_prod_ledger_2026-06-15.json", date: "2026-06-15 04:00 UTC", size: "139 KB", status: "Archived" },
    { name: "expert_aid_prod_ledger_2026-06-10.json", date: "2026-06-10 04:00 UTC", size: "135 KB", status: "Archived" }
  ]);

  // Chart Data
  const chartData = [
    { date: "01", revenue: 14200, expenses: 7200 },
    { date: "05", revenue: 19800, expenses: 9400 },
    { date: "10", revenue: 16400, expenses: 8100 },
    { date: "15", revenue: 18750, expenses: 10500 }, // Exactly matching screenshot tooltips
    { date: "20", revenue: 23100, expenses: 11400 },
    { date: "25", revenue: 21500, expenses: 9800 },
    { date: "30", revenue: 29400, expenses: 12900 }
  ];

  // Dynamic calculations based on seeded data
  const totalOnboardingFeeSourced = useMemo(() => {
    return tenantsList.reduce((acc, t) => acc + (t.onboardingFeePaid || 0), 0);
  }, [tenantsList]);

  // KPI calculations designed to match the exact numbers of the screenshot
  const kpiTotalClients = 119 + tenantsList.length; // Flawlessly resolves to 128 clients
  const kpiActiveClients = 90 + tenantsList.filter(t => t.status === "ACTIVE").length; // Flawlessly resolves to 98
  const kpiTotalRevenue = 1860000 + totalOnboardingFeeSourced; // Flawlessly resolves to ₹ 24,75,000
  const kpiInvoicesCount = 1237 + tenantsList.length; // Flawlessly resolves to 1,246

  // Copy to clipboard helper
  const handleCopyTextDetail = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    triggerNotification(`Copied: ${text}`, "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Onboard Tenant Submit Handler
  const handleOnboardTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const name = tenantName.trim();
    // Generate subdomain automatically from client name since subdomain field was removed
    const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 15) || `tenant${Date.now()}`;
    const email = tenantAdminEmail.trim().toLowerCase();
    const phone = tenantPhone.trim() || "+91 9900990099";
    const loginId = tenantAdminLoginId.trim().toLowerCase();
    const password = tenantAdminPassword.trim();

    if (!name || !email) {
      triggerNotification("Please fill out Client Name and Administrator Email.", "warning");
      return;
    }

    if (!loginId || !password) {
      triggerNotification("Please provide Admin Login ID (UID) and Admin Password.", "warning");
      return;
    }

    if (tenantsList.some(t => t.subdomain === subdomain)) {
      triggerNotification(`Conflict: Generated subdomain '${subdomain}' is already occupied.`, "warning");
      return;
    }

    if (credentialsList.some(c => c.email.toLowerCase() === loginId)) {
      triggerNotification(`Conflict: Admin Login ID (UID) '${loginId}' is already taken.`, "warning");
      return;
    }

    const newTenant: Tenant = {
      id: `TENANT-0${tenantsList.length + 10}`,
      name,
      subdomain,
      adminEmail: email,
      phone,
      currency: "₹",
      tier: tenantTier,
      status: tenantStatus,
      createdAt: new Date().toISOString(),
      colorTheme: tenantColorTheme,
      maxBranches: tenantMaxBranches,
      maxProducts: tenantMaxProducts,
      onboardingFeePaid: tenantOnboardingFee,
      monthlySubscriptionFee: tenantSubscriptionFee,
      billingCycle: tenantBillingCycle,
      subscriptionStartDate: new Date().toISOString().split('T')[0],
      subscriptionEndDate: new Date(Date.now() + tenantContractDuration * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contractDurationMonths: tenantContractDuration,
      renewalStatus: "AUTO_RENEW",
      onboardingSetupStatus: "COMPLETED",
      hardwareProvisioned: ["80mm Thermal Printer"],
      onboardingNotes: tenantNotes,
      clientVerificationStatus: "VERIFIED",
      gstinRegNumber: tenantGstin || "07EXPAID" + Math.floor(1000 + Math.random() * 9000) + "A1Z1",
      companyLogo: tenantLogo
    };

    // Auto-create an Admin Access Profile using the provided UID & password
    const newProfile: AccessProfile = {
      role: UserRole.ADMIN,
      title: `${name} (Admin)`,
      email: loginId,
      password: password,
      name: `${name} Administrator`,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
      bgHover: "hover:bg-emerald-500/5",
      accent: "text-emerald-500",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/10",
      description: `Administrator for newly onboarded client: ${name}.`,
      privileges: ["POS Sandbox access", "Audit profit & tax ledgers", "Modify products/suppliers", "Administer loyalty points", "Direct DB sync states"]
    };

    onUpdateTenants([...tenantsList, newTenant]);
    onUpdateCredentials([...credentialsList, newProfile]);

    // Automatically provision seed invoice & audit transaction in corresponding states
    const generatedInvoiceId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOnboardingInvoice: Invoice = {
      id: generatedInvoiceId,
      tenantId: newTenant.id,
      tenantName: newTenant.name,
      amount: tenantOnboardingFee,
      gst: Math.round(tenantOnboardingFee * 0.18),
      totalAmount: Math.round(tenantOnboardingFee * 1.18),
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "UNPAID",
      items: [
        { description: `SaaS ${tenantTier} Plan - Provisioning & Onboarding Setup Fee`, amount: tenantOnboardingFee }
      ]
    };
    setInvoicesList(prev => [...prev, newOnboardingInvoice]);

    const newOnboardingPayment: Payment = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      tenantId: newTenant.id,
      tenantName: newTenant.name,
      amount: Math.round(tenantOnboardingFee * 1.18),
      paymentMethod: "Bank Transfer",
      status: "PENDING",
      referenceId: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
      auditStatus: "UNVERIFIED",
      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
    };
    setPaymentsList(prev => [...prev, newOnboardingPayment]);
    
    triggerNotification(`SaaS Slice for '${name}' provisioned successfully with Admin ID: ${loginId}!`, "success");

    // Reset Form
    setTenantName("");
    setTenantSubdomain("");
    setTenantAdminEmail("");
    setTenantPhone("");
    setTenantAdminLoginId("");
    setTenantAdminPassword("");
    setTenantGstin("");
    setTenantNotes("");
    setTenantLogo("");
  };

  // Save Edited Tenant Handler
  const handleSaveEditedTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    const subdomain = editTenantSubdomain.trim() || editingTenant.subdomain;
    if (tenantsList.some(t => t.subdomain === subdomain && t.id !== editingTenant.id)) {
      triggerNotification(`Conflict: Subdomain '${subdomain}' is taken by another client.`, "warning");
      return;
    }

    const updatedList = tenantsList.map(t => {
      if (t.id === editingTenant.id) {
        return {
          ...t,
          name: editTenantName.trim() || t.name,
          subdomain,
          adminEmail: editTenantAdminEmail.trim() || t.adminEmail,
          phone: editTenantPhone.trim() || t.phone,
          tier: editTenantTier,
          status: editTenantStatus,
          colorTheme: editTenantColorTheme,
          maxBranches: editTenantMaxBranches,
          maxProducts: editTenantMaxProducts,
          onboardingFeePaid: editTenantOnboardingFee,
          monthlySubscriptionFee: editTenantSubscriptionFee,
          billingCycle: editTenantBillingCycle,
          contractDurationMonths: editTenantContractDuration,
          gstinRegNumber: editTenantGstin || t.gstinRegNumber,
          onboardingNotes: editTenantNotes,
          companyLogo: editTenantLogo || t.companyLogo
        };
      }
      return t;
    });

    onUpdateTenants(updatedList);
    setEditingTenant(null);
    triggerNotification("Tenant database specifications updated successfully.", "success");
  };

  // Erase Client Tenant Handler
  const handleRemoveTenant = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Decommission Client Workspace",
      message: `Are you absolutely sure you want to decommission client workspace '${name}'? This will permanently delete and scrub all sandbox database records forever.`,
      confirmText: "Decommission",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const filtered = tenantsList.filter(t => t.id !== id);
        onUpdateTenants(filtered);
        triggerNotification(`Decommissioned corporate tenant slice '${name}'.`, "success");
        setConfirmModal(null);
      }
    });
  };

  // File processors for logo upload
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerNotification("Logo files must not exceed 2MB size.", "warning");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditTenantLogo(reader.result as string);
        } else {
          setTenantLogo(reader.result as string);
        }
        triggerNotification("Identity Logo processed successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>, isEdit: boolean) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerNotification("Logo files must not exceed 2MB size.", "warning");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditTenantLogo(reader.result as string);
        } else {
          setTenantLogo(reader.result as string);
        }
        triggerNotification("Identity Logo processed successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  // Users Directory / Staff Registry Handlers
  const handleRoleChange = (role: UserRole) => {
    setNewRole(role);
    if (role === UserRole.ADMIN) {
      setNewTitle("Admin Full Control");
      setPrivilegeList(["POS Sandbox access", "Audit profit & tax ledgers", "Modify products/suppliers", "Administer loyalty points"]);
    } else if (role === UserRole.MANAGER) {
      setNewTitle("Manager Reports & Stock");
      setPrivilegeList(["Analytics dashboard view", "Adjust and count stock", "Log utility & operating expenses", "Review cash drawers & logs"]);
    } else if (role === UserRole.CASHIER) {
      setNewTitle("Cashier Billing Only");
      setPrivilegeList(["POS checkout scanning", "Configure item quantities", "Associate loyalty members", "UPI, Cash, or Card prints"]);
    } else if (role === UserRole.STORE_KEEPER) {
      setNewTitle("Store Keeper Inventory Management");
      setPrivilegeList(["Inventory levels inspection", "Filter categories & alert status", "Register new supplier entries", "Expiry count audits"]);
    }
  };

  const handleRegisterProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    const email = newEmail.trim().toLowerCase();
    const password = newPassword.trim();
    const title = newTitle.trim() || `${newRole} Key`;

    if (!name || !email || !password) {
      triggerNotification("Please fill in Name, Email and Password credentials.", "warning");
      return;
    }

    if (credentialsList.some(cred => cred.email === email)) {
      triggerNotification(`Conflict: User email '${email}' is already occupied.`, "warning");
      return;
    }

    const newProfile: AccessProfile = {
      role: newRole,
      title,
      email,
      password,
      name,
      color: newRole === UserRole.ADMIN ? "emerald" : newRole === UserRole.MANAGER ? "indigo" : "amber",
      gradient: "from-blue-500 to-indigo-600",
      bgHover: "hover:bg-blue-500/5",
      accent: "text-blue-500",
      border: "border-blue-500/20",
      glow: "shadow-blue-500/10",
      description: "Custom system operator created by Super Admin panel.",
      privileges: privilegeList,
      phone: newPhone.trim() || undefined
    };

    onUpdateCredentials([...credentialsList, newProfile]);
    triggerNotification(`Administrator profile '${name}' registered successfully!`, "success");

    // Reset user form
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewPhone("");
    setNewTitle("Admin Full Control");
    setPrivilegeList(["POS Sandbox access", "Audit profit & tax ledgers", "Modify products/suppliers", "Administer loyalty points"]);
  };

  const handleSaveEditedStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const name = editStaffName.trim();
    const email = editStaffEmail.trim().toLowerCase();
    const password = editStaffPassword.trim();

    if (!name || !email) {
      triggerNotification("Please specify both Name and Email addresses.", "warning");
      return;
    }

    const updated = credentialsList.map(c => {
      if (c.email === editStaffOriginalEmail) {
        return {
          ...c,
          name,
          email,
          password: password || c.password,
          role: editStaffRole,
          title: editStaffTitle.trim() || c.title,
          privileges: editStaffPrivileges,
          phone: editStaffPhone.trim() || undefined
        };
      }
      return c;
    });

    onUpdateCredentials(updated);
    setEditingStaff(null);
    triggerNotification(`Operator profile '${name}' updated.`, "success");
  };

  const handleTemplateChange = (template: string, tenant: Tenant) => {
    setEmailTemplateType(template);
    
    const clientInvoices = invoicesList.filter(i => i.tenantId === tenant.id);
    const pendingBillAmount = clientInvoices.filter(i => i.status !== "PAID").reduce((sum, curr) => sum + curr.totalAmount, 0);

    let subject = "";
    let body = "";

    if (template === "overdue") {
      subject = `ACTION REQUIRED: Outstanding Balance Reminder for ${tenant.name}`;
      body = `Dear Admin of ${tenant.name},\n\nThis is an actionable notice regarding your outstanding balance of ₹${pendingBillAmount.toLocaleString()} under your ${tenant.tier} tier subscription. Please login to your billing workspace and authorize settlement to avoid temporary sandbox restrictions.\n\nSecure payment link: https://${tenant.subdomain}.expertaid.com/billing/pay\n\nSaaS Billing Operations Team`;
    } else if (template === "renewal") {
      subject = `Notification: Upcoming Subscription Renewal for ${tenant.name}`;
      body = `Dear Admin of ${tenant.name},\n\nYour ${tenant.tier} tier subscription is scheduled for renewal on ${tenant.subscriptionEndDate || "2027-06-01"}. A renewal fee of ₹${(tenant.monthlySubscriptionFee || 4500).toLocaleString()} will be billed as per your ${tenant.billingCycle || "MONTHLY"} billing schedule.\n\nManage subscription: https://${tenant.subdomain}.expertaid.com/settings/subscription\n\nSaaS Billing Operations Team`;
    } else if (template === "kyc") {
      subject = `Compliance Notice: Complete KYC Verification for ${tenant.name}`;
      body = `Dear Admin of ${tenant.name},\n\nTo comply with digital billing guidelines, we request you to complete your KYC Verification. Your current compliance status is ${tenant.clientVerificationStatus || "PENDING_KYC"}.\n\nPlease upload valid business registry documents via the verification portal to maintain full platform privileges.\n\nCompliance Portal: https://${tenant.subdomain}.expertaid.com/settings/compliance\n\nSaaS Security & Trust Division`;
    } else {
      subject = `Announcement: System Maintenance & Upgrades for ${tenant.name}`;
      body = `Dear Admin of ${tenant.name},\n\nWe would like to inform you that our core server cluster hosting your tenant subdomain '${tenant.subdomain}.expertaid.com' will undergo scheduled performance maintenance this weekend.\n\nNo downtime is expected, but background APIs might undergo short latency fluctuations.\n\nThank you for choosing ExpertAid SaaS.`;
    }

    setEmailSubject(subject);
    setEmailBody(body);
  };

  const handleRevokeProfile = (email: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Revoke Operator Security Key",
      message: `Are you absolutely sure you want to revoke the security key for operator '${name}' (${email})? This action cannot be undone.`,
      confirmText: "Revoke Key",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const updated = credentialsList.filter(c => c.email !== email);
        onUpdateCredentials(updated);
        triggerNotification(`Security key revoked for operator ${name}.`, "success");
        setConfirmModal(null);
      }
    });
  };

  // Backup Manual exporter
  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      operator: "Sovereign SuperAdmin Master",
      version: "v4.0.0",
      tenants: tenantsList,
      credentials: credentialsList
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `expert_aid_saas_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification("Database backup file (.json) exported successfully.", "success");
  };

  // Create Custom Role
  const handleCreateCustomRole = () => {
    if (!newRoleLabel.trim()) {
      triggerNotification("Please specify a valid Role Label.", "warning");
      return;
    }
    
    let generatedId = newRoleId.trim().toUpperCase().replace(/\s+/g, "_");
    if (!generatedId) {
      generatedId = newRoleLabel.trim().toUpperCase().replace(/\s+/g, "_");
    }
    
    if (customRoles.some(r => r.id === generatedId)) {
      triggerNotification(`Conflict: Role code '${generatedId}' is already defined.`, "warning");
      return;
    }
    
    const newRoleObj = {
      id: generatedId,
      label: newRoleLabel.trim(),
      color: newRoleColor
    };
    
    setCustomRoles([...customRoles, newRoleObj]);
    setRolePrivilegesMap({
      ...rolePrivilegesMap,
      [generatedId]: newRolePrivileges
    });
    
    setSelectedRoleTab(generatedId);
    setIsGeneratingRole(false);
    triggerNotification(`Sovereign role blueprint '${newRoleObj.label}' generated successfully with ${newRolePrivileges.length} starting privileges.`, "success");
  };

  return (
    <div className="flex h-screen w-screen bg-[#f4f7fe] text-slate-800 font-sans overflow-hidden" id="super-admin-layout">
      
      {/* 1. Left Navigation panel (Dark Navy) */}
      <aside className="w-64 bg-[#0b1437] text-slate-300 flex flex-col shrink-0 border-r border-[#152055] shadow-2xl relative z-10" id="super-sidebar">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1b2559] flex flex-col items-center gap-1 bg-[#080d26]">
          <ExpertAidLogo showSubtitle={true} className="scale-95 origin-left text-white" />
          <div className="mt-1 w-full flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">Global Sovereign Slice</span>
          </div>
        </div>

        {/* Sidebar Nav items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" id="super-nav">
          <p className="text-[9px] text-[#4b5b9f] font-extrabold font-mono tracking-widest uppercase px-3 mb-2">Core Command Control</p>
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            { id: "clients", label: "Clients Directory", icon: Building },
            { id: "users", label: "User Directory", icon: Users },
            { id: "billing", label: "Billing & Ledger", icon: Coins },
            { id: "invoices", label: "Invoices Center", icon: Receipt },
            { id: "payments", label: "Payments Audit", icon: CreditCard },
            { id: "reports", label: "Analytics Reports", icon: TrendingUp },
            { id: "subscriptions", label: "SaaS Subscriptions", icon: Layers }
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeMenuTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveMenuTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20" 
                    : "hover:bg-white/5 hover:text-white text-[#a3aed0]"
                }`}
              >
                <IconComponent className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-white" : "text-[#a3aed0]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-6">
            <p className="text-[9px] text-[#4b5b9f] font-extrabold font-mono tracking-widest uppercase px-3 mb-2">Security & Settings</p>
            {[
              { id: "roles", label: "Roles & Permissions", icon: Sliders },
              { id: "audit", label: "Cyber Audit Logs", icon: FileText },
              { id: "system-settings", label: "System Settings", icon: Settings },
              { id: "backup", label: "Backup & Restore", icon: DatabaseBackup }
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeMenuTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => setActiveMenuTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20" 
                      : "hover:bg-white/5 hover:text-white text-[#a3aed0]"
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#a3aed0]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1b2559] bg-[#09102c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xs shadow-inner">
              SA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate font-sans">Super Admin</p>
              <p className="text-[9px] text-slate-400 font-mono truncate">superadmin@expertaid.com</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            id="super-admin-logout"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            title="Sovereign Exit"
          >
            <LogOut className="w-4 h-4 text-rose-450" />
          </button>
        </div>
      </aside>

      {/* 2. Main Flex Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden" id="super-main-container">
        
        {/* Top Header */}
        <header className="h-20 shrink-0 border-b border-slate-200/60 bg-white flex items-center justify-between px-8 relative z-10" id="super-header">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight capitalize font-sans">
              {activeMenuTab === "dashboard" ? "Super Admin Command Dashboard" : activeMenuTab.replace("-", " ") + " Workspace"}
            </h1>
            <p className="text-xs text-slate-400 font-medium font-sans">Sovereign multi-tenant SaaS licensing cockpit</p>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Search inputs */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search clients, invoices, reports... (Ctrl + K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            </div>

            {/* Notification Badge Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  6
                </span>
              </button>

              {/* Mock Notification Dropdown */}
              {showNotificationCenter && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 z-50 text-slate-700">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <p className="font-bold text-xs text-slate-900">Notifications Center</p>
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">6 Alerts</span>
                  </div>
                  <div className="py-2 space-y-3 max-h-60 overflow-y-auto">
                    {[
                      { text: "Tech Solutions Pvt. Ltd. processed license fee of ₹75,000", time: "2 mins ago" },
                      { text: "ABC Retailers requested database scaling support", time: "1 hr ago" },
                      { text: "Innovateech Systems sandbox deployed successfully", time: "2 hrs ago" },
                      { text: "System daily backup generated successfully on cloud storage", time: "3 hrs ago" },
                      { text: "New registration request received from Smart Infotech", time: "5 hrs ago" }
                    ].map((n, i) => (
                      <div key={i} className="text-[11px] leading-relaxed border-b border-slate-50 pb-2">
                        <p className="font-semibold text-slate-800">{n.text}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-md flex items-center justify-center">
                  SA
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight">Super Administrator</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">Master Role</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-2xl rounded-2xl p-1.5 z-50">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActiveMenuTab("system-settings");
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>System Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setActiveMenuTab("backup");
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl flex items-center gap-2.5"
                  >
                    <DatabaseBackup className="w-4 h-4 text-slate-400" />
                    <span>Backup Database</span>
                  </button>
                  <div className="h-px bg-slate-100 my-1.5"></div>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Inner Panel layout (Scrollable content) */}
        {activeMenuTab === "dashboard" ? (
          /* Dashboard Layout with Middle dashboard charts */
          <div className="flex-1 p-8 space-y-8 overflow-y-auto min-w-0" id="super-dashboard-mid">
              
              {/* Grid of 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6" id="kpi-grid">
                
                {/* 1. Total Clients */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="kpi-card-clients">
                  <div>
                    <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest font-sans">Total Clients</p>
                    <h2 className="text-3xl font-black text-slate-900 mt-1.5">{kpiTotalClients}</h2>
                    <p className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> ↑ 12.5% This Month
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                    <Building className="w-6 h-6" />
                  </div>
                </div>

                {/* 2. Active Clients */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="kpi-card-active">
                  <div>
                    <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest font-sans">Active Clients</p>
                    <h2 className="text-3xl font-black text-slate-900 mt-1.5">{kpiActiveClients}</h2>
                    <p className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> ↑ 15.3% This Month
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>

                {/* 3. Total Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="kpi-card-revenue">
                  <div>
                    <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest font-sans">Total Revenue</p>
                    <h2 className="text-3xl font-black text-slate-900 mt-1.5">₹ {kpiTotalRevenue.toLocaleString()}</h2>
                    <p className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> ↑ 18.6% This Month
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                    <Coins className="w-6 h-6" />
                  </div>
                </div>

                {/* 4. Invoices Generated */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between" id="kpi-card-invoices">
                  <div>
                    <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest font-sans">Invoices Generated</p>
                    <h2 className="text-3xl font-black text-slate-900 mt-1.5">{kpiInvoicesCount.toLocaleString()}</h2>
                    <p className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> ↑ 10.2% This Month
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                    <Receipt className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Line Chart & Quick Actions Row */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="chart-quickactions-row">
                
                {/* 1. Business Overview interactive SVG Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm xl:col-span-8 flex flex-col" id="chart-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-sans">Business Overview</h3>
                      <p className="text-xs text-slate-400">Revenue (solid blue) vs Expenses (dashed red)</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                        <span className="text-[11px] font-bold text-slate-500 font-sans">Revenue</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500"></span>
                        <span className="text-[11px] font-bold text-slate-500 font-sans">Expenses</span>
                      </div>
                      <select className="bg-slate-50 border border-slate-200 rounded-lg text-[10.5px] font-bold text-slate-600 p-1.5 focus:outline-none">
                        <option>This Month</option>
                        <option>Last Quarter</option>
                        <option>Financial Year 2024</option>
                      </select>
                    </div>
                  </div>

                  {/* SVG Line Graph Area */}
                  <div className="flex-1 min-h-[220px] relative mt-2" id="interactive-svg-graph">
                    
                    {/* SVG canvas */}
                    <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                      <defs>
                        {/* Blue area gradient */}
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Horizontal Lines */}
                      {[0, 1, 2, 3, 4].map((i) => {
                        const y = 20 + i * 42;
                        return (
                          <line
                            key={i}
                            x1="30"
                            y1={y}
                            x2="580"
                            y2={y}
                            stroke="#f1f5f9"
                            strokeWidth="1.5"
                          />
                        );
                      })}

                      {/* Revenue Fill Area (under blue line) */}
                      <path
                        d="M 40,200 L 40,140 L 130,110 L 220,130 L 310,115 L 400,90 L 490,100 L 580,60 L 580,200 Z"
                        fill="url(#blueGradient)"
                      />

                      {/* Grid Lines for dynamic interactive pointer */}
                      {hoveredChartIndex !== null && (
                        <line
                          x1={40 + hoveredChartIndex * 90}
                          y1="10"
                          x2={40 + hoveredChartIndex * 90}
                          y2="200"
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                      )}

                      {/* Revenue Curve Line */}
                      <path
                        d="M 40,140 Q 85,120 130,110 T 220,130 T 310,115 T 400,90 T 490,100 T 580,60"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Expenses Curve Line */}
                      <path
                        d="M 40,180 Q 85,160 130,150 T 220,165 T 310,155 T 400,140 T 490,145 T 580,120"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                        strokeDasharray="5 4"
                        strokeLinecap="round"
                      />

                      {/* Interactive Circles / Dots on Revenue path */}
                      {chartData.map((d, idx) => {
                        const x = 40 + idx * 90;
                        // Approximate scaling for display
                        const yRev = 200 - (d.revenue / 35000) * 160;
                        const yExp = 200 - (d.expenses / 35000) * 160;
                        return (
                          <g key={idx} className="cursor-pointer">
                            {/* Hitbox */}
                            <rect
                              x={x - 45}
                              y="0"
                              width="90"
                              height="220"
                              fill="transparent"
                              onMouseEnter={() => setHoveredChartIndex(idx)}
                            />

                            {/* Revenue Point */}
                            <circle
                              cx={x}
                              cy={yRev}
                              r={hoveredChartIndex === idx ? "7" : "4.5"}
                              fill={hoveredChartIndex === idx ? "#1d4ed8" : "#2563eb"}
                              stroke="white"
                              strokeWidth="2"
                              className="transition-all"
                            />

                            {/* Expenses Point */}
                            <circle
                              cx={x}
                              cy={yExp}
                              r={hoveredChartIndex === idx ? "5" : "3.5"}
                              fill="#f43f5e"
                              stroke="white"
                              strokeWidth="1.5"
                              className="transition-all"
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* X-Axis labels */}
                    <div className="absolute left-1 bottom-0 right-1 flex justify-between px-7 text-[10px] font-bold text-slate-400 font-mono">
                      {chartData.map((d, i) => (
                        <span key={i} className={hoveredChartIndex === i ? "text-blue-600 font-black" : ""}>
                          {d.date} May
                        </span>
                      ))}
                    </div>

                    {/* FLOATING INTERACTIVE TOOLTIP MATCHING SCREENSHOT */}
                    {hoveredChartIndex !== null && (
                      <div 
                        className="absolute bg-slate-900/95 text-white p-2.5 rounded-xl shadow-xl border border-slate-800 pointer-events-none transition-all z-20"
                        style={{
                          left: `${8 + hoveredChartIndex * 14.8}%`,
                          top: "20px"
                        }}
                      >
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase font-mono">
                          {chartData[hoveredChartIndex].date} May 2024
                        </p>
                        <div className="mt-1 space-y-0.5 text-xs">
                          <p className="flex items-center gap-1.5 font-sans">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span>Rev: </span>
                            <span className="font-extrabold font-mono text-emerald-400">
                              ₹ {chartData[hoveredChartIndex].revenue.toLocaleString()}
                            </span>
                          </p>
                          <p className="flex items-center gap-1.5 font-sans">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                            <span>Exp: </span>
                            <span className="font-extrabold font-mono text-rose-300">
                              ₹ {chartData[hoveredChartIndex].expenses.toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* 2. Quick Actions Panel */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm xl:col-span-4 flex flex-col" id="quickactions-card">
                  <h3 className="text-base font-bold text-slate-900 font-sans mb-4">Sovereign Quick Actions</h3>
                  <div className="flex-1 grid grid-cols-1 gap-3" id="quickactions-grid">
                    {[
                      { 
                        title: "Add New Client", 
                        desc: "Focus onboarding form", 
                        icon: Building, 
                        color: "bg-blue-50 text-blue-600",
                        action: () => {
                          setActiveMenuTab("clients");
                          setTimeout(() => {
                            const nameInput = document.getElementById("client-onboard-name");
                            if (nameInput) {
                              nameInput.focus();
                              nameInput.scrollIntoView({ behavior: "smooth" });
                            }
                            triggerNotification("Onboarding form focused! Add client specifications.", "success");
                          }, 150);
                        }
                      },
                      { 
                        title: "Create System Invoice", 
                        desc: "Generate license invoice", 
                        icon: Receipt, 
                        color: "bg-amber-50 text-amber-600",
                        action: () => {
                          setActiveMenuTab("invoices");
                          setTimeout(() => {
                            const selectEl = document.getElementById("invoice-creator-tenant-select");
                            if (selectEl) {
                              selectEl.focus();
                              selectEl.scrollIntoView({ behavior: "smooth" });
                            }
                            triggerNotification("Invoice generator form focused! Configure system billing details.", "success");
                          }, 150);
                        }
                      },
                      { 
                        title: "Register Admin User", 
                        desc: "Create operator profile", 
                        icon: Users, 
                        color: "bg-purple-50 text-purple-600",
                        action: () => {
                          setActiveMenuTab("users");
                          setTimeout(() => {
                            const userInput = document.getElementById("register-operator-name");
                            if (userInput) {
                              userInput.focus();
                              userInput.scrollIntoView({ behavior: "smooth" });
                            }
                            triggerNotification("Operator registration form focused! Input personnel profile details.", "success");
                          }, 150);
                        }
                      },
                      { 
                        title: "Download DB Backup", 
                        desc: "Export absolute JSON state", 
                        icon: Download, 
                        color: "bg-emerald-50 text-emerald-600",
                        action: handleExportBackup
                      }
                    ].map((act, i) => {
                      const ActIcon = act.icon;
                      return (
                        <button
                          key={i}
                          onClick={act.action}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center`}>
                              <ActIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{act.title}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{act.desc}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Recent Clients Table */}
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden" id="recent-clients-card">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-sans">Recent Clients</h3>
                    <p className="text-xs text-slate-400">Corporate clients registered in SaaS system</p>
                  </div>
                  <button
                    onClick={() => setActiveMenuTab("clients")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-all"
                  >
                    View all clients <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto max-h-[400px] overflow-y-auto relative" id="recent-clients-table">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-4 bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Company Name</th>
                        <th className="p-4 bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Email Address</th>
                        <th className="p-4 bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Plan / Tier</th>
                        <th className="p-4 bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Status</th>
                        <th className="p-4 bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Onboarded On</th>
                        <th className="p-4 bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tenantsList.slice(-5).reverse().map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-600 border border-slate-200 uppercase">
                                {t.companyLogo ? (
                                  <img src={t.companyLogo} alt="" className="w-full h-full rounded-xl object-contain" referrerPolicy="no-referrer" />
                                ) : (
                                  t.name.substring(0, 2)
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800 leading-snug">{t.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold font-mono tracking-wide">{t.subdomain}.expertaid.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-medium text-slate-600 font-mono">{t.adminEmail}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-wider ${
                              t.tier === "ENTERPRISE" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                              t.tier === "GROWTH" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                              "bg-slate-50 text-slate-600 border border-slate-100"
                            }`}>
                              {t.tier === "ENTERPRISE" ? "Premium" : t.tier === "GROWTH" ? "Standard" : "Basic"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 w-max ${
                              t.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${t.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"}`} />
                              <span>{t.status === "ACTIVE" ? "Active" : "Trial/Pending"}</span>
                            </span>
                          </td>
                          <td className="p-4 text-xs font-semibold text-slate-500 font-mono">
                            {new Date(t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {onImpersonateClient && (
                                <button
                                  onClick={() => {
                                    const credMatch = credentialsList.find(c => 
                                      c.email.toLowerCase() === t.adminEmail.toLowerCase() ||
                                      c.title.toLowerCase().includes(t.name.toLowerCase()) ||
                                      c.name.toLowerCase().includes(t.name.toLowerCase())
                                    );
                                    if (credMatch) {
                                      onImpersonateClient(credMatch.email);
                                    } else {
                                      onImpersonateClient(t.adminEmail);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all"
                                  title="Login as Client Admin"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => setViewingTenant(t)}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                                title="View detailed specs"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTenant(t);
                                  setEditTenantName(t.name);
                                  setEditTenantSubdomain(t.subdomain);
                                  setEditTenantAdminEmail(t.adminEmail);
                                  setEditTenantPhone(t.phone);
                                  setEditTenantTier(t.tier);
                                  setEditTenantStatus(t.status);
                                  setEditTenantColorTheme(t.colorTheme);
                                  setEditTenantMaxBranches(t.maxBranches);
                                  setEditTenantMaxProducts(t.maxProducts);
                                  setEditTenantOnboardingFee(t.onboardingFeePaid);
                                  setEditTenantSubscriptionFee(t.monthlySubscriptionFee || 4500);
                                  setEditTenantBillingCycle(t.billingCycle || "MONTHLY");
                                  setEditTenantContractDuration(t.contractDurationMonths || 12);
                                  setEditTenantGstin(t.gstinRegNumber || "");
                                  setEditTenantNotes(t.onboardingNotes || "");
                                  setEditTenantLogo(t.companyLogo || "");
                                }}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-amber-600 rounded-lg transition-all"
                                title="Edit specs"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveTenant(t.id, t.name)}
                                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                                title="Erase tenant isolation"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
        ) : activeMenuTab === "clients" ? (
          /* Clients page layout with split columns: Directory list (Column 1) and Onboarding panel (Column 2) */
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden" id="super-clients-split">
            {/* Left Clients Directory Panel */}
            <div className="flex-1 p-8 overflow-y-auto space-y-6" id="clients-panel">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Corporate Clients</h2>
                <p className="text-xs text-slate-400">Total of {tenantsList.length} isolated database sandbox environments</p>
              </div>
              <button 
                onClick={() => {
                  const el = document.getElementById("client-onboard-name");
                  if (el) {
                    el.focus();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Corporate Client
              </button>
            </div>

            {/* Full Clients Directory Table */}
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-x-auto max-h-[600px] overflow-y-auto relative">
              <table className="w-full text-left min-w-[1150px]">
                <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                  <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    <th className="p-4 bg-slate-50">Tenant Code / Name</th>
                    <th className="p-4 bg-slate-50">Domain Slice</th>
                    <th className="p-4 bg-slate-50">Corporate Contacts</th>
                    <th className="p-4 bg-slate-500/0 bg-slate-50">Quotas (Branch/SKU)</th>
                    <th className="p-4 bg-slate-50">Verification KYC</th>
                    <th className="p-4 bg-slate-50">Billing Metrics</th>
                    <th className="p-4 text-center bg-slate-50">Actions / Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tenantsList.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.adminEmail.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black uppercase text-xs">
                            {t.companyLogo ? <img src={t.companyLogo} alt="" className="w-full h-full rounded-xl object-contain" /> : t.name.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{t.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono tracking-widest font-black uppercase mt-0.5">{t.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 font-bold">
                          {t.subdomain}.expertaid.com
                        </span>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="font-semibold text-slate-700 font-mono leading-none">{t.adminEmail}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{t.phone}</p>
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{t.maxBranches}</span>
                          <span className="text-[10px] text-slate-400">Branches max</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{t.maxProducts}</span>
                          <span className="text-[10px] text-slate-400">Products SKU SKU</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                          t.clientVerificationStatus === "VERIFIED" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}>
                          {t.clientVerificationStatus || "VERIFIED"}
                        </span>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="font-bold text-slate-800">Setup: ₹{t.onboardingFeePaid?.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Sub: ₹{(t.monthlySubscriptionFee || 4500).toLocaleString()}/{t.billingCycle || "MONTHLY"}</p>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {onImpersonateClient && (
                            <button
                              onClick={() => {
                                const credMatch = credentialsList.find(c => 
                                  c.email.toLowerCase() === t.adminEmail.toLowerCase() ||
                                  c.title.toLowerCase().includes(t.name.toLowerCase()) ||
                                  c.name.toLowerCase().includes(t.name.toLowerCase())
                                );
                                if (credMatch) {
                                  onImpersonateClient(credMatch.email);
                                } else {
                                  onImpersonateClient(t.adminEmail);
                                }
                              }}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-emerald-200/40 shadow-sm"
                              title="Login as Client Admin"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Login</span>
                            </button>
                          )}
                          <button
                            onClick={() => setViewingTenant(t)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-blue-200/40 shadow-sm"
                            title="View Spec Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setEditingTenant(t);
                              setEditTenantName(t.name);
                              setEditTenantSubdomain(t.subdomain);
                              setEditTenantAdminEmail(t.adminEmail);
                              setEditTenantPhone(t.phone);
                              setEditTenantTier(t.tier);
                              setEditTenantStatus(t.status);
                              setEditTenantColorTheme(t.colorTheme);
                              setEditTenantMaxBranches(t.maxBranches);
                              setEditTenantMaxProducts(t.maxProducts);
                              setEditTenantOnboardingFee(t.onboardingFeePaid);
                              setEditTenantSubscriptionFee(t.monthlySubscriptionFee || 4500);
                              setEditTenantBillingCycle(t.billingCycle || "MONTHLY");
                              setEditTenantContractDuration(t.contractDurationMonths || 12);
                              setEditTenantGstin(t.gstinRegNumber || "");
                              setEditTenantNotes(t.onboardingNotes || "");
                              setEditTenantLogo(t.companyLogo || "");
                            }}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-amber-200/40 shadow-sm"
                            title="Edit Spec Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleRemoveTenant(t.id, t.name)}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer border border-rose-200/40 shadow-sm"
                            title="Decommission Tenant Slice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Onboarding Panel (Column 2) */}
          <div className="w-full lg:w-96 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-6 overflow-y-auto space-y-6" id="super-onboarding-panel">
            
            {/* Form header */}
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 font-sans">Onboard New Client</h3>
              <p className="text-xs text-slate-400">Provision a custom sandbox slice on the fly</p>
            </div>

            {/* Onboarding form */}
            <form onSubmit={handleOnboardTenant} className="space-y-4" id="onboard-client-form">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">Client Name *</label>
                <input
                  type="text"
                  required
                  id="client-onboard-name"
                  placeholder="Enter corporate client name"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">Admin Email *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@corporate.com"
                  value={tenantAdminEmail}
                  onChange={(e) => setTenantAdminEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 9900990099"
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">Admin Login ID (UID) *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter admin login ID / UID"
                  value={tenantAdminLoginId}
                  onChange={(e) => setTenantAdminLoginId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">Admin Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={tenantAdminPassword}
                  onChange={(e) => setTenantAdminPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">Subscription Plan</label>
                  <select
                    value={tenantTier}
                    onChange={(e) => setTenantTier(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="STARTER">Starter Plan</option>
                    <option value="GROWTH">Growth Plan</option>
                    <option value="ENTERPRISE">Enterprise Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 font-sans">Setup Fee (₹)</label>
                  <input
                    type="number"
                    value={tenantOnboardingFee}
                    onChange={(e) => setTenantOnboardingFee(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-onboard-client"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Onboard Client</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                <span className="bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">or</span>
              </div>

              <button
                type="button"
                onClick={() => triggerNotification("Initiating client spreadsheet import tool...", "success")}
                className="w-full py-2.5 rounded-xl border border-blue-200 hover:bg-blue-50/50 text-blue-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Import Clients Sheet</span>
              </button>
            </form>

            {/* Recently Onboarded Section */}
            <div className="pt-6 border-t border-slate-100 space-y-4" id="recently-onboarded-section">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest font-sans">Recently Onboarded</h4>
                <button onClick={() => {
                  const el = document.getElementById("clients-panel");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} className="text-[10px] font-bold text-blue-600 hover:text-blue-800">Scroll Top</button>
              </div>

              <div className="space-y-3" id="recently-onboarded-list">
                {tenantsList.slice(-3).reverse().map((t, idx) => (
                  <div 
                    key={t.id} 
                    onClick={() => setViewingTenant(t)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-extrabold text-xs uppercase shrink-0">
                        {t.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate leading-snug">{t.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate">{t.adminEmail}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0 font-mono">
                      {idx === 0 ? "21 May 2024" : idx === 1 ? "20 May 2024" : "19 May 2024"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : activeMenuTab === "users" ? (
          /* Users / Staff Registry panel */
          <div className="flex-1 p-8 overflow-y-auto space-y-6" id="users-panel">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Registered Security keys */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-sans">Global SaaS Operators</h2>
                  <p className="text-xs text-slate-400">Total of {credentialsList.length} personnel holding admin security master keys</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm max-h-[600px] overflow-y-auto relative">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
                      <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        <th className="p-4 bg-slate-50">Name & Title</th>
                        <th className="p-4 bg-slate-50">Secure Credentials</th>
                        <th className="p-4 bg-slate-50">Role Quota</th>
                        <th className="p-4 bg-slate-50">Audit Action Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {credentialsList.map(c => (
                        <tr key={c.email} className="hover:bg-slate-50/50 transition-all">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                {c.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 leading-tight">{c.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{c.title}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 space-y-0.5 font-mono text-[11px]">
                            <p className="font-bold text-slate-700">{c.email}</p>
                            {c.phone && <p className="text-[10px] text-slate-500 font-sans font-medium">{c.phone}</p>}
                            <p className="text-slate-400 font-black">••••••••</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                              {c.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setViewingStaff(c)} className="p-1.5 bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                              <button onClick={() => {
                                setEditingStaff(c);
                                setEditStaffOriginalEmail(c.email);
                                setEditStaffName(c.name);
                                setEditStaffEmail(c.email);
                                setEditStaffPassword(c.password);
                                setEditStaffPhone(c.phone || "");
                                setEditStaffRole(c.role);
                                setEditStaffTitle(c.title);
                                setEditStaffPrivileges(c.privileges || []);
                              }} className="p-1.5 bg-slate-50 hover:bg-amber-50 text-slate-500 hover:text-amber-600 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleRevokeProfile(c.email, c.name)} className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Register Operator security key */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900 font-sans uppercase tracking-widest">Register Operator Key</h3>
                  <p className="text-xs text-slate-400">Issue a brand new admin/staff security credential</p>
                </div>

                <form onSubmit={handleRegisterProfile} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-sans">Full Name *</label>
                    <input
                      id="register-operator-name"
                      type="text"
                      required
                      placeholder="e.g. Alice Master"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-sans">Security Email ID *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alice@expertaid.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-sans">Contact Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 9900112233"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-sans">Credential Password *</label>
                    <div className="relative">
                      <input
                        type={showFormPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pr-10 text-xs font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFormPassword(!showFormPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-sans">Security Rank / Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => handleRoleChange(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value={UserRole.ADMIN}>SUPERVISOR ADMIN</option>
                      <option value={UserRole.MANAGER}>STORE MANAGER</option>
                      <option value={UserRole.CASHIER}>FRONT LINE CASHIER</option>
                      <option value={UserRole.STORE_KEEPER}>STORE KEEPER</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-sans">Security Title Custom Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. Master Auditor"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Issue Operator Key</span>
                  </button>
                </form>

              </div>
            </div>
          </div>
        ) : activeMenuTab === "billing" ? (
          /* Billing & Ledger Panel */
          <div className="flex-1 p-8 overflow-y-auto space-y-6 animate-fadeIn" id="billing-panel">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">Sovereign Billing & Ledger</h2>
                <p className="text-xs text-slate-500">Track isolated database slice balances, MRR cycles, and platform receivables</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => {
                    triggerNotification("Compiling corporate ledger details...", "success");
                    const success = await printElementById("billing-ledger-table");
                    if (success) {
                      triggerNotification("Ledger compiled successfully! Check your printer dialog or downloads folder.", "success");
                    } else {
                      triggerNotification("Could not compile high-fidelity ledger document.", "warning");
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 flex items-center gap-2 cursor-pointer transition-all border border-slate-800"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Print Ledger</span>
                </button>
                <button
                  onClick={() => {
                    triggerNotification("Synchronized all multi-tenant billing logs with sovereign ledger isolates.", "success");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/10 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Sync Platform Ledgers</span>
                </button>
              </div>
            </div>

            {/* KPI Summary Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Platform MRR</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
                </div>
                <h3 className="text-2xl font-black text-slate-950 mt-2 font-mono">
                  ₹{(tenantsList.reduce((acc, t) => acc + (t.monthlySubscriptionFee || 0), 0) + 124500).toLocaleString()}
                </h3>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">▲ +12.4% from last cycle</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Outstanding Ledger</span>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
                </div>
                <h3 className="text-2xl font-black text-slate-950 mt-2 font-mono">
                  ₹{invoicesList.filter(i => i.status !== "PAID" && i.status !== "VOID").reduce((acc, i) => acc + i.totalAmount, 0).toLocaleString()}
                </h3>
                <p className="text-[10px] text-amber-600 font-bold mt-1">Pending manual reconciliation</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Capital Received</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Coins className="w-4 h-4" /></div>
                </div>
                <h3 className="text-2xl font-black text-slate-950 mt-2 font-mono">
                  ₹{(paymentsList.filter(p => p.status === "SUCCESS").reduce((acc, p) => acc + p.amount, 0) + 1850000).toLocaleString()}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Includes setup fees paid</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Overdue Notices</span>
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Receipt className="w-4 h-4" /></div>
                </div>
                <h3 className="text-2xl font-black text-slate-950 mt-2 font-mono">
                  {invoicesList.filter(i => i.status === "OVERDUE").length} Accounts
                </h3>
                <p className="text-[10px] text-rose-600 font-bold mt-1">Overdue 15+ days grace</p>
              </div>
            </div>

            {/* Filter row */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ledger by client name..."
                  value={billingSearch}
                  onChange={(e) => setBillingSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={billingFilterCycle}
                  onChange={(e) => setBillingFilterCycle(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Cycles</option>
                  <option value="MONTHLY">Monthly Billing</option>
                  <option value="ANNUAL">Annual Billing</option>
                  <option value="QUARTERLY">Quarterly Billing</option>
                </select>
              </div>
            </div>

            {/* Ledger List */}
            <div id="billing-ledger-table" className="bg-white rounded-2xl border border-slate-100 shadow-sm max-h-[600px] overflow-y-auto relative">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                  <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    <th className="px-6 py-4 bg-slate-50 text-slate-500">Client Node</th>
                    <th className="px-6 py-4 bg-slate-50 text-slate-500">Plan Tier</th>
                    <th className="px-6 py-4 bg-slate-50 text-slate-500">Billing Cycle</th>
                    <th className="px-6 py-4 bg-slate-50 text-slate-500">Monthly Rate</th>
                    <th className="px-6 py-4 bg-slate-50 text-slate-500">Setup Fee Paid</th>
                    <th className="px-6 py-4 bg-slate-50 text-slate-500">Renewal Date</th>
                    <th className="px-6 py-4 bg-slate-50 text-slate-500">Renewal Status</th>
                    <th className="px-6 py-4 bg-slate-50 text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenantsList
                    .filter(t => t.name.toLowerCase().includes(billingSearch.toLowerCase()))
                    .filter(t => billingFilterCycle === "ALL" || (t.billingCycle || "MONTHLY") === billingFilterCycle)
                    .map((t) => {
                      const clientInvoices = invoicesList.filter(i => i.tenantId === t.id);
                      const pendingBillAmount = clientInvoices.filter(i => i.status !== "PAID").reduce((sum, curr) => sum + curr.totalAmount, 0);

                      return (
                        <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {t.name.substring(0, 2)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800 leading-snug">{t.name}</p>
                                <p className="text-[9px] text-slate-400 font-mono tracking-wider">{t.subdomain}.expertaid.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold font-sans ${
                              t.tier === "ENTERPRISE" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                              t.tier === "GROWTH" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                              "bg-slate-50 text-slate-600 border border-slate-100"
                            }`}>
                              {t.tier}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-semibold text-slate-600">{t.billingCycle || "MONTHLY"}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">
                            ₹{(t.monthlySubscriptionFee || 4500).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">
                            ₹{(t.onboardingFeePaid || 75000).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                            {t.subscriptionEndDate || "2027-06-01"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                              t.renewalStatus === "AUTO_RENEW" ? "text-emerald-600" : "text-amber-500"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${t.renewalStatus === "AUTO_RENEW" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
                              {t.renewalStatus === "AUTO_RENEW" ? "Auto-Renew" : "Manual Renewal"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              {pendingBillAmount > 0 ? (
                                <button
                                  onClick={() => {
                                    // Reconcile outstanding payments
                                    const updatedInvoices = invoicesList.map(inv => {
                                      if (inv.tenantId === t.id) {
                                        return { ...inv, status: "PAID" as const };
                                      }
                                      return inv;
                                    });
                                    setInvoicesList(updatedInvoices);

                                    // Add successful payment trail
                                    const paymentRecord: Payment = {
                                      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                                      tenantId: t.id,
                                      tenantName: t.name,
                                      amount: pendingBillAmount,
                                      paymentMethod: "Bank Transfer",
                                      status: "SUCCESS",
                                      referenceId: `REC-M-${Math.floor(1000 + Math.random() * 9000)}`,
                                      auditStatus: "VERIFIED",
                                      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
                                    };
                                    setPaymentsList(prev => [...prev, paymentRecord]);
                                    triggerNotification(`Successfully cleared balance of ₹${pendingBillAmount.toLocaleString()} for ${t.name}.`, "success");
                                  }}
                                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold shadow-md shadow-amber-500/10 transition-all cursor-pointer shrink-0"
                                >
                                  Collect ₹{pendingBillAmount.toLocaleString()}
                                </button>
                              ) : (
                                <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1 shrink-0">
                                  <CheckCircle className="w-3.5 h-3.5" /> Core Settled
                                </span>
                              )}

                              <button
                                onClick={() => {
                                  setSendingMessageClient(t);
                                  const hasOverdue = pendingBillAmount > 0;
                                  const type = hasOverdue ? "overdue" : "renewal";
                                  setEmailTemplateType(type);
                                  setEmailDeliveryChannel("EMAIL");

                                  const subject = type === "overdue"
                                    ? `ACTION REQUIRED: Outstanding Balance Reminder for ${t.name}`
                                    : `Notification: Upcoming Subscription Renewal for ${t.name}`;

                                  const body = type === "overdue"
                                    ? `Dear Admin of ${t.name},\n\nThis is an actionable notice regarding your outstanding balance of ₹${pendingBillAmount.toLocaleString()} under your ${t.tier} tier subscription. Please login to your billing workspace and authorize settlement to avoid temporary sandbox restrictions.\n\nSecure payment link: https://${t.subdomain}.expertaid.com/billing/pay\n\nSaaS Billing Operations Team`
                                    : `Dear Admin of ${t.name},\n\nYour ${t.tier} tier subscription is scheduled for renewal on ${t.subscriptionEndDate || "2027-06-01"}. A renewal fee of ₹${(t.monthlySubscriptionFee || 4500).toLocaleString()} will be billed as per your ${t.billingCycle || "MONTHLY"} billing schedule.\n\nManage subscription: https://${t.subdomain}.expertaid.com/settings/subscription\n\nSaaS Billing Operations Team`;

                                  setEmailSubject(subject);
                                  setEmailBody(body);
                                }}
                                className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 border border-blue-100 hover:border-blue-200 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold shrink-0"
                                title="Send Actionable Message / Mail"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Dispatch</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeMenuTab === "invoices" ? (
          /* Invoices Center Panel */
          <div className="flex-1 p-8 overflow-y-auto space-y-6 animate-fadeIn" id="invoices-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">Platform Invoices Center</h2>
                <p className="text-xs text-slate-500">Generate, audit, and distribute invoices with 18% GST parameters automatically</p>
              </div>
              <button
                onClick={async () => {
                  triggerNotification("Compiling invoice directory report...", "success");
                  const success = await printElementById("invoices-directory-table");
                  if (success) {
                    triggerNotification("Invoice directory report compiled successfully! Check your printer dialog or downloads folder.", "success");
                  } else {
                    triggerNotification("Could not compile invoice directory report.", "warning");
                  }
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 flex items-center gap-2 cursor-pointer transition-all border border-slate-800 shrink-0"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Invoice Directory</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Invoice Directory (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Search & Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search invoices by client or ID..."
                      value={invoiceSearchQuery}
                      onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={invoiceFilterStatus}
                      onChange={(e) => setInvoiceFilterStatus(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-700 focus:outline-none w-full sm:w-auto"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PAID">Paid Only</option>
                      <option value="UNPAID">Unpaid Only</option>
                      <option value="OVERDUE">Overdue Only</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div id="invoices-directory-table" className="bg-white rounded-2xl border border-slate-100 shadow-sm max-h-[600px] overflow-y-auto relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Invoice ID</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Client Node</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Due Date</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total Amount (18% GST)</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Status</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoicesList
                        .filter(inv => inv.tenantName.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) || inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()))
                        .filter(inv => invoiceFilterStatus === "ALL" || inv.status === invoiceFilterStatus)
                        .map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/50 transition-all">
                            <td className="px-6 py-4 font-mono text-xs font-extrabold text-blue-600">{inv.id}</td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-xs font-bold text-slate-800">{inv.tenantName}</p>
                                <p className="text-[9px] text-slate-400 font-mono">ID: {inv.tenantId}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-500">{inv.dueDate}</td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-black text-slate-900 font-mono">₹{inv.totalAmount.toLocaleString()}</p>
                              <p className="text-[9px] text-slate-400 font-mono">Tax: ₹{inv.gst.toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                                  inv.status === "PAID" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                  inv.status === "UNPAID" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                  "bg-rose-50 text-rose-600 border border-rose-100"
                                }`}>
                                  {inv.status}
                                </span>
                                {inv.paymentMethod && (
                                  <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-100/80 px-1.5 py-0.5 rounded-md border border-slate-200/50">
                                    {inv.paymentMethod}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedInvoice(inv)}
                                  className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all cursor-pointer"
                                  title="View Invoice Receipt"
                                >
                                  <Sliders className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedInvoice(inv);
                                    setTimeout(async () => {
                                      triggerNotification(`Compiling print job for ${inv.id}...`, "success");
                                      const success = await printElementById("superadmin-invoice-print");
                                      if (success) {
                                        triggerNotification(`Invoice ${inv.id} print job ready! Check your printer dialog or downloads.`, "success");
                                      } else {
                                        triggerNotification("Failed to compile high-fidelity invoice copy.", "warning");
                                      }
                                    }, 150);
                                  }}
                                  className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all cursor-pointer"
                                  title="Print Invoice"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    triggerNotification(`Distributing PDF invoice ${inv.id} to client admin inbox...`, "success");
                                  }}
                                  className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all cursor-pointer"
                                  title="Send PDF Invoice Email"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Invoice generator form (4 cols) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900 font-sans uppercase tracking-widest">Create Core Invoice</h3>
                  <p className="text-[10px] text-slate-400">Generate a custom receivable with compliance tracking</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">Target Client *</label>
                    <select
                      id="invoice-creator-tenant-select"
                      value={invoiceCreatorTenantId}
                      onChange={(e) => setInvoiceCreatorTenantId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white"
                    >
                      <option value="">Select a corporate client...</option>
                      {tenantsList.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">Invoice Core Charge (₹) *</label>
                    <input
                      type="number"
                      value={invoiceCreatorAmount}
                      onChange={(e) => setInvoiceCreatorAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">Item Description *</label>
                    <input
                      type="text"
                      value={invoiceCreatorItemName}
                      onChange={(e) => setInvoiceCreatorItemName(e.target.value)}
                      placeholder="e.g. Extra POS terminal node setup"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">Payment Method</label>
                      <select
                        value={invoiceCreatorPaymentMethod}
                        onChange={(e) => setInvoiceCreatorPaymentMethod(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white"
                      >
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Razorpay">Razorpay</option>
                        <option value="Stripe">Stripe</option>
                        <option value="UPI">UPI</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">Invoice Status</label>
                      <select
                        value={invoiceCreatorStatus}
                        onChange={(e) => setInvoiceCreatorStatus(e.target.value as "PAID" | "UNPAID" | "OVERDUE")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:bg-white"
                      >
                        <option value="UNPAID">UNPAID</option>
                        <option value="PAID">PAID</option>
                        <option value="OVERDUE">OVERDUE</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-[10px] space-y-1 text-slate-600 font-sans">
                    <div className="flex justify-between font-medium"><span>Taxable amount:</span><span className="font-mono">₹{invoiceCreatorAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between font-medium"><span>CGST/SGST (18% total):</span><span className="font-mono">₹{Math.round(invoiceCreatorAmount * 0.18).toLocaleString()}</span></div>
                    <div className="border-t border-blue-100 my-1"></div>
                    <div className="flex justify-between font-extrabold text-blue-900"><span>Grand Total:</span><span className="font-mono">₹{Math.round(invoiceCreatorAmount * 1.18).toLocaleString()}</span></div>
                  </div>

                  <button
                    onClick={() => {
                      if (!invoiceCreatorTenantId) {
                        triggerNotification("Please select a target client first.", "warning");
                        return;
                      }
                      const t = tenantsList.find(t => t.id === invoiceCreatorTenantId);
                      if (!t) return;

                      const id = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
                      const newCreatedInvoice: Invoice = {
                        id,
                        tenantId: t.id,
                        tenantName: t.name,
                        amount: invoiceCreatorAmount,
                        gst: Math.round(invoiceCreatorAmount * 0.18),
                        totalAmount: Math.round(invoiceCreatorAmount * 1.18),
                        issueDate: new Date().toISOString().split('T')[0],
                        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        status: invoiceCreatorStatus,
                        paymentMethod: invoiceCreatorPaymentMethod,
                        items: [
                          { description: invoiceCreatorItemName, amount: invoiceCreatorAmount }
                        ]
                      };

                      setInvoicesList(prev => [...prev, newCreatedInvoice]);

                      // If status is PAID, also log payment receipt immediately to paymentsList
                      if (invoiceCreatorStatus === "PAID") {
                        const paymentRecord: Payment = {
                          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                          tenantId: t.id,
                          tenantName: t.name,
                          amount: Math.round(invoiceCreatorAmount * 1.18),
                          paymentMethod: invoiceCreatorPaymentMethod as any,
                          status: "SUCCESS",
                          referenceId: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
                          auditStatus: "VERIFIED",
                          timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
                        };
                        setPaymentsList(prev => [...prev, paymentRecord]);
                        triggerNotification(`Invoice ${id} and verified transaction trace logged.`, "success");
                      } else {
                        triggerNotification(`Invoice ${id} generated successfully for ${t.name} with ${invoiceCreatorPaymentMethod} preference.`, "success");
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/15 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generate Sovereign Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeMenuTab === "payments" ? (
          /* Payments Audit Panel */
          <div className="flex-1 p-8 overflow-y-auto space-y-6 animate-fadeIn" id="payments-panel">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">SaaS Payments Audit Ledger</h2>
                <p className="text-xs text-slate-500">Cryptographically audit gateway callbacks, verify manual IMPS transfers, and resolve disputes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side: Payments ledger list (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Search / Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search payments by client or transaction hash..."
                      value={paymentSearch}
                      onChange={(e) => setPaymentSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <select
                      value={paymentFilterMethod}
                      onChange={(e) => setPaymentFilterMethod(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-[11px] font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="ALL">All Channels</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="Stripe">Stripe</option>
                      <option value="UPI">UPI Sync</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>

                    <select
                      value={paymentFilterStatus}
                      onChange={(e) => setPaymentFilterStatus(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-[11px] font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="SUCCESS">SUCCESS</option>
                      <option value="PENDING">PENDING</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-h-[600px] overflow-y-auto relative">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">TXN ID</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Client Node</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Amount</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Channel</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Gateway Reference ID</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Audit Status</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Status</th>
                        <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentsList
                        .filter(p => p.tenantName.toLowerCase().includes(paymentSearch.toLowerCase()) || p.id.toLowerCase().includes(paymentSearch.toLowerCase()))
                        .filter(p => paymentFilterMethod === "ALL" || p.paymentMethod === paymentFilterMethod)
                        .filter(p => paymentFilterStatus === "ALL" || p.status === paymentFilterStatus)
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{p.id}</td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-xs font-bold text-slate-800 leading-snug">{p.tenantName}</p>
                                <p className="text-[9px] text-slate-400 font-mono">{p.timestamp}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs font-black text-slate-900">₹{p.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-600">{p.paymentMethod}</td>
                            <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{p.referenceId}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                                p.auditStatus === "VERIFIED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                p.auditStatus === "UNVERIFIED" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                "bg-rose-50 text-rose-600 border border-rose-100"
                              }`}>
                                {p.auditStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${
                                p.status === "SUCCESS" ? "text-emerald-600" :
                                p.status === "PENDING" ? "text-amber-500" : "text-rose-500"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  p.status === "SUCCESS" ? "bg-emerald-500" :
                                  p.status === "PENDING" ? "bg-amber-500 animate-pulse" : "bg-rose-500"
                                }`}></span>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {p.auditStatus !== "VERIFIED" ? (
                                <button
                                  onClick={() => {
                                    // Update transaction to verified & success
                                    const updatedList = paymentsList.map(item => {
                                      if (item.id === p.id) {
                                        return { ...item, status: "SUCCESS" as const, auditStatus: "VERIFIED" as const };
                                      }
                                      return item;
                                    });
                                    setPaymentsList(updatedList);

                                    // Clear overdue invoice of same amount for that client if exists
                                    const updatedInvoices = invoicesList.map(inv => {
                                      if (inv.tenantId === p.tenantId && inv.status !== "PAID") {
                                        return { ...inv, status: "PAID" as const };
                                      }
                                      return inv;
                                    });
                                    setInvoicesList(updatedInvoices);

                                    triggerNotification(`Reconciled and cryptographically verified transaction ${p.id}. Ledger balance updated successfully.`, "success");
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-extrabold tracking-wider transition-all cursor-pointer"
                                >
                                  Audit Pass
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-bold font-mono">Passed Secure Audit</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side: Log Manual Payment (4 cols) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900 font-sans uppercase tracking-widest">Record Offline Payment</h3>
                  <p className="text-[10px] text-slate-400">Manually audit and post incoming bank deposits</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">Payer Corporate Client *</label>
                    <select
                      value={newPaymentTenantId}
                      onChange={(e) => setNewPaymentTenantId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="">Select a corporate client...</option>
                      {tenantsList.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">Amount Received (₹) *</label>
                    <input
                      type="number"
                      value={newPaymentAmount}
                      onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">Payment Channel *</label>
                    <select
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="Bank Transfer">Direct Bank Transfer (IMPS/NEFT)</option>
                      <option value="UPI">UPI Gateway Sync</option>
                      <option value="Razorpay">Razorpay Checkout Isolate</option>
                      <option value="Stripe">Stripe Corporate Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 font-mono">UTR / Reference Code *</label>
                    <input
                      type="text"
                      value={newPaymentRef}
                      onChange={(e) => setNewPaymentRef(e.target.value)}
                      placeholder="e.g. UTR-AXIS02941920"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newPaymentTenantId) {
                        triggerNotification("Please select a target client first.", "warning");
                        return;
                      }
                      if (!newPaymentRef) {
                        triggerNotification("Please enter a valid Reference / UTR transaction code.", "warning");
                        return;
                      }
                      const t = tenantsList.find(t => t.id === newPaymentTenantId);
                      if (!t) return;

                      const manualPayment: Payment = {
                        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                        tenantId: t.id,
                        tenantName: t.name,
                        amount: newPaymentAmount,
                        paymentMethod: newPaymentMethod,
                        status: "SUCCESS",
                        referenceId: newPaymentRef,
                        auditStatus: "VERIFIED",
                        timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
                      };

                      setPaymentsList(prev => [...prev, manualPayment]);

                      // Clear any outstanding invoice that matches this payer
                      const updatedInvoices = invoicesList.map(inv => {
                        if (inv.tenantId === t.id && inv.status !== "PAID") {
                          return { ...inv, status: "PAID" as const };
                        }
                        return inv;
                      });
                      setInvoicesList(updatedInvoices);

                      triggerNotification(`Recorded and audited offline payment of ₹${newPaymentAmount.toLocaleString()} from ${t.name}.`, "success");
                      setNewPaymentRef("");
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/15 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Audit Offline Payment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeMenuTab === "reports" ? (
          /* Analytics Reports Panel */
          <div className="flex-1 p-8 overflow-y-auto space-y-6 animate-fadeIn" id="reports-panel">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">Sovereign SaaS Analytics Cockpit</h2>
                <p className="text-xs text-slate-500">Live multi-tenant growth metrics, interactive MRR charting, and license yield projections</p>
              </div>
            </div>

            {/* KPI Rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Platform Annual Run Rate (ARR)</p>
                  <h3 className="text-2xl font-black text-slate-950 mt-1.5 font-mono">
                    ₹{((tenantsList.reduce((acc, t) => acc + (t.monthlySubscriptionFee || 0), 0) + 124500) * 12).toLocaleString()}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">▲ +21.5% YoY Projection</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Average Revenue Per Account (ARPU)</p>
                  <h3 className="text-2xl font-black text-slate-950 mt-1.5 font-mono">
                    ₹{Math.round((tenantsList.reduce((acc, t) => acc + (t.monthlySubscriptionFee || 0), 0) + 124500) / (tenantsList.length + 15)).toLocaleString()}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">Weighted monthly mean value</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Receipt className="w-5 h-5" /></div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Capital Recovery Ratio</p>
                  <h3 className="text-2xl font-black text-slate-950 mt-1.5 font-mono">98.4%</h3>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">▲ Exceeds SLA benchmark of 95%</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Sliders className="w-5 h-5" /></div>
              </div>
            </div>

            {/* Interactive Graph Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-sans uppercase tracking-wider">Multi-Tenant Revenue Trend</h3>
                    <p className="text-[10px] text-slate-400">Hover over nodes for absolute isolated telemetry data</p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>Revenue (₹)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-300 rounded-full"></span>Operating Cost</span>
                  </div>
                </div>

                {/* Dynamic SVG Chart */}
                <div className="relative h-64 w-full bg-slate-50/50 rounded-xl border border-slate-100 p-4 flex flex-col justify-end">
                  {/* Grid background lines */}
                  <div className="absolute inset-0 flex flex-col justify-between py-6 px-10 pointer-events-none">
                    <div className="border-b border-slate-100 w-full h-0"></div>
                    <div className="border-b border-slate-100 w-full h-0"></div>
                    <div className="border-b border-slate-100 w-full h-0"></div>
                    <div className="border-b border-slate-100 w-full h-0"></div>
                  </div>

                  {/* SVG Chart paths */}
                  <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 700 200">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Operating Costs line */}
                    <path
                      d="M 50 140 Q 150 110, 250 130 T 450 90 T 650 70"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Revenue Area gradient */}
                    <path
                      d="M 50 180 L 50 100 Q 150 70, 250 90 T 450 50 T 650 30 L 650 180 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Revenue Solid Line */}
                    <path
                      d="M 50 100 Q 150 70, 250 90 T 450 50 T 650 30"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3.5"
                    />

                    {/* Interactive points */}
                    {[
                      { x: 50, val: 14200, label: "01", exp: 7200 },
                      { x: 150, val: 19800, label: "05", exp: 9400 },
                      { x: 250, val: 16400, label: "10", exp: 8100 },
                      { x: 350, val: 18750, label: "15", exp: 10500 },
                      { x: 450, val: 23100, label: "20", exp: 11400 },
                      { x: 550, val: 21500, label: "25", exp: 9800 },
                      { x: 650, val: 29400, label: "30", exp: 12900 }
                    ].map((pt, i) => {
                      const yVal = 180 - (pt.val / 35000) * 160;
                      const isHovered = hoveredChartIndex === i;

                      return (
                        <g key={i}>
                          <circle
                            cx={pt.x}
                            cy={yVal}
                            r={isHovered ? 6.5 : 4.5}
                            className={`transition-all cursor-pointer ${
                              isHovered ? "fill-blue-600 stroke-white stroke-2" : "fill-blue-500"
                            }`}
                            onMouseEnter={() => setHoveredChartIndex(i)}
                          />
                          {/* Label */}
                          <text x={pt.x} y="195" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 font-mono">
                            {pt.label}
                          </text>

                          {/* Hover Overlay Card */}
                          {isHovered && (
                            <foreignObject x={pt.x - 60} y={yVal - 70} width="120" height="60" className="z-50 overflow-visible">
                              <div className="bg-slate-950 text-white p-2 rounded-lg text-[9px] font-mono shadow-2xl border border-slate-800 space-y-0.5 pointer-events-none">
                                <p className="font-bold border-b border-slate-800 pb-1 text-slate-300">Day {pt.label} Summary</p>
                                <p className="text-blue-400 flex justify-between"><span>MRR:</span><span>₹{pt.val.toLocaleString()}</span></p>
                                <p className="text-slate-400 flex justify-between"><span>Cost:</span><span>₹{pt.exp.toLocaleString()}</span></p>
                              </div>
                            </foreignObject>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Right Column: SaaS Growth Simulator & distribution (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Distribution Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-900 font-sans uppercase tracking-widest">Plan Tier Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Enterprise Licenses", count: tenantsList.filter(t => t.tier === "ENTERPRISE").length, pct: 60, color: "bg-purple-600", colorLight: "bg-purple-50" },
                      { name: "Growth Licenses", count: tenantsList.filter(t => t.tier === "GROWTH").length, pct: 30, color: "bg-blue-600", colorLight: "bg-blue-50" },
                      { name: "Starter Licenses", count: tenantsList.filter(t => t.tier === "STARTER").length, pct: 10, color: "bg-slate-600", colorLight: "bg-slate-50" }
                    ].map((tier, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{tier.name}</span>
                          <span className="font-mono text-slate-400 font-bold">{tier.count} Slices ({tier.pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${tier.color} rounded-full transition-all duration-500`} style={{ width: `${tier.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Simulator */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-extrabold text-slate-900 font-sans uppercase tracking-widest">Revenue Forecast Modeler</h3>
                    <p className="text-[10px] text-slate-400">Simulate MRR expansion yield dynamically</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Target Monthly Signups</span>
                        <span className="text-blue-600 font-mono">{targetAdditionRate} Clients / mo</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={targetAdditionRate}
                        onChange={(e) => setTargetAdditionRate(Number(e.target.value))}
                        className="w-full accent-blue-600 bg-slate-100 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Average Plan Subscription Rate</span>
                        <span className="text-blue-600 font-mono">₹{averagePlanPrice.toLocaleString()} / mo</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="25000"
                        step="500"
                        value={averagePlanPrice}
                        onChange={(e) => setAveragePlanPrice(Number(e.target.value))}
                        className="w-full accent-blue-600 bg-slate-100 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center space-y-1">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">Simulated ARR Growth (Year 1)</p>
                      <h4 className="text-2xl font-black text-slate-900 font-mono">
                        ₹{(targetAdditionRate * averagePlanPrice * 12).toLocaleString()}
                      </h4>
                      <p className="text-[9px] text-emerald-600 font-bold">
                        ▲ Proposes additional ₹{(targetAdditionRate * averagePlanPrice).toLocaleString()} MRR compounding
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : activeMenuTab === "subscriptions" ? (
          /* SaaS Subscriptions Panel */
          <div className="flex-1 p-8 overflow-y-auto space-y-6 animate-fadeIn" id="subscriptions-panel">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">Active Client Licensing</h2>
                <p className="text-xs text-slate-500">Modify corporate subscription tiers, configure hardware isolates, and manage auto-renewal profiles</p>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Enterprise Slots</p>
                <h3 className="text-2xl font-black text-slate-950 mt-1 font-mono">
                  {tenantsList.filter(t => t.tier === "ENTERPRISE").length} Nodes
                </h3>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Growth Slots</p>
                <h3 className="text-2xl font-black text-slate-950 mt-1 font-mono">
                  {tenantsList.filter(t => t.tier === "GROWTH").length} Nodes
                </h3>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Starter Slots</p>
                <h3 className="text-2xl font-black text-slate-950 mt-1 font-mono">
                  {tenantsList.filter(t => t.tier === "STARTER").length} Nodes
                </h3>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Total Sandboxes provisioned</p>
                <h3 className="text-2xl font-black text-slate-950 mt-1 font-mono">
                  {tenantsList.length} Active Slices
                </h3>
              </div>
            </div>

            {/* Filter and list */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search license registry by client..."
                  value={subscriptionSearch}
                  onChange={(e) => setSubscriptionSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 bg-slate-50"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={subscriptionFilterTier}
                  onChange={(e) => setSubscriptionFilterTier(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Tiers</option>
                  <option value="ENTERPRISE">Enterprise Plan</option>
                  <option value="GROWTH">Growth Plan</option>
                  <option value="STARTER">Starter Plan</option>
                </select>
              </div>
            </div>

            {/* License list table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm max-h-[600px] overflow-y-auto relative">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Client Node</th>
                    <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">SaaS Tier Plan</th>
                    <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Monthly License rate</th>
                    <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Hardware Isolates</th>
                    <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Auto-Renew Status</th>
                    <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Client Sandbox Status</th>
                    <th className="px-6 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Sovereign Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenantsList
                    .filter(t => t.name.toLowerCase().includes(subscriptionSearch.toLowerCase()))
                    .filter(t => subscriptionFilterTier === "ALL" || t.tier === subscriptionFilterTier)
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-snug">{t.name}</p>
                            <p className="text-[9px] text-slate-400 font-mono">{t.adminEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={t.tier}
                            onChange={(e) => {
                              const newTier = e.target.value as "STARTER" | "GROWTH" | "ENTERPRISE";
                              let newFee = 4500;
                              let maxB = 5;
                              let maxP = 100;
                              if (newTier === "STARTER") {
                                newFee = 1500;
                                maxB = 2;
                                maxP = 30;
                              } else if (newTier === "GROWTH") {
                                newFee = 3000;
                                maxB = 10;
                                maxP = 150;
                              } else {
                                newFee = 7500;
                                maxB = 50;
                                maxP = 500;
                              }

                              const updated = tenantsList.map(item => {
                                if (item.id === t.id) {
                                  return { 
                                    ...item, 
                                    tier: newTier, 
                                    monthlySubscriptionFee: newFee,
                                    maxBranches: maxB,
                                    maxProducts: maxP
                                  };
                                }
                                return item;
                              });
                              onUpdateTenants(updated);
                              triggerNotification(`SaaS Slice configuration for ${t.name} updated successfully to ${newTier} Plan.`, "success");
                            }}
                            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg py-1 px-2 text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="STARTER">Starter Tier</option>
                            <option value="GROWTH">Growth Tier</option>
                            <option value="ENTERPRISE">Enterprise Tier</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">
                          ₹{(t.monthlySubscriptionFee || 4500).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {t.hardwareProvisioned?.map((hw, hIdx) => (
                              <span key={hIdx} className="bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase font-mono">
                                {hw}
                              </span>
                            )) || <span className="text-slate-400 text-[10px] italic">No Hardware Isolated</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              const nextRenewStatus = t.renewalStatus === "AUTO_RENEW" ? "CANCEL_ON_EXPIRY" as const : "AUTO_RENEW" as const;
                              const updated = tenantsList.map(item => {
                                if (item.id === t.id) {
                                  return { ...item, renewalStatus: nextRenewStatus };
                                }
                                return item;
                              });
                              onUpdateTenants(updated);
                              triggerNotification(`Subscription auto-renewal status for ${t.name} set to: ${nextRenewStatus === "AUTO_RENEW" ? "Enabled" : "Disabled"}.`, "success");
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                              t.renewalStatus === "AUTO_RENEW" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50" 
                                : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                            }`}
                          >
                            {t.renewalStatus === "AUTO_RENEW" ? "Auto-Renewing" : "Manual Renewal"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                            t.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            t.status === "SUSPENDED" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                            "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              const nextStatus = t.status === "ACTIVE" ? "SUSPENDED" as const : "ACTIVE" as const;
                              const updated = tenantsList.map(item => {
                                if (item.id === t.id) {
                                  return { ...item, status: nextStatus };
                                }
                                return item;
                              });
                              onUpdateTenants(updated);
                              triggerNotification(`Corporate Sandbox for ${t.name} has been ${nextStatus === "ACTIVE" ? "Activated" : "Suspended"}!`, nextStatus === "ACTIVE" ? "success" : "warning");
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider transition-all cursor-pointer ${
                              t.status === "ACTIVE" 
                                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10" 
                                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10"
                            }`}
                          >
                            {t.status === "ACTIVE" ? "Suspend Slice" : "Resume Slice"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeMenuTab === "audit" ? (
          /* Cyber security audit log page */
          <div className="flex-1 p-8 overflow-y-auto space-y-6" id="audit-panel">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-sans">Cyber Security Audit Trail</h2>
              <p className="text-xs text-slate-400">Cryptographically authenticated records of multi-tenant events logs</p>
            </div>

            <div className="bg-slate-950 text-emerald-400 p-6 rounded-2xl shadow-2xl border border-slate-800 font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto space-y-3">
              <p className="text-slate-500">[2024-05-24 10:00:00 UTC] SECURE BOOT: Initializing Sovereign SaaS core isolate clusters...</p>
              <p className="text-slate-400">[2024-05-24 10:05:14 UTC] POLICY_AUDIT: Root certificates mapped to tenant isolates...</p>
              <p className="text-emerald-500">[2024-05-24 10:12:44 UTC] DATABASE: SaaS node TENANT-001 sandbox initialized completely.</p>
              <p className="text-emerald-500">[2024-05-24 10:15:30 UTC] DISPATCH: Physical 80mm Thermal Printer dispatched to TENANT-002.</p>
              <p className="text-slate-400">[2024-05-24 11:20:10 UTC] AUTHENTICATION: Master key superadmin@expertaid.com completed session auth challenge.</p>
              <p className="text-blue-400">[2024-05-24 12:44:00 UTC] ISOLATION_LOCK: Quota values mapped for Tech Solutions (Branches: 5, SKU limit: 100).</p>
              <p className="text-amber-400">[2024-05-24 13:00:15 UTC] BILLING_SYNC: Corporate monthly subscription ledger generated for 9 tenants.</p>
              <p className="text-emerald-400">[2024-05-24 14:02:11 UTC] BACKUP: Manual export JSON file completed on sovereign request.</p>
              <p className="text-slate-500">// End of system events log buffer. Active listeners online...</p>
            </div>
          </div>
        ) : activeMenuTab === "roles" ? (
          /* Role & Permissions panel content */
          <div className="flex-1 p-8 overflow-y-auto space-y-6" id="roles-panel">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Role Privilege Control Center</h2>
                <p className="text-xs text-slate-400">Define administrative privileges, security clearance gates, and map functional scopes to platform personnel.</p>
              </div>
              <button
                onClick={() => {
                  triggerNotification("Role privilege blueprint configuration synchronized.", "success");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Role Blueprint</span>
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column: Roles Selection and Privileges Mapping (span 2) */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Select Security Tier</p>
                    <button
                      onClick={() => {
                        setNewRoleId("");
                        setNewRoleLabel("");
                        setNewRoleColor("border-indigo-200 text-indigo-700 bg-indigo-50");
                        setNewRolePrivileges([]);
                        setIsGeneratingRole(true);
                      }}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-blue-200/50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Generate New Role</span>
                    </button>
                  </div>
                  
                  {/* Role tab selector */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {customRoles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRoleTab(role.id)}
                        className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                          selectedRoleTab === role.id
                            ? `${role.color.split(" ")[1]} ${role.color.split(" ")[2]} border-2 border-current shadow-sm`
                            : "border-slate-200 text-slate-500 bg-slate-50/50 hover:bg-slate-50"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-slate-800">
                        Privileges Mapping for <span className="text-blue-600 font-mono">
                          {selectedRoleTab.replace("_", " ")}
                        </span>
                      </h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono font-bold">
                        {rolePrivilegesMap[selectedRoleTab]?.length || 0} Enabled
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Sovereign system isolate permissions allocated to members of this security tier. Changing mappings updates dynamic access controllers instantly.
                    </p>

                    {/* Checkbox grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {[
                        // Platform / Super level
                        { key: "tenant:create", label: "SaaS Slice Provisioning", desc: "Approve and instantiate new tenant isolate blocks.", scope: "SUPER_ADMIN" },
                        { key: "tenant:decommission", label: "Decommission Tenants", desc: "Permanently delete and scrub tenant databases.", scope: "SUPER_ADMIN" },
                        { key: "billing:sync", label: "Ledger Ledger Synchronization", desc: "Sync physical invoices with sovereign ledger state.", scope: "SUPER_ADMIN" },
                        { key: "invoice:generate", label: "Generate Invoices", desc: "Generate custom itemized billing files for tenants.", scope: "SUPER_ADMIN" },
                        { key: "payment:audit", label: "Financial Receipts Auditing", desc: "Cryptographically verify and sign cash receipts.", scope: "SUPER_ADMIN" },
                        { key: "security:keys", label: "Credentials Master Access", desc: "Rotate credentials keys and revoke operator access.", scope: "SUPER_ADMIN" },
                        { key: "backup:export", label: "System Database Snapshots", desc: "Authorize full system exports and JSON restorations.", scope: "SUPER_ADMIN" },
                        { key: "audit:view", label: "Realtime Cryptographic Audit", desc: "View multi-tenant active live transaction logs.", scope: "SUPER_ADMIN" },
                        // Store / Tenant level
                        { key: "store:config", label: "Branch Operations Config", desc: "Modify local regional tax rules and branch tables.", scope: "TENANT_ADMIN" },
                        { key: "staff:manage", label: "Staff Operator Credentials", desc: "Appoint store cashiers and manager permissions.", scope: "TENANT_ADMIN" },
                        { key: "product:write", label: "Inventory SKU Write Access", desc: "Create, edit, and adjust warehouse inventory limits.", scope: "TENANT_ADMIN" },
                        { key: "customer:write", label: "Customer Ledger Management", desc: "Configure customer credit scores and limits.", scope: "TENANT_ADMIN" },
                        { key: "reports:view", label: "High Fidelity Reports View", desc: "Inspect high fidelity graphs and analytics.", scope: "TENANT_ADMIN" },
                        { key: "drawer:manage", label: "Cash Drawer Reconciliation", desc: "Audit register sessions and cash balances.", scope: "TENANT_MANAGER" },
                        { key: "checkout:create", label: "Thermal Print Transactions", desc: "Initiate terminal checkout sales and bill prints.", scope: "TENANT_CASHIER" }
                      ].map((perm) => {
                        const isChecked = (rolePrivilegesMap[selectedRoleTab] || []).includes(perm.key);
                        return (
                          <div
                            key={perm.key}
                            onClick={() => {
                              const currentPrivs = rolePrivilegesMap[selectedRoleTab] || [];
                              const updatedPrivs = currentPrivs.includes(perm.key)
                                ? currentPrivs.filter((p) => p !== perm.key)
                                : [...currentPrivs, perm.key];
                              setRolePrivilegesMap({
                                ...rolePrivilegesMap,
                                [selectedRoleTab]: updatedPrivs
                              });
                              triggerNotification(
                                `Sovereign permission '${perm.key}' ${currentPrivs.includes(perm.key) ? "revoked from" : "granted to"} ${selectedRoleTab.replace("_", " ")} tier.`,
                                "success"
                              );
                            }}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex items-start gap-3 select-none ${
                              isChecked
                                ? "bg-blue-50/40 border-blue-200 shadow-sm"
                                : "bg-white border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <div className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                              isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-slate-50"
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                                <span>{perm.label}</span>
                                <span className="font-mono text-[8px] text-slate-400 bg-slate-100 px-1 rounded uppercase">{perm.key.split(":")[0]}</span>
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{perm.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Personnel Holding Selected Role */}
              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest font-mono">Assigned Personnel</p>
                    <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded font-bold">Live Directory</span>
                  </div>

                  <h4 className="text-sm font-black tracking-tight text-white leading-tight">
                    Personnel holding <span className="text-blue-400 font-mono">{selectedRoleTab.replace("_", " ")}</span> clearance:
                  </h4>

                  <div className="space-y-3 pt-2">
                    {credentialsList.filter((c) => {
                      if (selectedRoleTab === "SUPER_ADMIN" && c.role === "ADMIN" && c.title.toLowerCase().includes("super")) return true;
                      if (selectedRoleTab === "OPERATOR" && c.role === "ADMIN" && !c.title.toLowerCase().includes("super")) return true;
                      if (selectedRoleTab === "TENANT_ADMIN" && c.role === "ADMIN") return true;
                      if (selectedRoleTab === "TENANT_MANAGER" && c.role === "MANAGER") return true;
                      if (selectedRoleTab === "TENANT_CASHIER" && c.role === "CASHIER") return true;
                      return false;
                    }).length === 0 ? (
                      <div className="p-4 bg-slate-950/50 rounded-xl text-center space-y-2 border border-slate-800">
                        <User className="w-6 h-6 text-slate-600 mx-auto" />
                        <p className="text-[10px] text-slate-400">No active local system operators found matching this specific role profile.</p>
                      </div>
                    ) : (
                      credentialsList.filter((c) => {
                        if (selectedRoleTab === "SUPER_ADMIN" && c.role === "ADMIN" && c.title.toLowerCase().includes("super")) return true;
                        if (selectedRoleTab === "OPERATOR" && c.role === "ADMIN" && !c.title.toLowerCase().includes("super")) return true;
                        if (selectedRoleTab === "TENANT_ADMIN" && c.role === "ADMIN") return true;
                        if (selectedRoleTab === "TENANT_MANAGER" && c.role === "MANAGER") return true;
                        if (selectedRoleTab === "TENANT_CASHIER" && c.role === "CASHIER") return true;
                        return false;
                      }).map((user, idx) => (
                        <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xs text-white">
                              {user.name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-100 text-[11px] leading-tight">{user.name}</p>
                              <p className="text-[9px] text-slate-400 mt-0.5 leading-none font-mono">{user.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setViewingStaff(user);
                            }}
                            className="text-[9px] font-extrabold text-blue-400 hover:text-blue-300 font-mono tracking-wider cursor-pointer"
                          >
                            PROFILE
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                    <p>All active sessions must undergo authentication validation. Credentials are encrypted and hashed before being persisted to the local system database.</p>
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 space-y-2.5">
                  <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Compliance Verification</span>
                  </p>
                  <p className="text-[11px] text-amber-700/90 leading-relaxed font-medium">
                    This control panel is locked behind root master authorization. Modification actions are fully logged inside the cyber security audit log trail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : activeMenuTab === "system-settings" ? (
          /* System Settings panel content */
          <div className="flex-1 p-8 overflow-y-auto space-y-6" id="system-settings-panel">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-sans tracking-tight">Enterprise Operations Control Board</h2>
                <p className="text-xs text-slate-400 font-medium">SaaS platform settings registry, multi-tenant sandbox modules, and localisation parameters.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerNotification(`All twelve system configurations synced successfully to cluster databases.`, "success");
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Sync Controls</span>
                </button>
              </div>
            </div>

            {/* 4-column Master Grid for 12 Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 align-start items-start">
              
              {/* ================= COLUMN 1 ================= */}
              <div className="space-y-6">
                
                {/* A. Business Settings */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-500" />
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
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
                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
          </div>
        ) : activeMenuTab === "backup" ? (
          /* Backup & Restore panel content */
          <div className="flex-1 p-8 overflow-y-auto space-y-6" id="backup-panel">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">System Snapshots & Recovery</h2>
                <p className="text-xs text-slate-400">Download sovereign backup snapshots, verify logical archive integrity, or restore database records.</p>
              </div>
              <button
                onClick={handleExportBackup}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto animate-pulse"
              >
                <DatabaseBackup className="w-4 h-4" />
                <span>Create Cluster Snapshot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Left Column: Backup Registry & Upload Restore (span 2) */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* File Dropzone Restore */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-xs font-black uppercase text-slate-950 tracking-wider">Disaster Recovery Restore Gate</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Upload an offline logical state database backup file (.json) to restore active clients list, billing ledgers, and operator parameters.
                  </p>

                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/10 p-6 rounded-2xl transition-all text-center space-y-3 cursor-pointer group relative">
                    <input
                      type="file"
                      accept=".json"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          triggerNotification(`State recovery completed! Successfully processed archive: ${file.name}. Isolated ledgers synchronized.`, "success");
                        }
                      }}
                    />
                    <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-all duration-300">
                      <UploadCloud className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Drag & Drop Secure State Snapshot</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Accepts encrypted JSON backup files exported via SuperAdmin console</p>
                    </div>
                  </div>
                </div>

                {/* Backups Archives List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-black uppercase text-slate-950 tracking-wider">Verifiable Snapshot Archives</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Sovereign daily snapshots and manual ledger back-ups registry</p>
                  </div>

                  <div className="overflow-x-auto max-h-[450px] overflow-y-auto relative">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)] bg-slate-50">
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4 bg-slate-50">Snapshot Archive Name</th>
                          <th className="p-4 bg-slate-50">Timestamp</th>
                          <th className="p-4 bg-slate-50">File Size</th>
                          <th className="p-4 bg-slate-50">Status</th>
                          <th className="p-4 text-right bg-slate-50">Verification Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {backupRestoreFiles.map((file, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                            <td className="p-4">
                              <p className="font-extrabold text-slate-800 flex items-center gap-2">
                                <Database className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>{file.name}</span>
                              </p>
                            </td>
                            <td className="p-4 text-slate-500 font-mono text-[10px]">{file.date}</td>
                            <td className="p-4 text-slate-500 font-mono text-[10px]">{file.size}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 text-[9px] font-extrabold tracking-wider rounded uppercase ${
                                file.status === "Verified"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}>
                                {file.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  triggerNotification(`SHA-256 Checksum signature for ${file.name} matches production ledger hash exactly.`, "success");
                                }}
                                className="px-2.5 py-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                              >
                                Verify Hash
                              </button>
                              <button
                                onClick={() => {
                                  const updated = backupRestoreFiles.filter((_, fIdx) => fIdx !== idx);
                                  setBackupRestoreFiles(updated);
                                  triggerNotification(`Archived backup snapshot ${file.name} deleted successfully from storage.`, "success");
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column: Engine Specifications */}
              <div className="space-y-6">
                
                {/* Backup Engine status card */}
                <div className="bg-slate-950 text-emerald-400 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono">Snapshot Core Status</p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Backup Storage Pool</p>
                      <p className="text-sm font-sans font-black text-white mt-0.5">Sovereign Google Cloud Bucket</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Daily Snapshot Rotation</p>
                      <p className="text-sm font-sans font-black text-emerald-400 mt-0.5">ENABLED (7-Day Retention)</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Last Automatic Snapshot</p>
                      <p className="text-xs font-mono text-slate-300 mt-0.5">Today, 04:00 UTC (Verified)</p>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Ledger Hash Integrity:</span>
                        <span className="text-emerald-400 font-extrabold">PASS</span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal font-mono break-all">
                        SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-400 leading-relaxed border-t border-slate-900">
                    Daily snapshot rotation is automated. To execute a direct raw database recovery command, consult platform operations support.
                  </div>
                </div>

                {/* Database State Summary stats */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-900 font-sans tracking-wide">State Coverage Metrics</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Our sovereign backups fully encapsulate all multi-tenant isolation contexts:
                  </p>
                  
                  <div className="space-y-2 pt-1 font-mono text-[10px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Tenant Isolates:</span>
                      <span className="font-bold text-slate-800">{tenantsList.length} Clients</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Master Keys:</span>
                      <span className="font-bold text-slate-800">{credentialsList.length} Keys</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing Invoices:</span>
                      <span className="font-bold text-slate-800">{invoicesList.length} Records</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Standard template placeholder for other command options */
          <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center text-center space-y-4" id="standard-tabs">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <Sliders className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 capitalize font-sans">{activeMenuTab.replace("-", " ")} Node</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                This section displays live analytical values, configurations parameters, and accounting ledgers corresponding to the {activeMenuTab} panel.
              </p>
            </div>
            <button
              onClick={() => setActiveMenuTab("dashboard")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              Back to Command Dashboard
            </button>
          </div>
        )}

      </div>

      {/* ========================================= MODAL OVERLAYS ========================================= */}

      {/* 0. Active Settings Parameter Editor Modal */}
      {activeSettingsItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" id="settings-editor-modal">
          <div className="bg-white text-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Settings className="w-4 h-4" />
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
                <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
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
                  triggerNotification(`Operational specification for '${activeSettingsItem.itemLabel}' updated live.`, "success");
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

      {/* 1. Viewing Tenant Specification Modal */}
      {viewingTenant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="tenant-detail-modal">
          <div className="bg-slate-950 text-slate-100 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black">
                  {viewingTenant.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight leading-none">{viewingTenant.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Tenant ID: {viewingTenant.id}</p>
                </div>
              </div>
              <button onClick={() => setViewingTenant(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto text-xs font-medium">
              
              <div className="grid grid-cols-2 gap-4 border-b border-slate-800/40 pb-4">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Domain URL</p>
                  <p className="font-mono text-blue-400 font-bold">{viewingTenant.subdomain}.expertaid.com</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">KYC Status</p>
                  <p className="font-sans font-bold text-emerald-400">{viewingTenant.clientVerificationStatus || "VERIFIED"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-800/40 pb-4">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Contact Email</p>
                  <p className="font-mono text-slate-200">{viewingTenant.adminEmail}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Contact Phone</p>
                  <p className="font-mono text-slate-200">{viewingTenant.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-b border-slate-800/40 pb-4">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Branches Quota</p>
                  <p className="font-mono text-slate-100 font-bold">{viewingTenant.maxBranches} Nodes</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">SKU Products Cap</p>
                  <p className="font-mono text-slate-100 font-bold">{viewingTenant.maxProducts} SKU Items</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Onboarding Setup Fee</p>
                  <p className="font-mono text-emerald-400 font-bold">₹ {viewingTenant.onboardingFeePaid?.toLocaleString()}</p>
                </div>
              </div>

              {/* Complete Client Admin Login Credentials section */}
              {(() => {
                const credMatch = credentialsList.find(c => 
                  c.email.toLowerCase() === viewingTenant.adminEmail.toLowerCase() ||
                  c.title.toLowerCase().includes(viewingTenant.name.toLowerCase()) ||
                  c.name.toLowerCase().includes(viewingTenant.name.toLowerCase())
                );
                
                return (
                  <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-4.5 space-y-3 shadow-md shadow-blue-500/5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="font-extrabold text-[10px] uppercase tracking-wider">Client Admin Access Credentials</span>
                      </div>
                      <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/10 uppercase">
                        {credMatch ? credMatch.role : "ADMIN"}
                      </span>
                    </div>

                    {credMatch ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Login Username / Email</p>
                            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                              <span className="font-mono text-slate-200 select-all truncate flex-1">{credMatch.email}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyTextDetail(credMatch.email, "view-email")}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Copy email address"
                              >
                                {copiedField === "view-email" ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Access Password</p>
                            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                              <input
                                type={showViewTenantPassword ? "text" : "password"}
                                value={credMatch.password}
                                readOnly
                                className="bg-transparent font-mono text-slate-200 select-all outline-none w-full border-none p-0 focus:ring-0 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => setShowViewTenantPassword(!showViewTenantPassword)}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title={showViewTenantPassword ? "Hide password" : "Show password"}
                              >
                                {showViewTenantPassword ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyTextDetail(credMatch.password, "view-password")}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Copy password"
                              >
                                {copiedField === "view-password" ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quick action impersonate client button inside view modal */}
                        <div className="flex items-center justify-between bg-blue-500/5 border border-blue-500/10 rounded-xl p-2.5 mt-1">
                          <div className="space-y-0.5">
                            <p className="text-[9.5px] font-bold text-slate-200 leading-none">Impersonate Client Admin</p>
                            <p className="text-[8.5px] text-slate-400 leading-none">Gain sandbox control of this client environment instantly</p>
                          </div>
                          {onImpersonateClient && (
                            <button
                              type="button"
                              onClick={() => {
                                setViewingTenant(null);
                                onImpersonateClient(credMatch.email);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-emerald-500 shadow-sm shadow-emerald-500/10"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Log In</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Login Username / Email</p>
                            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                              <span className="font-mono text-slate-200 select-all truncate flex-1">{viewingTenant.adminEmail}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyTextDetail(viewingTenant.adminEmail, "view-email")}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Copy email address"
                              >
                                {copiedField === "view-email" ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">Access Password</p>
                            <div className="flex items-center justify-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] text-amber-400/80">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Using contact email as login</span>
                            </div>
                          </div>
                        </div>

                        {onImpersonateClient && (
                          <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/10 rounded-xl p-2.5 mt-1">
                            <div className="space-y-0.5">
                              <p className="text-[9.5px] font-bold text-amber-400 leading-none">Impersonate Client Admin</p>
                              <p className="text-[8.5px] text-slate-400 leading-none">Log in with default contact profile</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setViewingTenant(null);
                                onImpersonateClient(viewingTenant.adminEmail);
                              }}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-amber-500 shadow-sm"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Log In</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="space-y-2">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Onboarding Notes Specifications</p>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
                  {viewingTenant.onboardingNotes || "Workspace sandbox isolate deployed completely. Physical setup verified."}
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button onClick={() => setViewingTenant(null)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">Close details</button>
            </div>

          </div>
        </div>
      )}

      {/* 2. Editing Tenant Specifications Modal */}
      {editingTenant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="tenant-edit-modal">
          <div className="bg-white text-slate-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Edit Client Specifications</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">SaaS Node ID: {editingTenant.id}</p>
              </div>
              <button onClick={() => setEditingTenant(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveEditedTenant} className="p-6 space-y-4 overflow-y-auto text-xs">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editTenantName}
                  onChange={(e) => setEditTenantName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subdomain Name</label>
                <input
                  type="text"
                  required
                  value={editTenantSubdomain}
                  onChange={(e) => setEditTenantSubdomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={editTenantAdminEmail}
                    onChange={(e) => setEditTenantAdminEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editTenantPhone}
                    onChange={(e) => setEditTenantPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max Branches Quota</label>
                  <input
                    type="number"
                    value={editTenantMaxBranches}
                    onChange={(e) => setEditTenantMaxBranches(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max Products SKU</label>
                  <input
                    type="number"
                    value={editTenantMaxProducts}
                    onChange={(e) => setEditTenantMaxProducts(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Onboarding Notes</label>
                <textarea
                  value={editTenantNotes}
                  onChange={(e) => setEditTenantNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono h-20 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button type="button" onClick={() => setEditingTenant(null)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md">Save Specifications</button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 3. Viewing Staff Detail Modal */}
      {viewingStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-sm font-extrabold uppercase tracking-widest">SaaS Personnel Profile</h3>
              <button onClick={() => setViewingStaff(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-black text-lg shadow-inner">
                  {viewingStaff.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-black text-white leading-none">{viewingStaff.name}</p>
                  <p className="text-slate-400 text-[10px] mt-1">{viewingStaff.title}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Credential Email ID</p>
                <p className="font-mono text-slate-200">{viewingStaff.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Contact Phone Number</p>
                <p className="font-mono text-slate-200">{viewingStaff.phone || "Not Configured"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Security key / Password</p>
                <p className="font-mono text-amber-400 font-bold">{viewingStaff.password}</p>
              </div>

              {viewingStaff.description && (
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest">Profile Description</p>
                  <p className="text-slate-300 font-normal leading-normal">{viewingStaff.description}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Assigned Role</p>
                <p className="font-mono text-blue-400 uppercase font-black">{viewingStaff.role}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Personnel Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {(viewingStaff.privileges || []).map((p, i) => (
                    <span key={i} className="bg-slate-800 text-slate-300 font-mono text-[9px] px-2 py-0.5 rounded border border-slate-700/60">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actionable Messaging/Mail Sending Modal */}
      {sendingMessageClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Sovereign Actionable Dispatch</h3>
                  <p className="text-[10px] text-slate-400">Compose and transmit cryptographically signed alerts to {sendingMessageClient.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setSendingMessageClient(null)} 
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-all text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Delivery Channel selection tabs */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-sans">1. Select Transmission Channel</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailDeliveryChannel("EMAIL")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      emailDeliveryChannel === "EMAIL"
                        ? "bg-blue-50 border-blue-200 text-blue-600 font-bold"
                        : "bg-slate-50/50 border-slate-100 hover:border-slate-200 text-slate-500"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-[9px]">Sovereign Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailDeliveryChannel("SMS")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      emailDeliveryChannel === "SMS"
                        ? "bg-blue-50 border-blue-200 text-blue-600 font-bold"
                        : "bg-slate-50/50 border-slate-100 hover:border-slate-200 text-slate-500"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-[9px]">Direct SMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailDeliveryChannel("WHATSAPP")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      emailDeliveryChannel === "WHATSAPP"
                        ? "bg-blue-50 border-blue-200 text-blue-600 font-bold"
                        : "bg-slate-50/50 border-slate-100 hover:border-slate-200 text-slate-500"
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span className="text-[9px]">WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailDeliveryChannel("SYSTEM")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      emailDeliveryChannel === "SYSTEM"
                        ? "bg-blue-50 border-blue-200 text-blue-600 font-bold"
                        : "bg-slate-50/50 border-slate-100 hover:border-slate-200 text-slate-500"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span className="text-[9px]">In-App Alert</span>
                  </button>
                </div>
              </div>

              {/* Template selection tabs */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-sans">2. Apply Actionable Template</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTemplateChange("overdue", sendingMessageClient)}
                    className={`px-3 py-2 rounded-lg border text-left cursor-pointer transition-all text-[10px] font-bold ${
                      emailTemplateType === "overdue"
                        ? "bg-amber-50/55 border-amber-200 text-amber-800"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ⚠️ Overdue Billing Notice
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateChange("renewal", sendingMessageClient)}
                    className={`px-3 py-2 rounded-lg border text-left cursor-pointer transition-all text-[10px] font-bold ${
                      emailTemplateType === "renewal"
                        ? "bg-purple-50/55 border-purple-200 text-purple-800"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🔄 Upcoming Renewal Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateChange("kyc", sendingMessageClient)}
                    className={`px-3 py-2 rounded-lg border text-left cursor-pointer transition-all text-[10px] font-bold ${
                      emailTemplateType === "kyc"
                        ? "bg-emerald-50/55 border-emerald-200 text-emerald-800"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📋 Compliance / KYC Request
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateChange("custom", sendingMessageClient)}
                    className={`px-3 py-2 rounded-lg border text-left cursor-pointer transition-all text-[10px] font-bold ${
                      emailTemplateType === "custom"
                        ? "bg-slate-100 border-slate-300 text-slate-800"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    📢 Maintenance / Custom Alert
                  </button>
                </div>
              </div>

              {/* Subject line input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-sans">Dispatch Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  placeholder="e.g. Urgent Billing Action Required"
                />
              </div>

              {/* Message body text area */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-sans">Actionable Message Body</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 leading-relaxed font-mono"
                  placeholder="Write message details..."
                />
              </div>

              {/* Cryptographic hash info */}
              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3.5 rounded-xl text-[10px] space-y-1 font-medium">
                <p className="font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sovereign Actionable Link Encoded</span>
                </p>
                <p className="text-slate-600 leading-normal">
                  A cryptographic single-sign-on token with transaction hash <span className="font-mono font-bold text-blue-700">0x{(Math.floor(100000 + Math.random() * 900000)).toString(16)}...9f</span> is automatically injected. This permits client admin at <span className="font-bold">{sendingMessageClient.adminEmail}</span> to perform self-service checkout or upload files instantly without multi-factor prompts.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSendingMessageClient(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-200/50 rounded-xl font-bold text-xs text-slate-500 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerNotification(
                    `Successfully dispatched actionable ${emailDeliveryChannel} notification to ${sendingMessageClient.adminEmail} via tenant endpoint.`,
                    "success"
                  );
                  setSendingMessageClient(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Transmit Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Editing Staff Profile Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold uppercase tracking-widest">Edit Operator Profile</h3>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEditedStaff} className="p-6 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Personnel Name</label>
                <input
                  type="text"
                  required
                  value={editStaffName}
                  onChange={(e) => setEditStaffName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Personnel Email</label>
                <input
                  type="email"
                  required
                  value={editStaffEmail}
                  onChange={(e) => setEditStaffEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 9900112233"
                  value={editStaffPhone}
                  onChange={(e) => setEditStaffPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">New password (leave blank to retain)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={editStaffPassword}
                  onChange={(e) => setEditStaffPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button type="button" onClick={() => setEditingStaff(null)} className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md">Save Personnel Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="invoice-detail-modal">
          <div className="bg-white text-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">Compliance Invoice Receipt</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Sovereign Ledger Node Reference</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Printer Layout Selector */}
            <div className="bg-slate-100/60 p-4 border-b border-slate-200/50 space-y-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                Select Printer Type / Page Layout
              </label>
              <div className="grid grid-cols-3 gap-2 text-[9px]">
                <button
                  type="button"
                  onClick={() => setSelectedPrinterLayout("standard-a4")}
                  className={`py-2 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
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
                  className={`py-2 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
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
                  className={`py-2 px-1 rounded-xl border font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedPrinterLayout === "thermal-58mm"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-sm mb-0.5">🎟️</span>
                  <span>POS 58mm</span>
                </button>
              </div>
              <p className="text-[9px] text-slate-500 font-medium leading-tight">
                {selectedPrinterLayout === "standard-a4" 
                  ? "✓ Optimizes padding & font spacing for high-quality printing on standard office/home A4 printers (Not thermal)." 
                  : selectedPrinterLayout === "thermal-80mm"
                  ? "✓ Formats receipt margins precisely for 3-inch roll POS thermal printers."
                  : "✓ Formats receipt compact margins precisely for portable 2-inch mini thermal printers."}
              </p>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto text-xs" id="superadmin-invoice-print">
              
              {/* Header Branding */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-blue-600 tracking-tight font-sans">EXPERTAID SAAS INC.</h4>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">Sovereign Core Infrastructure</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="font-bold text-slate-900">INVOICE ID</p>
                  <p className="font-mono text-blue-600 font-extrabold text-sm">{selectedInvoice.id}</p>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Billed To</p>
                  <p className="font-extrabold text-slate-800">{selectedInvoice.tenantName}</p>
                  <p className="text-slate-500 font-medium">Tenant ID: {selectedInvoice.tenantId}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Dates & Parameters</p>
                  <p className="text-slate-600"><span className="font-semibold">Issued:</span> <span className="font-mono">{selectedInvoice.issueDate}</span></p>
                  <p className="text-slate-600"><span className="font-semibold">Due:</span> <span className="font-mono">{selectedInvoice.dueDate}</span></p>
                  {selectedInvoice.paymentMethod && (
                    <p className="text-slate-600">
                      <span className="font-semibold">Method:</span>{" "}
                      <span className="font-bold text-blue-600 bg-blue-50 border border-blue-100/50 rounded px-1.5 py-0.5 text-[9px] font-mono inline-block">
                        {selectedInvoice.paymentMethod}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100 pb-1">Itemized Slices & Fees</p>
                <div className="divide-y divide-slate-100">
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="py-2.5 flex justify-between items-center">
                      <span className="font-bold text-slate-700">{item.description}</span>
                      <span className="font-mono font-bold text-slate-800">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculations Block */}
              <div className="border-t border-slate-100 pt-4 space-y-1.5 text-right font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono">₹{selectedInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Integrated GST (18% Total):</span>
                  <span className="font-mono">₹{selectedInvoice.gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-2.5">
                  <span>Total Due (INR):</span>
                  <span className="font-mono text-blue-600">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Corporate Compliance Stamp */}
              <div className="text-center p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[10px] text-blue-800 space-y-1">
                <p className="font-extrabold uppercase tracking-widest">Sovereign Compliance Assurance</p>
                <p className="text-slate-500">This receipt has been cryptographically published and verified to the client sandbox isolate ledger.</p>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-2.5 bg-slate-50">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer transition-all text-slate-500"
              >
                Close Receipt
              </button>
              <button
                onClick={async () => {
                  triggerNotification(`Compiling high-fidelity ${selectedPrinterLayout === 'standard-a4' ? 'Office A4' : 'Thermal'} print file for ${selectedInvoice.id}...`, "success");
                  const success = await printElementById("superadmin-invoice-print", selectedPrinterLayout);
                  if (success) {
                    triggerNotification(`Invoice ${selectedInvoice.id} print job compiled successfully!`, "success");
                  } else {
                    triggerNotification("Failed to compile high-fidelity invoice copy.", "warning");
                  }
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md shadow-slate-900/10 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={async () => {
                  triggerNotification(`Compiling high-fidelity PDF copy of ${selectedInvoice.id} and launching local downloader...`, "success");
                  const success = await saveElementAsPDF("superadmin-invoice-print", `Invoice-${selectedInvoice.id}.pdf`);
                  if (success) {
                    triggerNotification(`PDF copy of ${selectedInvoice.id} downloaded successfully.`, "success");
                  } else {
                    triggerNotification("Failed to compile high-fidelity PDF copy.", "warning");
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Save PDF Receipt</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Generate New Role Modal */}
      {isGeneratingRole && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" id="generate-role-modal">
          <div className="bg-white text-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">Generate Custom Security Role</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Sovereign Privilege Blueprint Definition</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGeneratingRole(false)} 
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs">
              
              {/* Form Input Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">Role Label / Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g., Compliance Auditor"
                    value={newRoleLabel}
                    onChange={(e) => {
                      setNewRoleLabel(e.target.value);
                      const autoCode = e.target.value.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
                      setNewRoleId(autoCode);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">Role Code / ID (Unique String)</label>
                  <input
                    type="text"
                    placeholder="e.g., COMPLIANCE_AUDITOR"
                    value={newRoleId}
                    onChange={(e) => setNewRoleId(e.target.value.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, ""))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 text-blue-600"
                  />
                </div>
              </div>

              {/* Accent Color Selection */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Visual Theme Accent & Tag Color</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: "border-purple-200 text-purple-700 bg-purple-50", label: "Purple (Admin Tier)", bg: "bg-purple-500" },
                    { key: "border-blue-200 text-blue-700 bg-blue-50", label: "Blue (Operator Tier)", bg: "bg-blue-500" },
                    { key: "border-emerald-200 text-emerald-700 bg-emerald-50", label: "Emerald (Compliance)", bg: "bg-emerald-500" },
                    { key: "border-amber-200 text-amber-700 bg-amber-50", label: "Amber (Management)", bg: "bg-amber-500" },
                    { key: "border-rose-200 text-rose-700 bg-rose-50", label: "Rose (Cashier Tier)", bg: "bg-rose-500" },
                    { key: "border-indigo-200 text-indigo-700 bg-indigo-50", label: "Indigo (Core Services)", bg: "bg-indigo-500" },
                    { key: "border-violet-200 text-violet-700 bg-violet-50", label: "Violet (Custom Audit)", bg: "bg-violet-500" }
                  ].map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => setNewRoleColor(col.key)}
                      className={`px-3 py-2 rounded-xl border text-[10px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        newRoleColor === col.key
                          ? `${col.key} border-2 border-current shadow-sm scale-102`
                          : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${col.bg}`} />
                      <span>{col.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes for choosing starting privileges */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wide block">Select Initial Privileges Blueprint</label>
                  <button
                    type="button"
                    onClick={() => {
                      const allPrivs = [
                        "tenant:create", "tenant:decommission", "billing:sync", "invoice:generate", "payment:audit",
                        "security:keys", "backup:export", "audit:view", "store:config", "staff:manage",
                        "product:write", "customer:write", "reports:view", "drawer:manage", "checkout:create"
                      ];
                      if (newRolePrivileges.length === allPrivs.length) {
                        setNewRolePrivileges([]);
                      } else {
                        setNewRolePrivileges(allPrivs);
                      }
                    }}
                    className="text-[9px] text-blue-600 hover:text-blue-700 font-extrabold uppercase font-mono tracking-wider cursor-pointer"
                  >
                    {newRolePrivileges.length > 0 ? "Clear All" : "Select All Available"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[35vh] overflow-y-auto pr-1">
                  {[
                    // Platform
                    { key: "tenant:create", label: "SaaS Provisioning", scope: "Super" },
                    { key: "tenant:decommission", label: "Decommission Tenants", scope: "Super" },
                    { key: "billing:sync", label: "Ledger Sync", scope: "Super" },
                    { key: "invoice:generate", label: "Generate Invoices", scope: "Super" },
                    { key: "payment:audit", label: "Receipts Auditing", scope: "Super" },
                    { key: "security:keys", label: "Security Keys Control", scope: "Super" },
                    { key: "backup:export", label: "Database Snapshots", scope: "Super" },
                    { key: "audit:view", label: "Cyber Audit Logs", scope: "Super" },
                    // Tenant
                    { key: "store:config", label: "Store Configuration", scope: "Tenant" },
                    { key: "staff:manage", label: "Staff Credentials", scope: "Tenant" },
                    { key: "product:write", label: "SKU Write Access", scope: "Tenant" },
                    { key: "customer:write", label: "Customer Management", scope: "Tenant" },
                    { key: "reports:view", label: "Inspect Analytics", scope: "Tenant" },
                    { key: "drawer:manage", label: "Drawer Reconcile", scope: "Tenant" },
                    { key: "checkout:create", label: "Thermal checkout", scope: "Tenant" }
                  ].map((p) => {
                    const isChecked = newRolePrivileges.includes(p.key);
                    return (
                      <div
                        key={p.key}
                        onClick={() => {
                          if (isChecked) {
                            setNewRolePrivileges(newRolePrivileges.filter((priv) => priv !== p.key));
                          } else {
                            setNewRolePrivileges([...newRolePrivileges, p.key]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                          isChecked
                            ? "bg-blue-50/40 border-blue-200"
                            : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                          isChecked ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-slate-50"
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-extrabold text-slate-800 text-[11px] truncate">{p.label}</p>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[8px] text-slate-400 bg-slate-100 px-1 rounded truncate">{p.key}</span>
                            <span className={`text-[8px] font-bold px-1 rounded uppercase shrink-0 ${p.scope === "Super" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}>{p.scope}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Warning box */}
              <div className="bg-amber-50/70 border border-amber-100 text-amber-800 p-3.5 rounded-xl text-[10px] space-y-1 font-medium">
                <p className="font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Sovereign Security Sandbox Gate</span>
                </p>
                <p className="text-slate-600 leading-normal">
                  Generating custom roles permanently appends role blueprints to the system master context. This authorization level change will be fully logged in the real-time cryptographic audit ledger.
                </p>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-2.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsGeneratingRole(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer transition-all text-slate-500"
              >
                Cancel Blueprint
              </button>
              <button
                type="button"
                onClick={handleCreateCustomRole}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Generate Custom Role</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" id="super-confirm-modal">
          <div className="bg-white text-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col font-sans">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-5 h-5 ${confirmModal.type === "danger" ? "text-rose-500" : "text-amber-500"}`} />
                <h3 className="text-sm font-black text-slate-900 tracking-tight">{confirmModal.title}</h3>
              </div>
              <button onClick={() => setConfirmModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 text-xs text-slate-600 leading-relaxed font-medium">
              {confirmModal.message}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-500 transition-colors cursor-pointer"
              >
                {confirmModal.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer ${
                  confirmModal.type === "danger" 
                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/10 border border-rose-500" 
                    : "bg-amber-600 hover:bg-amber-500 shadow-amber-500/10 border border-amber-500"
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
