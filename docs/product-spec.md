# Aurelith Desktop Product Spec (v0.1)

## Vision
Aurelith Desktop is the command layer between users and their computer, designed around intent-first workflows.

## Goals
- Provide a polished command dashboard experience.
- Help users organize digital life into focused Spaces.
- Demonstrate local command interpretation through a Rust Tauri backend command.

## Core Experience
1. User opens Aurelith Desktop.
2. User enters a natural-language command in the command bar.
3. App sends command text to Tauri backend via `run_command`.
4. UI displays interpreted mock action result.
5. User navigates Spaces and operational panels (Mission Control, Files, Tasks, Suggested Actions).

## Scope (In)
- Tauri v2 shell and Rust command.
- React/TypeScript dashboard UI.
- Mock, local-only data for files/tasks/actions.

## Scope (Out)
- Authentication.
- Live AI model/API integration.
- Cloud sync.
- Multi-device collaboration.

## Quality Bar
- Fast local startup.
- Clean dark visual language.
- Logical layout with responsive behavior.
