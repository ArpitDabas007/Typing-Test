// API URL
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

// DOM elements
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

// Variables
let quote = "";
let time = 60;
let timer = null;
let mistakes = 0;

// Fallback quotes if API fails
const fallbackQuotes = [
  "The best way to predict the future is to invent it.",
  "Life is about making an impact, not making an income.",
  "Strive not to be a success, but rather to be of value."
];

// Fetch and display new quote
const renderNewQuote = async () => {
  try {
    const response = await fetch(quoteApiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    quote = data.content;
  } catch (error) {
    console.error("Error fetching quote:", error);
    // Use a fallback quote if API fails
    quote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

  // Reset and display quote
  quoteSection.innerHTML = "";
  const arr = quote.split("").map((char) => {
    return `<span class='quote-chars'>${char}</span>`;
  });
  quoteSection.innerHTML = arr.join("");

  // Clear textarea and enable typing
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
};

// Start the test
const startTest = () => {
  // Reset everything
  mistakes = 0;
  time = 60;
  document.getElementById("timer").innerText = `${time}s`;
  document.getElementById("mistakes").innerText = mistakes;

  document.querySelector(".result").style.display = "none";
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";

  // Enable textarea
  userInput.disabled = false;
  userInput.value = "";
  userInput.focus();

  // Fetch a new quote
  renderNewQuote();

  // Start timer
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
};

// Stop the test and show results
const displayResult = () => {
  clearInterval(timer);

  // Disable textarea
  userInput.disabled = true;
  document.getElementById("stop-test").style.display = "none";

  const timeTaken = (60 - time) / 60; // minutes
  const totalWords = userInput.value.trim().split(/\s+/).length;

  const wpm = Math.round((totalWords / timeTaken) || 0);
  const accuracy = Math.round(
    ((quote.length - mistakes) / quote.length) * 100
  );

  document.getElementById("wpm").innerText = `${wpm} wpm`;
  document.getElementById("accuracy").innerText = `${accuracy} %`;

  document.querySelector(".result").style.display = "block";
};

// Update the timer every second
const updateTimer = () => {
  if (time === 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerText = `${--time}s`;
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

// Initialize on window load
window.onload = () => {
  userInput.value = "";
  userInput.disabled = true;
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  document.querySelector(".result").style.display = "none";
  document.getElementById("timer").innerText = "60s";
  document.getElementById("mistakes").innerText = "0";

  renderNewQuote();
};
