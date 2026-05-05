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

## Run locally

### 1) Install dependencies

```bash
npm install
```

### 2) Run in web mode (frontend only)

```bash
npm run dev
```

### 3) Run as desktop app

```bash
npm run tauri dev
```

### 4) Build production app

```bash
npm run tauri build
```

## Notes

- No authentication in v0.1.
- No real AI API integration yet.
- No cloud sync yet.
