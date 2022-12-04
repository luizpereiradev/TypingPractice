const typebox = document.getElementById("typebox");
const typeboxContainer = document.querySelector(".typebox-container");
let letterTyped = 0;
let correctTyped = 0;
let wordTyped = 0;
let interval;
let time = 30;
const timerCountElement = document.querySelector(".displayTimer");

const renderWord = (word) => {
  const wordElement = document.createElement("div");
  wordElement.classList.add("word");
  word.forEach((letter) => {
    const letterElement = document.createElement("span");
    letterElement.textContent = letter;
    wordElement.appendChild(letterElement);
  });
  typebox.appendChild(wordElement);
};

const renderWords = (words) => {
  typebox.innerHTML = "";
  //renderizar 100 palavras aleatorias
  for (let i = 0; i < 100; i++) {
    renderWord(words[Math.floor(Math.random() * words.length)]);
  }
};

renderWords(words);

let wordElements = document.querySelectorAll(".word");
let letterElements = wordElements[wordTyped].children;

const checkCorrectTyped = (letter, elementLetter, letterElements) => {
  if (letter === elementLetter) {
    letterElements[letterTyped].classList.add("correct");
    letterTyped++;
    correctTyped++;
  } else if (letter !== "Backspace") {
    letterElements[letterTyped].classList.add("incorrect");
    letterTyped++;
  }
};

const checkTypeBackspace = (letter, letterElements) => {
  if (letter === "Backspace") {
    if (letterTyped === 0) return;
    letterTyped--;
    letterElements[letterTyped].classList = "";
  }
};

const removeLine1 = () => {
  const line1Words = document.querySelectorAll(".line1");
  line1Words.forEach((word) => {
    word.remove();
  });
};

const typeLetter = (letter) => {
  const testLength = letterTyped >= 0;
  if (testLength) {
    checkTypeBackspace(letter, letterElements);
    if (letterTyped === letterElements.length) {
      if (letter === " ") {
        //verificar se a palavra é a ultima palavra da linha 2
        const line2Words = document.querySelectorAll(".line2");
        const lastLine2Word = line2Words[line2Words.length - 1];
        if (lastLine2Word === wordElements[wordTyped]) {
          removeLine1();
        }
        wordTyped++;
        letterElements = wordElements[wordTyped].children;
        letterTyped = 0;
      }
      return;
    }
    const elementLetter = letterElements[letterTyped].textContent;
    checkCorrectTyped(letter, elementLetter, letterElements);
  }
};

addEventListener("keydown", (event) => {
  const isblur = typebox.style.filter === "blur(5px)";
  removeTypeboxBlur()
  if (isblur) return;
  timerCountElement.style.visibility = "visible";
  keyEffect(event.key.toUpperCase());
  if (letterTyped == 0 && wordTyped == 0) {
    startTimer(time, timerCountElement);
  }
  letter = event.key;
  typeLetter(letter);
  testLine();
});

addEventListener("keyup", (event) => {
  stopKeyEffect(event.key.toUpperCase());
});

function startTimer(duration, display) {
  let timer = duration,
    seconds;
  interval = setInterval(function () {
    seconds = parseInt(timer % 60, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = seconds;
    if (--timer < 0) {
      timer = duration;
      display.textContent = correctTyped / 5 / (duration / 60) + "WPM";
      clearInterval(interval);
    }
  }, 1000);
}

const testLine = () => {
  document.querySelectorAll(".word").forEach((word) => {
    if (word.offsetTop > document.querySelector(".finalLine").offsetTop) {
      word.classList.add("line3");
    } else if (
      word.offsetTop < document.querySelector(".firstLine").offsetTop
    ) {
      word.classList.add("line1");
      word.classList.remove("line2");
    } else {
      word.classList.remove("line3");
      word.classList.add("line2");
      word.classList.remove("line1");
    }
  });
};

const keyEffect = (key) => {
  const keyElement = document.getElementById(key);
  if (keyElement) {
    keyElement.style.backgroundColor = "#bd93f9";
    keyElement.style.transform = "scale(1.1)";
  }
};

const stopKeyEffect = (key) => {
  const keyElement = document.getElementById(key);
  if (keyElement) {
    keyElement.style.backgroundColor = "#44475a";
    keyElement.style.transform = "";
  }
};

const removeLettersClass = () => {
  document.querySelectorAll("span").forEach((letter) => {
    letter.classList = "";
  });
};

const resetTest = () => {
  removeLettersClass();
  letterTyped = 0;
  correctTyped = 0;
  wordTyped = 0;
  wordElements = document.querySelectorAll(".word");
  letterElements = wordElements[wordTyped].children;
  clearInterval(interval);
  timerCountElement.textContent = time;
  timerCountElement.style.visibility = "hidden";
};

const reloadText = () => {
  renderWords(words);
  resetTest();
};

const reloadBtn = document.querySelector(".fa-arrows-rotate");

reloadBtn.addEventListener("click", reloadText);
const focusElement = document.querySelector(".focus");

const removeTypeboxBlur = () => {
  typebox.style.filter = "blur(0px)";
  focusElement.style.display = "none";
  typebox.focus();
};

const addTypeboxBlur = () => {
  typebox.style.filter = "blur(5px)";
  focusElement.style.display = "grid";
  resetTest();
};

const body = document.querySelector("body");

body.addEventListener("click", (event) => {
  event.target === body ? addTypeboxBlur() : removeTypeboxBlur();
});

const timeSelectors = document.querySelectorAll(".timeSelector");

const toggleTimeSelector = (event) => {
  timeSelectors.forEach((timeSelector) => {
    timeSelector.classList.remove("selected");
  });
  event.target.classList.add("selected");
  time = event.target.textContent;
  resetTest();
};

timeSelectors.forEach((timeSelector) => {
  timeSelector.addEventListener("click", toggleTimeSelector);
});
