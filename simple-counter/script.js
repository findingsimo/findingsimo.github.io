let counter = document.getElementById('counter');
let resetButton = document.getElementById('resetButton');
let pressTimer;

// Load the count from localStorage or set it to 0 if it doesn't exist
function loadCount() {
    let storedCount = localStorage.getItem('count');
    if (storedCount === null) {
        counter.textContent = 0;
    } else {
        counter.textContent = storedCount;
    }
}

function startPress() {
    counter.style.backgroundColor = 'red';
    counter.style.transform = 'scale(1.25)';
    pressTimer = setTimeout(incrementCounter, 500);
}

function stopPress() {
    clearTimeout(pressTimer);
    counter.style.backgroundColor = 'blue';
    counter.style.transform = 'scale(1)';
}

function incrementCounter() {
    let currentCount = parseInt(counter.textContent);
    let newCount = currentCount + 1;
    counter.textContent = newCount;
    localStorage.setItem('count', newCount); // Store the updated count in localStorage
}

resetButton.addEventListener('click', function() {
    counter.textContent = 0;
    localStorage.setItem('count', 0); // Reset the count in localStorage
});

loadCount(); // Load the count when the page is loaded
