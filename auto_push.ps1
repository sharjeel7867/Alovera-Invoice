while ($true) {
    $status = git status --porcelain
    if ($status) {
        git add .
        git commit -m "Auto-commit changes"
        git push
        Write-Host "Changes pushed at $(Get-Date)"
    }
    Start-Sleep -Seconds 10
}
