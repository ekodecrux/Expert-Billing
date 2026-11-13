import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { mysqlDb } from "./server/mysqlDb.ts";

dotenv.config();

const app = express();
const PORT: number | string = process.env.PORT || 3000;

app.use(express.json({ limit: "15mb" }));

// Health check endpoint for Hostinger & load balancers
app.get(["/health", "/api/health"], (_req, res) => {
  const dbStatus = mysqlDb.getStatus();
  res.status(200).json({
    status: "ok",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Production database dump download route (supports both static schema & live JSON snapshot)
app.get(["/api/database/export", "/api/database/download"], async (req, res) => {
  const format = String(req.query.format || "sql").toLowerCase();
  if (format === "json") {
    try {
      const state = await mysqlDb.getFullState();
      res.setHeader("Content-Disposition", `attachment; filename="u559264694_expertbilling_backup_${new Date().toISOString().slice(0, 10)}.json"`);
      res.setHeader("Content-Type", "application/json");
      return res.send(JSON.stringify(state, null, 2));
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Failed to export JSON snapshot" });
    }
  }

  const filePath = path.join(process.cwd(), "database", "expertbilling_production.sql");
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Disposition", 'attachment; filename="expertbilling_production.sql"');
    res.setHeader("Content-Type", "application/sql");
    return res.sendFile(filePath);
  }
  return res.status(404).json({ error: "Database file not found" });
});

// Database active configuration & live status endpoint
app.get("/api/database/config", (_req, res) => {
  const status = mysqlDb.getStatus();
  res.json({
    configured: true,
    connected: status.connected,
    mode: status.mode,
    host: status.host,
    port: status.port,
    user: status.user,
    database: status.database,
    sshPort: 65002,
    sshUser: "u559264694",
    status: status.mode,
    errorDetail: status.errorDetail,
    lastSynced: status.lastChecked,
  });
});

// Test live connection to MySQL Database cluster (Production only)
app.post("/api/database/test", async (_req, res) => {
  const status = await mysqlDb.connectAndInitialize(true);
  if (status.mode === "PREVIEW_ISOLATED") {
    return res.json({
      success: false,
      connected: false,
      mode: "PREVIEW_ISOLATED",
      user: status.user,
      database: status.database,
      host: status.host,
      port: status.port,
      message: "AI Studio Preview Mode: Live MySQL sync is disabled in preview. Production deployments (NODE_ENV=production) connect to live MySQL automatically.",
      errorDetail: null,
      recommendation:
        "Preview uses isolated in-memory state so preview tests never modify your live Hostinger database. Deploy with npm start (NODE_ENV=production) on Hostinger to connect live.",
      timestamp: new Date().toISOString(),
    });
  }

  if (status.connected) {
    return res.json({
      success: true,
      connected: true,
      mode: "MYSQL_LIVE",
      user: status.user,
      database: status.database,
      host: status.host,
      port: status.port,
      message: `Connected LIVE to MySQL database '${status.database}' on ${status.host}:${status.port} as user '${status.user}'. All schema tables are verified.`,
      timestamp: new Date().toISOString(),
    });
  }

  return res.json({
    success: false,
    connected: false,
    mode: status.mode,
    user: status.user,
    database: status.database,
    host: status.host,
    port: status.port,
    message: `MySQL credentials are configured for '${status.user}', but direct connection failed in production.`,
    errorDetail: status.errorDetail || "Access denied or port 3306 unreachable.",
    recommendation:
      "On Hostinger hosting, set DB_HOST=127.0.0.1 (avoids IPv6 ::1), verify the password for u559264694_expertbilling in Hostinger hPanel > Databases, or add Remote MySQL '%' if hosted externally.",
    timestamp: new Date().toISOString(),
  });
});

// Full state synchronization to MySQL database (Production only; isolated in Preview)
app.post("/api/database/sync", async (req, res) => {
  try {
    const { state, status } = await mysqlDb.syncFullPayload(req.body || {});
    const isPreviewIsolated = status.mode === "PREVIEW_ISOLATED";
    return res.json({
      success: status.connected,
      connected: status.connected,
      mode: status.mode,
      user: status.user,
      database: status.database,
      host: status.host,
      port: status.port,
      errorDetail: status.errorDetail,
      syncSummary: {
        tenantsCount: state.tenants.length,
        credentialsCount: state.credentials.length,
        categoriesCount: state.categories.length,
        productsCount: state.products.length,
        customersCount: state.customers.length,
        suppliersCount: state.suppliers.length,
        invoicesCount: state.invoices.length,
        branchesCount: state.branches.length,
      },
      remoteStatus: status.connected
        ? `Live synchronized to Hostinger MySQL database ${status.database} at ${status.host}:${status.port}`
        : isPreviewIsolated
        ? "AI Studio Preview Mode: Live database sync is disabled in preview (Production only). Changes stay isolated in preview memory."
        : `Production MySQL connection unavailable (${status.errorDetail}). Set DB_HOST=127.0.0.1 and check u559264694_expertbilling password in Hostinger hPanel.`,
      state,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e?.message || "Sync failed" });
  }
});

// Clear operational records from MySQL
app.post("/api/database/clear", async (_req, res) => {
  try {
    const state = await mysqlDb.clearOperationalData();
    res.json({ success: true, state });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to clear database records" });
  }
});

// Clean entire database except Super Admin (resets Super Admin password to 123456)
app.post("/api/database/reset-superadmin-only", async (_req, res) => {
  try {
    const state = await mysqlDb.resetToSuperAdminOnly();
    res.json({ success: true, state });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to reset database to Super Admin only" });
  }
});

// Load full database state
app.get("/api/state", async (_req, res) => {
  try {
    const state = await mysqlDb.getFullState();
    res.json(state);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Failed to fetch state from MySQL" });
  }
});

// Products CRUD
app.post("/api/products", async (req, res) => {
  try {
    const products = await mysqlDb.upsertProduct(req.body);
    res.json({ success: true, products });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save product" });
  }
});

app.post("/api/products/bulk", async (req, res) => {
  try {
    const list = req.body.products;
    if (!Array.isArray(list)) {
      return res.status(400).json({ success: false, error: "Missing or invalid 'products' array field." });
    }
    const result = await mysqlDb.bulkUpsertProducts(list);
    res.json({ success: true, ...result });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed bulk product import" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const products = await mysqlDb.deleteProduct(req.params.id);
    res.json({ success: true, products });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to delete product" });
  }
});

// Stock Adjustment Log
app.post("/api/adjust-stock", async (req, res) => {
  try {
    const result = await mysqlDb.adjustStock(req.body);
    if (!result) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, ...result });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to adjust stock" });
  }
});

// Invoices (Checkout)
app.post("/api/invoices", async (req, res) => {
  try {
    const state = await mysqlDb.createInvoice(req.body);
    res.json({ success: true, state });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to persist invoice" });
  }
});

// Stock Transfers
app.get("/api/transfers", async (_req, res) => {
  try {
    const state = await mysqlDb.getFullState();
    res.json({ success: true, transfers: state.transfers || [] });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to load transfers" });
  }
});

app.post("/api/transfers", async (req, res) => {
  try {
    const transfers = await mysqlDb.createTransfer(req.body);
    if (!transfers) {
      return res.status(404).json({ success: false, error: "Product not found to transfer." });
    }
    res.json({ success: true, transfers });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to create transfer" });
  }
});

app.post("/api/transfers/:id/action", async (req, res) => {
  try {
    const result = await mysqlDb.actionTransfer(req.params.id, req.body);
    if (result.error === "NOT_FOUND") {
      return res.status(404).json({ success: false, error: "Transfer request not found." });
    }
    if (result.error === "ALREADY_PROCESSED") {
      return res.status(400).json({ success: false, error: "This request has already been processed." });
    }
    if (result.error === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ success: false, error: "Target product no longer exists in catalogue." });
    }
    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, transfers: result.transfers, products: result.products });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to process transfer" });
  }
});

// Expenses
app.post("/api/expenses", async (req, res) => {
  try {
    const expenses = await mysqlDb.createExpense(req.body);
    res.json({ success: true, expenses });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save expense" });
  }
});

// Customers
app.post("/api/customers", async (req, res) => {
  try {
    const customers = await mysqlDb.upsertCustomer(req.body);
    res.json({ success: true, customers });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save customer" });
  }
});

// Suppliers
app.post("/api/suppliers", async (req, res) => {
  try {
    const suppliers = await mysqlDb.upsertSupplier(req.body);
    res.json({ success: true, suppliers });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save supplier" });
  }
});

app.delete("/api/suppliers/:id", async (req, res) => {
  try {
    const suppliers = await mysqlDb.deleteSupplier(req.params.id);
    res.json({ success: true, suppliers });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to delete supplier" });
  }
});

// Branches
app.post("/api/branches", async (req, res) => {
  try {
    const branches = await mysqlDb.upsertBranch(req.body);
    res.json({ success: true, branches });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save branch" });
  }
});

app.delete("/api/branches/:id", async (req, res) => {
  try {
    const branches = await mysqlDb.deleteBranch(req.params.id);
    res.json({ success: true, branches });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to delete branch" });
  }
});

// Tenants (Create / Update / Sync full list)
app.post("/api/tenants", async (req, res) => {
  try {
    const tenants = await mysqlDb.upsertTenant(req.body);
    res.json({ success: true, tenants });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save tenant" });
  }
});

app.post("/api/tenants/sync", async (req, res) => {
  try {
    const list = Array.isArray(req.body?.tenants) ? req.body.tenants : [];
    const tenants = await mysqlDb.syncTenants(list);
    res.json({ success: true, tenants });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to sync tenants" });
  }
});

// Credentials / Users
app.post("/api/credentials", async (req, res) => {
  try {
    const list = Array.isArray(req.body?.credentials) ? req.body.credentials : [];
    const credentials = await mysqlDb.syncCredentials(list);
    res.json({ success: true, credentials });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save credentials" });
  }
});

// Product Categories
app.post("/api/categories", async (req, res) => {
  try {
    const list = Array.isArray(req.body?.categories) ? req.body.categories : [];
    const categories = await mysqlDb.syncCategories(list);
    res.json({ success: true, categories });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save categories" });
  }
});

// App & Terminal Settings
app.post("/api/settings", async (req, res) => {
  try {
    const settings = await mysqlDb.updateSettings(req.body || {});
    res.json({ success: true, settings });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save settings" });
  }
});

// Cash Sessions (Open / Close register)
app.post("/api/cash-sessions", async (req, res) => {
  try {
    const cashSessions = await mysqlDb.upsertCashSession(req.body);
    res.json({ success: true, cashSessions });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e?.message || "Failed to save cash session" });
  }
});

// Production & Development server setup
(async () => {
  // Attempt live MySQL initialization on startup (never writes db.json)
  await mysqlDb.connectAndInitialize();

  const isProduction = process.env.NODE_ENV === "production";
  const distPath = path.join(process.cwd(), "dist");
  const indexPath = path.join(distPath, "index.html");

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get("*", (_req, res) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Expert POS - Initializing</title></head>
            <body style="font-family:sans-serif;text-align:center;padding:50px;">
              <h2>Expert POS Smart Billing is Initializing...</h2>
              <p>Please refresh in a moment or run <code>npm run build</code>.</p>
            </body>
          </html>
        `);
      }
    });
  }

  // Graceful error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: err?.message || "Internal Server Error" });
  });

  const portNum = Number(PORT) || 3000;
  const server = app.listen(portNum, "0.0.0.0", () => {
    console.log(`Expert POS Smart Billing running on 0.0.0.0:${portNum}`);
  });

  server.on("error", (err: any) => {
    console.error("Server listen error:", err);
  });
})();