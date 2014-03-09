@echo off
echo ---------------------Compiling typescript-----------------------
echo --module "commonjs" > compile.txt
dir /s/b *.ts >> compile.txt
"C:\Program Files (x86)\Microsoft SDKs\TypeScript\tsc.exe" @compile.txt
del compile.txt
echo ---------------------Running Pre-Build events--------------------------
node prebuild.js
:choice
set /P c=Would you like to start the server [Y/N]?
if /I "%c%" EQU "Y" goto :run_node
if /I "%c%" EQU "N" goto :label_exit
goto :choice
:run_node
echo ---------------------Starting Server--------------------------
node server.js
:label_exit
echo ---------------------FINISHED --------------------------
echo on