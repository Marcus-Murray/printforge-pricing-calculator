# Building PrintForge Pricing Calculator as Standalone Executable

This guide explains how to package the PrintForge Pricing Calculator as a standalone Windows executable.

## Prerequisites

- Python 3.8 or higher installed
- All dependencies installed

## Build Instructions

### Step 1: Install Build Dependencies

```bash
pip install -r requirements-build.txt
```

This installs Flask, openpyxl, and PyInstaller.

### Step 2: Build the Executable

Run PyInstaller with the spec file:

```bash
pyinstaller printforge.spec
```

This will:
- Package all Python code
- Include all templates and static files
- Create a single executable file
- Output to the `dist` folder

### Step 3: Find Your Executable

After building, you'll find:
```
dist/PrintForge Pricing Calculator.exe
```

This is a standalone executable that can run on any Windows computer without Python installed!

## Distribution

You can now:
1. Copy `PrintForge Pricing Calculator.exe` to any Windows computer
2. Double-click to run - it will automatically open in your default browser
3. No installation needed!

## File Size

The executable will be approximately 40-60 MB due to bundled Python runtime and dependencies.

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `pip install -r requirements-build.txt`
- Try updating PyInstaller: `pip install --upgrade pyinstaller`

### Executable Doesn't Run
- Check Windows Defender/antivirus (sometimes flags PyInstaller executables)
- Make sure you're running on a 64-bit Windows system

### Static Files Not Loading
- The spec file should handle this automatically
- If issues persist, check that `templates` and `static` folders are included in the build

## Clean Build

To rebuild from scratch:
```bash
# Remove old build files
rmdir /s /q build dist
del PrintForge*.spec~

# Rebuild
pyinstaller printforge.spec
```

## Advanced Options

### Custom Icon
Download an `.ico` file and update `printforge.spec`:
```python
icon='path/to/icon.ico',
```

### Console Window
To show console window for debugging, change in `printforge.spec`:
```python
console=True,
```

---

**Built with PyInstaller**
PrintForge Pricing Calculator - © 2026
