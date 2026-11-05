@echo off
cd /d "%~dp0"
echo A abrir a viagem no navegador... (fecha esta janela para terminar)
start "" "http://127.0.0.1:8765/Sri_Lanka_Globo.html"
python -m http.server 8765 --bind 127.0.0.1 2>nul || py -m http.server 8765 --bind 127.0.0.1
