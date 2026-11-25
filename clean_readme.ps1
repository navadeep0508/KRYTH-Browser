$readme = 'C:\Users\\Documents\projects\Browser Agent\README.md'
$content = Get-Content $readme -Raw

# Remove GitHub URLs
$content = $content -replace 'https://github\.com/[^\s)"\']+', ''
# Remove raw.githubusercontent.com URLs
$content = $content -replace 'https://raw\.githubusercontent\.com/[^\s)"\']+', ''
# Remove avatars.githubusercontent.com URLs
$content = $content -replace 'https://avatars\.githubusercontent\.com/[^\s"\']+', ''
# Remove user-attachments assets URLs
$content = $content -replace 'https://github\.com/user-attachments/assets/[^\s)"\']+', ''
# Remove trend.ondo.sh/github URLs
$content = $content -replace 'https://trend\.ondo\.sh/github/[^\s)"\']+', ''
# Remove Browser Agent branding from asset filenames
$content = $content -replace 'Browser Agent-', ''
# Clean up empty <a> tags left after URL removal
$content = $content -replace '<a href="">[^<]*</a>', ''
# Clean up multiple blank lines
$content = $content -replace "`n{3,}", "`n`n"

Set-Content -Path $readme -Value $content -Encoding UTF8
Write-Host 'README.md done'


