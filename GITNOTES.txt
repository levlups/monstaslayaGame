@echo off
echo =========================
echo GitHub Push Helper
echo =========================

git status

echo.
echo Adding files...
git add .

echo.
set /p msg=Enter commit message: 

git commit -m "%msg%"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done!
pause