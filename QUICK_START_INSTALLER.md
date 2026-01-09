# Quick Start: Building the Installer

**Goal:** Create `PrintForge_Setup_1.1.0.exe` - a Windows installer users can download and run.

## 3-Step Process

### Step 1: Install Prerequisites (One-time setup)

```bash
# Install Python dependencies
pip install -r requirements.txt
pip install pyinstaller

# Download and install Inno Setup
# https://jrsoftware.org/isdl.php
```

### Step 2: Run Build Script

```bash
python build_desktop.py
```

When prompted:
- Install PyInstaller if needed: `y`
- Build Windows installer: `y`

### Step 3: Distribute

Your installer is ready at:
```
installer_output/PrintForge_Setup_1.1.0.exe
```

Give this file to users. They double-click to install PrintForge!

---

## What the Installer Does

When users run `PrintForge_Setup_1.1.0.exe`:

1. Shows professional installation wizard
2. Asks where to install (default: `C:\Program Files\PrintForge`)
3. Creates shortcuts:
   - Start Menu: PrintForge
   - Desktop (optional)
4. Installs all files
5. Adds uninstaller to Windows Settings
6. Launches PrintForge

## User Data Location

User data is saved to:
```
C:\Users\<Username>\AppData\Roaming\PrintForge\
```

This includes:
- Client database (localStorage)
- Quote history
- Templates
- Settings
- Backups

Data is preserved when:
- Updating to new version
- Uninstalling (can be deleted during uninstall)

## File Structure After Installation

```
C:\Program Files\PrintForge\
├── PrintForge.exe          # Main application
├── templates/              # Web UI templates
├── static/                 # CSS, JavaScript, images
├── _internal/              # Python runtime + dependencies
├── README.md
├── DESKTOP_README.md
└── CHANGELOG.md
```

## Testing Your Build

Before distributing:

1. **Test the executable:**
   ```bash
   cd dist\PrintForge
   PrintForge.exe
   ```

2. **Test the installer:**
   - Run `PrintForge_Setup_1.1.0.exe`
   - Complete installation
   - Launch from Start Menu
   - Test core features:
     - Create a quote
     - Export to Excel (native file dialog should appear)
     - Save config (native file dialog should appear)
   - Uninstall from Windows Settings

## Troubleshooting

| Problem | Solution |
|---------|----------|
| PyInstaller fails | Try: `pip install pyinstaller --upgrade` |
| PyWebView won't install | Use Python 3.11 or 3.12 instead of 3.14 |
| Inno Setup not found | Install from https://jrsoftware.org/isdl.php |
| Executable won't run | Check `dist/PrintForge/` for error logs |
| Large file size (100+ MB) | Normal for Python desktop apps with Qt |

## Quick Commands

```bash
# Full build (everything)
python build_desktop.py

# Just build executable (no installer)
pyinstaller PrintForge.spec

# Just build installer (after executable is built)
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss

# Clean build (start fresh)
rmdir /s /q build dist
python build_desktop.py
```

## Distribution Checklist

Before releasing to users:

- [ ] Test executable runs
- [ ] Test installer completes
- [ ] Test all features work
- [ ] Test native file dialogs appear
- [ ] Test uninstaller removes everything
- [ ] Check installer file size (should be 80-150 MB)
- [ ] Verify version number is correct
- [ ] Include release notes with installer

## Next Steps

See [BUILD_INSTALLER.md](BUILD_INSTALLER.md) for:
- Advanced customization
- Code signing
- CI/CD integration
- Multiple languages
- Silent installation options

---

**That's it!** Run `python build_desktop.py` and you'll have a professional Windows installer ready to distribute.
