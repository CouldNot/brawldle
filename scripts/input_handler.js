import { brawlers } from "./data.js";
import { handleFormSubmit } from "./game_logic.js";
import {
  getClickToValidate,
  getHardMode,
  getStoredGuesses,
  lowercaseToBrawlerName,
  setClickToValidate,
  setHardMode,
} from "./storage.js";
import { data } from "./data.js";

const inputField = document.getElementById("field");
const guessForm = document.getElementById("guess");

let guessedBrawlers = getStoredGuesses();

let currentIndex = -1; // To keep track of which suggestion is highlighted

function createSuggestionList() {
  let suggestionList = document.createElement("ul");
  suggestionList.id = "suggestion-list";
  suggestionList.style.listStyleType = "none";
  document.body.appendChild(suggestionList);

  return suggestionList;
}

let suggestionList = createSuggestionList();

function positionSuggestionList() {
  const rect = inputField.getBoundingClientRect();
  suggestionList.style.position = "fixed"; // Ensures consistent placement
  suggestionList.style.left = `${rect.left}px`;
  suggestionList.style.top = `${rect.bottom}px`;
  suggestionList.style.width = `${rect.width}px`;
}

function updateHighlightedItem(items) {
  items.forEach((item, index) => {
    if (index === currentIndex) {
      item.style.backgroundColor = "#f0f0f0";
    } else {
      item.style.backgroundColor = "";
    }
  });
}

export function updateSuggestions() {
  // Hide suggestion list if clicked outside
  document.addEventListener("click", (e) => {
    if (!suggestionList.contains(e.target) && e.target !== inputField) {
      suggestionList.style.display = "none";
    }
  });

  // Don't let user enter trailing or leading spaces
  inputField.addEventListener("blur", function () {
    inputField.value = inputField.value.trim();
  });

  inputField.addEventListener("keydown", function (e) {
    const items = suggestionList.querySelectorAll("li");
    if (e.key === "ArrowDown") {
      if (currentIndex < items.length - 1) {
        currentIndex++;
        updateHighlightedItem(items);
      }
    } else if (e.key === "ArrowUp") {
      if (currentIndex > 0) {
        currentIndex--;
        updateHighlightedItem(items);
      }
    } else if (e.key === "Enter") {
      if (
        currentIndex >= 0 &&
        items.length > 0 &&
        !getStoredGuesses().includes(inputField.value.toLowerCase())
      ) {
        // Get the highlighted suggestion
        const highlightedSuggestion = items[currentIndex].textContent.trim();
        inputField.value = highlightedSuggestion;
        suggestionList.style.display = "none";
        handleFormSubmit(highlightedSuggestion);

        // Reset currentIndex after submitting
        currentIndex = -1;
        e.preventDefault();
      }
    }
  });

  // Recalculate position on input, window resize, or scroll
  inputField.addEventListener("input", positionSuggestionList);
  window.addEventListener("resize", positionSuggestionList);
  window.addEventListener("scroll", positionSuggestionList);

  guessForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const items = suggestionList.querySelectorAll("li");

    if (items.length > 0 && getClickToValidate()) {
      // Use the top suggestion if it exists
      inputField.value = items[0].textContent;
    }

    const inputValue = inputField.value.trim();
    if (
      inputValue &&
      inputValue.toLowerCase() in data &&
      !guessedBrawlers.includes(inputValue.toLowerCase())
    ) {
      handleFormSubmit(inputValue);
      inputField.value = "";
    }

    suggestionList.style.display = "none"; // Hide suggestions
  });

  inputField.addEventListener("input", function () {
    const query = inputField.value.toLowerCase();
    suggestionList.innerHTML = "";

    guessedBrawlers = getStoredGuesses();

    if (query) {
      // Don't include already guessed brawlers
      const filteredSuggestions = brawlers.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(query) &&
          !guessedBrawlers.includes(suggestion.toLowerCase())
      );

      filteredSuggestions.forEach((suggestion, index) => {
        const listItem = document.createElement("li");
        listItem.style.display = "flex";
        listItem.style.alignItems = "center";
        listItem.style.padding = "0.5rem";
        listItem.style.cursor = "pointer";
        listItem.style.borderBottom = "0.13em solid #00000050";

        const pinImage = document.createElement("img");
        pinImage.src = `assets/pins/${suggestion.toLowerCase()}_pin.png`;
        pinImage.alt = `${suggestion} Pin`;
        pinImage.style.width = "2.5rem";
        pinImage.style.marginRight = "0.5em"; // Spacing between image and text
        listItem.appendChild(pinImage);

        let formattedSuggestion = lowercaseToBrawlerName(suggestion);

        listItem.appendChild(document.createTextNode(formattedSuggestion));

        listItem.addEventListener("click", () => {
          inputField.value = lowercaseToBrawlerName(suggestion);
          suggestionList.style.display = "none"; // Hide the suggestion list
          if (getClickToValidate()) {
            handleFormSubmit(suggestion);
          } else {
            inputField.focus();
          }
        });
        suggestionList.appendChild(listItem);
      });

      if (filteredSuggestions.length > 0) {
        suggestionList.style.display = "block"; // Show the suggestion list
        positionSuggestionList();
      } else {
        suggestionList.style.display = "none"; // Hide if no matches
      }
    } else {
      suggestionList.style.display = "none"; // Hide if input is empty
    }
  });
}

export function updateSettings() {
  const hard_mode_toggle = document.getElementById("hard-mode-toggle");
  const click_toggle = document.getElementById("click-toggle");

  // Remember the user's preference and update switches
  hard_mode_toggle.checked = getHardMode();
  hard_mode_toggle.dispatchEvent(new Event("change"));

  getClickToValidate();
  click_toggle.checked = getClickToValidate();
  click_toggle.dispatchEvent(new Event("change"));

  hard_mode_toggle.addEventListener("change", function () {
    // if game hasn't started
    if (getStoredGuesses().length < 1) {
      if (this.checked) {
        setHardMode(true);
      } else {
        setHardMode(false);
      }
    } else {
      // notify them if they try to change during a game
      alert("Game has already started!");
      hard_mode_toggle.checked = getHardMode(); // Reset toggle to stored value
    }
  });

  click_toggle.addEventListener("change", function () {
    setClickToValidate(click_toggle.checked);
  });
}
