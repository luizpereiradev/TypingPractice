const typebox = document.getElementById("typebox");
let letterTyped = 0;
let correctTyped = 0;
let wordTyped = 0;
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

const removeLine1 = () => {
  const line1Words = document.querySelectorAll('.line1')
  line1Words.forEach((word) => {
    word.remove()
  })
}

const typeLetter = (letter) => {
  const testLength = letterTyped >= 0;
  if (testLength) {
    checkTypeBackspace(letter, letterElements);
    if (letterTyped === letterElements.length) {
      if (letter === " ") {
        //verificar se a palavra é a ultima palavra da linha 2
        const line2Words = document.querySelectorAll('.line2')
        const lastLine2Word = line2Words[line2Words.length - 1]
        if(lastLine2Word === wordElements[wordTyped]) {
          removeLine1()
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
  if (letterTyped == 0 && wordTyped == 0) {
    startTimer(30, timerCountElement);
  }
  letter = event.key;
  typeLetter(letter);
  testLine()
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
      display.textContent = correctTyped / 5 / (duration / 60) + "WPM";
      clearInterval(interval);
    }
  }, 1000);
}

const testLine = () => {
  document.querySelectorAll('.word').forEach((word) => {
    if(word.offsetTop > document.querySelector('.finalLine').offsetTop) {
      word.classList.add('line3')
    }else if(word.offsetTop < document.querySelector('.firstLine').offsetTop) {
      word.classList.add('line1')
    }else{
      word.classList.remove('line3')
      word.classList.add('line2')
      word.classList.remove('line1')
    }
  })
}

