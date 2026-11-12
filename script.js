// MEMORY MASTER — игровая логика на JavaScript

const symbols = ["🚀", "🪐", "🌙", "⭐", "👾", "🛰️", "☄️", "🌍"];
const board = document.getElementById("board");
const timeEl = document.getElementById("time");
const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let firstCard = null;
let secondCard = null;
let locked = false;
let moves = 0;
let pairs = 0;
let seconds = 0;
let timer = null;
let started = false;

// Перемешивание карточек
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Формат времени MM:SS
function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

// Запуск таймера при первом ходе
function startTimer() {
  if (started) return;
  started = true;

  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = formatTime(seconds);
  }, 1000);
}

// Создание игрового поля
function createBoard() {
  board.innerHTML = "";
  const deck = shuffle([...symbols, ...symbols]);

  deck.forEach((symbol, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.textContent = "?";
    card.dataset.symbol = symbol;
    card.setAttribute("aria-label", `Закрытая карточка ${index + 1}`);

    // Минимальное оформление карточек задаётся прямо через JavaScript,
    // отдельный CSS-файл не нужен.
    card.style.width = "90px";
    card.style.height = "90px";
    card.style.margin = "6px";
    card.style.backgroundColor = "#2864e8";
    card.style.color = "#ffffff";
    card.style.border = "2px solid #8db7ff";
    card.style.borderRadius = "12px";
    card.style.fontSize = "30px";
    card.style.fontWeight = "bold";
    card.style.cursor = "pointer";

    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });

  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(4, 102px)";
  board.style.gap = "4px";
}

// Открытие карточки
function flipCard(card) {
  if (locked || card === firstCard || card.dataset.open === "true") return;

  startTimer();
  card.dataset.open = "true";
  card.textContent = card.dataset.symbol;
  card.style.backgroundColor = "#e8f0ff";
  card.style.color = "#173d9c";

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = moves;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.dataset.matched = "true";
    secondCard.dataset.matched = "true";
    firstCard.style.backgroundColor = "#c9f7e4";
    secondCard.style.backgroundColor = "#c9f7e4";

    firstCard = null;
    secondCard = null;
    pairs++;
    pairsEl.textContent = `${pairs}/8`;

    if (pairs === 8) {
      clearInterval(timer);
      messageEl.textContent =
        `Победа! Все пары найдены за ${formatTime(seconds)} и ${moves} ходов!`;
    } else {
      messageEl.textContent = "Отлично! Пара найдена!";
    }
  } else {
    locked = true;
    messageEl.textContent = "Не совпало. Попробуй ещё раз!";

    setTimeout(() => {
      [firstCard, secondCard].forEach((item) => {
        item.textContent = "?";
        item.dataset.open = "false";
        item.style.backgroundColor = "#2864e8";
        item.style.color = "#ffffff";
      });

      firstCard = null;
      secondCard = null;
      locked = false;
    }, 900);
  }
}

// Начать игру заново
function restartGame() {
  clearInterval(timer);

  firstCard = null;
  secondCard = null;
  locked = false;
  moves = 0;
  pairs = 0;
  seconds = 0;
  started = false;
  timer = null;

  timeEl.textContent = "00:00";
  movesEl.textContent = "0";
  pairsEl.textContent = "0/8";
  messageEl.textContent = "Открой две карточки и найди одинаковые!";

  createBoard();
}

restartBtn.addEventListener("click", restartGame);
createBoard();
