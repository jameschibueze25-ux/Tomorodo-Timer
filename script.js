const CIRCUMFERENCE = 753.98;

const modes = {
    focus: { time: 1500, label: 'Focus Time', bodyClass: '' },
    short: { time: 300,  label: 'Short Break', bodyClass: 'mode-short' },
    long:  { time: 900,  label: 'Long Break',  bodyClass: 'mode-long' },
};

let currentMode = 'focus';
let totalTime = modes.focus.time;
let timeLeft = totalTime;
let isRunning = false;
let timerInterval = null;
let currentSession = 1;

const timerEl       = document.getElementById('timer');
const modeLabelEl   = document.getElementById('mode-label');
const ringProgress  = document.getElementById('ring-progress');
const startPauseBtn = document.getElementById('start-pause');
const resetBtn      = document.getElementById('reset');
const skipBtn       = document.getElementById('skip');
const sessionDots   = document.querySelectorAll('.dot');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const progress = timeLeft / totalTime;
    ringProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
}

function updateSessionDots() {
    sessionDots.forEach((dot, i) => {
        dot.classList.remove('active', 'done');
        if (i + 1 < currentSession) dot.classList.add('done');
        if (i + 1 === currentSession) dot.classList.add('active');
    });
}

function setMode(mode) {
    if (isRunning) stopTimer();
    currentMode = mode;
    totalTime = modes[mode].time;
    timeLeft = totalTime;
    modeLabelEl.textContent = modes[mode].label;

    document.body.className = modes[mode].bodyClass;

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    startPauseBtn.textContent = 'Start';
    updateDisplay();
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startPauseBtn.textContent = 'Pause';
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                startPauseBtn.textContent = 'Start';
                handleTimerEnd();
            }
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startPauseBtn.textContent = 'Start';
}

function handleTimerEnd() {
    if (currentMode === 'focus') {
        if (currentSession < 4) {
            currentSession++;
        } else {
            currentSession = 1;
        }
        updateSessionDots();
        setMode('short');
    } else {
        setMode('focus');
    }
}

startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', () => {
    stopTimer();
    timeLeft = totalTime;
    updateDisplay();
});

skipBtn.addEventListener('click', () => {
    stopTimer();
    handleTimerEnd();
});

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
});


updateDisplay();
updateSessionDots();
