<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/x-icon" href="/el-salvador.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel técnico - Iniciar sesión</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <style>
        body {
            margin: 0;
            background-color: #0B2A47;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #fff;
        }

        .login-card {
            background: #ffffff;
            color: #333;
            padding: 3rem 2.5rem;
            border-radius: 16px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.25);
            text-align: center;
        }

        h2 {
            margin-bottom: 1rem;
            font-size: 1.8rem;
        }

        input {
            width: 70%;
            padding: 12px;
            margin-top: 12px;
            border: 1px solid #bbb;
            border-radius: 8px;
            font-size: 1rem;
        }

        button {
            width: 80%;
            padding: 12px;
            border: none;
            background-color: #1F6FEB;
            color: #fff;
            font-size: 1.1rem;
            border-radius: 8px;
            margin-top: 20px;
            cursor: pointer;
            transition: 0.3s;
        }

        button:hover {
            background-color: #1258c8;
        }

        .alert {
            margin-top: 1rem;
            color: #c0392b;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>

    <div class="login-card">
        <h2>Iniciar sesión</h2>

        @if ($errors->any())
            <div class="alert">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="/login">
            @csrf

            <input 
                type="email" 
                name="email" 
                placeholder="Correo electrónico" 
                required
            >

            <input 
                type="password" 
                name="password" 
                placeholder="Contraseña" 
                required
            >

            <button type="submit">Entrar</button>
        </form>
    </div>

</body>
</html>

