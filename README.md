# VTEX CleverTap App - Complete Technical Documentation

## 📋 Table of Contents

1. [Overview](#1-overview)
2. [Application Architecture](#2-application-architecture)
3. [Component Structure](#3-component-structure)
4. [Installation and Configuration](#4-installation-and-configuration)
5. [Core Features](#5-core-features)
6. [Event System](#6-event-system)
7. [Catalog Synchronization](#7-catalog-synchronization)
8. [Data Flows](#8-data-flows)
9. [APIs and Integrations](#9-apis-and-integrations)
10. [Detailed Code Structure](#10-detailed-code-structure)
11. [Service Workers and Push Notifications](#11-service-workers-and-push-notifications)
12. [Troubleshooting and Maintenance](#12-troubleshooting-and-maintenance)

---

## 1. Overview

### 1.1 What is this application?

The **VTEX CleverTap App** is a VTEX IO application that natively integrates the VTEX e-commerce platform with the CleverTap customer engagement platform. This integration enables automatic tracking of user behavior events, product catalog synchronization, and personalized campaign delivery through multiple channels.

### 1.2 Key Benefits

- **Automatic Tracking**: Automatic capture of browsing, cart, checkout, and purchase events
- **Catalog Synchronization**: Automatic VTEX product synchronization to CleverTap catalog (every 24 hours)
- **Personalized Campaigns**: Support for Web Push, Web Pop-ups, Web Exit Intent, and Web Native Display
- **Native Integration**: No additional development or manual tags required
- **VTEX IO Compliance**: Fully compatible with VTEX IO architecture

### 1.3 Technical Specifications

- **Current Version**: 0.0.20
- **Vendor**: clevertappartnerbr
- **Platform**: VTEX IO
- **Builders Used**:
  - Node.js 6.x (Backend)
  - React 3.x (Frontend/Pixel)
  - Store 0.x
  - Pixel 0.x
  - Service Worker 0.x
  - Docs 0.x

### 1.4 Supported Regions

The app supports all CleverTap regions:
- `us1` - United States
- `eu1` - Europe
- `in1` - India
- `sg1` - Singapore
- `aps3` - Asia Pacific
- `mec1` - Middle East

---

## 2. Application Architecture

### 2.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         VTEX STOREFRONT                         │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   Pixel     │───▶│  React App   │───▶│  CleverTap   │        │
│  │  (head.html)│    │  (Frontend)  │    │   Web SDK    │        │
│  └─────────────┘    └──────────────┘    └──────────────┘        │
│         │                    │                    │             │
│         │                    │                    │             │
│         └────────────────────┴────────────────────┘             │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   localStorage       │
                    │   (clevertapConfigs) │
                    └─────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VTEX CHECKOUT                              │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐         │
│  │  checkout6-custom.js (CDN Script)                  │         │
│  │  ├─ Checkout Started                               │         │
│  │  ├─ Payment Info                                   │         │
│  │  ├─ Checkout Steps                                 │         │
│  │  └─ Coupon Applied/Denied                          │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VTEX BACKEND (Node.js)                     │ 
│                                                                 │
│  ┌─────────────────┐    ┌────────────────┐                      │
│  │  OMS Events     │───▶│   Middleware   │                      │
│  │  Broadcast      │    │   Handlers     │                      │
│  └─────────────────┘    └────────────────┘                      │ 
│          │                      │                               │
│          │                      ▼                               │
│          │           ┌─────────────────────┐                    │
│          │           │  Catalog Service    │                    │
│          │           └─────────────────────┘                    │
│          │                      │                               │
│          │                      ▼                               │
│          │           ┌─────────────────────┐                    │
│          └──────────▶│  CleverTap Client   │                    │
│                      └─────────────────────┘                    │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLEVERTAP PLATFORM                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Events     │  │   Profiles   │  │   Catalog    │           │
│  │   API        │  │   API        │  │   API        │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │ 
│                                                                 │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Dashboard & Campaign Management                 │           │
│  │  ├─ Segmentation                                 │           │ 
│  │  ├─ Web Push                                     │           │
│  │  ├─ Web Pop-ups                                  │           │
│  │  └─ Exit Intent                                  │           │
│  └──────────────────────────────────────────────────┘           │ 
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Application Layers

#### **Presentation Layer (Frontend)**
- **Pixel App (React)**: Initializes CleverTap SDK and listens to VTEX events
- **Service Worker**: Manages push notifications and offline functionality
- **CleverTap Web SDK**: JavaScript library that communicates with CleverTap

#### **Business Logic Layer (Backend - Node.js)**
- **Event Handlers**: Process OMS (Order Management System) events
- **Catalog Service**: Manages product synchronization
- **Middleware Layer**: Validates and transforms data before sending

#### **Integration Layer**
- **CleverTap API Clients**: HTTP clients for CleverTap communication
- **VTEX API Clients**: Clients to access VTEX APIs (Catalog, OMS, Master Data)

---

## 3. Component Structure

### 3.1 Directory Structure

```
vtex-clevertap-app-main/
│
├── docs/                          # Documentation
│   ├── README.md                  # Installation guide
│   ├── events-summary.md          # Event summary
│   └── images/                    # Screenshots
│
├── node/                          # Backend (Node.js)
│   ├── clients/                   # HTTP Clients
│   │   ├── clevertapCatalog.ts   # CleverTap Catalog API Client
│   │   ├── vtexCatalog.ts        # VTEX Catalog API Client
│   │   ├── md.ts                 # Master Data Client
│   │   └── index.ts              # Client exports
│   │
│   ├── handlers/                  # Event Handlers
│   │   └── catalogSyncHandler.ts # Sync handler
│   │
│   ├── middlewares/               # Middlewares
│   │   ├── catalog/
│   │   │   └── validateCatalogSync.ts
│   │   ├── error/
│   │   │   └── errorMiddleware.ts
│   │   └── oms/
│   │       └── omsFilteredEvents.ts  # OMS event processor
│   │
│   ├── services/                  # Business Services
│   │   └── CatalogService.ts     # Synchronization service
│   │
│   ├── utils/                     # Utilities
│   │   ├── get-categories.ts
│   │   ├── get-payment-method.ts
│   │   ├── get-total.ts
│   │   └── normalize-items.ts
│   │
│   ├── lib/                       # Helper Libraries
│   │   └── clevertap/
│   │       ├── getConfig.ts      # Get configurations
│   │       └── index.ts
│   │
│   ├── routes/                    # HTTP Routes
│   │   └── catalog.ts
│   │
│   ├── index.ts                   # Backend entry point
│   ├── service.json               # Service configuration
│   └── package.json
│
├── react/                         # Frontend (React/Pixel)
│   ├── modules/                   # Event Modules
│   │   ├── enhancedEcommerceEvents.ts  # E-commerce events
│   │   ├── legacyEvents.ts             # Legacy events
│   │   ├── manageEvents.ts             # Event management
│   │   ├── requestEvents.ts            # Request events
│   │   └── utils/
│   │       ├── format-cart-summary.ts
│   │       ├── get-categories.ts
│   │       ├── get-payment-method.ts
│   │       ├── get-price.ts
│   │       ├── get-quantity.ts
│   │       ├── get-seller.ts
│   │       ├── storage-item.ts
│   │       └── index.ts
│   │
│   ├── lib/                       # Libraries
│   │   └── clevertap.ts          # CleverTap initialization
│   │
│   ├── typings/                   # TypeScript Definitions
│   │   ├── clevertap.d.ts
│   │   ├── events.d.ts
│   │   └── global.d.ts
│   │
│   ├── index.tsx                  # Pixel entry point
│   └── package.json
│
├── pixel/                         # Pixel (injected in head)
│   └── head.html                 # Initialization script
│
├── service-workers/               # Service Workers
│   ├── header.js                 # Imports CleverTap SW
│   ├── activate.js
│   ├── install.js
│   ├── push.js
│   ├── fetch.js
│   ├── message.js
│   └── sync.js
│
├── store/                         # Store configurations
│   ├── interfaces.json
│   └── plugins.json
│
├── public/                        # Public assets
│   └── metadata/
│       ├── messages/              # Translations
│       ├── licenses/              # Licenses
│       └── images/
│
├── manifest.json                  # VTEX app manifest
├── package.json
└── yarn.lock
```

---

## 4. Installation and Configuration

### 4.1 Prerequisites

Before installing the app, ensure you have:

1. **VTEX IO Account**: Active VTEX store with IO support
2. **CleverTap Account**: Active CleverTap account with:
   - Project ID (Account ID)
   - Account Passcode
   - Region information
3. **Admin Access**: VTEX admin permissions to install apps

### 4.2 Installation Steps

#### Step 1: Install the App from VTEX App Store

1. Access your VTEX Admin:
   ```
   https://{your-account}.myvtex.com/admin
   ```

2. Navigate to **Apps → App Store**

3. Search for **"VTEX CleverTap Pixel App"**

4. Click **Install**

5. Confirm the installation

#### Step 2: Configure CleverTap Credentials

After installation, configure the app with your CleverTap credentials:

1. Go to **Apps → My Apps → VTEX CleverTap Pixel App**

2. Click on **Settings**

3. Fill in the required fields:

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| **CleverTap Project ID** | Your CleverTap Account ID | `XXX-XXX-XXX` | Yes |
| **CleverTap Account Passcode** | Authentication passcode | `XXX-XXX-XXXX` | Yes |
| **CleverTap Region** | Your account region | `us1`, `eu1`, `in1`, `sg1` | Yes |

4. Configure **Preference Settings**:

##### Allow Events from Unknown Users
- **Default**: `true`
- **Description**: Enables event tracking for non-authenticated users
- **Use Case**: Track anonymous browsing behavior before login

##### Track Events
Enable/disable specific events to track:

**Storefront Events:**
- `vtex:search` - Products Searched
- `vtex:filterManipulation` - Product Filtered By Category
- `categoryView` - Product List Viewed
- `vtex:promoView` - Promotion Viewed
- `vtex:promotionClick` - Promotion Clicked
- `vtex:productView` - Product Viewed
- `vtex:productClick` - Product Clicked
- `vtex:addToCart` - Product Added To Cart
- `vtex:removeFromCart` - Product Removed From Cart
- `vtex:viewCart` - Cart Viewed
- `vtex:addToWishlist` - Product Added to Wishlist
- `vtex:removeToWishlist` - Product Removed from Wishlist
- `vtex:share` - Product Shared
- `vtex:orderPlaced` - Order Created

**Checkout Events:**
- `add_to_cart` - Checkout Product Added To Cart
- `remove_from_cart` - Checkout Product Removed From Cart
- `view_cart` - Checkout Cart Viewed
- `begin_checkout` - Checkout Started
- `add_payment_info` - Payment Info
- `checkout_step_viewed` - Checkout Step Viewed/Completed
- `coupon_applied` - Coupon Applied
- `coupon_denied` - Coupon Denied

##### Active Catalog Sync
- **Default**: `true`
- **Description**: Automatically syncs product catalog every 24 hours
- **Note**: When enabled, Integration Email becomes mandatory

##### Integration Email
- **Required if**: Catalog Sync is enabled
- **Description**: Email address to receive sync notifications
- **Format**: Valid email address

5. Click **Save**

#### Step 3: Install Checkout Script (CRITICAL)

The checkout operates independently from the storefront. To track checkout events, you **must** add a script to the checkout configuration.

##### Option A: Via Checkout Settings

1. Navigate to:
   ```
   Store Settings → Checkout → Code → checkout6-custom.js
   ```

2. Insert the following script:

```javascript
;(function () {
  // CleverTap Checkout Events Script
  var scriptUrl =
    'https://cdn.jsdelivr.net/gh/GuiGiesbrecht/vtex-clevertap-scripts/clevertap-checkout-events.js'

  var script = document.createElement('script')
  script.src = scriptUrl
  script.type = 'text/javascript'
  script.async = true

  document.head.appendChild(script)
})()
```

3. Save or publish the checkout configuration

##### Option B: Via Checkout UI Custom

In some VTEX Admin versions:

1. Navigate to:
   ```
   Store Settings → Checkout UI Custom → JavaScript
   ```

2. Insert the same script as above

3. Save changes

**⚠️ WARNING**: Without this script, the following events will NOT be tracked:
- Checkout Started
- Payment Info
- Checkout Steps
- Coupon Applied/Denied
- Cart Abandonment data will be incomplete

### 4.3 Verification

After configuration, verify the integration:

1. **Open your storefront** in a browser

2. **Perform test actions**:
   - Search for products
   - View product details
   - Add items to cart
   - Start checkout
   - Complete a test order

3. **Check CleverTap Dashboard**:
   - Go to **Events** section
   - Verify events are appearing:
     - `Product Viewed`
     - `Product Added to Cart`
     - `Checkout Started`
     - `Order Created`

4. **Check Browser Console**:
   - No CleverTap errors should appear
   - You should see CleverTap initialization messages

---

## 5. Core Features

### 5.1 Event Tracking System

The app automatically tracks user interactions across the entire shopping journey.

#### Frontend Events (Storefront)

These events are captured by the React pixel app:

**Search & Discovery**
- `Products Searched`: Triggered when user performs a search
- `Product Filtered`: When filters are applied to product listings
- `Product List Viewed`: When a category or collection page is viewed

**Product Engagement**
- `Product Viewed`: When a product detail page is loaded
- `Product Clicked`: When a product is clicked from a list
- `Promotion Viewed`: When promotional banners are viewed
- `Promotion Clicked`: When promotional content is clicked

**Shopping Cart**
- `Product Added to Cart`: Item added to shopping cart
- `Product Removed from Cart`: Item removed from cart
- `Cart Viewed`: Shopping cart page viewed

**Wishlist**
- `Product Added to Wishlist`: Item added to wishlist
- `Product Removed from Wishlist`: Item removed from wishlist

**Social**
- `Product Shared`: Product shared via social channels

#### Backend Events (OMS)

These events are captured by the Node.js backend:

**Order States**
- `Charged`: Order payment approved (`payment-approved` state)
- `Order Cancelled`: Order cancelled by user or system (`canceled` state)
- `Checkout Failed`: Payment denied or incomplete order (`payment-denied`, `incomplete` states)

### 5.2 User Profile Synchronization

The app automatically syncs customer data to CleverTap profiles:

**Profile Properties:**
```javascript
{
  Name: "Customer Full Name",
  Email: "customer@email.com",
  Phone: "+1234567890",
  MSG-email: false,
  MSG-push: true,
  MSG-sms: true,
  MSG-whatsapp: true
}
```

**Data Sources:**
- VTEX Session API (`/api/sessions`)
- Master Data (CL entity)
- Order Profile Data

**Sync Trigger:**
- On user login (`vtex:userData` event)
- On order placement (via Master Data lookup)

### 5.3 Catalog Synchronization

Automatic product catalog sync with CleverTap's Catalog API.

#### How It Works

1. **Trigger**: Runs every 24 hours after first order with `payment-approved` status
2. **Process**:
   - Fetches all SKU IDs from VTEX Catalog
   - Retrieves detailed SKU information
   - Transforms to CleverTap catalog format
   - Converts to CSV
   - Uploads via presigned S3 URL
   - Notifies CleverTap to process

3. **Data Mapped**:

```javascript
{
  Identity: "SKU-123",           // SKU ID
  ProductId: "PROD-456",         // Product ID
  SkuId: "SKU-123",              // SKU ID
  Ean: "7891234567890",          // EAN barcode
  RefId: "REF-789",              // Reference ID
  Name: "Product Name - Variant", // Full name
  ImageUrl: "https://...",       // Image URL
  Categories: "Cat1 - Cat2",     // Category path
  BrandName: "Brand",            // Brand name
  SalesChannels: "1,2,3",        // Sales channels
  CommercialCondition: 1         // Commercial condition
}
```

4. **Storage**: Last sync timestamp stored in VBase (`config/lastCatalogSync`)

#### Manual Trigger

While not exposed by default, catalog sync can be triggered manually by:
- Enabling the route in `service.json`
- Making a POST request to the catalog endpoint

---

## 6. Event System

### 6.1 Event Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
│               (Browse, Click, Add to Cart, etc.)            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    VTEX EVENT SYSTEM                        │
│              (vtex.pixel-interfaces)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  CLEVERTAP PIXEL APP                        │
│              (window.postMessage listener)                  │
│                                                             │
│  1. Receive VTEX event                                      │
│  2. Check if event is enabled                               │
│  3. Check user authentication status                        │
│  4. Transform data to CleverTap format                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  CLEVERTAP WEB SDK                          │
│                  (clevertap.event.push)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  CLEVERTAP PLATFORM                         │
│           (Event Processing & Storage)                      │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Event Data Structure

#### Example: Product Viewed Event

**VTEX Event Input:**
```javascript
{
  eventName: 'vtex:productView',
  product: {
    productId: '123',
    productName: 'Blue T-Shirt',
    brand: 'BrandName',
    categories: ['Apparel', 'T-Shirts'],
    items: [{
      skuId: 'SKU-456',
      variant: 'Blue/M',
      price: 29.99,
      quantity: 1,
      imageUrl: 'https://...',
      sellers: [{
        sellerId: '1',
        sellerName: 'Main Seller'
      }]
    }]
  }
}
```

**CleverTap Event Output:**
```javascript
{
  event_name: 'Product Viewed',
  event_data: {
    product_id: '123',
    sku_id: 'SKU-456',
    name: 'Blue T-Shirt',
    brand: 'BrandName',
    category: 'Apparel > T-Shirts',
    variant: 'Blue/M',
    price: 29.99,
    quantity: 1,
    url: 'https://store.com/blue-t-shirt/p',
    image_url: 'https://...',
    seller_id: '1',
    seller_name: 'Main Seller'
  }
}
```

### 6.3 Event Validation Logic

Before sending an event to CleverTap, the app performs these checks:

```javascript
// 1. Check if event is enabled in settings
if (!verifyEvent(eventName)) {
  return // Event disabled
}

// 2. Check user authentication
const isLogged = verifyIsLogged()
const allowUnknown = verifyIsUnknownEvents()

// 3. Decide whether to send
if (!allowUnknown && !isLogged) {
  return // User not logged in and unknown events disabled
}

// 4. Add delay to ensure user data is loaded
await new Promise(resolve => setTimeout(resolve, 500))

// 5. Send event to CleverTap
clevertap.event.push(transformedEvent)
```

### 6.4 Backend Event Processing (OMS)

#### OMS Event Subscription

The app subscribes to specific order state changes:

```json
{
  "sender": "vtex.orders-broadcast",
  "topics": [
    "canceled",
    "payment-approved",
    "incomplete",
    "payment-denied"
  ]
}
```

#### Processing Flow

```
┌─────────────────────────────────────────────────────────────┐
│              ORDER STATE CHANGE IN VTEX                     │
│          (canceled, payment-approved, etc.)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  OMS EVENT BROADCAST                        │
│              (vtex.orders-broadcast)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              CLEVERTAP APP BACKEND                           │
│          (omsFilteredEvents middleware)                      │
│                                                              │
│  1. Check if order already processed                         │
│  2. Fetch full order data from OMS                           │
│  3. Fetch customer email from Master Data                    │
│  4. Map state to CleverTap event                             │
│  5. Send event to CleverTap API                              │
│  6. Check catalog sync schedule                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              CLEVERTAP UPLOAD API                           │
│          (Profile & Event Ingestion)                        │
└─────────────────────────────────────────────────────────────┘
```

#### Event Deduplication

The app prevents duplicate events using an in-memory cache:

```javascript
const processedOrders = new Map<string, Set<string>>()

// Structure:
// {
//   "order-123": Set(['payment-approved', 'canceled']),
//   "order-456": Set(['payment-approved'])
// }
```

**Logic:**
1. Check if order ID exists in cache
2. Check if current state was already processed for this order
3. If not processed, add to cache and proceed
4. If already processed, skip

---

## 7. Catalog Synchronization

### 7.1 Synchronization Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TRIGGER POINT                            │
│        (24h after last sync + order approved)               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              CATALOG SERVICE INITIALIZATION                 │
│          (CatalogService.syncCatalog())                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: FETCH ALL SKU IDS                      │
│          (vtexCatalog.getSKUIds - paginated)                │
│                                                             │
│  GET /api/catalog_system/pvt/sku/stockkeepingunitids        │
│  Pagination: 20 SKUs per page                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         STEP 2: FETCH DETAILED SKU DATA                     │
│       (vtexCatalog.getSKUAndContext - sequential)           │
│                                                             │
│  For each SKU ID:                                           │
│  GET /api/catalog_system/pvt/sku/stockkeepingunitbyid/:id   │
│  • Filter out inactive SKUs                                 │
│  • Transform to CleverTap format                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: CONVERT TO CSV                         │
│              (json2csv library)                             │
│                                                             │
│  CSV Columns:                                               │
│  Identity,ProductId,SkuId,Ean,RefId,Name,ImageUrl,          │
│  Categories,BrandName,SalesChannels,CommercialCondition     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         STEP 4: REQUEST PRESIGNED S3 URL                    │
│       (clevertapCatalog.postCatalogUrl())                   │
│                                                             │
│  POST https://{region}.api.clevertap.com/get_catalog_url    │
│  Headers:                                                   │
│  • X-CleverTap-Account-Id                                   │
│  • X-CleverTap-Passcode                                     │
│                                                             │
│  Response: { presignedS3URL: "https://..." }                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│          STEP 5: UPLOAD CSV TO S3                           │
│       (clevertapCatalog.uploadCatalog())                    │
│                                                             │
│  PUT {presignedS3URL}                                       │
│  Body: CSV Buffer                                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────────────┐
│         STEP 6: NOTIFY CLEVERTAP                                  │
│      (clevertapCatalog.completeUpload())                          │
│                                                                   │
│  POST https://{region}.api.clevertap.com/upload_catalog_completed │
│  Body:                                                            │
│  {                                                                │
│    name: "catalog_{accountName}",                                 │
│    email: "{integrationEmail}",                                   │
│    creator: "{integrationEmail}",                                 │
│    url: "{presignedS3URL}",                                       │
│    replace: true/false                                            │
│  }                                                                │
└──────────────────────────┬────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         STEP 7: UPDATE SYNC TIMESTAMP                       │
│       (vbase.saveJSON('config', 'lastCatalogSync'))         │
│                                                             │
│  Stores: ISO timestamp of successful sync                   │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 SKU Data Transformation

**VTEX SKU Data:**
```javascript
{
  Id: 123,
  ProductId: 456,
  NameComplete: "Blue T-Shirt - Size M",
  ProductName: "Blue T-Shirt",
  SkuName: "Size M",
  IsActive: true,
  ImageUrl: "https://store.vteximg.com/...",
  AlternateIds: {
    Ean: "7891234567890",
    RefId: "REF-123"
  },
  ProductCategories: {
    "1": "Apparel",
    "2": "T-Shirts"
  },
  BrandName: "BrandName",
  SalesChannels: [1, 2, 3],
  CommercialConditionId: 1
}
```

**CleverTap Catalog Format:**
```javascript
{
  Identity: "123",
  ProductId: "456",
  SkuId: "123",
  Ean: "7891234567890",
  RefId: "REF-123",
  Name: "Blue T-Shirt - Size M",
  ImageUrl: "https://store.vteximg.com/...",
  Categories: "Apparel - T-Shirts",
  BrandName: "BrandName",
  SalesChannels: "1,2,3",
  CommercialCondition: "1"
}
```

### 7.3 Sync Scheduling Logic

```javascript
// Check last sync time
const lastSync = await vbase.getJSON('config', 'lastCatalogSync')
const lastRun = new Date(lastSync).getTime()
const hoursSince = (Date.now() - lastRun) / 1000 / 60 / 60

// Only sync if 24+ hours passed
if (hoursSince >= 24) {
  await catalogSyncHandler(ctx)
  await vbase.saveJSON('config', 'lastCatalogSync', new Date().toISOString())
}
```

### 7.4 Error Handling

#### Case 1: Catalog doesn't exist (first sync)

```javascript
try {
  await catalogSyncHandler(ctx, { replace: true })
} catch (error) {
  if (error.message.includes('No Catalog with given name')) {
    // Retry without replace flag to create new catalog
    await catalogSyncHandler(ctx, { replace: false })
  }
}
```

#### Case 2: SKU fetch failure

```javascript
for (const skuId of skuIds) {
  try {
    const skuData = await vtexCatalog.getSKUAndContext(skuId)
    // Process SKU
  } catch (err) {
    console.error(`Error processing SKU ${skuId}: ${err}`)
    // Continue with next SKU (fail gracefully)
  }
}
```

---

## 8. Data Flows

### 8.1 User Login Flow

```
┌───────────────────────────────────────────────────────────┐
│              USER LOGS INTO VTEX STORE                    │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│              VTEX SESSION API UPDATED                     │
│          (profile data stored in session)                 │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│              vtex:userData EVENT FIRED                    │
│          (sent via window.postMessage)                    │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        CLEVERTAP PIXEL APP RECEIVES EVENT                 │
│          (enhancedEcommerceEvents.ts)                     │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        FETCH PROFILE FROM SESSION API                     │
│    GET /api/sessions?items=profile.firstName,lastName,    │
│                           email,phone                     │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        BUILD CLEVERTAP PROFILE OBJECT                     │
│          {                                                │
│            Site: {                                        │
│              Name: "Full Name",                           │
│              Email: "email@domain.com",                   │
│              Phone: "+1234567890",                        │
│              MSG-email: false,                            │
│              MSG-push: true,                              │
│              MSG-sms: true,                               │
│              MSG-whatsapp: true                           │
│            }                                              │
│          }                                                │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        SEND TO CLEVERTAP                                  │
│        clevertap.onUserLogin.push(profileData)            │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        UPDATE LOCAL CONFIG                                │
│        localStorage.setItem('clevertapConfigs', {         │
│          ...config,                                       │
│          isLogged: true                                   │
│        })                                                 │
└───────────────────────────────────────────────────────────┘
```

### 8.2 Add to Cart Flow

```
┌───────────────────────────────────────────────────────────┐
│        USER CLICKS "ADD TO CART" BUTTON                   │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        VTEX MINICART COMPONENT UPDATED                    │
│          (product added to orderForm)                     │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        vtex:addToCart EVENT FIRED                         │
│          {                                                │
│            items: [{                                      │
│              skuId: "SKU-123",                            │
│              quantity: 1,                                 │
│              price: 29.99,                                │
│              name: "Product Name",                        │
│              ...                                          │
│            }]                                             │
│          }                                                │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        CLEVERTAP PIXEL RECEIVES EVENT                     │
│          (enhancedEcommerceEvents.ts)                     │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        VALIDATION CHECKS                                  │
│          1. Is event enabled?                             │
│          2. Is user logged in OR unknown events allowed?  │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼ (if valid)
┌────────────────────────────────────────────────────────────┐
│        TRANSFORM DATA TO CLEVERTAP FORMAT                  │
│          {                                                 │
│            product_id: "PROD-456",                         │
│            sku_id: "SKU-123",                              │
│            name: "Product Name",                           │
│            price: 29.99,                                   │
│            quantity: 1,                                    │
│            category: "Cat1 > Cat2",                        │
│            brand: "Brand Name",                            │
│            variant: "Blue/M",                              │
│            seller_id: "1",                                 │
│            ...                                             │
│          }                                                 │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│        SEND TO CLEVERTAP                                  │
│        clevertap.event.push(                              │
│          'Product Added to Cart',                         │
│          transformedData                                  │
│        )                                                  │
└───────────────────────────────────────────────────────────┘
```

### 8.3 Order Completion Flow

```
┌────────────────────────────────────────────────────────────┐
│        USER COMPLETES PAYMENT                              │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        VTEX OMS CREATES ORDER                              │
│        (status: 'payment-pending')                         │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        PAYMENT GATEWAY PROCESSES PAYMENT                   │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        ORDER STATUS CHANGES TO 'payment-approved'          │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        vtex.orders-broadcast FIRES EVENT                   │
│        {                                                   │
│          domain: "Fulfillment",                            │
│          orderId: "ORDER-123",                             │
│          currentState: "payment-approved",                 │
│          lastState: "payment-pending"                      │
│        }                                                   │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        CLEVERTAP BACKEND RECEIVES EVENT                    │
│        (omsFilteredEvents middleware)                      │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        CHECK DEDUPLICATION CACHE                           │
│        if (processedOrders[orderId].has('payment-approved')│
│          return                                            │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼ (if not processed)
┌────────────────────────────────────────────────────────────┐
│        FETCH FULL ORDER DATA                               │
│        GET /api/oms/pvt/orders/{orderId}                   │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        FETCH CUSTOMER EMAIL                                │
│        MD.searchDocuments({                                │
│          dataEntity: 'CL',                                 │
│          where: `userId=${userProfileId}`                  │
│        })                                                  │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        BUILD EVENT PAYLOAD                                 │
│        {                                                   │
│          order_id: "ORDER-123",                            │
│          checkout_id: "abc123",                            │
│          state: "payment-approved",                        │
│          affiliation: "Seller Name",                       │
│          value: 129.99,                                    │
│          revenue: 99.99,                                   │
│          shipping: 10.00,                                  │
│          tax: 20.00,                                       │
│          discount: 0,                                      │
│          payment_method: "Credit Card",                    │
│          currency: "USD",                                  │
│          coupon: ""                                        │
│        }                                                   │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        SEND TO CLEVERTAP UPLOAD API                        │
│        clevertap.upload([{                                 │
│          identity: "customer@email.com",                   │
│          type: "event",                                    │
│          objectId: "back-end-event",                       │
│          evtName: "Charged",                               │
│          evtData: payload                                  │
│        }])                                                 │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        ADD TO DEDUPLICATION CACHE                          │
│        processedOrders[orderId].add('payment-approved')    │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│        CHECK CATALOG SYNC SCHEDULE                         │
│        if (24h+ since last sync && catalogSync enabled)    │
│          trigger catalogSyncHandler()                      │
└────────────────────────────────────────────────────────────┘
```

---

## 9. APIs and Integrations

### 9.1 CleverTap APIs

The app integrates with multiple CleverTap APIs:

#### Upload API (Profile & Events)

**Endpoint**: `https://{region}.api.clevertap.com/1/upload`

**Authentication**:
```http
X-CleverTap-Account-Id: {accountID}
X-CleverTap-Passcode: {accountPasscode}
```

**Request Body**:
```json
{
  "d": [
    {
      "identity": "user@email.com",
      "type": "event",
      "evtName": "Product Viewed",
      "evtData": {
        "product_id": "123",
        "price": 29.99
      }
    }
  ]
}
```

**Profile Update**:
```json
{
  "d": [
    {
      "identity": "user@email.com",
      "type": "profile",
      "profileData": {
        "Name": "John Doe",
        "Email": "user@email.com",
        "Phone": "+1234567890"
      }
    }
  ]
}
```

#### Catalog API

**Get Presigned URL**:
```http
POST https://{region}.api.clevertap.com/get_catalog_url
Headers:
  X-CleverTap-Account-Id: {accountID}
  X-CleverTap-Passcode: {accountPasscode}

Response:
{
  "presignedS3URL": "https://s3.amazonaws.com/..."
}
```

**Upload CSV to S3**:
```http
PUT {presignedS3URL}
Content-Type: text/csv
Body: CSV data
```

**Complete Upload**:
```http
POST https://{region}.api.clevertap.com/upload_catalog_completed
Headers:
  X-CleverTap-Account-Id: {accountID}
  X-CleverTap-Passcode: {accountPasscode}
Body:
{
  "name": "catalog_accountname",
  "email": "integration@email.com",
  "creator": "integration@email.com",
  "url": "{presignedS3URL}",
  "replace": true
}
```

### 9.2 VTEX APIs

#### OMS API (Order Management)

**Get Order Details**:
```http
GET https://{accountName}.vtexcommercestable.com.br/api/oms/pvt/orders/{orderId}
Headers:
  X-VTEX-API-AppToken: {appToken}
  X-VTEX-API-AppKey: {appKey}
```

**Response Structure**:
```json
{
  "orderId": "ORDER-123",
  "orderFormId": "abc123",
  "value": 12999,
  "items": [...],
  "clientProfileData": {
    "userProfileId": "user-456",
    "email": "customer@email.com"
  },
  "paymentData": {
    "transactions": [{
      "payments": [{
        "paymentSystem": "Credit Card",
        "value": 12999
      }]
    }]
  },
  "totals": [
    { "id": "Items", "value": 9999 },
    { "id": "Shipping", "value": 1000 },
    { "id": "Tax", "value": 2000 }
  ],
  "sellers": [{
    "name": "Main Seller"
  }],
  "marketingData": {
    "coupon": "DISCOUNT10"
  }
}
```

#### Catalog API

**Get SKU IDs (Paginated)**:
```http
GET https://{accountName}.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitids?page={page}&pagesize={pageSize}

Response:
{
  "range": {
    "total": 1000,
    "from": 1,
    "to": 20
  },
  "items": [123, 456, 789, ...]
}
```

**Get SKU Details**:
```http
GET https://{accountName}.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/{skuId}

Response:
{
  "Id": 123,
  "ProductId": 456,
  "IsActive": true,
  "NameComplete": "Product Name - Variant",
  "ProductName": "Product Name",
  "SkuName": "Variant",
  "ImageUrl": "https://...",
  "AlternateIds": {
    "Ean": "7891234567890",
    "RefId": "REF-123"
  },
  "ProductCategories": {
    "1": "Category 1",
    "2": "Category 2"
  },
  "BrandName": "Brand Name",
  "SalesChannels": [1, 2, 3],
  "CommercialConditionId": 1
}
```

#### Master Data API

**Search Documents**:
```http
GET https://api.vtex.com/{accountName}/dataentities/CL/search?_fields=email&_where=userId={userId}
Headers:
  X-VTEX-API-AppToken: {appToken}
  X-VTEX-API-AppKey: {appKey}

Response:
[
  {
    "email": "customer@email.com"
  }
]
```

#### Session API

**Get User Profile**:
```http
GET https://{accountName}.myvtex.com/api/sessions?items=profile.firstName,profile.lastName,profile.email,profile.phone

Response:
{
  "namespaces": {
    "profile": {
      "firstName": { "value": "John" },
      "lastName": { "value": "Doe" },
      "email": { "value": "john@email.com" },
      "phone": { "value": "+1234567890" }
    }
  }
}
```

### 9.3 Authentication & Permissions

#### Required VTEX Policies

The app requires these policies (defined in `manifest.json`):

```json
{
  "policies": [
    {
      "name": "outbound-access",
      "attrs": {
        "host": "eu1.api.clevertap.com",
        "path": "/*"
      }
    },
    {
      "name": "OMSViewer"
    },
    {
      "name": "ADMIN_DS"
    },
    {
      "name": "colossus-fire-event"
    },
    {
      "name": "vbase-read-write"
    }
  ]
}
```

**Policy Descriptions**:
- `outbound-access`: Allows HTTP requests to CleverTap APIs
- `OMSViewer`: Read access to Order Management System
- `ADMIN_DS`: Access to Master Data
- `colossus-fire-event`: Event broadcasting
- `vbase-read-write`: Storage for sync timestamps

---

## 10. Detailed Code Structure

### 10.1 Frontend Architecture (React/Pixel)

#### Entry Point: `react/index.tsx`

```typescript
import { canUseDOM } from 'vtex.render-runtime'
import { initCleverTap } from './lib/clevertap'
import { sendEnhancedEcommerceEvents } from './modules/enhancedEcommerceEvents'
import { sendLegacyEvents } from './modules/legacyEvents'

export function handleEvents(e: PixelMessage) {
  sendEnhancedEcommerceEvents(e)
  sendLegacyEvents(e)
}

if (canUseDOM) {
  initCleverTap()  // Initialize CleverTap SDK
  window.addEventListener('message', handleEvents)  // Listen to VTEX events
}
```

**Flow**:
1. Check if running in browser (`canUseDOM`)
2. Initialize CleverTap SDK with stored configuration
3. Add event listener for `window.postMessage` events
4. Route events to appropriate handlers

#### CleverTap Initialization: `react/lib/clevertap.ts`

```typescript
export function initCleverTap() {
  // 1. Retrieve configuration from localStorage
  const savedConfig = localStorage.getItem('clevertapConfigs')
  const config = JSON.parse(savedConfig)
  
  // 2. Validate configuration
  if (!config?.accountID || !config?.region) {
    console.error('CleverTap: no valid configuration found.')
    return null
  }
  
  // 3. Initialize CleverTap SDK
  clevertap.init(config.accountID, config.region)
  clevertap.privacy.push(config.privacy)
  clevertap.spa = config.spa
  
  // 4. Configure push notifications
  initClevertapNotifications()
  
  return clevertap
}
```

#### Event Handler: `react/modules/enhancedEcommerceEvents.ts`

```typescript
export async function sendEnhancedEcommerceEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:productView': {
      // Wait for user data to load
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check permissions
      const isUnknownEvents = verifyIsUnknownEvents()
      const isLogged = verifyIsLogged()
      
      if (!isUnknownEvents && !isLogged) return
      
      // Check if event is enabled
      if (verifyEvent('vtex:productView')) {
        productView(e.data)
      }
      
      break
    }
    // ... other cases
  }
}
```

#### Event Transformation: `react/modules/manageEvents.ts`

Example: Product View Event

```typescript
export function productView(data: any) {
  const { product } = data
  const item = product.items[0]
  
  const eventData = {
    product_id: product.productId,
    sku_id: item.skuId,
    name: product.productName,
    brand: product.brand,
    category: getCategories(product.categories),
    variant: item.name,
    price: getPrice(item),
    quantity: getQuantity(item),
    url: window.location.href,
    image_url: item.imageUrl,
    seller_id: getSeller(item)?.sellerId,
    seller_name: getSeller(item)?.sellerName
  }
  
  clevertap.event.push('Product Viewed', eventData)
}
```

### 10.2 Backend Architecture (Node.js)

#### Entry Point: `node/index.ts`

```typescript
import { Service } from '@vtex/api'
import { Clients } from './clients'
import { omsFilteredEvents } from './middlewares/oms/omsFilteredEvents'

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: 800
    }
  }
}

export default new Service({
  clients,
  events: {
    omsFilteredEvents  // Subscribe to OMS broadcasts
  }
})
```

#### OMS Event Middleware: `node/middlewares/oms/omsFilteredEvents.ts`

```typescript
const processedOrders = new Map<string, Set<string>>()

export async function omsFilteredEvents(
  ctx: StatusChangeContext,
  next: () => Promise<any>
) {
  const { orderId, currentState } = ctx.body
  
  // 1. Deduplication check
  if (!processedOrders.has(orderId)) {
    processedOrders.set(orderId, new Set())
  }
  
  const statesSet = processedOrders.get(orderId)
  if (statesSet.has(currentState)) return next()
  
  statesSet.add(currentState)
  
  // 2. Get settings
  const settings = await getConfig(ctx)
  const clevertap = await getCleverTap(ctx)
  
  // 3. Fetch order data
  const response = await ctx.clients.oms.order(orderId, 'AUTH_TOKEN')
  
  // 4. Fetch customer email from Master Data
  const mdResponse = await ctx.clients.MD.searchDocuments({
    dataEntity: 'CL',
    fields: ['email'],
    where: `userId=${response.clientProfileData.userProfileId}`
  })
  
  // 5. Build event payload
  const payload = {
    order_id: orderId,
    state: currentState,
    value: response.value,
    payment_method: getPaymentMethodsString(response.paymentData.transactions[0].payments),
    // ... more fields
  }
  
  // 6. Map state to event name
  const eventMap = {
    'canceled': { name: 'Order Cancelled' },
    'payment-approved': { name: 'Charged' },
    'incomplete': { name: 'Checkout Failed', includeItems: true },
    'payment-denied': { name: 'Checkout Failed', includeItems: true }
  }
  
  const event = eventMap[currentState]
  
  // 7. Send to CleverTap
  if (event) {
    const data = {
      identity: mdResponse[0].email,
      type: 'event',
      evtName: event.name,
      evtData: payload
    }
    
    clevertap.upload([data])
  }
  
  // 8. Check catalog sync
  if (settings.preferences.catalogSync && 
      settings.preferences.integrationEmail) {
    await handleCatalogSync(ctx, settings.preferences.integrationEmail)
  }
  
  await next()
}
```

#### Catalog Service: `node/services/CatalogService.ts`

```typescript
export class CatalogService {
  private vtexCatalogClient: VtexCatalog
  private clevertapCatalogClient: ClevertapCatalog
  private pageSize = 20
  
  public async syncCatalog(ctx: Context, options: SyncCatalogOptions) {
    try {
      // 1. Get all SKU IDs
      const skuIds = await this.getAllSkuIds()
      console.info(`Processed: ${skuIds.length} skus`)
      
      // 2. Build CleverTap SKU objects
      const clevertapSkus = await this.buildClevertapSkus(skuIds)
      
      // 3. Convert to CSV
      const csv = json2csv(clevertapSkus)
      
      // 4. Get presigned S3 URL
      const { presignedS3URL } = await this.clevertapCatalogClient.postCatalogUrl(ctx)
      
      // 5. Upload CSV to S3
      await this.clevertapCatalogClient.uploadCatalog(csv, presignedS3URL, ctx)
      
      // 6. Notify CleverTap
      await this.clevertapCatalogClient.completeUpload(presignedS3URL, ctx, {
        name: `catalog_${options.accountName}`,
        email: options.email,
        creator: options.creator,
        replace: options.replace
      })
      
      console.info('Load completed')
    } catch (err) {
      console.error(`Error processing load: ${err}`)
      throw err
    }
  }
  
  private async getAllSkuIds(): Promise<number[]> {
    const skuIds: number[] = []
    let page = 1
    let pageSkuIds: number[] = []
    
    // Paginate through all SKUs
    do {
      pageSkuIds = await this.vtexCatalogClient.getSKUIds(page, this.pageSize)
      if (!pageSkuIds?.length) break
      
      skuIds.push(...pageSkuIds)
      page++
    } while (pageSkuIds.length === this.pageSize)
    
    return skuIds
  }
  
  private async buildClevertapSkus(skuIds: number[]): Promise<any[]> {
    const clevertapSkus: any[] = []
    
    for (const skuId of skuIds) {
      try {
        const skuData = await this.vtexCatalogClient.getSKUAndContext(skuId)
        
        // Skip inactive SKUs
        if (!skuData.IsActive) continue
        
        clevertapSkus.push(this.mapToClevertapSku(skuData))
      } catch (err) {
        console.error(`Error processing SKU ${skuId}: ${err}`)
      }
    }
    
    return clevertapSkus
  }
  
  private mapToClevertapSku(skuData: any) {
    return {
      Identity: skuData.Id,
      ProductId: skuData.ProductId,
      SkuId: skuData.Id,
      Ean: skuData.AlternateIds.Ean,
      RefId: skuData.AlternateIds.RefId,
      Name: `${skuData.ProductName} - ${skuData.SkuName}`,
      ImageUrl: skuData.ImageUrl,
      Categories: Object.values(skuData.ProductCategories).join(' - '),
      BrandName: skuData.BrandName,
      SalesChannels: skuData.SalesChannels.join(','),
      CommercialCondition: skuData.CommercialConditionId
    }
  }
}
```

### 10.3 Configuration Management

#### Pixel Configuration: `pixel/head.html`

This script runs in the `<head>` of every page:

```html
<script>
  ;(function () {
    // Read settings injected by VTEX
    let accountID = '{{settings.accountID}}'
    let region = '{{settings.region}}'
    let rawPrefs = '{{settings.preferences}}'
    
    // Validate required fields
    if (!accountID || !region) {
      console.error('CleverTap: Missing configuration')
      return
    }
    
    // Parse preferences
    let preferences = JSON.parse(decodeURIComponent(rawPrefs))
    
    // Build configuration object
    const clevertapConfigs = {
      accountID,
      region,
      isLogged: false,
      privacy: { optOut: false, useIP: false },
      spa: true,
      preferences: {
        allowUnknownUsersEvents: preferences.allowUnknownUsersEvents,
        trackEvents: preferences.trackEvents
      }
    }
    
    // Store in localStorage for React app
    localStorage.setItem('clevertapConfigs', JSON.stringify(clevertapConfigs))
  })()
</script>
```

**Flow**:
1. VTEX injects settings as template variables
2. Parse and validate configuration
3. Store in localStorage
4. React pixel app reads from localStorage on initialization

---

## 11. Service Workers and Push Notifications

### 11.1 Service Worker Architecture

The app includes service workers to support push notifications and offline functionality.

#### Service Worker Header: `service-workers/header.js`

```javascript
function exampleSWHeader() {
  importScripts(
    'https://s3-eu-west-1.amazonaws.com/static.wizrocket.com/js/sw_webpush.js'
  )
}

export default exampleSWHeader
```

This imports CleverTap's service worker for push notification handling.

### 11.2 Push Notification Configuration

#### Frontend Setup: `react/lib/clevertap.ts`

```typescript
export function initClevertapNotifications() {
  clevertap.notifications.push({
    titleText: 'Would you like to receive Push Notifications?',
    bodyText: 'We promise to only send you relevant content and give you updates on your transactions',
    okButtonText: 'Sign me up!',
    rejectButtonText: 'No thanks',
    okButtonColor: '#F28046',
    serviceWorkerPath: '/serviceWorkerMerged.js'
  })
}
```

**Configuration Options**:
- `titleText`: Permission prompt title
- `bodyText`: Permission prompt description
- `okButtonText`: Accept button text
- `rejectButtonText`: Decline button text
- `okButtonColor`: Accept button color
- `serviceWorkerPath`: Path to merged service worker

### 11.3 Push Notification Flow

```
┌────────────────────────────────────────────────────────────┐
│      USER VISITS STORE (First Time)                        │
└──────────────────────────┬─────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│      CLEVERTAP PIXEL INITIALIZES                            │
│      (initClevertapNotifications called)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│      PERMISSION PROMPT DISPLAYED                           │
│      "Would you like to receive Push Notifications?"       │
│      [Sign me up!] [No thanks]                             │
└──────────────────────────┬─────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │  User Accepts   │       │  User Declines  │
    └────────┬────────┘       └────────┬────────┘
             │                         │
             ▼                         ▼
┌────────────────────────┐   ┌──────────────────────┐
│ Register Service Worker│   │  No Notifications    │
│ Request Browser Perm   │   └──────────────────────┘
└────────┬───────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│      BROWSER PERMISSION DIALOG                              │
│      "{domain} wants to show notifications"                 │
│      [Block] [Allow]                                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │  User Allows    │       │  User Blocks    │
    └────────┬────────┘       └────────┬────────┘
             │                         │
             ▼                         ▼
┌────────────────────────┐   ┌──────────────────────┐
│ Generate Push Token    │   │  Notifications       │
│ Send to CleverTap      │   │  Permanently Blocked │
└────────┬───────────────┘   └──────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│      TOKEN STORED IN CLEVERTAP                              │
│      User Profile Updated with:                             │
│      - Push Token                                           │
│      - Browser Info                                         │
│      - Device Info                                          │
└─────────────────────────────────────────────────────────────┘
```

### 11.4 Campaign Sending Flow

```
┌─────────────────────────────────────────────────────────────┐
│      MARKETER CREATES CAMPAIGN IN CLEVERTAP                 │
│      - Select Segment                                       │
│      - Compose Message                                      │
│      - Schedule Send                                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│      CLEVERTAP PROCESSES CAMPAIGN                           │
│      - Evaluates Segment                                    │
│      - Prepares Push Payloads                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│      CLEVERTAP SENDS TO BROWSER PUSH SERVICE                │
│      (FCM for Chrome, APNs for Safari, etc.)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│      SERVICE WORKER RECEIVES PUSH EVENT                     │
│      (even if browser is closed)                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│      NOTIFICATION DISPLAYED TO USER                        │
│      ┌──────────────────────────────────────────┐          │
│      │  [Icon] Your Store Name                  │          │
│      │  Product back in stock!                  │          │
│      │  The item you wanted is available now.   │          │
│      │                                          │          │
│      │  [View Product]                          │          │
│      └──────────────────────────────────────────┘          │
└──────────────────────────┬─────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │  User Clicks    │       │  User Ignores   │
    └────────┬────────┘       └────────┬────────┘
             │                         │
             ▼                         ▼
┌────────────────────────┐   ┌──────────────────────┐
│ Open Deep Link URL     │   │  Event: Notification │
│ Track Click Event      │   │  Received (no click) │
└────────────────────────┘   └──────────────────────┘
```

---

## 12. Troubleshooting and Maintenance

### 12.1 Common Issues and Solutions

#### Issue 1: Events Not Appearing in CleverTap

**Symptoms:**
- No events in CleverTap dashboard
- Console errors about CleverTap configuration

**Diagnosis:**
1. Check browser console for errors
2. Verify localStorage contains `clevertapConfigs`
3. Check if CleverTap SDK is loaded

**Solutions:**

```javascript
// In browser console:
localStorage.getItem('clevertapConfigs')

// Should return something like:
// {"accountID":"XXX-XXX-XXXX","region":"us1",...}

// If null or invalid:
// 1. Check app settings in VTEX Admin
// 2. Verify accountID and region are correct
// 3. Clear cache and reload
```

**Checklist:**
- [ ] App installed and configured in VTEX Admin
- [ ] CleverTap Project ID is correct
- [ ] CleverTap Region matches account
- [ ] Events are enabled in settings
- [ ] Browser allows third-party scripts

#### Issue 2: Checkout Events Missing

**Symptoms:**
- Storefront events work
- Checkout events (Checkout Started, Payment Info) not tracked

**Diagnosis:**
1. Check if checkout script is installed
2. Verify script URL is accessible
3. Check browser console on checkout page

**Solutions:**

1. **Verify Script Installation:**
```javascript
// In checkout page console:
document.querySelector('script[src*="clevertap-checkout-events"]')

// Should return the script element
// If null, script is not installed
```

2. **Re-install Checkout Script:**
   - Go to Store Settings → Checkout → Code
   - Add the script as per installation instructions
   - Save and publish

3. **Verify CDN Accessibility:**
   - Open: `https://cdn.jsdelivr.net/gh/GuiGiesbrecht/vtex-clevertap-scripts/clevertap-checkout-events.js`
   - Should download/display JavaScript file
   - If 404, contact support

#### Issue 3: Catalog Not Syncing

**Symptoms:**
- Catalog events not appearing
- Products not showing in CleverTap

**Diagnosis:**
1. Check if catalog sync is enabled
2. Verify integration email is set
3. Check logs in VTEX IO

**Solutions:**

1. **Enable Catalog Sync:**
   - Apps → My Apps → CleverTap
   - Enable "Active Catalog Sync"
   - Add valid Integration Email
   - Save settings

2. **Check Sync Status:**
```bash
# In VTEX IO CLI:
vtex logs --all

# Look for messages like:
# "[OMS] 24h passed, running catalog sync..."
# "Processed: XXX skus"
# "Load completed"
```

3. **Manual Trigger (if route enabled):**
```bash
# POST request to catalog sync endpoint
curl -X POST 'https://{workspace}--{account}.myvtex.com/_v/catalog/sync' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "integration@email.com",
    "creator": "integration@email.com",
    "replace": false
  }'
```

#### Issue 4: User Profiles Not Updating

**Symptoms:**
- Events tracked but user data missing
- Anonymous users tracked correctly but logged-in users not identified

**Diagnosis:**
1. Check if `vtex:userData` event is firing
2. Verify Session API is accessible
3. Check CleverTap profile in dashboard

**Solutions:**

1. **Verify Session Data:**
```javascript
// In browser console (while logged in):
fetch('/api/sessions?items=profile.firstName,profile.lastName,profile.email,profile.phone')
  .then(r => r.json())
  .then(console.log)

// Should return user profile data
```

2. **Force Profile Update:**
```javascript
// In browser console:
const profile = {
  Site: {
    Name: "Test User",
    Email: "test@email.com",
    Phone: "+1234567890"
  }
}
clevertap.onUserLogin.push(profile)
```

3. **Check CleverTap Dashboard:**
   - Go to People → Search
   - Search by email
   - Verify profile properties are populated

### 12.2 Monitoring and Logging

#### Frontend Logging

Enable CleverTap debug logging:

```javascript
// In browser console:
clevertap.setLogLevel(3) // 0=off, 1=error, 2=info, 3=debug

// View CleverTap internal state:
clevertap.getAccountID() // Should return your account ID
clevertap.getRegion()    // Should return your region
```

#### Backend Logging

View VTEX IO logs:

```bash
# Install VTEX CLI
npm install -g vtex

# Login
vtex login {account}

# View logs
vtex logs --all

# Filter for CleverTap app
vtex logs --all | grep clevertap
```

**Key Log Messages:**

```
# Success:
"[OMS] Processing order: ORDER-123"
"[Catalog] Processed: 500 skus"
"[Catalog] Load completed"

# Errors:
"Error processing SKU 123: ..."
"CleverTap: failed to save config to localStorage"
"Error processing load: ..."
```

### 12.3 Performance Optimization

#### Reduce Event Volume

If experiencing high traffic:

1. **Disable Unnecessary Events:**
   - Review tracking requirements
   - Disable events not used in campaigns
   - Example: Disable `Product Clicked` if only using `Product Viewed`

2. **Sample Anonymous Users:**
```typescript
// In enhancedEcommerceEvents.ts
const isUnknownEvents = verifyIsUnknownEvents()
const isLogged = verifyIsLogged()

// Add sampling for anonymous users
if (!isLogged && !isUnknownEvents) return
if (!isLogged && Math.random() > 0.5) return // Sample 50%
```

3. **Batch Events (Advanced):**
   - Modify CleverTap SDK initialization
   - Use offline mode and batch sends

#### Optimize Catalog Sync

1. **Reduce Sync Frequency:**
```typescript
// In omsFilteredEvents.ts
// Change from 24 hours to 48 hours:
if (hoursSince >= 48) {  // was 24
  await catalogSyncHandler(ctx)
}
```

2. **Filter Active SKUs Only:**
```typescript
// Already implemented in buildClevertapSkus:
if (!skuData.IsActive) continue
```

3. **Increase Page Size:**
```typescript
// In CatalogService.ts
private pageSize = 50 // was 20
```

### 12.4 Security Best Practices

#### Secure Credentials

1. **Never Expose Passcode:**
   - Passcode only used in backend (Node.js)
   - Never send to frontend
   - Stored securely in app settings

2. **Validate Input:**
```typescript
// In catalogSyncHandler.ts
if (!email || !email.includes('@')) {
  throw new Error('Invalid email')
}

if (!accountName || accountName.length < 1) {
  throw new Error('Invalid account name')
}
```

#### Rate Limiting

CleverTap has rate limits. Implement safeguards:

```typescript
// Track API calls
const apiCalls = new Map<string, number>()

function checkRateLimit(endpoint: string): boolean {
  const count = apiCalls.get(endpoint) || 0
  if (count > 100) { // 100 calls per minute
    return false
  }
  apiCalls.set(endpoint, count + 1)
  return true
}
```

### 12.5 Upgrade and Migration

#### Updating the App

```bash
# Check current version
vtex list | grep clevertap

# Update to latest version
vtex install clevertappartnerbr.vtex-clevertap-app@latest

# Or specific version
vtex install clevertappartnerbr.vtex-clevertap-app@0.0.20
```

#### Breaking Changes

When upgrading, check for:
- New required settings
- Changed event names
- Updated API endpoints
- New permissions required

#### Rollback Procedure

If issues occur after upgrade:

```bash
# Uninstall current version
vtex uninstall clevertappartnerbr.vtex-clevertap-app

# Install previous stable version
vtex install clevertappartnerbr.vtex-clevertap-app@0.0.19

# Verify functionality
# Test key events
# Check CleverTap dashboard
```

---

## Appendix A: Complete Event Reference

### Storefront Events

| Event Name | VTEX Trigger | CleverTap Name | Key Properties |
|------------|--------------|----------------|----------------|
| `vtex:search` | User performs search | Products Searched | `query`, `results_count` |
| `vtex:filterManipulation` | Filter applied | Product Filtered | `filter_type`, `filter_value` |
| `categoryView` | Category page view | Product List Viewed | `category`, `products` |
| `vtex:promoView` | Promotion displayed | Promotion Viewed | `promo_id`, `promo_name` |
| `vtex:promotionClick` | Promotion clicked | Promotion Clicked | `promo_id`, `promo_name` |
| `vtex:productView` | Product page view | Product Viewed | `product_id`, `sku_id`, `name`, `price` |
| `vtex:productClick` | Product clicked | Product Clicked | `product_id`, `position`, `list` |
| `vtex:addToCart` | Add to cart | Product Added to Cart | `product_id`, `quantity`, `price` |
| `vtex:removeFromCart` | Remove from cart | Product Removed from Cart | `product_id`, `quantity` |
| `vtex:viewCart` | Cart viewed | Cart Viewed | `cart_total`, `items_count` |
| `vtex:addToWishlist` | Add to wishlist | Product Added to Wishlist | `product_id`, `sku_id` |
| `vtex:removeToWishlist` | Remove from wishlist | Product Removed from Wishlist | `product_id`, `sku_id` |
| `vtex:share` | Product shared | Product Shared | `product_id`, `channel` |
| `vtex:orderPlaced` | Order placed | Order Created | `order_id`, `value`, `items` |

### Checkout Events (via Script)

| Event Name | Trigger | CleverTap Name | Key Properties |
|------------|---------|----------------|----------------|
| `add_to_cart` | Add in checkout | Checkout Product Added To Cart | `product_id`, `quantity` |
| `remove_from_cart` | Remove in checkout | Checkout Product Removed From Cart | `product_id`, `quantity` |
| `view_cart` | Cart viewed in checkout | Checkout Cart Viewed | `cart_total`, `items` |
| `begin_checkout` | Checkout started | Checkout Started | `cart_total`, `items_count` |
| `add_payment_info` | Payment method selected | Payment Info | `payment_method` |
| `checkout_step_viewed` | Step viewed | Checkout Step Viewed | `step`, `step_name` |
| `coupon_applied` | Coupon success | Coupon Applied | `coupon_code`, `discount` |
| `coupon_denied` | Coupon failed | Coupon Denied | `coupon_code`, `reason` |

### Backend Events (OMS)

| OMS State | CleverTap Event | Description |
|-----------|-----------------|-------------|
| `payment-approved` | Charged | Payment successful, order confirmed |
| `canceled` | Order Cancelled | Order cancelled by user or system |
| `incomplete` | Checkout Failed | Order incomplete or abandoned |
| `payment-denied` | Checkout Failed | Payment declined |

---

## Appendix B: Configuration Schema

### App Settings JSON Schema

```json
{
  "title": "VTEX CleverTap Pixel App",
  "type": "object",
  "properties": {
    "accountID": {
      "title": "CleverTap Project ID",
      "type": "string",
      "minLength": 1,
      "maxLength": 12
    },
    "accountPasscode": {
      "title": "CleverTap Account Passcode",
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "region": {
      "title": "CleverTap Region",
      "type": "string",
      "minLength": 1,
      "maxLength": 4,
      "enum": ["us1", "eu1", "in1", "sg1", "aps3", "mec1"]
    },
    "preferences": {
      "type": "object",
      "properties": {
        "allowUnknownUsersEvents": {
          "type": "boolean",
          "default": true
        },
        "trackEvents": {
          "type": "object",
          "properties": {
            "vtex:search": { "type": "boolean", "default": true },
            "vtex:filterManipulation": { "type": "boolean", "default": true },
            "categoryView": { "type": "boolean", "default": true },
            "vtex:promoView": { "type": "boolean", "default": true },
            "vtex:promotionClick": { "type": "boolean", "default": true },
            "vtex:productView": { "type": "boolean", "default": true },
            "vtex:productClick": { "type": "boolean", "default": true },
            "vtex:addToCart": { "type": "boolean", "default": true },
            "vtex:removeFromCart": { "type": "boolean", "default": true },
            "vtex:viewCart": { "type": "boolean", "default": true },
            "vtex:addToWishlist": { "type": "boolean", "default": true },
            "vtex:removeToWishlist": { "type": "boolean", "default": true },
            "vtex:share": { "type": "boolean", "default": true },
            "vtex:orderPlaced": { "type": "boolean", "default": true },
            "add_to_cart": { "type": "boolean", "default": true },
            "remove_from_cart": { "type": "boolean", "default": true },
            "view_cart": { "type": "boolean", "default": true },
            "begin_checkout": { "type": "boolean", "default": true },
            "add_payment_info": { "type": "boolean", "default": true },
            "checkout_step_viewed": { "type": "boolean", "default": true },
            "coupon_applied": { "type": "boolean", "default": true },
            "coupon_denied": { "type": "boolean", "default": true }
          }
        },
        "catalogSync": {
          "type": "boolean",
          "default": true
        },
        "integrationEmail": {
          "type": "string",
          "format": "email"
        }
      }
    }
  },
  "required": ["accountID", "accountPasscode", "region"]
}
```

---

## Appendix C: API Endpoints Reference

### CleverTap APIs

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/{region}.api.clevertap.com/1/upload` | POST | Upload events and profiles |
| `/{region}.api.clevertap.com/get_catalog_url` | POST | Get presigned S3 URL for catalog |
| `/{region}.api.clevertap.com/upload_catalog_completed` | POST | Notify catalog upload complete |

### VTEX APIs Used

| API | Endpoint | Purpose |
|-----|----------|---------|
| OMS | `/api/oms/pvt/orders/{orderId}` | Get order details |
| Catalog | `/api/catalog_system/pvt/sku/stockkeepingunitids` | Get SKU IDs |
| Catalog | `/api/catalog_system/pvt/sku/stockkeepingunitbyid/{id}` | Get SKU details |
| Master Data | `/api/dataentities/CL/search` | Search customer data |
| Session | `/api/sessions` | Get user profile data |

---

## Appendix D: Support and Resources

### Official Documentation

- **CleverTap Docs**: https://docs.clevertap.com
- **VTEX IO Docs**: https://developers.vtex.com
- **VTEX Pixel Docs**: https://developers.vtex.com/docs/guides/vtex-io-documentation-pixel-apps

### Getting Help

1. **VTEX Support**: https://support.vtex.com
2. **CleverTap Support**: https://support.clevertap.com
3. **GitHub Issues**: Check app repository for issues

### Best Practices Resources

- CleverTap Event Naming: https://docs.clevertap.com/docs/events-naming
- VTEX IO Best Practices: https://developers.vtex.com/docs/guides/best-practices
- E-commerce Tracking Guide: https://docs.clevertap.com/docs/ecommerce-tracking

---

## Conclusion

The VTEX CleverTap App provides a comprehensive, production-ready integration between VTEX and CleverTap platforms. This documentation covers all aspects of the application, from high-level architecture to detailed code implementations.

**Key Takeaways:**

1. **Easy Setup**: Install from VTEX App Store, configure credentials, and add checkout script
2. **Automatic Tracking**: Events automatically captured across storefront, checkout, and backend
3. **Catalog Sync**: Products automatically synchronized every 24 hours
4. **Push Notifications**: Full support for web push campaigns
5. **Customizable**: Enable/disable events, configure sync frequency, and more

**Next Steps:**

1. Install the app in your VTEX store
2. Configure CleverTap credentials
3. Install checkout script
4. Verify events in CleverTap dashboard
5. Create your first campaign

For questions or support, refer to the resources in Appendix D.

---

**Version**: 1.0
**Last Updated**: January 2026
**Maintained by**: CleverTap Partner BR