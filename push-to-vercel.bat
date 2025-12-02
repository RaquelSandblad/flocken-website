@echo off
echo ========================================
echo   Pushar till GitHub och Vercel
echo ========================================
echo.

cd /d "%~dp0"

git add .
git commit -m "Add Paket H: Source Serif 4 + Outfit"
git push

echo.
echo ========================================
echo   Klart! Vercel deployer nu (2-3 min)
echo ========================================
echo.
pause

