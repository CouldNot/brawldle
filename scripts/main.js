import { loadPreviousGame } from "./game_logic.js";
import { checkDailyReset, getLanguage } from "./storage.js";
import {
  startUpdatingWins,
  updateStats,
  updateYesterdayBrawler,
  loadLanguage,
} from "./ui.js";
import { updateSettings, updateSuggestions } from "./input_handler.js";

const langCode = getLanguage();
loadLanguage(langCode);
checkDailyReset();
updateYesterdayBrawler();
updateSuggestions();
updateSettings();
updateStats();
loadPreviousGame();
startUpdatingWins();
