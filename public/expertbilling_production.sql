-- ============================================================================
-- EXPERT BILLING - PRODUCTION MYSQL DATABASE SCHEMA
-- Target Database: u559264694_expertbilling
-- Database User:   u559264694_expertbilling
-- Server Host:     localhost (Hostinger Production) / 145.79.209.120 (Remote)
-- Engine:          InnoDB
-- Character Set:   utf8mb4
-- Collation:       utf8mb4_unicode_ci
-- Generated for:   expertbilling.in / Enterprise Retail POS Hub
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

-- ============================================================================
-- 1. TENANTS & MULTI-TENANCY MASTER
-- ============================================================================
DROP TABLE IF EXISTS `tenants`;
CREATE TABLE `tenants` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `subdomain` VARCHAR(100) NOT NULL,
  `domain_url` VARCHAR(255) DEFAULT NULL,
  `domain_status` VARCHAR(40) DEFAULT 'ACTIVE',
  `business_sector` VARCHAR(50) DEFAULT 'SUPERMARKET',
  `sector_config` JSON DEFAULT NULL,
  `typography` JSON DEFAULT NULL,
  `admin_email` VARCHAR(255) NOT NULL,
  `admin_login_id` VARCHAR(100) DEFAULT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT '₹',
  `tier` VARCHAR(30) NOT NULL DEFAULT 'GROWTH',
  `status` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  `color_theme` VARCHAR(50) NOT NULL DEFAULT 'emerald',
  `max_branches` INT NOT NULL DEFAULT 5,
  `max_products` INT NOT NULL DEFAULT 10000,
  `onboarding_fee_paid` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `monthly_subscription_fee` DECIMAL(12, 2) NOT NULL DEFAULT 1499.00,
  `billing_cycle` VARCHAR(30) NOT NULL DEFAULT 'MONTHLY',
  `last_payment_amount` DECIMAL(12, 2) DEFAULT 0.00,
  `last_payment_date` DATE DEFAULT NULL,
  `subscription_start_date` DATE DEFAULT NULL,
  `subscription_end_date` DATE DEFAULT NULL,
  `contract_duration_months` INT NOT NULL DEFAULT 12,
  `renewal_status` VARCHAR(40) NOT NULL DEFAULT 'AUTO_RENEW',
  `onboarding_setup_status` VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
  `hardware_provisioned` JSON DEFAULT NULL,
  `onboarding_notes` TEXT DEFAULT NULL,
  `client_verification_status` VARCHAR(40) NOT NULL DEFAULT 'VERIFIED',
  `gstin_reg_number` VARCHAR(50) DEFAULT NULL,
  `business_location` VARCHAR(255) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `pincode` VARCHAR(20) DEFAULT NULL,
  `country` VARCHAR(80) DEFAULT 'India',
  `company_logo` MEDIUMTEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_subdomain` (`subdomain`),
  INDEX `idx_tenant_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. STORE BRANCHES
-- ============================================================================
DROP TABLE IF EXISTS `store_branches`;
CREATE TABLE `store_branches` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `name` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `gstin` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_branch_tenant` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. USERS, STAFF & ACCESS PROFILES
-- ============================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) DEFAULT 'TENANT-001',
  `branch_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(120) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `pin_code` VARCHAR(10) DEFAULT '1234',
  `role` VARCHAR(40) NOT NULL DEFAULT 'CASHIER',
  `title` VARCHAR(150) DEFAULT NULL,
  `color` VARCHAR(40) DEFAULT 'emerald',
  `gradient` VARCHAR(100) DEFAULT NULL,
  `bg_hover` VARCHAR(100) DEFAULT NULL,
  `accent` VARCHAR(100) DEFAULT NULL,
  `border_class` VARCHAR(100) DEFAULT NULL,
  `glow` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `privileges` JSON DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. SUPPLIERS
-- ============================================================================
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `name` VARCHAR(255) NOT NULL,
  `contact` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `gstin` VARCHAR(50) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_supplier_tenant` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. PRODUCT CATEGORIES
-- ============================================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. PRODUCTS & INVENTORY CATALOG
-- ============================================================================
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `name` VARCHAR(255) NOT NULL,
  `barcode` VARCHAR(100) NOT NULL,
  `category` VARCHAR(150) NOT NULL,
  `category_id` VARCHAR(64) DEFAULT NULL,
  `sku` VARCHAR(100) NOT NULL,
  `purchase_price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `mrp` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `gst_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `hsn_code` VARCHAR(20) DEFAULT NULL,
  `unit` VARCHAR(40) NOT NULL DEFAULT 'Pieces',
  `unit_quantity` DECIMAL(10, 3) DEFAULT 1.000,
  `unit_label` VARCHAR(60) DEFAULT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `min_stock_alert` INT NOT NULL DEFAULT 10,
  `batch_number` VARCHAR(100) NOT NULL DEFAULT 'B-01',
  `expiry_date` VARCHAR(30) DEFAULT NULL,
  `supplier_name` VARCHAR(255) DEFAULT NULL,
  `supplier_id` VARCHAR(64) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
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
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `branch_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `min_stock_alert` INT NOT NULL DEFAULT 10,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_branch_product` (`branch_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. CUSTOMERS & LOYALTY CLUB
-- ============================================================================
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `loyalty_points` INT NOT NULL DEFAULT 0,
  `credit_balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_spent` DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cust_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. INVOICES / BILLS MASTER
-- ============================================================================
DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `store_branch_id` VARCHAR(64) NOT NULL DEFAULT 'B1',
  `invoice_date` VARCHAR(20) NOT NULL,
  `invoice_time` VARCHAR(25) NOT NULL,
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
  `payment_mode` VARCHAR(30) NOT NULL DEFAULT 'CASH',
  `cash_received` DECIMAL(12, 2) DEFAULT 0.00,
  `change_returned` DECIMAL(12, 2) DEFAULT 0.00,
  `cashier_name` VARCHAR(255) NOT NULL,
  `cashier_id` VARCHAR(64) DEFAULT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'PAID',
  `returned_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_invoice_tenant_date` (`tenant_id`, `invoice_date`),
  INDEX `idx_invoice_branch` (`store_branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. INVOICE LINE ITEMS
-- ============================================================================
DROP TABLE IF EXISTS `invoice_items`;
CREATE TABLE `invoice_items` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `invoice_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `barcode` VARCHAR(100) NOT NULL,
  `mrp` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `price` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `quantity` DECIMAL(10, 3) NOT NULL DEFAULT 1.000,
  `unit` VARCHAR(40) NOT NULL DEFAULT 'Pieces',
  `unit_quantity` DECIMAL(10, 3) DEFAULT 1.000,
  `unit_label` VARCHAR(60) DEFAULT NULL,
  `gst_rate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  `gst_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  INDEX `idx_item_invoice` (`invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. CASHIER SHIFTS & CASH TENDER SESSIONS
-- ============================================================================
DROP TABLE IF EXISTS `cash_sessions`;
CREATE TABLE `cash_sessions` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `store_branch_id` VARCHAR(64) NOT NULL DEFAULT 'B1',
  `cashier_id` VARCHAR(64) NOT NULL,
  `cashier_name` VARCHAR(255) NOT NULL,
  `start_time` VARCHAR(64) NOT NULL,
  `end_time` VARCHAR(64) DEFAULT NULL,
  `opening_balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `closing_balance` DECIMAL(12, 2) DEFAULT NULL,
  `actual_cash_in_drawer` DECIMAL(12, 2) DEFAULT NULL,
  `difference` DECIMAL(12, 2) DEFAULT NULL,
  `sales_cash` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `sales_upi` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `sales_card` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. STOCK ADJUSTMENT LOGS
-- ============================================================================
DROP TABLE IF EXISTS `stock_adjustments`;
CREATE TABLE `stock_adjustments` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `store_branch_id` VARCHAR(64) DEFAULT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `adjustment_date` VARCHAR(20) NOT NULL,
  `previous_stock` INT NOT NULL,
  `new_stock` INT NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `adjusted_by` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 13. INTER-BRANCH STOCK TRANSFERS
-- ============================================================================
DROP TABLE IF EXISTS `stock_transfers`;
CREATE TABLE `stock_transfers` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `product_id` VARCHAR(64) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `sku` VARCHAR(100) NOT NULL,
  `from_branch_id` VARCHAR(64) NOT NULL,
  `to_branch_id` VARCHAR(64) NOT NULL,
  `quantity` INT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  `requested_by` VARCHAR(255) NOT NULL,
  `requested_date` VARCHAR(20) NOT NULL,
  `actioned_by` VARCHAR(255) DEFAULT NULL,
  `actioned_date` VARCHAR(20) DEFAULT NULL,
  `comments` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 14. OPERATING EXPENSES
-- ============================================================================
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` VARCHAR(64) NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'TENANT-001',
  `store_branch_id` VARCHAR(64) NOT NULL DEFAULT 'B1',
  `expense_date` VARCHAR(20) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `description` TEXT NOT NULL,
  `approved_by` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 15. APP CONFIGURATION & PRINT SETTINGS
-- ============================================================================
DROP TABLE IF EXISTS `app_settings`;
CREATE TABLE `app_settings` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `tenant_id` VARCHAR(64) NOT NULL DEFAULT 'GLOBAL',
  `store_branch_id` VARCHAR(64) NOT NULL DEFAULT 'DEFAULT',
  `auto_print_receipt` TINYINT(1) NOT NULL DEFAULT 1,
  `enable_sound` TINYINT(1) NOT NULL DEFAULT 1,
  `receipt_header` TEXT DEFAULT NULL,
  `receipt_footer` TEXT DEFAULT NULL,
  `max_discount_allowed` DECIMAL(5, 2) NOT NULL DEFAULT 25.00,
  `printer_layout` VARCHAR(30) NOT NULL DEFAULT 'thermal-80mm',
  `attractive_mode` VARCHAR(40) NOT NULL DEFAULT 'mint',
  `login_bg_mode` VARCHAR(40) NOT NULL DEFAULT 'cosmic-aurora',
  `active_tenant_id` VARCHAR(64) NOT NULL DEFAULT '',
  `current_branch_id` VARCHAR(64) NOT NULL DEFAULT '',
  `label_printer_config` JSON DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_branch_settings` (`tenant_id`, `store_branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- CLEAN PRODUCTION SEED (SUPER ADMIN ONLY)
-- Everything else starts empty so all clients, branches, products & staff
-- can be created fresh via the Super Admin Console.
-- ============================================================================
INSERT INTO `users` (
  `id`, `tenant_id`, `branch_id`, `name`, `username`, `email`, `phone`, `password_hash`, `role`, `title`, `color`, `is_active`
) VALUES (
  'USR-SUPERADMIN', NULL, NULL, 'System Sovereign (Super Admin)', 'superadmin', 'superadmin@expertbilling.in', '+91 9900112233', '123456', 'ADMIN', 'Super Admin Master Controls', 'violet', 1
);

INSERT INTO `app_settings` (
  `tenant_id`, `store_branch_id`, `auto_print_receipt`, `enable_sound`, `receipt_header`, `receipt_footer`, `max_discount_allowed`, `printer_layout`, `attractive_mode`, `login_bg_mode`, `active_tenant_id`, `current_branch_id`
) VALUES (
  'GLOBAL', 'DEFAULT', 1, 1, 'OFFICIAL RETAIL CASH INVOICE', 'Thank you for shopping! Powered by Expert POS SaaS', 25.00, 'thermal-80mm', 'mint', 'cosmic-aurora', '', ''
);
