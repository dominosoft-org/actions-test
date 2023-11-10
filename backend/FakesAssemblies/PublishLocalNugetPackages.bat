@echo off
  set NUPKGS=Grpc Microsoft System
  set LOCAL_STORE_PATH=..\..\nupkg
  set CONFIGURATION=Release

  if NOT EXIST "FakesAssemblies.sln" goto END
:START
  for %%A in (%NUPKGS%) do copy /Y FakesAssemblies.%%A\bin\%CONFIGURATION%\NeuroFramework.Testing.FakesAssemblies.%%A.*.nupkg "%LOCAL_STORE_PATH%"
  for /f %%i in ('dir /a:d /s /b %userprofile%\.nuget\packages\neuroframework*') do rd /s /q %%i
  dir "%LOCAL_STORE_PATH%"
:END
