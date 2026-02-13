// app.js - Main application logic

const App = (() => {
  const STEP_GOAL = 10000;
  const TOTAL_HEARTS = 30;
  const STORAGE_KEY = 'thinzars-day-data';

  // Motivational messages for fail days
  const motivationalMessages = [
    "Every step counts, even the small ones. You'll get there!",
    "Rest days make strong days. Tomorrow you'll crush it!",
    "Progress isn't always linear. Keep going, Thinzar!",
    "The only bad workout is the one that didn't happen... but tomorrow's will!",
    "You're building something amazing, one day at a time.",
    "Even the longest journey starts with a single step. More tomorrow!",
    "Your body needed this rest. Your heart collection can wait one day!",
    "Champions take rest days too. See you tomorrow!",
    "Not every day will be perfect, but every day is a chance to try.",
    "You're stronger than you think. Tomorrow is your day!",
    "The sun will rise and you'll try again. That's what matters.",
    "A little patience goes a long way. Your hearts are waiting!",
  ];

  // State
  let data = loadData();
  let pendingMakeupDone = false; // tracks if we just did a makeup entry

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return { entries: [], heartsCollected: 0, challengeComplete: false };
  }

  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getToday() {
    return new Date().toISOString().split('T')[0];
  }

  function getYesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  function hasEntryFor(date) {
    return data.entries.some(e => e.date === date);
  }

  function canMakeupYesterday() {
    if (data.entries.length === 0) return false; // No makeup on first day
    const yesterday = getYesterday();
    return !hasEntryFor(yesterday);
  }

  function canEnterToday() {
    return !hasEntryFor(getToday());
  }

  // Determine current input state
  function getInputState() {
    const makeup = canMakeupYesterday();
    const today = canEnterToday();

    if (makeup && today && !pendingMakeupDone) return 'makeup';
    if (today) return 'today';
    return 'done';
  }

  function processEntry(steps, dateOverride) {
    const date = dateOverride || getToday();
    const success = steps >= STEP_GOAL;
    let heartNumber = null;

    if (success) {
      data.heartsCollected++;
      heartNumber = data.heartsCollected;
      if (data.heartsCollected >= TOTAL_HEARTS) {
        data.challengeComplete = true;
      }
    }

    data.entries.push({ date, steps, success, heartNumber });
    saveData();

    return { success, heartNumber, steps };
  }

  // ===== UI =====

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });
    const screen = document.getElementById(id);
    screen.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Pixel art sprites for progress track
  const GIRL_SPRITE = [
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [0,2,1,2,1,2,0],
    [0,0,2,2,2,0,0],
    [0,3,3,3,3,3,0],
    [0,3,3,3,3,3,0],
    [3,3,3,3,3,3,3],
    [0,0,2,0,2,0,0],
    [0,0,4,0,4,0,0],
  ];
  const GIRL_COLORS = { 1: '#4A1E2E', 2: '#FFDAB9', 3: '#E8536D', 4: '#7B2D4A' };
  const GOAL_HEART = [
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,0],
  ];

  function drawSprite(ctx, grid, colors, x, y, ps) {
    for (let r = 0; r < grid.length; r++)
      for (let c = 0; c < grid[r].length; c++)
        if (grid[r][c]) {
          ctx.fillStyle = colors[grid[r][c]] || colors;
          ctx.fillRect(x + c * ps, y + r * ps, ps, ps);
        }
  }

  function updateProgressTrack() {
    const canvas = document.getElementById('progress-canvas');
    const ctx = canvas.getContext('2d');
    const cw = 380, ch = 100;
    ctx.clearRect(0, 0, cw, ch);

    const progress = data.heartsCollected / TOTAL_HEARTS;
    const trackX1 = 25, trackX2 = 335, trackY = 78;
    const ps = 4; // pixel size for sprites
    const girlW = 7 * ps, girlH = 9 * ps;
    const heartW = 8 * ps;

    // Dashed track line
    ctx.strokeStyle = '#d4b0a8';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(trackX1, trackY);
    ctx.lineTo(trackX2 + heartW + 10, trackY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Milestone dots (every 5 hearts)
    for (let i = 0; i <= TOTAL_HEARTS; i += 5) {
      const mx = trackX1 + (i / TOTAL_HEARTS) * (trackX2 - trackX1);
      ctx.fillStyle = i <= data.heartsCollected ? '#E8536D' : '#d4b0a8';
      ctx.fillRect(mx - 2, trackY - 2, 4, 4);
    }

    // Girl position
    const girlX = trackX1 + progress * (trackX2 - trackX1 - girlW);
    drawSprite(ctx, GIRL_SPRITE, GIRL_COLORS, girlX, trackY - girlH, ps);

    // Goal heart at end
    const heartColors = { 1: data.challengeComplete ? '#E8536D' : '#d4b0a8' };
    drawSprite(ctx, GOAL_HEART, heartColors, trackX2 + 5, trackY - 6 * ps, ps);

    // Update label
    document.getElementById('progress-label').textContent =
      `${data.heartsCollected}/${TOTAL_HEARTS} hearts`;
  }

  function renderHeartsGallery(gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';

    const successEntries = data.entries.filter(e => e.success);
    for (const entry of successEntries) {
      const miniCanvas = document.createElement('canvas');
      miniCanvas.width = 150;
      miniCanvas.height = 200;
      Hearts.renderHeart(miniCanvas, entry.heartNumber);
      miniCanvas.addEventListener('click', () => {
        viewHeart(entry.heartNumber);
      });
      grid.appendChild(miniCanvas);
    }

    const remaining = TOTAL_HEARTS - data.heartsCollected;
    for (let i = 0; i < remaining; i++) {
      const placeholder = document.createElement('div');
      placeholder.className = 'heart-placeholder';
      placeholder.textContent = '?';
      grid.appendChild(placeholder);
    }
  }

  function setSongButton(song, showDetail) {
    const btn = document.getElementById('song-btn');
    const label = document.getElementById('song-btn-label');
    const detail = document.getElementById('song-btn-detail');
    btn.href = song.url;

    if (showDetail) {
      label.textContent = '';
      detail.classList.add('active');
      detail.innerHTML = `<span class="marquee-text">${song.artist} — ${song.title}</span>`;
    } else {
      label.textContent = 'Play Your Surprise Song';
      detail.classList.remove('active');
      detail.innerHTML = '';
    }
  }

  function viewHeart(heartNumber) {
    const canvas = document.getElementById('heart-canvas');
    Hearts.renderHeart(canvas, heartNumber);

    const song = Songs.getSong(heartNumber);
    setSongButton(song, true);
    document.getElementById('success-steps').textContent = '';
    document.querySelector('.success-title').textContent = `Heart #${heartNumber}`;

    // Show playlist button only for heart #30
    const playlistBtn = document.getElementById('playlist-btn');
    playlistBtn.classList.toggle('hidden', heartNumber !== TOTAL_HEARTS);

    showScreen('screen-success');
  }

  function showHomeScreen() {
    pendingMakeupDone = false;
    showScreen('screen-home');
    updateProgressTrack();
    renderHeartsGallery('hearts-grid');

    const inputState = getInputState();
    const makeupNotice = document.getElementById('makeup-notice');
    const todayNotice = document.getElementById('today-notice');
    const alreadyEntered = document.getElementById('already-entered');
    const inputSection = document.getElementById('input-section');
    const inputLabel = document.getElementById('input-label');

    makeupNotice.classList.add('hidden');
    todayNotice.classList.add('hidden');
    alreadyEntered.classList.add('hidden');

    if (data.challengeComplete) {
      inputSection.classList.add('hidden');
      alreadyEntered.classList.remove('hidden');
      document.querySelector('#already-entered p').textContent =
        "You've completed all 30 hearts! Tap any heart below to revisit.";
      return;
    }

    if (inputState === 'makeup') {
      makeupNotice.classList.remove('hidden');
      inputLabel.textContent = "Yesterday's steps:";
      inputSection.classList.remove('hidden');
    } else if (inputState === 'today') {
      inputLabel.textContent = "How many steps today?";
      inputSection.classList.remove('hidden');
    } else {
      inputSection.classList.add('hidden');
      alreadyEntered.classList.remove('hidden');
    }

    document.getElementById('steps-input').value = '';
  }

  // After a makeup entry result screen, return to home to enter today's steps
  function showHomeForToday() {
    pendingMakeupDone = true;
    showScreen('screen-home');
    updateProgressTrack();
    renderHeartsGallery('hearts-grid');

    const todayNotice = document.getElementById('today-notice');
    const makeupNotice = document.getElementById('makeup-notice');
    const alreadyEntered = document.getElementById('already-entered');
    const inputSection = document.getElementById('input-section');
    const inputLabel = document.getElementById('input-label');

    makeupNotice.classList.add('hidden');
    alreadyEntered.classList.add('hidden');

    if (canEnterToday()) {
      todayNotice.classList.remove('hidden');
      inputLabel.textContent = "How many steps today?";
      inputSection.classList.remove('hidden');
    } else {
      todayNotice.classList.add('hidden');
      inputSection.classList.add('hidden');
      alreadyEntered.classList.remove('hidden');
    }

    document.getElementById('steps-input').value = '';
  }

  function showSuccessScreen(result, isMakeup) {
    const canvas = document.getElementById('heart-canvas');

    if (result.heartNumber === TOTAL_HEARTS) {
      showCompletionScreen(result);
      return;
    }

    Hearts.renderHeart(canvas, result.heartNumber);

    const song = Songs.getSong(result.heartNumber);
    setSongButton(song, false);
    document.getElementById('success-steps').textContent =
      `${result.steps.toLocaleString()} steps — amazing!`;

    document.querySelector('.success-title').textContent =
      `Heart #${result.heartNumber} unlocked!`;

    // Hide playlist button (only shown when re-viewing heart #30)
    document.getElementById('playlist-btn').classList.add('hidden');

    // Wire back button based on whether today still needs entry
    const backBtn = document.getElementById('back-home-success');
    backBtn.onclick = isMakeup && canEnterToday() ? showHomeForToday : showHomeScreen;

    showScreen('screen-success');
  }

  function showFailScreen(result, isMakeup) {
    const canvas = document.getElementById('fail-canvas');
    const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    Hearts.renderFailCard(canvas, message);
    document.getElementById('fail-message').textContent = message;

    // Wire back button
    const backBtn = document.getElementById('back-home-fail');
    backBtn.onclick = isMakeup && canEnterToday() ? showHomeForToday : showHomeScreen;

    showScreen('screen-fail');
  }

  function showCompletionScreen() {
    const canvas = document.getElementById('complete-canvas');
    Hearts.renderHeart(canvas, 30);

    const song = Songs.getSong(30);
    document.getElementById('final-song-btn').href = song.url;
    document.getElementById('final-song-info').textContent = `${song.artist} — ${song.title}`;

    renderHeartsGallery('complete-hearts-grid');
    showScreen('screen-complete');

    launchConfetti();
  }

  function launchConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    const colors = ['#E8536D', '#F4845F', '#F7B267', '#C2185B', '#D4A843', '#FF6B6B'];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.animationDelay = Math.random() * 2 + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const size = (6 + Math.floor(Math.random() * 4) * 2) + 'px';
      piece.style.width = size;
      piece.style.height = size;
      container.appendChild(piece);
    }

    setTimeout(() => { container.innerHTML = ''; }, 5000);
  }

  // Share functionality
  async function shareCanvas(canvas) {
    try {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'thinzars-heart.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Thinzar's Day",
          text: "Check out my step challenge heart!",
          files: [file]
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Thinzar's Day",
          text: "Check out my step challenge heart!",
          url: window.location.href
        });
      } else {
        saveCanvas(canvas);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        saveCanvas(canvas);
      }
    }
  }

  function saveCanvas(canvas) {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'thinzars-heart.png';
    link.href = dataUrl;
    link.click();
  }

  // ===== EVENT LISTENERS =====

  function handleSubmit() {
    const input = document.getElementById('steps-input');
    const steps = parseInt(input.value, 10);

    if (isNaN(steps) || steps < 0) {
      input.focus();
      input.style.borderColor = '#E8536D';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }

    const inputState = getInputState();

    if (inputState === 'makeup') {
      // Process yesterday's entry
      const result = processEntry(steps, getYesterday());
      if (result.success) {
        showSuccessScreen(result, true);
      } else {
        showFailScreen(result, true);
      }
      return;
    }

    // Process today's entry
    pendingMakeupDone = false;
    const result = processEntry(steps, getToday());
    if (result.success) {
      showSuccessScreen(result, false);
    } else {
      showFailScreen(result, false);
    }
  }

  function init() {
    document.getElementById('submit-btn').addEventListener('click', handleSubmit);
    document.getElementById('steps-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });

    // Back buttons use .onclick (set dynamically in showSuccessScreen/showFailScreen)
    document.getElementById('back-home-success').onclick = showHomeScreen;
    document.getElementById('back-home-fail').onclick = showHomeScreen;

    // Share buttons
    document.getElementById('share-btn').addEventListener('click', () => {
      shareCanvas(document.getElementById('heart-canvas'));
    });
    document.getElementById('share-fail-btn').addEventListener('click', () => {
      shareCanvas(document.getElementById('fail-canvas'));
    });
    document.getElementById('share-complete-btn').addEventListener('click', () => {
      shareCanvas(document.getElementById('complete-canvas'));
    });

    // Save buttons
    document.getElementById('save-btn').addEventListener('click', () => {
      saveCanvas(document.getElementById('heart-canvas'));
    });
    document.getElementById('save-fail-btn').addEventListener('click', () => {
      saveCanvas(document.getElementById('fail-canvas'));
    });
    document.getElementById('save-complete-btn').addEventListener('click', () => {
      saveCanvas(document.getElementById('complete-canvas'));
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    // Wait for pixel font to load before showing (for canvas rendering)
    if (document.fonts && document.fonts.load) {
      document.fonts.load("16px 'Press Start 2P'").then(() => {
        showHomeScreen();
      }).catch(() => {
        showHomeScreen();
      });
    } else {
      showHomeScreen();
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return { showHomeScreen, data };
})();
