# DyslexAI Application Startup Script
Write-Host "Starting DyslexAI Application..." -ForegroundColor Green

Write-Host "[1/2] Starting MongoDB server..." -ForegroundColor Yellow
Set-Location "F:\Final-yr prj\Winsurf Project\dyslexai\server"
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Minimized -PassThru
$serverJob = Start-Job -ScriptBlock { 
    Start-Sleep -Seconds 3
    Write-Host "Server started on http://localhost:5000" -ForegroundColor Green
} -Name "MongoDB Server"

Write-Host "[2/2] Starting React client..." -ForegroundColor Yellow
Set-Location "F:\Final-yr prj\Winsurf Project\dyslexai\client"
Start-Process -FilePath "npm" -ArgumentList "run","dev" -WindowStyle Minimized -PassThru
$clientJob = Start-Job -ScriptBlock { 
    Start-Sleep -Seconds 5
    Write-Host "Client started on http://localhost:5173" -ForegroundColor Green
} -Name "React Client"

Write-Host "" 
Write-Host "=== DyslexAI Application Started ===" -ForegroundColor Green
Write-Host "Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Client: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to stop all servers..." -ForegroundColor Yellow

# Wait for key press
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop all processes
Write-Host "Stopping servers..." -ForegroundColor Red
Stop-Job $serverJob
Stop-Job $clientJob
Get-Process | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force
Write-Host "All servers stopped." -ForegroundColor Green
