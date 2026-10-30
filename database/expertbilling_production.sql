-- ============================================================================
-- EXPERT BILLING - PRODUCTION MYSQL DATABASE SCHEMA
-- Target Database: u559264694_expertbilling
-- Database User:   u559264694_expertbilling
-- Server Host:     145.79.209.120 (Hostinger / cPanel MySQL)
-- Engine:          InnoDB
-- Character Set:   utf8mb4
-- Collation:       utf8mb4_unicode_ci
-- Generated for:   expertbilling.in / Enterprise Retail POS Hub
-- ============================================================================

-- Disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30"; -- Indian Standard Time (IST)

-- 1. Create and switch to Database
CREATE DATABASE IF NOT EXISTS `u559264694_expertbilling`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `u559264694_expertbilling`;

-- ============================================================================
-- 1. TENANTS & MULTI-TENANCY MASTER
-- ============================================================================
DROP TABLE IF EXISTS `tenants`;
CREATE TABLE `tenants` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `subdomain` VARCHAR(100) NOT NULL UNIQUE,
  `admin_email` VARCHAR(255) NOT NULL,
  `admin_login_id` VARCHAR(100) DEFAULT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `tier` ENUM('STARTER', 'GROWTH', 'ENTERPRISE') NOT NULL DEFAULT 'GROWTH',
  `status` ENUM('ACTIVE', 'SUSPENDED', 'TRIAL') NOT NULL DEFAULT 'ACTIVE',
  `color_theme` VARCHAR(50) NOT NULL DEFAULT 'emerald',
  `max_branches` INT NOT NULL DEFAULT 5,
  `max_products` INT NOT NULL DEFAULT 10000,
  `onboarding_fee_paid` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `monthly_subscription_fee` DECIMAL(12, 2) NOT NULL DEFAULT 1499.00,
  `billing_cycle` ENUM('MONTHLY', 'ANNUAL', 'QUARTERLY') NOT NULL DEFAULT 'MONTHLY',
  `last_payment_amount` DECIMAL(12, 2) DEFAULT 0.00,
  `last_payment_date` DATE DEFAULT NULL,
  `subscription_start_date` DATE DEFAULT NULL,
  `subscription_end_date` DATE DEFAULT NULL,
  `contract_duration_months` INT NOT NULL DEFAULT 12,
  `renewal_status` ENUM('AUTO_RENEW', 'MANUAL', 'CANCEL_ON_EXPIRY') NOT NULL DEFAULT 'AUTO_RENEW',
  `onboarding_setup_status` ENUM('COMPLETED', 'PENDING_HARDWARE', 'TRAINING_IN_PROGRESS', 'SYSTEM_PROVISIONED') NOT NULL DEFAULT 'COMPLETED',
  `hardware_provisioned` JSON DEFAULT NULL,
  `onboarding_notes` TEXT DEFAULT NULL,
  `client_verification_status` ENUM('VERIFIED', 'PENDING_KYC', 'REJECTED', 'UNDER_REVIEW') NOT NULL DEFAULT 'VERIFIED',
  `gstin_reg_number` VARCHAR(50) DEFAULT NULL,
  `company_logo` MEDIUMTEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_tenant_status` (`status`),
  INDEX `idx_tenant_subdomain` (`subdomain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. STORE BRANCHES
-- ============================================================================
DROP TABLE IF EXISTS `store_branches`;
CREATE TABLE `store_branches` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `gstin` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  INDEX `idx_branch_tenant` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. USERS, STAFF & CASHIERS
-- ============================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `branch_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `pin_code` VARCHAR(10) DEFAULT '1234',
  `role` ENUM('ADMIN', 'MANAGER', 'CASHIER', 'STORE_KEEPER') NOT NULL DEFAULT 'CASHIER',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_user` (`tenant_id`, `username`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`branch_id`) REFERENCES `store_branches` (`id`) ON DELETE SET NULL,
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. SUPPLIERS
-- ============================================================================
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `contact` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `gstin` VARCHAR(50) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  INDEX `idx_supplier_tenant` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. PRODUCT CATEGORIES
-- ============================================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_category` (`tenant_id`, `name`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. PRODUCTS & INVENTORY CATALOG
-- ============================================================================
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `barcode` VARCHAR(100) NOT NULL,
  `category` VARCHAR(150) NOT NULL,
  `category_id` VARCHAR(64) DEFAULT NULL,
  `sku` VARCHAR(100) NOT NULL,
  `purchase_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,        -- Selling Price
  `mrp` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,          -- Maximum Retail Price (Printed)
  `gst_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,      -- e.g. 0, 5, 12, 18, 28
  `hsn_code` VARCHAR(20) DEFAULT NULL,
  `unit` VARCHAR(30) NOT NULL DEFAULT 'Pieces',        -- Kg, Liters, Pieces, Packs, Grams
  `stock` INT NOT NULL DEFAULT 0,
  `min_stock_alert` INT NOT NULL DEFAULT 10,
  `batch_number` VARCHAR(100) NOT NULL DEFAULT 'B-01',
  `expiry_date` DATE DEFAULT NULL,
  `supplier_name` VARCHAR(255) DEFAULT NULL,
  `supplier_id` VARCHAR(64) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
  INDEX `idx_product_barcode` (`tenant_id`, `barcode`),
  INDEX `idx_product_sku` (`tenant_id`, `sku`),
  INDEX `idx_product_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. BRANCH-WISE ISOLATED PRODUCT STOCK
-- ============================================================================
DROP TABLE IF EXISTS `branch_inventory`;
CREATE TABLE `branch_inventory` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `branch_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `min_stock_alert` INT NOT NULL DEFAULT 10,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_branch_product` (`branch_id`, `product_id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`branch_id`) REFERENCES `store_branches` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. CUSTOMERS & LOYALTY CLUB
-- ============================================================================
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `loyalty_points` INT NOT NULL DEFAULT 0,
  `credit_balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_spent` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_customer_phone` (`tenant_id`, `phone`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  INDEX `idx_cust_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. INVOICES / BILLS MASTER
-- ============================================================================
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `id` VARCHAR(64) NOT NULL,                          -- e.g. EAS-20260521-1899
  `tenant_id` VARCHAR(64) NOT NULL,
  `store_branch_id` VARCHAR(64) NOT NULL,
  `invoice_date` DATE NOT NULL,
  `invoice_time` VARCHAR(15) NOT NULL,                -- HH:MM format
  `customer_id` VARCHAR(64) DEFAULT NULL,
  `customer_name` VARCHAR(255) DEFAULT NULL,
  `customer_phone` VARCHAR(30) DEFAULT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `tax_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_mrp_value` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_mrp_savings` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `coupon_code` VARCHAR(50) DEFAULT NULL,
  `grand_total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `payment_mode` ENUM('CASH', 'UPI', 'CARD', 'STORE_CREDIT', 'SPLIT') NOT NULL DEFAULT 'CASH',
  `cash_received` DECIMAL(12, 2) DEFAULT 0.00,
  `change_returned` DECIMAL(12, 2) DEFAULT 0.00,
  `cashier_name` VARCHAR(255) NOT NULL,
  `cashier_id` VARCHAR(64) DEFAULT NULL,
  `status` ENUM('PAID', 'RETURNED', 'EXCHANGED', 'CANCELLED') NOT NULL DEFAULT 'PAID',
  `returned_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`store_branch_id`) REFERENCES `store_branches` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  INDEX `idx_invoice_tenant_date` (`tenant_id`, `invoice_date`),
  INDEX `idx_invoice_branch` (`store_branch_id`),
  INDEX `idx_invoice_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. INVOICE LINE ITEMS (WITH SEPARATE QUANTITY & MRP)
-- ============================================================================
DROP TABLE IF EXISTS `invoice_items`;
CREATE TABLE `invoice_items` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `invoice_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `barcode` VARCHAR(100) NOT NULL,
  `mrp` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,       -- Unit Selling Rate
  `quantity` DECIMAL(10, 3) NOT NULL DEFAULT 1.000,   -- Strictly numeric quantity
  `unit` VARCHAR(30) NOT NULL DEFAULT 'Pieces',       -- Unit specification
  `gst_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `gst_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL,
  INDEX `idx_item_invoice` (`invoice_id`),
  INDEX `idx_item_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. PAYMENT TRANSACTIONS & SPLIT PAYMENTS
-- ============================================================================
DROP TABLE IF EXISTS `payment_transactions`;
CREATE TABLE `payment_transactions` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `invoice_id` VARCHAR(64) NOT NULL,
  `payment_mode` ENUM('CASH', 'UPI', 'CARD', 'STORE_CREDIT') NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `transaction_ref` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'SUCCESS',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  INDEX `idx_payment_invoice` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. CASHIER SHIFTS & CASH TENDER SESSIONS
-- ============================================================================
DROP TABLE IF EXISTS `cash_sessions`;
CREATE TABLE `cash_sessions` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `store_branch_id` VARCHAR(64) NOT NULL,
  `cashier_id` VARCHAR(64) NOT NULL,
  `cashier_name` VARCHAR(255) NOT NULL,
  `start_time` TIMESTAMP NOT NULL,
  `end_time` TIMESTAMP NULL DEFAULT NULL,
  `opening_balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `closing_balance` DECIMAL(12, 2) DEFAULT NULL,
  `actual_cash_in_drawer` DECIMAL(12, 2) DEFAULT NULL,
  `difference` DECIMAL(12, 2) DEFAULT NULL,
  `sales_cash` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `sales_upi` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `sales_card` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`store_branch_id`) REFERENCES `store_branches` (`id`) ON DELETE CASCADE,
  INDEX `idx_shift_cashier` (`cashier_id`),
  INDEX `idx_shift_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 13. STOCK ADJUSTMENT LOGS
-- ============================================================================
DROP TABLE IF EXISTS `stock_adjustments`;
CREATE TABLE `stock_adjustments` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `store_branch_id` VARCHAR(64) DEFAULT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `adjustment_date` DATE NOT NULL,
  `previous_stock` INT NOT NULL,
  `new_stock` INT NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `adjusted_by` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`store_branch_id`) REFERENCES `store_branches` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  INDEX `idx_adj_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 14. INTER-BRANCH STOCK TRANSFERS
-- ============================================================================
DROP TABLE IF EXISTS `stock_transfers`;
CREATE TABLE `stock_transfers` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) NOT NULL,
  `from_branch_id` VARCHAR(64) NOT NULL,
  `to_branch_id` VARCHAR(64) NOT NULL,
  `quantity` INT NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `requested_by` VARCHAR(255) NOT NULL,
  `requested_date` DATE NOT NULL,
  `actioned_by` VARCHAR(255) DEFAULT NULL,
  `actioned_date` DATE DEFAULT NULL,
  `comments` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`from_branch_id`) REFERENCES `store_branches` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`to_branch_id`) REFERENCES `store_branches` (`id`) ON DELETE CASCADE,
  INDEX `idx_transfer_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 15. OPERATING EXPENSES
-- ============================================================================
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `store_branch_id` VARCHAR(64) NOT NULL,
  `expense_date` DATE NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `description` TEXT NOT NULL,
  `approved_by` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`store_branch_id`) REFERENCES `store_branches` (`id`) ON DELETE CASCADE,
  INDEX `idx_expense_date` (`expense_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 16. PROMOTIONS & DISCOUNT COUPONS
-- ============================================================================
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `discount_type` ENUM('PERCENT', 'FIXED') NOT NULL DEFAULT 'PERCENT',
  `discount_value` DECIMAL(10, 2) NOT NULL,
  `min_cart_value` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `max_discount_cap` DECIMAL(12, 2) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `valid_until` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_coupon_code` (`tenant_id`, `code`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 17. APP CONFIGURATION & PRINT SETTINGS
-- ============================================================================
DROP TABLE IF EXISTS `app_settings`;
CREATE TABLE `app_settings` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `store_branch_id` VARCHAR(64) DEFAULT NULL,
  `auto_print_receipt` TINYINT(1) NOT NULL DEFAULT 1,
  `enable_sound` TINYINT(1) NOT NULL DEFAULT 1,
  `receipt_header` TEXT DEFAULT NULL,
  `receipt_footer` TEXT DEFAULT NULL,
  `max_discount_allowed` DECIMAL(5, 2) NOT NULL DEFAULT 25.00,
  `printer_layout` ENUM('standard-a4', 'thermal-80mm', 'thermal-58mm') NOT NULL DEFAULT 'thermal-80mm',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_branch_settings` (`tenant_id`, `store_branch_id`),
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`store_branch_id`) REFERENCES `store_branches` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 18. AUDIT LOGS & COMPLIANCE HISTORY
-- ============================================================================
DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) DEFAULT NULL,
  `user_name` VARCHAR(255) DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(100) NOT NULL,
  `details` JSON DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_tenant_action` (`tenant_id`, `action`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED INITIAL PRODUCTION DATA
-- ============================================================================

-- 1. Default Master Tenant (expertbilling.in)
INSERT INTO `tenants` (
  `id`, `name`, `subdomain`, `admin_email`, `admin_login_id`, `password_hash`,
  `phone`, `currency`, `tier`, `status`, `color_theme`, `max_branches`,
  `max_products`, `onboarding_fee_paid`, `monthly_subscription_fee`, `billing_cycle`,
  `subscription_start_date`, `subscription_end_date`, `contract_duration_months`,
  `renewal_status`, `onboarding_setup_status`, `client_verification_status`, `gstin_reg_number`
) VALUES (
  'TENANT-001', 'Expert POS Retail Hub', 'expertbilling.in', 'admin@expertbilling.in', 'expertadmin',
  '$2b$10$v7g9L/zG.iW.RkG6K1k6xeq0aT21U8u.xJ1dE9nFzT3x9e9Q7mKqS', -- Hashed 'Pos@2026'
  '9810234567', 'INR', 'ENTERPRISE', 'ACTIVE', 'emerald', 10,
  50000, 5000.00, 2499.00, 'ANNUAL',
  '2026-01-01', '2027-01-01', 12,
  'AUTO_RENEW', 'COMPLETED', 'VERIFIED', '07AAAAA1111A1Z1'
);

-- 2. Store Branches
INSERT INTO `store_branches` (`id`, `tenant_id`, `name`, `address`, `city`, `phone`, `gstin`, `is_active`) VALUES
('B1', 'TENANT-001', 'Downtown Smart Hypermarket', 'G-10, Central Plaza, Main Avenue', 'New Delhi', '011-23456789', '07AAAAA1111A1Z1', 1),
('B2', 'TENANT-001', 'South City Megastore', 'Plot 44, Metro Mall, Outer Ring Road', 'Bengaluru', '080-45678901', '29AAAAA1111A1Z2', 1);

-- 3. Users / Staff (Admin, Manager, Cashier, Store Keeper)
INSERT INTO `users` (`id`, `tenant_id`, `branch_id`, `name`, `username`, `email`, `phone`, `password_hash`, `pin_code`, `role`, `is_active`) VALUES
('USR-ADMIN', 'TENANT-001', 'B1', 'Super Administrator', 'admin', 'admin@expertbilling.in', '9810234567', '$2b$10$v7g9L/zG.iW.RkG6K1k6xeq0aT21U8u.xJ1dE9nFzT3x9e9Q7mKqS', '9999', 'ADMIN', 1),
('USR-MGR01', 'TENANT-001', 'B1', 'Rajesh K. Mehta', 'manager1', 'manager@expertbilling.in', '9810987654', '$2b$10$v7g9L/zG.iW.RkG6K1k6xeq0aT21U8u.xJ1dE9nFzT3x9e9Q7mKqS', '5555', 'MANAGER', 1),
('USR-CSH01', 'TENANT-001', 'B1', 'Samarjeet Sen', 'cashier1', 'samarjeet@expertbilling.in', '9810444333', '$2b$10$v7g9L/zG.iW.RkG6K1k6xeq0aT21U8u.xJ1dE9nFzT3x9e9Q7mKqS', '1234', 'CASHIER', 1),
('USR-CSH02', 'TENANT-001', 'B1', 'Arundhati Roy', 'cashier2', 'arundhati@expertbilling.in', '9810222111', '$2b$10$v7g9L/zG.iW.RkG6K1k6xeq0aT21U8u.xJ1dE9nFzT3x9e9Q7mKqS', '4321', 'CASHIER', 1),
('USR-STK01', 'TENANT-001', 'B1', 'Devendra Singh', 'storekeeper1', 'devendra@expertbilling.in', '9810666777', '$2b$10$v7g9L/zG.iW.RkG6K1k6xeq0aT21U8u.xJ1dE9nFzT3x9e9Q7mKqS', '7777', 'STORE_KEEPER', 1);

-- 4. Suppliers
INSERT INTO `suppliers` (`id`, `tenant_id`, `name`, `contact`, `phone`, `email`, `gstin`, `address`) VALUES
('S1', 'TENANT-001', 'Supreme Agro Foods Ltd.', 'Rajesh Kumar', '9876543210', 'sales@supremeagro.com', '07AAAAA1111A1Z1', 'Wholesale Market Block A, Delhi'),
('S2', 'TENANT-001', 'Apex Retail Supplies', 'Lydia Reynolds', '8765432109', 'orders@apexretail.com', '08BBBBB2222B2Z2', 'Industrial Area Phase 2, Gurugram'),
('S3', 'TENANT-001', 'Organica Green Farm Producers', 'Sandeep Patil', '7654321098', 'fresh@organicafarm.org', '09CCCCC3333C3Z3', 'Organic Belt, Nashik'),
('S4', 'TENANT-001', 'Zenith Household Brands', 'Sarah Jenkins', '6543210987', 'zenithcontacts@gmail.com', '10DDDDD4444D4Z4', 'FMCG Trade Tower, Mumbai');

-- 5. Product Categories
INSERT INTO `categories` (`id`, `tenant_id`, `name`, `description`) VALUES
('CAT-01', 'TENANT-001', 'Fresh Fruits & Vegetables', 'Daily fresh farm produce, organic greens and fruits'),
('CAT-02', 'TENANT-001', 'Dairy & Eggs', 'Milk, butter, cheeses, paneer, and eggs'),
('CAT-03', 'TENANT-001', 'Grains & Grocery', 'Staples, flours, premium basmati rice, pulses, and edible oils'),
('CAT-04', 'TENANT-001', 'Beverages', 'Juices, carbonated soft drinks, tea and roasted coffees'),
('CAT-05', 'TENANT-001', 'Snacks & Sweets', 'Chips, biscuits, confectioneries and chocolates'),
('CAT-06', 'TENANT-001', 'Household', 'Detergents, disinfectants, cleaners and kitchenware');

-- 6. Products Catalog (with MRP and Cost Price)
INSERT INTO `products` (
  `id`, `tenant_id`, `name`, `barcode`, `category`, `category_id`, `sku`,
  `purchase_price`, `price`, `mrp`, `gst_rate`, `unit`, `stock`, `min_stock_alert`,
  `batch_number`, `expiry_date`, `supplier_name`, `supplier_id`, `is_active`
) VALUES
('PROD-F01', 'TENANT-001', 'Golden Delicious Apples (Imported)', '8901031200051', 'Fresh Fruits & Vegetables', 'CAT-01', 'FRT-APP-GD', 120.00, 180.00, 220.00, 5.00, 'Kg', 75, 20, 'B-APL-05A', '2026-06-15', 'Organica Green Farm Producers', 'S3', 1),
('PROD-F02', 'TENANT-001', 'Organic Cavendish Bananas', '8901031200068', 'Fresh Fruits & Vegetables', 'CAT-01', 'FRT-BAN-OC', 35.00, 60.00, 75.00, 0.00, 'Kg', 12, 25, 'B-BAN-08V', '2026-05-28', 'Organica Green Farm Producers', 'S3', 1),
('PROD-D01', 'TENANT-001', 'Classic Salted Butter 500g', '8901262010115', 'Dairy & Eggs', 'CAT-02', 'DRY-BUT-AM', 210.00, 260.00, 290.00, 12.00, 'Pieces', 48, 15, 'MFT-BUT-C6', '2026-08-10', 'Supreme Agro Foods Ltd.', 'S1', 1),
('PROD-D02', 'TENANT-001', 'Full Cream Milk 1L Tetra', '8901262020213', 'Dairy & Eggs', 'CAT-02', 'DRY-MLK-FC', 62.00, 78.00, 85.00, 5.00, 'Pieces', 9, 30, 'MFT-MLK-M1', '2026-06-03', 'Supreme Agro Foods Ltd.', 'S1', 1),
('PROD-G01', 'TENANT-001', 'Basmati Premium Rice 5Kg', '8902511000122', 'Grains & Grocery', 'CAT-03', 'GRN-BAS-R5', 480.00, 650.00, 747.50, 5.00, 'Pieces', 120, 30, 'B-BAS-09', '2027-12-31', 'Apex Retail Supplies', 'S2', 1),
('PROD-G02', 'TENANT-001', 'Whole Wheat Atta 10Kg', '8901725181222', 'Grains & Grocery', 'CAT-03', 'GRN-ATT-W10', 320.00, 440.00, 499.00, 0.00, 'Pieces', 85, 25, 'B-ATT-242', '2026-11-20', 'Apex Retail Supplies', 'S2', 1),
('PROD-B01', 'TENANT-001', 'Fizzy Cola Zero Sugar 330ml Can', '5449000133335', 'Beverages', 'CAT-04', 'BEV-COL-ZC', 18.00, 40.00, 45.00, 18.00, 'Pieces', 450, 100, 'B-COL-990', '2026-12-05', 'Apex Retail Supplies', 'S2', 1),
('PROD-B02', 'TENANT-001', 'Premium Roasted Coffee Beans 250g', '8906044675543', 'Beverages', 'CAT-04', 'BEV-COF-PR', 280.00, 499.00, 550.00, 18.00, 'Pieces', 35, 10, 'B-CFB-A1', '2026-05-30', 'Apex Retail Supplies', 'S2', 1),
('PROD-S01', 'TENANT-001', 'Crisp Potato Wafers (Classic Salted)', '8901491101830', 'Snacks & Sweets', 'CAT-05', 'SNC-POT-CS', 12.00, 20.00, 25.00, 18.00, 'Pieces', 280, 50, 'B-POT-88', '2026-09-18', 'Apex Retail Supplies', 'S2', 1),
('PROD-H01', 'TENANT-001', 'Multipurpose Glass Cleaner Spray 500ml', '8901248102322', 'Household', 'CAT-06', 'HSD-GLS-CL', 55.00, 95.00, 109.25, 18.00, 'Pieces', 40, 12, 'B-HSD-312', '2028-04-12', 'Zenith Household Brands', 'S4', 1);

-- 7. Branch Inventory Initial Stock Allocation
INSERT INTO `branch_inventory` (`tenant_id`, `branch_id`, `product_id`, `stock_quantity`, `min_stock_alert`) VALUES
('TENANT-001', 'B1', 'PROD-F01', 75, 20),
('TENANT-001', 'B1', 'PROD-F02', 12, 25),
('TENANT-001', 'B1', 'PROD-D01', 48, 15),
('TENANT-001', 'B1', 'PROD-D02', 9, 30),
('TENANT-001', 'B1', 'PROD-G01', 120, 30),
('TENANT-001', 'B1', 'PROD-G02', 85, 25),
('TENANT-001', 'B1', 'PROD-B01', 450, 100),
('TENANT-001', 'B1', 'PROD-B02', 35, 10),
('TENANT-001', 'B1', 'PROD-S01', 280, 50),
('TENANT-001', 'B1', 'PROD-H01', 40, 12),
-- Branch 2 stock
('TENANT-001', 'B2', 'PROD-F01', 45, 15),
('TENANT-001', 'B2', 'PROD-G01', 60, 20),
('TENANT-001', 'B2', 'PROD-B01', 200, 50);

-- 8. Customers
INSERT INTO `customers` (`id`, `tenant_id`, `name`, `phone`, `email`, `loyalty_points`, `credit_balance`, `total_spent`) VALUES
('CUST-01', 'TENANT-001', 'Ananya Sharma', '9810234567', 'ananya@gmail.com', 485, 120.00, 6840.00),
('CUST-02', 'TENANT-001', 'Vikram Malhotra', '9920198754', 'vikram.m@yahoo.com', 1250, 0.00, 14250.00),
('CUST-03', 'TENANT-001', 'Sunita Deshmukh', '9830561234', 'sunita.d@outlook.com', 180, 500.00, 2800.00),
('CUST-04', 'TENANT-001', 'Rahul Verma', '9510111222', 'rahul@verma.net', 50, 0.00, 950.00);

-- 9. Sample Invoices
INSERT INTO `invoices` (
  `id`, `tenant_id`, `store_branch_id`, `invoice_date`, `invoice_time`,
  `customer_id`, `customer_name`, `customer_phone`, `subtotal`, `tax_amount`,
  `discount_percent`, `discount_amount`, `total_mrp_value`, `total_mrp_savings`,
  `coupon_code`, `grand_total`, `payment_mode`, `cash_received`, `change_returned`,
  `cashier_name`, `cashier_id`, `status`
) VALUES
(
  'EAS-20260521-1042', 'TENANT-001', 'B1', '2026-05-21', '14:24',
  'CUST-01', 'Ananya Sharma', '9810234567', 720.00, 67.20,
  5.00, 36.00, 855.00, 171.00,
  'WELCOME5', 684.00, 'UPI', 684.00, 0.00,
  'Arundhati Roy', 'USR-CSH02', 'PAID'
),
(
  'EAS-20260521-1899', 'TENANT-001', 'B1', '2026-05-21', '18:45',
  'CUST-02', 'Vikram Malhotra', '9920198754', 1395.00, 82.10,
  0.00, 0.00, 1604.25, 209.25,
  NULL, 1395.00, 'CARD', 1395.00, 0.00,
  'Samarjeet Sen', 'USR-CSH01', 'PAID'
);

-- 10. Invoice Line Items (With separate Quantity column)
INSERT INTO `invoice_items` (`invoice_id`, `product_id`, `name`, `barcode`, `mrp`, `price`, `quantity`, `unit`, `gst_rate`, `gst_amount`, `subtotal`) VALUES
('EAS-20260521-1042', 'PROD-F01', 'Golden Delicious Apples (Imported)', '8901031200051', 220.00, 180.00, 2.000, 'Kg', 5.00, 18.00, 360.00),
('EAS-20260521-1042', 'PROD-D01', 'Classic Salted Butter 500g', '8901262010115', 290.00, 260.00, 1.000, 'Pieces', 12.00, 31.20, 260.00),
('EAS-20260521-1042', 'PROD-S01', 'Crisp Potato Wafers (Classic Salted)', '8901491101830', 25.00, 20.00, 5.000, 'Pieces', 18.00, 18.00, 100.00),
('EAS-20260521-1899', 'PROD-G01', 'Basmati Premium Rice 5Kg', '8902511000122', 747.50, 650.00, 2.000, 'Pieces', 5.00, 65.00, 1300.00),
('EAS-20260521-1899', 'PROD-H01', 'Multipurpose Glass Cleaner Spray 500ml', '8901248102322', 109.25, 95.00, 1.000, 'Pieces', 18.00, 17.10, 95.00);

-- 11. Payment Transactions
INSERT INTO `payment_transactions` (`invoice_id`, `payment_mode`, `amount`, `transaction_ref`, `status`) VALUES
('EAS-20260521-1042', 'UPI', 684.00, 'UPI/614210928192', 'SUCCESS'),
('EAS-20260521-1899', 'CARD', 1395.00, 'TXN_CARD_9812401', 'SUCCESS');

-- 12. Coupons
INSERT INTO `coupons` (`id`, `tenant_id`, `code`, `description`, `discount_type`, `discount_value`, `min_cart_value`, `max_discount_cap`, `is_active`) VALUES
('CPN-01', 'TENANT-001', 'WELCOME5', '5% Off for new loyalty members', 'PERCENT', 5.00, 500.00, 200.00, 1),
('CPN-02', 'TENANT-001', 'FESTIVE10', '10% Festive mega discount', 'PERCENT', 10.00, 1500.00, 500.00, 1),
('CPN-03', 'TENANT-001', 'SAVE50', 'Flat Rs. 50 instant coupon', 'FIXED', 50.00, 800.00, 50.00, 1);

-- 13. Operating Expenses
INSERT INTO `expenses` (`id`, `tenant_id`, `store_branch_id`, `expense_date`, `category`, `amount`, `description`, `approved_by`) VALUES
('EXP-01', 'TENANT-001', 'B1', '2026-05-18', 'Utility (Electricity)', 14500.00, 'Monthly warehouse air cooling bill', 'Admin'),
('EXP-02', 'TENANT-001', 'B1', '2026-05-20', 'Store Branding', 3500.00, 'New LED signboards and display posters printing', 'Manager B1'),
('EXP-03', 'TENANT-001', 'B1', '2026-05-21', 'Logistics', 2400.00, 'Supplier freight charges for fresh vegetables delivery', 'Store Keeper');

-- 14. Stock Adjustments
INSERT INTO `stock_adjustments` (`id`, `tenant_id`, `store_branch_id`, `product_id`, `product_name`, `adjustment_date`, `previous_stock`, `new_stock`, `reason`, `adjusted_by`) VALUES
('ADJ-01', 'TENANT-001', 'B1', 'PROD-F01', 'Golden Delicious Apples (Imported)', '2026-05-19', 80, 75, 'Discarded bruised fruits during morning inspection', 'Store Keeper');

-- 15. Default Settings
INSERT INTO `app_settings` (`tenant_id`, `store_branch_id`, `auto_print_receipt`, `enable_sound`, `receipt_header`, `receipt_footer`, `max_discount_allowed`, `printer_layout`) VALUES
('TENANT-001', 'B1', 1, 1, 'Expert POS Retail Hub\nOfficial Retail Cash Invoice\nDowntown Smart Hypermarket', 'Thank you for shopping with us! Visit again.', 25.00, 'thermal-80mm');

-- ============================================================================
-- END OF SCHEMA SCRIPT
-- ============================================================================
