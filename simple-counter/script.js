let counter = document.getElementById('counter');
let resetButton = document.getElementById('resetButton');
let pressTimer;

function loadCount() {
  let storedCount = localStorage.getItem('count');
  if (storedCount === null) {
    counter.textContent = 0;
  } else {
    counter.textContent = storedCount;
  }
}

function getColorSchemeStyles() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return {
      backgroundColor: '#DBDBDB',
      backgroundColorReleased: '#E5E5E5',
    };
  } else {
    return {
      backgroundColor: '#3b3b3b',
      backgroundColorReleased: '#2D2D2D',
    };
  }
}

function vibrateDevice(duration) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

function startPress() {
  const styles = getColorSchemeStyles();
  counter.style.backgroundColor = styles.backgroundColor;
  counter.style.transform = 'scale(1.25)';
  counter.style.transition = 'background-color 0.3s ease-in 0.2s, transform 0.2s ease-in';
  pressTimer = setTimeout(incrementCounter, 500);
}

function stopPress() {
  const styles = getColorSchemeStyles();
  clearTimeout(pressTimer);
  counter.style.backgroundColor = styles.backgroundColorReleased;
  counter.style.transform = 'scale(1)';
  counter.style.transition = 'background-color 0.05s ease-in, transform 0.05s ease-in';
}

function incrementCounter() {
  let currentCount = parseInt(counter.textContent);
  let newCount = currentCount + 1;
  counter.textContent = newCount;
  localStorage.setItem('count', newCount); // Store the updated count in localStorage

  vibrateDevice(50); // Vibrate the device for 50 milliseconds
}


resetButton.addEventListener('click', function () {
  counter.textContent = 0;
  localStorage.setItem('count', 0); // Reset the count in localStorage
});

function setActiveState(element, isActive) {
  const colorScheme = getColorSchemeStyles();

  if (isActive) {
    element.style.backgroundColor = colorScheme.backgroundColor;
  } else {
    element.style.backgroundColor = colorScheme.backgroundColorReleased;
  }
}

resetButton.addEventListener('touchstart', function () {
  setActiveState(resetButton, true);
});

resetButton.addEventListener('touchend', function () {
  setActiveState(resetButton, false);
});

resetButton.addEventListener('mousedown', function () {
  setActiveState(resetButton, true);
});

resetButton.addEventListener('mouseup', function () {
  setActiveState(resetButton, false);
});

resetButton.addEventListener('mouseleave', function () {
  setActiveState(resetButton, false);
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  }
}

function setupColorSchemeListener() {
  if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addListener(() => {
      // Update styles when the color scheme changes
      stopPress(); // Reset styles based on the new color scheme
      setActiveState(resetButton, false); // Update the reset button's color scheme
    });
  }
}

loadCount(); // Load the count when the page is loaded
setupColorSchemeListener(); // Set up the listener for color scheme changes
registerServiceWorker(); // Register the service worker
