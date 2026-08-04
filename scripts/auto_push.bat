@echo off
echo Starting Auto-Push...
:loop
git status --porcelain >nul 2>&1
if errorlevel 1 goto delay
git status --porcelain > temp.txt
for /F "usebackq" %%A in ("temp.txt") do (
    git add .
    git commit -m "Auto-commit changes"
    git push
    echo Changes pushed at %time%
    goto delay
)
:delay
del temp.txt >nul 2>&1
timeout /t 10 /nobreak >nul
goto loop
