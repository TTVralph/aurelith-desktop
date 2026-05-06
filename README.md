# Aurelith Desktop v0.1

Aurelith Desktop is an AI-first command center for your computer and the first product in the future Aurelith OS ecosystem.

## Stack

- Tauri v2 (Rust backend)
- React + TypeScript + Vite frontend

## Features in v0.1

- Dark, futuristic mission dashboard UI
- Command bar for natural-language style instructions
- Spaces cards: School, Job Applications, Projects, Finance, Personal
- Mission Control insight section
- Recent Files section (mock data)
- Tasks section (mock data)
- Suggested Actions section
- `run_command` Tauri command that accepts a string and returns a mock interpreted action

## Local setup

For full cross-platform setup instructions, see [`docs/development.md`](docs/development.md).

### 1) Use the public npm registry for this project

```bash
printf 'registry=https://registry.npmjs.org/\n' > .npmrc
```

### 2) Install JavaScript dependencies

```bash
npm install --verbose
```

### 3) Build frontend assets (validation)

```bash
npm run build
```

### 4) Linux/Tauri development prerequisites (Ubuntu/Debian)

Install required system packages before running Rust/Tauri checks:

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev pkg-config
```

### 5) Rust/Tauri sanity check

```bash
cd src-tauri && cargo check
```

> In environments missing Linux system dependencies (for example `glib-2.0` via `pkg-config`), `cargo check` will fail until those packages are installed.

### 6) Run in web mode (frontend only)

```bash
npm run dev
```

### 7) Run as desktop app

```bash
npm run tauri dev
```

### 8) Build production app

```bash
npm run tauri build
```

## Notes

- Release bundling is disabled for now; app packaging/icons will be added later when release builds are introduced.
- No authentication in v0.1.
- No real AI API integration yet.
- No cloud sync yet.

## CI validation

GitHub Actions now runs CI on every pull request and on pushes to `main`, validating both `npm run build` and `cd src-tauri && cargo check` on `ubuntu-latest`.
