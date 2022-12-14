const typebox = document.getElementById("typebox");
const wpmArray = JSON.parse(localStorage.getItem("wpmArray")) || [];
const accuracyArray = JSON.parse(localStorage.getItem("accuracyArray")) || [];
const typeboxContainer = document.querySelector(".typebox-container");
const timeSelectors = document.querySelectorAll(".timeSelector");
let words = wordsPT;
let page = "index";
let letterTyped = 0;
let correctTyped = 0;
let incorrectTyped = 0;
let wordTyped = 0;
let interval;
let time = 30;
const timeSelectorsContainer = document.querySelector(".timeSelectors");
const timeOptions = document.querySelector(".timeOptions");
const timerCountElement = document.querySelector(".displayTimer");

const renderWord = (word) => {
  const wordElement = document.createElement("div");
  wordElement.classList.add("word");
  word.forEach((letter) => {
    const letterElement = document.createElement("span");
    letterElement.textContent = letter;
    letterElement.classList.add("letter");
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
let letterElements = [...wordElements[wordTyped].children].filter((letter) =>
  letter.classList.contains("letter")
);

const checkCorrectTyped = (letter, elementLetter, letterElements) => {
  if (letter === elementLetter) {
    letterElements[letterTyped].classList.add("correct");
    letterTyped++;
    correctTyped++;
  } else if (letter !== "Backspace") {
    letterElements[letterTyped].classList.add("incorrect");
    incorrectTyped++;
    letterTyped++;
  }
};

const checkTypeBackspace = (letter, letterElements) => {
  if (letter === "Backspace") {
    if (letterTyped === 0) return;
    letterTyped--;
    letterElements[letterTyped].classList = "letter";
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
        //verificar se a palavra ?? a ultima palavra da linha 2
        const line2Words = document.querySelectorAll(".line2");
        const lastLine2Word = line2Words[line2Words.length - 1];
        if (lastLine2Word === wordElements[wordTyped]) {
          removeLine1();
        }
        wordTyped++;
        letterElements = [...wordElements[wordTyped].children].filter(
          (letter) => letter.classList.contains("letter")
        );
        letterTyped = 0;
      }
      return;
    }
    const elementLetter = letterElements[letterTyped].textContent;
    checkCorrectTyped(letter, elementLetter, letterElements);
  }
};

addEventListener("keydown", (event) => {
  if (page !== "index") return;
  const isblur = typebox.style.filter === "blur(5px)";
  removeTypeboxBlur();
  if (isblur) return;
  timerCountElement.style.visibility = "visible";
  keyEffect(event.key.toUpperCase());
  if (letterTyped == 0 && wordTyped == 0) {
    timeOptions.style.display = "none";
    startTimer(time, timerCountElement);
  }
  letter = event.key;
  typeLetter(letter);
  playKeySound(letter.toUpperCase());
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
      modalOpen();
      saveWpm();
      saveAccuracy();
      chart.update();
      resetTest();
      clearInterval(interval);
      timeOptions.style.display = "flex";
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
  document.querySelectorAll(".word span").forEach((letter) => {
    letter.classList = "letter";
  });
};

const resetTest = () => {
  removeLettersClass();
  letterTyped = 0;
  correctTyped = 0;
  incorrectTyped = 0;
  wordTyped = 0;
  wordElements = document.querySelectorAll(".word");
  letterElements = [...wordElements[wordTyped].children].filter((letter) =>
    letter.classList.contains("letter")
  );
  clearInterval(interval);
  timeOptions.style.display = "flex";
  timerCountElement.textContent = time;
  timerCountElement.style.visibility = "hidden";
};

const reloadText = () => {
  renderWords(words);
  resetTest();
  closeModal();
};

const reloadBtns = document.querySelectorAll(".fa-arrows-rotate");

reloadBtns.forEach((btn) => {
  btn.addEventListener("click", reloadText);
});

const focusElement = document.querySelector(".focus");

const removeTypeboxBlur = () => {
  typebox.style.filter = "blur(0px)";
  focusElement.style.display = "none";
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

const modalOpen = () => {
  page = "modal";
  const modalElement = document.querySelector(".modalResult");
  modalElement.style.visibility = "visible";
  const wpmDisplay = document.getElementById("wpm");
  const accuracyDisplay = document.getElementById("accuracy");
  wpmDisplay.textContent = correctTyped / 5 / (time / 60);
  accuracyDisplay.textContent =
    (correctTyped / (correctTyped + incorrectTyped)).toFixed(2) * 100 + "%";
};

const closeModal = () => {
  timeOptions.style.display = "flex";
  page = "index";
  const modalElement = document.querySelector(".modalResult");
  modalElement.style.visibility = "hidden";
  removeTypeboxBlur();
};

const saveWpm = () => {
  const wpm = document.getElementById("wpm").textContent;
  wpmArray.push(wpm);
  localStorage.setItem("wpmArray", JSON.stringify(wpmArray));
};

const saveAccuracy = () => {
  const accuracy = Number(
    document.getElementById("accuracy").textContent.replace("%", "")
  );
  accuracyArray.push(accuracy);
  localStorage.setItem("accuracyArray", JSON.stringify(accuracyArray));
  chart.data.labels = wpmArray.map((_, index) => index + 1);
};

const ctx = document.getElementById("myChart");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: wpmArray.map((_, index) => index + 1),
    datasets: [
      {
        label: "WPM",
        data: wpmArray,
        borderWidth: 3,
        backgroundColor: "#ff79c6",
        pointRadius: 4,
      },
      {
        label: "Accuracy",
        data: accuracyArray,
        borderWidth: 2,
        backgroundColor: "#50fa7bd7",
        pointRadius: 4,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const playKeySound = (key) => {
  const keySound = new Audio(`./sounds/${key == " " ? "SPACE" : key}.mp3`);
  soundMuted ? (keySound.volume = 0) : (keySound.volume = 0.15);
  keySound.play();
};

const selectLanguage = (event) => {
  const languageElement = document.querySelector(".language");
  const language = event.target.textContent;
  console.log(language)
  languageElement.textContent = language;
  words = language === 'English' ? wordsEN : wordsPT;
  reloadText();
};

const languageOptions = document.querySelectorAll(".option");
languageOptions.forEach((option) => {
  option.addEventListener("click", selectLanguage);
});

const soundIcon = document.querySelector(".volume");
let soundMuted = false;

const soundMutetoggle = () => {
  soundIcon.classList.toggle("fa-volume-xmark");
  soundMuted = !soundMuted;
};
soundIcon.addEventListener("click", soundMutetoggle);
