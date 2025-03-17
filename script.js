const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

// Get elements from DOM
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const startButton = document.getElementById("start-test");
const stopButton = document.getElementById("stop-test");

let quote = "";
let time = 60;
let timer = null;
let mistakes = 0;

// Fetch and render new quote
async function renderNewQuote() {
  const response = await fetch(quoteApiUrl);
  const data = await response.json();
  quote = data.content;

  // Reset quote display
  quoteSection.innerHTML = "";

  // Add characters with spans
  quote.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.classList.add("quote-chars");
    charSpan.innerText = char;
    quoteSection.appendChild(charSpan);
  });
}

// Compare user input with quote
userInput.addEventListener("input", () => {
  const quoteChars = document.querySelectorAll(".quote-chars");
  const userInputChars = userInput.value.split("");

  let correct = true;

  quoteChars.forEach((char, index) => {
    const typedChar = userInputChars[index];

    if (typedChar == null) {
      char.classList.remove("success", "fail");
      correct = false;
    } else if (char.innerText === typedChar) {
      char.classList.add("success");
      char.classList.remove("fail");
    } else {
      char.classList.add("fail");
      char.classList.remove("success");
      correct = false;
      mistakes++;
    }
  });

  // Update mistakes count on screen
  document.getElementById("mistakes").innerText = mistakes;

  // If entire quote is correct
  if (correct) {
    displayResult();
  }
});

// Start the test
function startTest() {
  mistakes = 0;
  time = 60;
  userInput.disabled = false;
  userInput.value = "";
  document.getElementById("mistakes").innerText = mistakes;

  // Show/hide buttons
  startButton.style.display = "none";
  stopButton.style.display = "inline-block";

  // Start timer
  clearInterval(timer);
  timeReduce();

  // Reset and get new quote
  renderNewQuote();
}

// Reduce time function
function timeReduce() {
  document.getElementById("timer").innerText = `${time}s`;

  timer = setInterval(() => {
    if (time > 0) {
      time--;
      document.getElementById("timer").innerText = `${time}s`;
    } else {
      clearInterval(timer);
      displayResult();
    }
  }, 1000);
}

// Display result
function displayResult() {
  clearInterval(timer);

  // Show result box
  document.querySelector(".result").style.display = "block";

  // Hide stop button
  stopButton.style.display = "none";

  // Disable input
  userInput.disabled = true;

  // Calculate WPM
  const timeTaken = 60 - time;
  const wpm = timeTaken > 0 ? (userInput.value.length / 5 / (timeTaken / 60)).toFixed(2) : 0;

  // Calculate Accuracy
  const accuracy =
    userInput.value.length > 0
      ? Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100)
      : 0;

  document.getElementById("wpm").innerText = `${wpm} wpm`;
  document.getElementById("accuracy").innerText = `${accuracy} %`;
}

// Event listeners for buttons
startButton.addEventListener("click", startTest);
stopButton.addEventListener("click", displayResult);

// Initial setup
window.onload = () => {
  userInput.value = "";
  userInput.disabled = true;
  startButton.style.display = "inline-block";
  stopButton.style.display = "none";
  document.querySelector(".result").style.display = "none";

  // Load first quote but don't allow typing yet
  renderNewQuote();
};
