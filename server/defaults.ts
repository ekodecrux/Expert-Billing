import type {
  MeasurementUnit as TMeasurementUnit,
  PaymentMode as TPaymentMode,
  UserRole as TUserRole,
  Product,
  Supplier,
  Customer,
  Invoice,
  StoreBranch,
  Expense,
  CashSession,
  StockAdjustment,
  StockTransfer,
  Tenant,
  AppSettings,
  LabelPrinterConfig,
} from "../src/types.ts";

export interface AccessProfile {
  role: TUserRole;
  title: string;
  email: string;
  username?: string;
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
  tenantId?: string;
  phone?: string;
}

export interface ExtendedAppSettings extends AppSettings {
  attractiveMode: string;
  loginBgMode: string;
  activeTenantId: string;
  currentBranchId: string;
  printerLayout: "standard-a4" | "thermal-80mm" | "thermal-58mm";
  labelPrinterConfig: LabelPrinterConfig;
}

export const MeasurementUnit = {
  KG: "Kg" as TMeasurementUnit,
  GRAM: "Grams" as TMeasurementUnit,
  LITER: "Liters" as TMeasurementUnit,
  ML: "Milliliter (mL)" as TMeasurementUnit,
  PIECE: "Pieces" as TMeasurementUnit,
  PACK: "Packs" as TMeasurementUnit,
};

export const PaymentMode = {
  CASH: "CASH" as TPaymentMode,
  UPI: "UPI" as TPaymentMode,
  CARD: "CARD" as TPaymentMode,
  STORE_CREDIT: "STORE_CREDIT" as TPaymentMode,
};

export const DEFAULT_CATEGORIES: string[] = [
  "Dairy & Eggs",
  "Grains & Grocery",
  "Beverages & Juices",
  "Snacks & Confectionery",
  "Personal Care & Hygiene",
  "Household Cleaning",
];

export const DEFAULT_LABEL_PRINTER_CONFIG: LabelPrinterConfig = {
  printerModel: "zebra-zpl",
  printerName: "Zebra ZD220 Direct Thermal Label Printer",
  presetId: "roll-50x25",
  connectionType: "browser",
  networkIp: "192.168.1.200",
  networkPort: "9100",
  dpi: 203,
  darkness: 10,
  gapMm: 3,
  sensorType: "gap",
};

export const DEFAULT_APP_SETTINGS: ExtendedAppSettings = {
  autoPrintReceipt: true,
  enableSound: true,
  receiptHeader: "OFFICIAL RETAIL CASH INVOICE",
  receiptFooter: "Thank you for shopping! Powered by Expert POS SaaS",
  maxDiscountAllowed: 25,
  attractiveMode: "mint",
  loginBgMode: "cosmic-aurora",
  activeTenantId: "TENANT-DEMO-01",
  currentBranchId: "B1",
  printerLayout: "thermal-80mm",
  labelPrinterConfig: DEFAULT_LABEL_PRINTER_CONFIG,
};

export const DEFAULT_TENANTS: Tenant[] = [
  {
    id: "TENANT-DEMO-01",
    name: "FreshMart Superstore",
    subdomain: "freshmart",
    domainUrl: "https://freshmart.expertbilling.in",
    domainStatus: "ACTIVE",
    businessSector: "SUPERMARKET",
    sectorConfig: {
      sector: "SUPERMARKET",
      sectorName: "Supermarket & Grocery",
      enabledModules: {
        kdsTableManagement: false,
        weighingScaleScanning: true,
        batchExpiryRx: true,
        variantMatrix: false,
        appointmentsBooking: false,
        roomBedManagement: false,
        garmentTailoring: false,
        loyaltyPoints: true,
        stockTransfers: true,
        barcodeLabelPrinting: true,
        kotPrinting: false,
        discountRules: true,
      },
      posMode: "SUPERMARKET_FAST_SCAN",
      defaultCategories: [
        "Dairy & Eggs",
        "Grains & Grocery",
        "Beverages & Juices",
        "Snacks & Confectionery",
        "Personal Care & Hygiene",
        "Household Cleaning",
      ],
      unitPresets: [
        MeasurementUnit.KG,
        MeasurementUnit.GRAM,
        MeasurementUnit.LITER,
        MeasurementUnit.ML,
        MeasurementUnit.PIECE,
        MeasurementUnit.PACK,
      ],
      quickActions: [
        "Fast Scan Mode",
        "Weighing Scale Sync",
        "MRP Savings Banner",
        "Batch Expiry Check",
      ],
    },
    typography: {
      fontFamily: "Inter",
      fontSizeScale: "standard",
      basePx: 15,
      headingFont: "Inter",
    },
    adminEmail: "demo@freshmart.in",
    adminLoginId: "freshmart_demo",
    adminPassword: "Demo@2026",
    phone: "+91 98765 43210",
    currency: "₹",
    tier: "ENTERPRISE",
    status: "ACTIVE",
    createdAt: "2026-01-15T09:00:00Z",
    colorTheme: "emerald",
    maxBranches: 10,
    maxProducts: 1000,
    onboardingFeePaid: 15000,
    monthlySubscriptionFee: 2999,
    billingCycle: "MONTHLY",
    subscriptionStartDate: "2026-01-15",
    subscriptionEndDate: "2027-01-15",
    contractDurationMonths: 12,
    renewalStatus: "AUTO_RENEW",
    onboardingSetupStatus: "COMPLETED",
    hardwareProvisioned: [
      "80mm Thermal Receipt Printer",
      "2-Up Dual Roll Label Printer (50x25mm)",
      "High-Speed Laser Barcode Scanner",
      "Heavy Duty Cash Drawer",
    ],
    onboardingNotes: "Demo & testing client account pre-loaded with flagship branch, inventory catalog, and loyalty customers.",
    clientVerificationStatus: "VERIFIED",
    gstinRegNumber: "29AABCF4582M1Z5",
    businessLocation: "FreshMart Superstore — Flagship Outlet",
    address: "Plot 42, 100 Feet Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    country: "India",
  },
];

export const DEFAULT_CREDENTIALS: AccessProfile[] = [
  {
    role: "ADMIN" as TUserRole,
    title: "Super Admin Master Controls",
    email: "superadmin@expertbilling.in",
    username: "superadmin",
    password: "123456",
    name: "System Sovereign (Super Admin)",
    color: "violet",
    gradient: "from-purple-500 to-indigo-600",
    bgHover: "hover:bg-purple-500/5",
    accent: "text-purple-400",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/10",
    description: "Sovereign master access credentials for cross-border tenancy.",
    privileges: ["Cross-tenant onboarding", "Global subscription audit", "Database isolation scaling", "Bypassing branch ceilings", "Modify workspace context"],
    phone: "+91 9900112233",
  },
  {
    role: "ADMIN" as TUserRole,
    title: "FreshMart Superstore (Client Admin)",
    email: "demo@freshmart.in",
    username: "freshmart_demo",
    password: "Demo@2026",
    name: "Aarav Sharma",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    bgHover: "hover:bg-emerald-500/5",
    accent: "text-emerald-500",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
    description: "Demo & testing client store administrator account for FreshMart Superstore.",
    privileges: [
      "POS & Multi-Customer Billing",
      "Inventory & Barcode Labels",
      "Thermal Printer & Font Settings",
      "Profit, GST & Sales Reports",
      "Customer Loyalty & Staff Admin",
    ],
    storeBranchId: "B1",
    tenantId: "TENANT-DEMO-01",
    phone: "+91 98765 43210",
  },
];

export const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: "SUP-DEMO-01",
    name: "Metro Wholesale Distributors",
    contact: "Rajesh Verma",
    phone: "+91 98111 22334",
    email: "supply@metrowholesale.in",
    gstin: "29AAACM9988K1Z2",
  },
];

export const DEFAULT_BRANCHES: StoreBranch[] = [
  {
    id: "B1",
    name: "FreshMart Indiranagar Flagship",
    address: "Plot 42, 100 Feet Road, Indiranagar",
    city: "Bengaluru",
    phone: "+91 98765 43210",
    gstin: "29AABCF4582M1Z5",
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "SKU-546456",
    name: "Pure Cow Ghee Jar 500g",
    barcode: "8901234500011",
    category: "Dairy & Eggs",
    sku: "SKU-546456",
    purchasePrice: 295,
    price: 360,
    mrp: 395,
    gstRate: 12,
    unit: MeasurementUnit.GRAM,
    unitQuantity: 500,
    unitLabel: "500g Jar",
    stock: 40,
    minStockAlert: 8,
    batchNumber: "FM-GH-2601",
    expiryDate: "2027-06-30",
    supplierName: "Metro Wholesale Distributors",
    tenantId: "TENANT-DEMO-01",
    branchStocks: { B1: 40 },
  },
  {
    id: "SKU-543559",
    name: "Farm Harvest Toor Dal 1Kg",
    barcode: "8901234500028",
    category: "Grains & Grocery",
    sku: "SKU-543559",
    purchasePrice: 118,
    price: 145,
    mrp: 165,
    gstRate: 5,
    unit: MeasurementUnit.KG,
    unitQuantity: 1,
    unitLabel: "1 Kg Pack",
    stock: 55,
    minStockAlert: 10,
    batchNumber: "FM-TD-2603",
    expiryDate: "2027-09-15",
    supplierName: "Metro Wholesale Distributors",
    tenantId: "TENANT-DEMO-01",
    branchStocks: { B1: 55 },
  },
  {
    id: "SKU-888963",
    name: "Multigrain Breakfast Muesli 400g",
    barcode: "8901234500035",
    category: "Snacks & Confectionery",
    sku: "SKU-888963",
    purchasePrice: 135,
    price: 175,
    mrp: 199,
    gstRate: 18,
    unit: MeasurementUnit.PACK,
    unitQuantity: 400,
    unitLabel: "400g Box",
    stock: 32,
    minStockAlert: 8,
    batchNumber: "FM-MS-2602",
    expiryDate: "2027-05-20",
    supplierName: "Metro Wholesale Distributors",
    tenantId: "TENANT-DEMO-01",
    branchStocks: { B1: 32 },
  },
  {
    id: "SKU-976656",
    name: "Crunchy Salted Peanuts 200g",
    barcode: "8901234500042",
    category: "Snacks & Confectionery",
    sku: "SKU-976656",
    purchasePrice: 38,
    price: 52,
    mrp: 60,
    gstRate: 12,
    unit: MeasurementUnit.PACK,
    unitQuantity: 200,
    unitLabel: "200g Pouch",
    stock: 60,
    minStockAlert: 12,
    batchNumber: "FM-PN-2604",
    expiryDate: "2027-04-10",
    supplierName: "Metro Wholesale Distributors",
    tenantId: "TENANT-DEMO-01",
    branchStocks: { B1: 60 },
  },
  {
    id: "SKU-310240",
    name: "Cold-Pressed Alphonso Mango Juice 1L",
    barcode: "8901234500059",
    category: "Beverages & Juices",
    sku: "SKU-310240",
    purchasePrice: 82,
    price: 110,
    mrp: 125,
    gstRate: 12,
    unit: MeasurementUnit.LITER,
    unitQuantity: 1,
    unitLabel: "1 Liter Tetra",
    stock: 48,
    minStockAlert: 10,
    batchNumber: "FM-MJ-2605",
    expiryDate: "2027-03-31",
    supplierName: "Metro Wholesale Distributors",
    tenantId: "TENANT-DEMO-01",
    branchStocks: { B1: 48 },
  },
  {
    id: "SKU-774120",
    name: "Herbal Neem & Aloe Handwash 500mL",
    barcode: "8901234500066",
    category: "Personal Care & Hygiene",
    sku: "SKU-774120",
    purchasePrice: 90,
    price: 129,
    mrp: 149,
    gstRate: 18,
    unit: MeasurementUnit.ML,
    unitQuantity: 500,
    unitLabel: "500mL Pump",
    stock: 28,
    minStockAlert: 6,
    batchNumber: "FM-HW-2601",
    expiryDate: "2028-01-31",
    supplierName: "Metro Wholesale Distributors",
    tenantId: "TENANT-DEMO-01",
    branchStocks: { B1: 28 },
  },
];

export const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: "CUST-DEMO-01",
    name: "Priya Nair",
    phone: "+91 98450 11223",
    email: "priya.nair@example.com",
    loyaltyPoints: 180,
    creditBalance: 500,
    createdAt: "2026-02-01T10:30:00Z",
  },
  {
    id: "CUST-DEMO-02",
    name: "Rohan Mehta",
    phone: "+91 98450 44556",
    email: "rohan.mehta@example.com",
    loyaltyPoints: 95,
    creditBalance: 0,
    createdAt: "2026-02-10T14:15:00Z",
  },
  {
    id: "CUST-DEMO-03",
    name: "Ananya Iyer",
    phone: "+91 98450 77889",
    email: "ananya.iyer@example.com",
    loyaltyPoints: 320,
    creditBalance: 250,
    createdAt: "2026-02-18T17:45:00Z",
  },
];

export const DEFAULT_INVOICES: Invoice[] = [];

export const DEFAULT_EXPENSES: Expense[] = [];

export const DEFAULT_ADJUSTMENTS: StockAdjustment[] = [];

export interface FullDbState {
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  invoices: Invoice[];
  branches: StoreBranch[];
  expenses: Expense[];
  adjustments: StockAdjustment[];
  cashSessions: CashSession[];
  transfers: StockTransfer[];
  tenants: Tenant[];
  credentials: AccessProfile[];
  categories: string[];
  settings: ExtendedAppSettings;
  dbStatus?: {
    connected: boolean;
    mode: "MYSQL_LIVE" | "PREVIEW_ISOLATED" | "REMOTE_ACCESS_BLOCKED_IN_PREVIEW";
    host: string;
    port: number;
    database: string;
    user: string;
    lastChecked: string;
    errorDetail?: string | null;
  };
}
