use std::{fs, path::Path};

const PLACEHOLDER_ICON_PNG_BASE64: &str =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Z7mQAAAAASUVORK5CYII=";

fn ensure_placeholder_icon() {
    let icon_path = Path::new("icons/icon.png");

    if icon_path.exists() {
        return;
    }

    if let Some(parent) = icon_path.parent() {
        fs::create_dir_all(parent).expect("failed to create icons directory");
    }

    let png_bytes = base64::decode(PLACEHOLDER_ICON_PNG_BASE64)
        .expect("failed to decode embedded placeholder icon");

    fs::write(icon_path, png_bytes).expect("failed to write placeholder icon");
}

fn main() {
    ensure_placeholder_icon();
    tauri_build::build()
}
