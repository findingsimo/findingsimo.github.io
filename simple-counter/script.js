let counter = document.getElementById('counter');
let resetButton = document.getElementById('resetButton');
let pressTimer;

function startPress() {
    counter.style.backgroundColor = 'red';
    pressTimer = setTimeout(incrementCounter, 500);
}

function stopPress() {
    clearTimeout(pressTimer);
    counter.style.backgroundColor = 'blue';
}

function incrementCounter() {
    let currentCount = parseInt(counter.textContent);
    counter.textContent = currentCount + 1;
}

resetButton.addEventListener('click', function() {
    counter.textContent = 0;
});
