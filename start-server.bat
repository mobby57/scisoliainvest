@echo off
start /B node server.js
timeout /t 3 /nobreak >nul
taskkill /f /im node.exe