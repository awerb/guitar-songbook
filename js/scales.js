/**
 * Songbook scale chart and practice tool.
 *
 * Two parts:
 *   1. ScaleTheory: pure functions (no DOM) that spell scales, build the five
 *      CAGED shapes for any key and scale, and generate practice sequences.
 *      Exported for Node so tests can check the shapes.
 *   2. The UI: an interactive fretboard in the SCALES tab with shape buttons,
 *      note/interval/finger labels, chord tones, and a playback engine that
 *      plays the selected shape and shows it as tab.
 *
 * String index convention inside this file: 0 = low E ... 5 = high e.
 * The fretboard draws high e at the top, like a tab.
 */
(function (global) {
    'use strict';

    // ---------------------------------------------------------------
    // Theory
    // ---------------------------------------------------------------
    const OPEN_MIDI = [40, 45, 50, 55, 59, 64];
    const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
    const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const NATURAL_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

    const INTERVAL_SEMITONES = {
        '1': 0, 'b2': 1, '2': 2, '#2': 3, 'b3': 3, '3': 4, '4': 5, '#4': 6,
        'b5': 6, '5': 7, '#5': 8, 'b6': 8, '6': 9, 'b7': 10, '7': 11
    };

    // Key spellings: index = pitch class. Minor-type keys prefer sharps on
    // C#/G#, major-type keys prefer flats on Db/Ab.
    const KEYS = [
        { pc: 0, major: 'C', minor: 'C', label: 'C' },
        { pc: 1, major: 'Db', minor: 'C#', label: 'C#/Db' },
        { pc: 2, major: 'D', minor: 'D', label: 'D' },
        { pc: 3, major: 'Eb', minor: 'Eb', label: 'Eb' },
        { pc: 4, major: 'E', minor: 'E', label: 'E' },
        { pc: 5, major: 'F', minor: 'F', label: 'F' },
        { pc: 6, major: 'F#', minor: 'F#', label: 'F#/Gb' },
        { pc: 7, major: 'G', minor: 'G', label: 'G' },
        { pc: 8, major: 'Ab', minor: 'G#', label: 'Ab/G#' },
        { pc: 9, major: 'A', minor: 'A', label: 'A' },
        { pc: 10, major: 'Bb', minor: 'Bb', label: 'Bb' },
        { pc: 11, major: 'B', minor: 'B', label: 'B' }
    ];

    // quality decides which pentatonic box frames the CAGED shapes and how
    // the shapes are named (by the major or the minor chord shape).
    const SCALES = [
        { id: 'minor-pentatonic', name: 'Minor Pentatonic', group: 'Pentatonic', quality: 'minor', intervals: ['1', 'b3', '4', '5', 'b7'] },
        { id: 'major-pentatonic', name: 'Major Pentatonic', group: 'Pentatonic', quality: 'major', intervals: ['1', '2', '3', '5', '6'] },
        { id: 'minor-blues', name: 'Minor Blues', group: 'Blues', quality: 'minor', intervals: ['1', 'b3', '4', 'b5', '5', 'b7'] },
        { id: 'major-blues', name: 'Major Blues', group: 'Blues', quality: 'major', intervals: ['1', '2', 'b3', '3', '5', '6'] },
        { id: 'major', name: 'Major (Ionian)', group: 'Modes', quality: 'major', intervals: ['1', '2', '3', '4', '5', '6', '7'] },
        { id: 'dorian', name: 'Dorian', group: 'Modes', quality: 'minor', intervals: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
        { id: 'phrygian', name: 'Phrygian', group: 'Modes', quality: 'minor', intervals: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
        { id: 'lydian', name: 'Lydian', group: 'Modes', quality: 'major', intervals: ['1', '2', '3', '#4', '5', '6', '7'] },
        { id: 'mixolydian', name: 'Mixolydian', group: 'Modes', quality: 'major', intervals: ['1', '2', '3', '4', '5', '6', 'b7'] },
        { id: 'aeolian', name: 'Natural Minor (Aeolian)', group: 'Modes', quality: 'minor', intervals: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
        { id: 'locrian', name: 'Locrian', group: 'Modes', quality: 'minor', intervals: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
        { id: 'harmonic-minor', name: 'Harmonic Minor', group: 'Other', quality: 'minor', intervals: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
        { id: 'melodic-minor', name: 'Melodic Minor', group: 'Other', quality: 'minor', intervals: ['1', '2', 'b3', '4', '5', '6', '7'] }
    ];

    const MINOR_PENTA = [0, 3, 5, 7, 10];
    // Shape letter for minor-pentatonic box 1..5 (box 1 = root on the 6th string).
    const MINOR_SHAPE_NAMES = ['E', 'D', 'C', 'A', 'G'];
    // The same five boxes named by the relative major's chord shapes.
    const MAJOR_SHAPE_NAMES = ['G', 'E', 'D', 'C', 'A'];
    const SHAPE_COLORS = { C: '#e8609e', A: '#39c08c', G: '#4f9cf0', E: '#a874f2', D: '#f0a23c' };

    function mod(n, m) { return ((n % m) + m) % m; }

    function getScale(id) {
        return SCALES.find(s => s.id === id) || SCALES[0];
    }

    function rootName(keyPc, scale) {
        const key = KEYS[mod(keyPc, 12)];
        return scale.quality === 'major' ? key.major : key.minor;
    }

    function noteNamePc(name) {
        let pc = NATURAL_PC[name[0]];
        for (let i = 1; i < name.length; i++) pc += name[i] === '#' ? 1 : -1;
        return mod(pc, 12);
    }

    /** Spell an interval above a root using letter names (A minor b3 = C, F minor b3 = Ab). */
    function spell(root, interval) {
        const degree = parseInt(interval.replace(/[#b]/g, ''), 10);
        const letter = LETTERS[(LETTERS.indexOf(root[0]) + degree - 1) % 7];
        const target = mod(noteNamePc(root) + INTERVAL_SEMITONES[interval], 12);
        const diff = mod(target - NATURAL_PC[letter] + 6, 12) - 6;
        return letter + (diff > 0 ? '#'.repeat(diff) : 'b'.repeat(-diff));
    }

    // Enharmonic root spellings tried for each pitch class; the cleanest wins.
    const ROOT_OPTIONS = { 1: ['Db', 'C#'], 3: ['Eb', 'D#'], 6: ['F#', 'Gb'], 8: ['Ab', 'G#'], 10: ['Bb', 'A#'] };
    // Blue notes can be read either way (b5 or #4, b3 or #2).
    const ENHARMONIC_INTERVAL = { 'b5': '#4', 'b3': '#2' };
    const AWKWARD = /^(Cb|Fb|B#|E#)$/;

    function spellScale(root, scale) {
        const rootPc = noteNamePc(root);
        return scale.intervals.map(iv => {
            let name = spell(root, iv);
            let label = iv;
            const isBlueNote = (scale.group === 'Blues') && ENHARMONIC_INTERVAL[iv] &&
                !(scale.id === 'minor-blues' && iv === 'b3');
            if (isBlueNote && (/bb|##/.test(name) || AWKWARD.test(name))) {
                label = ENHARMONIC_INTERVAL[iv];
                name = spell(root, label);
            }
            return { interval: label, name, pc: mod(rootPc + INTERVAL_SEMITONES[iv], 12) };
        });
    }

    function spellingCost(notes) {
        return notes.reduce((c, n) => c +
            (/bb|##/.test(n.name) ? 10 : 0) + (AWKWARD.test(n.name) ? 3 : 0) + (n.name.length > 1 ? 1 : 0), 0);
    }

    /** Spelled notes and intervals of a scale. */
    function scaleInfo(keyPc, scaleId) {
        const scale = getScale(scaleId);
        const preferred = rootName(keyPc, scale);
        // Harmonic and melodic minor keep the usual minor-key name (G# harmonic
        // minor with its F double sharp), as teachers write them.
        const fixedRoot = scale.id === 'harmonic-minor' || scale.id === 'melodic-minor';
        const options = fixedRoot ? [preferred]
            : [preferred].concat((ROOT_OPTIONS[mod(keyPc, 12)] || []).filter(r => r !== preferred));
        let root = preferred;
        let notes = spellScale(preferred, scale);
        options.slice(1).forEach(r => {
            const alt = spellScale(r, scale);
            if (spellingCost(alt) < spellingCost(notes)) { root = r; notes = alt; }
        });
        const rootPc = noteNamePc(root);
        const byPc = {};
        notes.forEach(n => { byPc[n.pc] = n; });
        return { scale, root, rootPc, notes, byPc, pcs: new Set(notes.map(n => n.pc)) };
    }

    /**
     * Minor pentatonic box (0..4) for a minor root. Built by pitch: start on
     * the low E string at the box's first note and take two consecutive scale
     * notes per string going up. Returns 12 positions.
     */
    function pentatonicBox(minorRootPc, box) {
        const pcs = MINOR_PENTA.map(i => mod(minorRootPc + i, 12));
        const startPc = pcs[box];
        let midi = OPEN_MIDI[0] + mod(startPc - 4, 12);
        const pitches = [];
        while (pitches.length < 12) {
            if (pcs.includes(mod(midi, 12))) pitches.push(midi);
            midi++;
        }
        let notes = pitches.map((m, i) => {
            const s = Math.floor(i / 2);
            return { s, f: m - OPEN_MIDI[s], midi: m };
        });
        if (notes.some(n => n.f < 0)) notes = notes.map(n => ({ s: n.s, f: n.f + 12, midi: n.midi + 12 }));
        return notes;
    }

    /**
     * One CAGED shape of any scale. The matching pentatonic box sets the
     * fret window; every scale note in that pitch range is placed on the
     * string that keeps it inside the window.
     */
    function buildShape(info, box) {
        const quality = info.scale.quality;
        const minorRoot = quality === 'major' ? mod(info.rootPc + 9, 12) : info.rootPc;
        const frame = pentatonicBox(minorRoot, box);
        const boxMin = Math.min(...frame.map(n => n.f));
        const boxMax = Math.max(...frame.map(n => n.f));
        const framePitch = {};
        frame.forEach(n => { framePitch[n.midi] = n; });
        const lowP = frame[0].midi;
        const highP = frame[frame.length - 1].midi;

        const out = [];
        for (let p = lowP; p <= highP; p++) {
            if (!info.pcs.has(mod(p, 12))) continue;
            if (framePitch[p]) { out.push({ s: framePitch[p].s, f: framePitch[p].f, midi: p }); continue; }
            let best = null;
            for (let s = 0; s < 6; s++) {
                const f = p - OPEN_MIDI[s];
                if (f < 0 || f < boxMin - 1 || f > boxMax + 1) continue;
                const score = f < boxMin ? boxMin - f : (f > boxMax ? f - boxMax : 0);
                const onString = frame.filter(n => n.s === s).map(n => n.midi);
                const inside = onString.length && p > Math.min(...onString) && p < Math.max(...onString);
                const rank = score * 10 + (inside ? 0 : 1);
                if (!best || rank < best.rank) best = { s, f, rank };
            }
            if (best) out.push({ s: best.s, f: best.f, midi: p });
        }
        // Outer strings: also include scale notes in the window below the
        // first note (low E) and above the last note (high e).
        for (let f = boxMin; f <= boxMax; f++) {
            const lo = OPEN_MIDI[0] + f;
            if (lo < lowP && info.pcs.has(mod(lo, 12))) out.push({ s: 0, f, midi: lo });
            const hi = OPEN_MIDI[5] + f;
            if (hi > highP && info.pcs.has(mod(hi, 12))) out.push({ s: 5, f, midi: hi });
        }
        out.sort((a, b) => a.midi - b.midi);
        out.forEach(n => { n.pc = mod(n.midi, 12); });

        const names = quality === 'major' ? MAJOR_SHAPE_NAMES : MINOR_SHAPE_NAMES;
        const letter = names[box];
        const min = Math.min(...out.map(n => n.f));
        const max = Math.max(...out.map(n => n.f));
        assignFingers(out);
        const rootStrings = out.filter(n => n.pc === info.rootPc).map(n => n.s);
        return { letter, box, notes: out, min, max, boxMin, boxMax, color: SHAPE_COLORS[letter], rootStrings };
    }

    /**
     * One finger per fret. The hand sits on the 4-fret span that covers the
     * most notes (on a tie, the higher span, so the index reaches back).
     * Notes outside the span are stretches. A string never uses the same
     * finger for two frets; where it would, that string's fingering slides
     * to fit, and a string spanning more than 4 frets is marked as a shift.
     */
    function assignFingers(notes) {
        const fretted = notes.filter(n => n.f > 0);
        notes.forEach(n => { n.finger = 0; n.shift = false; });
        if (!fretted.length) return;
        const lo = Math.min(...fretted.map(n => n.f));
        const hi = Math.max(...fretted.map(n => n.f));
        let p = lo;
        if (hi - lo > 3) {
            let bestCover = -1;
            for (let c = lo; c <= hi - 3; c++) {
                const cover = fretted.filter(n => n.f >= c && n.f <= c + 3).length;
                if (cover >= bestCover) { bestCover = cover; p = c; }
            }
        }
        fretted.forEach(n => { n.finger = Math.min(4, Math.max(1, n.f - p + 1)); });
        for (let s = 0; s < 6; s++) {
            const row = fretted.filter(n => n.s === s).sort((a, b) => a.f - b.f);
            const ok = row.every((n, i) => i === 0 || n.finger > row[i - 1].finger);
            if (ok) continue;
            const fmin = row[0].f, fmax = row[row.length - 1].f;
            if (fmax - fmin <= 3) {
                if (fmin < p) row.forEach(n => { n.finger = n.f - fmin + 1; });
                else row.forEach(n => { n.finger = 4 - (fmax - n.f); });
            } else {
                row.forEach((n, i) => {
                    n.shift = true;
                    if (i === 0) n.finger = 1;
                    else if (i === row.length - 1) n.finger = 4;
                    else n.finger = Math.min(3, Math.max(2, n.f - p + 1, row[i - 1].finger + 1));
                });
            }
        }
    }

    /** All five shapes, sorted by position on the neck (low to high). */
    function buildShapes(keyPc, scaleId) {
        const info = scaleInfo(keyPc, scaleId);
        const shapes = [0, 1, 2, 3, 4].map(b => buildShape(info, b));
        shapes.sort((a, b) => a.min - b.min || a.boxMin - b.boxMin);
        return shapes;
    }

    /** Every scale note on the neck from fret 0 to maxFret. */
    function fullNeck(keyPc, scaleId, maxFret) {
        const info = scaleInfo(keyPc, scaleId);
        const out = [];
        for (let s = 0; s < 6; s++) {
            for (let f = 0; f <= maxFret; f++) {
                const midi = OPEN_MIDI[s] + f;
                if (info.pcs.has(mod(midi, 12))) out.push({ s, f, midi, pc: mod(midi, 12) });
            }
        }
        return out;
    }

    // Practice patterns over a pitch-ordered list of notes.
    const PATTERNS = [
        { id: 'updown', name: 'Up and down' },
        { id: 'up', name: 'Up only' },
        { id: 'down', name: 'Down only' },
        { id: 'groups3', name: 'Groups of 3' },
        { id: 'groups4', name: 'Groups of 4' },
        { id: 'thirds', name: 'Thirds' }
    ];

    function patternIndexes(n, id) {
        const up = [...Array(n).keys()];
        const idx = [];
        if (n === 0) return idx;
        if (id === 'up') return up;
        if (id === 'down') return up.slice().reverse();
        if (id === 'updown') return up.concat(up.slice(0, -1).reverse());
        if (id === 'groups3' || id === 'groups4') {
            const g = id === 'groups3' ? 3 : 4;
            if (n < g) return up;
            for (let i = 0; i + g <= n; i++) for (let j = 0; j < g; j++) idx.push(i + j);
            // Start the way down one note below the top so the turn does not repeat.
            for (let i = n - 2; i - g + 1 >= 0; i--) for (let j = 0; j < g; j++) idx.push(i - j);
            return idx;
        }
        if (id === 'thirds') {
            if (n < 3) return up;
            for (let i = 0; i + 2 < n; i++) idx.push(i, i + 2);
            for (let i = n - 2; i - 2 >= 0; i--) idx.push(i, i - 2);
            return idx;
        }
        return up;
    }

    function sequenceFor(notes, patternId) {
        const sorted = notes.slice().sort((a, b) => a.midi - b.midi);
        return patternIndexes(sorted.length, patternId).map(i => sorted[i]);
    }

    // Diatonic chords (triads or 7ths) from the scale itself (7 notes) or its
    // parent scale. Blues scales get the dominant I7, IV7 and V7 of a blues.
    const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const SEVENTH_TYPES = {
        '4,7,11': { suffix: 'maj7', roman: 'maj7', minor: false },
        '4,7,10': { suffix: '7', roman: '7', minor: false },
        '3,7,10': { suffix: 'm7', roman: '7', minor: true },
        '3,6,10': { suffix: 'm7b5', roman: 'ø7', minor: true },
        '3,6,9': { suffix: 'dim7', roman: '°7', minor: true },
        '3,7,11': { suffix: 'm(maj7)', roman: '(maj7)', minor: true },
        '4,8,11': { suffix: 'maj7#5', roman: '+maj7', minor: false }
    };

    function diatonicChords(keyPc, scaleId, type) {
        let info = scaleInfo(keyPc, scaleId);
        if (info.scale.group === 'Blues') {
            return [['1', 'I'], ['4', 'IV'], ['5', 'V']].map(([iv, roman], i) => {
                const root = spell(info.root, iv);
                const names = ['1', '3', '5', 'b7'].map(x => spell(root, x));
                return {
                    degree: i, roman: roman + '7', name: root + '7',
                    rootPc: noteNamePc(root), tones: names.map(noteNamePc), names
                };
            });
        }
        if (info.notes.length !== 7) {
            info = scaleInfo(keyPc, info.scale.quality === 'major' ? 'major' : 'aeolian');
        }
        const n = info.notes;
        return n.map((note, i) => {
            const third = n[(i + 2) % 7];
            const fifth = n[(i + 4) % 7];
            const seventh = n[(i + 6) % 7];
            const t = mod(third.pc - note.pc, 12);
            const f = mod(fifth.pc - note.pc, 12);
            const acc = note.interval.replace(/[0-9]/g, '');
            if (type === 'sevenths') {
                const sv = mod(seventh.pc - note.pc, 12);
                const kind = SEVENTH_TYPES[t + ',' + f + ',' + sv] || { suffix: '?', roman: '?', minor: false };
                const base = kind.minor ? ROMAN[i].toLowerCase() : ROMAN[i];
                return {
                    degree: i, roman: acc + base + kind.roman, name: note.name + kind.suffix, rootPc: note.pc,
                    tones: [note.pc, third.pc, fifth.pc, seventh.pc],
                    names: [note.name, third.name, fifth.name, seventh.name]
                };
            }
            let quality = 'other', suffix = '?';
            if (t === 4 && f === 7) { quality = 'maj'; suffix = ''; }
            else if (t === 3 && f === 7) { quality = 'min'; suffix = 'm'; }
            else if (t === 3 && f === 6) { quality = 'dim'; suffix = 'dim'; }
            else if (t === 4 && f === 8) { quality = 'aug'; suffix = 'aug'; }
            let roman = ROMAN[i];
            if (quality === 'min' || quality === 'dim') roman = roman.toLowerCase();
            if (quality === 'dim') roman += '°';
            if (quality === 'aug') roman += '+';
            return {
                degree: i,
                roman: acc + roman,
                name: note.name + suffix,
                rootPc: note.pc,
                tones: [note.pc, third.pc, fifth.pc],
                names: [note.name, third.name, fifth.name]
            };
        });
    }

    const CHORD_INTERVAL = { 0: 'R', 3: 'b3', 4: '3', 6: 'b5', 7: '5', 8: '#5', 9: 'bb7', 10: 'b7', 11: '7' };
    const GENERIC_INTERVAL = ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

    const ScaleTheory = {
        OPEN_MIDI, STRING_NAMES, KEYS, SCALES, PATTERNS, SHAPE_COLORS,
        getScale, rootName, spell, scaleInfo, pentatonicBox, buildShape, buildShapes, assignFingers,
        fullNeck, patternIndexes, sequenceFor, diatonicChords, mod
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ScaleTheory;
    }
    if (typeof document === 'undefined') return;

    // ---------------------------------------------------------------
    // Audio: Karplus-Strong plucked string, cached per pitch
    // ---------------------------------------------------------------
    let ctx = null;
    let master = null;
    const bufferCache = {};

    function audio() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            master = ctx.createGain();
            master.gain.value = 0.55;
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 5200;
            master.connect(lp);
            lp.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function pluckBuffer(midi) {
        if (bufferCache[midi]) return bufferCache[midi];
        const sr = ctx.sampleRate;
        const freq = 440 * Math.pow(2, (midi - 69) / 12);
        const len = Math.floor(sr * 1.8);
        const buf = ctx.createBuffer(1, len, sr);
        const data = buf.getChannelData(0);
        const period = Math.max(2, Math.round(sr / freq - 0.5));
        const ring = new Float32Array(period);
        for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
        const decay = 0.996;
        let idx = 0;
        for (let i = 0; i < len; i++) {
            const next = (idx + 1) % period;
            const v = ring[idx];
            data[i] = v;
            ring[idx] = decay * 0.5 * (v + ring[next]);
            idx = next;
        }
        // The averaging filter adds half a sample of delay: actual pitch is
        // sr / (period + 0.5). Correct it on playback.
        bufferCache[midi] = { buf, rate: freq * (period + 0.5) / sr };
        return bufferCache[midi];
    }

    function playPluck(midi, when, dur) {
        const c = audio();
        const { buf, rate } = pluckBuffer(midi);
        const src = c.createBufferSource();
        src.buffer = buf;
        src.playbackRate.value = rate;
        const g = c.createGain();
        const t = when || c.currentTime;
        const hold = Math.max(0.25, dur || 1.2);
        g.gain.setValueAtTime(0.9, t);
        g.gain.setTargetAtTime(0, t + hold, 0.08);
        src.connect(g);
        g.connect(master);
        src.start(t);
        src.stop(t + hold + 0.6);
    }

    function playClick(when, accent) {
        const c = audio();
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.frequency.value = accent ? 1600 : 1100;
        g.gain.setValueAtTime(accent ? 0.35 : 0.22, when);
        g.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(when);
        osc.stop(when + 0.06);
    }

    // ---------------------------------------------------------------
    // UI state
    // ---------------------------------------------------------------
    const STORE_KEY = 'songbook.scales.v1';
    // The engine knows more scales and patterns; the screen shows the ones a
    // beginner to intermediate player needs.
    const UI_SCALES = [
        ['minor-pentatonic', 'Minor Pentatonic'],
        ['major-pentatonic', 'Major Pentatonic'],
        ['minor-blues', 'Blues'],
        ['major', 'Major'],
        ['aeolian', 'Natural Minor']
    ];
    const UI_PATTERNS = [['updown', 'Up and down'], ['groups3', 'Groups of 3'], ['thirds', 'Thirds']];
    function scaleLabel(id) {
        const hit = UI_SCALES.find(x => x[0] === id);
        return hit ? hit[1] : getScale(id).name;
    }
    const DEFAULTS = {
        key: 9, scale: 'minor-pentatonic', labels: 'notes', shapes: [], combine: false,
        zoom: true, pattern: 'updown', sub: 2, bpm: 80, click: true, loop: true, chord: null, chordType: 'triads'
    };
    const state = Object.assign({}, DEFAULTS);
    try {
        const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
        if (saved && typeof saved === 'object') Object.assign(state, saved);
    } catch (e) { /* storage unavailable */ }
    let hadSaved = false;
    try { hadSaved = !!localStorage.getItem(STORE_KEY); } catch (e) { /* ignore */ }
    if (!Array.isArray(state.shapes)) state.shapes = [];
    if (!UI_SCALES.some(x => x[0] === state.scale)) state.scale = DEFAULTS.scale;
    if (!UI_PATTERNS.some(x => x[0] === state.pattern)) state.pattern = DEFAULTS.pattern;
    state.chordType = 'triads';
    state.sub = 2;
    state.loop = true;
    state.zoom = true;
    // On a phone the full neck is too small to read from a music stand,
    // so a first visit opens on the shape with the root on the 6th string.
    if (!hadSaved && window.innerWidth < 700) state.shapes = ['E'];
    state.chord = null;
    state.focus = false;

    function save() {
        try {
            const { chord, focus, ...rest } = state;
            localStorage.setItem(STORE_KEY, JSON.stringify(rest));
        } catch (e) { /* ignore */ }
    }

    let model = null;
    const player = { playing: false, seq: [], index: 0, nextTime: 0, timer: null, beat: 0, visualTimers: [], step: 0 };

    function el(id) { return document.getElementById(id); }

    function computeModel() {
        const info = scaleInfo(state.key, state.scale);
        const shapes = buildShapes(state.key, state.scale);
        const maxShapeFret = Math.max(...shapes.map(s => s.max));
        const maxFret = Math.max(15, maxShapeFret);
        const chords = diatonicChords(state.key, state.scale, state.chordType);
        // Thirds skip unevenly through the 6-note blues scales.
        const isBlues = info.scale.group === 'Blues';
        if (isBlues && state.pattern === 'thirds') state.pattern = 'updown';
        const thirdsOpt = document.querySelector('#sxPattern option[value="thirds"]');
        if (thirdsOpt) thirdsOpt.disabled = isBlues;
        // drop selections that no longer exist (all five letters always exist)
        state.shapes = state.shapes.filter(l => shapes.some(s => s.letter === l));
        if (state.chord !== null && !chords[state.chord]) state.chord = null;
        model = { info, shapes, maxFret, full: fullNeck(state.key, state.scale, maxFret), chords };
    }

    function selectedShapes() {
        return model.shapes.filter(s => state.shapes.includes(s.letter));
    }

    function visibleNotes() {
        const sel = selectedShapes();
        if (!sel.length) return model.full.map(n => Object.assign({}, n));
        const map = new Map();
        sel.forEach(sh => sh.notes.forEach(n => {
            const k = n.s + '-' + n.f;
            if (!map.has(k)) map.set(k, Object.assign({}, n));
        }));
        return [...map.values()];
    }

    function fretRange() {
        const sel = selectedShapes();
        if (!sel.length || !state.zoom) return [0, model.maxFret];
        const min = Math.min(...sel.map(s => s.min));
        const max = Math.max(...sel.map(s => s.max));
        let lo = Math.max(0, min - 1);
        let hi = max + 1;
        while (hi - lo < 5) { if (lo > 0) lo--; else hi++; }
        return [lo, hi];
    }

    function activeChord() {
        return state.chord === null ? null : model.chords[state.chord];
    }

    function labelFor(n) {
        const chord = activeChord();
        if (state.labels === 'intervals') {
            if (chord) {
                const semis = mod(n.pc - chord.rootPc, 12);
                if (chord.tones.includes(n.pc)) return CHORD_INTERVAL[semis];
                const majorThird = chord.tones.includes(mod(chord.rootPc + 4, 12));
                return semis === 6 && majorThird ? '#4' : GENERIC_INTERVAL[semis];
            }
            const note = model.info.byPc[n.pc];
            return note ? (note.interval === '1' ? 'R' : note.interval) : '';
        }
        if (state.labels === 'fingers' && n.finger !== undefined) return n.f === 0 ? 'O' : String(n.finger);
        const note = model.info.byPc[n.pc];
        if (note) return note.name;
        if (chord) {
            const i = chord.tones.indexOf(n.pc);
            if (i >= 0) return chord.names[i];
        }
        return '';
    }

    // ---------------------------------------------------------------
    // Fretboard SVG
    // ---------------------------------------------------------------
    const G = { labelW: 26, openW: 42, fretW: 56, rowH: 40, top: 22, bottom: 40, r: 16.5 };
    const SVG_NS = 'http://www.w3.org/2000/svg';

    function geometry(lo, hi) {
        const first = Math.max(1, lo);
        const x0 = G.labelW + (lo === 0 ? G.openW : 0);
        const cells = hi - first + 1;
        return {
            lo, hi, first, x0,
            width: x0 + cells * G.fretW + 10,
            height: G.top + 5 * G.rowH + G.bottom,
            cx: f => (f === 0 ? G.labelW + G.openW / 2 : x0 + (f - first) * G.fretW + G.fretW / 2),
            y: s => G.top + (5 - s) * G.rowH
        };
    }

    // Rounded orthogonal outline that wraps a shape's notes string by string.
    function outlinePath(shape, geo, inset) {
        const pad = G.r + 5 + inset;
        const rows = [];
        for (let s = 5; s >= 0; s--) {
            const fs = shape.notes.filter(n => n.s === s && n.f >= geo.lo && n.f <= geo.hi).map(n => n.f);
            if (!fs.length) return null;
            rows.push({ y: geo.y(s), l: geo.cx(Math.min(...fs)) - pad, r: geo.cx(Math.max(...fs)) + pad });
        }
        const half = G.rowH / 2 - 1 + inset * 0.3;
        const pts = [];
        pts.push([rows[0].l, rows[0].y - half], [rows[0].r, rows[0].y - half]);
        for (let i = 0; i < rows.length; i++) {
            const yb = i < rows.length - 1 ? (rows[i].y + rows[i + 1].y) / 2 : rows[i].y + half;
            pts.push([rows[i].r, yb]);
            if (i < rows.length - 1) pts.push([rows[i + 1].r, yb]);
        }
        pts.push([rows[rows.length - 1].l, rows[rows.length - 1].y + half]);
        for (let i = rows.length - 1; i >= 0; i--) {
            const yb = i > 0 ? (rows[i].y + rows[i - 1].y) / 2 : rows[i].y - half;
            pts.push([rows[i].l, yb]);
            if (i > 0) pts.push([rows[i - 1].l, yb]);
        }
        // remove duplicate and collinear points
        const clean = [];
        pts.forEach(p => {
            const last = clean[clean.length - 1];
            if (!last || Math.abs(last[0] - p[0]) > 0.01 || Math.abs(last[1] - p[1]) > 0.01) clean.push(p);
        });
        if (clean.length > 1) {
            const a = clean[0], b = clean[clean.length - 1];
            if (Math.abs(a[0] - b[0]) < 0.01 && Math.abs(a[1] - b[1]) < 0.01) clean.pop();
        }
        const poly = clean.filter((p, i) => {
            const a = clean[(i - 1 + clean.length) % clean.length];
            const b = clean[(i + 1) % clean.length];
            return !((Math.abs(a[0] - p[0]) < 0.01 && Math.abs(b[0] - p[0]) < 0.01) ||
                     (Math.abs(a[1] - p[1]) < 0.01 && Math.abs(b[1] - p[1]) < 0.01));
        });
        const R = 9;
        let d = '';
        poly.forEach((p, i) => {
            const a = poly[(i - 1 + poly.length) % poly.length];
            const b = poly[(i + 1) % poly.length];
            const la = Math.hypot(p[0] - a[0], p[1] - a[1]);
            const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
            const ra = Math.min(R, la / 2), rb = Math.min(R, lb / 2);
            const p1 = [p[0] + (a[0] - p[0]) * ra / la, p[1] + (a[1] - p[1]) * ra / la];
            const p2 = [p[0] + (b[0] - p[0]) * rb / lb, p[1] + (b[1] - p[1]) * rb / lb];
            d += (i === 0 ? 'M' : 'L') + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) +
                 ' Q' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' ';
        });
        return d + 'Z';
    }

    function svgEl(tag, attrs, text) {
        const node = document.createElementNS(SVG_NS, tag);
        Object.keys(attrs).forEach(k => node.setAttribute(k, attrs[k]));
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function renderBoard() {
        const host = el('sxBoard');
        if (!host) return;
        const [lo, hi] = fretRange();
        const geo = geometry(lo, hi);
        const svg = svgEl('svg', {
            viewBox: '0 0 ' + geo.width + ' ' + geo.height,
            class: 'sx-svg',
            role: 'img',
            'aria-label': model.info.root + ' ' + model.info.scale.name + ' fretboard, frets ' + lo + ' to ' + hi
        });
        svg.style.minWidth = Math.round(geo.width * 0.8) + 'px';
        svg.style.maxWidth = Math.round(geo.width * 1.45) + 'px';

        const yTop = geo.y(5), yBot = geo.y(0);
        const right = geo.x0 + (hi - geo.first + 1) * G.fretW;

        // inlays
        const single = [3, 5, 7, 9, 15, 17, 19, 21];
        for (let f = geo.first; f <= hi; f++) {
            const cx = geo.cx(f);
            if (single.includes(f)) svg.appendChild(svgEl('circle', { cx, cy: (yTop + yBot) / 2, r: 5, class: 'sx-inlay' }));
            if (f === 12 || f === 24) {
                svg.appendChild(svgEl('circle', { cx, cy: geo.y(4) + G.rowH / 2, r: 5, class: 'sx-inlay' }));
                svg.appendChild(svgEl('circle', { cx, cy: geo.y(1) - G.rowH / 2, r: 5, class: 'sx-inlay' }));
            }
        }
        // frets
        for (let f = geo.first - 1; f <= hi; f++) {
            const x = geo.x0 + (f - geo.first + 1) * G.fretW;
            const isNut = f === 0;
            svg.appendChild(svgEl('line', { x1: x, x2: x, y1: yTop, y2: yBot, class: isNut ? 'sx-nut' : 'sx-fret' }));
        }
        // strings
        for (let s = 0; s < 6; s++) {
            const y = geo.y(s);
            svg.appendChild(svgEl('line', { x1: geo.x0, x2: right, y1: y, y2: y, class: 'sx-string', 'stroke-width': 0.8 + (5 - s) * 0.28 }));
            svg.appendChild(svgEl('text', { x: 11, y: y + 5, class: 'sx-string-label' }, s === 5 ? 'e' : STRING_NAMES[s]));
        }
        // fret numbers
        for (let f = lo; f <= hi; f++) {
            if (f === 0) continue;
            svg.appendChild(svgEl('text', { x: geo.cx(f), y: geo.y(0) + G.r + 21, class: 'sx-fret-num' + (single.includes(f) || f === 12 ? ' marked' : '') }, String(f)));
        }

        // outlines
        const sel = selectedShapes();
        sel.forEach((sh, i) => {
            const d = outlinePath(sh, geo, (i % 2) * 2);
            if (d) svg.appendChild(svgEl('path', { d, class: 'sx-outline', stroke: sh.color }));
        });

        // notes
        const chord = activeChord();
        const notes = visibleNotes();
        if (state.labels === 'fingers') {
            sel.forEach(sh => sh.notes.forEach(sn => {
                const n = notes.find(v => v.s === sn.s && v.f === sn.f);
                if (n && n.finger === undefined) n.finger = sn.finger;
            }));
        }
        const ghosts = [];
        notes.concat(ghosts).forEach(n => {
            if (n.f < lo || n.f > hi) return;
            const isRoot = n.pc === model.info.rootPc;
            const isChordTone = chord ? chord.tones.includes(n.pc) : false;
            const isChordRoot = chord ? n.pc === chord.rootPc : false;
            let cls = 'sx-note';
            if (n.ghost) cls += ' ghost';
            else if (chord) cls += isChordRoot ? ' chord-root' : (isChordTone ? ' chord-tone' : ' dim');
            else if (isRoot) cls += ' root';
            const g = svgEl('g', { class: cls, 'data-pos': n.s + '-' + n.f, 'data-midi': n.midi, tabindex: '-1' });
            const cx = geo.cx(n.f), cy = geo.y(n.s);
            g.appendChild(svgEl('circle', { cx, cy, r: G.r + 4, class: 'sx-ring' }));
            g.appendChild(svgEl('circle', { cx, cy, r: G.r, class: 'sx-dot' }));
            const label = labelFor(n);
            g.appendChild(svgEl('text', { x: cx, y: cy + 5.5, class: 'sx-label' + (label.length > 2 ? ' small' : '') }, label));
            svg.appendChild(g);
        });

        host.innerHTML = '';
        host.appendChild(svg);
        markPlaying();
    }

    // ---------------------------------------------------------------
    // Controls
    // ---------------------------------------------------------------
    function buildStaticControls() {
        const keySel = el('sxKey');
        keySel.innerHTML = KEYS.map(k => '<option value="' + k.pc + '">' + k.label + '</option>').join('');
        const scaleSel = el('sxScale');
        scaleSel.innerHTML = UI_SCALES.map(([id, name]) => '<option value="' + id + '">' + name + '</option>').join('');
        el('sxPattern').innerHTML = UI_PATTERNS.map(([id, name]) => '<option value="' + id + '">' + name + '</option>').join('');

        keySel.addEventListener('change', () => { state.key = parseInt(keySel.value, 10); state.chord = null; update(true); });
        scaleSel.addEventListener('change', () => { state.scale = scaleSel.value; state.chord = null; update(true); });
        el('sxPattern').addEventListener('change', e => { state.pattern = e.target.value; update(true); });

        document.querySelectorAll('#sxLabels button').forEach(b => {
            b.addEventListener('click', () => { state.labels = b.dataset.mode; update(false); });
        });
        el('sxPrev').addEventListener('click', () => stepShape(-1));
        el('sxNext').addEventListener('click', () => stepShape(1));
        el('sxCombine').addEventListener('change', e => {
            state.combine = e.target.checked;
            if (!state.combine && state.shapes.length > 1) state.shapes = [state.shapes[state.shapes.length - 1]];
            update(true);
        });
        el('sxClick').addEventListener('change', e => { state.click = e.target.checked; save(); });
        el('sxPlay').addEventListener('click', togglePlay);
        el('sxFocus').addEventListener('click', () => setFocus(!state.focus));
        el('sxFocusExit').addEventListener('click', () => setFocus(false));
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && state.focus) requestWakeLock();
        });
        el('sxBpmDown').addEventListener('click', () => setBpm(state.bpm - 5));
        el('sxBpmUp').addEventListener('click', () => setBpm(state.bpm + 5));
        el('sxBpm').addEventListener('change', e => setBpm(parseInt(e.target.value, 10)));

        el('sxBoard').addEventListener('pointerdown', e => {
            const g = e.target.closest('.sx-note');
            if (!g) return;
            playPluck(parseInt(g.dataset.midi, 10), 0, 0.9);
            g.classList.add('tapped');
            setTimeout(() => g.classList.remove('tapped'), 250);
        });

        document.addEventListener('keydown', e => {
            const section = el('scalesSection');
            if (!section || section.style.display !== 'block') return;
            if (/INPUT|SELECT|TEXTAREA/.test((e.target.tagName || ''))) return;
            if (e.key === 'ArrowRight') { stepShape(1); e.preventDefault(); }
            else if (e.key === 'ArrowLeft') { stepShape(-1); e.preventDefault(); }
            else if (e.key === ' ') { togglePlay(); e.preventDefault(); }
            else if (e.key === 'f' || e.key === 'F') { setFocus(!state.focus); e.preventDefault(); }
            else if (e.key === 'Escape' && state.focus) { setFocus(false); }
        });
    }

    // Focus mode: hide everything but the fretboard, tab and play bar,
    // and keep the screen awake while practicing.
    let wakeLock = null;
    function requestWakeLock() {
        if (!('wakeLock' in navigator) || wakeLock) return;
        navigator.wakeLock.request('screen').then(lock => {
            wakeLock = lock;
            lock.addEventListener('release', () => { wakeLock = null; });
        }).catch(() => { /* not allowed; ignore */ });
    }
    function releaseWakeLock() {
        if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
    }
    function setFocus(on) {
        state.focus = !!on;
        if (state.focus) requestWakeLock(); else releaseWakeLock();
        update(false);
        window.scrollTo(0, 0);
    }

    function setBpm(v) {
        if (!isFinite(v)) v = DEFAULTS.bpm;
        state.bpm = Math.max(30, Math.min(260, Math.round(v)));
        el('sxBpm').value = state.bpm;
        save();
    }

    function stepShape(dir) {
        const letters = model.shapes.map(s => s.letter);
        let i;
        if (!state.shapes.length) i = dir > 0 ? 0 : letters.length - 1;
        else {
            const cur = letters.indexOf(state.shapes[state.shapes.length - 1]);
            i = cur + dir;
            if (i < 0 || i >= letters.length) i = -1; // wrap back to Full
        }
        state.shapes = i === -1 ? [] : [letters[i]];
        update(true);
    }

    function clickShape(letter) {
        if (letter === null) state.shapes = [];
        else if (state.combine) {
            state.shapes = state.shapes.includes(letter)
                ? state.shapes.filter(l => l !== letter)
                : state.shapes.concat(letter);
        } else {
            state.shapes = [letter];
        }
        update(true);
    }

    function renderShapeButtons() {
        const host = el('sxShapeBtns');
        host.innerHTML = '';
        const full = document.createElement('button');
        full.type = 'button';
        full.className = 'sx-shape-btn full' + (state.shapes.length ? '' : ' active');
        full.textContent = 'All';
        full.setAttribute('aria-pressed', String(!state.shapes.length));
        full.addEventListener('click', () => clickShape(null));
        host.appendChild(full);
        model.shapes.forEach(sh => {
            const b = document.createElement('button');
            b.type = 'button';
            const on = state.shapes.includes(sh.letter);
            b.className = 'sx-shape-btn' + (on ? ' active' : '');
            b.style.setProperty('--shape', sh.color);
            b.textContent = sh.letter;
            b.title = sh.letter + ' shape, frets ' + sh.min + ' to ' + sh.max;
            b.setAttribute('aria-pressed', String(on));
            b.addEventListener('click', () => clickShape(sh.letter));
            host.appendChild(b);
        });
    }

    const ORD = ['6th (low E)', '5th (A)', '4th (D)', '3rd (G)', '2nd (B)', '1st (high e)'];
    function joinList(a) {
        return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
    }
    function renderCaption() {
        const sel = selectedShapes();
        const cap = el('sxCaption');
        if (!sel.length) {
            cap.textContent = 'Tap a shape, then press Play.';
            return;
        }
        cap.textContent = sel.map(sh => sh.letter + ' shape · frets ' + sh.min + ' to ' + sh.max).join('  ·  ') +
            ' · red = root';
    }

    function renderFormula() {
        el('sxFormula').innerHTML = model.info.notes.map(n =>
            '<span class="sx-formula-note' + (n.interval === '1' ? ' root' : '') + '">' +
            '<strong>' + n.name + '</strong><em>' + (n.interval === '1' ? 'R' : n.interval) + '</em></span>'
        ).join('');
    }

    function renderChords() {
        const host = el('sxChords');
        host.innerHTML = '';
        const off = document.createElement('button');
        off.type = 'button';
        off.className = 'sx-chord-btn' + (state.chord === null ? ' active' : '');
        off.textContent = 'Off';
        off.addEventListener('click', () => { state.chord = null; update(false); });
        host.appendChild(off);
        model.chords.forEach((c, i) => {
            // Diminished chords are rare for beginners; leave them out.
            if (/dim|m7b5/.test(c.name)) return;
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'sx-chord-btn' + (state.chord === i ? ' active' : '');
            b.textContent = c.name;
            b.title = c.name + ': ' + c.names.join(' ');
            b.addEventListener('click', () => { state.chord = state.chord === i ? null : i; update(false); });
            host.appendChild(b);
        });
        const chord = activeChord();
        el('sxChordNote').textContent = chord
            ? chord.name + ' = ' + chord.names.join(' ') + '. Land on the bright notes.'
            : 'Pick a chord to light up its notes.';
    }

    function syncInputs() {
        el('sxKey').value = String(state.key);
        el('sxScale').value = state.scale;
        el('sxPattern').value = state.pattern;
        el('sxBpm').value = state.bpm;
        el('sxCombine').checked = state.combine;
        el('sxClick').checked = state.click;
        document.querySelectorAll('#sxLabels button').forEach(b => {
            const on = b.dataset.mode === state.labels;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', String(on));
        });
        const title = model.info.root + ' ' + scaleLabel(state.scale);
        el('sxTitle').textContent = title;
        el('sxFocusTitle').textContent = title + (state.shapes.length ? ' · ' + state.shapes.join(' + ') + ' shape' : '');
        el('sxFocus').setAttribute('aria-pressed', String(state.focus));
        el('sxFocus').classList.toggle('active', state.focus);
        document.body.classList.toggle('sx-focus', state.focus);
        const fingerHint = el('sxFingerHint');
        fingerHint.style.display = state.labels === 'fingers' && !state.shapes.length ? 'block' : 'none';
    }

    // ---------------------------------------------------------------
    // Practice sequence and tab
    // ---------------------------------------------------------------
    function buildSequence() {
        const sel = selectedShapes();
        const shapes = sel.length ? sel.slice().sort((a, b) => a.min - b.min) : model.shapes;
        if (sel.length > 1) {
            // Connected shapes: treat the union as one long run (unique pitches,
            // lowest-position placement wins).
            const byMidi = new Map();
            shapes.forEach(sh => sh.notes.forEach(n => { if (!byMidi.has(n.midi)) byMidi.set(n.midi, n); }));
            return sequenceFor([...byMidi.values()], state.pattern);
        }
        let seq = [];
        shapes.forEach(sh => { seq = seq.concat(sequenceFor(sh.notes, state.pattern)); });
        return seq;
    }

    function renderTab() {
        const host = el('sxTab');
        const seq = buildSequence();
        player.seq = seq;
        const colW = 32, rowH = 19, left = 20, top = 12;
        const width = left + seq.length * colW + 12;
        const height = top + 5 * rowH + 12;
        const svg = svgEl('svg', { viewBox: '0 0 ' + width + ' ' + height, width, height, class: 'sx-tab-svg' });
        for (let s = 0; s < 6; s++) {
            const y = top + (5 - s) * rowH;
            svg.appendChild(svgEl('text', { x: 3, y: y + 4, class: 'sx-tab-string' }, s === 5 ? 'e' : STRING_NAMES[s]));
            svg.appendChild(svgEl('line', { x1: left, x2: width - 4, y1: y, y2: y, class: 'sx-tab-line' }));
        }
        seq.forEach((n, i) => {
            const x = left + i * colW + colW / 2;
            const y = top + (5 - n.s) * rowH;
            const g = svgEl('g', { class: 'sx-tab-note' + (n.pc === model.info.rootPc ? ' root' : ''), 'data-i': i });
            g.appendChild(svgEl('rect', { x: x - 13, y: y - 9, width: 26, height: 18, rx: 4 }));
            g.appendChild(svgEl('text', { x, y: y + 5 }, String(n.f)));
            svg.appendChild(g);
        });
        host.innerHTML = '';
        host.appendChild(svg);
    }

    function markPlaying() {
        document.querySelectorAll('#sxBoard .sx-note.playing').forEach(g => g.classList.remove('playing'));
        document.querySelectorAll('#sxTab .sx-tab-note.playing').forEach(g => g.classList.remove('playing'));
        if (!player.playing || player.current === undefined) return;
        const n = player.seq[player.current];
        if (!n) return;
        const g = document.querySelector('#sxBoard .sx-note[data-pos="' + n.s + '-' + n.f + '"]');
        if (g) g.classList.add('playing');
        const t = document.querySelector('#sxTab .sx-tab-note[data-i="' + player.current + '"]');
        if (t) {
            t.classList.add('playing');
            const host = el('sxTab');
            const x = parseFloat(t.querySelector('rect').getAttribute('x'));
            if (x < host.scrollLeft + 40 || x > host.scrollLeft + host.clientWidth - 60) {
                host.scrollLeft = Math.max(0, x - host.clientWidth / 3);
            }
        }
    }

    function scheduler() {
        const c = ctx;
        const stepDur = 60 / state.bpm / state.sub;
        while (player.nextTime < c.currentTime + 0.12) {
            if (player.index >= player.seq.length) {
                if (!state.loop) {
                    const endIn = Math.max(0, (player.nextTime - c.currentTime) * 1000);
                    clearInterval(player.timer);
                    player.timer = null;
                    player.visualTimers.push(setTimeout(stop, endIn + 50));
                    return;
                }
                // Do not repeat the low note when an up-and-down run loops.
                const seq = player.seq;
                player.index = seq.length > 1 && seq[0].midi === seq[seq.length - 1].midi ? 1 : 0;
            }
            const i = player.index;
            const n = player.seq[i];
            const t = player.nextTime;
            playPluck(n.midi, t, stepDur * 0.95);
            if (state.click && player.step % state.sub === 0) {
                const beat = Math.floor(player.step / state.sub);
                playClick(t, beat % 4 === 0);
            }
            const delay = Math.max(0, (t - c.currentTime) * 1000);
            player.visualTimers.push(setTimeout(() => {
                if (!player.playing) return;
                player.current = i;
                markPlaying();
            }, delay));
            if (player.visualTimers.length > 64) player.visualTimers.splice(0, 32);
            player.index++;
            player.step++;
            player.nextTime += stepDur;
        }
    }

    function play() {
        if (!player.seq.length) return;
        audio();
        player.playing = true;
        player.index = 0;
        player.step = 0;
        player.current = undefined;
        player.nextTime = ctx.currentTime + 0.08;
        clearInterval(player.timer);
        player.timer = setInterval(scheduler, 25);
        scheduler();
        el('sxPlay').classList.add('playing');
        el('sxPlay').innerHTML = '<span aria-hidden="true">■</span> Stop';
    }

    function stop() {
        player.playing = false;
        clearInterval(player.timer);
        player.timer = null;
        player.visualTimers.forEach(clearTimeout);
        player.visualTimers = [];
        player.current = undefined;
        markPlaying();
        const btn = el('sxPlay');
        if (btn) {
            btn.classList.remove('playing');
            btn.innerHTML = '<span aria-hidden="true">▶</span> Play';
        }
    }

    function togglePlay() {
        if (player.playing) stop(); else play();
    }

    function restartIfPlaying() {
        if (player.playing) { stop(); play(); }
    }

    // ---------------------------------------------------------------
    // Update cycle
    // ---------------------------------------------------------------
    function update(sequenceChanged) {
        computeModel();
        syncInputs();
        renderShapeButtons();
        renderCaption();
        renderFormula();
        renderChords();
        renderBoard();
        if (sequenceChanged || !player.seq.length) {
            renderTab();
            restartIfPlaying();
        }
        save();
    }

    function init() {
        if (!el('sxBoard')) return;
        buildStaticControls();
        update(true);
    }

    global.SongbookScales = { init, stop, state, theory: ScaleTheory };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})(typeof window !== 'undefined' ? window : globalThis);
