"""
PrintForge Pricing Calculator - Desktop Application
Uses PyWebView for native window and file dialogs
"""

import webview
import threading
import sys
import os
from pathlib import Path

# Import Flask app
from app import app

# Create necessary directories
def setup_directories():
    """Create required directories for the application"""
    # When frozen (built as exe), use AppData for writable directories
    if getattr(sys, 'frozen', False):
        # Running as compiled exe
        app_data = Path(os.environ.get('APPDATA', '')) / 'PrintForge'
        app_data.mkdir(exist_ok=True)

        # Create uploads directory in AppData
        uploads_dir = app_data / 'uploads'
        uploads_dir.mkdir(exist_ok=True)

        # Update Flask's upload folder to use AppData
        app.config['UPLOAD_FOLDER'] = str(uploads_dir)
    else:
        # Running from source - use local directory
        base_dir = Path(__file__).parent
        uploads_dir = base_dir / 'uploads'
        uploads_dir.mkdir(exist_ok=True)

# Set up directories before starting Flask
setup_directories()


class API:
    """
    JavaScript API for native file operations
    Exposed to JavaScript via window.pywebview.api
    """

    def save_file_dialog(self, filename='', file_types=''):
        """
        Show native save file dialog

        Args:
            filename: Default filename
            file_types: Tuple of file type descriptions and extensions
                       e.g., "Excel Files (*.xlsx)|JSON Files (*.json)"

        Returns:
            str: Selected file path or None if cancelled
        """
        # Parse file_types string into tuple format
        # Format: "Description (*.ext)|Description2 (*.ext2)"
        file_type_tuples = []
        if file_types:
            for ft in file_types.split('|'):
                if '(' in ft and ')' in ft:
                    desc = ft.split('(')[0].strip()
                    ext = ft.split('(')[1].split(')')[0].replace('*', '').strip()
                    file_type_tuples.append(f"{desc} ({ext})")

        result = window.create_file_dialog(
            webview.SAVE_DIALOG,
            save_filename=filename,
            file_types=tuple(file_type_tuples) if file_type_tuples else ()
        )

        return result[0] if result else None

    def open_file_dialog(self, file_types=''):
        """
        Show native open file dialog

        Args:
            file_types: File type filter string

        Returns:
            str: Selected file path or None if cancelled
        """
        file_type_tuples = []
        if file_types:
            for ft in file_types.split('|'):
                if '(' in ft and ')' in ft:
                    desc = ft.split('(')[0].strip()
                    ext = ft.split('(')[1].split(')')[0].replace('*', '').strip()
                    file_type_tuples.append(f"{desc} ({ext})")

        result = window.create_file_dialog(
            webview.OPEN_DIALOG,
            file_types=tuple(file_type_tuples) if file_type_tuples else ()
        )

        return result[0] if result else None

    def get_app_mode(self):
        """Return 'desktop' to indicate we're running in desktop mode"""
        return 'desktop'


def start_flask():
    """Start Flask server in a separate thread"""
    app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)


if __name__ == '__main__':
    # Start Flask in background thread
    flask_thread = threading.Thread(target=start_flask, daemon=True)
    flask_thread.start()

    # Create API instance
    api = API()

    # Create and start PyWebView window
    window = webview.create_window(
        'PrintForge Pricing Calculator',
        'http://127.0.0.1:5000',
        width=1600,
        height=1000,
        resizable=True,
        fullscreen=False,
        min_size=(1200, 800),
        background_color='#1E1E1E',
        text_select=True,
        js_api=api
    )

    # Start the app
    webview.start(debug=False)
