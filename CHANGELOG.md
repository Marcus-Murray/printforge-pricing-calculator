# Changelog

All notable changes to PrintForge Pricing Calculator will be documented in this file.

## [Unreleased]

### Sprint 4 - In Progress (2026-01-09)

#### Added
- ✅ Client Management System
  - Full CRUD operations for clients
  - Client discount integration with calculations
  - Star/favorite clients
  - Filter by all/starred/active clients
  - Search functionality
  - CSV export
  - Client statistics dashboard
  
- ✅ Quote Templates
  - Save complete form state as reusable templates
  - 3 default templates (Standard PLA, Premium Carbon Fiber, Economy Bulk)
  - Custom user templates
  - Template categorization (Standard/Premium/Economy)
  - Template manager modal
  - Link templates to specific clients
  - Quick apply dropdown in action bar

- ✅ Material Cost Presets (Redesigned)
  - Integrated into material type dropdown
  - 5 system presets (PLA $40, PETG $55, ABS $50, TPU $75, Nylon $80)
  - User custom presets with CRUD operations
  - Preset manager modal
  - Auto-fill filament cost on preset selection

- ✅ Automatic Backups
  - Automatic backup scheduling (daily/weekly/monthly)
  - Manual backup creation with "Backup Now" button
  - Backup Manager modal with backup history table
  - Restore from backup with one click
  - Export backups to JSON files
  - Import/restore from JSON backup files
  - Backup history limit (30 most recent)
  - Configurable backup settings
  - Auto-download option for backups
  - Selective data backup (settings, clients, templates, history, profiles, presets)
  - Backup size and item count tracking
  - Visual backup type badges (Manual/Automatic)
  - "Backups" button in sidebar for quick access

- ✅ Sidebar Navigation
  - Replaced horizontal tabs with collapsible sidebar
  - Grouped sections: Calculator, Operations, Management, Data, Output, Settings
  - Hamburger menu toggle
  - Mobile responsive
  - Auto-closes on tab selection

- ✅ UI/UX Improvements
  - Merged all calculator sections into one scrollable page
  - Added Floating Action Button (FAB) for calculate
  - Moved settings and dark mode toggle to sidebar
  - Logo scaled to full banner height
  - Consistent input field styling (email, tel, text, number)
  - Discount display in Results tab and Quick Summary
  - Calculate button navigates to Results automatically

#### Changed
- Calculate button renamed from "Recalculate" to "Calculate"
- Material presets moved from separate section to integrated dropdown
- Calculator sections consolidated from 4 tabs to 1 page
- Global JavaScript variables moved to top of file (hoisting fix)
- Theme toggle integrated into sidebar

#### Removed
- ❌ Quick Calculator widget (functionality moved to main calculator + FAB)
- ❌ Print Time Estimator feature (per user request)
- ❌ Inventory Tracking feature (scrapped - over-engineering for pricing calculator)
- ❌ Separate Material Cost Presets section
- ❌ Old theme toggle button (moved to sidebar)
- ❌ Horizontal tab navigation (replaced with sidebar)
- ❌ Inventory tab from sidebar (feature scrapped)

#### Fixed
- JavaScript variable hoisting errors (editingClientId, quoteTemplates)
- Theme toggle null reference error
- Client modal not opening (variable initialization)
- Email and phone input fields styling inconsistency
- Sidebar header overlapping issue
- Sidebar toggle button position
- Discount not visible in results
- Modal display logic

#### Optimized
- Removed unnecessary files (SPRINT4_JS_TO_ADD.txt, convert_icon.py)
- Cleaned up build artifacts (build/, dist/)
- Removed unused assets directory
- Created .gitignore for better version control
- Consolidated duplicate variable declarations
- Improved code organization

#### Documentation
- Created PROJECT_STRUCTURE.md
- Created CHANGELOG.md
- Added comprehensive codebase documentation
- Documented data flow and architecture

#### Sprint 4 Status
All Sprint 4 features completed! ✨

---

## [1.0.0] - Sprint 3 Complete (2026-01-07)

### Added
- Basic pricing calculator
- Hardware and packaging cost tables
- Advanced settings (machine cost, electricity, profit margins)
- Batch quote mode
- Compare mode
- Quote history with search and filter
- Print profiles
- Material presets system
- Price alert/threshold warnings
- Dark/light theme toggle
- Export functionality
- Local storage persistence

### Features Included
1. Product Information input
2. Material & Print Settings
3. Hardware Costs (dynamic table)
4. Packaging & Shipping
5. Advanced Settings
   - Machine Cost Calculation
   - Electricity Cost Calculation
   - Profit Margins & Markup
6. Batch Quote Mode (multiple items)
7. Compare Mode (side-by-side comparison)
8. Quote History (save/load/search)
9. Print Profiles (save common settings)
10. Material Cost Presets
11. Price Alerts (low/high warnings)
12. Dark Mode theme
13. Settings panel
14. CSV Export

---

## Version Guidelines

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
- **Optimized** for performance improvements

---

**Note:** This project uses semantic versioning (MAJOR.MINOR.PATCH)
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes
