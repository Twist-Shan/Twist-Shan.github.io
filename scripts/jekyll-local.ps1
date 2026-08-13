param(
    [ValidateSet("build", "serve")]
    [string] $Command = "build",

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $JekyllArgs
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$repoParent = Split-Path -Parent $repoRoot
$repoName = Split-Path -Leaf $repoRoot
$bundleCommand = Get-Command bundle.bat -ErrorAction SilentlyContinue
if ($bundleCommand) {
    $bundleExecutable = $bundleCommand.Source
}
elseif (Test-Path -LiteralPath "C:\Ruby33-x64\bin\bundle.bat" -PathType Leaf) {
    $bundleExecutable = "C:\Ruby33-x64\bin\bundle.bat"
}
else {
    throw "Bundler was not found. Open a new terminal after installing Ruby, then retry."
}

$rubyBin = Split-Path -Parent $bundleExecutable
$jekyllExecutable = Join-Path $rubyBin "jekyll"

if (-not (Test-Path -LiteralPath $jekyllExecutable -PathType Leaf)) {
    throw "Jekyll executable not found. Run 'bundle install' in the homepage repository first."
}

$originalLocation = Get-Location
$mappedDrive = $null

try {
    # Legacy Ruby Sass cannot reliably glob Unicode paths on Windows. Map the
    # repository's parent to an unused ASCII drive for the duration of the run.
    if ($repoRoot -match "[^\x00-\x7F]") {
        foreach ($letter in @("P", "Q", "R", "S", "T", "U", "V", "W")) {
            $candidate = "${letter}:"
            if (-not (Test-Path "${candidate}\")) {
                & subst.exe $candidate $repoParent
                if ($LASTEXITCODE -ne 0) {
                    throw "Failed to map $candidate to $repoParent."
                }
                $mappedDrive = $candidate
                $repoRoot = "${candidate}\$repoName"
                break
            }
        }

        if (-not $mappedDrive) {
            throw "No free drive letter was available for the local Jekyll build."
        }
    }

    Set-Location -LiteralPath $repoRoot

    & $bundleExecutable check
    if ($LASTEXITCODE -ne 0) {
        throw "Bundled gems are incomplete. Run 'bundle install' and retry."
    }

    & $bundleExecutable exec $jekyllExecutable $Command @JekyllArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Jekyll $Command failed with exit code $LASTEXITCODE."
    }
}
finally {
    Set-Location $originalLocation
    if ($mappedDrive) {
        & subst.exe $mappedDrive /D
    }
}
