# Development Setup

This guide covers local development prerequisites and setup steps for **Windows**, **macOS**, and **Linux** for the Aurelith Desktop Tauri application.

## Prerequisites (all platforms)

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Rust** toolchain (stable) via `rustup`

## 1) Clone and install project dependencies

From the repository root:

```bash
printf 'registry=https://registry.npmjs.org/\n' > .npmrc
npm install --verbose
```

## 2) Frontend validation

```bash
npm run build
```

## 3) Platform-specific Tauri requirements

Tauri desktop builds require additional platform system dependencies.

### Windows

- Install **Microsoft C++ Build Tools** (Visual Studio Build Tools 2022)
- Install **WebView2** (usually already present on Windows 11; install Evergreen runtime if needed)

Then run:

```bash
cd src-tauri
cargo check
```

### macOS

- Install **Xcode Command Line Tools**:

```bash
xcode-select --install
```

Then run:

```bash
cd src-tauri
cargo check
```

### Linux

On Ubuntu/Debian, install Tauri/Linux dependencies first:

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev pkg-config
```

Then run:

```bash
cd src-tauri
cargo check
```

If `cargo check` fails with missing `glib-2.0`/`pkg-config`, that indicates required Linux system packages are not installed in the current environment yet.

## 4) Run the app

From repository root:

- Frontend-only mode:

```bash
npm run dev
```

- Desktop mode:

```bash
npm run tauri dev
```

## 5) Production build

```bash
npm run tauri build
```
