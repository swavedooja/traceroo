# TraceRoo ILMS - Demo Guide

This guide outlines the process flow for demonstrating the TraceRoo Intelligent Logistics Management System (ILMS).

## 1. Setup & Login
*   **URL:** `http://localhost:3000`
*   **Action:** Click the "Login" button (Authentication is currently simulated).
*   **Result:** You will be redirected to the Dashboard.

## 2. Dashboard Overview
*   **View:** The main dashboard shows key metrics (Total Materials, Active Warehouses, etc.).
*   **Action:** Briefly explain the widgets and navigation menu on the left.

## 3. Master Data Management (Materials)
*   **Navigate:** Click "Materials" in the sidebar.
*   **View:** You should see the dummy data created (e.g., "Premium Widget", "Standard Gadget").
*   **Action:** Click "New Material" to create a new one.
    *   Fill in basic details (Code, Name, SKU).
    *   Click "Save".
*   **Result:** The new material appears in the list.

## 4. Packaging Hierarchy
*   **Navigate:** Click "Packaging" in the sidebar.
*   **View:** See the "Standard Export Hierarchy".
*   **Action:** Click on it to view levels (Box -> Pallet).
*   **Demo:** Explain how this defines how materials are packed.

## 5. Warehouse Management
*   **Navigate:** Click "Warehouses".
*   **View:** See "Main Distribution Center".
*   **Action:** Click to view details and Storage Locations (e.g., "Aisle 1, Shelf 1").

## 6. Label Designer
*   **Navigate:** Click "Label Designer".
*   **Action:** Create a new template or view an existing one.
    *   Drag and drop elements (Text, Barcode, QR Code) onto the canvas.
    *   Save the template.

## 7. Inventory Registration (Scanning)
*   **Navigate:** Click "Registration".
*   **Scenario:** Simulating receiving goods.
*   **Action:**
    *   Select a Material.
    *   Enter a Batch Number.
    *   "Scan" (or enter) a barcode.
    *   Click "Register".

## 8. Track & Trace
*   **Navigate:** Click "Track & Trace".
*   **Action:** Enter a Material Code or Batch Number to search.
*   **Result:** View the history/lineage of the item.

## Technical Notes
*   **Backend:** Running on `localhost:8080`.
*   **Database:** Local SQLite database, synced to Supabase (PostgreSQL) every 5 minutes.
*   **Supabase Sync:** Data created locally is automatically pushed to the cloud for backup and analytics.
