@echo off
REM ============================================
REM  Auto-Sync Script for Strategic Minds
REM  Run this to pull latest changes from GitHub
REM ============================================

cd /d "%~dp0"
echo.
echo  Syncing with GitHub...
echo.

git fetch origin

REM Check if local is behind remote
FOR /F "tokens=*" %%i IN ('git rev-list --count HEAD..origin/main') DO SET BEHIND=%%i

IF %BEHIND% GTR 0 (
    echo  Found %BEHIND% new commit(s). Pulling changes...
    git pull origin main
    echo.
    echo  ✅ Repository synced successfully!
) ELSE (
    echo  Already up to date. No new changes.
)

echo.
pause
