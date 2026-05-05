#[tauri::command]
fn run_command(command: String) -> String {
    let lowered = command.to_lowercase();

    if lowered.contains("plan") {
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
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
