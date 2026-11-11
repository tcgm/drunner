@echo off
rem Installs the Dungeon Runner relay site into an nginx that runs in a Docker container
rem (for example nginx-ui). Asks a few questions, shows what it would change, then asks
rem before changing anything. The previous site file is backed up and restored if nginx
rem rejects the new one. Safe to run again.
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0.."
title Dungeon Runner relay - nginx setup

echo.
echo  Dungeon Runner multiplayer relay - nginx setup
echo  ===============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  Node.js was not found. Install it from https://nodejs.org, then run this again.
  goto :fail
)
where docker >nul 2>&1
if errorlevel 1 (
  echo  Docker was not found. This script installs into an nginx running in a Docker container.
  echo  For nginx on a Linux machine see docs\development\hosting.md ^(--local^).
  goto :fail
)
docker info >nul 2>&1
if errorlevel 1 (
  echo  Docker is installed but not running. Start Docker Desktop, then run this again.
  goto :fail
)

echo  Running containers that look like nginx:
docker ps --format "   {{.Names}}   ({{.Image}})" | findstr /i nginx
if errorlevel 1 echo    ^(none found - you can still type a container name below^)
echo.

set "CONTAINER="
set /p "CONTAINER= nginx container name [nginxui]: "
if not defined CONTAINER set "CONTAINER=nginxui"

echo.
set "SERVERNAME="
set /p "SERVERNAME= Public host name for the relay (e.g. relay.example.com): "
if not defined SERVERNAME (
  echo  A host name is required.
  goto :fail
)

echo.
echo  Where is the relay running?
echo.
echo    1  On this PC, in Docker or directly   ^(published on a port of this PC^)
echo    2  On another machine                  ^(an address you type^)
echo.
choice /c 12 /n /m " Choose 1 or 2: "
if errorlevel 2 goto :remote

:local
set "PORT="
set /p "PORT= Relay port on this PC [3001]: "
if not defined PORT set "PORT=3001"
set "UPSTREAM=host.docker.internal:!PORT!"
set "RESOLVER=127.0.0.11"
echo.
echo  Using !UPSTREAM!. ^(Containers on Docker Desktop cannot reach this PC's LAN address,
echo  but host.docker.internal works.^)
goto :run

:remote
set "UPSTREAM="
set /p "UPSTREAM= Relay address as host:port (e.g. 192.168.1.20:3001): "
if not defined UPSTREAM (
  echo  A relay address is required.
  goto :fail
)
set "RESOLVER="
echo.
echo  If that is a host name rather than an IP address, nginx needs a DNS server to look it up.
set /p "RESOLVER= DNS server IP (leave empty if you typed an IP address): "

:run
set "RESARG="
if defined RESOLVER set "RESARG=--resolver "!RESOLVER!""

echo.
echo  --- What would change ---------------------------------------------------
node "%~dp0setup-nginx.mjs" --server-name "!SERVERNAME!" --upstream "!UPSTREAM!" !RESARG! --container "!CONTAINER!" --dry-run
if errorlevel 1 goto :fail
echo  -------------------------------------------------------------------------
echo.
choice /c YN /n /m " Install it now? [Y/N] "
if errorlevel 2 (
  echo  Nothing was changed.
  goto :end
)

echo.
node "%~dp0setup-nginx.mjs" --server-name "!SERVERNAME!" --upstream "!UPSTREAM!" !RESARG! --container "!CONTAINER!"
if errorlevel 1 goto :fail

echo.
echo  Note: if you manage this nginx with nginx-ui, saving the site there can overwrite
echo  it. Run this script again if /room or /info start answering.
goto :end

:fail
echo.
echo  Setup did not finish.
echo.
pause
exit /b 1

:end
echo.
pause
exit /b 0
