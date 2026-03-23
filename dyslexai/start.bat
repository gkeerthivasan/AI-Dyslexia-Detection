@echo off
echo Starting DyslexAI Application...
echo.

echo [1/3] Starting MongoDB server...
cd /d "F:/Final-yr prj/Winsurf Project/dyslexai/server"
start "MongoDB Server" cmd /k "npm start" /min

timeout /t 3

echo [2/3] Starting React client...
cd /d "F:/Final-yr prj/Winsurf Project/dyslexai/client"
start "React Client" cmd /k "npm run dev" /min

echo.
echo === DyslexAI Application Started ===
echo Server: http://localhost:5000
echo Client: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /f /im "MongoDB Server" /im "React Client" 2>nul
echo All servers stopped.
