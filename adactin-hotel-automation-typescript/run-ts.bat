@echo off
title Playwright Complete CI/CD Automation
color 0A
 
echo.
echo ==========================================
echo       PLAYWRIGHT CI/CD AUTOMATION
echo ==========================================
 
:: STEP 1 - Navigate to project directory
cd /d "C:\Users\aliiaimr\OneDrive - PERSEUS MANAGEMENT GROUP INC\Adactionhotel Typescript\AdactinHotelApp github\adactin-hotel-automation-typescript"
 
if errorlevel 1 goto ERROR
 
:: STEP 2 - Run Playwright tests locally
echo.
echo [STEP 1/4] Running Playwright tests...
echo.
 
call npx playwright test
 
if errorlevel 1 (
    echo.
    echo TESTS FAILED! Git push cancelled.
    pause
    exit /b 1
)
 
:: STEP 3 - Stage changes in Git
echo.
echo [STEP 2/4] Staging Git changes...
echo.
 
git add .
 
if errorlevel 1 goto ERROR
 
:: Check whether there are any changes to commit
git diff --cached --quiet
 
if not errorlevel 1 (
    echo.
    echo No new changes to commit.
    goto END
)
 
:: STEP 4 - Generate automatic commit message
echo.
echo [STEP 3/4] Generating automatic commit message...
 
set "commitmsg=New Git Commit At - %date% %time%"
 
echo Commit Message: %commitmsg%
 
:: STEP 5 - Commit changes
git commit -m "%commitmsg%"
 
if errorlevel 1 goto ERROR
 
:: STEP 6 - Push changes to GitHub
echo.
echo [STEP 4/4] Pushing changes to GitHub...
echo.
 
git push origin main
 
if errorlevel 1 goto ERROR
 
echo.
echo ==========================================
echo       GITHUB PUSH SUCCESSFUL!
echo ==========================================
echo.
echo GitHub webhook should trigger Jenkins.
echo Check Jenkins dashboard for build status.
 
goto END
 
:ERROR
echo.
echo ==========================================
echo       AUTOMATION ERROR!
echo ==========================================
echo Check the error message above.
pause
exit /b 1
 
:END
echo.
echo ==========================================
echo       PROCESS FINISHED
echo ==========================================
pause
 