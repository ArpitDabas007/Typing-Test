const quoteApiUrl = "https://api.adviceslip.com/advice";
    const fallbackQuotes = [
      "The quick brown fox jumps over the lazy dog.",
      "Typing fast requires practice, patience, and precision.",
      "Practice makes perfect when improving your typing speed."
    ];

    const quoteSection = document.getElementById("quote");
    const userInput = document.getElementById("quote-input");
    const startButton = document.getElementById("start-test");
    const stopButton = document.getElementById("stop-test");

    let quote = "";
    let time = 60;
    let timer = null;
    let mistakes = 0;

    // Get and display a new quote
   async function renderNewQuote() {
  quoteSection.innerHTML = "Loading quote...";
  try {
    const response = await fetch(quoteApiUrl, { cache: "no-cache" }); // no-cache to avoid repeated quotes
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    quote = data.slip.advice;

    console.log("Fetched quote from API:", quote);

  } catch (error) {
    console.error("API failed, using fallback.", error);
    quote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

  // Clear existing quote and render new one
  quoteSection.innerHTML = "";
  quote.split("").forEach(char => {
    const span = document.createElement("span");
    span.classList.add("quote-chars");
    span.innerText = char;
    quoteSection.appendChild(span);
  });

  // Reset input box
  userInput.value = "";
  userInput.disabled = false;
  userInput.focus();
}



    // Start the typing test
    function startTest() {
      mistakes = 0;
      time = 60;

      startButton.style.display = "none";
      stopButton.style.display = "inline-block";
      document.querySelector(".result").style.display = "none";

      document.getElementById("mistakes").innerText = mistakes;
      document.getElementById("timer").innerText = `${time}s`;

      userInput.disabled = false;
      userInput.value = "";
      userInput.focus();

      clearInterval(timer);
      timer = setInterval(updateTimer, 1000);

      renderNewQuote();
    }

    // Update timer countdown
    function updateTimer() {
      if (time === 0) {
        displayResult();
      } else {
        time--;
        document.getElementById("timer").innerText = `${time}s`;
      }
    }

    // Stop the typing test and show results
    function displayResult() {
      clearInterval(timer);
      userInput.disabled = true;
      stopButton.style.display = "none";

      const timeTaken = (60 - time) / 60; // in minutes
      const totalWords = userInput.value.trim().split(/\s+/).length;
      const wpm = Math.round(totalWords / timeTaken || 0);
      const accuracy = Math.round(((quote.length - mistakes) / quote.length) * 100);

      document.getElementById("wpm").innerText = `${wpm} wpm`;
      document.getElementById("accuracy").innerText = `${accuracy} %`;

      document.querySelector(".result").style.display = "block";
      startButton.style.display = "inline-block";
    }

    // Compare user input with the quote
    userInput.addEventListener("input", () => {
      const quoteChars = document.querySelectorAll(".quote-chars");
      const inputChars = userInput.value.split("");

      mistakes = 0;

      quoteChars.forEach((char, index) => {
        if (inputChars[index] == null) {
          char.classList.remove("success", "fail");
        } else if (char.innerText === inputChars[index]) {
          char.classList.add("success");
          char.classList.remove("fail");
        } else {
          char.classList.add("fail");
          char.classList.remove("success");
          mistakes++;
        }
      });

      document.getElementById("mistakes").innerText = mistakes;

      const isComplete = Array.from(quoteChars).every(char =>
        char.classList.contains("success")
      );

      if (isComplete) {
        displayResult();
      }
    });

    // Event listeners for start and stop buttons
    startButton.addEventListener("click", startTest);
    stopButton.addEventListener("click", displayResult);

    // On page load setup
    window.addEventListener("load", () => {
      userInput.value = "";
      userInput.disabled = true;
      startButton.style.display = "inline-block";
      stopButton.style.display = "none";
      document.querySelector(".result").style.display = "none";
    });
