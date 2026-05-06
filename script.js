// =========================
// MODAL SETUP
// =========================
const cards = document.querySelectorAll(".exhibit-card");
const modal = document.getElementById("modal");

const panelImg = document.getElementById("panel-img");
const panelTitle = document.getElementById("panel-title");

const panelLatin = document.getElementById("panel-latin");
const panelHabitat = document.getElementById("panel-habitat");
const panelDiet = document.getElementById("panel-diet");
const panelBehavior = document.getElementById("panel-behavior");

const closeBtn = document.querySelector(".close-btn");
const backBtn = document.querySelector(".back-btn");


// =========================
// 🔊 VOICE FUNCTION
// =========================
function speak(text) {
  if (!text) return;

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 0.95;
  speech.pitch = 1;

  // 🔥 stop previous voice (important)
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}


// =========================
// LOAD CARD IMAGES + LABEL
// =========================
cards.forEach((card, index) => {
  const img = card.dataset.img;
  const name = card.dataset.name;

  if (img) {
    card.style.background = `url(${img}) center/cover no-repeat`;
  }

  if (!card.querySelector(".card-label")) {
    const label = document.createElement("div");
    label.classList.add("card-label");
    label.textContent = `${index + 1}. ${name || "Unknown"}`;
    card.appendChild(label);
  }
});


// =========================
// OPEN MODAL
// =========================
cards.forEach(card => {
  card.addEventListener("click", () => {

    const data = card.dataset;

    panelTitle.textContent = data.name || "Insect Name";
    panelImg.src = data.full || data.img || "";

    panelLatin.textContent = data.latin || "Scientific Name";
    panelHabitat.textContent = data.habitat || "Unknown";
    panelDiet.textContent = data.diet || "Unknown";
    panelBehavior.textContent = data.behavior || "Unknown";

    modal.classList.add("active");
    document.body.classList.add("modal-open");
  });
});


// =========================
// CLOSE MODAL
// =========================
function closeModal() {
  if (modal) modal.classList.remove("active");
  document.body.classList.remove("modal-open");

  // 🔥 stop voice kapag close
  speechSynthesis.cancel();
}

if (closeBtn) closeBtn.addEventListener("click", closeModal);
if (backBtn) backBtn.addEventListener("click", closeModal);


// =========================
// TRIVIA → INSECT FACT
// =========================
document.addEventListener("DOMContentLoaded", () => {

  const triviaCards = document.querySelectorAll(".trivia-card");
  const infoTitle = document.getElementById("answer-title");
  const infoText = document.getElementById("answer-text");

  triviaCards.forEach(card => {
    const header = card.querySelector(".trivia-header");

    if (!header) return;

    header.addEventListener("click", () => {

      const full = card.dataset.full;

      if (infoText) {
        infoText.parentElement.style.opacity = 0;

        setTimeout(() => {
          infoTitle.textContent = "INSECT FACT";
          infoText.textContent = full || "No data available.";
          infoText.parentElement.style.opacity = 1;

          // 🔊 SPEAK FACT
          speak(full);

        }, 200);
      }

    });
  });


  // =========================
  // AUTO FUN FACTS (NO STOP 
  // =========================
  const facts = [
    "Beetles make up 40 percent of all insect species.",
    "Dragonflies can fly in all directions, even backwards.",
    "Insects quietly help hold the natural world together.",
    "Ants can carry up to 50 times their body weight.",
    "Some moths don’t have mouths and live only a few days.",
    "Insects are everywhere, even when you don’t notice them.",
    "Some insects, like ants, can carry objects up to 50 times their body weight. That’s like a human lifting a car.",
    "Bees use the sun as a guide and perform a “waggle dance” to tell other bees exactly where food is. It’s like giving directions using dance moves.",
    "Some beetles have exoskeletons so tough they can survive being stepped on. Their outer shell acts like natural body armor.",
    "Crickets make their chirping sound by rubbing their wings together. It’s basically their way of singing, mostly to attract a mate.",
    "Flies see the world in slow motion compared to humans. That’s why it’s so hard to swat them, they react way faster than we do.", 
    "Ladybugs may look cute, but they are fierce predators that eat pests like aphids. Farmers actually love having them around.",
    "Only female mosquitoes bite humans and they do it to get protein for their eggs. Males? They just drink nectar.",
    "Cockroaches can live for weeks without their heads. They don’t rely on their brain the same way humans do."
    
  ];

  const autoText = document.getElementById("auto-text");

  if (autoText) {
    let index = 0;

    setInterval(() => {

      autoText.style.opacity = 0;

      setTimeout(() => {
        index = (index + 1) % facts.length;
        autoText.textContent = facts[index];
        autoText.style.opacity = 1;

        // 🔊 OPTIONAL: comment out if ayaw mo magsalita lagi
        // speak(facts[index]);

      }, 300);

    }, 3000);
  }

});

function createFirefly() {
  const firefly = document.createElement("div");
  firefly.classList.add("firefly");

  firefly.style.top = Math.random() * window.innerHeight + "px";
  firefly.style.left = Math.random() * window.innerWidth + "px";

  firefly.style.animationDuration = (5 + Math.random() * 5) + "s";

  document.body.appendChild(firefly);

  setTimeout(() => {
    firefly.remove();
  }, 10000);
}

setInterval(createFirefly, 500);

// =========================
// 🎮 GAME GLOBALS (ONLY ONCE)
// =========================
const gameScreen = document.getElementById("game-screen");

let score = 0;
let time = 30;
let combo = 0;
let gameInterval;
let insectInterval;

let highScore = localStorage.getItem("insectHighScore") || 0;


// =========================
// 🎮 GAME MENU
// =========================
function openGameMenu() {
  gameScreen.innerHTML = `
    <div class="menu-panel">

      <h1>Catch the Insects</h1>

      <p class="desc">
        You have 30 seconds to catch as many insects as possible.
      </p>

      <div class="mechanics">
        <p><b>Easy:</b> Slow insects, simple gameplay.</p>
        <p><b>Medium:</b> Faster insects + combo system.</p>
        <p><b>Hard:</b> Fake items appear (lose points).</p>
      </div>

      <div class="high-score">
        High Score: <b>${highScore}</b>
      </div>

      <div class="difficulty-select">
        <button onclick="startGame('easy')" class="diff-btn">Easy</button>
        <button onclick="startGame('medium')" class="diff-btn">Medium</button>
        <button onclick="startGame('hard')" class="diff-btn">Hard</button>
      </div>

      <button class="close-btn" onclick="closeGame()">✖</button>
    </div>
  `;

  gameScreen.classList.add("active");
}


// =========================
// 🎮 START GAME
// =========================
function startGame(mode) {

  score = 0;
  time = 30;
  combo = 0;

  gameScreen.innerHTML = `
    <div class="game-ui">

      <button class="close-btn" onclick="closeGame()">✖</button>

      <div class="topbar">
        <span>Score: <b id="score">0</b></span>
        <span>Time: <b id="time">30</b>s</span>
        <span>Combo: <b id="combo">0</b></span>
      </div>

      <div id="game-area"></div>
    </div>
  `;

  const gameArea = document.getElementById("game-area");
  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");
  const comboEl = document.getElementById("combo");

  const insects = ["🐜", "🪲", "🐞"];
  const fake = ["🍃", "💀", "🕸️"];

  let spawnSpeed = 1000;
  let insectLife = 2000;

  if (mode === "medium") {
    spawnSpeed = 700;
    insectLife = 1500;
  }

  if (mode === "hard") {
    spawnSpeed = 600;
    insectLife = 1300;
  }

  // SPAWN LOOP
  insectInterval = setInterval(() => {

    const isFake = mode === "hard" && Math.random() < 0.3;

    const el = document.createElement("div");
    el.classList.add("insect");

    el.innerText = isFake
      ? fake[Math.floor(Math.random() * fake.length)]
      : insects[Math.floor(Math.random() * insects.length)];

    const x = Math.random() * (window.innerWidth - 60);
    const y = Math.random() * (window.innerHeight - 120);

    el.style.left = x + "px";
    el.style.top = y + "px";

    el.onclick = () => {

      if (isFake) {
        score -= 1;
        combo = 0;
      } else {

        if (mode === "easy") {
          score += 1;
        }

        if (mode === "medium") {
          combo++;
          score += 1 + combo;
        }

        if (mode === "hard") {
          combo++;
          score += 2 + combo;
        }
      }

      scoreEl.textContent = score;
      comboEl.textContent = combo;

      el.remove();
    };

    gameArea.appendChild(el);

    setTimeout(() => el.remove(), insectLife);

  }, spawnSpeed);


  // TIMER
  gameInterval = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if (time <= 0) {
      endGame();
    }
  }, 1000);
}


// =========================
// 🎮 END GAME
// =========================
function endGame() {
  clearInterval(gameInterval);
  clearInterval(insectInterval);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("insectHighScore", highScore);
  }

  openGameMenu();
}


function closeGame() {
  gameScreen.classList.remove("active");
  gameScreen.innerHTML = "";

  clearInterval(gameInterval);
  clearInterval(insectInterval);
}