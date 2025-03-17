const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
const startButton = document.getElementById("start-test");
const stopButton = document.getElementById("stop-test");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display random quotes
const renderNewQuote = async () => {
  const response = await fetch(quoteApiUrl);
  let data = await response.json();
  quote = data.content;

  let arr = quote.split("").map((value) => {
    return "<span class='quote-chars'>" + value + "</span>";
  });

  quoteSection.innerHTML = arr.join("");
};

// Compare input words with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);

  let userInputChars = userInput.value.split("");

  quoteChars.forEach((char, index) => {
    if (char.innerText === userInputChars[index]) {
      char.classList.add("success");
      char.classList.remove("fail");
    } else if (userInputChars[index] == null) {
      char.classList.remove("success");
      char.classList.remove("fail");
    } else {
      if (!char.classList.contains("fail")) {
        mistakes += 1;
        document.getElementById("mistakes").innerText = mistakes;
        char.classList.add("fail");
      }
    }
  });

  let check = quoteChars.every((element) => {
    return element.classList.contains("success");
  });

  if (check) {
    displayResult();
  }
});

// Update Timer
function updateTimer() {
  if (time === 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

// Start Timer
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test and display result
const displayResult = () => {
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  stopButton.style.display = "none";
  userInput.disabled = true;

  let timeTaken = 1;
  if (time !== 0) {
    timeTaken = (60 - time) / 60; // convert to minutes
  }

  const wpm = (userInput.value.length / 5 / timeTaken).toFixed(2);
  const accuracy = Math.round(
    ((userInput.value.length - mistakes) / userInput.value.length) * 100
  );

  document.getElementById("wpm").innerText = wpm + " wpm";
  document.getElementById("accuracy").innerText = accuracy + " %";
};

// Start Test function
const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
  startButton.style.display = "none";
  stopButton.style.display = "block";
  userInput.value = "";
  document.getElementById("mistakes").innerText = mistakes;
  renderNewQuote();
};

// Setup event listeners
startButton.addEventListener("click", startTest);
stopButton.addEventListener("click", displayResult);

// On page load
window.onload = () => {
  userInput.value = "";
  startButton.style.display = "block";
  stopButton.style.display = "none";
  userInput.disabled = true;
  document.querySelector(".result").style.display = "none";
  document.getElementById("timer").innerText = "60s";
  document.getElementById("mistakes").innerText = "0";
  renderNewQuote();
};
