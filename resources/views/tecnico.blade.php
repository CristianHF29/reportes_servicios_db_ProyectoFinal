<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/x-icon" href="/el-salvador.png">
    <title>Panel técnico - Mis reportes</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    @viteReactRefresh
    @vite('resources/js/tecnico.jsx')
</head>
<body class="tecnico-body">
    <div id="tecnico-root"></div>
</body>
</html>
