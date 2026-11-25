@echo off
title The Sorting Investigation
cd /d "%~dp0"

REM IMPORTANT: Stop any existing "python server.py" process before starting a fresh
REM one (close its terminal window or press Ctrl+C there). The server binds its port
REM exclusively and stops with an actionable message if the port is already serving
REM requests, instead of silently sharing the port with a stale process.

echo ======================================================================
echo           THE SORTING INVESTIGATION
echo   "An interactive historical adventure to discover Python sorting"
echo ======================================================================
echo.
echo Starting local educational server from: %CD%
echo NOTE: If a server is already running, stop it first (Ctrl+C in its window)
echo       to avoid a duplicate launch on the same port.
echo.

python server.py
set EXITCODE=%ERRORLEVEL%

if not "%EXITCODE%"=="0" (
    echo.
    echo [ERROR] The Python server exited with code %EXITCODE% (nonzero).
    echo The local educational server did not start or stopped unexpectedly.
    echo Please make sure Python 3 is installed and added to your PATH,
    echo that no other process is using the server port, and that server.py exists.
    pause
)
