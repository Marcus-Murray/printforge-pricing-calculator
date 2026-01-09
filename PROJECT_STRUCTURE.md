# PrintForge Pricing Calculator - Project Structure

## Overview
PrintForge is a web-based 3D printing pricing calculator built with Flask and vanilla JavaScript. It helps calculate costs for 3D printing jobs including materials, hardware, packaging, and labor.

## Project Statistics
- **Total Lines of Code:** 7,786
- **Python (Backend):** 429 lines
- **JavaScript (Frontend):** 3,661 lines
- **CSS (Styling):** 2,187 lines
- **HTML (Templates):** 1,509 lines

## Directory Structure

```
printforge_web/
├── app.py                      # Main Flask application
├── app_standalone.py           # Standalone desktop launcher
├── requirements.txt            # Production dependencies
├── requirements-build.txt      # Build dependencies (PyInstaller)
├── .gitignore                  # Git ignore rules
│
├── static/                     # Static assets
│   ├── css/
│   │   └── style.css          # Main stylesheet (2,187 lines)
│   ├── js/
│   │   └── app.js             # Main JavaScript (3,190 lines)
│   └── images/
│       └── logo.png           # PrintForge logo
│
├── templates/                  # Jinja2 templates
│   └── index.html             # Main application template (1,509 lines)
│
├── uploads/                    # User upload directory (empty, runtime use)
│   └── .gitkeep
│
├── venv/                       # Python virtual environment (not in git)
│
└── docs/                       # Documentation
    ├── README.md              # Project overview
    ├── QUICKSTART.md          # Quick start guide
    ├── BUILD.md               # Build instructions
    └── PROJECT_STRUCTURE.md   # This file
```

## Core Features Implemented

### Sprint 1-3 Features (Complete)
1. **Basic Calculator** - Material, hardware, packaging costs
2. **Advanced Settings** - Machine costs, electricity, profit margins
3. **Batch Quote Mode** - Multiple items in one quote
4. **Compare Mode** - Compare multiple configurations
5. **Quote History** - Save and manage past quotes
6. **Print Profiles** - Save common settings
7. **Material Presets** - Quick material cost selection
8. **Quick Calculator** - *(Removed - consolidated into main calculator)*
9. **Price Alert System** - Warnings for low/high prices
10. **Print Time Estimator** - *(Removed per user request)*

### Sprint 4 Features (Complete)
1. **Client Management** ✅ Complete
   - CRUD operations for clients
   - Discount system (integrated with calculations)
   - Star/favorite clients
   - Filter & search
   - CSV export
   - Client statistics

2. **Quote Templates** ✅ Complete
   - Save complete form state as templates
   - Default templates (Standard PLA, Premium Carbon Fiber, Economy Bulk)
   - Custom user templates
   - Template categorization
   - Link templates to clients

3. **Material Cost Presets** ✅ Complete (Redesigned)
   - Integrated into material type dropdown
   - System presets (PLA, PETG, ABS, TPU, Nylon)
   - User custom presets
   - Preset manager

4. **Automatic Backups** ✅ Complete
   - Automatic backup scheduling (daily/weekly/monthly)
   - Manual backup creation
   - Backup Manager modal with history table
   - Restore from backup
   - Export/import JSON backup files
   - Backup history (30 most recent)
   - Configurable backup settings
   - Auto-download option
   - Selective data backup
   - Size and item tracking

**Note:** Inventory Tracking feature was scrapped as over-engineering for a pricing calculator.

## Technology Stack

### Backend
- **Flask 3.0.0** - Python web framework
- **Python 3.x** - Server-side language

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS variables for theming

### Data Storage
- **localStorage** - Browser-based persistence
  - `printforge_clients` - Client data
  - `printforge_quote_templates` - Quote templates
  - `printforge_material_presets` - Material presets
  - `printforge_history` - Quote history
  - `printforge_profiles` - Print profiles
  - `printforge_backups` - Backup history (up to 30 backups)
  - `printforge_backup_settings` - Backup configuration
  - `theme` - User theme preference

### Build Tools
- **PyInstaller** - Create standalone .exe (Windows)

## Key Code Organization

### app.js Structure (3,661 lines)
- **Lines 1-10:** Global variables (clients, templates, backups, etc.)
- **Lines 11-150:** Tab switching and UI controls
- **Lines 151-500:** Core calculation logic
- **Lines 501-750:** Theme and settings management
- **Lines 751-950:** Material presets system
- **Lines 951-1400:** Batch quote mode
- **Lines 1401-1850:** Compare mode
- **Lines 1851-2400:** Quote history & profiles
- **Lines 2401-2700:** Client management
- **Lines 2701-3000:** Quote templates
- **Lines 3001-3190:** Utility functions
- **Lines 3191-3661:** Automatic Backups system

### style.css Structure (2,187 lines)
- **Lines 1-100:** CSS variables & theme system
- **Lines 101-300:** Layout & navigation
- **Lines 301-500:** Form elements & inputs
- **Lines 501-800:** Cards & containers
- **Lines 801-1200:** Tables & data display
- **Lines 1201-1600:** Modals & overlays
- **Lines 1601-2000:** Buttons & actions
- **Lines 2001-2187:** Responsive design & utilities

## Data Flow

1. **User Input** → Form fields in index.html
2. **Calculation** → JavaScript processes data in app.js
3. **Backend API** → Flask `/calculate` endpoint processes complex calculations
4. **Response** → Results displayed in Results tab
5. **Persistence** → Data saved to localStorage

## Recent Optimizations (2026-01-09)

### Files Removed
- ❌ `SPRINT4_JS_TO_ADD.txt` - Code already integrated
- ❌ `convert_icon.py` - Build utility, not needed
- ❌ `build/` - Build artifacts (regenerable)
- ❌ `dist/` - Distribution files (regenerable)
- ❌ `assets/` - Unused design files

### Files Added
- ✅ `.gitignore` - Proper git exclusions
- ✅ `uploads/.gitkeep` - Preserve directory structure
- ✅ `PROJECT_STRUCTURE.md` - This documentation

### Code Improvements
- ✅ Fixed JavaScript variable hoisting issues
- ✅ Consolidated global variables at top of app.js
- ✅ Removed duplicate variable declarations
- ✅ Fixed theme toggle errors
- ✅ Added input type styling for email/tel fields
- ✅ Optimized modal display logic

## Future Development Roadmap

### High Priority
1. Add user authentication (multi-user support)
2. Export quotes to PDF
3. Advanced reporting & analytics
4. Email quote functionality

### Medium Priority
5. Batch operations for clients
6. Custom branding options
7. Multi-language support
8. Advanced charts & visualizations

### Low Priority
9. API for external integrations
10. Mobile app version
11. Cloud sync option
12. Multi-currency support

## Development Guidelines

### Code Style
- Use consistent indentation (4 spaces for Python, 2/4 spaces for JS)
- Comment complex logic
- Use descriptive variable names
- Keep functions focused and small

### Testing
- Test all calculations manually
- Verify localStorage persistence
- Check responsive design on different screen sizes
- Test dark/light theme switching

### Git Workflow
- Commit frequently with clear messages
- Use feature branches for major changes
- Keep main branch stable
- Document breaking changes

## Deployment

### Local Development
```bash
python app.py
```
Access at `http://localhost:5000`

### Standalone Build
```bash
pip install -r requirements-build.txt
pyinstaller --onefile --windowed --name "PrintForge Pricing Calculator" app_standalone.py
```
Executable created in `dist/` directory

## Support & Contribution

For issues, feature requests, or contributions, please refer to the main README.md file.

---
**Last Updated:** 2026-01-09
**Version:** 1.0 (Sprint 4 In Progress)
**Maintainer:** PrintForge Development Team
