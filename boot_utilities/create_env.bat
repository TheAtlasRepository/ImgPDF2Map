@echo off

:: Create a new .env.local file
echo .env.local file not found Creating a new .env.local file
echo "Insert the token from mapbox here"
set /p token=
echo # .env.local >> frontend\.env.local
echo NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=%token% >> frontend\.env.local
exit /b