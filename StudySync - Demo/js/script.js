const difficultySelect = document.getElementById("difficultySelect");
const viewingTopicsText = document.getElementById("viewingTopicsText");

// Event listener for difficulty selection
difficultySelect.addEventListener("change", function () {
  const selectedDifficulty = this.value;
  viewingTopicsText.textContent = `Viewing ${selectedDifficulty} difficulties.`;
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  viewingTopicsText.textContent = "Viewing All difficulties.";
});

// TOPICS
const subjectSelect = document.getElementById("subjectSelect");
const viewingSubjectsText = document.getElementById("viewingSubjectsText");

// Event listener for subject selection
subjectSelect.addEventListener("change", function () {
  const selectedSubject = this.value;
  viewingSubjectsText.textContent = `Viewing ${selectedSubject} Subjects.`;
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  if (viewingSubjectsText) {
    // Check if the element exists
    viewingSubjectsText.textContent = "Viewing All Subjects.";
  }
});

// WEATHER
const apiKey = "YOUR_API_KEY"; // Replace with OpenWeatherMap API key
const city = "Lagos";

fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
)
  .then((res) => res.json())
  .then((data) => {
    let condition = data.weather[0].main;
    let temp = Math.round(data.main.temp);
    let iconClass = "bi-cloud-sun";

    if (condition === "Clear") iconClass = "bi-sun text-warning";
    else if (condition === "Clouds") iconClass = "bi-cloud text-secondary";
    else if (condition === "Rain") iconClass = "bi-cloud-rain text-primary";
    else if (condition === "Thunderstorm")
      iconClass = "bi-lightning-fill text-dark";
    else if (condition === "Snow") iconClass = "bi-snow text-info";

    document.getElementById("weather-lagos").innerHTML = `
      <i class="bi ${iconClass} me-1"></i> ${city}, ${temp}°C
    `;
  })
  .catch((err) => {
    document.getElementById("weather-lagos").innerHTML = "🌍 Lagos (N/A)";
  });

let workTime = 25 * 60; // 25 mins
let shortBreak = 5 * 60; // 5 mins
let longBreak = 15 * 60; // 15 mins
let cycles = 0; // track completed work sessions

let timeLeft = workTime;
let timer;
let isRunning = false;
let onBreak = false;

const timeDisplay = document.getElementById("time");
const sessionLabel = document.getElementById("session-label");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Format seconds into mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Update display
function updateDisplay() {
  timeDisplay.textContent = formatTime(timeLeft);
}

// Start timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;

        if (!onBreak) {
          cycles++;
          if (cycles % 4 === 0) {
            timeLeft = longBreak;
            sessionLabel.textContent = "Long Break";
          } else {
            timeLeft = shortBreak;
            sessionLabel.textContent = "Short Break";
          }
          onBreak = true;
        } else {
          timeLeft = workTime;
          sessionLabel.textContent = "Work Session";
          onBreak = false;
        }

        updateDisplay();
        startTimer(); // auto-start next session
      }
    }, 1000);
  }
}

// Pause timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

// Reset timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  onBreak = false;
  timeLeft = workTime;
  cycles = 0;
  sessionLabel.textContent = "Work Session";
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initial display
updateDisplay();
