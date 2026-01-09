"""
Build script for creating standalone PrintForge desktop executable and installer
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_pyinstaller():
    """Check if PyInstaller is installed"""
    try:
        import PyInstaller
        return True
    except ImportError:
        return False

def install_pyinstaller():
    """Install PyInstaller"""
    print("Installing PyInstaller...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
    print("PyInstaller installed successfully!")

def check_inno_setup():
    """Check if Inno Setup is installed"""
    # Common Inno Setup installation paths
    possible_paths = [
        Path(r"C:\Program Files (x86)\Inno Setup 6\ISCC.exe"),
        Path(r"C:\Program Files\Inno Setup 6\ISCC.exe"),
        Path(r"C:\Program Files (x86)\Inno Setup 5\ISCC.exe"),
        Path(r"C:\Program Files\Inno Setup 5\ISCC.exe"),
    ]

    for path in possible_paths:
        if path.exists():
            return path
    return None

def build_executable():
    """Build the standalone executable"""
    print("\n" + "="*60)
    print("Building PrintForge Desktop Application")
    print("="*60 + "\n")

    # Get project directory
    project_dir = Path(__file__).parent

    # Build command
    cmd = [
        "pyinstaller",
        "--name", "PrintForge",
        "--windowed",  # No console window
        "--onedir",    # Create a folder with all dependencies (more reliable than --onefile)
        "--add-data", f"{project_dir}/templates{os.pathsep}templates",
        "--add-data", f"{project_dir}/static{os.pathsep}static",
        "--hidden-import", "bottle",
        "--hidden-import", "openpyxl",
        "--hidden-import", "werkzeug",
        "--hidden-import", "webview",
        "--clean",  # Clean cache
        str(project_dir / "app_desktop.py")
    ]

    # Add icon if it exists
    icon_path = project_dir / "static" / "images" / "icon.ico"
    if icon_path.exists():
        cmd.extend(["--icon", str(icon_path)])
    else:
        print("Warning: No icon.ico found at static/images/icon.ico")
        print("The executable will use the default Python icon.\n")

    print("Running PyInstaller...")
    print(f"Command: {' '.join(cmd)}\n")

    try:
        subprocess.check_call(cmd)
        print("\n" + "="*60)
        print("Executable Build Completed Successfully!")
        print("="*60)
        print(f"\nExecutable location: {project_dir}/dist/PrintForge/PrintForge.exe")
        return True
    except subprocess.CalledProcessError as e:
        print("\n" + "="*60)
        print("Build failed!")
        print("="*60)
        print(f"\nError: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure all dependencies are installed: pip install -r requirements.txt")
        print("2. Ensure PyWebView is installed: pip install pywebview")
        print("3. Try cleaning build cache: rm -rf build dist *.spec")
        return False

def build_installer():
    """Build the Windows installer using Inno Setup"""
    print("\n" + "="*60)
    print("Building Windows Installer")
    print("="*60 + "\n")

    project_dir = Path(__file__).parent

    # Check if Inno Setup is installed
    iscc_path = check_inno_setup()

    if not iscc_path:
        print("Inno Setup not found!")
        print("\nInno Setup is required to create the installer.")
        print("Download from: https://jrsoftware.org/isdl.php")
        print("\nAfter installing Inno Setup, you can build the installer with:")
        print(f"  \"{project_dir / 'installer.iss'}\"")
        print("\nOr use the standalone executable from: dist/PrintForge/")
        return False

    # Check if executable was built
    exe_path = project_dir / "dist" / "PrintForge" / "PrintForge.exe"
    if not exe_path.exists():
        print("Error: Executable not found!")
        print("Please build the executable first.")
        return False

    # Build installer
    iss_file = project_dir / "installer.iss"
    print(f"Using Inno Setup Compiler: {iscc_path}")
    print(f"Script: {iss_file}\n")

    try:
        subprocess.check_call([str(iscc_path), str(iss_file)])
        print("\n" + "="*60)
        print("Installer Build Completed Successfully!")
        print("="*60)

        # Find the installer
        installer_dir = project_dir / "installer_output"
        if installer_dir.exists():
            installers = list(installer_dir.glob("PrintForge_Setup_*.exe"))
            if installers:
                print(f"\nInstaller location: {installers[0]}")
                print(f"Size: {installers[0].stat().st_size / (1024*1024):.1f} MB")

        return True
    except subprocess.CalledProcessError as e:
        print("\n" + "="*60)
        print("Installer build failed!")
        print("="*60)
        print(f"\nError: {e}")
        return False

def main():
    print("="*60)
    print("PrintForge Desktop Build Tool")
    print("="*60)
    print()
    print("This tool will:")
    print("  1. Build the standalone executable using PyInstaller")
    print("  2. Create a Windows installer using Inno Setup")
    print()

    # Check if PyInstaller is installed
    if not check_pyinstaller():
        print("PyInstaller not found.")
        response = input("Install PyInstaller? (y/n): ").strip().lower()
        if response == 'y':
            install_pyinstaller()
        else:
            print("Cannot build without PyInstaller. Exiting.")
            sys.exit(1)

    # Check if PyWebView is installed
    try:
        import webview
    except ImportError:
        print("\nWarning: PyWebView not installed!")
        print("The desktop app requires PyWebView.")
        print("Install with: pip install pywebview")
        response = input("\nContinue anyway? (y/n): ").strip().lower()
        if response != 'y':
            sys.exit(1)

    # Check if all requirements are installed
    try:
        import flask
        import openpyxl
        import werkzeug
    except ImportError as e:
        print(f"\nError: Missing requirement: {e}")
        print("Install all requirements with: pip install -r requirements.txt")
        sys.exit(1)

    # Step 1: Build the executable
    if not build_executable():
        print("\nExecutable build failed. Cannot proceed to installer.")
        sys.exit(1)

    # Step 2: Build the installer
    print("\n")
    should_build_installer = input("Build Windows installer? (y/n): ").strip().lower()

    if should_build_installer == 'y':
        success = build_installer()

        if success:
            print("\n" + "="*60)
            print("Build Process Complete!")
            print("="*60)
            print("\nYou now have:")
            print("  1. Standalone executable: dist/PrintForge/PrintForge.exe")
            print("  2. Windows installer: installer_output/PrintForge_Setup_1.1.0.exe")
            print("\nDistribution:")
            print("  - Give users the installer for easy installation")
            print("  - Or distribute the dist/PrintForge/ folder as portable app")
        else:
            print("\n" + "="*60)
            print("Build Complete (Executable Only)")
            print("="*60)
            print("\nStandalone executable: dist/PrintForge/PrintForge.exe")
            print("\nTo build installer later:")
            print("  1. Install Inno Setup from https://jrsoftware.org/isdl.php")
            print("  2. Run: python build_desktop.py")
    else:
        print("\n" + "="*60)
        print("Build Complete (Executable Only)")
        print("="*60)
        print("\nStandalone executable: dist/PrintForge/PrintForge.exe")
        print("\nDistribute the entire 'dist/PrintForge/' folder to users.")

if __name__ == "__main__":
    main()
