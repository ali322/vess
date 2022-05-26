use tauri::{Builder, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, Wry};

pub fn apply_tray(builder: Builder<Wry>) -> Builder<Wry> {
  let toggle = CustomMenuItem::new("toggle".to_string(), "Toggle");
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let tray_menu = SystemTrayMenu::new().add_item(quit).add_item(toggle);
  let tray = SystemTray::new().with_menu(tray_menu);
  builder.system_tray(tray).on_system_tray_event(|app, event|{
    match event {
      SystemTrayEvent::MenuItemClick{ id, ..} => {
        match id.as_str() {
          "toggle" => {
            let win = app.get_window("main").unwrap();
            if win.is_visible().unwrap() == true {
              win.hide().unwrap();
            } else {
              win.show().unwrap();
            }
          },
          "quit" => std::process::exit(0),
          _ => {}
        }
      },
      _ => {}
    }
  })
}