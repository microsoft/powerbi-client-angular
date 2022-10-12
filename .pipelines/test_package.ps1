$package = Get-Item -Path dist/powerbi-client-angular/*.tgz
$packPath = $package.FullName
Write-Host "Package full name: $packPath"

Write-Host "start: verify package name"
$version = [Environment]::GetEnvironmentVariable("Version", "User")
$expectedPackName = "powerbi-client-angular-$version.tgz"
$packName = $package.Name
if ($packName -ne $expectedPackName) {
    Write-Host "Error: expected package name '$expectedPackName', but got '$packName'"
    $exitCode += 1;
    exit $exitCode
}
Write-Host "done: verify package name"

Write-Host "start: install package in test environment"
mkdir testProject
cd .\testProject
npm init -y
npm install $packPath
cd ..
rm -r .\testProject\
Write-Host "done: install package in test environment"
