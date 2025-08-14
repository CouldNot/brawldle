import { setLanguage, getLanguage } from "./storage.js";

window.changeLanguage = function(lang) {
  setLanguage(lang);
  location.reload();
};

const flagMap = {
  en: "assets/flags/en.png",
  pt: "assets/flags/pt.png",
};

function updateFlag(lang) {
  const btn = document.getElementById('language');
  if (btn && flagMap[lang]) {
    btn.style.background = `url('${flagMap[lang]}') no-repeat center center`;
    btn.style.backgroundSize = 'cover';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = getLanguage();
  const select = document.getElementById('languageSelect');
  if (select) select.value = savedLang;
  updateFlag(savedLang);
});
