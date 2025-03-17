// API URL
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

// DOM elements
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const startButton = document.getElementById("start-test");
const stopButton = document.getElementById("stop-test");

// Variables
let quote = "";
let time = 60;
let timer = null;
let mistakes = 0;

// Fallback quotes in case API doesn't work
const fallbackQuotes = [
  "The best way to predict the future is to invent it.",
  "Life is about making an impact, not just making an income.",
  "Strive not to be a success, but rather to be of value."
];

// Fetch and render new quote
const renderNewQuote = async () => {
  try {
    const response = await fetch(quoteApiUrl);
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    quote = data.content;
  } catch (error) {
    console.log("Using fallback quote due to error:", error);
    quote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

  // Reset and render
  quoteSection.innerHTML = "";
  const characters = quote.split("").map((char) => {
    return `<span class='quote-chars'>${char}</span>`;
  });
  quoteSection.innerHTML = characters.join("");

  // Enable textarea and clear input
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
};

// Start test
const startTest = () => {
  mistakes = 0;
  time = 60;
  document.getElementById("mistakes").innerText = mistakes;
  document.getElementById("timer").innerText = `${time}s`;

  startButton.style.display = "none";
  stopButton.style.display = "block";
  document.querySelector(".result").style.display = "none";

  renderNewQuote();

  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
};

// Stop test and show results
const displayResult = () => {
  clearInterval(timer);
  userInput.disabled = true;
  stopButton.style.display = "none";

  const timeTaken = (60 - time) / 60; // in minutes
  const totalWords = userInput.value.trim().split(/\s+/).length;

  const wpm = Math.round(totalWords / timeTaken || 0);
  const accuracy = Math.round(
    ((quote.length - mistakes) / quote.length) * 100
  );

  document.getElementById("wpm").innerText = `${wpm} wpm`;
  document.getElementById("accuracy").innerText = `${accuracy} %`;

  document.querySelector(".result").style.display = "block";
  startButton.style.display = "block";
};

// Timer countdown
const updateTimer = () => {
  if (time === 0) {
    displayResult();
  } else {
    time--;
    document.getElementById("timer").innerText = `${time}s`;
  }
};

// Compare user input with quote
userInput.addEventListener("input", () => {
  const quoteChars = document.querySelectorAll(".quote-chars");
  const userInputChars = userInput.value.split("");

  mistakes = 0;

  quoteChars.forEach((char, index) => {
    if (userInputChars[index] == null) {
      char.classList.remove("success", "fail");
    } else if (char.innerText === userInputChars[index]) {
      char.classList.add("success");
      char.classList.remove("fail");
    } else {
      char.classList.add("fail");
      char.classList.remove("success");
      mistakes++;
    }
  });

  document.getElementById("mistakes").innerText = mistakes;

  const isComplete = Array.from(quoteChars).every((char) =>
    char.classList.contains("success")
  );

  if (isComplete) {
    displayResult();
  }
});

// Event listeners for buttons
startButton.addEventListener("click", startTest);
stopButton.addEventListener("click", displayResult);

// Initial setup on load
window.onload = () => {
  userInput.value = "";
  userInput.disabled = true;
  startButton.style.display = "block";
  stopButton.style.display = "none";
  document.querySelector(".result").style.display = "none";

  renderNewQuote(); // Optional: load a quote on page load
};
