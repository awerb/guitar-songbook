const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const cssPath = path.join(root, "styles", "main.css");
const jsPath = path.join(root, "js", "app.js");
const libraryPath = path.join(root, "js", "library.js");
const onboardingPath = path.join(root, "js", "onboarding.js");
const samplesPath = path.join(root, "data", "sample-songs.js");
const scalesPath = path.join(root, "js", "scales.js");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("index.html loads extracted stylesheet and scripts", () => {
  const html = read(indexPath);

  assert.match(html, /<link rel="stylesheet" href="styles\/main\.css">/);
  assert.match(html, /<script src="data\/sample-songs\.js"><\/script>/);
  assert.match(html, /<script src="js\/library\.js"><\/script>/);
  assert.match(html, /<script src="js\/onboarding\.js"><\/script>/);
  assert.match(html, /<script src="js\/app\.js"><\/script>/);
  assert.doesNotMatch(html, /<style>/);
});

test("index.html uses the Songbook brand", () => {
  const html = read(indexPath);
  assert.match(html, /<title>Songbook<\/title>/);
  // Brand surfaces as either the SONGBOOK wordmark image or the text aria-label
  assert.match(html, /Songbook|SONGBOOK/);
  assert.doesNotMatch(html, /Werbach/i);
});

test("index.html ships PWA + Open Graph wiring", () => {
  const html = read(indexPath);
  assert.match(html, /<link rel="manifest" href="manifest\.json">/);
  assert.match(html, /apple-mobile-web-app-capable/);
  assert.match(html, /og:image/);
  // Service worker is registered from JS, not directly in HTML
  const onboarding = read(onboardingPath);
  assert.match(onboarding, /serviceWorker/, "service worker must be registered");
});

test("manifest.json is valid and references the icon", () => {
  const manifest = JSON.parse(read(path.join(root, "manifest.json")));
  assert.equal(manifest.name, "Songbook");
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
  manifest.icons.forEach(i => assert.ok(i.src.includes("songbook-icon")));
});

test("starter pack JSON files are valid", () => {
  const songsDir = path.join(root, "songs");
  const files = fs.readdirSync(songsDir).filter(f => f.endsWith(".json"));
  assert.ok(files.length >= 3, `expected at least 3 packs, found ${files.length}`);
  files.forEach(file => {
    const pack = JSON.parse(read(path.join(songsDir, file)));
    assert.ok(pack.name, `${file} must have a name`);
    assert.ok(Array.isArray(pack.songs) && pack.songs.length > 0, `${file} must have songs`);
    pack.songs.forEach(s => {
      assert.ok(s.title, `${file}: every song needs a title`);
      // License must be either public domain OR personal practice (private repo)
      const hasValidLicense = s.license && (/public domain/i.test(s.license) || /personal practice/i.test(s.license));
      assert.ok(hasValidLicense, `${file}: every song must have a valid license (PD or personal practice)`);
    });
  });
});

test("stylesheet contains key app sections", () => {
  const css = read(cssPath);

  assert.match(css, /\.header\s*\{/);
  assert.match(css, /\.song-list\s*\{/);
  assert.match(css, /\.tuner-section\s*\{/);
  assert.match(css, /\.metronome-section\s*\{/);
  assert.match(css, /\.welcome-banner\s*\{/);
  assert.match(css, /\.of-modal\s*\{/);
});

test("app script exposes core songbook flow", () => {
  const js = read(jsPath);

  assert.match(js, /function init\(\)/);
  assert.match(js, /function showSongById\(id\)/);
  assert.match(js, /function showTab\(tab\)/);
  assert.match(js, /window\.addEventListener\('DOMContentLoaded', init\);/);
  assert.match(js, /SongbookLibrary/);
  assert.doesNotMatch(js, /WERBACH_SONGS/);
});

test("library module exposes the public API", () => {
  const js = read(libraryPath);
  assert.match(js, /window\.SongbookLibrary\s*=/);
  assert.match(js, /getAllSongs/);
  assert.match(js, /addSong/);
  assert.match(js, /updateSong/);
  assert.match(js, /deleteSong/);
  assert.match(js, /exportToFile/);
  assert.match(js, /importFromFile/);
});

test("onboarding module wires the welcome banner", () => {
  const js = read(onboardingPath);
  assert.match(js, /window\.SongbookOnboarding\s*=/);
  assert.match(js, /showBannerIfNeeded/);
});

test("sample songs catalog ships exactly the curated 10 PD entries", () => {
  const songs = read(samplesPath);
  const titleCount = (songs.match(/title:\s*"/g) || []).length;
  assert.equal(titleCount, 10, `expected 10 sample songs, found ${titleCount}`);
  assert.match(songs, /window\.SONGBOOK_SAMPLE_SONGS/);
  assert.match(songs, /Public Domain/i);
  assert.doesNotMatch(songs, /Werbach/i);
});

test("scripts pass JavaScript syntax check", () => {
  [jsPath, libraryPath, onboardingPath, samplesPath, scalesPath].forEach(function (p) {
    const result = spawnSync(process.execPath, ["--check", p], {
      cwd: root,
      encoding: "utf8"
    });
    assert.equal(result.status, 0, `${p}: ${result.stderr || result.stdout}`);
  });
});

// ---------------------------------------------------------------
// Scale chart theory
// ---------------------------------------------------------------
const Theory = require(scalesPath);

function frets(shape) {
  // high e first, like the chart: "e:1,4 B:1,4 ..."
  return [5, 4, 3, 2, 1, 0].map(s => shape.notes.filter(n => n.s === s).map(n => n.f).join(",")).join(" ");
}
function shapeOf(key, scale, letter) {
  return Theory.buildShapes(key, scale).find(s => s.letter === letter);
}

test("index.html loads the scale chart", () => {
  const html = read(indexPath);
  assert.match(html, /<script src="js\/scales\.js"><\/script>/);
  assert.match(html, /id="sxBoard"/);
  assert.match(read(path.join(root, "service-worker.js")), /scales\.js/);
});

test("F minor pentatonic CAGED shapes match the reference chart", () => {
  assert.equal(frets(shapeOf(5, "minor-pentatonic", "E")), "1,4 1,4 1,3 1,3 1,3 1,4");
  assert.equal(frets(shapeOf(5, "minor-pentatonic", "D")), "4,6 4,6 3,5 3,6 3,6 4,6");
  assert.equal(frets(shapeOf(5, "minor-pentatonic", "C")), "6,8 6,9 5,8 6,8 6,8 6,8");
  assert.equal(frets(shapeOf(5, "minor-pentatonic", "A")), "8,11 9,11 8,10 8,10 8,11 8,11");
  assert.equal(frets(shapeOf(5, "minor-pentatonic", "G")), "11,13 11,13 10,13 10,13 11,13 11,13");
  // buttons run up the neck: E D C A G for F minor
  assert.deepEqual(Theory.buildShapes(5, "minor-pentatonic").map(s => s.letter), ["E", "D", "C", "A", "G"]);
});

test("C major pentatonic D shape matches the reference chart", () => {
  assert.equal(frets(shapeOf(0, "major-pentatonic", "D")), "10,12 10,13 9,12 10,12 10,12 10,12");
});

test("G major E shape is the standard 2nd position fingering", () => {
  assert.equal(frets(shapeOf(7, "major", "E")), "2,3,5 3,5 2,4,5 2,4,5 2,3,5 2,3,5");
});

test("scales are spelled with the right letters", () => {
  assert.deepEqual(Theory.scaleInfo(5, "minor-pentatonic").notes.map(n => n.name), ["F", "Ab", "Bb", "C", "Eb"]);
  assert.deepEqual(Theory.scaleInfo(7, "minor-pentatonic").notes.map(n => n.name), ["G", "Bb", "C", "D", "F"]);
  assert.deepEqual(Theory.scaleInfo(9, "minor-blues").notes.map(n => n.name), ["A", "C", "D", "Eb", "E", "G"]);
  assert.deepEqual(Theory.scaleInfo(7, "major").notes.map(n => n.name), ["G", "A", "B", "C", "D", "E", "F#"]);
  assert.deepEqual(Theory.scaleInfo(5, "minor-blues").notes.map(n => n.name), ["F", "Ab", "Bb", "B", "C", "Eb"]);
  assert.deepEqual(Theory.scaleInfo(3, "minor-blues").notes.map(n => n.name), ["Eb", "Gb", "Ab", "A", "Bb", "Db"]);
  assert.deepEqual(Theory.scaleInfo(8, "harmonic-minor").notes.map(n => n.name), ["Ab", "Bb", "Cb", "Db", "Eb", "Fb", "G"]);
  // no double sharps or flats anywhere
  Theory.SCALES.forEach(sc => { for (let k = 0; k < 12; k++) {
    Theory.scaleInfo(k, sc.id).notes.forEach(n => assert.doesNotMatch(n.name, /bb|##/, `${sc.id} key ${k}: ${n.name}`));
  } });
});

test("every shape holds only scale notes, each pitch once, frets >= 0", () => {
  Theory.SCALES.forEach(sc => {
    for (let key = 0; key < 12; key++) {
      const info = Theory.scaleInfo(key, sc.id);
      const shapes = Theory.buildShapes(key, sc.id);
      assert.equal(shapes.length, 5);
      assert.deepEqual(shapes.map(s => s.letter).sort(), ["A", "C", "D", "E", "G"]);
      shapes.forEach(sh => {
        const pitches = sh.notes.map(n => n.midi);
        assert.equal(new Set(pitches).size, pitches.length, `${sc.id} key ${key} ${sh.letter}: duplicate pitch`);
        sh.notes.forEach(n => {
          assert.ok(n.f >= 0);
          assert.ok(info.pcs.has(n.midi % 12), `${sc.id} key ${key} ${sh.letter}: note outside scale`);
          assert.equal(Theory.OPEN_MIDI[n.s] + n.f, n.midi);
        });
        assert.ok(sh.max - sh.min <= 5, `${sc.id} key ${key} ${sh.letter}: spans ${sh.min}-${sh.max}`);
      });
    }
  });
});

test("practice patterns", () => {
  assert.deepEqual(Theory.patternIndexes(4, "updown"), [0, 1, 2, 3, 2, 1, 0]);
  assert.deepEqual(Theory.patternIndexes(5, "groups3"), [0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 2, 1, 2, 1, 0]);
  assert.deepEqual(Theory.patternIndexes(6, "thirds"), [0, 2, 1, 3, 2, 4, 3, 5, 4, 2, 3, 1, 2, 0]);
});

test("diatonic chords", () => {
  assert.deepEqual(Theory.diatonicChords(7, "major").map(c => c.name), ["G", "Am", "Bm", "C", "D", "Em", "F#dim"]);
  assert.deepEqual(Theory.diatonicChords(9, "minor-pentatonic").map(c => c.roman), ["i", "ii°", "bIII", "iv", "v", "bVI", "bVII"]);
});
