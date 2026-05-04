# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.39] - 2026-05-04

### Added

- Track storefront `Page Viewed` events. Fires on home, search, empty-search, and product pages with a `pageType` discriminator (`home` / `search` / `empty_search` / `product`). Search variants also include `searchTerm` and `searchResultsCount`. Toggleable per-merchant under admin → Preferences → Page Viewed (default on).

## [0.0.38] - 2026-05-04

### Fixed

- Server-side OMS events (`Charged`, `Order Approved`, `Order Cancelled`, `Checkout Failed`) no longer fail with MasterData `403 — Cannot filter by private fields`. The middleware now reads the customer email directly from the OMS response (`clientProfileData.email`) instead of querying the `CL` data entity by the private `userId` field.

## [0.0.37]

### Changed

- Update GitHub actions/cache to v4

### Added

- Add interface for newsletter subscription event
