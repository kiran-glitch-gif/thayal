@echo off
echo ========================================================
echo   Thayal360 - Push to GitHub Pipeline
echo ========================================================
echo.

if exist .git (
    echo 1. Git already initialized.
) else (
    echo 1. Initializing Git...
    git init
)

echo.
echo 2. Adding all files...
git add .

echo.
echo 3. Committing changes...
git commit -m "fix(deploy): Update path references for Vercel build"

echo.
echo ========================================================
echo   CHECKING REMOTE REPOSITORY
echo ========================================================
echo.
git remote -v
echo.
echo If the URL above is correct, just press ENTER to skip.
echo If empty or wrong, paste your GitHub URL below.
set /p REPO_URL=">> Repo URL (leave empty to use existing): "

if not "%REPO_URL%"=="" (
    git remote remove origin 2>nul
    git remote add origin %REPO_URL%
    echo Remote updated to %REPO_URL%
)

echo.
echo 5. Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================================
echo   SUCCESS! Your code is now live on GitHub.
echo ========================================================
pause
