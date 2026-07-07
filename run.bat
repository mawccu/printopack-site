@echo off
REM ── Printopack site launcher ─────────────────────────────────────
REM Serves this folder over http and opens the site in your browser.
REM (The 3D model and scripts only work over http, not by double-
REM  clicking index.html directly.)
cd /d "%~dp0"
echo.
echo  Starting Printopack site at http://localhost:8000 ...
echo  Keep this window open while you browse. Press Ctrl+C to stop.
echo.
start "" http://localhost:8000/index.html

where python >nul 2>&1
if %errorlevel%==0 (
    python -m http.server 8000
    goto :eof
)
where py >nul 2>&1
if %errorlevel%==0 (
    py -m http.server 8000
    goto :eof
)
echo  ERROR: Python was not found on this PC. Install it from python.org
echo  (or tell Claude to switch the launcher to another server).
pause
