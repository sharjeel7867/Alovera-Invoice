$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("C:\Users\pc\Desktop\Alover Invoice.lnk")
$Shortcut.TargetPath = "C:\Users\pc\Desktop\Alover Invoice\index.html"
$Shortcut.IconLocation = "C:\Users\pc\Desktop\Alover Invoice\icon.ico"
$Shortcut.WorkingDirectory = "C:\Users\pc\Desktop\Alover Invoice"
$Shortcut.Save()
Write-Host "Shortcut created successfully."
