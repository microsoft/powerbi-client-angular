$exitCode = 0;

Write-Host "start: List all files"
& cd .\Angular\powerbi-client-angular
& dir
Write-Host "end: List all files"

# Build the package
Write-Host "start: ng build"
& ng build
Write-Host "done: ng build"

$exitCode += $LASTEXITCODE;

if ($exitCode -ne 0) {
  Write-Host "Failed to run ng build"
  exit $exitCode
}

# Check linting
Write-Host "start: ng lint"
& ng lint
Write-Host "done: ng lint"

$exitCode += $LASTEXITCODE;

if ($exitCode -ne 0) {
  Write-Host "Failed to run ng lint"
  exit $exitCode
}

# Get contents of dist folder
Write-Host "start: Get dist folder files"
& dir "dist"
$distItems = Get-ChildItem -Force './dist'
If ($distItems.Count -ne 1 -or $distItems.Name -ne "powerbi-client-angular") {
    Write-Host "Error: dist folder should contain only powerbi-client-angular folder!"
    $exitCode += 1;
    exit $exitCode
}
& dir "dist/powerbi-client-angular"
Write-Host "Done: Get dist folder files"

exit $exitCode