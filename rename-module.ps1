# rename-module.ps1 — Rename a MagicMirror React module
# Usage  : .\rename-module.ps1 <NewModuleName>
# Example: .\rename-module.ps1 MMM-ReactClock
#
# First run: automatically removes the template .git folder.
# Safe to run multiple times — detects the current name automatically
# from package.json and replaces all three name variants:
#   • Proper-case  (MMM-ReactSample)
#   • kebab-lower  (mmm-reactsample)  — CSS classes, package.json name, etc.
#   • camelCase    (mmmReactsample)   — dataset JS properties

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$NewName
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Set-Location $PSScriptRoot

# ── helpers ───────────────────────────────────────────────────────────────────

function ToCamelCase([string]$kebab) {
    # Converts "mmm-foo-bar" -> "mmmFooBar"
    $parts  = $kebab -split '-'
    $result = $parts[0]
    for ($i = 1; $i -lt $parts.Count; $i++) {
        $p = $parts[$i]
        if ($p.Length -gt 0) {
            $result += $p.Substring(0, 1).ToUpper() + $p.Substring(1)
        }
    }
    return $result
}

# UTF-8 without BOM encoder — used for all file I/O
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# ── argument validation ───────────────────────────────────────────────────────

if (-not $NewName.StartsWith('MMM-')) {
    Write-Error "New name must start with 'MMM-'  (got: '$NewName')"
    exit 1
}

# ── detect current name from package.json ─────────────────────────────────────

if (-not (Test-Path 'package.json')) {
    Write-Error "package.json not found — run from the module root directory."
    exit 1
}

$pkg = Get-Content 'package.json' -Raw | ConvertFrom-Json

if ($null -eq $pkg.main -or $pkg.main -eq '') {
    Write-Error "No 'main' field found in package.json."
    exit 1
}

$oldJs   = $pkg.main                        # e.g. "MMM-ReactSample.js"
$oldName = $oldJs -replace '\.js$', ''      # e.g. "MMM-ReactSample"

if (-not $oldName.StartsWith('MMM-')) {
    Write-Error "Current 'main' value '$oldJs' does not start with 'MMM-'."
    exit 1
}

# ── remove template .git on first run ────────────────────────────────────────

$gitDir = Join-Path $PSScriptRoot '.git'
if (Test-Path $gitDir) {
    $templateRemote = 'https://github.com/alphaorderly/Magic-Mirror-v2-React-module-template'
    $currentRemote  = ''
    try {
        $currentRemote = (git -C $PSScriptRoot remote get-url origin 2>$null).Trim()
    } catch {}
    if ($currentRemote -like "$templateRemote*") {
        Write-Host 'Detected template .git folder — removing it.'
        Remove-Item -Recurse -Force $gitDir
        Write-Host "  removed : .git  (run 'git init' to start your own repo)"
    } else {
        Write-Host "Note: .git exists but points to '$currentRemote' — leaving it as-is."
    }
    Write-Host ''
}

if ($oldName -eq $NewName) {
    Write-Host "Module is already named '$NewName' — nothing to do."
    exit 0
}

# ── derive all three name variants ────────────────────────────────────────────

$oldLower = $oldName.ToLower()
$oldCamel = ToCamelCase $oldLower

$newLower = $NewName.ToLower()
$newCamel = ToCamelCase $newLower

Write-Host "Renaming  : $oldName  ->  $NewName"
Write-Host "  kebab   : $oldLower  ->  $newLower"
Write-Host "  camel   : $oldCamel  ->  $newCamel"
Write-Host ''

$oldStrings = @($oldName, $oldLower, $oldCamel)
$newStrings = @($NewName,  $newLower,  $newCamel)

# ── replace occurrences in source files ──────────────────────────────────────

$validExts   = @('.js', '.ts', '.tsx', '.json', '.md', '.css', '.html', '.yml', '.yaml')
$excludeDirs = @('node_modules', 'dist', '.git')

$files = Get-ChildItem -Path '.' -Recurse -File | Where-Object {
    $rel    = $_.FullName.Substring($PSScriptRoot.Length + 1)
    $topDir = ($rel -split '[/\\]')[0]
    ($topDir -notin $excludeDirs) -and ($_.Extension -in $validExts)
} | Sort-Object FullName

$changed = 0
foreach ($file in $files) {
    $content  = [System.IO.File]::ReadAllText($file.FullName, $utf8NoBom)
    $modified = $false

    for ($i = 0; $i -lt $oldStrings.Count; $i++) {
        if ($content.Contains($oldStrings[$i])) {
            $content  = $content.Replace($oldStrings[$i], $newStrings[$i])
            $modified = $true
        }
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        $rel = $file.FullName.Substring($PSScriptRoot.Length + 1)
        Write-Host "  updated : .\$rel"
        $changed++
    }
}

# ── rename the module wrapper .js file ───────────────────────────────────────

$oldJsPath = Join-Path $PSScriptRoot "${oldName}.js"
$newJsPath = Join-Path $PSScriptRoot "${NewName}.js"

if (Test-Path $oldJsPath) {
    Rename-Item -Path $oldJsPath -NewName "${NewName}.js"
    Write-Host "  renamed : ${oldName}.js  ->  ${NewName}.js"
} elseif (Test-Path $newJsPath) {
    Write-Host "  (wrapper already at ${NewName}.js)"
} else {
    Write-Warning "Expected wrapper '${oldName}.js' not found — skipping file rename."
}

Write-Host ''
Write-Host "Done — $changed file(s) updated."
Write-Host ''
if (-not (Test-Path (Join-Path $PSScriptRoot '.git'))) {
    Write-Host 'Next step: initialise your own git repo:'
    Write-Host "  git init; git add .; git commit -m 'chore: initial commit'"
    Write-Host ''
}
$dirName = Split-Path $PSScriptRoot -Leaf
Write-Host 'Tip: To also rename the directory itself, run from the parent:'
Write-Host "     Rename-Item '$dirName' '$NewName'"
