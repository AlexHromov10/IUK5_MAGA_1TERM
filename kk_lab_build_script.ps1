Write-Host "Deleting kk_lab_1_src/dist" -ForegroundColor Green
Remove-Item -r $PSScriptRoot/kk_lab_1_src/dist

Write-Host "Deleting kk_lab_2_src/dist" -ForegroundColor Green
Remove-Item -r $PSScriptRoot/kk_lab_2_src/dist

########

Write-Host "Deleting lex in kk_lab_2_src" -ForegroundColor Green
Remove-Item -r $PSScriptRoot/kk_lab_2_src/node_modules/lex

########

Write-Host "Deleting package-lock.json in kk_lab_1_src" -ForegroundColor Green
Remove-Item -Force $PSScriptRoot/kk_lab_1_src/package-lock.json

Write-Host "Deleting package-lock.json in kk_lab_2_src" -ForegroundColor Green
Remove-Item -Force $PSScriptRoot/kk_lab_2_src/package-lock.json

########

Set-Location $PSScriptRoot/kk_lab_1_src

Write-Host "kk_lab_1_src npm i" -ForegroundColor Green
npm install --install-links

Write-Host "kk_lab_1_src npm build" -ForegroundColor Green
npm run build

########

Set-Location $PSScriptRoot/kk_lab_2_src

Write-Host "kk_lab_2_src npm i" -ForegroundColor Green
npm install --install-links

Write-Host "kk_lab_2_src npm build" -ForegroundColor Green
npm run build

########

Write-Host " "
Write-Host "Finished!" -ForegroundColor Green
pause
