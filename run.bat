@echo off
title India's Got Latent Stream (React + Vite)
echo ==================================================
echo   Starting India's Got Latent Web Server (React)...
echo ==================================================
start http://localhost:3000
npm run dev
if %ERRORLEVEL% NEQ 0 (
    echo Falling back to node server.js...
    node server.js
)
pause
