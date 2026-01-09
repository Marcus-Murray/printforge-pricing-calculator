# Adelle Font Files

This directory should contain the Adelle font files for the PrintForge application.

## Required Files

You need to place the following Adelle font files in this directory:

### Regular Weight (400)
- `Adelle-Regular.woff2`
- `Adelle-Regular.woff`

### SemiBold Weight (600)
- `Adelle-SemiBold.woff2`
- `Adelle-SemiBold.woff`

### Bold Weight (700)
- `Adelle-Bold.woff2`
- `Adelle-Bold.woff`

## Converting OTF/TTF to WOFF/WOFF2

If you have Adelle font files in OTF or TTF format, you'll need to convert them to WOFF and WOFF2 for web use.

### Recommended Converter: Transfonter

1. Go to https://transfonter.org/
2. Click "Add fonts" and upload your OTF files (Regular, SemiBold, and Bold)
3. Check these settings:
   - ✅ WOFF2
   - ✅ WOFF
   - ✅ Add local() rule (optional)
   - ✅ Autohint font (optional, for better rendering)
4. Click "Convert"
5. Download the ZIP file
6. Extract and copy the `.woff` and `.woff2` files to this directory

### File Naming

After conversion, rename the files to match:
- Regular weight (400): `Adelle-Regular.woff2` and `Adelle-Regular.woff`
- SemiBold weight (600): `Adelle-SemiBold.woff2` and `Adelle-SemiBold.woff`
- Bold weight (700): `Adelle-Bold.woff2` and `Adelle-Bold.woff`

### Alternative Converters

- https://everythingfonts.com/font-face
- https://cloudconvert.com/otf-to-woff2
- FontForge (desktop app for advanced users)

## Fallback

If the Adelle font files are not present, the application will fall back to system fonts (San Francisco on Mac, Segoe UI on Windows, etc.) for all text except the "PrintForge" brand name which uses Skandal.
