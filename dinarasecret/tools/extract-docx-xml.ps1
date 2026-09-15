param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$docx = Get-ChildItem -LiteralPath $ProjectRoot -Filter '*.docx' | Select-Object -First 1
if (-not $docx) {
  throw 'No .docx file found in project root'
}

$tempDir = Join-Path $ProjectRoot 'tools\.docx-temp'
if (Test-Path $tempDir) {
  Remove-Item -LiteralPath $tempDir -Recurse -Force
}

[System.IO.Compression.ZipFile]::ExtractToDirectory($docx.FullName, $tempDir)

$sourceXml = Join-Path $tempDir 'word\document.xml'
$outputXml = Join-Path $ProjectRoot 'tools\document.xml'

Copy-Item -LiteralPath $sourceXml -Destination $outputXml -Force
Write-Output $outputXml
