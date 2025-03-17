// Random Quotes API URL
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display random quotes
const renderNewQuote = async () => {
  const response = await fetch(quoteApiUrl);
  const data = await response.json();
  quote = data.content;

  // Clear previous quote and insert new one
  quoteSection.innerHTML = "";
  let arr = quote.split("").map((value) => {
    return `<span class='quote-chars'>${value}</span>`;
  });

  quoteSection.innerHTML = arr.join("");
};

// Logic for comparing input words with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);

  let userInputChars = userInput.value.split("");

  mistakes = 0; // reset mistakes for this round

  quoteChars.forEach((char, index) => {
    if (userInputChars[index] == null) {
      char.classList.remove("success");
      char.classList.remove("fail");
    } else if (char.innerText === userInputChars[index]) {
      char.classList.add("success");
      char.classList.remove("fail");
    } else {
      char.classList.add("fail");
      char.classList.remove("success");
      mistakes++;
    }
  });

  // Update mistakes display
  document.getElementById("mistakes").innerText = mistakes;

  // Check if test is completed
  let check = quoteChars.every((element) => element.classList.contains("success"));

  if (check) {
    displayResult();
  }
});

// Update Timer on screen
function updateTimer() {
  if (time === 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

// Sets timer
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test and display results
const displayResult = () => {
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);

  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;

  let timeTaken = (60 - time) / 100;
  if (timeTaken === 0) timeTaken = 1;

  const wpm = (userInput.value.length / 5 / timeTaken).toFixed(2);
  const accuracy = userInput.value.length > 0
    ? Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100)
    : 0;

  document.getElementById("wpm").innerText = `${wpm}`;
  document.getElementById("accuracy").innerText = `${accuracy} %`;
};

// Start Test
const startTest = () => {
  mistakes = 0;
  time = 60;
  userInput.value = "";
  userInput.disabled = false;

  document.getElementById("mistakes").innerText = mistakes;
  document.querySelector(".result").style.display = "none";

  clearInterval(timer);
  timeReduce();
  renderNewQuote();

  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "inline-block";
};

// Initialize on page load
window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "inline-block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};
