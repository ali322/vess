icon:
	@yarn tauri icon public/vess.png --target src-tauri/icons --log
start:
	@yarn tauri dev
build:
	@TAURI_PRIVATE_KEY=~/.tauri/vess.key TAURI_KEY_PASSWORD=1988 yarn tauri build
opz:
	@upx --ultra-brute src-tauri/target/release/bundle/macos/vess.app/Contents/macOS/vess
cp:
	@cp -R src-tauri/target/release/bundle/macos/Vess.app /Applications
.PHONY: icon build opz