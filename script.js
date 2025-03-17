const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";

const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = null;
let mistakes = 0;

// Display random quotes
const renderNewQuote = async () => {
  try {
    const response = await fetch(quoteApiUrl);
    const data = await response.json();
    quote = data.content;

    // Clear the quote section before adding new content
    quoteSection.innerHTML = "";

    // Create spans for each character in the quote
    const arr = quote.split("").map((value) => {
      return `<span class='quote-chars'>${value}</span>`;
    });

    quoteSection.innerHTML = arr.join("");
  } catch (error) {
    console.error("Failed to fetch quote:", error);
    quoteSection.innerHTML = "<span class='fail'>Failed to load quote. Check your connection.</span>";
  }
};

// Compare input with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  let userInputChars = userInput.value.split("");

  mistakes = 0; // Reset mistakes each time

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

  if (userInputChars.length === quote.length && mistakes === 0) {
    displayResult();
  }
});

// Timer logic
function updateTimer() {
  if (time === 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerText = `${--time}s`;
  }
}

const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End test and show results
const displayResult = () => {
  clearInterval(timer);
  userInput.disabled = true;

  document.querySelector(".result").style.display = "block";
  document.getElementById("stop-test").style.display = "none";

  let timeTaken = 1;
  if (time !== 0) {
    timeTaken = (60 - time) / 100;
  }

  const wpm = (userInput.value.length / 5 / timeTaken).toFixed(2);
  const accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);

  document.getElementById("wpm").innerText = `${wpm} wpm`;
  document.getElementById("accuracy").innerText = isNaN(accuracy) ? `0 %` : `${accuracy} %`;
};

// Start a new test
const startTest = () => {
  mistakes = 0;
  time = 60;

  clearInterval(timer); // Clear any previous timers

  userInput.disabled = false;
  userInput.value = "";

  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
  document.querySelector(".result").style.display = "none";

  document.getElementById("mistakes").innerText = mistakes;
  document.getElementById("timer").innerText = `${time}s`;

  renderNewQuote();
  timeReduce();
};

// Make sure startTest and displayResult are globally available
window.startTest = startTest;
window.displayResult = displayResult;

// Initial setup on page load
window.onload = () => {
  userInput.value = "";
  userInput.disabled = true;

  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";

  renderNewQuote();
};
