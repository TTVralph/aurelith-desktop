use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct Space {
    id: i64,
    name: String,
    description: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Task {
    id: i64,
    space_id: i64,
    title: String,
    status: String,
    assignee: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct CommandHistoryItem {
    id: i64,
    command: String,
    result: String,
    created_at: String,
}

fn db_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("failed to resolve app data dir: {e}"))?;

    std::fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("failed to create app data directory: {e}"))?;

    Ok(app_data_dir.join("aurelith.db"))
}

fn connection(app: &tauri::AppHandle) -> Result<Connection, String> {
    let path = db_path(app)?;
    Connection::open(path).map_err(|e| format!("failed to open db: {e}"))
}

fn init_db(app: &tauri::AppHandle) -> Result<(), String> {
    let conn = connection(app)?;

    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS spaces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            space_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            assignee TEXT NOT NULL,
            FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS command_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            command TEXT NOT NULL,
            result TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        ",
    )
    .map_err(|e| format!("failed to initialize db schema: {e}"))?;

    Ok(())
}

#[tauri::command]
fn run_command(app: tauri::AppHandle, command: String) -> Result<String, String> {
    let lowered = command.to_lowercase();

    let result = if lowered.contains("plan") {
        "Mission plan created: prioritized School and Job Applications with a 90-minute focus block.".to_string()
    } else if lowered.contains("finance") {
        "Finance Space opened with budget sheet, recurring bills, and unresolved receipts surfaced.".to_string()
    } else if lowered.contains("project") {
        "Projects Space activated: recent files loaded and suggested next actions queued.".to_string()
    } else {
        format!(
            "Interpreted command: '{}'. Mock action ready in Mission Control.",
            command
        )
    };

    save_command_history(app, command, result.clone())?;
    Ok(result)
}

#[tauri::command]
fn list_spaces(app: tauri::AppHandle) -> Result<Vec<Space>, String> {
    let conn = connection(&app)?;
    let mut stmt = conn
        .prepare("SELECT id, name, description FROM spaces ORDER BY id DESC")
        .map_err(|e| format!("failed to prepare spaces query: {e}"))?;

    let rows = stmt
        .query_map([], |row| {
            Ok(Space {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
            })
        })
        .map_err(|e| format!("failed to query spaces: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("failed to map spaces rows: {e}"))
}

#[tauri::command]
fn create_space(app: tauri::AppHandle, name: String, description: String) -> Result<i64, String> {
    let conn = connection(&app)?;
    conn.execute(
        "INSERT INTO spaces (name, description) VALUES (?1, ?2)",
        params![name.trim(), description.trim()],
    )
    .map_err(|e| format!("failed to create space: {e}"))?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn update_space(app: tauri::AppHandle, id: i64, name: String, description: String) -> Result<(), String> {
    let conn = connection(&app)?;
    conn.execute(
        "UPDATE spaces SET name = ?1, description = ?2 WHERE id = ?3",
        params![name.trim(), description.trim(), id],
    )
    .map_err(|e| format!("failed to update space: {e}"))?;

    Ok(())
}

#[tauri::command]
fn delete_space(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = connection(&app)?;
    conn.execute("DELETE FROM tasks WHERE space_id = ?1", params![id])
        .map_err(|e| format!("failed to delete space tasks: {e}"))?;
    conn.execute("DELETE FROM spaces WHERE id = ?1", params![id])
        .map_err(|e| format!("failed to delete space: {e}"))?;
    Ok(())
}

#[tauri::command]
fn list_tasks(app: tauri::AppHandle) -> Result<Vec<Task>, String> {
    let conn = connection(&app)?;
    let mut stmt = conn
        .prepare("SELECT id, space_id, title, status, assignee FROM tasks ORDER BY id DESC")
        .map_err(|e| format!("failed to prepare tasks query: {e}"))?;

    let rows = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                space_id: row.get(1)?,
                title: row.get(2)?,
                status: row.get(3)?,
                assignee: row.get(4)?,
            })
        })
        .map_err(|e| format!("failed to query tasks: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("failed to map tasks rows: {e}"))
}

#[tauri::command]
fn create_task(
    app: tauri::AppHandle,
    space_id: i64,
    title: String,
    status: String,
    assignee: String,
) -> Result<i64, String> {
    let conn = connection(&app)?;
    conn.execute(
        "INSERT INTO tasks (space_id, title, status, assignee) VALUES (?1, ?2, ?3, ?4)",
        params![space_id, title.trim(), status.trim(), assignee.trim()],
    )
    .map_err(|e| format!("failed to create task: {e}"))?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn update_task(
    app: tauri::AppHandle,
    id: i64,
    space_id: i64,
    title: String,
    status: String,
    assignee: String,
) -> Result<(), String> {
    let conn = connection(&app)?;
    conn.execute(
        "UPDATE tasks SET space_id = ?1, title = ?2, status = ?3, assignee = ?4 WHERE id = ?5",
        params![space_id, title.trim(), status.trim(), assignee.trim(), id],
    )
    .map_err(|e| format!("failed to update task: {e}"))?;
    Ok(())
}

#[tauri::command]
fn delete_task(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let conn = connection(&app)?;
    conn.execute("DELETE FROM tasks WHERE id = ?1", params![id])
        .map_err(|e| format!("failed to delete task: {e}"))?;
    Ok(())
}

#[tauri::command]
fn save_command_history(app: tauri::AppHandle, command: String, result: String) -> Result<(), String> {
    let conn = connection(&app)?;
    conn.execute(
        "INSERT INTO command_history (command, result) VALUES (?1, ?2)",
        params![command.trim(), result],
    )
    .map_err(|e| format!("failed to save command history: {e}"))?;
    Ok(())
}

#[tauri::command]
fn list_command_history(app: tauri::AppHandle) -> Result<Vec<CommandHistoryItem>, String> {
    let conn = connection(&app)?;
    let mut stmt = conn
        .prepare(
            "SELECT id, command, result, created_at FROM command_history ORDER BY id DESC LIMIT 20",
        )
        .map_err(|e| format!("failed to prepare command history query: {e}"))?;

    let rows = stmt
        .query_map([], |row| {
            Ok(CommandHistoryItem {
                id: row.get(0)?,
                command: row.get(1)?,
                result: row.get(2)?,
                created_at: row.get(3)?,
            })
        })
        .map_err(|e| format!("failed to query command history: {e}"))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("failed to map command history rows: {e}"))
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            init_db(&app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            run_command,
            list_spaces,
            create_space,
            update_space,
            delete_space,
            list_tasks,
            create_task,
            update_task,
            delete_task,
            save_command_history,
            list_command_history
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
