# 🚀 QUICK START GUIDE

## Get Running in 2 Minutes!

### Step 1: Open VS Code
1. Open VS Code
2. File → Open Folder
3. Select the `printforge_web` folder

### Step 2: Open Terminal
- Press **Ctrl+`** (backtick) to open terminal in VS Code
- Or: View → Terminal

### Step 3: Install Dependencies
Type this command and press Enter:
```bash
pip install -r requirements.txt
```

Wait for it to finish (takes ~30 seconds).

### Step 4: Run the App
Type this command and press Enter:
```bash
python app.py
```

### Step 5: Use It!
- Browser will open automatically to http://localhost:5000
- If not, manually go to http://localhost:5000
- The app is now running!

---

## What You'll See

### In Your Browser:
```
┌─────────────────────────────────────────┐
│  PrintForge Pricing Calculator          │ ← Orange header
├─────────────────────────────────────────┤
│ [Basic Info] [Hardware] [Packaging]...  │ ← Clean tabs
├─────────────────────────────────────────┤
│                                         │
│  Product Information                    │
│  Part Name: [New Part        ]          │ ← Perfect inputs
│  Material:  [ABS         ▼]             │ ← Clear dropdown!
│                                         │
│  [Save] [Load] [Export]  [Recalculate]  │
└─────────────────────────────────────────┘
```

### Dropdowns Look Perfect:
```
┌──────────────┬──┐
│ ABS          │▼ │  ← Obvious dropdown arrow
└──────────────┴──┘
```

### Number Inputs Work Great:
```
┌──────────────┐
│ 40.00    ▲▼ │  ← Clear up/down arrows
└──────────────┘
```

---

## Quick Test

1. **Change filament cost** to 50
2. **Watch auto-calculate** (500ms delay)
3. **Click Results tab** to see pricing
4. **Click Export to Excel** - downloads instantly!

Everything just works! 🎉

---

## To Stop the Server

Press **Ctrl+C** in the terminal

---

## File Locations

### Your Configs Save To:
`C:\Users\YourName\Downloads\`

### Excel Files Export To:
`C:\Users\YourName\Downloads\`

### Uploaded Configs Go To:
`printforge_web/uploads/`

---

## Customizing (Optional)

### Change Colors:
Edit: `static/css/style.css`

Look for:
```css
:root {
    --primary-color: #FF6B35;  /* Change this! */
}
```

Save, refresh browser - instant update!

### Add Materials:
Edit: `templates/index.html`

Find:
```html
<select id="material_type">
    <option value="ABS">ABS</option>
    <option value="PLA">PLA</option>
    <!-- Add more here! -->
</select>
```

---

## Troubleshooting

### "pip is not recognized"
Use: `python -m pip install -r requirements.txt`

### "Port 5000 in use"
Another app using port 5000. Change in `app.py`:
```python
app.run(debug=True, port=5001)  # Use 5001 instead
```

### Browser Doesn't Open
Manually go to: http://localhost:5000

### Styling Looks Wrong
Hard refresh: **Ctrl+Shift+R**

---

## VS Code Tips

### Split View:
- **Ctrl+\\** splits the editor
- View code and browser side-by-side

### File Navigation:
- **Ctrl+P** quick open files
- Type filename, press Enter

### Find in Files:
- **Ctrl+Shift+F** search all files
- Great for finding where things are

---

## That's It!

You're ready to use your new web-based pricing calculator.

**No more Qt styling headaches!** 🎉

Everything is clean, modern, and works perfectly.

---

## Next Steps

Check out `README.md` for:
- Full documentation
- Customization guide
- Packaging as standalone app
- Adding new features

**Happy pricing!** 🚀
