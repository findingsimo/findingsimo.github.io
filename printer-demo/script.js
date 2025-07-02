class LogoPrinter {
    constructor() {
        this.selectedLogo = null;
        this.bluetoothDevice = null;
        this.bluetoothCharacteristic = null;
        this.isConnected = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkBluetoothSupport();
    }

    bindEvents() {
        // Logo selection
        const logoBoxes = document.querySelectorAll('.logo-box');
        logoBoxes.forEach(box => {
            box.addEventListener('click', () => this.selectLogo(box));
        });

        // Bottom sheet controls
        const cancelBtn = document.getElementById('cancel-btn');
        const printBtn = document.getElementById('print-btn');
        const overlay = document.getElementById('overlay');

        cancelBtn.addEventListener('click', () => this.hideBottomSheet());
        printBtn.addEventListener('click', () => this.handlePrint());
        overlay.addEventListener('click', () => this.hideBottomSheet());

        // Close bottom sheet on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideBottomSheet();
            }
        });
    }

    checkBluetoothSupport() {
        if (!navigator.bluetooth) {
            console.warn('Web Bluetooth API not supported in this browser');
            this.showError('Bluetooth printing is not supported in this browser. Please use Chrome or Edge on Android.');
        }
    }

    selectLogo(selectedBox) {
        // Remove selection from all boxes
        const logoBoxes = document.querySelectorAll('.logo-box');
        logoBoxes.forEach(box => box.classList.remove('selected'));

        // Add selection to clicked box
        selectedBox.classList.add('selected');
        this.selectedLogo = selectedBox.dataset.logo;

        // Show bottom sheet
        this.showBottomSheet();
    }

    showBottomSheet() {
        const bottomSheet = document.getElementById('bottom-sheet');
        const overlay = document.getElementById('overlay');
        
        bottomSheet.classList.add('active');
        overlay.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    hideBottomSheet() {
        const bottomSheet = document.getElementById('bottom-sheet');
        const overlay = document.getElementById('overlay');
        
        bottomSheet.classList.remove('active');
        overlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clear selection
        const logoBoxes = document.querySelectorAll('.logo-box');
        logoBoxes.forEach(box => box.classList.remove('selected'));
        this.selectedLogo = null;
    }

    async handlePrint() {
        if (!this.selectedLogo) {
            this.showError('Please select a logo first');
            return;
        }

        const printBtn = document.getElementById('print-btn');
        
        try {
            printBtn.classList.add('loading');
            printBtn.disabled = true;

            if (!this.isConnected) {
                await this.connectToPrinter();
            }

            await this.printLogo();
            this.showSuccess('Logo printed successfully!');
            this.hideBottomSheet();

        } catch (error) {
            console.error('Print error:', error);
            this.showError(`Print failed: ${error.message}`);
        } finally {
            printBtn.classList.remove('loading');
            printBtn.disabled = false;
        }
    }

    async connectToPrinter() {
        try {
            console.log('Requesting Bluetooth Device...');
            
            // First try with common thermal printer services
            try {
                this.bluetoothDevice = await navigator.bluetooth.requestDevice({
                    filters: [
                        { services: ['00001101-0000-1000-8000-00805f9b34fb'] }, // Serial Port Profile (most common)
                    ],
                    optionalServices: [
                        '00001101-0000-1000-8000-00805f9b34fb', // Serial Port Profile
                        '000018f0-0000-1000-8000-00805f9b34fb', // Generic printer service
                        '00001800-0000-1000-8000-00805f9b34fb', // Generic Access
                        '00001801-0000-1000-8000-00805f9b34fb', // Generic Attribute
                    ]
                });
            } catch (firstError) {
                console.log('First attempt failed, trying with broader filter...');
                
                // Fallback: try with name/namePrefix filter for common printer brands
                this.bluetoothDevice = await navigator.bluetooth.requestDevice({
                    filters: [
                        { namePrefix: 'POS-' },
                        { namePrefix: 'TM-' },
                        { namePrefix: 'TSP' },
                        { namePrefix: 'SRP' },
                        { namePrefix: 'HOP' },
                        { namePrefix: 'BT-' },
                        { namePrefix: 'PT-' },
                        { namePrefix: 'Printer' },
                        { services: ['00001101-0000-1000-8000-00805f9b34fb'] }
                    ],
                    optionalServices: [
                        '00001101-0000-1000-8000-00805f9b34fb',
                        '000018f0-0000-1000-8000-00805f9b34fb',
                        '00001800-0000-1000-8000-00805f9b34fb',
                        '00001801-0000-1000-8000-00805f9b34fb',
                    ]
                });
            }

            console.log('Selected device:', this.bluetoothDevice.name);
            console.log('Connecting to GATT Server...');
            const server = await this.bluetoothDevice.gatt.connect();
            
            console.log('Getting available services...');
            const services = await server.getPrimaryServices();
            console.log('Available services:', services.map(s => s.uuid));
            
            // Try to find a writable characteristic in available services
            let foundCharacteristic = null;
            
            for (const service of services) {
                try {
                    console.log(`Checking service: ${service.uuid}`);
                    const characteristics = await service.getCharacteristics();
                    
                    for (const char of characteristics) {
                        console.log(`  Characteristic: ${char.uuid}, properties:`, char.properties);
                        
                        // Look for a characteristic that supports writing
                        if (char.properties.write || char.properties.writeWithoutResponse) {
                            foundCharacteristic = char;
                            console.log('Found writable characteristic:', char.uuid);
                            break;
                        }
                    }
                    
                    if (foundCharacteristic) break;
                } catch (serviceError) {
                    console.log(`Error accessing service ${service.uuid}:`, serviceError);
                }
            }
            
            if (!foundCharacteristic) {
                throw new Error('No writable characteristic found. This device may not support printing.');
            }
            
            this.bluetoothCharacteristic = foundCharacteristic;
            this.isConnected = true;
            console.log('Bluetooth printer connected successfully');

        } catch (error) {
            console.error('Connection error details:', error);
            
            if (error.name === 'NotFoundError') {
                throw new Error('No Bluetooth printer found. Make sure your printer is powered on, discoverable, and nearby.');
            } else if (error.name === 'NotAllowedError') {
                throw new Error('Bluetooth access denied. Please allow Bluetooth access and try again.');
            } else if (error.name === 'NetworkError') {
                throw new Error('Connection failed. Make sure the printer is not connected to another device.');
            } else {
                throw new Error(`Connection failed: ${error.message}`);
            }
        }
    }

    async printLogo() {
        try {
            // Get the selected logo image
            const logoImg = document.querySelector(`#${this.selectedLogo}-box img`);
            
            // Convert logo to printable format
            const printData = await this.convertImageToPrintData(logoImg);
            
            // Send print commands (ESC/POS format)
            const commands = [
                new Uint8Array([0x1B, 0x40]), // Initialize printer
                new Uint8Array([0x1B, 0x61, 0x01]), // Center alignment
                printData,
                new Uint8Array([0x1B, 0x64, 0x03]), // Feed 3 lines
                new Uint8Array([0x1B, 0x69]), // Cut paper (if supported)
            ];

            for (const command of commands) {
                await this.bluetoothCharacteristic.writeValue(command);
                await this.delay(100); // Small delay between commands
            }

        } catch (error) {
            throw new Error(`Printing failed: ${error.message}`);
        }
    }

    async convertImageToPrintData(imgElement) {
        return new Promise((resolve, reject) => {
            try {
                // Create canvas to process the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size (thermal printer typical width: 384 pixels)
                const maxWidth = 384;
                const aspectRatio = imgElement.naturalHeight / imgElement.naturalWidth;
                canvas.width = Math.min(maxWidth, imgElement.naturalWidth);
                canvas.height = canvas.width * aspectRatio;
                
                // Draw image on canvas
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
                
                // Convert to monochrome bitmap
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const bitmap = this.convertToMonochrome(imageData);
                
                // Convert to ESC/POS bitmap format
                const printData = this.formatESCPOSBitmap(bitmap, canvas.width, canvas.height);
                
                resolve(printData);
            } catch (error) {
                reject(error);
            }
        });
    }

    convertToMonochrome(imageData) {
        const data = imageData.data;
        const bitmap = [];
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Convert to grayscale and then to monochrome
            const gray = (r * 0.299 + g * 0.587 + b * 0.114);
            bitmap.push(gray < 128 ? 1 : 0); // Black if below threshold
        }
        
        return bitmap;
    }

    formatESCPOSBitmap(bitmap, width, height) {
        // ESC/POS bitmap command format
        const commands = [];
        
        // ESC * m nL nH d1...dk (bit image mode)
        commands.push(0x1B, 0x2A, 0x00); // ESC * 0 (8-dot single-density)
        commands.push(width & 0xFF, (width >> 8) & 0xFF); // Width (little endian)
        
        // Convert bitmap data
        for (let y = 0; y < height; y += 8) {
            for (let x = 0; x < width; x++) {
                let byte = 0;
                for (let bit = 0; bit < 8; bit++) {
                    if (y + bit < height) {
                        const pixelIndex = (y + bit) * width + x;
                        if (bitmap[pixelIndex]) {
                            byte |= (1 << (7 - bit));
                        }
                    }
                }
                commands.push(byte);
            }
        }
        
        return new Uint8Array(commands);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showError(message) {
        // Simple error display - you could enhance this with a proper modal
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        // Simple success display - you could enhance this with a proper modal
        alert(message);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LogoPrinter();
});

// Handle logo image loading
document.addEventListener('DOMContentLoaded', () => {
    const logoImages = document.querySelectorAll('.logo-image');
    
    logoImages.forEach(img => {
        img.addEventListener('error', () => {
            console.error(`Failed to load image: ${img.src}`);
            img.parentElement.innerHTML = '<div style="color: #999; text-align: center;">Logo not found</div>';
        });
    });
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 