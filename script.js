const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = null;
let mistakes = 0;

// Display random quotes
const renderNewQuote = async () => {
  const response = await fetch(quoteApiUrl);
  const data = await response.json();
  quote = data.content;

  // Create spans for each character
  const arr = quote.split("").map((value) => {
    return `<span class='quote-chars'>${value}</span>`;
  });

  quoteSection.innerHTML = arr.join("");
};

// Logic for comparing input words with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);

  let userInputChars = userInput.value.split("");

  // Reset mistakes for each input event
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

  // Finish test when all characters are correct and full length typed
  const allCorrect = quoteChars.every((char) => char.classList.contains("success"));

  if (allCorrect && userInput.value.length === quote.length) {
    displayResult();
  }
});

// Update Timer on screen
function updateTimer() {
  if (time === 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerText = `${--time}s`;
  }
}

// Start timer countdown
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End test and show results
const displayResult = () => {
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;

  let timeTaken = 1;
  if (time !== 0) {
    timeTaken = (60 - time) / 100;
  }

  const wpm = (userInput.value.length / 5 / timeTaken).toFixed(2);
  const accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);

  document.getElementById("wpm").innerText = `${wpm} wpm`;
  document.getElementById("accuracy").innerText = `${accuracy} %`;
};

// Start test
const startTest = () => {
  mistakes = 0;
  timer = null;
  userInput.disabled = false;
  userInput.value = "";
  quoteSection.innerHTML = "";
  renderNewQuote();
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
  document.querySelector(".result").style.display = "none";
  document.getElementById("mistakes").innerText = mistakes;
  document.getElementById("timer").innerText = `${time}s`;
};

// On page load
window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};
