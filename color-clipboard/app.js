// Get the colorList element from the DOM
const colorList = document.getElementById("colorList");

// Initialize an array to store color values
let colorValues = [];

// Function to check if a given string is a valid hex color
function isHexColor(hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

// Function to request clipboard read permission
async function requestClipboardPermission() {
    try {
        const { state } = await navigator.permissions.query({ name: "clipboard-read" });
        if (state === "granted" || state === "prompt") {
            return true;
        }
    } catch (err) {
        console.error('Failed to request clipboard permission:', err);
    }
    return false;
}

// Function to read the clipboard content
async function readClipboard() {
    try {
        const hasPermission = await requestClipboardPermission();
        if (!hasPermission) {
            console.error('Clipboard permission not granted');
            return;
        }
        const text = await navigator.clipboard.readText();
        const lowerCaseColorValues = colorValues.map(color => color.toLowerCase());
        const lowerCaseText = text.toLowerCase();
        if (isHexColor(lowerCaseText) && !lowerCaseColorValues.includes(lowerCaseText)) {
            if (colorValues.length >= 5) {
                colorValues.shift(); // Remove the first item
            }
            colorValues.push(lowerCaseText); // Add the new color value to the end
            updateColorList();
        }
    } catch (err) {
        console.error('Failed to read clipboard:', err);
    }
}

// Function to copy text to the clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast("Value copied");
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

// Function to show a toast notification with a given message
function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.classList.add("toast");
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 2000);
}

// Function to update the color list displayed in the app
function updateColorList() {
    colorList.innerHTML = "";
    colorValues.forEach(color => {
        const li = document.createElement("li");
        const colorPreview = document.createElement("div");
        colorPreview.classList.add("color-preview");
        colorPreview.style.backgroundColor = color;
        li.appendChild(colorPreview);
        li.appendChild(document.createTextNode(color));
        li.addEventListener("click", () => {
            copyToClipboard(color);
        });
        colorList.appendChild(li);
    });
}

// Event listener for visibility change
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        readClipboard();
    }
});

// Function to apply dark mode based on the system theme setting
function applyDarkMode() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (prefersDarkScheme.matches) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

// Call the applyDarkMode function on page load
applyDarkMode();

// Update the theme when the system theme setting changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyDarkMode);
