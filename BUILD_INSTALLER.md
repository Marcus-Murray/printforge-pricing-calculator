# Building PrintForge Installer

This guide explains how to build a standalone Windows installer for PrintForge that users can download and install like any other application.

## Overview

The build process creates:
1. **Standalone Executable** - A portable app folder with all dependencies
2. **Windows Installer** - A professional setup.exe that installs PrintForge

## Prerequisites

### 1. Python Requirements

Install all Python dependencies:

```bash
pip install -r requirements.txt
pip install pyinstaller
```

**PyWebView Note:** If PyWebView fails to install on Windows (known issue with Python 3.14), use Python 3.11 or 3.12 instead.

### 2. Inno Setup (For Installer Only)

Download and install Inno Setup to create the Windows installer:

**Download:** https://jrsoftware.org/isdl.php

Install using default options. The build script will automatically find it.

### 3. Icon File (Optional)

Place an icon file at `static/images/icon.ico` for a custom application icon.

## Build Process

### Quick Start

Run the build script:

```bash
python build_desktop.py
```

The script will:
1. Check dependencies
2. Build the executable with PyInstaller
3. Ask if you want to build the installer
4. If yes, create the installer with Inno Setup

### Output Files

After building, you'll have:

```
printforge_web/
├── dist/
│   └── PrintForge/
│       ├── PrintForge.exe          # Main executable
│       ├── templates/              # Web templates
│       ├── static/                 # CSS, JS, images
│       └── _internal/              # Python runtime & dependencies
│
└── installer_output/
    └── PrintForge_Setup_1.1.0.exe  # Windows installer
```

## Distribution

### Option 1: Windows Installer (Recommended)

Distribute `PrintForge_Setup_1.1.0.exe` to users.

**Features:**
- Professional installation wizard
- Creates Start Menu shortcuts
- Optional desktop shortcut
- Proper uninstaller
- Updates system registry

**User Experience:**
1. Double-click the installer
2. Follow the setup wizard
3. Click "Finish" and launch PrintForge

### Option 2: Portable App

Distribute the `dist/PrintForge/` folder as a ZIP file.

**Features:**
- No installation required
- Run from USB drive
- No system changes
- Easy to move/remove

**User Experience:**
1. Extract the ZIP file anywhere
2. Run `PrintForge.exe`

## Manual Build Steps

### Step 1: Build Executable

```bash
pyinstaller --name "PrintForge" ^
  --windowed ^
  --onedir ^
  --add-data "templates;templates" ^
  --add-data "static;static" ^
  --hidden-import bottle ^
  --hidden-import openpyxl ^
  --hidden-import werkzeug ^
  --hidden-import webview ^
  --clean ^
  app_desktop.py
```

This creates `dist/PrintForge/PrintForge.exe`

### Step 2: Build Installer

Open Inno Setup and compile `installer.iss`, or use the command line:

```bash
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss
```

This creates `installer_output/PrintForge_Setup_1.1.0.exe`

## Customizing the Installer

Edit `installer.iss` to customize:

### Application Info

```ini
#define MyAppName "PrintForge Pricing Calculator"
#define MyAppVersion "1.1.0"
#define MyAppPublisher "Your Company Name"
#define MyAppURL "https://yourwebsite.com"
```

### Installation Options

```ini
DefaultDirName={autopf}\PrintForge      ; Default install location
DefaultGroupName=PrintForge              ; Start Menu folder
```

### Shortcuts

```ini
[Tasks]
Name: "desktopicon"; Description: "Create desktop shortcut"
Name: "quicklaunchicon"; Description: "Create Quick Launch icon"
```

### Files to Include

```ini
[Files]
Source: "dist\PrintForge\*"; DestDir: "{app}"
Source: "README.md"; DestDir: "{app}"
```

## Troubleshooting

### PyInstaller Fails

**Error:** "Module not found"

**Fix:** Add missing modules with `--hidden-import`:
```bash
--hidden-import missing_module_name
```

**Error:** "Failed to execute script"

**Fix:** Test the executable:
```bash
cd dist/PrintForge
PrintForge.exe
```
Check console output for errors.

### PyWebView Won't Install

**Error:** `pythonnet` build fails

**Fixes:**
1. Use Python 3.11 or 3.12 instead of 3.14
2. Install Visual Studio Build Tools
3. Use alternative PyWebView backend

### Inno Setup Not Found

**Error:** "Inno Setup not found"

**Fixes:**
1. Install Inno Setup from https://jrsoftware.org/isdl.php
2. Verify installation path matches build script
3. Build installer manually by opening `installer.iss` in Inno Setup

### Large Installer Size

The installer will be 80-150 MB due to:
- Python runtime (~50 MB)
- PyQt/WebEngine (~60 MB)
- Application files (~10 MB)

This is normal for Python desktop applications.

**To reduce size:**
- Remove unnecessary dependencies
- Use `--onefile` instead of `--onedir` (not recommended - slower startup)
- Use UPX compression in PyInstaller

### Icon Not Showing

**Problem:** Executable uses default Python icon

**Fixes:**
1. Create/download an `.ico` file
2. Place at `static/images/icon.ico`
3. Rebuild with `python build_desktop.py`

## Testing the Build

### Test Executable

```bash
cd dist/PrintForge
PrintForge.exe
```

Verify:
- Window opens correctly
- All features work
- Can save/load files
- Native file dialogs appear

### Test Installer

1. Run `PrintForge_Setup_1.1.0.exe`
2. Install to default location
3. Launch from Start Menu
4. Test all features
5. Uninstall from Windows Settings
6. Verify all files removed

## Signing the Installer (Optional)

For commercial distribution, sign your installer:

1. Obtain a code signing certificate
2. Use `signtool.exe` to sign:

```bash
signtool sign /f your_certificate.pfx /p password /t http://timestamp.digicert.com PrintForge_Setup_1.1.0.exe
```

Benefits of signing:
- Removes "Unknown Publisher" warnings
- Increases user trust
- Required for some enterprise deployments

## Updating the Application

To release an update:

1. Update version in:
   - `installer.iss` (#define MyAppVersion)
   - Build script
   - README.md

2. Rebuild:
```bash
python build_desktop.py
```

3. Distribute new installer

**Note:** Users will need to uninstall old version first (or you can configure upgrade logic in `installer.iss`).

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build Installer

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pyinstaller

      - name: Build executable
        run: python build_desktop.py

      - name: Upload installer
        uses: actions/upload-artifact@v2
        with:
          name: PrintForge-Installer
          path: installer_output/PrintForge_Setup_*.exe
```

## Advanced Configuration

### Multiple Languages

Add language support in `installer.iss`:

```ini
[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"
```

### Silent Installation

Users can install silently:

```bash
PrintForge_Setup_1.1.0.exe /SILENT
```

Or completely silent (no progress):

```bash
PrintForge_Setup_1.1.0.exe /VERYSILENT
```

### Custom Installation Path

```bash
PrintForge_Setup_1.1.0.exe /DIR="C:\Custom\Path"
```

## Support

For build issues:
1. Check error messages carefully
2. Ensure all prerequisites are installed
3. Try manual build steps to isolate the problem
4. Check PyInstaller documentation: https://pyinstaller.org
5. Check Inno Setup documentation: https://jrsoftware.org/ishelp/

## Summary

Building the installer requires:
1. Python + all dependencies
2. PyInstaller (for executable)
3. Inno Setup (for installer)

Run `python build_desktop.py` and follow prompts.

Result: Professional Windows installer ready for distribution!

---

**Version:** 1.0
**Last Updated:** January 2026
