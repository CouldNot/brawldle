/*
Manages localStorage operations and setting storage values.
*/

import { brawlers } from "./data.js";

const startDate = new Date('2024-11-29');
export const currentDate = new Date();

export function getHardMode() {
    return JSON.parse(localStorage.getItem('hardmode')) || false;
}

export function setHardMode(mode) {
    localStorage.setItem('hardmode', mode);
}

export function getClickToValidate() {
    // Click to validate is true by default.
    var clickToValidate = localStorage.getItem('clicktovalidate');
    if (clickToValidate === null) {
        setClickToValidate(true);
    } else {
        return JSON.parse(localStorage.getItem('clicktovalidate'));
    }
}

export function getLanguage() {
    let language = localStorage.getItem('language');

    if (!language) {
        // detect browser language (like "en-US") → take first 2 letters
        const browserLang = (navigator.language || navigator.userLanguage || 'en')
            .split('-')[0]
            .toLowerCase();

        // supported languages list
        const supported = ['en', 'pt'];
        if (!supported.includes(browserLang)) {
            language = 'en';
        } else {
            language = browserLang;
        }

        setLanguage(language);
    }
    
    return language;
}

export function setLanguage(lang) {
    localStorage.setItem('language', lang);
}


export function setClickToValidate(mode) {
    localStorage.setItem('clicktovalidate', mode);
}

export function getStoredGuesses() {
    return JSON.parse(localStorage.getItem('guesses')) || [];
}

export function saveGuess(brawlerName) {
    const guesses = getStoredGuesses();
    guesses.push(brawlerName);
    
    localStorage.setItem('guesses', JSON.stringify(guesses));
}

export function checkDailyReset() {
    const today = currentDate;
    const todayDate = today.toDateString(); // Convert current date to a consistent string format

    // Retrieve the last played date from localStorage
    const lastPlayedDate = localStorage.getItem('lastPlayedDate');

    // Check if a new day has started
    if (lastPlayedDate !== todayDate) {
        // location.reload();
        setAlreadyWon('false'); // Reset win status
        localStorage.removeItem('guesses'); // Reset guesses
        localStorage.setItem('lastPlayedDate', todayDate); // Update the last played date
        document.getElementById("field").classList.remove("disabled")
    }
}

export function getAnswer() {
    return getDailyBrawler();
}

function getDailyBrawler(offset = 6) {
    // Get the current date and remove the time part
    var date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);  // Set time to midnight
    
    // Add offset if provided (for yesterday or future date)
    date.setDate(date.getDate() + offset);
    
    // Use the date object as the seed for the shuffle
    const MS_IN_A_DAY = 86400000;
    const todaySeed = Math.floor(date.getTime() / MS_IN_A_DAY);
    
    // Shuffle based on today's seed
    const brawlersShuffled = shuffleArrayWithSeed(brawlers, todaySeed);
    
    // Select the brawler deterministically using the seed
    const index = todaySeed % brawlers.length;
    return brawlersShuffled[index].toLowerCase();
}

export function getYesterdayAnswer() {
    return getDailyBrawler(5);
}

export function setAnswer(answer) {
    localStorage.setItem('answer', answer);
}

export function getAlreadyWon() {
    return localStorage.getItem('won') === 'true';
}

export function setAlreadyWon(won) {
    localStorage.setItem('won', won);
}

export function getPuzzleNumber() {
    var date = startDate;
    return String(daysSinceStart(date));
}

export function lowercaseToBrawlerName(brawlerName) {
    let formattedName = brawlerName
        .split(' ')  // Split by spaces first
        .map(word => {
            // Split by dash within the word, apply title case to each part, then join back with the dash
            return word.split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('-');
        })
        .join(' '); // Rejoin by spaces

    return formattedName;
}

function daysSinceStart(startDate) {
    // Normalize current date to midnight
    var date = new Date(currentDate);
    date.setHours(0, 0, 0, 0); // Set time to midnight
    
    // Normalize start date to midnight
    startDate.setHours(0, 0, 0, 0); // Set time to midnight
    
    // Calculate the difference in time
    const diffInTime = date - startDate; // Time difference in milliseconds
    
    // Convert the time difference to days
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24)); // Convert to days
    
    return diffInDays;
}

function shuffleArrayWithSeed(array, seed) {
    const random = mulberry32(seed);
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// generator
function mulberry32(seed) {
    return function() {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export function getHistory() {
    return JSON.parse(localStorage.getItem('data')) || {}; // Return parsed object or an empty object
}

export function addHistory(date, details) {
    const history = getHistory(); // Get existing history as an object
    history[date] = details; // Add or update the specific date entry

    localStorage.setItem('data', JSON.stringify(history)); // Save the updated history
}
