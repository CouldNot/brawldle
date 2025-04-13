![logo](https://github.com/CouldNOt/brawldle/blob/main/assets/BrawldleLogo.svg)

A daily guessing game based on the mobile game Brawl Stars by Supercell

# Features
- Keeps track of player data (local storage)
- Daily brawler for everybody through a random seed
- Basic social features through generating an emoji representation of the player game
- Hard mode by removing up/down arrow hints
- Toggleable preference for clicking suggestions to submit immediately
- Basic stats generation

# Technical stuff
This was written in basic JavaScript. It uses CSS for styling.

Data that is stored (history, user preferences, game progress) is stored completely locally and can be removed through clearing web cookies. The randomized brawler is based on a set seed and the date and is the same for everybody.
