/* =============================================
   THE FASTEST PIT STOP FOR LOVE — Game Logic
   ============================================= */

// ── State ────────────────────────────────────
let gameState = {
    currentScreen: 'intro',
    level1: { tiresPlaced: 0, startTime: null, timerInterval: null, elapsed: 0 },
    level2: { fuel: 0, pumps: 0, startTime: null, bpm: 60, adrenaline: 0 },
    level3: { selectedDest: null, lightsSequenceDone: false },
    totalStartTime: null,
    soundOn: true
};

// ── Screen navigation ────────────────────────
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + id).classList.add('active');
    gameState.currentScreen = id;
}

function startGame() {
    gameState.totalStartTime = Date.now();
    showScreen('level1');
}

function restartGame() {
    // Reset all state
    gameState.level1 = { tiresPlaced: 0, startTime: null, timerInterval: null, elapsed: 0 };
    gameState.level2 = { fuel: 0, pumps: 0, startTime: null, bpm: 60, adrenaline: 0 };
    gameState.level3 = { selectedDest: null, lightsSequenceDone: false };
    // Reset UI
    resetLevel1UI();
    resetLevel2UI();
    resetLevel3UI();
    showScreen('intro');
}

// ── Utilities ────────────────────────────────
function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    const centis = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
    return `${mins}:${secs}:${centis}`;
}

function formatRaceTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    const centis = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
    return `00:${mins}:${secs}.${centis}`;
}

function toggleSound() {
    gameState.soundOn = !gameState.soundOn;
    const icon = document.querySelector('#btn-l1-sound .material-icons');
    if (icon) icon.textContent = gameState.soundOn ? 'volume_up' : 'volume_off';
}

// =============================================
// LEVEL 1: THE TIRE SWAP
// =============================================
function startLevel1() {
    document.getElementById('l1-overlay').classList.remove('active');
    gameState.level1.startTime = Date.now();
    gameState.level1.timerInterval = setInterval(updateL1Timer, 50);
    initDragAndDrop();
}

function updateL1Timer() {
    const elapsed = Date.now() - gameState.level1.startTime;
    gameState.level1.elapsed = elapsed;
    document.getElementById('l1-timer').textContent = formatTime(elapsed);
}

function resetLevel1() {
    clearInterval(gameState.level1.timerInterval);
    gameState.level1 = { tiresPlaced: 0, startTime: null, timerInterval: null, elapsed: 0 };
    resetLevel1UI();
    document.getElementById('l1-overlay').classList.add('active');
}

function resetLevel1UI() {
    document.getElementById('l1-timer').textContent = '00:00:00';
    document.getElementById('l1-tire-count').textContent = '0 / 4 Tires';
    document.querySelectorAll('.tire-item').forEach(t => {
        t.classList.remove('placed');
        t.draggable = true;
    });
    document.querySelectorAll('.drop-zone').forEach(dz => {
        dz.classList.remove('filled', 'drag-over');
    });
    document.getElementById('l1-overlay').classList.add('active');
}

function initDragAndDrop() {
    const tires = document.querySelectorAll('.tire-item');
    const dropZones = document.querySelectorAll('.drop-zone');

    tires.forEach(tire => {
        tire.addEventListener('dragstart', handleDragStart);
        tire.addEventListener('dragend', handleDragEnd);
        // Touch support
        tire.addEventListener('touchstart', handleTouchStart, { passive: false });
        tire.addEventListener('touchmove', handleTouchMove, { passive: false });
        tire.addEventListener('touchend', handleTouchEnd);
    });

    dropZones.forEach(dz => {
        dz.addEventListener('dragover', handleDragOver);
        dz.addEventListener('dragleave', handleDragLeave);
        dz.addEventListener('drop', handleDrop);
    });
}

let draggedTire = null;

function handleDragStart(e) {
    if (this.classList.contains('placed')) return;
    draggedTire = this;
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.id);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    document.querySelectorAll('.drop-zone').forEach(dz => dz.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault();
    if (!this.classList.contains('filled')) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (this.classList.contains('filled') || !draggedTire) return;

    placeTire(draggedTire, this);
}

// Touch support
let touchClone = null;
let touchTire = null;

function handleTouchStart(e) {
    if (this.classList.contains('placed')) return;
    e.preventDefault();
    touchTire = this;
    const touch = e.touches[0];

    touchClone = this.querySelector('.tire-visual').cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.zIndex = '9999';
    touchClone.style.pointerEvents = 'none';
    touchClone.style.opacity = '0.8';
    touchClone.style.left = (touch.clientX - 36) + 'px';
    touchClone.style.top = (touch.clientY - 36) + 'px';
    document.body.appendChild(touchClone);
    this.style.opacity = '0.4';
}

function handleTouchMove(e) {
    if (!touchClone) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchClone.style.left = (touch.clientX - 36) + 'px';
    touchClone.style.top = (touch.clientY - 36) + 'px';

    // Highlight drop zone under finger
    document.querySelectorAll('.drop-zone').forEach(dz => {
        const rect = dz.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            if (!dz.classList.contains('filled')) dz.classList.add('drag-over');
        } else {
            dz.classList.remove('drag-over');
        }
    });
}

function handleTouchEnd(e) {
    if (!touchClone || !touchTire) return;
    const touch = e.changedTouches[0];

    document.querySelectorAll('.drop-zone').forEach(dz => {
        dz.classList.remove('drag-over');
        const rect = dz.getBoundingClientRect();
        if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
            touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
            if (!dz.classList.contains('filled')) {
                placeTire(touchTire, dz);
            }
        }
    });

    if (touchTire) touchTire.style.opacity = '1';
    if (touchClone) touchClone.remove();
    touchClone = null;
    touchTire = null;
}

function placeTire(tire, zone) {
    zone.classList.add('filled');
    tire.classList.add('placed');
    tire.draggable = false;

    gameState.level1.tiresPlaced++;
    document.getElementById('l1-tire-count').textContent =
        `${gameState.level1.tiresPlaced} / 4 Tires`;

    // Animate
    zone.querySelector('.drop-zone-ring').style.transform = 'scale(1.2)';
    setTimeout(() => {
        zone.querySelector('.drop-zone-ring').style.transform = 'scale(1)';
    }, 200);

    // Check completion
    if (gameState.level1.tiresPlaced >= 4) {
        clearInterval(gameState.level1.timerInterval);
        setTimeout(() => {
            showScreen('level2');
        }, 800);
    }
}

// =============================================
// LEVEL 2: FUELING WITH LOVE
// =============================================
function startLevel2() {
    document.getElementById('l2-overlay').classList.remove('active');
    gameState.level2.startTime = Date.now();
    gameState.level2.fuel = 0;
    gameState.level2.pumps = 0;
}

function resetLevel2UI() {
    gameState.level2 = { fuel: 0, pumps: 0, startTime: null, bpm: 60, adrenaline: 0 };
    updateGauge(0);
    document.getElementById('l2-bpm').textContent = '60';
    document.getElementById('l2-adrenaline').textContent = '0';
    document.getElementById('l2-lap').textContent = '0';
    document.getElementById('l2-lead').textContent = '0.000s';
    document.getElementById('l2-flowrate').textContent = '0.0 LOVE-TERS/SEC';
    document.getElementById('gauge-percent').textContent = '0% Charged';
    document.getElementById('l2-next-btn').classList.add('hidden');
    document.getElementById('l2-overlay').classList.add('active');

    const carImg = document.querySelector('.l2-car-img');
    if (carImg) { carImg.style.opacity = '0.35'; carImg.style.filter = 'brightness(0.5) contrast(1.25)'; }
    const carGlow = document.querySelector('.l2-car-glow');
    if (carGlow) carGlow.style.opacity = '0';
}

function pumpFuel() {
    if (gameState.level2.fuel >= 100) return;

    gameState.level2.pumps++;
    const increment = 2 + Math.random() * 1.5;
    gameState.level2.fuel = Math.min(100, gameState.level2.fuel + increment);
    const fuel = gameState.level2.fuel;

    // Update gauge
    updateGauge(fuel);

    // Update telemetry
    const bpm = Math.floor(60 + (fuel / 100) * 120);
    gameState.level2.bpm = bpm;
    document.getElementById('l2-bpm').textContent = bpm;

    const adr = Math.floor(fuel);
    document.getElementById('l2-adrenaline').textContent = adr;

    const lap = Math.floor(fuel * 0.92);
    document.getElementById('l2-lap').textContent = lap;

    const elapsed = (Date.now() - gameState.level2.startTime) / 1000;
    const lead = (elapsed * 0.001 + fuel * 0.0001).toFixed(3);
    document.getElementById('l2-lead').textContent = lead + 's';

    const flowRate = (gameState.level2.pumps / Math.max(elapsed, 1) * 2).toFixed(1);
    document.getElementById('l2-flowrate').textContent = flowRate + ' LOVE-TERS/SEC';

    document.getElementById('gauge-percent').textContent = Math.floor(fuel) + '% Charged';

    // Car visual changes
    const carImg = document.querySelector('.l2-car-img');
    const carGlow = document.querySelector('.l2-car-glow');
    if (carImg) {
        const brightness = 0.5 + (fuel / 100) * 0.5;
        carImg.style.opacity = 0.35 + (fuel / 100) * 0.55;
        carImg.style.filter = `brightness(${brightness}) contrast(1.25)`;
    }
    if (carGlow) carGlow.style.opacity = (fuel / 100) * 0.4;

    // Button animation
    const btn = document.getElementById('btn-pump');
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => btn.style.transform = 'scale(1)', 100);

    // Spawn floating heart
    spawnPumpHeart();

    // Check completion
    if (fuel >= 100) {
        document.getElementById('l2-next-btn').classList.remove('hidden');
        document.querySelector('[data-status]')?.setAttribute('data-status', 'COMPLETE');
    }
}

function updateGauge(pct) {
    const gaugePath = document.getElementById('gauge-fill');
    // The arc total length is ~283 for our SVG path
    const totalLength = 283;
    const offset = totalLength - (totalLength * pct / 100);
    gaugePath.setAttribute('stroke-dashoffset', offset);
}

function spawnPumpHeart() {
    const area = document.querySelector('.pump-area');
    const heart = document.createElement('span');
    heart.className = 'material-icons';
    heart.textContent = 'favorite';
    heart.style.cssText = `
        position: absolute; color: #f98806;
        font-size: ${12 + Math.random() * 16}px;
        left: ${30 + Math.random() * 40}px;
        top: 0; opacity: 0.7; pointer-events: none;
        animation: pump-heart-rise 1s ease-out forwards;
    `;
    area.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

// Add pump heart animation dynamically
const pumpStyle = document.createElement('style');
pumpStyle.textContent = `
    @keyframes pump-heart-rise {
        0% { transform: translateY(0) scale(1); opacity: 0.8; }
        100% { transform: translateY(-80px) scale(0.3); opacity: 0; }
    }
`;
document.head.appendChild(pumpStyle);

function goToLevel3() {
    showScreen('level3');
}

// =============================================
// LEVEL 3: CHOOSE YOUR DESTINATION
// =============================================
function startLevel3() {
    document.getElementById('l3-overlay').classList.remove('active');
    // Update LCD clock
    updateLCDClock();
    setInterval(updateLCDClock, 1000);
}

function resetLevel3UI() {
    gameState.level3 = { selectedDest: null, lightsSequenceDone: false };
    document.querySelectorAll('.dest-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.light').forEach(l => {
        l.classList.remove('on', 'go');
    });
    document.querySelector('.l3-progress-fill').style.width = '60%';
    document.getElementById('l3-overlay').classList.add('active');
}

function updateLCDClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const el = document.getElementById('lcd-time');
    if (el) el.textContent = `${h}:${m}:${s}`;
}

function selectDestination(dest, el) {
    if (gameState.level3.lightsSequenceDone) return;

    gameState.level3.selectedDest = dest;

    // Highlight selected
    document.querySelectorAll('.dest-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');

    // Update progress
    document.querySelector('.l3-progress-fill').style.width = '100%';

    // Start lights sequence
    startLightsSequence();
}

function startLightsSequence() {
    gameState.level3.lightsSequenceDone = true;
    const lights = document.querySelectorAll('.light');

    // Turn on lights one by one
    lights.forEach((light, i) => {
        setTimeout(() => {
            light.classList.add('on');
        }, (i + 1) * 600);
    });

    // Lights out (all go green)
    setTimeout(() => {
        lights.forEach(l => {
            l.classList.remove('on');
            l.classList.add('go');
        });

        // Transition to podium
        setTimeout(() => {
            const totalTime = Date.now() - (gameState.totalStartTime || Date.now());
            document.getElementById('final-time').textContent = formatRaceTime(totalTime);
            showScreen('podium');
            launchConfetti();
        }, 1200);
    }, 600 * 6);
}

// =============================================
// PODIUM / CONFETTI
// =============================================
function launchConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#f98806', '#a855f7', '#ef4444', '#f472b6', '#22c55e', '#facc15', '#ffffff'];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (6 + Math.random() * 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (2 + Math.random() * 3) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(piece);
    }

    // Clear confetti after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 7000);
}

function sharePodium() {
    const text = `🏎️💕 I just completed "The Fastest Pit Stop for Love"! My race time: ${document.getElementById('final-time').textContent}. Happy Valentine's Day! #McLarenLove #ValentinesDay`;

    if (navigator.share) {
        navigator.share({ title: 'The Fastest Pit Stop for Love', text: text })
            .catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('btn-share');
            const original = btn.innerHTML;
            btn.innerHTML = '<span class="material-icons">check</span> Copied!';
            setTimeout(() => btn.innerHTML = original, 2000);
        });
    }
}

// ── Initialize ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Pre-warm screens
    showScreen('intro');
});
