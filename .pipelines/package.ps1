$exitCode = 0;

Write-Host "start: npm pack"
& cd .\Angular
& npm run package
Write-Host "done: npm pack"

$exitCode += $LASTEXITCODE;

if ($exitCode -ne 0) {
  Write-Host "Failed to run npm pack"
  exit $exitCode
}

Write-Host "start: Get content of current folder"
& dir "dist/powerbi-client-angular"
Write-Host "done: Get content of current folder"

exit $exitCode