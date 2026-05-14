# Optional songs/ folder

This folder is intentionally empty. You don't need it for normal use.

If you'd rather keep your songs as JSON files in your repository (so you can version-control them with git), you can use this folder as a holding place. To actually load JSON files from this folder you'll need to write a small loader, since OpenFret is a static app and can't read your local filesystem at runtime.

The recommended way to add songs is through the in-browser **+ Add Song** button. To back them up or move them to another device, use **Library → Export to file** which produces a single JSON file you can save anywhere.

## Roadmap

A future release may include an optional drop-in loader that scans this folder at build time. Until then, treat this folder as a personal scratch space if you find it useful, or delete it.
