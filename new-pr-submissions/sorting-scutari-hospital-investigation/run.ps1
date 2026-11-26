# The Sorting Investigation - PowerShell Launcher
#
# IMPORTANT: Stop any existing "python server.py" process before starting a fresh
# one (close its terminal window or press Ctrl+C there). The server binds its port
# exclusively and stops with an actionable message if the port is already serving
# requests, instead of silently sharing the port with a stale process.

Set-Location -Path $PSScriptRoot
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "          THE SORTING INVESTIGATION" -ForegroundColor Yellow
Write-Host "  'An interactive historical adventure to discover Python sorting'" -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting local educational server from: $PSScriptRoot" -ForegroundColor Green
Write-Host "NOTE: If a server is already running, stop it first (Ctrl+C in its window)" -ForegroundColor Gray
Write-Host "      to avoid a duplicate launch on the same port." -ForegroundColor Gray
Write-Host ""

try {
    python server.py

    # A nonzero process exit code does NOT throw in PowerShell, so check it explicitly.
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[ERROR] The Python server exited with code $LASTEXITCODE (nonzero)." -ForegroundColor Red
        Write-Host "The local educational server did not start or stopped unexpectedly." -ForegroundColor Red
        Write-Host "Check that Python 3 is on your PATH, that server.py exists, and that" -ForegroundColor Red
        Write-Host "no other process is using the server port." -ForegroundColor Red
        Write-Host "Press Enter to close this window." -ForegroundColor Gray
        Read-Host
    }
} catch {
    Write-Host ""
    Write-Host "[ERROR] Failed to launch the Python server: $_" -ForegroundColor Red
    Write-Host "Press Enter to close this window." -ForegroundColor Gray
    Read-Host
}
