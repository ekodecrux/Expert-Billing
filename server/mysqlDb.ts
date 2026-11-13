import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import {
  AccessProfile,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_APP_SETTINGS,
  DEFAULT_BRANCHES,
  DEFAULT_CATEGORIES,
  DEFAULT_CREDENTIALS,
  DEFAULT_CUSTOMERS,
  DEFAULT_EXPENSES,
  DEFAULT_INVOICES,
  DEFAULT_LABEL_PRINTER_CONFIG,
  DEFAULT_PRODUCTS,
  DEFAULT_SUPPLIERS,
  DEFAULT_TENANTS,
  ExtendedAppSettings,
  FullDbState,
  MeasurementUnit,
} from "./defaults.ts";
import type {
  CashSession,
  Customer,
  Expense,
  Invoice,
  InvoiceItem,
  MeasurementUnit as TMeasurementUnit,
  PaymentMode as TPaymentMode,
  Product,
  StockAdjustment,
  StockTransfer,
  StoreBranch,
  Supplier,
  Tenant,
  UserRole as TUserRole,
} from "../src/types.ts";

function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

function getDbConfigCandidates() {
  const rawEnvPort = Number(process.env.DB_PORT);
  // 65002 is Hostinger's SSH port; MySQL always listens on 3306 (or custom non-SSH DB_PORT)
  const port = rawEnvPort && rawEnvPort !== 65002 ? rawEnvPort : 3306;
  const user = process.env.DB_USER || "u559264694_expertbilling";
  const password = process.env.DB_PASS || "Billing2026";
  const database = process.env.DB_NAME || "u559264694_expertbilling";
  const isProd = process.env.NODE_ENV === "production";
  const rawEnvHost = process.env.DB_HOST?.trim();
  const envHost = rawEnvHost === "142.79.209.120" ? "145.79.209.120" : rawEnvHost;

  const rawHosts = envHost
    ? isProd
      ? ["localhost", envHost, "145.79.209.120"]
      : [envHost, "145.79.209.120", "localhost"]
    : isProd
      ? ["localhost", "145.79.209.120"]
      : ["145.79.209.120", "localhost"];

  const hosts = Array.from(new Set(rawHosts.filter(Boolean)));
  return { hosts, port, user, password, database };
}

function safeJsonParse<T>(raw: any, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;
  if (typeof raw === "object") return raw as T;
  try {
    return JSON.parse(String(raw)) as T;
  } catch {
    return fallback;
  }
}

function toSqlDate(d?: string | null): string | null {
  if (!d) return null;
  const trimmed = String(d).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return null;
}

class MySqlDatabaseEngine {
  private pool: Pool | null = null;
  private activeHost: string = "145.79.209.120";
  private lastError: string | null = null;
  private lastChecked: string = new Date().toISOString();
  private lastAttemptMs: number = 0;
  private schemaReady = false;
  private loggedPreviewNotice = false;

  // Transient in-memory state used in AI Studio Preview (NODE_ENV !== "production")
  private runtimeMemoryState: FullDbState;

  constructor() {
    this.runtimeMemoryState = this.createDefaultState();
    this.normalizeProductBranchStocks(this.runtimeMemoryState.products, this.runtimeMemoryState.branches);
  }

  private isProductionRuntime(): boolean {
    return process.env.NODE_ENV === "production";
  }

  private createDefaultState(): FullDbState {
    return {
      products: clone(DEFAULT_PRODUCTS),
      suppliers: clone(DEFAULT_SUPPLIERS),
      customers: clone(DEFAULT_CUSTOMERS),
      invoices: clone(DEFAULT_INVOICES),
      branches: clone(DEFAULT_BRANCHES),
      expenses: clone(DEFAULT_EXPENSES),
      adjustments: clone(DEFAULT_ADJUSTMENTS),
      cashSessions: [],
      transfers: [],
      tenants: clone(DEFAULT_TENANTS),
      credentials: clone(DEFAULT_CREDENTIALS),
      categories: clone(DEFAULT_CATEGORIES),
      settings: clone(DEFAULT_APP_SETTINGS),
    };
  }

  private normalizeProductBranchStocks(products: Product[], branches: StoreBranch[]) {
    for (const p of products) {
      if (!p.branchStocks) p.branchStocks = {};
      for (const b of branches) {
        if (p.branchStocks[b.id] === undefined) {
          if (b.id === "B1") p.branchStocks[b.id] = Number(p.stock || 0);
          else if (b.id === "B2") p.branchStocks[b.id] = Math.max(2, Math.floor((p.stock || 50) * 0.6));
          else p.branchStocks[b.id] = Math.max(1, Math.floor((p.stock || 50) * 0.3));
        }
      }
    }
  }

  public getStatus() {
    const cfg = getDbConfigCandidates();
    const isProd = this.isProductionRuntime();
    return {
      connected: Boolean(isProd && this.pool && this.schemaReady),
      mode: (!isProd
        ? "PREVIEW_ISOLATED"
        : this.pool && this.schemaReady
        ? "MYSQL_LIVE"
        : "REMOTE_ACCESS_BLOCKED_IN_PREVIEW") as
        | "MYSQL_LIVE"
        | "PREVIEW_ISOLATED"
        | "REMOTE_ACCESS_BLOCKED_IN_PREVIEW",
      host: isProd ? this.activeHost || cfg.hosts[0] : "preview-isolated",
      port: cfg.port,
      database: cfg.database,
      user: cfg.user,
      lastChecked: this.lastChecked,
      errorDetail: isProd ? this.lastError : null,
    };
  }

  public async connectAndInitialize(force: boolean = false): Promise<ReturnType<MySqlDatabaseEngine["getStatus"]>> {
    this.lastChecked = new Date().toISOString();

    // Studio Preview must NEVER sync with or connect to the live production database
    if (!this.isProductionRuntime()) {
      if (this.pool) {
        try {
          await this.pool.end();
        } catch {}
        this.pool = null;
      }
      this.schemaReady = false;
      this.lastError = null;
      if (!this.loggedPreviewNotice) {
        this.loggedPreviewNotice = true;
        console.log("[MySQL] Studio Preview Mode (NODE_ENV !== 'production'): Live database connection & sync disabled. Production builds connect to MySQL automatically.");
      }
      return this.getStatus();
    }

    const cfg = getDbConfigCandidates();
    const now = Date.now();

    if (this.pool) {
      try {
        await this.pool.query("SELECT 1");
        if (!this.schemaReady) {
          await this.ensureSchema(this.pool);
          await this.migrateLiveToCleanSuperAdminIfLegacy(this.pool);
          await this.seedIfEmpty(this.pool);
          this.schemaReady = true;
        }
        this.lastError = null;
        return this.getStatus();
      } catch (err: any) {
        this.lastError = err?.message || String(err);
        try {
          await this.pool.end();
        } catch {}
        this.pool = null;
        this.schemaReady = false;
      }
    }

    // Avoid re-hammering MySQL if production DB is temporarily unreachable; allow immediate retry when force=true
    if (!force && this.lastAttemptMs > 0 && now - this.lastAttemptMs < 30000) {
      return this.getStatus();
    }
    this.lastAttemptMs = now;

    const errors: string[] = [];
    for (const host of cfg.hosts) {
      let candidatePool: Pool | null = null;
      try {
        candidatePool = mysql.createPool({
          host,
          port: cfg.port,
          user: cfg.user,
          password: cfg.password,
          database: cfg.database,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 4500,
          enableKeepAlive: true,
          keepAliveInitialDelay: 10000,
        });
        await candidatePool.query("SELECT 1");
        this.pool = candidatePool;
        this.activeHost = host;
        await this.ensureSchema(candidatePool);
        await this.migrateLiveToCleanSuperAdminIfLegacy(candidatePool);
        await this.seedIfEmpty(candidatePool);
        this.schemaReady = true;
        this.lastError = null;
        this.loggedPreviewNotice = false;
        console.log(`[MySQL] Connected LIVE (Production) to ${cfg.database} @ ${host}:${cfg.port}`);
        return this.getStatus();
      } catch (err: any) {
        errors.push(`${host}:${cfg.port} -> ${err?.code || ""} ${err?.message || err}`);
        if (candidatePool) {
          try {
            await candidatePool.end();
          } catch {}
        }
      }
    }

    this.pool = null;
    this.schemaReady = false;
    this.activeHost = cfg.hosts[0];
    this.lastError = errors.join(" | ");
    if (!this.loggedPreviewNotice || force) {
      this.loggedPreviewNotice = true;
      console.warn(`[MySQL] Production connection failed (${this.activeHost}:${cfg.port}): ${this.lastError}`);
    }
    return this.getStatus();
  }

  private async getLivePool(): Promise<Pool | null> {
    if (!this.isProductionRuntime()) return null;
    if (this.pool && this.schemaReady) return this.pool;
    await this.connectAndInitialize(false);
    return this.pool && this.schemaReady ? this.pool : null;
  }

  private async addColumnIfMissing(pool: Pool, table: string, column: string, definition: string) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column]
    );
    if (Number(rows[0]?.cnt || 0) === 0) {
      await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    }
  }

  private async ensureSchema(pool: Pool) {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`tenants\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`name\` VARCHAR(255) NOT NULL,
        \`subdomain\` VARCHAR(100) NOT NULL,
        \`domain_url\` VARCHAR(255) DEFAULT NULL,
        \`domain_status\` VARCHAR(40) DEFAULT 'ACTIVE',
        \`business_sector\` VARCHAR(50) DEFAULT 'SUPERMARKET',
        \`sector_config\` JSON DEFAULT NULL,
        \`typography\` JSON DEFAULT NULL,
        \`admin_email\` VARCHAR(255) NOT NULL,
        \`admin_login_id\` VARCHAR(100) DEFAULT NULL,
        \`password_hash\` VARCHAR(255) DEFAULT NULL,
        \`phone\` VARCHAR(30) DEFAULT NULL,
        \`currency\` VARCHAR(10) NOT NULL DEFAULT '₹',
        \`tier\` VARCHAR(30) NOT NULL DEFAULT 'GROWTH',
        \`status\` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
        \`color_theme\` VARCHAR(50) NOT NULL DEFAULT 'emerald',
        \`max_branches\` INT NOT NULL DEFAULT 5,
        \`max_products\` INT NOT NULL DEFAULT 10000,
        \`onboarding_fee_paid\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`monthly_subscription_fee\` DECIMAL(12,2) NOT NULL DEFAULT 1499.00,
        \`billing_cycle\` VARCHAR(30) NOT NULL DEFAULT 'MONTHLY',
        \`last_payment_amount\` DECIMAL(12,2) DEFAULT 0.00,
        \`last_payment_date\` DATE DEFAULT NULL,
        \`subscription_start_date\` DATE DEFAULT NULL,
        \`subscription_end_date\` DATE DEFAULT NULL,
        \`contract_duration_months\` INT NOT NULL DEFAULT 12,
        \`renewal_status\` VARCHAR(40) NOT NULL DEFAULT 'AUTO_RENEW',
        \`onboarding_setup_status\` VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
        \`hardware_provisioned\` JSON DEFAULT NULL,
        \`onboarding_notes\` TEXT DEFAULT NULL,
        \`client_verification_status\` VARCHAR(40) NOT NULL DEFAULT 'VERIFIED',
        \`gstin_reg_number\` VARCHAR(50) DEFAULT NULL,
        \`business_location\` VARCHAR(255) DEFAULT NULL,
        \`address\` TEXT DEFAULT NULL,
        \`city\` VARCHAR(100) DEFAULT NULL,
        \`state\` VARCHAR(100) DEFAULT NULL,
        \`pincode\` VARCHAR(20) DEFAULT NULL,
        \`country\` VARCHAR(80) DEFAULT 'India',
        \`company_logo\` MEDIUMTEXT DEFAULT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_tenant_subdomain\` (\`subdomain\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`store_branches\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`name\` VARCHAR(255) NOT NULL,
        \`address\` TEXT NOT NULL,
        \`city\` VARCHAR(100) NOT NULL,
        \`phone\` VARCHAR(30) NOT NULL,
        \`gstin\` VARCHAR(50) DEFAULT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) DEFAULT 'TENANT-001',
        \`branch_id\` VARCHAR(64) DEFAULT NULL,
        \`name\` VARCHAR(255) NOT NULL,
        \`username\` VARCHAR(120) NOT NULL,
        \`email\` VARCHAR(255) DEFAULT NULL,
        \`phone\` VARCHAR(30) DEFAULT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`pin_code\` VARCHAR(10) DEFAULT '1234',
        \`role\` VARCHAR(40) NOT NULL DEFAULT 'CASHIER',
        \`title\` VARCHAR(150) DEFAULT NULL,
        \`color\` VARCHAR(40) DEFAULT 'emerald',
        \`gradient\` VARCHAR(100) DEFAULT NULL,
        \`bg_hover\` VARCHAR(100) DEFAULT NULL,
        \`accent\` VARCHAR(100) DEFAULT NULL,
        \`border_class\` VARCHAR(100) DEFAULT NULL,
        \`glow\` VARCHAR(100) DEFAULT NULL,
        \`description\` TEXT DEFAULT NULL,
        \`privileges\` JSON DEFAULT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`last_login_at\` TIMESTAMP NULL DEFAULT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`suppliers\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`name\` VARCHAR(255) NOT NULL,
        \`contact\` VARCHAR(255) DEFAULT NULL,
        \`phone\` VARCHAR(30) NOT NULL,
        \`email\` VARCHAR(255) DEFAULT NULL,
        \`gstin\` VARCHAR(50) DEFAULT NULL,
        \`address\` TEXT DEFAULT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`categories\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`name\` VARCHAR(150) NOT NULL,
        \`description\` TEXT DEFAULT NULL,
        \`sort_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`products\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`name\` VARCHAR(255) NOT NULL,
        \`barcode\` VARCHAR(100) NOT NULL,
        \`category\` VARCHAR(150) NOT NULL,
        \`category_id\` VARCHAR(64) DEFAULT NULL,
        \`sku\` VARCHAR(100) NOT NULL,
        \`purchase_price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`mrp\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`gst_rate\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
        \`hsn_code\` VARCHAR(20) DEFAULT NULL,
        \`unit\` VARCHAR(40) NOT NULL DEFAULT 'Pieces',
        \`unit_quantity\` DECIMAL(10,3) DEFAULT 1.000,
        \`unit_label\` VARCHAR(60) DEFAULT NULL,
        \`stock\` INT NOT NULL DEFAULT 0,
        \`min_stock_alert\` INT NOT NULL DEFAULT 10,
        \`batch_number\` VARCHAR(100) NOT NULL DEFAULT 'B-01',
        \`expiry_date\` VARCHAR(30) DEFAULT NULL,
        \`supplier_name\` VARCHAR(255) DEFAULT NULL,
        \`supplier_id\` VARCHAR(64) DEFAULT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`branch_inventory\` (
        \`id\` BIGINT AUTO_INCREMENT NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`branch_id\` VARCHAR(64) NOT NULL,
        \`product_id\` VARCHAR(64) NOT NULL,
        \`stock_quantity\` INT NOT NULL DEFAULT 0,
        \`min_stock_alert\` INT NOT NULL DEFAULT 10,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_branch_product\` (\`branch_id\`, \`product_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`customers\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`name\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(30) NOT NULL,
        \`email\` VARCHAR(255) DEFAULT NULL,
        \`loyalty_points\` INT NOT NULL DEFAULT 0,
        \`credit_balance\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`total_spent\` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`invoices\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`store_branch_id\` VARCHAR(64) NOT NULL DEFAULT 'B1',
        \`invoice_date\` VARCHAR(20) NOT NULL,
        \`invoice_time\` VARCHAR(25) NOT NULL,
        \`customer_id\` VARCHAR(64) DEFAULT NULL,
        \`customer_name\` VARCHAR(255) DEFAULT NULL,
        \`customer_phone\` VARCHAR(30) DEFAULT NULL,
        \`subtotal\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`tax_amount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`discount_percent\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
        \`discount_amount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`total_mrp_value\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`total_mrp_savings\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`coupon_code\` VARCHAR(50) DEFAULT NULL,
        \`grand_total\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`payment_mode\` VARCHAR(30) NOT NULL DEFAULT 'CASH',
        \`cash_received\` DECIMAL(12,2) DEFAULT 0.00,
        \`change_returned\` DECIMAL(12,2) DEFAULT 0.00,
        \`cashier_name\` VARCHAR(255) NOT NULL,
        \`cashier_id\` VARCHAR(64) DEFAULT NULL,
        \`status\` VARCHAR(30) NOT NULL DEFAULT 'PAID',
        \`returned_reason\` TEXT DEFAULT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`invoice_items\` (
        \`id\` BIGINT AUTO_INCREMENT NOT NULL,
        \`invoice_id\` VARCHAR(64) NOT NULL,
        \`product_id\` VARCHAR(64) DEFAULT NULL,
        \`name\` VARCHAR(255) NOT NULL,
        \`barcode\` VARCHAR(100) NOT NULL,
        \`mrp\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`price\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`quantity\` DECIMAL(10,3) NOT NULL DEFAULT 1.000,
        \`unit\` VARCHAR(40) NOT NULL DEFAULT 'Pieces',
        \`unit_quantity\` DECIMAL(10,3) DEFAULT 1.000,
        \`unit_label\` VARCHAR(60) DEFAULT NULL,
        \`gst_rate\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
        \`gst_amount\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`subtotal\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_item_invoice\` (\`invoice_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`cash_sessions\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`store_branch_id\` VARCHAR(64) NOT NULL DEFAULT 'B1',
        \`cashier_id\` VARCHAR(64) NOT NULL,
        \`cashier_name\` VARCHAR(255) NOT NULL,
        \`start_time\` VARCHAR(64) NOT NULL,
        \`end_time\` VARCHAR(64) DEFAULT NULL,
        \`opening_balance\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`closing_balance\` DECIMAL(12,2) DEFAULT NULL,
        \`actual_cash_in_drawer\` DECIMAL(12,2) DEFAULT NULL,
        \`difference\` DECIMAL(12,2) DEFAULT NULL,
        \`sales_cash\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`sales_upi\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`sales_card\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        \`status\` VARCHAR(20) NOT NULL DEFAULT 'OPEN',
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`stock_adjustments\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`store_branch_id\` VARCHAR(64) DEFAULT NULL,
        \`product_id\` VARCHAR(64) NOT NULL,
        \`product_name\` VARCHAR(255) NOT NULL,
        \`adjustment_date\` VARCHAR(20) NOT NULL,
        \`previous_stock\` INT NOT NULL,
        \`new_stock\` INT NOT NULL,
        \`reason\` VARCHAR(255) NOT NULL,
        \`adjusted_by\` VARCHAR(255) NOT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`stock_transfers\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`product_id\` VARCHAR(64) NOT NULL,
        \`product_name\` VARCHAR(255) NOT NULL,
        \`sku\` VARCHAR(100) NOT NULL,
        \`from_branch_id\` VARCHAR(64) NOT NULL,
        \`to_branch_id\` VARCHAR(64) NOT NULL,
        \`quantity\` INT NOT NULL,
        \`status\` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        \`requested_by\` VARCHAR(255) NOT NULL,
        \`requested_date\` VARCHAR(20) NOT NULL,
        \`actioned_by\` VARCHAR(255) DEFAULT NULL,
        \`actioned_date\` VARCHAR(20) DEFAULT NULL,
        \`comments\` TEXT DEFAULT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`expenses\` (
        \`id\` VARCHAR(64) NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`store_branch_id\` VARCHAR(64) NOT NULL DEFAULT 'B1',
        \`expense_date\` VARCHAR(20) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`amount\` DECIMAL(12,2) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`approved_by\` VARCHAR(255) NOT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`app_settings\` (
        \`id\` BIGINT AUTO_INCREMENT NOT NULL,
        \`tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'GLOBAL',
        \`store_branch_id\` VARCHAR(64) NOT NULL DEFAULT 'DEFAULT',
        \`auto_print_receipt\` TINYINT(1) NOT NULL DEFAULT 1,
        \`enable_sound\` TINYINT(1) NOT NULL DEFAULT 1,
        \`receipt_header\` TEXT DEFAULT NULL,
        \`receipt_footer\` TEXT DEFAULT NULL,
        \`max_discount_allowed\` DECIMAL(5,2) NOT NULL DEFAULT 25.00,
        \`printer_layout\` VARCHAR(30) NOT NULL DEFAULT 'thermal-80mm',
        \`attractive_mode\` VARCHAR(40) NOT NULL DEFAULT 'mint',
        \`login_bg_mode\` VARCHAR(40) NOT NULL DEFAULT 'cosmic-aurora',
        \`active_tenant_id\` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
        \`current_branch_id\` VARCHAR(64) NOT NULL DEFAULT 'B1',
        \`label_printer_config\` JSON DEFAULT NULL,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_tenant_branch_settings\` (\`tenant_id\`, \`store_branch_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Ensure missing columns exist if tables were pre-created with older DDL
    await this.addColumnIfMissing(pool, "tenants", "domain_url", "VARCHAR(255) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "tenants", "domain_status", "VARCHAR(40) DEFAULT 'ACTIVE'");
    await this.addColumnIfMissing(pool, "tenants", "business_sector", "VARCHAR(50) DEFAULT 'SUPERMARKET'");
    await this.addColumnIfMissing(pool, "tenants", "sector_config", "JSON DEFAULT NULL");
    await this.addColumnIfMissing(pool, "tenants", "typography", "JSON DEFAULT NULL");
    await this.addColumnIfMissing(pool, "tenants", "business_location", "VARCHAR(255) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "tenants", "address", "TEXT DEFAULT NULL");
    await this.addColumnIfMissing(pool, "tenants", "city", "VARCHAR(100) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "tenants", "state", "VARCHAR(100) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "tenants", "pincode", "VARCHAR(20) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "tenants", "country", "VARCHAR(80) DEFAULT 'India'");

    await this.addColumnIfMissing(pool, "users", "title", "VARCHAR(150) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "users", "color", "VARCHAR(40) DEFAULT 'emerald'");
    await this.addColumnIfMissing(pool, "users", "gradient", "VARCHAR(100) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "users", "bg_hover", "VARCHAR(100) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "users", "accent", "VARCHAR(100) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "users", "border_class", "VARCHAR(100) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "users", "glow", "VARCHAR(100) DEFAULT NULL");
    await this.addColumnIfMissing(pool, "users", "description", "TEXT DEFAULT NULL");
    await this.addColumnIfMissing(pool, "users", "privileges", "JSON DEFAULT NULL");

    await this.addColumnIfMissing(pool, "categories", "sort_order", "INT NOT NULL DEFAULT 0");

    await this.addColumnIfMissing(pool, "products", "unit_quantity", "DECIMAL(10,3) DEFAULT 1.000");
    await this.addColumnIfMissing(pool, "products", "unit_label", "VARCHAR(60) DEFAULT NULL");

    await this.addColumnIfMissing(pool, "invoice_items", "unit_quantity", "DECIMAL(10,3) DEFAULT 1.000");
    await this.addColumnIfMissing(pool, "invoice_items", "unit_label", "VARCHAR(60) DEFAULT NULL");

    await this.addColumnIfMissing(pool, "app_settings", "attractive_mode", "VARCHAR(40) NOT NULL DEFAULT 'mint'");
    await this.addColumnIfMissing(pool, "app_settings", "login_bg_mode", "VARCHAR(40) NOT NULL DEFAULT 'cosmic-aurora'");
    await this.addColumnIfMissing(pool, "app_settings", "active_tenant_id", "VARCHAR(64) NOT NULL DEFAULT ''");
    await this.addColumnIfMissing(pool, "app_settings", "current_branch_id", "VARCHAR(64) NOT NULL DEFAULT ''");
    await this.addColumnIfMissing(pool, "app_settings", "label_printer_config", "JSON DEFAULT NULL");

    await pool.query("SET FOREIGN_KEY_CHECKS = 1");
  }

  private async countRows(pool: Pool, table: string): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS cnt FROM \`${table}\``);
    return Number(rows[0]?.cnt || 0);
  }

  private async seedIfEmpty(pool: Pool) {
    // Only Super Admin account (password 123456) & global settings are seeded; everything else starts empty
    if ((await this.countRows(pool, "users")) === 0) {
      await this.replaceUsersMysql(pool, DEFAULT_CREDENTIALS);
    }
    if ((await this.countRows(pool, "app_settings")) === 0) {
      await this.upsertSettingsMysql(pool, DEFAULT_APP_SETTINGS);
    }
  }

  // One-time automatic migration on live production MySQL if still holding legacy pre-cleanup seed data
  private async migrateLiveToCleanSuperAdminIfLegacy(pool: Pool) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT \`id\`, \`password_hash\` FROM \`users\` WHERE LOWER(\`email\`) = 'superadmin@expertbilling.in' OR LOWER(\`username\`) = 'superadmin' LIMIT 1`
      );
      if (rows.length > 0 && String(rows[0].password_hash || "") === "SuperAdminMasterKey2026") {
        console.log("[MySQL] Detected legacy pre-cleanup database state on live server. Cleaning tables except Super Admin and updating Super Admin password to 123456...");
        await this.cleanDatabaseExceptSuperAdminMysql(pool);
      }
    } catch (err: any) {
      console.warn("[MySQL] Legacy cleanup check skipped:", err?.message || err);
    }
  }

  private async cleanDatabaseExceptSuperAdminMysql(pool: Pool) {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    const tablesToClear = [
      "invoice_items",
      "invoices",
      "expenses",
      "stock_adjustments",
      "stock_transfers",
      "cash_sessions",
      "customers",
      "branch_inventory",
      "products",
      "categories",
      "suppliers",
      "store_branches",
      "tenants",
      "users",
    ];
    for (const tbl of tablesToClear) {
      await pool.query(`DELETE FROM \`${tbl}\``);
    }
    await pool.query("SET FOREIGN_KEY_CHECKS = 1");

    await this.replaceUsersMysql(pool, DEFAULT_CREDENTIALS);
    await this.upsertSettingsMysql(pool, DEFAULT_APP_SETTINGS);
  }

  private async upsertTenantsMysql(conn: Pool | PoolConnection, tenants: Tenant[]) {
    for (const t of tenants) {
      await conn.query(
        `INSERT INTO \`tenants\` (
          \`id\`, \`name\`, \`subdomain\`, \`domain_url\`, \`domain_status\`, \`business_sector\`,
          \`sector_config\`, \`typography\`, \`admin_email\`, \`admin_login_id\`, \`password_hash\`,
          \`phone\`, \`currency\`, \`tier\`, \`status\`, \`color_theme\`, \`max_branches\`, \`max_products\`,
          \`onboarding_fee_paid\`, \`monthly_subscription_fee\`, \`billing_cycle\`,
          \`last_payment_amount\`, \`last_payment_date\`, \`subscription_start_date\`, \`subscription_end_date\`,
          \`contract_duration_months\`, \`renewal_status\`, \`onboarding_setup_status\`,
          \`hardware_provisioned\`, \`onboarding_notes\`, \`client_verification_status\`, \`gstin_reg_number\`,
          \`business_location\`, \`address\`, \`city\`, \`state\`, \`pincode\`, \`country\`, \`company_logo\`
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          \`name\`=VALUES(\`name\`), \`subdomain\`=VALUES(\`subdomain\`), \`domain_url\`=VALUES(\`domain_url\`),
          \`domain_status\`=VALUES(\`domain_status\`), \`business_sector\`=VALUES(\`business_sector\`),
          \`sector_config\`=VALUES(\`sector_config\`), \`typography\`=VALUES(\`typography\`),
          \`admin_email\`=VALUES(\`admin_email\`), \`admin_login_id\`=VALUES(\`admin_login_id\`),
          \`password_hash\`=VALUES(\`password_hash\`), \`phone\`=VALUES(\`phone\`),
          \`currency\`=VALUES(\`currency\`), \`tier\`=VALUES(\`tier\`), \`status\`=VALUES(\`status\`),
          \`color_theme\`=VALUES(\`color_theme\`), \`max_branches\`=VALUES(\`max_branches\`),
          \`max_products\`=VALUES(\`max_products\`), \`onboarding_fee_paid\`=VALUES(\`onboarding_fee_paid\`),
          \`monthly_subscription_fee\`=VALUES(\`monthly_subscription_fee\`), \`billing_cycle\`=VALUES(\`billing_cycle\`),
          \`last_payment_amount\`=VALUES(\`last_payment_amount\`), \`last_payment_date\`=VALUES(\`last_payment_date\`),
          \`subscription_start_date\`=VALUES(\`subscription_start_date\`), \`subscription_end_date\`=VALUES(\`subscription_end_date\`),
          \`contract_duration_months\`=VALUES(\`contract_duration_months\`), \`renewal_status\`=VALUES(\`renewal_status\`),
          \`onboarding_setup_status\`=VALUES(\`onboarding_setup_status\`), \`hardware_provisioned\`=VALUES(\`hardware_provisioned\`),
          \`onboarding_notes\`=VALUES(\`onboarding_notes\`), \`client_verification_status\`=VALUES(\`client_verification_status\`),
          \`gstin_reg_number\`=VALUES(\`gstin_reg_number\`), \`business_location\`=VALUES(\`business_location\`),
          \`address\`=VALUES(\`address\`), \`city\`=VALUES(\`city\`), \`state\`=VALUES(\`state\`),
          \`pincode\`=VALUES(\`pincode\`), \`country\`=VALUES(\`country\`), \`company_logo\`=VALUES(\`company_logo\`)`,
        [
          t.id,
          t.name,
          t.subdomain || t.id.toLowerCase(),
          t.domainUrl || null,
          t.domainStatus || "ACTIVE",
          t.businessSector || "SUPERMARKET",
          t.sectorConfig ? JSON.stringify(t.sectorConfig) : null,
          t.typography ? JSON.stringify(t.typography) : null,
          t.adminEmail || "",
          t.adminLoginId || null,
          t.adminPassword || null,
          t.phone || null,
          t.currency || "₹",
          t.tier || "GROWTH",
          t.status || "ACTIVE",
          t.colorTheme || "emerald",
          Number(t.maxBranches || 5),
          Number(t.maxProducts || 100),
          Number(t.onboardingFeePaid || 0),
          Number(t.monthlySubscriptionFee || 0),
          t.billingCycle || "MONTHLY",
          Number(t.lastPaymentAmount || 0),
          toSqlDate(t.lastPaymentDate),
          toSqlDate(t.subscriptionStartDate),
          toSqlDate(t.subscriptionEndDate),
          Number(t.contractDurationMonths || 12),
          t.renewalStatus || "AUTO_RENEW",
          t.onboardingSetupStatus || "COMPLETED",
          JSON.stringify(t.hardwareProvisioned || []),
          t.onboardingNotes || null,
          t.clientVerificationStatus || "VERIFIED",
          t.gstinRegNumber || null,
          t.businessLocation || null,
          t.address || null,
          t.city || null,
          t.state || null,
          t.pincode || null,
          t.country || "India",
          t.companyLogo || null,
        ]
      );
    }
  }

  private async replaceUsersMysql(conn: Pool | PoolConnection, credentials: AccessProfile[]) {
    for (let i = 0; i < credentials.length; i++) {
      const c = credentials[i];
      const userId = `USR-${c.email.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase().slice(0, 48)}`;
      const username = (c.username || c.email || `user_${i}`).slice(0, 100);
      await conn.query(
        `INSERT INTO \`users\` (
          \`id\`, \`tenant_id\`, \`branch_id\`, \`name\`, \`username\`, \`email\`, \`phone\`,
          \`password_hash\`, \`role\`, \`title\`, \`color\`, \`gradient\`, \`bg_hover\`, \`accent\`,
          \`border_class\`, \`glow\`, \`description\`, \`privileges\`, \`is_active\`
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)
        ON DUPLICATE KEY UPDATE
          \`tenant_id\`=VALUES(\`tenant_id\`), \`branch_id\`=VALUES(\`branch_id\`), \`name\`=VALUES(\`name\`),
          \`username\`=VALUES(\`username\`), \`email\`=VALUES(\`email\`), \`phone\`=VALUES(\`phone\`),
          \`password_hash\`=VALUES(\`password_hash\`), \`role\`=VALUES(\`role\`), \`title\`=VALUES(\`title\`),
          \`color\`=VALUES(\`color\`), \`gradient\`=VALUES(\`gradient\`), \`bg_hover\`=VALUES(\`bg_hover\`),
          \`accent\`=VALUES(\`accent\`), \`border_class\`=VALUES(\`border_class\`), \`glow\`=VALUES(\`glow\`),
          \`description\`=VALUES(\`description\`), \`privileges\`=VALUES(\`privileges\`), \`is_active\`=1`,
        [
          userId,
          c.tenantId || null,
          c.storeBranchId || null,
          c.name,
          username,
          c.email,
          c.phone || null,
          c.password,
          c.role || "CASHIER",
          c.title || c.name,
          c.color || "emerald",
          c.gradient || "from-emerald-500 to-teal-600",
          c.bgHover || "hover:bg-emerald-500/5",
          c.accent || "text-emerald-500",
          c.border || "border-emerald-500/20",
          c.glow || "shadow-emerald-500/10",
          c.description || "",
          JSON.stringify(c.privileges || []),
        ]
      );
    }
    const keepIds = credentials.map((c) => `USR-${c.email.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase().slice(0, 48)}`);
    if (keepIds.length > 0) {
      await conn.query(`DELETE FROM \`users\` WHERE \`id\` NOT IN (?)`, [keepIds]);
    }
  }

  private async replaceCategoriesMysql(conn: Pool | PoolConnection, categories: string[]) {
    const clean = Array.from(new Set(categories.map((c) => c.trim()).filter(Boolean)));
    await conn.query(`DELETE FROM \`categories\``);
    for (let i = 0; i < clean.length; i++) {
      const catId = `CAT-${String(i + 1).padStart(2, "0")}`;
      await conn.query(
        `INSERT INTO \`categories\` (\`id\`, \`tenant_id\`, \`name\`, \`sort_order\`) VALUES (?, '', ?, ?)`,
        [catId, clean[i], i + 1]
      );
    }
  }

  private async upsertBranchMysql(conn: Pool | PoolConnection, b: StoreBranch) {
    await conn.query(
      `INSERT INTO \`store_branches\` (\`id\`, \`tenant_id\`, \`name\`, \`address\`, \`city\`, \`phone\`, \`gstin\`, \`is_active\`)
       VALUES (?, 'TENANT-001', ?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`address\`=VALUES(\`address\`), \`city\`=VALUES(\`city\`), \`phone\`=VALUES(\`phone\`), \`gstin\`=VALUES(\`gstin\`)`,
      [b.id, b.name, b.address || "", b.city || "", b.phone || "", b.gstin || null]
    );
  }

  private async upsertSupplierMysql(conn: Pool | PoolConnection, s: Supplier) {
    await conn.query(
      `INSERT INTO \`suppliers\` (\`id\`, \`tenant_id\`, \`name\`, \`contact\`, \`phone\`, \`email\`, \`gstin\`)
       VALUES (?, 'TENANT-001', ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`contact\`=VALUES(\`contact\`), \`phone\`=VALUES(\`phone\`), \`email\`=VALUES(\`email\`), \`gstin\`=VALUES(\`gstin\`)`,
      [s.id, s.name, s.contact || "", s.phone || "", s.email || "", s.gstin || ""]
    );
  }

  private async upsertProductMysql(conn: Pool | PoolConnection, p: Product) {
    await conn.query(
      `INSERT INTO \`products\` (
        \`id\`, \`tenant_id\`, \`name\`, \`barcode\`, \`category\`, \`sku\`,
        \`purchase_price\`, \`price\`, \`mrp\`, \`gst_rate\`, \`unit\`,
        \`unit_quantity\`, \`unit_label\`, \`stock\`, \`min_stock_alert\`,
        \`batch_number\`, \`expiry_date\`, \`supplier_name\`, \`is_active\`
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)
      ON DUPLICATE KEY UPDATE
        \`tenant_id\`=VALUES(\`tenant_id\`), \`name\`=VALUES(\`name\`), \`barcode\`=VALUES(\`barcode\`),
        \`category\`=VALUES(\`category\`), \`sku\`=VALUES(\`sku\`), \`purchase_price\`=VALUES(\`purchase_price\`),
        \`price\`=VALUES(\`price\`), \`mrp\`=VALUES(\`mrp\`), \`gst_rate\`=VALUES(\`gst_rate\`),
        \`unit\`=VALUES(\`unit\`), \`unit_quantity\`=VALUES(\`unit_quantity\`), \`unit_label\`=VALUES(\`unit_label\`),
        \`stock\`=VALUES(\`stock\`), \`min_stock_alert\`=VALUES(\`min_stock_alert\`),
        \`batch_number\`=VALUES(\`batch_number\`), \`expiry_date\`=VALUES(\`expiry_date\`), \`supplier_name\`=VALUES(\`supplier_name\`)`,
      [
        p.id,
        p.tenantId || "TENANT-001",
        p.name,
        p.barcode,
        p.category || "General",
        p.sku,
        Number(p.purchasePrice || 0),
        Number(p.price || 0),
        Number(p.mrp || p.price || 0),
        Number(p.gstRate || 0),
        p.unit || "Pieces",
        Number(p.unitQuantity || 1),
        p.unitLabel || null,
        Number(p.stock || 0),
        Number(p.minStockAlert || 5),
        p.batchNumber || "B-01",
        toSqlDate(p.expiryDate),
        p.supplierName || "",
      ]
    );

    if (p.branchStocks) {
      for (const [branchId, qty] of Object.entries(p.branchStocks)) {
        await conn.query(
          `INSERT INTO \`branch_inventory\` (\`tenant_id\`, \`branch_id\`, \`product_id\`, \`stock_quantity\`, \`min_stock_alert\`)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE \`stock_quantity\`=VALUES(\`stock_quantity\`), \`min_stock_alert\`=VALUES(\`min_stock_alert\`)`,
          [p.tenantId || "TENANT-001", branchId, p.id, Number(qty || 0), Number(p.minStockAlert || 5)]
        );
      }
    }
  }

  private async upsertCustomerMysql(conn: Pool | PoolConnection, c: Customer) {
    await conn.query(
      `INSERT INTO \`customers\` (\`id\`, \`tenant_id\`, \`name\`, \`phone\`, \`email\`, \`loyalty_points\`, \`credit_balance\`)
       VALUES (?, 'TENANT-001', ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`phone\`=VALUES(\`phone\`), \`email\`=VALUES(\`email\`), \`loyalty_points\`=VALUES(\`loyalty_points\`), \`credit_balance\`=VALUES(\`credit_balance\`)`,
      [c.id, c.name, c.phone, c.email || "", Number(c.loyaltyPoints || 0), Number(c.creditBalance || 0)]
    );
  }

  private async insertInvoiceHeaderAndItems(conn: Pool | PoolConnection, inv: Invoice) {
    await conn.query(
      `INSERT INTO \`invoices\` (
        \`id\`, \`tenant_id\`, \`store_branch_id\`, \`invoice_date\`, \`invoice_time\`,
        \`customer_id\`, \`customer_name\`, \`customer_phone\`, \`subtotal\`, \`tax_amount\`,
        \`discount_percent\`, \`discount_amount\`, \`coupon_code\`, \`grand_total\`,
        \`payment_mode\`, \`cash_received\`, \`change_returned\`, \`cashier_name\`, \`status\`, \`returned_reason\`
      ) VALUES (?,'TENANT-001',?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        \`status\`=VALUES(\`status\`), \`returned_reason\`=VALUES(\`returned_reason\`)`,
      [
        inv.id,
        inv.storeBranchId || "B1",
        inv.date || new Date().toISOString().slice(0, 10),
        inv.time || "00:00",
        inv.customerId || null,
        inv.customerName || "Regular Customer",
        inv.customerPhone || null,
        Number(inv.subtotal || 0),
        Number(inv.taxAmount || 0),
        Number(inv.discountPercent || 0),
        Number(inv.discountAmount || 0),
        inv.couponCode || null,
        Number(inv.grandTotal || 0),
        inv.paymentMode || "CASH",
        Number(inv.cashReceived || 0),
        Number(inv.changeReturned || 0),
        inv.cashierName || "Cashier",
        inv.status || "PAID",
        inv.returnedReason || null,
      ]
    );

    await conn.query(`DELETE FROM \`invoice_items\` WHERE \`invoice_id\` = ?`, [inv.id]);
    for (const item of inv.items || []) {
      await conn.query(
        `INSERT INTO \`invoice_items\` (
          \`invoice_id\`, \`product_id\`, \`name\`, \`barcode\`, \`mrp\`, \`price\`,
          \`quantity\`, \`unit\`, \`unit_quantity\`, \`unit_label\`, \`gst_rate\`, \`gst_amount\`, \`subtotal\`
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          inv.id,
          item.productId || null,
          item.name,
          item.barcode || "",
          Number(item.mrp || item.price || 0),
          Number(item.price || 0),
          Number(item.quantity || 1),
          item.unit || "Pieces",
          Number(item.unitQuantity || 1),
          item.unitLabel || null,
          Number(item.gstRate || 0),
          Number(item.gstAmount || 0),
          Number(item.subtotal || 0),
        ]
      );
    }
  }

  private async insertExpenseMysql(conn: Pool | PoolConnection, e: Expense) {
    await conn.query(
      `INSERT INTO \`expenses\` (\`id\`, \`tenant_id\`, \`store_branch_id\`, \`expense_date\`, \`category\`, \`amount\`, \`description\`, \`approved_by\`)
       VALUES (?, 'TENANT-001', ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE \`amount\`=VALUES(\`amount\`), \`description\`=VALUES(\`description\`)`,
      [e.id, e.storeBranchId || "B1", e.date, e.category, Number(e.amount || 0), e.description || "", e.approvedBy || "Manager"]
    );
  }

  private async insertAdjustmentMysql(conn: Pool | PoolConnection, a: StockAdjustment) {
    await conn.query(
      `INSERT INTO \`stock_adjustments\` (\`id\`, \`tenant_id\`, \`store_branch_id\`, \`product_id\`, \`product_name\`, \`adjustment_date\`, \`previous_stock\`, \`new_stock\`, \`reason\`, \`adjusted_by\`)
       VALUES (?, 'TENANT-001', ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE \`new_stock\`=VALUES(\`new_stock\`)`,
      [a.id, a.storeBranchId || "B1", a.productId, a.productName, a.date, Number(a.previousStock), Number(a.newStock), a.reason, a.adjustedBy]
    );
  }

  private async upsertSettingsMysql(conn: Pool | PoolConnection, s: ExtendedAppSettings) {
    await conn.query(
      `INSERT INTO \`app_settings\` (
        \`tenant_id\`, \`store_branch_id\`, \`auto_print_receipt\`, \`enable_sound\`,
        \`receipt_header\`, \`receipt_footer\`, \`max_discount_allowed\`, \`printer_layout\`,
        \`attractive_mode\`, \`login_bg_mode\`, \`active_tenant_id\`, \`current_branch_id\`, \`label_printer_config\`
      ) VALUES ('GLOBAL','DEFAULT',?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        \`auto_print_receipt\`=VALUES(\`auto_print_receipt\`),
        \`enable_sound\`=VALUES(\`enable_sound\`),
        \`receipt_header\`=VALUES(\`receipt_header\`),
        \`receipt_footer\`=VALUES(\`receipt_footer\`),
        \`max_discount_allowed\`=VALUES(\`max_discount_allowed\`),
        \`printer_layout\`=VALUES(\`printer_layout\`),
        \`attractive_mode\`=VALUES(\`attractive_mode\`),
        \`login_bg_mode\`=VALUES(\`login_bg_mode\`),
        \`active_tenant_id\`=VALUES(\`active_tenant_id\`),
        \`current_branch_id\`=VALUES(\`current_branch_id\`),
        \`label_printer_config\`=VALUES(\`label_printer_config\`)`,
      [
        s.autoPrintReceipt ? 1 : 0,
        s.enableSound ? 1 : 0,
        s.receiptHeader || "",
        s.receiptFooter || "",
        Number(s.maxDiscountAllowed ?? 25),
        s.printerLayout || "thermal-80mm",
        s.attractiveMode || "mint",
        s.loginBgMode || "cosmic-aurora",
        s.activeTenantId ?? "",
        s.currentBranchId ?? "",
        JSON.stringify(s.labelPrinterConfig || DEFAULT_LABEL_PRINTER_CONFIG),
      ]
    );
  }

  private async readFullStateFromMysql(pool: Pool): Promise<FullDbState> {
    const [branchRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`store_branches\` ORDER BY \`id\` ASC`);
    const branches: StoreBranch[] = branchRows.map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      city: r.city,
      phone: r.phone,
      gstin: r.gstin || undefined,
    }));

    const [supplierRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`suppliers\` ORDER BY \`id\` ASC`);
    const suppliers: Supplier[] = supplierRows.map((r) => ({
      id: r.id,
      name: r.name,
      contact: r.contact || "",
      phone: r.phone || "",
      email: r.email || "",
      gstin: r.gstin || "",
    }));

    const [branchInvRows] = await pool.query<RowDataPacket[]>(`SELECT branch_id, product_id, stock_quantity FROM \`branch_inventory\``);
    const branchStockMap: Record<string, Record<string, number>> = {};
    for (const bi of branchInvRows) {
      if (!branchStockMap[bi.product_id]) branchStockMap[bi.product_id] = {};
      branchStockMap[bi.product_id][bi.branch_id] = Number(bi.stock_quantity || 0);
    }

    const [productRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`products\` WHERE \`is_active\` = 1 ORDER BY \`created_at\` ASC, \`id\` ASC`);
    const products: Product[] = productRows.map((r) => ({
      id: r.id,
      name: r.name,
      barcode: r.barcode,
      category: r.category,
      sku: r.sku,
      purchasePrice: Number(r.purchase_price || 0),
      price: Number(r.price || 0),
      mrp: Number(r.mrp || r.price || 0),
      gstRate: Number(r.gst_rate || 0),
      unit: (r.unit || MeasurementUnit.PIECE) as TMeasurementUnit,
      unitQuantity: r.unit_quantity !== null && r.unit_quantity !== undefined ? Number(r.unit_quantity) : 1,
      unitLabel: r.unit_label || undefined,
      stock: Number(r.stock || 0),
      minStockAlert: Number(r.min_stock_alert || 5),
      batchNumber: r.batch_number || "B-01",
      expiryDate: r.expiry_date ? String(r.expiry_date).slice(0, 10) : "2027-12-31",
      supplierName: r.supplier_name || "",
      tenantId: r.tenant_id || "TENANT-001",
      branchStocks: branchStockMap[r.id] || {},
    }));
    this.normalizeProductBranchStocks(products, branches);

    const [customerRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`customers\` ORDER BY \`created_at\` ASC`);
    const customers: Customer[] = customerRows.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email || "",
      loyaltyPoints: Number(r.loyalty_points || 0),
      creditBalance: Number(r.credit_balance || 0),
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    const [invoiceRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`invoices\` ORDER BY \`created_at\` ASC`);
    const [itemRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`invoice_items\` ORDER BY \`id\` ASC`);
    const itemsByInv: Record<string, InvoiceItem[]> = {};
    for (const it of itemRows) {
      if (!itemsByInv[it.invoice_id]) itemsByInv[it.invoice_id] = [];
      itemsByInv[it.invoice_id].push({
        productId: it.product_id || "",
        name: it.name,
        barcode: it.barcode || "",
        mrp: Number(it.mrp || it.price || 0),
        price: Number(it.price || 0),
        quantity: Number(it.quantity || 1),
        unit: (it.unit || MeasurementUnit.PIECE) as TMeasurementUnit,
        unitQuantity: it.unit_quantity !== null && it.unit_quantity !== undefined ? Number(it.unit_quantity) : undefined,
        unitLabel: it.unit_label || undefined,
        gstRate: Number(it.gst_rate || 0),
        gstAmount: Number(it.gst_amount || 0),
        subtotal: Number(it.subtotal || 0),
      });
    }

    const invoices: Invoice[] = invoiceRows.map((r) => ({
      id: r.id,
      date: String(r.invoice_date).slice(0, 10),
      time: String(r.invoice_time),
      customerId: r.customer_id || undefined,
      customerName: r.customer_name || undefined,
      customerPhone: r.customer_phone || undefined,
      items: itemsByInv[r.id] || [],
      subtotal: Number(r.subtotal || 0),
      taxAmount: Number(r.tax_amount || 0),
      discountPercent: Number(r.discount_percent || 0),
      discountAmount: Number(r.discount_amount || 0),
      couponCode: r.coupon_code || undefined,
      grandTotal: Number(r.grand_total || 0),
      paymentMode: (r.payment_mode || "CASH") as TPaymentMode,
      cashReceived: r.cash_received !== null ? Number(r.cash_received) : undefined,
      changeReturned: r.change_returned !== null ? Number(r.change_returned) : undefined,
      cashierName: r.cashier_name,
      storeBranchId: r.store_branch_id,
      status: r.status || "PAID",
      returnedReason: r.returned_reason || undefined,
    }));

    const [expenseRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`expenses\` ORDER BY \`created_at\` ASC`);
    const expenses: Expense[] = expenseRows.map((r) => ({
      id: r.id,
      date: String(r.expense_date).slice(0, 10),
      category: r.category,
      amount: Number(r.amount || 0),
      description: r.description,
      approvedBy: r.approved_by,
      storeBranchId: r.store_branch_id,
    }));

    const [adjRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`stock_adjustments\` ORDER BY \`created_at\` ASC`);
    const adjustments: StockAdjustment[] = adjRows.map((r) => ({
      id: r.id,
      date: String(r.adjustment_date).slice(0, 10),
      productId: r.product_id,
      productName: r.product_name,
      previousStock: Number(r.previous_stock || 0),
      newStock: Number(r.new_stock || 0),
      reason: r.reason,
      adjustedBy: r.adjusted_by,
      storeBranchId: r.store_branch_id || undefined,
    }));

    const [trRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`stock_transfers\` ORDER BY \`created_at\` ASC`);
    const transfers: StockTransfer[] = trRows.map((r) => ({
      id: r.id,
      productId: r.product_id,
      productName: r.product_name,
      sku: r.sku,
      fromBranchId: r.from_branch_id,
      toBranchId: r.to_branch_id,
      quantity: Number(r.quantity || 0),
      status: r.status || "PENDING",
      requestedBy: r.requested_by,
      requestedDate: String(r.requested_date).slice(0, 10),
      actionedBy: r.actioned_by || undefined,
      actionedDate: r.actioned_date ? String(r.actioned_date).slice(0, 10) : undefined,
      comments: r.comments || undefined,
    }));

    const [csRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`cash_sessions\` ORDER BY \`created_at\` ASC`);
    const cashSessions: CashSession[] = csRows.map((r) => ({
      id: r.id,
      cashierId: r.cashier_id,
      cashierName: r.cashier_name,
      startTime: String(r.start_time),
      endTime: r.end_time ? String(r.end_time) : undefined,
      openingBalance: Number(r.opening_balance || 0),
      closingBalance: r.closing_balance !== null ? Number(r.closing_balance) : undefined,
      actualCashInDrawer: r.actual_cash_in_drawer !== null ? Number(r.actual_cash_in_drawer) : undefined,
      difference: r.difference !== null ? Number(r.difference) : undefined,
      salesCash: Number(r.sales_cash || 0),
      salesUpi: Number(r.sales_upi || 0),
      salesCard: Number(r.sales_card || 0),
      status: r.status || "OPEN",
    }));

    const [tenantRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`tenants\` ORDER BY \`created_at\` ASC`);
    const tenants: Tenant[] = tenantRows.map((r) => ({
      id: r.id,
      name: r.name,
      subdomain: r.subdomain,
      domainUrl: r.domain_url || `https://${r.subdomain}.expertbilling.in`,
      domainStatus: r.domain_status || "ACTIVE",
      businessSector: r.business_sector || "SUPERMARKET",
      sectorConfig: safeJsonParse(r.sector_config, undefined),
      typography: safeJsonParse(r.typography, { fontFamily: "Inter", fontSizeScale: "standard" }),
      adminEmail: r.admin_email,
      adminLoginId: r.admin_login_id || undefined,
      adminPassword: r.password_hash || undefined,
      phone: r.phone || "",
      currency: r.currency || "₹",
      tier: r.tier || "GROWTH",
      status: r.status || "ACTIVE",
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      colorTheme: r.color_theme || "emerald",
      maxBranches: Number(r.max_branches || 5),
      maxProducts: Number(r.max_products || 100),
      onboardingFeePaid: Number(r.onboarding_fee_paid || 0),
      monthlySubscriptionFee: Number(r.monthly_subscription_fee || 0),
      billingCycle: r.billing_cycle || "MONTHLY",
      lastPaymentAmount: r.last_payment_amount !== null ? Number(r.last_payment_amount) : undefined,
      lastPaymentDate: r.last_payment_date ? String(r.last_payment_date).slice(0, 10) : undefined,
      subscriptionStartDate: r.subscription_start_date ? String(r.subscription_start_date).slice(0, 10) : "2026-01-01",
      subscriptionEndDate: r.subscription_end_date ? String(r.subscription_end_date).slice(0, 10) : "2027-01-01",
      contractDurationMonths: Number(r.contract_duration_months || 12),
      renewalStatus: r.renewal_status || "AUTO_RENEW",
      onboardingSetupStatus: r.onboarding_setup_status || "COMPLETED",
      hardwareProvisioned: safeJsonParse(r.hardware_provisioned, []),
      onboardingNotes: r.onboarding_notes || undefined,
      clientVerificationStatus: r.client_verification_status || "VERIFIED",
      gstinRegNumber: r.gstin_reg_number || undefined,
      businessLocation: r.business_location || undefined,
      address: r.address || undefined,
      city: r.city || undefined,
      state: r.state || undefined,
      pincode: r.pincode || undefined,
      country: r.country || "India",
      companyLogo: r.company_logo || undefined,
    }));

    const [userRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`users\` WHERE \`is_active\` = 1 ORDER BY \`created_at\` ASC`);
    const credentials: AccessProfile[] = userRows.map((r) => ({
      role: (r.role || "CASHIER") as TUserRole,
      title: r.title || r.name,
      email: r.email || r.username,
      username: r.username,
      password: r.password_hash,
      name: r.name,
      color: r.color || "emerald",
      gradient: r.gradient || "from-emerald-500 to-teal-600",
      bgHover: r.bg_hover || "hover:bg-emerald-500/5",
      accent: r.accent || "text-emerald-500",
      border: r.border_class || "border-emerald-500/20",
      glow: r.glow || "shadow-emerald-500/10",
      description: r.description || "",
      privileges: safeJsonParse<string[]>(r.privileges, []),
      storeBranchId: r.branch_id || undefined,
      tenantId: r.tenant_id || undefined,
      phone: r.phone || undefined,
    }));

    const [catRows] = await pool.query<RowDataPacket[]>(`SELECT name FROM \`categories\` ORDER BY \`sort_order\` ASC, \`id\` ASC`);
    const categories = catRows.map((r) => String(r.name));

    const [setRows] = await pool.query<RowDataPacket[]>(`SELECT * FROM \`app_settings\` WHERE \`tenant_id\` = 'GLOBAL' AND \`store_branch_id\` = 'DEFAULT' LIMIT 1`);
    const sr = setRows[0];
    const settings: ExtendedAppSettings = sr
      ? {
          autoPrintReceipt: Boolean(sr.auto_print_receipt),
          enableSound: Boolean(sr.enable_sound),
          receiptHeader: sr.receipt_header || DEFAULT_APP_SETTINGS.receiptHeader,
          receiptFooter: sr.receipt_footer || DEFAULT_APP_SETTINGS.receiptFooter,
          maxDiscountAllowed: Number(sr.max_discount_allowed ?? 25),
          printerLayout: (sr.printer_layout || "thermal-80mm") as any,
          attractiveMode: sr.attractive_mode || "mint",
          loginBgMode: sr.login_bg_mode || "cosmic-aurora",
          activeTenantId: sr.active_tenant_id ?? "",
          currentBranchId: sr.current_branch_id ?? "",
          labelPrinterConfig: safeJsonParse(sr.label_printer_config, clone(DEFAULT_LABEL_PRINTER_CONFIG)),
        }
      : clone(DEFAULT_APP_SETTINGS);

    const state: FullDbState = {
      products,
      suppliers,
      customers,
      invoices,
      branches,
      expenses,
      adjustments,
      cashSessions,
      transfers,
      tenants,
      credentials,
      categories,
      settings,
      dbStatus: this.getStatus(),
    };

    // Keep runtime cache synchronized so everything stays consistent
    this.runtimeMemoryState = clone(state);
    return state;
  }

  public async getFullState(): Promise<FullDbState> {
    const pool = await this.getLivePool();
    if (pool) {
      return this.readFullStateFromMysql(pool);
    }
    return {
      ...clone(this.runtimeMemoryState),
      dbStatus: this.getStatus(),
    };
  }

  public async upsertProduct(productInput: Partial<Product> & { id: string }): Promise<Product[]> {
    const pool = await this.getLivePool();
    if (pool) {
      const current = await this.readFullStateFromMysql(pool);
      const existing = current.products.find((p) => p.id === productInput.id);
      const merged: Product = existing ? { ...existing, ...productInput } : ({ ...productInput } as Product);
      this.normalizeProductBranchStocks([merged], current.branches.length > 0 ? current.branches : DEFAULT_BRANCHES);
      await this.upsertProductMysql(pool, merged);
      return (await this.readFullStateFromMysql(pool)).products;
    }

    const idx = this.runtimeMemoryState.products.findIndex((p) => p.id === productInput.id);
    if (idx >= 0) {
      this.runtimeMemoryState.products[idx] = { ...this.runtimeMemoryState.products[idx], ...productInput };
    } else {
      this.runtimeMemoryState.products.push(productInput as Product);
    }
    this.normalizeProductBranchStocks(this.runtimeMemoryState.products, this.runtimeMemoryState.branches);
    return clone(this.runtimeMemoryState.products);
  }

  public async bulkUpsertProducts(list: any[]): Promise<{ products: Product[]; addedCount: number; updatedCount: number }> {
    const pool = await this.getLivePool();
    const currentProducts = pool ? (await this.readFullStateFromMysql(pool)).products : this.runtimeMemoryState.products;
    const branches = pool ? (await this.readFullStateFromMysql(pool)).branches : this.runtimeMemoryState.branches;

    let addedCount = 0;
    let updatedCount = 0;

    for (const item of list) {
      if (!item.name || !item.sku) continue;
      const finalId = item.id || `PROD-${Math.floor(10000 + Math.random() * 90000)}`;
      const existing = currentProducts.find((p) => p.id === finalId || p.sku === item.sku);
      const finalProduct: Product = {
        ...(existing || {}),
        id: existing ? existing.id : finalId,
        name: item.name,
        barcode: item.barcode || item.sku || `BC-${Math.floor(1000000 + Math.random() * 9000000)}`,
        category: item.category || "General",
        sku: item.sku,
        purchasePrice: Number(item.purchasePrice || 0),
        mrp: Number(item.mrp || item.price || 0),
        price: Number(item.price || 0),
        gstRate: Number(item.gstRate || 0),
        unit: item.unit || MeasurementUnit.PIECE,
        unitQuantity: Number(item.unitQuantity || 1),
        unitLabel: item.unitLabel || `${Number(item.unitQuantity || 1)} ${item.unit || MeasurementUnit.PIECE}`,
        stock: Number(item.stock || 0),
        minStockAlert: Number(item.minStockAlert || 5),
        batchNumber: item.batchNumber || "B-BULK",
        expiryDate: item.expiryDate || "2027-12-31",
        supplierName: item.supplierName || "Apex Retail Supplies",
        tenantId: item.tenantId || "TENANT-001",
      };
      this.normalizeProductBranchStocks([finalProduct], branches);

      if (existing) updatedCount++;
      else addedCount++;

      if (pool) {
        await this.upsertProductMysql(pool, finalProduct);
      } else {
        const idx = this.runtimeMemoryState.products.findIndex((p) => p.id === finalProduct.id);
        if (idx >= 0) this.runtimeMemoryState.products[idx] = finalProduct;
        else this.runtimeMemoryState.products.push(finalProduct);
      }
    }

    const updatedProducts = pool ? (await this.readFullStateFromMysql(pool)).products : clone(this.runtimeMemoryState.products);
    return { products: updatedProducts, addedCount, updatedCount };
  }

  public async deleteProduct(id: string): Promise<Product[]> {
    const pool = await this.getLivePool();
    if (pool) {
      await pool.query(`DELETE FROM \`branch_inventory\` WHERE \`product_id\` = ?`, [id]);
      await pool.query(`DELETE FROM \`products\` WHERE \`id\` = ?`, [id]);
      return (await this.readFullStateFromMysql(pool)).products;
    }
    this.runtimeMemoryState.products = this.runtimeMemoryState.products.filter((p) => p.id !== id);
    return clone(this.runtimeMemoryState.products);
  }

  public async adjustStock(payload: {
    productId: string;
    newStock: number;
    reason: string;
    adjustedBy: string;
    branchId?: string;
  }): Promise<{ products: Product[]; adjustments: StockAdjustment[] } | null> {
    const bId = payload.branchId || "B1";
    const pool = await this.getLivePool();

    if (pool) {
      const state = await this.readFullStateFromMysql(pool);
      const prod = state.products.find((p) => p.id === payload.productId);
      if (!prod) return null;
      const oldStock = prod.branchStocks?.[bId] ?? prod.stock;
      if (!prod.branchStocks) prod.branchStocks = {};
      prod.branchStocks[bId] = Number(payload.newStock);
      prod.stock = Number(payload.newStock);

      const adjustment: StockAdjustment = {
        id: `ADJ-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        productId: prod.id,
        productName: prod.name,
        previousStock: oldStock,
        newStock: Number(payload.newStock),
        reason: payload.reason,
        adjustedBy: payload.adjustedBy,
        storeBranchId: bId,
      };

      await this.upsertProductMysql(pool, prod);
      await this.insertAdjustmentMysql(pool, adjustment);
      const next = await this.readFullStateFromMysql(pool);
      return { products: next.products, adjustments: next.adjustments };
    }

    const prod = this.runtimeMemoryState.products.find((p) => p.id === payload.productId);
    if (!prod) return null;
    if (!prod.branchStocks) prod.branchStocks = {};
    const oldStock = prod.branchStocks[bId] ?? prod.stock;
    prod.branchStocks[bId] = Number(payload.newStock);
    prod.stock = Number(payload.newStock);
    this.runtimeMemoryState.adjustments.push({
      id: `ADJ-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      productId: prod.id,
      productName: prod.name,
      previousStock: oldStock,
      newStock: Number(payload.newStock),
      reason: payload.reason,
      adjustedBy: payload.adjustedBy,
      storeBranchId: bId,
    });
    return {
      products: clone(this.runtimeMemoryState.products),
      adjustments: clone(this.runtimeMemoryState.adjustments),
    };
  }

  public async createInvoice(invoice: Invoice): Promise<FullDbState> {
    const bId = invoice.storeBranchId || "B1";
    const pool = await this.getLivePool();

    if (pool) {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const current = await this.readFullStateFromMysql(pool);

        for (const item of invoice.items || []) {
          const prod = current.products.find((p) => p.id === item.productId || p.barcode === item.barcode);
          if (prod) {
            if (!prod.branchStocks) prod.branchStocks = {};
            const currentBranchStock = prod.branchStocks[bId] ?? prod.stock;
            const nextStock = Math.max(0, currentBranchStock - Number(item.quantity || 0));
            prod.branchStocks[bId] = nextStock;
            prod.stock = nextStock;
            await this.upsertProductMysql(conn, prod);
          }
        }

        if (invoice.customerId) {
          const pointsEarned = Math.floor(Number(invoice.grandTotal || 0) / 10);
          await conn.query(
            `UPDATE \`customers\` SET \`loyalty_points\` = \`loyalty_points\` + ?, \`total_spent\` = \`total_spent\` + ? WHERE \`id\` = ?`,
            [pointsEarned, Number(invoice.grandTotal || 0), invoice.customerId]
          );
        }

        await this.insertInvoiceHeaderAndItems(conn, invoice);
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
      return this.readFullStateFromMysql(pool);
    }

    for (const item of invoice.items || []) {
      const prod = this.runtimeMemoryState.products.find((p) => p.id === item.productId || p.barcode === item.barcode);
      if (prod) {
        if (!prod.branchStocks) prod.branchStocks = {};
        const cur = prod.branchStocks[bId] ?? prod.stock;
        prod.branchStocks[bId] = Math.max(0, cur - item.quantity);
        prod.stock = prod.branchStocks[bId];
      }
    }
    if (invoice.customerId) {
      const cust = this.runtimeMemoryState.customers.find((c) => c.id === invoice.customerId);
      if (cust) cust.loyaltyPoints += Math.floor(invoice.grandTotal / 10);
    }
    this.runtimeMemoryState.invoices.push(invoice);
    return this.getFullState();
  }

  public async createTransfer(payload: {
    productId: string;
    fromBranchId: string;
    toBranchId: string;
    quantity: number;
    requestedBy: string;
  }): Promise<StockTransfer[] | null> {
    const pool = await this.getLivePool();
    const state = await this.getFullState();
    const prod = state.products.find((p) => p.id === payload.productId);
    if (!prod) return null;

    const tr: StockTransfer = {
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: payload.productId,
      productName: prod.name,
      sku: prod.sku,
      fromBranchId: payload.fromBranchId,
      toBranchId: payload.toBranchId,
      quantity: Number(payload.quantity),
      status: "PENDING",
      requestedBy: payload.requestedBy,
      requestedDate: new Date().toISOString().split("T")[0],
    };

    if (pool) {
      await pool.query(
        `INSERT INTO \`stock_transfers\` (\`id\`, \`tenant_id\`, \`product_id\`, \`product_name\`, \`sku\`, \`from_branch_id\`, \`to_branch_id\`, \`quantity\`, \`status\`, \`requested_by\`, \`requested_date\`)
         VALUES (?, 'TENANT-001', ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)`,
        [tr.id, tr.productId, tr.productName, tr.sku, tr.fromBranchId, tr.toBranchId, tr.quantity, tr.requestedBy, tr.requestedDate]
      );
      return (await this.readFullStateFromMysql(pool)).transfers;
    }

    this.runtimeMemoryState.transfers.push(tr);
    return clone(this.runtimeMemoryState.transfers);
  }

  public async actionTransfer(
    transferId: string,
    payload: { action: "APPROVED" | "REJECTED"; actionedBy: string; comments?: string }
  ): Promise<{ error?: string; transfers?: StockTransfer[]; products?: Product[] }> {
    const pool = await this.getLivePool();
    const state = await this.getFullState();
    const transfer = state.transfers.find((t) => t.id === transferId);
    if (!transfer) return { error: "NOT_FOUND" };
    if (transfer.status !== "PENDING") return { error: "ALREADY_PROCESSED" };

    if (payload.action === "APPROVED") {
      const prod = state.products.find((p) => p.id === transfer.productId);
      if (!prod) return { error: "PRODUCT_NOT_FOUND" };
      if (!prod.branchStocks) prod.branchStocks = {};
      const sourceStock = prod.branchStocks[transfer.fromBranchId] || 0;
      if (sourceStock < transfer.quantity) {
        return { error: `Insufficient source inventory. Source branch has only ${sourceStock} units, but ${transfer.quantity} requested.` };
      }
      prod.branchStocks[transfer.fromBranchId] = Math.max(0, sourceStock - transfer.quantity);
      prod.branchStocks[transfer.toBranchId] = (prod.branchStocks[transfer.toBranchId] || 0) + transfer.quantity;
      prod.stock = prod.branchStocks[transfer.toBranchId];

      if (pool) {
        await this.upsertProductMysql(pool, prod);
      } else {
        const pIdx = this.runtimeMemoryState.products.findIndex((p) => p.id === prod.id);
        if (pIdx >= 0) this.runtimeMemoryState.products[pIdx] = prod;
      }
    }

    const actionedDate = new Date().toISOString().split("T")[0];
    if (pool) {
      await pool.query(
        `UPDATE \`stock_transfers\` SET \`status\` = ?, \`actioned_by\` = ?, \`actioned_date\` = ?, \`comments\` = ? WHERE \`id\` = ?`,
        [payload.action, payload.actionedBy, actionedDate, payload.comments || "", transferId]
      );
      const next = await this.readFullStateFromMysql(pool);
      return { transfers: next.transfers, products: next.products };
    }

    const idx = this.runtimeMemoryState.transfers.findIndex((t) => t.id === transferId);
    if (idx >= 0) {
      this.runtimeMemoryState.transfers[idx] = {
        ...this.runtimeMemoryState.transfers[idx],
        status: payload.action,
        actionedBy: payload.actionedBy,
        actionedDate,
        comments: payload.comments || "",
      };
    }
    return {
      transfers: clone(this.runtimeMemoryState.transfers),
      products: clone(this.runtimeMemoryState.products),
    };
  }

  public async createExpense(payload: Omit<Expense, "id">): Promise<Expense[]> {
    const expense: Expense = { id: `EXP-${Date.now()}`, ...payload };
    const pool = await this.getLivePool();
    if (pool) {
      await this.insertExpenseMysql(pool, expense);
      return (await this.readFullStateFromMysql(pool)).expenses;
    }
    this.runtimeMemoryState.expenses.push(expense);
    return clone(this.runtimeMemoryState.expenses);
  }

  public async upsertCustomer(customer: Partial<Customer>): Promise<Customer[]> {
    const pool = await this.getLivePool();
    const state = await this.getFullState();
    const existing = state.customers.find((c) => c.id === customer.id || (customer.phone && c.phone === customer.phone));
    const finalCust: Customer = existing
      ? { ...existing, ...customer }
      : {
          id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          name: customer.name || "Customer",
          phone: customer.phone || "",
          email: customer.email || "",
          loyaltyPoints: Number(customer.loyaltyPoints || 0),
          creditBalance: Number(customer.creditBalance || 0),
          createdAt: new Date().toISOString(),
        };

    if (pool) {
      await this.upsertCustomerMysql(pool, finalCust);
      return (await this.readFullStateFromMysql(pool)).customers;
    }
    const idx = this.runtimeMemoryState.customers.findIndex((c) => c.id === finalCust.id);
    if (idx >= 0) this.runtimeMemoryState.customers[idx] = finalCust;
    else this.runtimeMemoryState.customers.push(finalCust);
    return clone(this.runtimeMemoryState.customers);
  }

  public async upsertSupplier(supplier: Partial<Supplier>): Promise<Supplier[]> {
    const pool = await this.getLivePool();
    const state = await this.getFullState();
    const existing = state.suppliers.find((s) => s.id === supplier.id);
    const finalSup: Supplier = existing
      ? { ...existing, ...supplier }
      : {
          id: supplier.id || `SUPL-${Math.floor(1000 + Math.random() * 9000)}`,
          name: supplier.name || "",
          contact: supplier.contact || "",
          phone: supplier.phone || "",
          email: supplier.email || "",
          gstin: supplier.gstin || "",
        };

    if (pool) {
      await this.upsertSupplierMysql(pool, finalSup);
      return (await this.readFullStateFromMysql(pool)).suppliers;
    }
    const idx = this.runtimeMemoryState.suppliers.findIndex((s) => s.id === finalSup.id);
    if (idx >= 0) this.runtimeMemoryState.suppliers[idx] = finalSup;
    else this.runtimeMemoryState.suppliers.push(finalSup);
    return clone(this.runtimeMemoryState.suppliers);
  }

  public async deleteSupplier(id: string): Promise<Supplier[]> {
    const pool = await this.getLivePool();
    if (pool) {
      await pool.query(`DELETE FROM \`suppliers\` WHERE \`id\` = ?`, [id]);
      return (await this.readFullStateFromMysql(pool)).suppliers;
    }
    this.runtimeMemoryState.suppliers = this.runtimeMemoryState.suppliers.filter((s) => s.id !== id);
    return clone(this.runtimeMemoryState.suppliers);
  }

  public async upsertBranch(branch: Partial<StoreBranch>): Promise<StoreBranch[]> {
    const pool = await this.getLivePool();
    const state = await this.getFullState();
    const existing = state.branches.find((b) => b.id === branch.id);
    const finalBranch: StoreBranch = existing
      ? { ...existing, ...branch }
      : {
          id: branch.id || `B${state.branches.length + 1}-${Math.floor(10 + Math.random() * 89)}`,
          name: branch.name || "New Branch",
          address: branch.address || "",
          city: branch.city || "",
          phone: branch.phone || "",
          gstin: branch.gstin,
        };

    if (pool) {
      await this.upsertBranchMysql(pool, finalBranch);
      return (await this.readFullStateFromMysql(pool)).branches;
    }
    const idx = this.runtimeMemoryState.branches.findIndex((b) => b.id === finalBranch.id);
    if (idx >= 0) this.runtimeMemoryState.branches[idx] = finalBranch;
    else this.runtimeMemoryState.branches.push(finalBranch);
    return clone(this.runtimeMemoryState.branches);
  }

  public async deleteBranch(id: string): Promise<StoreBranch[]> {
    const pool = await this.getLivePool();
    if (pool) {
      await pool.query(`DELETE FROM \`branch_inventory\` WHERE \`branch_id\` = ?`, [id]);
      await pool.query(`DELETE FROM \`store_branches\` WHERE \`id\` = ?`, [id]);
      return (await this.readFullStateFromMysql(pool)).branches;
    }
    this.runtimeMemoryState.branches = this.runtimeMemoryState.branches.filter((b) => b.id !== id);
    return clone(this.runtimeMemoryState.branches);
  }

  public async syncTenants(tenants: Tenant[]): Promise<Tenant[]> {
    const pool = await this.getLivePool();
    if (pool) {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await this.upsertTenantsMysql(conn, tenants);
        const ids = tenants.map((t) => t.id);
        if (ids.length > 0) {
          await conn.query(`DELETE FROM \`tenants\` WHERE \`id\` NOT IN (?)`, [ids]);
        } else {
          await conn.query(`DELETE FROM \`tenants\``);
        }
        await conn.commit();
      } catch (e) {
        await conn.rollback();
        throw e;
      } finally {
        conn.release();
      }
      return (await this.readFullStateFromMysql(pool)).tenants;
    }
    this.runtimeMemoryState.tenants = clone(tenants);
    return clone(this.runtimeMemoryState.tenants);
  }

  public async upsertTenant(tenant: Tenant): Promise<Tenant[]> {
    const pool = await this.getLivePool();
    if (pool) {
      await this.upsertTenantsMysql(pool, [tenant]);
      return (await this.readFullStateFromMysql(pool)).tenants;
    }
    const idx = this.runtimeMemoryState.tenants.findIndex((t) => t.id === tenant.id);
    if (idx >= 0) this.runtimeMemoryState.tenants[idx] = tenant;
    else this.runtimeMemoryState.tenants.push(tenant);
    return clone(this.runtimeMemoryState.tenants);
  }

  public async syncCredentials(credentials: AccessProfile[]): Promise<AccessProfile[]> {
    const pool = await this.getLivePool();
    if (pool) {
      await this.replaceUsersMysql(pool, credentials);
      return (await this.readFullStateFromMysql(pool)).credentials;
    }
    this.runtimeMemoryState.credentials = clone(credentials);
    return clone(this.runtimeMemoryState.credentials);
  }

  public async syncCategories(categories: string[]): Promise<string[]> {
    const pool = await this.getLivePool();
    if (pool) {
      await this.replaceCategoriesMysql(pool, categories);
      return (await this.readFullStateFromMysql(pool)).categories;
    }
    this.runtimeMemoryState.categories = Array.from(new Set(categories.map((c) => c.trim()).filter(Boolean)));
    return clone(this.runtimeMemoryState.categories);
  }

  public async updateSettings(partial: Partial<ExtendedAppSettings>): Promise<ExtendedAppSettings> {
    const pool = await this.getLivePool();
    const current = await this.getFullState();
    const merged: ExtendedAppSettings = {
      ...current.settings,
      ...partial,
      labelPrinterConfig: {
        ...current.settings.labelPrinterConfig,
        ...(partial.labelPrinterConfig || {}),
      },
    };
    if (pool) {
      await this.upsertSettingsMysql(pool, merged);
      return (await this.readFullStateFromMysql(pool)).settings;
    }
    this.runtimeMemoryState.settings = clone(merged);
    return clone(this.runtimeMemoryState.settings);
  }

  public async upsertCashSession(session: CashSession): Promise<CashSession[]> {
    const pool = await this.getLivePool();
    if (pool) {
      await pool.query(
        `INSERT INTO \`cash_sessions\` (
          \`id\`, \`tenant_id\`, \`store_branch_id\`, \`cashier_id\`, \`cashier_name\`,
          \`start_time\`, \`end_time\`, \`opening_balance\`, \`closing_balance\`,
          \`actual_cash_in_drawer\`, \`difference\`, \`sales_cash\`, \`sales_upi\`, \`sales_card\`, \`status\`
        ) VALUES (?,'TENANT-001','B1',?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          \`end_time\`=VALUES(\`end_time\`), \`closing_balance\`=VALUES(\`closing_balance\`),
          \`actual_cash_in_drawer\`=VALUES(\`actual_cash_in_drawer\`), \`difference\`=VALUES(\`difference\`),
          \`status\`=VALUES(\`status\`)`,
        [
          session.id,
          session.cashierId,
          session.cashierName,
          session.startTime,
          session.endTime || null,
          Number(session.openingBalance || 0),
          session.closingBalance !== undefined ? Number(session.closingBalance) : null,
          session.actualCashInDrawer !== undefined ? Number(session.actualCashInDrawer) : null,
          session.difference !== undefined ? Number(session.difference) : null,
          Number(session.salesCash || 0),
          Number(session.salesUpi || 0),
          Number(session.salesCard || 0),
          session.status || "OPEN",
        ]
      );
      return (await this.readFullStateFromMysql(pool)).cashSessions;
    }
    const idx = this.runtimeMemoryState.cashSessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) this.runtimeMemoryState.cashSessions[idx] = session;
    else this.runtimeMemoryState.cashSessions.push(session);
    return clone(this.runtimeMemoryState.cashSessions);
  }

  public async clearOperationalData(): Promise<FullDbState> {
    const pool = await this.getLivePool();
    if (pool) {
      await pool.query(`DELETE FROM \`invoice_items\``);
      await pool.query(`DELETE FROM \`invoices\``);
      await pool.query(`DELETE FROM \`expenses\``);
      await pool.query(`DELETE FROM \`stock_adjustments\``);
      await pool.query(`DELETE FROM \`stock_transfers\``);
      await pool.query(`DELETE FROM \`cash_sessions\``);
      await pool.query(`DELETE FROM \`customers\``);
      await pool.query(`DELETE FROM \`branch_inventory\``);
      await pool.query(`DELETE FROM \`products\``);
      return this.readFullStateFromMysql(pool);
    }
    this.runtimeMemoryState.invoices = [];
    this.runtimeMemoryState.expenses = [];
    this.runtimeMemoryState.adjustments = [];
    this.runtimeMemoryState.transfers = [];
    this.runtimeMemoryState.cashSessions = [];
    this.runtimeMemoryState.customers = [];
    this.runtimeMemoryState.products = [];
    return this.getFullState();
  }

  public async resetToSuperAdminOnly(): Promise<FullDbState> {
    const pool = await this.getLivePool();
    if (pool) {
      await this.cleanDatabaseExceptSuperAdminMysql(pool);
      return this.readFullStateFromMysql(pool);
    }
    this.runtimeMemoryState = this.createDefaultState();
    return this.getFullState();
  }

  public async syncFullPayload(payload: any): Promise<{
    state: FullDbState;
    status: ReturnType<MySqlDatabaseEngine["getStatus"]>;
  }> {
    this.lastChecked = new Date().toISOString();
    // Only attempt live MySQL connection/sync in Production (AI Studio Preview stays isolated)
    if (this.isProductionRuntime()) {
      await this.connectAndInitialize(true);
    }

    const pool = this.isProductionRuntime() && this.pool && this.schemaReady ? this.pool : null;
    if (payload) {
      if (Array.isArray(payload.tenants)) {
        await this.syncTenants(payload.tenants);
      }
      if (Array.isArray(payload.credentials)) {
        await this.syncCredentials(payload.credentials);
      }
      if (Array.isArray(payload.categories)) {
        await this.syncCategories(payload.categories);
      }
      if (Array.isArray(payload.branches)) {
        for (const b of payload.branches) {
          await this.upsertBranch(b);
        }
      }
      if (Array.isArray(payload.suppliers)) {
        for (const s of payload.suppliers) {
          await this.upsertSupplier(s);
        }
      }
      if (Array.isArray(payload.customers)) {
        for (const c of payload.customers) {
          await this.upsertCustomer(c);
        }
      }
      if (Array.isArray(payload.products)) {
        for (const p of payload.products) {
          await this.upsertProduct(p);
        }
      }
      if (Array.isArray(payload.invoices) && pool) {
        for (const inv of payload.invoices) {
          if (inv?.items && Array.isArray(inv.items) && inv.cashierName) {
            await this.insertInvoiceHeaderAndItems(pool, inv);
          }
        }
      }
      if (Array.isArray(payload.expenses)) {
        for (const e of payload.expenses) {
          if (pool) await this.insertExpenseMysql(pool, e);
        }
      }
      if (payload.settings) {
        await this.updateSettings(payload.settings);
      }
    }

    const state = await this.getFullState();
    return { state, status: this.getStatus() };
  }
}

export const mysqlDb = new MySqlDatabaseEngine();
