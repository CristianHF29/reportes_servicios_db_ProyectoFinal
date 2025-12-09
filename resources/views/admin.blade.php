<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/x-icon" href="/el-salvador.png">
    <title>Panel Administrativo - Reportes de servicios</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    @viteReactRefresh
    @vite('resources/js/admin.jsx')
</head>
<body class="admin-body">
    <div id="admin-root"></div>
</body>
</html>
