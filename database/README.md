# Expert Billing - MySQL Production Database Setup

This directory contains the production database schema and configuration for **expertbilling.in** on the Hostinger/cPanel MySQL server.

---

## 🔑 Database Credentials

| Parameter | Value |
|---|---|
| **Database Name** | `u559264694_expertbilling` |
| **Database Username** | `u559264694_expertbilling` |
| **Password** | `Pos@2026` |
| **Server IP / Host** | `145.79.209.120` *(or `localhost` when app is hosted on same server)* |
| **MySQL Port** | `3306` |
| **SSH Port** | `65002` |
| **SSH User** | `u559264694` |
| **Character Set** | `utf8mb4` |
| **Collation** | `utf8mb4_unicode_ci` |
| **Storage Engine** | `InnoDB` |

---

## 🚀 Quick Import Instructions

### Option 1: Via Hostinger phpMyAdmin (Recommended - Simplest)
1. Log in to your **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Go to **Databases** > **phpMyAdmin** and click **Enter phpMyAdmin** next to `u559264694_expertbilling`.
3. In the top navigation bar, click the **Import** tab.
4. Click **Choose File** and select `database/schema.sql`.
5. Keep default settings (`utf-8`, SQL format) and click **Import** (or **Go**) at the bottom.
6. All 18 tables and initial seed data will be created instantly.

---

### Option 2: Via SSH Command Line
Connect directly using the SSH details:
```bash
# 1. SSH into the server
ssh -p 65002 u559264694@145.79.209.120

# 2. Upload or paste schema.sql, then run:
mysql -u u559264694_expertbilling -p u559264694_expertbilling < schema.sql
# Enter password when prompted: Pos@2026
```

Or from your local machine using one command (piping file over SSH):
```bash
ssh -p 65002 u559264694@145.79.209.120 "mysql -u u559264694_expertbilling -p'Pos@2026' u559264694_expertbilling" < database/schema.sql
```

---

### Option 3: Remote Desktop Client (DBeaver / MySQL Workbench / TablePlus)
- **Host**: `145.79.209.120`
- **Port**: `3306` *(Note: If Hostinger blocks external port 3306 by default, enable Remote MySQL in hPanel > Databases > Remote MySQL, OR use SSH Tunneling in your client: SSH Host `145.79.209.120`, Port `65002`, User `u559264694`, DB Host `localhost`, DB Port `3306`)*.
- **Database**: `u559264694_expertbilling`
- **User**: `u559264694_expertbilling`
- **Password**: `Pos@2026`

---

## 🗄️ Database Tables Overview

| # | Table Name | Purpose |
|---|---|---|
| 1 | `tenants` | Multi-tenant SaaS master (stores `expertbilling.in`, billing plan, license status) |
| 2 | `store_branches` | Retail branch locations (Downtown Hypermarket `B1`, South City `B2`, etc.) |
| 3 | `users` | Staff, cashiers, store managers, and administrators with role-based access |
| 4 | `suppliers` | Wholesale FMCG vendors and distributors with GSTIN details |
| 5 | `categories` | Retail merchandise departments (Fruits, Dairy, Grains, Beverages, etc.) |
| 6 | `products` | Master inventory catalog (Barcode, SKU, Name, MRP, Cost Price, Selling Price, GST) |
| 7 | `branch_inventory` | Branch-wise isolated stock quantities & low-stock alerts |
| 8 | `customers` | Customer phone directory, loyalty points, and store credit ledger |
| 9 | `invoices` | Official retail billing sales header with totals, MRP savings, and payment mode |
| 10 | `invoice_items` | Itemized line records with distinct **Quantity (numeric)** and **MRP** |
| 11 | `payment_transactions` | Audit records for Cash, UPI QR, Credit/Debit Card, and Split payments |
| 12 | `cash_sessions` | Cashier shifts, cash drawer opening balance, closing balance & variances |
| 13 | `stock_adjustments` | Stock audit logs for damaged items, expired write-offs, or count reconciliation |
| 14 | `stock_transfers` | Inter-branch inventory requisition and transfer tracking |
| 15 | `expenses` | Store operating expenses (electricity, rent, packaging, logistics) |
| 16 | `coupons` | Promotional vouchers (`WELCOME5`, `FESTIVE10`, `SAVE50`) |
| 17 | `app_settings` | Hardware configuration, thermal receipt printer layout, and company headers |
| 18 | `audit_logs` | Immutable audit trail for compliance, deletions, and supervisor overrides |
