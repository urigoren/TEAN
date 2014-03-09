@echo off
echo Compiling typescript
echo --module "commonjs" > compile.txt
dir /s/b *.ts >> compile.txt
"C:\Program Files (x86)\Microsoft SDKs\TypeScript\tsc.exe" @compile.txt
del compile.txt
echo Running Pre-Build events
node prebuild.js
echo on