# Quick Setup Guide

## 🚀 Getting Started

### 1. Local Development Server

You need to run the app from a web server (not by opening the HTML file directly) because the Web Bluetooth API requires secure origins.

**Option A: Using Python (recommended)**
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m http.server 8000

# Windows
python -m http.server 8000
```

**Option B: Using Node.js**
```bash
# Install http-server globally
npm install -g http-server

# Or run directly with npx
npx http-server -p 8000 -o
```

**Option C: Using npm scripts**
```bash
# If you have Node.js installed
npm run dev
```

### 2. Access the App

1. Open your browser and go to `http://localhost:8000`
2. On mobile, connect to the same network and use your computer's IP address: `http://YOUR_IP:8000`

### 3. Mobile Access

**For development on mobile:**
1. Connect your phone to the same WiFi network as your computer
2. Find your computer's IP address:
   - **Mac/Linux**: `ifconfig | grep inet`
   - **Windows**: `ipconfig`
3. Open `http://YOUR_IP_ADDRESS:8000` on your mobile browser

**For production:**
- Deploy to any web hosting service that supports HTTPS
- GitHub Pages, Netlify, Vercel, etc. all work great

## 📱 Testing on Mobile

### Chrome/Edge on Android
1. Open Chrome or Edge browser
2. Navigate to your app URL
3. Grant Bluetooth permissions when prompted
4. Ensure your Bluetooth printer is discoverable

### Browser Compatibility
- ✅ **Chrome** (Android 6.0+)
- ✅ **Microsoft Edge** (Android)
- ✅ **Samsung Internet** (recent versions)
- ❌ **Safari** (iOS) - Web Bluetooth not supported
- ❌ **Firefox** - Limited Web Bluetooth support

## 🖨️ Printer Preparation

### Before First Use
1. **Power on** your Bluetooth thermal printer
2. **Enable pairing mode** (check your printer manual)
3. **Ensure ESC/POS compatibility** (most thermal printers support this)
4. **Load paper** and check printer status

### Common Printer Brands
- **Epson**: TM series (TM-T20, TM-T82, etc.)
- **Star Micronics**: TSP series
- **Bixolon**: SRP series
- **HOIN**: HOP series
- **Generic**: Most ESC/POS compatible thermal printers

## 🔧 Troubleshooting

### App won't load
- Make sure you're using `http://localhost:8000` not `file://`
- Check if port 8000 is available
- Try a different port: `python3 -m http.server 8001`

### Bluetooth not working
- Use Chrome or Edge on Android
- Ensure Bluetooth is enabled on your device
- Check if your printer supports the required Bluetooth services
- Try refreshing the page and granting permissions again

### Images not showing
- Verify the SVG files are in the same directory as `index.html`
- Check browser console for loading errors
- Make sure the web server is serving static files correctly

### Print quality issues
- Check paper alignment in printer
- Verify printer supports your paper size
- Some printers may need different ESC/POS commands
- Try adjusting the image processing settings in `script.js`

## 🔧 Development Tips

### Debugging Bluetooth
1. Open Chrome DevTools (F12)
2. Go to **Console** tab to see connection logs
3. Use **Application > Storage** to check service worker
4. **Network** tab shows if resources are loading correctly

### Customization
- Edit `style.css` for visual changes
- Modify `script.js` for functionality changes  
- Add new logos by updating `index.html` and adding SVG files
- Adjust printer settings in the `connectToPrinter()` method

## 📦 Deployment

### For Production
1. Upload all files to your web hosting service
2. Ensure HTTPS is enabled (required for Web Bluetooth)
3. Test on actual mobile devices
4. Consider adding more printer compatibility

### PWA Installation
When accessed via HTTPS, users can install the app:
1. Chrome will show "Add to Home Screen" prompt
2. App will work offline for cached resources
3. Provides native app-like experience

---

**Need help?** Check the main README.md for detailed documentation and troubleshooting. 