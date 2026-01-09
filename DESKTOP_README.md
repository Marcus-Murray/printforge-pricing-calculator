# PrintForge Desktop Application

This document explains how to run PrintForge as a desktop application with native file dialogs.

## Overview

The desktop version uses PyWebView to create a native window and provide native file save/open dialogs, giving you full control over where files are saved.

## Prerequisites

1. Python 3.9 or later
2. All requirements from `requirements.txt`
3. PyWebView (requires manual installation on Windows)

## Installation

### Step 1: Install Base Requirements

```bash
pip install -r requirements.txt
```

### Step 2: Install PyWebView

**Note:** PyWebView has platform-specific dependencies. On Windows, installation may require additional setup.

#### Option A: Try Direct Installation (may fail on Windows with Python 3.14)

```bash
pip install pywebview==5.0.5
```

#### Option B: Use Alternative Backend (Recommended for Windows)

If the above fails, you can use PyWebView with the CEF (Chromium Embedded Framework) backend:

```bash
pip install pywebview[cef]
```

Or use the Qt backend (requires PyQt6, which should already be installed):

```bash
pip install pywebview
```

**Important:** If you encounter build errors with pythonnet on Windows, this is a known issue. Try using an older version of Python (3.11 or 3.12) or use the web version instead.

## Running the Desktop App

Once PyWebView is installed, run:

```bash
python app_desktop.py
```

This will:
1. Start the Flask backend server
2. Open a native desktop window with the PrintForge interface
3. Enable native file save dialogs when exporting

## Features

### Native File Dialogs

When running in desktop mode, all file operations use native OS dialogs:

- **Save Config**: Choose where to save JSON configuration files
- **Export to Excel**: Choose where to save Excel quote files
- **Export Backup**: Choose where to save backup JSON files

### Differences from Web Version

| Feature | Web Version | Desktop Version |
|---------|-------------|-----------------|
| File Save Location | Browser downloads folder | User chooses location |
| Window Type | Browser tab | Native application window |
| File Dialogs | Browser download prompt | Native OS file dialog |
| Offline Use | Requires local server | Fully standalone |

## Building Standalone Executable

To create a standalone .exe file that doesn't require Python installation:

### Using PyInstaller

1. Install PyInstaller:
```bash
pip install pyinstaller
```

2. Run the build script:
```bash
python build_desktop.py
```

This will create:
- `dist/PrintForge.exe` - Standalone executable
- `dist/PrintForge/` - Folder with all dependencies

3. Distribute the entire `dist/PrintForge/` folder to users

### Manual Build Command

```bash
pyinstaller --name "PrintForge" ^
  --windowed ^
  --onefile ^
  --icon=static/images/icon.ico ^
  --add-data "templates;templates" ^
  --add-data "static;static" ^
  app_desktop.py
```

## Troubleshooting

### PyWebView Won't Install

**Problem:** `pythonnet` dependency fails to build on Windows

**Solutions:**
1. Use Python 3.11 or 3.12 instead of 3.14
2. Install Visual Studio Build Tools
3. Use the web version with `python app.py` instead

### Desktop App Window is Blank

**Problem:** PyWebView window opens but shows blank screen

**Solutions:**
1. Check that Flask server started (should see console output)
2. Try a different PyWebView backend:
   ```python
   webview.start(gui='cef')  # Try CEF backend
   ```
3. Check firewall isn't blocking localhost:5000

### File Dialogs Don't Appear

**Problem:** Clicking Save/Export doesn't show file dialog

**Solutions:**
1. Check browser console for errors (F12 in the window)
2. Verify `window.pywebview.api` is available in JavaScript
3. Check that PyWebView properly initialized the js_api

### Cannot Build Executable

**Problem:** PyInstaller fails or .exe won't run

**Solutions:**
1. Ensure all dependencies are installed
2. Use `--onedir` instead of `--onefile` for easier debugging
3. Check PyInstaller output for missing modules
4. Add missing imports with `--hidden-import`

## Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| Windows 10/11 | ✅ Supported | May need VS Build Tools for PyWebView |
| macOS | ✅ Supported | Requires PyObjC (auto-installed) |
| Linux | ✅ Supported | Requires GTK or Qt backend |

## Development

To modify the desktop application:

1. Edit `app_desktop.py` for desktop-specific functionality
2. Edit `app.py` to add new Flask routes
3. Edit `static/js/app.js` to add/modify JavaScript behavior
4. Use `isDesktopMode()` function to detect desktop vs web mode

## API Reference

### JavaScript API

The desktop app exposes these methods via `window.pywebview.api`:

```javascript
// Check if running in desktop mode
if (window.pywebview) {
    // Show save file dialog
    const path = await window.pywebview.api.save_file_dialog(
        'filename.json',
        'JSON Files (*.json)'
    );

    // Show open file dialog
    const path = await window.pywebview.api.open_file_dialog(
        'JSON Files (*.json)|Excel Files (*.xlsx)'
    );

    // Get app mode
    const mode = await window.pywebview.api.get_app_mode(); // Returns 'desktop'
}
```

### Flask Routes

Desktop-specific routes:

- `POST /save-file-to-path` - Save content to user-specified path
- `POST /read-file-from-path` - Read file from user-specified path

## Support

For issues specific to the desktop version:

1. Check PyWebView documentation: https://pywebview.flowrl.com
2. Ensure all dependencies are properly installed
3. Try the web version if desktop setup is problematic

## License

Same as PrintForge main application.

---

**Version:** 1.0.0
**Last Updated:** January 2026
**Desktop Support:** Experimental
