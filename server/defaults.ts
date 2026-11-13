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

export const DEFAULT_CATEGORIES: string[] = [];

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
  activeTenantId: "",
  currentBranchId: "",
  printerLayout: "thermal-80mm",
  labelPrinterConfig: DEFAULT_LABEL_PRINTER_CONFIG,
};

export const DEFAULT_TENANTS: Tenant[] = [];

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
];

export const DEFAULT_SUPPLIERS: Supplier[] = [];

export const DEFAULT_BRANCHES: StoreBranch[] = [];

export const DEFAULT_PRODUCTS: Product[] = [];

export const DEFAULT_CUSTOMERS: Customer[] = [];

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
