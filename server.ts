import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PaymentMode, UserRole, MeasurementUnit, Product, Supplier, Customer, Invoice, StoreBranch, Expense, CashSession, StockAdjustment, StockTransfer } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to low-overhead database file
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper structure for our DB state
interface DbState {
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  invoices: Invoice[];
  branches: StoreBranch[];
  expenses: Expense[];
  adjustments: StockAdjustment[];
  cashSessions: CashSession[];
  transfers: StockTransfer[];
}

const DEFAULT_SUPPLIERS: Supplier[] = [
  { id: "S1", name: "Supreme Agro Foods Ltd.", contact: "Rajesh Kumar", phone: "9876543210", email: "sales@supremeagro.com", gstin: "07AAAAA1111A1Z1" },
  { id: "S2", name: "Apex Retail Supplies", contact: "Lydia Reynolds", phone: "8765432109", email: "orders@apexretail.com", gstin: "08BBBBB2222B2Z2" },
  { id: "S3", name: "Organica Green Farm Producers", contact: "Sandeep Patil", phone: "7654321098", email: "fresh@organicafarm.org", gstin: "09CCCCC3333C3Z3" },
  { id: "S4", name: "Zenith Household Brands", contact: "Sarah Jenkins", phone: "6543210987", email: " zenithcontacts@gmail.com", gstin: "10DDDDD4444D4Z4" }
];

const DEFAULT_BRANCHES: StoreBranch[] = [
  { id: "B1", name: "Downtown Smart Hypermarket", address: "G-10, Central Plaza, Main Avenue", city: "New Delhi", phone: "011-23456789" }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "PROD-F01",
    name: "Golden Delicious Apples (Imported)",
    barcode: "8901031200051",
    category: "Fresh Fruits & Vegetables",
    sku: "FRT-APP-GD",
    purchasePrice: 120,
    price: 180,
    gstRate: 5,
    unit: MeasurementUnit.KG,
    stock: 75,
    minStockAlert: 20,
    batchNumber: "B-APL-05A",
    expiryDate: "2026-06-15",
    supplierName: "Organica Green Farm Producers"
  },
  {
    id: "PROD-F02",
    name: "Organic Cavendish Bananas",
    barcode: "8901031200068",
    category: "Fresh Fruits & Vegetables",
    sku: "FRT-BAN-OC",
    purchasePrice: 35,
    price: 60,
    gstRate: 0,
    unit: MeasurementUnit.KG,
    stock: 12, // LOW STOCK DEMO
    minStockAlert: 25,
    batchNumber: "B-BAN-08V",
    expiryDate: "2026-05-28", // EXPIRES VERY SOON
    supplierName: "Organica Green Farm Producers"
  },
  {
    id: "PROD-D01",
    name: "Classic Salted Butter 500g",
    barcode: "8901262010115",
    category: "Dairy & Eggs",
    sku: "DRY-BUT-AM",
    purchasePrice: 210,
    price: 260,
    gstRate: 12,
    unit: MeasurementUnit.PIECE,
    stock: 48,
    minStockAlert: 15,
    batchNumber: "MFT-BUT-C6",
    expiryDate: "2026-08-10",
    supplierName: "Supreme Agro Foods Ltd."
  },
  {
    id: "PROD-D02",
    name: "Full Cream Milk 1L Tetra",
    barcode: "8901262020213",
    category: "Dairy & Eggs",
    sku: "DRY-MLK-FC",
    purchasePrice: 62,
    price: 78,
    gstRate: 5,
    unit: MeasurementUnit.PIECE,
    stock: 9, // LOW STOCK DEMO
    minStockAlert: 30,
    batchNumber: "MFT-MLK-M1",
    expiryDate: "2026-06-03", // EXPIRES SOON
    supplierName: "Supreme Agro Foods Ltd."
  },
  {
    id: "PROD-G01",
    name: "Basmati Premium Rice 5Kg",
    barcode: "8902511000122",
    category: "Grains & Grocery",
    sku: "GRN-BAS-R5",
    purchasePrice: 480,
    price: 650,
    gstRate: 5,
    unit: MeasurementUnit.PIECE,
    stock: 120,
    minStockAlert: 30,
    batchNumber: "B-BAS-09",
    expiryDate: "2027-12-31",
    supplierName: "Apex Retail Supplies"
  },
  {
    id: "PROD-G02",
    name: "Whole Wheat Atta 10Kg",
    barcode: "8901725181222",
    category: "Grains & Grocery",
    sku: "GRN-ATT-W10",
    purchasePrice: 320,
    price: 440,
    gstRate: 0,
    unit: MeasurementUnit.PIECE,
    stock: 85,
    minStockAlert: 25,
    batchNumber: "B-ATT-242",
    expiryDate: "2026-11-20",
    supplierName: "Apex Retail Supplies"
  },
  {
    id: "PROD-B01",
    name: "Fizzy Cola Zero Sugar 330ml Can",
    barcode: "5449000133335",
    category: "Beverages",
    sku: "BEV-COL-ZC",
    purchasePrice: 18,
    price: 40,
    gstRate: 18,
    unit: MeasurementUnit.PIECE,
    stock: 450,
    minStockAlert: 100,
    batchNumber: "B-COL-990",
    expiryDate: "2026-12-05",
    supplierName: "Apex Retail Supplies"
  },
  {
    id: "PROD-B02",
    name: "Premium Roasted Coffee Beans 250g",
    barcode: "8906044675543",
    category: "Beverages",
    sku: "BEV-COF-PR",
    purchasePrice: 280,
    price: 499,
    gstRate: 18,
    unit: MeasurementUnit.PIECE,
    stock: 35,
    minStockAlert: 10,
    batchNumber: "B-CFB-A1",
    expiryDate: "2026-05-30", // EXPIRES EXTREMELY SOON
    supplierName: "Apex Retail Supplies"
  },
  {
    id: "PROD-S01",
    name: "Crisp Potato Wafers (Classic Salted)",
    barcode: "8901491101830",
    category: "Snacks & Sweets",
    sku: "SNC-POT-CS",
    purchasePrice: 12,
    price: 20,
    gstRate: 18,
    unit: MeasurementUnit.PIECE,
    stock: 280,
    minStockAlert: 50,
    batchNumber: "B-POT-88",
    expiryDate: "2026-09-18",
    supplierName: "Apex Retail Supplies"
  },
  {
    id: "PROD-H01",
    name: "Multipurpose Glass Cleaner Spray 500ml",
    barcode: "8901248102322",
    category: "Household",
    sku: "HSD-GLS-CL",
    purchasePrice: 55,
    price: 95,
    gstRate: 18,
    unit: MeasurementUnit.PIECE,
    stock: 40,
    minStockAlert: 12,
    batchNumber: "B-HSD-312",
    expiryDate: "2028-04-12",
    supplierName: "Zenith Household Brands"
  }
];

const DEFAULT_CUSTOMERS: Customer[] = [
  { id: "CUST-01", name: "Ananya Sharma", phone: "9810234567", email: "ananya@gmail.com", loyaltyPoints: 485, creditBalance: 120, createdAt: "2026-01-15T12:00:00Z" },
  { id: "CUST-02", name: "Vikram Malhotra", phone: "9920198754", email: "vikram.m@yahoo.com", loyaltyPoints: 1250, creditBalance: 0, createdAt: "2026-02-10T15:20:00Z" },
  { id: "CUST-03", name: "Sunita Deshmukh", phone: "9830561234", email: "sunita.d@outlook.com", loyaltyPoints: 180, creditBalance: 500, createdAt: "2026-03-24T09:30:00Z" },
  { id: "CUST-04", name: "Rahul Verma", phone: "9510111222", email: "rahul@verma.net", loyaltyPoints: 50, creditBalance: 0, createdAt: "2026-05-01T17:45:00Z" }
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "EAS-20260521-1042",
    date: "2026-05-21",
    time: "14:24",
    customerId: "CUST-01",
    customerName: "Ananya Sharma",
    customerPhone: "9810234567",
    items: [
      { productId: "PROD-F01", name: "Golden Delicious Apples (Imported)", barcode: "8901031200051", price: 180, quantity: 2, unit: MeasurementUnit.KG, gstRate: 5, gstAmount: 18, subtotal: 360 },
      { productId: "PROD-D01", name: "Classic Salted Butter 500g", barcode: "8901262010115", price: 260, quantity: 1, unit: MeasurementUnit.PIECE, gstRate: 12, gstAmount: 31.2, subtotal: 260 },
      { productId: "PROD-S01", name: "Crisp Potato Wafers (Classic Salted)", barcode: "8901491101830", price: 20, quantity: 5, unit: MeasurementUnit.PIECE, gstRate: 18, gstAmount: 18, subtotal: 100 }
    ],
    subtotal: 720,
    taxAmount: 67.2,
    discountPercent: 5,
    discountAmount: 36,
    couponCode: "WELCOME5",
    grandTotal: 684,
    paymentMode: PaymentMode.UPI,
    cashierName: "Arundhati Roy",
    storeBranchId: "B1",
    status: "PAID"
  },
  {
    id: "EAS-20260521-1899",
    date: "2026-05-21",
    time: "18:45",
    customerId: "CUST-02",
    customerName: "Vikram Malhotra",
    customerPhone: "9920198754",
    items: [
      { productId: "PROD-G01", name: "Basmati Premium Rice 5Kg", barcode: "8902511000122", price: 650, quantity: 2, unit: MeasurementUnit.PIECE, gstRate: 5, gstAmount: 65, subtotal: 1300 },
      { productId: "PROD-H01", name: "Multipurpose Glass Cleaner Spray 500ml", barcode: "8901248102322", price: 95, quantity: 1, unit: MeasurementUnit.PIECE, gstRate: 18, gstAmount: 17.1, subtotal: 95 }
    ],
    subtotal: 1395,
    taxAmount: 82.1,
    discountPercent: 0,
    discountAmount: 0,
    grandTotal: 1395,
    paymentMode: PaymentMode.CARD,
    cashierName: "Samarjeet Sen",
    storeBranchId: "B1",
    status: "PAID"
  }
];

const DEFAULT_EXPENSES: Expense[] = [
  { id: "EXP-01", date: "2026-05-18", category: "Utility (Electricity)", amount: 14500, description: "Monthly warehouse air cooling bill", approvedBy: "Admin", storeBranchId: "B1" },
  { id: "EXP-02", date: "2026-05-20", category: "Store Branding", amount: 3500, description: "New LED signboards and display posters printing", approvedBy: "Manager B1", storeBranchId: "B1" },
  { id: "EXP-03", date: "2026-05-21", category: "Logistics", amount: 2400, description: "Supplier freight charges for fresh vegetables delivery", approvedBy: "Store Keeper", storeBranchId: "B1" }
];

const DEFAULT_ADJUSTMENTS: StockAdjustment[] = [
  { id: "ADJ-01", date: "2026-05-19", productId: "PROD-F01", productName: "Golden Delicious Apples (Imported)", previousStock: 80, newStock: 75, reason: "Discarded bruised fruits", adjustedBy: "Store Keeper" }
];

// Read DB state
function readDb(): DbState {
  let state: DbState;
  if (!fs.existsSync(DB_FILE)) {
    state = {
      products: DEFAULT_PRODUCTS,
      suppliers: DEFAULT_SUPPLIERS,
      customers: DEFAULT_CUSTOMERS,
      invoices: DEFAULT_INVOICES,
      branches: DEFAULT_BRANCHES,
      expenses: DEFAULT_EXPENSES,
      adjustments: DEFAULT_ADJUSTMENTS,
      cashSessions: [],
      transfers: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf8");
  } else {
    try {
      const data = fs.readFileSync(DB_FILE, "utf8");
      state = JSON.parse(data);
    } catch (error) {
      console.error("Error reading database file, returning default", error);
      state = {
        products: DEFAULT_PRODUCTS,
        suppliers: DEFAULT_SUPPLIERS,
        customers: DEFAULT_CUSTOMERS,
        invoices: DEFAULT_INVOICES,
        branches: DEFAULT_BRANCHES,
        expenses: DEFAULT_EXPENSES,
        adjustments: DEFAULT_ADJUSTMENTS,
        cashSessions: [],
        transfers: []
      };
    }
  }

  // Ensure transfers array is initialised
  if (!state.transfers) {
    state.transfers = [];
  }

  // Ensure branches array is initialised
  if (!state.branches || state.branches.length === 0) {
    state.branches = DEFAULT_BRANCHES;
  }

  // Normalize and seed branchStocks for each product to guarantee branch-wise isolated inventory exists cleanly!
  if (state.products) {
    state.products.forEach((p) => {
      if (!p.branchStocks) {
        p.branchStocks = {};
      }
      state.branches.forEach((b) => {
        if (p.branchStocks![b.id] === undefined) {
          if (b.id === "B1") {
            p.branchStocks![b.id] = p.stock || 0;
          } else if (b.id === "B2") {
            p.branchStocks![b.id] = Math.max(2, Math.floor((p.stock || 50) * 0.6));
          } else {
            p.branchStocks![b.id] = Math.max(1, Math.floor((p.stock || 50) * 0.3));
          }
        }
      });
    });
  }

  return state;
}

// Write DB state
function writeDb(state: DbState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database file", error);
  }
}

// Ensure database file exists on startup
readDb();

// Lazy initialize Gemini API only when needed to prevent startup failures
let aiClientInstance: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClientInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClientInstance = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClientInstance;
}

// API Routes

// Load full database State
app.get("/api/state", (req, res) => {
  const db = readDb();
  res.json(db);
});

// Update products list (Create / Edit)
app.post("/api/products", (req, res) => {
  const db = readDb();
  const index = db.products.findIndex((p) => p.id === req.body.id);
  if (index >= 0) {
    // Edit Product
    db.products[index] = { ...db.products[index], ...req.body };
  } else {
    // Create Product
    db.products.push(req.body);
  }
  writeDb(db);
  res.json({ success: true, products: db.products });
});

// Bulk products upload (Create or Edit in batch)
app.post("/api/products/bulk", (req, res) => {
  const db = readDb();
  const list = req.body.products;
  if (!Array.isArray(list)) {
    return res.status(400).json({ success: false, error: "Missing or invalid 'products' array field." });
  }

  let addedCount = 0;
  let updatedCount = 0;

  for (const item of list) {
    if (!item.name || !item.sku) continue; // skip invalid records

    // Ensure it has an id
    const finalId = item.id || `PROD-${Math.floor(10000 + Math.random() * 90000)}`;
    const finalProduct = {
      id: finalId,
      name: item.name,
      barcode: item.barcode || item.sku || `BC-${Math.floor(1000000 + Math.random() * 9000000)}`,
      category: item.category || "General",
      sku: item.sku,
      purchasePrice: Number(item.purchasePrice || 0),
      price: Number(item.price || 0),
      gstRate: Number(item.gstRate || 0),
      unit: item.unit || "Pieces",
      stock: Number(item.stock || 0),
      minStockAlert: Number(item.minStockAlert || 5),
      batchNumber: item.batchNumber || "B-BULK",
      expiryDate: item.expiryDate || "2027-12-31",
      supplierName: item.supplierName || "Apex Retail Supplies",
      tenantId: item.tenantId || "TENANT-001"
    };

    const index = db.products.findIndex((p) => p.id === finalId || p.sku === finalProduct.sku);
    if (index >= 0) {
      db.products[index] = { ...db.products[index], ...finalProduct };
      updatedCount++;
    } else {
      db.products.push(finalProduct);
      addedCount++;
    }
  }

  writeDb(db);
  res.json({ success: true, products: db.products, addedCount, updatedCount });
});

// Delete Product
app.delete("/api/products/:id", (req, res) => {
  const db = readDb();
  db.products = db.products.filter((p) => p.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, products: db.products });
});

// Save Store Adjustment Log and apply new stock limit
app.post("/api/adjust-stock", (req, res) => {
  const db = readDb();
  const { productId, newStock, reason, adjustedBy, branchId } = req.body;
  const prodIndex = db.products.findIndex((p) => p.id === productId);
  if (prodIndex >= 0) {
    const prod = db.products[prodIndex];
    const bId = branchId || "B1";
    if (!prod.branchStocks) {
      prod.branchStocks = {};
    }
    db.branches.forEach((b) => {
      if (prod.branchStocks![b.id] === undefined) {
        prod.branchStocks![b.id] = b.id === "B1" ? prod.stock : 10;
      }
    });

    const oldStock = prod.branchStocks[bId] ?? prod.stock;
    prod.branchStocks[bId] = Number(newStock);
    prod.stock = Number(newStock);

    const adjustment: StockAdjustment = {
      id: `ADJ-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      productId,
      productName: prod.name,
      previousStock: oldStock,
      newStock: Number(newStock),
      reason,
      adjustedBy,
      storeBranchId: bId
    };
    db.adjustments.push(adjustment);
    writeDb(db);
    res.json({ success: true, products: db.products, adjustments: db.adjustments });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Save client invoice (billing sales checkout)
app.post("/api/invoices", (req, res) => {
  const db = readDb();
  const invoice: Invoice = req.body;
  const bId = invoice.storeBranchId || "B1";
  
  // Apply changes to stock limits
  for (const item of invoice.items) {
    const prodIndex = db.products.findIndex((p) => p.id === item.productId || p.barcode === item.barcode);
    if (prodIndex >= 0) {
      const prod = db.products[prodIndex];
      if (!prod.branchStocks) {
        prod.branchStocks = {};
      }
      db.branches.forEach((b) => {
        if (prod.branchStocks![b.id] === undefined) {
          prod.branchStocks![b.id] = b.id === "B1" ? prod.stock : 10;
        }
      });
      const currentBranchStock = prod.branchStocks[bId] ?? prod.stock;
      prod.branchStocks[bId] = Math.max(0, currentBranchStock - item.quantity);
      prod.stock = prod.branchStocks[bId]; // Sink fallback
    }
  }

  // Award customer loyalty points
  if (invoice.customerId) {
    const custIndex = db.customers.findIndex((c) => c.id === invoice.customerId);
    if (custIndex >= 0) {
      // 1 point per 10 currency spent
      const pointsEarned = Math.floor(invoice.grandTotal / 10);
      db.customers[custIndex].loyaltyPoints += pointsEarned;
    }
  }

  db.invoices.push(invoice);
  writeDb(db);
  res.json({ success: true, state: db });
});

// GET transfers list
app.get("/api/transfers", (req, res) => {
  const db = readDb();
  res.json({ success: true, transfers: db.transfers || [] });
});

// POST submit a transfer request
app.post("/api/transfers", (req, res) => {
  const db = readDb();
  const { productId, fromBranchId, toBranchId, quantity, requestedBy } = req.body;
  const prod = db.products.find((p) => p.id === productId);
  if (!prod) {
    return res.status(404).json({ success: false, error: "Product not found to transfer." });
  }

  const newTransfer: StockTransfer = {
    id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
    productId,
    productName: prod.name,
    sku: prod.sku,
    fromBranchId,
    toBranchId,
    quantity: Number(quantity),
    status: "PENDING",
    requestedBy,
    requestedDate: new Date().toISOString().split("T")[0]
  };

  if (!db.transfers) {
    db.transfers = [];
  }
  db.transfers.push(newTransfer);
  writeDb(db);
  res.json({ success: true, transfers: db.transfers });
});

// POST action a transfer request (approve/reject)
app.post("/api/transfers/:id/action", (req, res) => {
  const db = readDb();
  const { action, actionedBy, comments } = req.body; // action: 'APPROVED' or 'REJECTED'
  const transIndex = db.transfers.findIndex((t) => t.id === req.params.id);
  
  if (transIndex < 0) {
    return res.status(404).json({ success: false, error: "Transfer request not found." });
  }

  const transfer = db.transfers[transIndex];
  if (transfer.status !== "PENDING") {
    return res.status(400).json({ success: false, error: "This request has already been processed." });
  }

  if (action === "APPROVED") {
    const prodIndex = db.products.findIndex((p) => p.id === transfer.productId);
    if (prodIndex >= 0) {
      const prod = db.products[prodIndex];
      if (!prod.branchStocks) {
        prod.branchStocks = {};
      }
      db.branches.forEach((b) => {
        if (prod.branchStocks![b.id] === undefined) {
          prod.branchStocks![b.id] = b.id === "B1" ? prod.stock : 10;
        }
      });

      const sourceStock = prod.branchStocks[transfer.fromBranchId] || 0;
      if (sourceStock < transfer.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient source inventory. Source branch has only ${sourceStock} units, but ${transfer.quantity} requested.` 
        });
      }

      // Deduct from source branch, add to destination branch
      prod.branchStocks[transfer.fromBranchId] = Math.max(0, sourceStock - transfer.quantity);
      prod.branchStocks[transfer.toBranchId] = (prod.branchStocks[transfer.toBranchId] || 0) + transfer.quantity;
      prod.stock = prod.branchStocks[transfer.toBranchId]; // local reference sync
    } else {
      return res.status(404).json({ success: false, error: "Target product no longer exists in catalogue." });
    }
  }

  transfer.status = action; // APPROVED or REJECTED
  transfer.actionedBy = actionedBy;
  transfer.actionedDate = new Date().toISOString().split("T")[0];
  transfer.comments = comments || "";

  writeDb(db);
  res.json({ success: true, transfers: db.transfers, products: db.products });
});

// Add branch expense record
app.post("/api/expenses", (req, res) => {
  const db = readDb();
  const expense: Expense = {
    id: `EXP-${Date.now()}`,
    ...req.body
  };
  db.expenses.push(expense);
  writeDb(db);
  res.json({ success: true, expenses: db.expenses });
});

// Create/Update Loyalty Customer
app.post("/api/customers", (req, res) => {
  const db = readDb();
  const customer = req.body;
  const index = db.customers.findIndex((c) => c.id === customer.id || c.phone === customer.phone);
  if (index >= 0) {
    db.customers[index] = { ...db.customers[index], ...customer };
  } else {
    customer.id = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
    customer.createdAt = new Date().toISOString();
    customer.loyaltyPoints = customer.loyaltyPoints || 0;
    customer.creditBalance = customer.creditBalance || 0;
    db.customers.push(customer);
  }
  writeDb(db);
  res.json({ success: true, customers: db.customers });
});

// Create/Update Supplier
app.post("/api/suppliers", (req, res) => {
  const db = readDb();
  const supplier = req.body;
  const index = db.suppliers.findIndex((s) => s.id === supplier.id);
  if (index >= 0) {
    db.suppliers[index] = { ...db.suppliers[index], ...supplier };
  } else {
    supplier.id = `SUPL-${Math.floor(1000 + Math.random() * 9000)}`;
    db.suppliers.push(supplier);
  }
  writeDb(db);
  res.json({ success: true, suppliers: db.suppliers });
});

// Delete Supplier
app.delete("/api/suppliers/:id", (req, res) => {
  const db = readDb();
  db.suppliers = db.suppliers.filter((s) => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, suppliers: db.suppliers });
});

// Create/Update Brand Branch
app.post("/api/branches", (req, res) => {
  const db = readDb();
  const branch = req.body;
  const index = db.branches.findIndex((b) => b.id === branch.id);
  if (index >= 0) {
    db.branches[index] = { ...db.branches[index], ...branch };
  } else {
    branch.id = `B${db.branches.length + 1}`;
    db.branches.push(branch);
  }
  writeDb(db);
  res.json({ success: true, branches: db.branches });
});

// Delete Branch
app.delete("/api/branches/:id", (req, res) => {
  const db = readDb();
  db.branches = db.branches.filter((b) => b.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, branches: db.branches });
});

// AI Copilot prompt dispatcher via server SDK
app.post("/api/copilot", async (req, res) => {
  const { prompt, context } = req.body;
  const ai = getAiClient();

  if (!ai) {
    return res.json({
      text: "⚠️ **Gemini Co-pilot Warning**: Gemini API key is not configured in this workspace yet. You can set it in **Settings > Secrets** so that the Smart Assistant can generate real stock optimization advice, SMS promotional copywriting, and store analytics. \n\n*Running locally in offline simulation mode instead.*",
      suggestions: [
        "Simulate marketing SMS",
        "Explain low-stock recommendation",
        "Generate a discount code strategy"
      ]
    });
  }

  try {
    const systemPrompt = `You are "Smart Billing Co-pilot" built inside the ExpertAid Smart Billing application for supermarkets.
The manager/cashier is asking you a question or asking to do a smart task.
You have access to current dashboard state:
- Low-stock warning products: ${JSON.stringify(context?.lowStockProducts || [])}
- Low-shelf-life/Expiring products: ${JSON.stringify(context?.expiringProducts || [])}
- Selected cashier/role: ${context?.currentRole || 'Manager'}
- Main active branch: ${context?.currentBranch?.name || 'Downtown Smart Hypermarket'}

Provide a highly crisp, smart, actionable response. If they ask for a marketing SMS or WhatsApp deal copy, write a highly catchy text containing emoji and promotional urgency.
If they ask for retail advice, detail the specific steps they can take (like transferring merchandise between branches to optimize expiring inventory, or applying customized bundles).
Maintain a smart, encouraging, conversational retail-manager tone. Keep formatting elegant using markdown lists. Never exceed 250 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    res.json({
      text: response.text || "I was unable to formulate a response.",
      suggestions: [
        "Suggest stock adjustment",
        "Create an SMS promo for expiring milk",
        "Suggest bundles for grocery categories"
      ]
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.json({
      text: `⚠️ **AI Copilot API Error**: ${error?.message || 'Unknown integration error'}. Please verify your Gemini API key in the Secrets panel.`,
      suggestions: ["Retry query", "Read stock reports", "How are loyalty points calculated?"]
    });
  }
});

// Vite middleware setup for local development
(async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ExpertAid Smart Billing running on http://localhost:${PORT}`);
  });
})();
