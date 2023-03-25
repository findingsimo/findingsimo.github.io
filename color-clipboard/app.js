const colorList = document.getElementById("colorList");
let colorValues = [];

function isHexColor(hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

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

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast("Value copied");
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

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

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        readClipboard();
    }
});
