import {
  addHistory,
  currentDate,
  getAlreadyWon,
  getAnswer,
  getHardMode,
  getHistory,
  getPuzzleNumber,
  getStoredGuesses,
  getYesterdayAnswer,
  lowercaseToBrawlerName,
} from "./storage.js";
import { triggerConfetti } from "./confetti.js";
import { data } from "./data.js";
import { countdown } from "./clock.js";
import { CountUp } from "./countUp.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  getDoc,
  doc,
  increment,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB0x8ELOz3j_kZ2mXtvbR_U97_R94ECcGc",
  authDomain: "brawldle-75e53.firebaseapp.com",
  projectId: "brawldle-75e53",
  storageBucket: "brawldle-75e53.firebasestorage.app",
  messagingSenderId: "1055931220936",
  appId: "1:1055931220936:web:f319329b95cc47f22c76fd",
  measurementId: "G-W6703FH0XF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const flipDelay = 450;
const winScrollDelay = 1500;

let answer = getAnswer();
let alreadyWon = getAlreadyWon();

const inputField = document.getElementById("field");
const guessForm = document.getElementById("guess");
const categories = [
  "brawler",
  "rarity",
  "class",
  "movement",
  "range",
  "reload",
  "released",
];

if (alreadyWon) {
  // don't let user guess again if they have already won
  inputField.classList.add("disabled");
}

const website_notice_date = document.getElementById("website-notice-date");
website_notice_date.innerHTML = new Date().getFullYear().toString();

function updateWinsAlreadyCounter(newWins) {
  let counter = document.getElementById("wins-already");
  let winsCount = Number(counter.innerHTML);
  if (newWins !== winsCount) {
    if (winsCount == 0) {
      var countUp = new CountUp("wins-already", newWins);
      countUp.start();
    } else {
      var countUp = new CountUp("wins-already", newWins, {
        startVal: winsCount,
      });
      countUp.start();
    }
  }
}

export function updateYesterdayBrawler() {
  let yesterday_answer = getYesterdayAnswer();
  const yesterday_icon = document.getElementById("yesterday-icon");
  const yesterday_number = document.getElementById("yesterday-number");

  yesterday_icon.src = `assets/pins/${yesterday_answer.toLowerCase()}_pin.png`;
  yesterday_number.innerHTML = `#${getPuzzleNumber() - 1}`;

  const yesterday_name = document.getElementById("yesterday-name");
  yesterday_name.innerHTML = lowercaseToBrawlerName(yesterday_answer);
}

export function displayGuess(brawler, brawlerName) {
  inputField.classList.add("disabled"); // Disable inputs
  inputField.blur(); // Remove focus from the input field
  guessForm.classList.add("disabled");

  const correct_categories = categories.map(
    (category) => brawler[category] === data[answer][category]
  );

  const list = document.getElementById("list");
  const row = document.createElement("div");
  row.classList.add("row");

  const rarityLevels = [
    "starting brawler",
    "rare",
    "super rare",
    "epic",
    "mythic",
    "legendary",
    "ultra legendary",
  ];
  const movementLevels = ["very slow", "slow", "normal", "fast", "very fast"];
  const rangeLevels = ["very short", "short", "normal", "long", "very long"];
  const reloadLevels = ["very slow", "slow", "normal", "fast", "very fast"];

  categories.forEach((category, index) => {
    const square = document.createElement("div");
    square.classList.add("square", "stroke");

    if (category === "brawler") {
      // Display portrait for the brawler category
      square.classList.add("portrait");
      square.style.backgroundImage = `url("assets/portraits/${brawlerName.toLowerCase()}_portrait.png")`;
    } else {
      square.innerHTML = brawler[category];
      square.classList.add("flip");
      square.style.animationDelay = `${flipDelay * index}ms`;

      if (category === "released" && !getHardMode()) {
        // Display up/down arrows for release year
        const releasedDiff =
          Number(brawler["released"]) - Number(data[answer]["released"]);
        square.classList.add(
          releasedDiff < 0 ? "up" : releasedDiff > 0 ? "down" : "green"
        );
      } else if (category === "rarity" && !getHardMode()) {
        // Display up/down arrows for rarity
        const guessIndex = rarityLevels.indexOf(
          brawler["rarity"].toLowerCase()
        );
        const answerIndex = rarityLevels.indexOf(
          data[answer]["rarity"].toLowerCase()
        );
        if (guessIndex < answerIndex) {
          square.classList.add("up");
        } else if (guessIndex > answerIndex) {
          square.classList.add("down");
        } else {
          square.classList.add("green");
        }
      } else if (category === "movement" && !getHardMode()) {
        // Display up/down arrows for movement speed
        const guessIndex = movementLevels.indexOf(
          brawler["movement"].toLowerCase()
        );
        const answerIndex = movementLevels.indexOf(
          data[answer]["movement"].toLowerCase()
        );
        if (guessIndex < answerIndex) {
          square.classList.add("up");
        } else if (guessIndex > answerIndex) {
          square.classList.add("down");
        } else {
          square.classList.add("green");
        }
      } else if (category == "range" && !getHardMode()) {
        // Display up/down arrows for movement speed
        const guessIndex = rangeLevels.indexOf(brawler["range"].toLowerCase());
        const answerIndex = rangeLevels.indexOf(
          data[answer]["range"].toLowerCase()
        );
        if (guessIndex < answerIndex) {
          square.classList.add("up");
        } else if (guessIndex > answerIndex) {
          square.classList.add("down");
        } else {
          square.classList.add("green");
        }
      } else if (category == "reload" && !getHardMode()) {
        // Display up/down arrows for movement speed
        const guessIndex = reloadLevels.indexOf(
          brawler["reload"].toLowerCase()
        );
        const answerIndex = reloadLevels.indexOf(
          data[answer]["reload"].toLowerCase()
        );
        if (guessIndex < answerIndex) {
          square.classList.add("up");
        } else if (guessIndex > answerIndex) {
          square.classList.add("down");
        } else {
          square.classList.add("green");
        }
      } else {
        // General category comparison
        square.classList.add(correct_categories[index] ? "green" : "red");
      }
    }

    row.appendChild(square);
  });

  list.insertBefore(row, list.children[1]);

  if (!list.querySelector(".fadeIn")) {
    document.getElementById("label-row").classList.add("fadeIn"); // Fade in category labels if not already done
  }

  const lastSquare = row.lastElementChild;
  lastSquare.addEventListener("animationend", async () => {
    // Re-enable input and form once animation ends
    inputField.classList.remove("disabled");
    guessForm.classList.remove("disabled");

    // Trigger win condition if all categories are correct
    if (correct_categories.every(Boolean)) {
      await onWin();
    }
  });
}

export async function displayWin() {
  const win_portrait = document.getElementById("win-portrait");
  const win_brawler_name = document.getElementById("win-brawler-name");
  const win_num_of_tries = document.getElementById("win-num-of-tries");
  const avg_num_of_tries = document.getElementById("avg-num-of-tries");

  win_portrait.style.backgroundImage = `url("assets/portraits/${answer}_portrait.png")`;
  win_brawler_name.textContent = answer.toUpperCase();
  win_num_of_tries.textContent = String(getStoredGuesses().length);
  avg_num_of_tries.textContent = parseFloat(
    String(await getAvgTries())
  ).toFixed(1);

  let share_button = document.getElementById("win-share-button");
  share_button.onclick = onShareButtonClicked;

  countdown();
}

async function onWin() {
  // update data
  const today = currentDate;
  const formattedDate = `${
    today.getMonth() + 1
  }-${today.getDate()}-${today.getFullYear()}`; // Format: MM-DD-YYYY
  addHistory(formattedDate, { won: true, guesses: getStoredGuesses().length });

  updateStats();

  inputField.classList.add("disabled"); // disable inputs
  inputField.blur(); // Remove focus from the input field
  guessForm.classList.add("disabled");

  const win_info = document.getElementById("win-info");
  await displayWin();

  if (!getAlreadyWon()) {
    // Call this function when the user wins
    writeToFirebase(String(getStoredGuesses().length))
      .then(() => {
        console.log("Firebase updated with win count!");
      })
      .catch((error) => {
        console.error("Error updating Firebase:", error);
      });

    alreadyWon = true;
    localStorage.setItem("won", alreadyWon);
    triggerConfetti();
    setTimeout(() => {
      win_info.style.margin = "3em auto";
      win_info.classList.add("fadeIn");
      win_info.classList.remove("hidden");
      win_info.scrollIntoView({ behavior: "smooth", block: "center" });
    }, winScrollDelay);
  }
}

async function writeToFirebase(num_tries) {
  const today = new Date();
  const dateKey = today.toLocaleDateString("en-CA"); // Gets the current date in YYYY-MM-DD format

  const docRef = doc(db, "main", dateKey); // Reference to the "main" collection with the date as the document ID

  // Get the current document data
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // If document exists, increment the "won" field
    await setDoc(
      docRef,
      {
        won: increment(1),
        totalTries: increment(num_tries),
      },
      { merge: true }
    ); // Merge to only update "won" field
  } else {
    // If document doesn't exist, create it with won field set to 1
    await setDoc(docRef, {
      won: 1,
      totalTries: num_tries,
    });
  }
}

export async function getWins() {
  //   const wins_already = document.getElementById("wins-already");
  const container = document.getElementById("wins-already-text");
  const today = new Date();

  // Adjust the date to reflect local time by getting the YYYY-MM-DD from the local date
  const dateKey = today.toLocaleDateString("en-CA"); // 'en-CA' returns the date in YYYY-MM-DD format

  const docRef = doc(db, "main", dateKey); // Reference to the document for the current day in the "main" collection

  // Get the document snapshot
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const wins = docSnap.data().won;
    updateWinsAlreadyCounter(wins);
    if (wins == 1) container.innerHTML = " person already found out!";
    else container.textContent = " people already found out!";
  } else {
    updateWinsAlreadyCounter(0);
    container.textContent = " people already found out!";
  }
}

export async function getAvgTries() {
  const today = new Date();
  const dateKey = today.toLocaleDateString("en-CA");
  const docRef = doc(db, "main", dateKey);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const totalTries = docSnap.data().totalTries;
    const wins = docSnap.data().won;

    return Number(totalTries) / Number(wins);
  } else {
    return 0;
  }
}

export function startUpdatingWins() {
  getWins();
  setInterval(async () => {
    getWins();
  }, 5000); // 5000ms (5 seconds)
}

function onShareButtonClicked() {
  const text = guessesToEmojis(getStoredGuesses(), answer);

  // // Copy the text to the clipboard
  navigator.clipboard.writeText(text);

  // Change text to "copied"
  let share_button_text = document.getElementById("win-share-button-text");
  let share_button_icon = document.getElementById("win-share-button-icon");

  share_button_icon.style.display = "none";
  share_button_text.innerHTML = "Copied!";

  // After 2 seconds
  setTimeout(function () {
    share_button_icon.style.display = "block";
    share_button_text.innerHTML = "Share";
  }, 1500);
}

function guessesToEmojis(guesses, answer) {
  let emojis = "";
  const maxLines = 6; // Maximum lines to show in the output

  for (let i in guesses) {
    let guess = guesses[i];
    let correct = categories.map(
      (category) => data[guess][category] === data[answer][category]
    );
    correct = correct.splice(1);
    for (let j in correct) {
      if (j < 5) {
        if (correct[j]) emojis += "🟩";
        else emojis += "🟥";
      } else {
        if (
          Number(data[guess]["released"]) > Number(data[answer]["released"])
        ) {
          emojis += "⬇️";
        } else if (
          Number(data[guess]["released"]) < Number(data[answer]["released"])
        ) {
          emojis += "⬆️";
        } else {
          emojis += "🟩";
        }
      }
    }
    emojis += " \n";
  }
  emojis += `I solved Brawldle #${getPuzzleNumber()} in ${
    guesses.length
  } guesses! 🎮\n`;

  // Truncate and reverse the emoji string
  const emojiLines = emojis.trim().split("\n");
  if (emojiLines.length > maxLines) {
    const visibleLines = Math.floor(maxLines / 2);
    const topLines = emojiLines.slice(0, visibleLines);
    const bottomLines = emojiLines.slice(-visibleLines);
    emojis = [...topLines, "...", ...bottomLines].reverse().join("\n");
  } else {
    emojis = emojiLines.reverse().join("\n");
  }

  return emojis.trim();
}

export function updateStats() {
  const games_won = document.getElementById("games-won");
  const average_guesses = document.getElementById("average-guesses");
  const current_streak = document.getElementById("current-streak");
  const max_streak = document.getElementById("max-streak");
  const streak_number = document.getElementById("streak-number");

  const history = getHistory(); // Get the full history

  // 1. Games Won: Since history only includes won games, just count the number of entries
  const wonGames = Object.keys(history).length; // Total number of games won
  games_won.innerHTML = String(wonGames);

  // 2. Average Guesses: Calculate the average number of guesses from the history
  const totalGuesses = Object.values(history).reduce(
    (acc, entry) => acc + entry.guesses,
    0
  );
  const averageGuesses =
    wonGames > 0 ? (totalGuesses / wonGames).toFixed(2) : 0;
  average_guesses.innerHTML = averageGuesses;

  // 3. Streaks: Calculate current streak and max streak
  let currentStreakLength = 0;
  let maxStreakLength = 0;
  let streak = 0;
  let previousDate = null;

  // Sort the history by date to check consecutive days
  const sortedHistoryDates = Object.keys(history).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Loop through the history and calculate streaks
  sortedHistoryDates.forEach((date) => {
    const entry = history[date];

    // Check if the current date is consecutive to the previous one
    const currentDate = new Date(date);
    if (previousDate) {
      const difference = (currentDate - previousDate) / (1000 * 60 * 60 * 24); // difference in days
      if (difference === 1) {
        streak++; // It's a consecutive win
      } else {
        // Reset streak if not consecutive
        streak = 1; // Start a new streak
      }
    } else {
      streak = 1; // Start with the first game
    }

    // Update current and max streak
    currentStreakLength = streak;
    maxStreakLength = Math.max(maxStreakLength, streak);

    previousDate = currentDate; // Set previous date for next iteration
  });

  // Update the UI with streak information
  streak_number.innerHTML = String(currentStreakLength);
  current_streak.innerHTML = String(currentStreakLength); // Current streak is the most recent streak
  max_streak.innerHTML = String(maxStreakLength); // Max streak is the longest consecutive streak
}
