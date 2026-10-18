# 🌽 CORN Games — GitHub Repo

One repo holding all five games as plain, self-contained HTML files.
Each game is a single file with every image and sound inlined — no build
step, no server, no database. All files live at the repo root so they
upload in one batch from the GitHub web UI.

## Layout

```
corn-games/
├── index.html            ← games menu (the GitHub Pages homepage)
├── tractor-race.html
├── soccer-goal.html
├── football.html
├── buck-shot.html
└── boxing.html
```

## Upload to GitHub (browser, no command line)

1. On github.com, create a new repo named `corn-games`, set to **Public**.
2. In the new repo, click **Add file → Upload files**, then drag in all
   the files from this folder. Commit.
3. Go to **Settings → Pages** → Source: **Deploy from a branch**,
   Branch: **main**, folder: **/(root)** → Save.
4. Open `https://YOURNAME.github.io/corn-games/` — that's the games hub.

## Updating a game later

Re-export the game's latest build, then replace that game's `.html` file
in the repo (upload the new file over the old one, same name). Player
saves are untouched — they live in each player's own browser.

## Privacy

Player data (coins, XP, saves, etc.) lives only in each player's own
browser via `localStorage`. Nothing is sent to GitHub or any server.
GitHub hosts only the game code — it never sees player data.

## Notes

- The existing Muse share links keep working untouched — this repo is an
  additional home for the games, not a replacement.
- Each game file is self-contained (up to ~10 MB for Tractor Race, well
  under GitHub's 100 MB per-file limit).
