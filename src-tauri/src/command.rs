use pinger::{ping, PingResult};
use std::{collections::HashMap, fs, path::Path};
use tauri::{
  api::{
    process::{Command, CommandEvent},
  },
  Builder, Wry,
};

#[tauri::command]
fn latency(addr: String) -> u64 {
  let streams = ping(addr).expect("Failed to ping");
  let mut cnt = 0;
  let mut sum: u128 = 0;
  for msg in streams {
    if cnt > 3 {
      break;
    }
    cnt += 1;
    match msg {
      PingResult::Pong(d, _) => {
        let d = d.as_millis();
        sum = sum + d;
      }
      PingResult::Timeout(_) => {}
      PingResult::Unknown(_) => {}
    }
  }
  let avg = sum / 3;
  avg as u64
}

#[tauri::command]
fn latencies(window: tauri::Window, addrs: Vec<String>) {
  let mut all: Vec<u64> = vec![];
  tauri::async_runtime::spawn(async move {
    for addr in addrs {
      all.push(latency(addr));
    }
    window.emit("latency", all).expect("Failed to emit latency");
  });
}

#[tauri::command]
fn run_xray(window: tauri::Window, app_handle: tauri::AppHandle, config: String) {
  let res_dir = app_handle.path_resolver().resource_dir().expect("Failed to get resource_dir");
  fs::write(res_dir.join("config.json"), config).expect("Failed to write config.json");
  let mut envs: HashMap<String, String> = HashMap::new();
  envs.insert(
    "XRAY_LOCATION_ASSET".to_string(),
    res_dir.to_str().unwrap().to_string(),
  );
  tauri::async_runtime::spawn(async move {
    let (mut rx, _child) = Command::new_sidecar("xray")
      .expect("Failed to setup `xray` sidecar")
      .args(vec!["run", "-c", "config.json"])
      .envs(envs)
      .current_dir(res_dir)
      .spawn()
      .expect("Failed to spawn xray");
    while let Some(event) = rx.recv().await {
      if let CommandEvent::Stdout(line) = event {
        window
          .emit("run-xray", Some(format!("{}", line)))
          .expect("failed to emit event");
      }
    }
  });
}

#[tauri::command]
fn import_file(path: String) -> Result<String, String> {
  let file_path = Path::new(&path);
  if file_path.is_file() {
    return fs::read_to_string(file_path).map_err(|_|format!("Failed to read file {}", path));
  } else {
    return Err(format!("{} is not existed", path))
  }
}

#[tauri::command]
fn export_file(path: String, content: String) -> Result<(), String>{
  let file_path = Path::new(&path);
  return fs::write(file_path, content).map_err(|_|format!("Failed to write file {}", path));
}

#[tauri::command]
fn copy_file(from: String, to: String) -> Result<u64, String> {
  return fs::copy(&from, &to).map_err(|_|format!("Failed to copy file {} to file {}", from, to));
}

pub fn apply_command(builder: Builder<Wry>) -> Builder<Wry> {
  builder.invoke_handler(tauri::generate_handler![
    run_xray, latency, latencies, import_file, export_file, copy_file
  ])
}
