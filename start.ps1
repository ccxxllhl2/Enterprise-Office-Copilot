# Start all services
# Backend:  http://localhost:8080  (FastAPI)
# Agent:    http://localhost:3000  (Pi Agent + DeepSeek)
# Frontend: http://localhost:80    (Vite + React)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Pi Agent uses DEEPSEEK_API_KEY env var (mapped from system DEEPSEEK_API)
if ($env:DEEPSEEK_API -and -not $env:DEEPSEEK_API_KEY) {
    $env:DEEPSEEK_API_KEY = $env:DEEPSEEK_API
}

Write-Host "== Starting backend (8080) ==" -ForegroundColor Cyan
$py = Join-Path $root ".venv\Scripts\python.exe"
if (-not (Test-Path $py)) { $py = "py" }
Start-Process -FilePath $py -ArgumentList "-m","uvicorn","app.main:app","--host","0.0.0.0","--port","8080" -WorkingDirectory (Join-Path $root "backend") -NoNewWindow

Write-Host "== Starting Agent service (3000) ==" -ForegroundColor Cyan
Start-Process -FilePath "npm.cmd" -ArgumentList "start" -WorkingDirectory (Join-Path $root "agent-service") -NoNewWindow

Write-Host "== Starting frontend (80) ==" -ForegroundColor Cyan
$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npm) {
    Write-Host "npm not found. Install Node.js first." -ForegroundColor Red
    exit 1
}
Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -WorkingDirectory (Join-Path $root "frontend") -NoNewWindow

Write-Host "All services started. Press Ctrl+C to stop." -ForegroundColor Green
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    Write-Host "Stopped." -ForegroundColor Yellow
}
