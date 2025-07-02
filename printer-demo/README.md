# Logo Printer Web App

A simple mobile-friendly web application for selecting and printing logos via Bluetooth thermal printers.

## Features

- 📱 **Mobile-optimized** - Responsive design that works great on phones and tablets
- 🖼️ **Logo Selection** - Display two logos with visual selection feedback
- 📄 **Bottom Sheet UI** - Smooth sliding bottom sheet for print confirmation
- 🔵 **Bluetooth Printing** - Direct printing to Bluetooth thermal printers
- ⚡ **Fast & Lightweight** - Pure HTML, CSS, and JavaScript

## Requirements

### Browser Support
- **Chrome/Chromium** (Android 6.0+)
- **Microsoft Edge** (Android)
- **Samsung Internet** (recent versions)

> **Note:** Web Bluetooth API is not supported on iOS Safari or desktop browsers by default.

### Printer Compatibility
- Bluetooth thermal printers with **ESC/POS** protocol
- Common brands: Epson, Star Micronics, Bixolon, etc.
- The printer must be discoverable and support standard Bluetooth services

## Usage

1. **Open the App**
   - Load `index.html` in a supported mobile browser
   - Ensure Bluetooth is enabled on your device

2. **Select a Logo**
   - Tap on either the Avolta or Hermes logo
   - The selected logo will show a blue border
   - A bottom sheet will appear with print options

3. **Print**
   - Tap "Print" in the bottom sheet
   - Grant Bluetooth permissions when prompted
   - Select your printer from the device list
   - The logo will be printed on your thermal printer

4. **Cancel**
   - Tap "Cancel" or tap outside the bottom sheet to close
   - Tap the overlay to cancel selection

## File Structure

```
printer-demo/
├── index.html          # Main HTML structure
├── style.css           # Responsive CSS styling
├── script.js           # JavaScript functionality
├── avolta_logo_color.svg    # Avolta logo
├── hermes-logo.svg          # Hermes logo
└── README.md           # This file
```

## Technical Details

### Bluetooth Implementation
- Uses **Web Bluetooth API** for device connection
- Implements **ESC/POS** commands for thermal printing
- Converts SVG logos to monochrome bitmaps
- Supports standard thermal printer width (384 pixels)

### Image Processing
- SVG logos are rendered on HTML5 Canvas
- Converted to grayscale and then monochrome
- Formatted as ESC/POS bitmap data
- Automatically scaled to fit printer width

## Troubleshooting

### "Bluetooth not supported"
- Use Chrome or Edge on Android
- Ensure your device supports Bluetooth LE
- Update your browser to the latest version

### "No printer found"
- Make sure your printer is powered on
- Put the printer in pairing/discoverable mode
- Check if the printer supports the required Bluetooth services
- Try moving closer to the printer

### "Print failed"
- Verify the printer is ESC/POS compatible
- Check printer paper and status
- Ensure stable Bluetooth connection
- Some printers may require specific service UUIDs

### Logo not displaying
- Ensure SVG files are in the same directory
- Check browser console for loading errors
- Verify SVG file integrity

## Customization

### Adding More Logos
1. Add new SVG files to the directory
2. Update `index.html` to include new logo boxes:
```html
<div class="logo-box" id="your-logo-box" data-logo="your-logo">
    <img src="your-logo.svg" alt="Your Logo" class="logo-image">
</div>
```

### Printer Settings
Modify the Bluetooth service UUIDs in `script.js` if your printer uses different services:
```javascript
// In connectToPrinter() method
filters: [
    { services: ['your-printer-service-uuid'] }
]
```

### Styling
Edit `style.css` to customize:
- Colors and branding
- Logo box sizes
- Button styles
- Mobile breakpoints

## Browser Permissions

The app requires these permissions:
- **Bluetooth** - To connect and communicate with printers
- **Storage** - For caching (if service worker is enabled)

## Security Notes

- The app only requests access to printer devices
- No data is stored or transmitted to external servers
- All processing happens locally in the browser
- Bluetooth connections are secure and encrypted

## Development

To modify or extend the app:

1. **Test locally**: Use a web server (not file://) for proper Bluetooth API access
2. **Debug**: Use Chrome DevTools for debugging Bluetooth connections
3. **Deploy**: Host on HTTPS for production use (required for Web Bluetooth)

## Support

For issues related to:
- **Specific printer models**: Check manufacturer documentation for ESC/POS support
- **Browser compatibility**: Verify Web Bluetooth API support
- **Connection problems**: Ensure proper Bluetooth pairing and proximity 