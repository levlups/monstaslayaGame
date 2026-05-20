@echo off
setlocal
cd /d "%~dp0"
set "PYEXE=C:\Users\nabil\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if exist "%PYEXE%" (
  "%PYEXE%" "%~dp0run_game_window.py"
) else (
  py -3 "%~dp0run_game_window.py"
)
if errorlevel 1 (
  echo.
  echo If the Python window support message appeared, run InstallPythonWindowSupport.bat once.
  pause
)
