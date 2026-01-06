# College Football Empire (Web Prototype)

A browser-based college football dynasty game featuring:
- Playable strategy-based games
- Full Dynasty (recruiting, NIL, budget, facilities, prestige)
- Stadium upgrades and new builds
- FCS → FBS promotion / FBS relegation
- Designed for iPad (Safari) and desktop
- Shareable: each visitor has their own save via localStorage

## Files
- index.html
- style.css
- game.js

## How to Host on GitHub Pages
1. Create a new GitHub repository.
2. Upload these files to the root.
3. Go to **Settings → Pages**.
4. Set Source to **Deploy from a branch** → `main` → `/root`.
5. Save. Your game will be live at:
   `https://github.com/theonlyschajer-glitch/Hi.git`

## Notes
- The current build includes sample teams. Expand `Data.teams` in `game.js` to include ALL FBS and FCS teams.
- Systems are modular and ready for adding:
  - Full schedules, conferences, playoffs
  - Transfer portal
  - Detailed NIL markets
  - Promotion/relegation rules
