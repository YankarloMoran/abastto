# Crear las acciones y disparadores para la tarea programada
$action = New-ScheduledTaskAction -Execute "node" -Argument '"C:\Users\Yankarlo Moràn\OneDrive\Documentos\Abastto\scripts\keep-alive.js"'

# Disparadores: Diariamente a las 12:00 PM y también al iniciar sesión
$trigger1 = New-ScheduledTaskTrigger -Daily -At 12:00PM
$trigger2 = New-ScheduledTaskTrigger -AtLogOn

$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

# Ajustes de la tarea para permitir ejecutarla si el equipo no estaba encendido
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# Registrar la tarea en Windows Task Scheduler
Register-ScheduledTask -TaskName "SupabaseKeepAlive" -Action $action -Trigger $trigger1, $trigger2 -Principal $principal -Settings $settings -Description "Mantiene activas las bases de datos de Supabase (Abastto y Karta) mediante pings periódicos." -Force

Write-Host "✅ Tarea programada 'SupabaseKeepAlive' registrada con éxito en Windows Task Scheduler."
