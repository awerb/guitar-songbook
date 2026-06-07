# Make Songbook your own — in under 10 minutes

Songbook is free and open source. There is nothing to buy, no account to make, and no monthly cost. Pick the path below that matches what you actually want.

## Pick your path

| If you want to... | Use this |
|---|---|
| Just use Songbook and add your songs | **Path A: Use the live demo** (60 seconds) |
| Have your own copy at your own URL, online, forever, free | **Path B: GitHub Pages** (10 minutes) |
| Run it on a USB stick or your own laptop, totally offline | **Path C: Local file** (2 minutes) |

You don't have to know any code for any of these.

---

## Path A: Use the live demo (easiest, 60 seconds)

1. Open this URL on your phone or laptop: **https://awerb.github.io/guitar-songbook/**
2. Tap **+ Add Song** in the header.
3. Type your title, artist, chords, and lyrics. Save.

That's it. Your song is stored in your browser on your device. Nobody else can see it. To back it up, open **Library → Export to file**, save the JSON somewhere safe.

This path is perfect if you just want a songbook and don't care about owning a copy of the code. The catch: if you clear your browser data, your songs are gone unless you exported. So export occasionally.

---

## Bookmark or install it on your phone (do this, it's the best part)

Songbook works best on a phone. The whole reason it exists is to be there in your pocket when you're at a campfire or open mic. Tucking it onto your home screen turns it from "a website I have to find" into "a real-feeling app I can launch in one tap."

There are two options. **Installing** is better than just bookmarking — once installed, Songbook opens in its own window with no browser bars, has its own icon, and works completely offline. Bookmarking still works fine if you don't want a home screen icon.

### Install on iPhone or iPad (Safari)

1. Open https://awerb.github.io/guitar-songbook/ in Safari (must be Safari — won't work from Chrome on iOS).
2. Tap the **Share button** at the bottom of the screen. (It's the square with an arrow pointing up.)
3. Scroll the share sheet down. Tap **Add to Home Screen**.
4. Optionally rename it (the default "Songbook" is fine). Tap **Add** in the top right.
5. The "O" icon appears on your home screen. Tap it any time to launch.

When you launch from the home screen, Songbook opens full-screen with no Safari bars. It also works offline.

### Install on Android (Chrome)

1. Open https://awerb.github.io/guitar-songbook/ in Chrome.
2. Tap the **three-dot menu** at the top right.
3. Tap **Add to Home screen** or **Install app**, whichever is in your menu.
4. Confirm with **Install** or **Add**.
5. The "O" icon appears on your home screen.

### Install on a Mac or Windows laptop (Chrome or Edge)

1. Open https://awerb.github.io/guitar-songbook/ in Chrome or Edge.
2. Look at the right end of the address bar. There's a small icon that looks like a monitor with a down arrow, or sometimes a plus sign in a circle. Click it.
3. A prompt pops up asking if you want to install Songbook. Click **Install**.
4. Songbook opens in its own window. On Mac it shows up in your Applications folder. On Windows it shows up in your Start menu.

### Just bookmark it (works on every browser, no install)

If you don't want a home screen icon or your browser doesn't support install:

- **iPhone Safari**: Share button → **Add Bookmark** → save to Favorites.
- **Android Chrome**: three-dot menu → **Bookmark** (the star icon).
- **Mac/Windows browsers**: Cmd+D (Mac) or Ctrl+D (Windows) opens the bookmark dialog.

Then find Songbook in your bookmarks bar or favorites whenever you want to use it.

### Confirming it worked

Open the Songbook icon (or bookmark) and you should land on the splash screen. If the splash doesn't appear and you see your browser bars, the install didn't take. Most likely cause: you tried it from a browser that wasn't Safari (on iOS) or wasn't Chrome / Edge (on Android / desktop). Try again from a supported browser.

---

## Path B: Get your own free copy on the internet (recommended, ~10 minutes)

This gives you a permanent URL like `https://YOUR-USERNAME.github.io/guitar-songbook/`. You own the copy. It's free forever. No credit card. You can change it however you want.

### What you need

- A free [GitHub](https://github.com) account. Sign up at https://github.com/join. It takes about 2 minutes. You'll need to verify an email.

### Step 1: Fork the project

"Forking" makes a copy of Songbook under your own GitHub account.

1. Go to **https://github.com/awerb/guitar-songbook**.
2. Click the **Fork** button at the top right of the page.
3. On the next screen, leave everything as is and click **Create fork**.

You now have a copy at `https://github.com/YOUR-USERNAME/guitar-songbook`.

### Step 2: Turn on free hosting

GitHub Pages is GitHub's built-in free static site hosting. We're going to flip it on for your fork.

1. In your fork, click the **Settings** tab at the top of the page. (If you don't see Settings, you might need to scroll right or look in a "..." menu.)
2. In the left sidebar of Settings, click **Pages**.
3. Under **Build and deployment**, find the **Source** dropdown and select **GitHub Actions**.

That's it. Within about 30 seconds to 2 minutes, GitHub will build your site.

### Step 3: Get your URL

1. Still on the Pages settings screen, refresh the page a couple of times.
2. When it's ready, you'll see a green box near the top with your URL. It looks like `https://YOUR-USERNAME.github.io/guitar-songbook/`.
3. Click the **Visit site** button to confirm it works. You should see the Songbook splash screen.

You now have your own copy of Songbook, on your own URL, forever free.

### Step 4 (optional): Personalize it

You don't have to know how to code to do simple personalization. Through the GitHub web interface:

1. In your fork, navigate to the file you want to change (for example `README.md`).
2. Click the pencil icon ("Edit this file") at the top right of the file view.
3. Make your changes in the editor.
4. Click **Commit changes** at the top right, write a short note, click **Commit changes** again.

Within 30 to 60 seconds, your live site updates.

Some easy things to change:

| Change this | By editing this file | Look for |
|---|---|---|
| The site title (browser tab) | `index.html` | `<title>Songbook</title>` |
| The splash screen image | `assets/songbook-banner.jpg` | Upload your own image with the same filename |
| The favicon (browser tab icon) | `assets/songbook-icon.png` | Upload your own square image |
| The app name when installed to a phone | `manifest.json` | `"name": "Songbook"` |
| The README that shows on your GitHub repo page | `README.md` | Everything |

---

## Path C: Run it on your own computer (private, 2 minutes)

If you don't want any URL at all, just a personal songbook on your own machine:

1. Go to **https://github.com/awerb/guitar-songbook**.
2. Click the green **Code** button, then click **Download ZIP**.
3. Unzip the downloaded file. You'll get a folder called `guitar-songbook-main`.
4. Open the folder and double-click `index.html`. It opens in your browser.

It works offline. Your songs save to that specific browser. To back up your songs, use **Library → Export to file** like on any other version.

**One caveat:** the microphone tuner needs your browser to consider the page "secure," and opening a local file doesn't always count. If the tuner doesn't work and you want it to, the easiest fix is to install Python (which most Macs already have) and from inside the guitar-songbook folder run `python3 -m http.server 8000`, then open `http://localhost:8000` in your browser.

---

## Back up your songs (do this, seriously)

Your songs live only in the browser you added them in. Not in the cloud. Not on a server. Not in your Apple ID. If you clear your browser history, switch browsers, get a new phone, or lose your laptop without backing up, **your songs are gone**.

Good news: backup takes 10 seconds and you can do it whenever you want.

### How to back up

1. Open Songbook.
2. Tap **LIBRARY** in the header.
3. Tap **EXPORT TO FILE**.

You'll get a single JSON file named something like `songbook-library-2026-06-08.json`. Save it somewhere durable. Good choices:

- **iCloud Drive** (Mac, iPhone, iPad) — automatically syncs across your Apple devices
- **Google Drive** or **Dropbox** — same idea, works across any device
- **Email it to yourself** — a fallback that lives in your inbox forever
- **A folder you actually back up** — Time Machine, an external drive, whatever you already trust

What's NOT a great spot: your Downloads folder, your Desktop, or any place you tend to clean out.

### How often to back up

The honest answer: every time you've added a batch of songs you'd be sad to lose. A good rhythm:

- After your first 10 songs (so you know it works)
- Every time you've added 10 to 20 new songs
- Before you do anything risky like clearing browser data, factory-resetting a device, or switching browsers

It takes 10 seconds. Just do it.

### How to restore from a backup

If you ever need to bring your songs back, or move them to a new device:

1. Open Songbook on the device where you want your songs.
2. Tap **LIBRARY** in the header.
3. Tap **IMPORT & MERGE** (this adds songs to whatever is already there) or **IMPORT & REPLACE** (this wipes the current library and replaces it with the backup).
4. Pick the JSON file you exported earlier.

Done. Your songs are back.

### How to sync between your phone and your laptop

Songbook has no built-in sync (that would need a server, which would mean accounts, which would mean ads or fees). The export/import flow does the same job manually:

1. **On the source device** (the one with your latest songs): **Library → Export to file**.
2. **Get the file to the other device.** Easiest options:
   - AirDrop (Mac and iPhone)
   - Text/email the JSON to yourself
   - Save to iCloud Drive / Google Drive / Dropbox, open the file on the other device
3. **On the destination device**: **Library → Import & Merge**.

You can do this any time you've added new songs. It's not magical, but it works.

### Backing up someone else's songs

A friend send you their JSON? Same flow: **Library → Import & Merge**. Their songs land in your library and yours stay where they were.

### What's actually in the backup file

The JSON is human-readable. Open it in any text editor and you'll see your songs in plain English. This is on purpose: even if Songbook disappeared tomorrow, your library would still be readable and convertible to anything else. No proprietary format, no lock-in.

---

## Sharing Songbook with someone else

There are three ways to share:

1. **Send them the live demo URL** (https://awerb.github.io/guitar-songbook/) — works on any phone or computer, no signup, free.
2. **Send them this SETUP.md file** — they can pick their own path.
3. **Send them your own JSON library** — export with **Library → Export to file**, send the JSON, they import with **Library → Import & Merge**. They get your songs, you keep yours.

Songbook is MIT licensed, which means you can do almost anything with it: customize it, sell a customized version, give it away. All we ask is that you don't strip out the LICENSE file and that you don't sue us if something goes wrong.

---

## Troubleshooting

**"My site shows a 404 on github.io."** Wait 2 minutes after enabling Pages, then refresh. If it still doesn't work, go back to Settings → Pages and verify Source is set to "GitHub Actions."

**"I changed a file but my site still shows the old version."** Two things to check: (1) refresh the page with Cmd+Shift+R (Mac) or Ctrl+F5 (Windows) to bypass your browser cache, (2) confirm the deploy actually ran by going to the **Actions** tab of your fork — you should see a green checkmark next to your most recent commit.

**"The microphone tuner says it can't access my mic."** Your browser is blocking it. Click the lock icon to the left of the URL bar, find Microphone, set it to Allow, then refresh. On iOS the very first tap on the page is also required to unlock audio (this is a Safari rule for all websites).

**"My songs disappeared."** They live in the specific browser on the specific device you added them on. Clearing your browser data, switching browsers, or using a different device all start you fresh. The safe move: **Library → Export to file** every time you add a batch of songs, save the JSON somewhere durable like iCloud Drive or Dropbox.

**"I want to merge my songs from my phone onto my laptop."** On your phone, **Library → Export to file**, email or text the JSON to yourself. On your laptop, **Library → Import & Merge**, pick the file. Same goes the other direction.

**"I want to get help."** Open an issue at https://github.com/awerb/guitar-songbook/issues. Describe what you tried, what you saw, and what you expected.

---

That's everything. Welcome to your own songbook.
