"use strict";

const connectors = [
  "d'abord",
  "ensuite",
  "enfin",
  "cependant",
  "en revanche",
  "parce que",
  "donc",
  "c'est pourquoi",
];

const exercise = [
  {
    before: "Les reseaux sociaux permettent de communiquer rapidement.",
    after: "ils peuvent aussi creer une dependance.",
    answer: "cependant",
    hint: "La deuxieme idee nuance la premiere.",
    reason: "Cependant marque une opposition entre l'avantage et le risque.",
  },
  {
    before: "Je verifie toujours les sources",
    after: "il y a beaucoup de fausses informations.",
    answer: "parce que",
    hint: "On explique la raison de verifier.",
    reason: "Parce que introduit la cause.",
  },
  {
    before: "",
    after: "les reseaux sociaux sont utiles pour garder le contact avec la famille.",
    answer: "d'abord",
    hint: "C'est la premiere idee d'une serie.",
    reason: "D'abord ouvre l'organisation des arguments.",
  },
  {
    before: "Beaucoup de jeunes passent trop de temps sur leur telephone.",
    after: "ils dorment parfois mal.",
    answer: "c'est pourquoi",
    hint: "La deuxieme phrase presente une consequence.",
    reason: "C'est pourquoi annonce la consequence de l'usage excessif.",
  },
  {
    before: "Instagram est tres populaire.",
    after: "LinkedIn est plus professionnel.",
    answer: "en revanche",
    hint: "On compare deux reseaux avec une difference nette.",
    reason: "En revanche oppose deux caracteristiques.",
  },
  {
    before: "",
    after: "on peut utiliser les reseaux sociaux pour apprendre une langue.",
    answer: "ensuite",
    hint: "Cette idee vient apres la premiere.",
    reason: "Ensuite poursuit l'ordre des arguments.",
  },
  {
    before: "Les fausses informations circulent vite.",
    after: "il faut faire attention.",
    answer: "donc",
    hint: "On donne une consequence directe.",
    reason: "Donc exprime une consequence simple et directe.",
  },
  {
    before: "",
    after: "les reseaux sociaux peuvent etre positifs si on les utilise avec moderation.",
    answer: "enfin",
    hint: "C'est la conclusion de la serie.",
    reason: "Enfin introduit la derniere idee ou la conclusion.",
  },
];

const wordBank = document.querySelector("#wordBank");
const sentenceList = document.querySelector("#sentences");
const scoreValue = document.querySelector("#scoreValue");
const progressBar = document.querySelector("#progressBar");
const feedbackTitle = document.querySelector("#feedbackTitle");
const feedbackText = document.querySelector("#feedbackText");
const checkButton = document.querySelector("#checkButton");
const resetButton = document.querySelector("#resetButton");
const hintButton = document.querySelector("#hintButton");

const state = {
  selectedConnector: null,
  answers: Array(exercise.length).fill(""),
  checked: false,
  hintIndex: 0,
};

function normalize(value) {
  return value.trim().toLowerCase();
}

function setFeedback(title, text) {
  feedbackTitle.textContent = title;
  feedbackText.textContent = text;
}

function renderWordBank() {
  wordBank.innerHTML = "";
  connectors.forEach((connector) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = connector;
    button.dataset.connector = connector;

    if (state.selectedConnector === connector) button.classList.add("is-selected");
    if (state.answers.includes(connector)) button.classList.add("is-used");

    button.addEventListener("click", () => {
      if (state.answers.includes(connector)) {
        const index = state.answers.indexOf(connector);
        state.answers[index] = "";
      }
      state.selectedConnector = connector;
      state.checked = false;
      setFeedback("Conector seleccionado", `Ahora toca el espacio donde va "${connector}".`);
      render();
    });

    wordBank.appendChild(button);
  });
}

function renderSentences() {
  sentenceList.innerHTML = "";
  exercise.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "sentence-card";

    const before = document.createElement("span");
    before.textContent = item.before ? `${item.before} ` : "";

    const blank = document.createElement("button");
    blank.type = "button";
    blank.className = "blank";
    blank.textContent = state.answers[index] || "__________";
    blank.setAttribute("aria-label", `Espacio ${index + 1}`);

    if (state.selectedConnector && state.answers[index] === "") blank.classList.add("is-active");
    if (state.checked && state.answers[index]) {
      blank.classList.add(normalize(state.answers[index]) === item.answer ? "is-correct" : "is-wrong");
    }

    blank.addEventListener("click", () => fillBlank(index));

    const after = document.createElement("span");
    const needsComma = item.before === "";
    after.textContent = `${needsComma ? ", " : " "}${item.after}`;

    li.append(before, blank, after);
    sentenceList.appendChild(li);
  });
}

function fillBlank(index) {
  if (!state.selectedConnector) {
    if (state.answers[index]) {
      state.selectedConnector = state.answers[index];
      state.answers[index] = "";
      state.checked = false;
      setFeedback("Puedes moverlo", "Toca otro espacio para recolocar ese conector.");
      render();
      return;
    }
    setFeedback("Primero elige una palabra", "Selecciona un conector del banco antes de completar el espacio.");
    return;
  }

  const existingIndex = state.answers.indexOf(state.selectedConnector);
  if (existingIndex !== -1) state.answers[existingIndex] = "";

  state.answers[index] = state.selectedConnector;
  state.selectedConnector = null;
  state.checked = false;
  setFeedback("Respuesta colocada", "Puedes seguir completando o comprobar cuando termines.");
  render();
}

function updateProgress() {
  const filled = state.answers.filter(Boolean).length;
  const correct = state.answers.filter((answer, index) => normalize(answer) === exercise[index].answer).length;
  scoreValue.textContent = `${state.checked ? correct : 0}/8`;
  progressBar.style.width = `${(filled / exercise.length) * 100}%`;
}

function checkAnswers() {
  const filled = state.answers.filter(Boolean).length;
  if (filled < exercise.length) {
    setFeedback("Faltan espacios", `Has completado ${filled} de ${exercise.length}. Termina todos antes de comprobar.`);
    return;
  }

  state.checked = true;
  const correct = state.answers.filter((answer, index) => normalize(answer) === exercise[index].answer).length;

  if (correct === exercise.length) {
    setFeedback("Excelente", "Todas las respuestas son correctas. La serie de ideas queda clara y bien organizada.");
  } else {
    const firstWrong = exercise.findIndex((item, index) => normalize(state.answers[index]) !== item.answer);
    setFeedback(`${correct} de ${exercise.length} correctas`, exercise[firstWrong].reason);
  }
  render();
}

function showHint() {
  const nextEmpty = exercise.findIndex((_, index) => !state.answers[index]);
  const target = nextEmpty === -1 ? state.hintIndex % exercise.length : nextEmpty;
  state.hintIndex = target + 1;
  setFeedback(`Pista ${target + 1}`, exercise[target].hint);
}

function resetExercise() {
  state.selectedConnector = null;
  state.answers = Array(exercise.length).fill("");
  state.checked = false;
  state.hintIndex = 0;
  setFeedback("Elige un conector.", "Selecciona una palabra del banco y luego toca un espacio en blanco.");
  render();
}

function render() {
  renderWordBank();
  renderSentences();
  updateProgress();
}

checkButton.addEventListener("click", checkAnswers);
resetButton.addEventListener("click", resetExercise);
hintButton.addEventListener("click", showHint);

render();
