@echo off
rem Sets up the Dungeon Runner multiplayer relay with Docker (docker-compose.hosting.yml).
rem Double-click it, or run it from a terminal. Safe to run again: it just re-applies the setup.
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0.."
title Dungeon Runner relay - Docker setup

echo.
echo  Dungeon Runner multiplayer relay - Docker setup
echo  ================================================
echo.

where docker >nul 2>&1
if errorlevel 1 (
  echo  Docker was not found. Install Docker Desktop, then run this again.
  goto :fail
)
docker info >nul 2>&1
if errorlevel 1 (
  echo  Docker is installed but not running. Start Docker Desktop, then run this again.
  goto :fail
)
if not exist docker-compose.hosting.yml (
  echo  docker-compose.hosting.yml not found in %CD%.
  goto :fail
)

echo  How should the relay be hosted?
echo.
echo    1  Friends on my network    relay only, port 3001, no HTTPS
echo    2  Public on the internet   Caddy (HTTPS) + nginx + relay
echo.
choice /c 12 /n /m " Choose 1 or 2: "
if errorlevel 2 goto :public

:lan
echo.
echo  Starting the relay...
docker compose -f docker-compose.hosting.yml up -d --build
if errorlevel 1 goto :composefail
echo.
docker compose -f docker-compose.hosting.yml ps
echo.
echo  Done. The relay listens on port 3001 of this PC.
echo    - In the game choose "Direct / LAN" when hosting; guests enter the 7-character code.
echo    - If guests cannot connect, allow inbound TCP 3001 in Windows Firewall.
goto :end

:public
set "HOST="
if exist .env (
  for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if /i "%%A"=="RELAY_HOSTNAME" set "HOST=%%B"
  )
)
if defined HOST if /i not "!HOST!"=="relay.example.com" (
  echo.
  echo  Host name in .env: !HOST!
  choice /c YN /n /m " Keep it? [Y/N] "
  if errorlevel 2 set "HOST="
) else set "HOST="

:askhost
if not defined HOST (
  echo.
  echo  Public host name for the relay, e.g. relay.example.com
  echo  ^(it needs a DNS record pointing at this PC; type localhost to test on this PC only^)
  set /p "HOST= Host name: "
)
if not defined HOST goto :askhost
echo !HOST!| findstr /r /c:"^[A-Za-z0-9][A-Za-z0-9.-]*$" >nul
if errorlevel 1 (
  echo  "!HOST!" is not a valid host name ^(letters, digits, dots and dashes only^).
  set "HOST="
  goto :askhost
)

if not exist .env copy /y .env.example .env >nul
findstr /b /c:"RELAY_HOSTNAME=" .env >nul
if errorlevel 1 (
  >>.env echo RELAY_HOSTNAME=!HOST!
) else (
  powershell -NoProfile -Command "(Get-Content -LiteralPath '.env') -replace '^RELAY_HOSTNAME=.*','RELAY_HOSTNAME=!HOST!' | Set-Content -LiteralPath '.env'"
)
echo.
echo  Saved RELAY_HOSTNAME=!HOST! to .env

if /i not "!HOST!"=="localhost" (
  echo.
  echo  Before this works from the internet:
  echo    - a DNS record for !HOST! must point at this PC's public address
  echo    - ports 80 and 443 must be forwarded to this PC ^(Caddy needs both for its certificate^)
)

echo.
echo  Starting Caddy, nginx and the relay...
docker compose -f docker-compose.hosting.yml --profile public up -d --build
if errorlevel 1 goto :composefail
echo.
docker compose -f docker-compose.hosting.yml --profile public ps
echo.
echo  Done. Build the game client with:
echo      VITE_MULTIPLAYER_URL=https://!HOST!
echo.
echo  Check it ^(give Caddy a minute to get its certificate^):
if /i "!HOST!"=="localhost" (
  echo      curl.exe -k -i https://localhost/socket.io/?EIO=4^&transport=polling
) else (
  echo      curl.exe -i "https://!HOST!/socket.io/?EIO=4&transport=polling"
)
echo  Expect 200. Also /room and /info should be 404.
goto :end

:composefail
echo.
echo  docker compose failed ^(see the messages above^).
echo  If a port is already in use or reserved by Windows, set PROXY_HTTP_PORT / PROXY_HTTPS_PORT
echo  ^(public^) or RELAY_PORT in the .env file, then run this again.
goto :fail

:fail
echo.
pause
exit /b 1

:end
echo.
pause
exit /b 0
