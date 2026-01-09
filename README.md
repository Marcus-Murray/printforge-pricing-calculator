# 🔥 PrintForge Pricing Calculator - Web Version

**Modern web-based pricing calculator with perfect Ant Design styling**

No more Qt styling headaches! This web-based version gives you complete control over the interface while keeping all your calculation logic in Python.

---

## ✨ What You Get

### Perfect Interface
- ✅ Clean Ant Design aesthetic
- ✅ Perfect dropdowns with clear arrows
- ✅ Smooth number inputs
- ✅ Professional dark/light theme with orange accents
- ✅ Collapsible sidebar navigation
- ✅ Responsive design
- ✅ Zero styling issues

### Core Features (Sprint 1-3)
- ✅ All pricing calculations
- ✅ Excel export (same format)
- ✅ Save/Load configs (JSON)
- ✅ Real-time auto-calculation
- ✅ Hardware & packaging tables
- ✅ Advanced machine cost settings
- ✅ Batch quote mode
- ✅ Compare mode
- ✅ Quote history
- ✅ Print profiles
- ✅ Price alerts

### Sprint 4 Features (COMPLETE!)
- ✅ **Client Management** - Full CRM with discounts, stats, export
- ✅ **Quote Templates** - Save & reuse complete configurations
- ✅ **Material Presets** - Quick material cost selection
- ✅ **Automatic Backups** - Scheduled backups, export/restore, history management

### Better Development
- ✅ Edit CSS instantly (no recompiling)
- ✅ Debug with browser DevTools
- ✅ Easy to add features
- ✅ Works offline (local server)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open VS Code, open a terminal (Ctrl+`), navigate to the printforge_web folder, and run:

```bash
pip install -r requirements.txt
```

This installs Flask and openpyxl (same as before).

### Step 2: Run the App

```bash
python app.py
```

The app will:
1. Start a local server (localhost:5000)
2. Automatically open in your default browser
3. Show a clean web interface

### Step 3: Use It!

- The interface is exactly like the PyQt version
- Click tabs to navigate
- All inputs auto-calculate
- Export to Excel works perfectly
- Save/Load configs work

---

## 📁 Project Structure

```
printforge_web/
├── app.py                  # Flask backend (calculations, Excel export)
├── requirements.txt        # Python dependencies
├── templates/
│   └── index.html         # Main interface HTML
├── static/
│   ├── css/
│   │   └── style.css      # All styling (Ant Design aesthetic)
│   └── js/
│       └── app.js         # Frontend JavaScript (interactivity)
└── uploads/               # Saved configs go here (auto-created)
```

---

## 🎨 How It Works

### Frontend (HTML/CSS/JS)
- **HTML** - Structure and layout
- **CSS** - Perfect Ant Design styling
- **JavaScript** - Tab switching, calculations, file operations

### Backend (Python/Flask)
- **Flask** - Web server
- **Calculations** - Same pricing logic
- **Excel Export** - Same openpyxl code
- **File Operations** - Save/Load configs

### Communication
- JavaScript sends data to Python via API calls
- Python returns results
- JavaScript updates the interface

---

## 🎯 Usage

### Basic Workflow
1. Fill in product info (Basic Info tab)
2. Add hardware items (Hardware tab)
3. Add packaging (Packaging tab)
4. Adjust advanced settings (Advanced tab)
5. View results (Results tab)
6. Export to Excel or Save Config

### Auto-Calculation
- Changes auto-calculate after 500ms
- Or click "Recalculate" to force update
- Results update instantly

### Save/Load
- **Save:** Downloads JSON config to your Downloads folder
- **Load:** Click "Load Config" and select a JSON file
- Same format as PyQt version (backward compatible)

### Excel Export
- Generates professional spreadsheet
- Default filename is the part name
- Same format and layout as before
- Downloads to your Downloads folder

---

## 🎨 Customizing the Look

### Change Colors
Edit `static/css/style.css`:

```css
:root {
    --primary-color: #FF6B35;      /* Orange accent */
    --bg-dark: #1E1E1E;           /* Dark background */
    --bg-card: #2D2D2D;           /* Card background */
    --text-primary: #E0E0E0;      /* Text color */
}
```

Save the file, refresh browser - instant update!

### Change Layout
Edit `templates/index.html`:
- Rearrange sections
- Add new fields
- Change tab order

### Change Behavior
Edit `static/js/app.js`:
- Modify calculations
- Add new features
- Change auto-calc timing

**No recompiling needed!** Just save and refresh.

---

## 💡 Pro Tips

### Development Mode
When `app.py` runs with `debug=True`, changes to HTML/CSS/JS auto-reload in the browser. Just refresh!

### Browser DevTools
- **F12** opens DevTools
- **Console** shows errors/logs
- **Network** shows API calls
- **Elements** lets you inspect styling

### Multiple Browsers
Test in different browsers:
- Chrome: Full features
- Firefox: Full features
- Edge: Full features
- Safari: Full features

### Mobile Testing
The interface is responsive:
- Resize browser window
- Tabs scroll horizontally on small screens
- Works on tablets/phones

---

## 🔧 Troubleshooting

### "Port 5000 already in use"
Change port in `app.py`:
```python
app.run(debug=True, port=5001)  # Use different port
```

### Browser Doesn't Open
Manually go to: http://localhost:5000

### Excel Export Not Working
Check that openpyxl is installed:
```bash
pip install openpyxl --break-system-packages
```

### Styling Looks Wrong
Hard refresh: **Ctrl+Shift+R** (clears CSS cache)

---

## 📦 Packaging as Standalone App

### Option 1: PyInstaller + PyWebView

Install PyWebView:
```bash
pip install pywebview
```

Modify `app.py` to use PyWebView instead of webbrowser:
```python
import webview

if __name__ == '__main__':
    webview.create_window('PrintForge Pricer', 'http://localhost:5000')
    webview.start()
```

Then package with PyInstaller:
```bash
pyinstaller --onefile --windowed app.py
```

### Option 2: Just Python

Keep as-is, run with:
```bash
python app.py
```

Users need Python installed, but it's simple and lightweight.

---

## 🆚 Comparison: PyQt6 vs Web

| Aspect | PyQt6 | Web-Based |
|--------|-------|-----------|
| **Styling** | Finicky, CSS-like but not CSS | Real CSS, works perfectly |
| **Dropdowns** | Fought for hours | Just works |
| **Arrows** | Tiny/broken/rectangles | Perfect native rendering |
| **Customization** | Recompile after changes | Edit CSS, refresh browser |
| **Debugging** | Difficult | Browser DevTools |
| **Learning Curve** | Qt-specific knowledge | Standard web tech |
| **File Size** | ~150MB | ~5MB Python + browser |
| **Updates** | Recompile and redistribute | Edit files, done |

---

## 🎓 Learning Resources

### Flask
- Official: https://flask.palletsprojects.com/
- Tutorial: https://flask.palletsprojects.com/tutorial/

### HTML/CSS/JavaScript
- MDN: https://developer.mozilla.org/
- W3Schools: https://www.w3schools.com/

### Ant Design (for inspiration)
- Website: https://ant.design
- Design values: https://ant.design/docs/spec/values

---

## 🚀 Next Steps

### Add Features
1. **More material types** - Edit `templates/index.html`, add `<option>` elements
2. **New calculations** - Edit `app.py`, add to `/calculate` route
3. **Custom themes** - Create additional CSS files
4. **Data validation** - Add checks in JavaScript before submitting

### Improve UX
1. **Loading indicators** - Show spinner during calculations
2. **Better error messages** - More descriptive feedback
3. **Keyboard shortcuts** - Add hotkeys for common actions
4. **Dark/light mode toggle** - Add theme switcher

### Deploy Online
1. **Heroku** - Free hosting for small apps
2. **PythonAnywhere** - Python-specific hosting
3. **Digital Ocean** - Full control VPS

---

## 📞 Need Help?

### Common Questions

**Q: Can I switch back to PyQt6?**  
A: Yes, but why? This works better!

**Q: Will my old configs work?**  
A: Yes! Same JSON format, fully compatible.

**Q: Can I use this on multiple computers?**  
A: Yes! Just copy the folder and run `python app.py`.

**Q: Can others use it without Python?**  
A: Package it with PyInstaller + PyWebView for standalone .exe.

**Q: Is it slower than PyQt6?**  
A: No! Calculations happen in Python (same speed).

---

## 🎉 You're Done!

You now have a **professional, modern, web-based pricing calculator** with:
- Perfect Ant Design aesthetic
- Zero styling headaches
- Easy to customize
- Easy to maintain
- All the same functionality

**Enjoy your clean, working interface!** 🚀

---

**Made with ❤️ for PrintForge**
**Version:** 1.1.0 (Sprint 4 Complete)
**Date:** January 2026
**See:** [CHANGELOG.md](CHANGELOG.md) for detailed changes
**See:** [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture details
