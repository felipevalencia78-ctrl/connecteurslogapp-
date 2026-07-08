"use strict";

const connectors = [
  "d’abord",
  "parce qu’",
  "cependant",
  "donc",
  "même si",
  "c’est pourquoi",
];

let wordBankOrder = shuffleConnectors(connectors);

function shuffleConnectors(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}
const exercise = [
  {
    answer: "d’abord",
    hintLabel: "ordre",
    hint: "On introduit la première idée du texte.",
    reason: "D’abord sert à organiser les idées et à présenter le premier argument.",
  },
  {
    answer: "parce qu’",
    hintLabel: "cause",
    hint: "On explique pourquoi les réseaux sociaux sont utiles.",
    reason: "Parce qu’ introduit la cause de l'utilité des réseaux sociaux.",
  },
  {
    answer: "cependant",
    hintLabel: "opposition",
    hint: "On passe d'un avantage à un aspect négatif.",
    reason: "Cependant marque une opposition entre les avantages et les risques.",
  },
  {
    answer: "donc",
    hintLabel: "conséquence",
    hint: "La deuxième phrase présente le résultat du temps passé en ligne.",
    reason: "Donc introduit une conséquence directe.",
  },
  {
    answer: "même si",
    hintLabel: "concession",
    hint: "On reconnaît un avantage avant de donner une limite.",
    reason: "Même si introduit une concession : les réseaux sociaux sont pratiques, mais il faut les utiliser avec modération.",
  },
  {
    answer: "c’est pourquoi",
    hintLabel: "conséquence",
    hint: "La dernière phrase donne la conséquence logique du problème des informations peu fiables.",
    reason: "C’est pourquoi annonce la conséquence : il faut vérifier les sources.",
  },
];

const textBlocks = [
  [
    { type: "text", value: "Les réseaux sociaux occupent une place importante dans notre vie quotidienne. " },
    { type: "blank", index: 0, display: "break" },
    { type: "text", value: ", ils permettent de communiquer rapidement avec des personnes qui habitent loin. Ils sont utiles " },
    { type: "blank", index: 1 },
    { type: "text", value: "ils permettent de rester en contact avec la famille et les amis." },
  ],
  [
    { type: "blank", index: 2, display: "break" },
    { type: "text", value: ", ils peuvent aussi provoquer du stress. Beaucoup de personnes passent trop de temps en ligne. " },
    { type: "blank", index: 3, display: "break" },
    { type: "text", value: ", elles dorment moins bien et ont parfois du mal à se concentrer." },
  ],
  [
    { type: "blank", index: 4, display: "break" },
    { type: "text", value: " les réseaux sociaux sont pratiques, il faut les utiliser avec modération. Certaines informations circulent très vite et ne sont pas toujours fiables. " },
    { type: "blank", index: 5, display: "break" },
    { type: "text", value: ", il faut vérifier les sources avant de partager une publication." },
  ],
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
  wordBankOrder.forEach((connector) => {
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
      setFeedback("Connecteur sélectionné", `Cliquez maintenant sur l'espace où va « ${connector} ».`);
      render();
    });

    wordBank.appendChild(button);
  });
}

function createBlank(index, display = "inline") {
  const item = exercise[index];
  const wrapper = document.createElement("span");
  wrapper.className = `blank-group is-${display}`;

  const blank = document.createElement("button");
  blank.type = "button";
  blank.className = "blank";
  blank.textContent = state.answers[index] || "__________";
  blank.setAttribute("aria-label", `Espace ${index + 1}, ${item.hintLabel}`);

  if (state.selectedConnector && state.answers[index] === "") blank.classList.add("is-active");
  if (state.checked && state.answers[index]) {
    blank.classList.add(normalize(state.answers[index]) === item.answer ? "is-correct" : "is-wrong");
  }

  blank.addEventListener("click", () => fillBlank(index));

  const hint = document.createElement("span");
  hint.className = "inline-hint";
  hint.textContent = `(${item.hintLabel})`;

  wrapper.append(blank, hint);
  return wrapper;
}

function renderSentences() {
  sentenceList.innerHTML = "";
  textBlocks.forEach((parts) => {
    const paragraph = document.createElement("p");
    paragraph.className = "exercise-paragraph";

    parts.forEach((part) => {
      if (part.type === "text") {
        paragraph.append(document.createTextNode(part.value));
      } else {
        paragraph.append(createBlank(part.index, part.display));
      }
    });

    sentenceList.appendChild(paragraph);
  });
}

function fillBlank(index) {
  if (!state.selectedConnector) {
    if (state.answers[index]) {
      state.selectedConnector = state.answers[index];
      state.answers[index] = "";
      state.checked = false;
      setFeedback("Vous pouvez le déplacer", "Cliquez sur un autre espace pour replacer ce connecteur.");
      render();
      return;
    }
    setFeedback("Choisissez d'abord un mot", "Sélectionnez un connecteur dans la banque avant de compléter l'espace.");
    return;
  }

  const existingIndex = state.answers.indexOf(state.selectedConnector);
  if (existingIndex !== -1) state.answers[existingIndex] = "";

  state.answers[index] = state.selectedConnector;
  state.selectedConnector = null;
  state.checked = false;
  setFeedback("Réponse placée", "Vous pouvez continuer ou vérifier quand tout est complété.");
  render();
}

function updateProgress() {
  const filled = state.answers.filter(Boolean).length;
  const correct = state.answers.filter((answer, index) => normalize(answer) === exercise[index].answer).length;
  scoreValue.textContent = `${state.checked ? correct : 0}/${exercise.length}`;
  progressBar.style.width = `${(filled / exercise.length) * 100}%`;
}

function checkAnswers() {
  const filled = state.answers.filter(Boolean).length;
  if (filled < exercise.length) {
    setFeedback("Il manque des espaces", `Vous avez complété ${filled} espace(s) sur ${exercise.length}. Terminez tout avant de vérifier.`);
    return;
  }

  state.checked = true;
  const correct = state.answers.filter((answer, index) => normalize(answer) === exercise[index].answer).length;

  if (correct === exercise.length) {
    setFeedback("Excellent", "Toutes les réponses sont correctes. Le texte est cohérent et bien organisé.");
  } else {
    const firstWrong = exercise.findIndex((item, index) => normalize(state.answers[index]) !== item.answer);
    setFeedback(`${correct} bonne(s) réponse(s) sur ${exercise.length}`, exercise[firstWrong].reason);
  }
  render();
}

function showHint() {
  const nextEmpty = exercise.findIndex((_, index) => !state.answers[index]);
  const target = nextEmpty === -1 ? state.hintIndex % exercise.length : nextEmpty;
  state.hintIndex = target + 1;
  setFeedback(`Indice ${target + 1} : ${exercise[target].hintLabel}`, exercise[target].hint);
}

function resetExercise() {
  state.selectedConnector = null;
  state.answers = Array(exercise.length).fill("");
  state.checked = false;
  state.hintIndex = 0;
  wordBankOrder = shuffleConnectors(connectors);
  setFeedback("Choisissez un connecteur.", "Sélectionnez un mot dans la banque, puis cliquez sur un espace vide.");
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




