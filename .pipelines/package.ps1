$exitCode = 0;
$baseDir = $pwd;
Write-Host "start: npm pack"
& cd .\Angular\powerbi-client-angular
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

$exitCode += $LASTEXITCODE;

Write-Host "start: test package"
& $baseDir\.pipelines\test_package.ps1
Write-Host "done: test package"

$exitCode += $LASTEXITCODE;

exit $exitCode