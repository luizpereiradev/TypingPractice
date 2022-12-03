const typebox = document.getElementById("typebox");
let letterTyped = 0;
let correctTyped = 0;
let wordTyped = 0;
const timerCountElement = document.querySelector(".displayTimer");


const words = [
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
  ["l", "u", "i", "z"],
  ["a", "n", "d", "r", "e"],
  ["i", "s"],
  ["a", "w", "e", "s", "o", "m", "e"],
  ["a", "n", "d"],
  ["a", "l", "s", "o"],
];

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
  words.forEach((word) => renderWord(word));
};

renderWords(words); // render first page

const wordElements = document.querySelectorAll(".word");
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

const typeLetter = (letter) => {
  const testLength = letterTyped >= 0;
  if (testLength) {
    if (letterTyped === letterElements.length) {
      checkTypeBackspace(letter, letterElements);
      if (letter === " ") {
        wordElements[wordTyped].remove();
        wordTyped++;
        letterElements = wordElements[wordTyped].children;
        letterTyped = 0;
      }
      return;
    }
    const elementLetter = letterElements[letterTyped].textContent;
    checkCorrectTyped(letter, elementLetter, letterElements);
    checkTypeBackspace(letter, letterElements);
  }
};

addEventListener("keydown", (event) => {
  if (letterTyped == 0 && wordTyped == 0){
    startTimer(30, timerCountElement)
  }
  letter = event.key;
  typeLetter(letter);
});


function startTimer(duration, display) {
  let timer = duration,
    seconds;
  let interval = setInterval(function () {
    seconds = parseInt(timer % 60, 10);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = seconds;
    if (--timer < 0) {
      timer = duration;
      display.textContent = correctTyped/5/(duration/60)
      clearInterval(interval);
    }
  }, 1000);
}
