Write-Host "Start build ..."
Write-Host  "Global node/npm paths  ..."
& where.exe npm
& where.exe node

Write-Host "Global node version"
& node -v

Write-Host "Global npm version"
& npm -v

$exitCode = 0;

Write-Host "start: try install latest Angular Client CLI version"
& npm install @angular/cli@12.2.11 -g
Write-Host "done: try install latest Angular Client CLI version"

Write-Host "Global ng path.."
& where.exe ng

Write-Host "Global Angular Client CLI version"
& ng version

$exitCode += $LASTEXITCODE;

if ($exitCode -ne 0) {
  Write-Host "Failed to install latest Angular Client CLI version"
  exit $exitCode
}

Write-Host "start: try install latest npm version"
& npm install npm@latest -g
Write-Host "done: try install latest npm version"

# Do not update $exitCode because we do not want to fail if install latest npm version fails.

Write-Host "start: npm install"
& cd .\Angular
& npm install --no-audit --no-save
Write-Host "done: npm install"
$exitCode += $LASTEXITCODE;

if ($exitCode -ne 0) {
  Write-Host "Failed to run npm install"
  exit $exitCode
}

exit $exitCode