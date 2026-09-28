// Verification Data
const passcodes = [
  { mm: "09", dd: "09", yy: "10" }, // Step 1
  { mm: "12", dd: "08", yy: "25" }, // Step 2
  { mm: "02", dd: "15", yy: "26" }  // Step 3
];

const passwords = [
  "baby", // Step 4
  "blue", // Step 5
  "eli"   // Step 6
];

const targetWords = ["I", "LOVE", "YOU", "SO", "MUCH", "BABY"];

let currentStep = 1;

document.addEventListener("DOMContentLoaded", () => {
  setupDateInputs(1);
  setupDateInputs(2);
  setupDateInputs(3);
  
  setupTextInput(4);
  setupTextInput(5);
  setupTextInput(6);
});

// Auto-jump logic for MM -> DD -> YY
function setupDateInputs(step) {
  const mm = document.getElementById(`p${step}-mm`);
  const dd = document.getElementById(`p${step}-dd`);
  const yy = document.getElementById(`p${step}-yy`);

  const handleInput = (current, next) => {
    current.addEventListener("input", () => {
      if (current.value.length >= 2 && next) {
        next.focus();
      }
    });
  };

  handleInput(mm, dd);
  handleInput(dd, yy);

  // Keyboard Enter listener for each field
  const handleEnter = (e, fieldType) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (fieldType === "mm") dd.focus();
      else if (fieldType === "dd") yy.focus();
      else if (fieldType === "yy") checkDatePass(step);
    }
  };

  mm.addEventListener("keydown", (e) => handleEnter(e, "mm"));
  dd.addEventListener("keydown", (e) => handleEnter(e, "dd"));
  yy.addEventListener("keydown", (e) => handleEnter(e, "yy"));
}

function setupTextInput(step) {
  const input = document.getElementById(`p${step}-text`);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      checkTextPass(step);
    }
  });
}

function checkDatePass(step) {
  const mm = document.getElementById(`p${step}-mm`).value.trim();
  const dd = document.getElementById(`p${step}-dd`).value.trim();
  const yy = document.getElementById(`p${step}-yy`).value.trim();
  const err = document.getElementById(`err-${step}`);

  const target = passcodes[step - 1];

  if (mm === target.mm && dd === target.dd && yy === target.yy) {
    err.style.display = "none";
    handleStepSuccess(step);
  } else {
    err.style.display = "block";
  }
}

function checkTextPass(step) {
  const text = document.getElementById(`p${step}-text`).value.trim().toLowerCase();
  const err = document.getElementById(`err-${step}`);

  const target = passwords[step - 4];

  if (text === target) {
    err.style.display = "none";
    handleStepSuccess(step);
  } else {
    err.style.display = "block";
  }
}

function handleStepSuccess(step) {
  // Reveal Word
  const slot = document.getElementById(`slot-${step}`);
  slot.textContent = targetWords[step - 1];
  slot.classList.add("revealed");

  // Move to next step or complete
  document.getElementById(`step-${step}`).classList.remove("active");

  if (step < 6) {
    currentStep++;
    const nextCard = document.getElementById(`step-${currentStep}`);
    nextCard.classList.add("active");
    
    // Focus first input of next card
    if (currentStep <= 3) {
      document.getElementById(`p${currentStep}-mm`).focus();
    } else {
      document.getElementById(`p${currentStep}-text`).focus();
    }
  } else {
    // All unlocked!
    setTimeout(() => {
      document.getElementById("security-page").classList.add("hidden");
      document.getElementById("welcome-layer").classList.remove("hidden");
    }, 600);
  }
}

function showPullBar() {
  document.getElementById("yes-btn").classList.add("hidden");
  const wrapper = document.getElementById("pull-bar-wrapper");
  wrapper.classList.remove("hidden");

  // Add click trigger to drag down main page
  wrapper.addEventListener("click", unlockMainPage);
}

function unlockMainPage() {
  const welcomeLayer = document.getElementById("welcome-layer");
  const mainPage = document.getElementById("main-page");

  welcomeLayer.classList.add("hidden");
  mainPage.classList.remove("hidden");
  mainPage.classList.add("slide-down");
}

function toggleMainMessage() {
  const content = document.getElementById("msg-content");
  const icon = document.getElementById("trigger-icon");

  if (content.classList.contains("open")) {
    content.classList.remove("open");
    icon.textContent = "▼";
  } else {
    content.classList.add("open");
    icon.textContent = "▲";
  }
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}