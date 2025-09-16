import { getAlreadyWon, getStoredGuesses, saveGuess } from "./storage.js";
import { displayGuess, displayWin } from "./ui.js";
import { data } from "./data.js";

const inputField = document.getElementById("field");

export function loadPreviousGame() {
  let guessedBrawlers = getStoredGuesses();
  guessedBrawlers.forEach((guess) => {
    displayGuess(data[guess], guess);
  });
  if (getAlreadyWon()) {
    let win_info = document.getElementById("win-info");
    displayWin();
    win_info.style.opacity = "1";
    win_info.style.margin = "3em auto";
    win_info.classList.remove("hidden");
  }
}

export function handleFormSubmit(brawlerName) {
  saveGuess(brawlerName.toLowerCase()); // record guess to local storage

  const brawler = data[brawlerName.toLowerCase()];
  displayGuess(brawler, brawlerName);

  if (brawler) inputField.value = "";
}
