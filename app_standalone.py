"""
PrintForge Pricing Calculator - Standalone Desktop Version
Launches Flask in a standalone window without browser chrome
"""

import subprocess
import sys
import time
from threading import Thread
from pathlib import Path

# Import Flask app
from app import app

def run_flask():
    """Run Flask server"""
    app.run(port=5000, debug=False, use_reloader=False)

def open_app_window():
    """Open app in Edge app mode (standalone window)"""
    time.sleep(1.5)  # Wait for Flask to start

    # Try to use Edge in app mode (creates borderless window)
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]

    url = "http://localhost:5000"

    # Try Edge app mode first (creates standalone window)
    for edge_path in edge_paths:
        if Path(edge_path).exists():
            try:
                subprocess.Popen([
                    edge_path,
                    "--app=" + url,
                    "--window-size=1200,900",
                    "--disable-features=TranslateUI",
                    "--no-first-run",
                    "--no-default-browser-check"
                ])
                return
            except:
                pass

    # Fallback to Chrome app mode
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ]

    for chrome_path in chrome_paths:
        if Path(chrome_path).exists():
            try:
                subprocess.Popen([
                    chrome_path,
                    "--app=" + url,
                    "--window-size=1200,900"
                ])
                return
            except:
                pass

    # Last resort: default browser
    import webbrowser
    webbrowser.open(url)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("PrintForge Pricing Calculator")
    print("="*60)
    print("\nStarting application...")
    print("="*60 + "\n")

    # Start Flask in background thread
    flask_thread = Thread(target=run_flask, daemon=True)
    flask_thread.start()

    # Open app window
    open_app_window()

    # Keep running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down...")
        sys.exit(0)
