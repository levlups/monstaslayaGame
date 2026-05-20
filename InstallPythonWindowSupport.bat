@echo off
setlocal
set "PYEXE=C:\Users\nabil\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if exist "%PYEXE%" (
  "%PYEXE%" -m pip install pywebview
) else (
  py -3 -m pip install pywebview
)
if errorlevel 1 (
  echo.
  echo Install failed. Make sure Python, pip, and internet access are available, then try again.
  pause
) else (
  echo.
  echo Done. You can now run RunGameWindow.bat
  pause
)
