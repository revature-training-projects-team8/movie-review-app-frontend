@echo off
echo ========================================
echo Starting Movie Review App Backend
echo ========================================
echo.

cd ..\movie-review-app-backend

echo Checking if backend is already running on port 8080...
netstat -ano | findstr :8080 > nul
if %errorlevel% equ 0 (
    echo.
    echo WARNING: Port 8080 is already in use!
    echo Backend might already be running.
    echo.
    choice /C YN /M "Do you want to continue anyway"
    if errorlevel 2 goto :end
)

echo.
echo Starting Spring Boot backend...
echo.

call mvnw.cmd spring-boot:run

:end
echo.
echo Backend stopped.
pause
