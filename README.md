# Modern Calculator (Web)

A sleek, responsive, and feature-rich calculator built with HTML, CSS, and JavaScript. Includes history, memory keys, unary operations, theme toggle, and keyboard support.

## Screenshots
Place your screenshot at `assets/screenshot.png` and it will render below.

![Calculator UI](assets/screenshot.png)

## Features
- **High-end UI**: Dark/Light theme, large display, responsive grid.
- **Advanced operations**:
  - Binary: `+`, `-`, `×`, `÷`
  - Unary: `±` (negate), `%` (context-aware), `√`, `x²`, `1/x`
- **Memory keys**: `MC`, `MR`, `M+`, `M-` (persisted)
- **History**: Persistent history (localStorage), click to reuse, clear, and export to `.txt`.
- **Toolbar**: Theme toggle and Copy result.
- **Keyboard support**: Numbers, operators, Enter, Backspace, Escape.

## Getting Started

### Run locally
1. Open `index.html` in any modern browser.
2. Start calculating.

### File structure
```
windsurf-project/
├─ index.html
├─ styles.css
├─ script.js
└─ README.md
```

## Usage Tips
- **Percent** works like typical calculators:
  - Example: `200 + 10 %` equals `200 + (10% of 200)` → `220`.
- Click any **history** item to reuse its result.
- Use **Theme** to switch Light/Dark (persists).
- Use **Copy** to copy the current result.

## Keyboard Shortcuts
- **Numbers/Decimal**: `0-9`, `.`
- **Operators**: `+`, `-`, `*`, `/`
- **Equals**: `Enter` or `=`
- **Delete last**: `Backspace`
- **All Clear**: `Escape`

## Development
- Pure front-end, no build tools required.
- Main logic in `script.js` with a `Calculator` class and history/memory/theme helpers.
- Styling in `styles.css` with CSS variables and light theme via `body.light`.

## Deploy
### GitHub Pages
1. Push this folder to a GitHub repository.
2. In GitHub: `Settings → Pages → Build and deployment`
   - Source: `Deploy from branch`
   - Branch: `main` and folder: `/root`
3. Access at `https://<USERNAME>.github.io/<REPO>/`.

## License
MIT © 2025 codewith-ram
