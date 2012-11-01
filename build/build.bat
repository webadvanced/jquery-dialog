@echo off
set PATH=\
echo Running jsHint
C:\Windows\System32\cscript.exe jsHint\wsh.js ..\src\js\dialog.js
echo Running ajaxMin
minify\ajaxmin -clobber ..\src\js\dialog.js -o ..\dialog\js\jquery.dialog.min.js
minify\ajaxmin -clobber ..\src\css\dialog.css -o ..\dialog\css\jquery.dialog.css
echo ----------------------------------------------
