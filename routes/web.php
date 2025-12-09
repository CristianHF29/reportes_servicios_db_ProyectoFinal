<?php

    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\Auth\LoginController;
    use App\Http\Controllers\Tecnico\TecnicoController;

    // Página pública con tu React principal
    Route::get('/', function () {
        return view('welcome');
    });

    // ===== RUTAS DE AUTENTICACIÓN =====

    // Login (solo invitados)
    Route::middleware('guest')->group(function () {
        Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [LoginController::class, 'login']);
    });

    // Logout (solo usuarios autenticados)
    Route::post('/logout', [LoginController::class, 'logout'])
        ->middleware('auth')
        ->name('logout');

    // ===== ZONA ADMIN PROTEGIDA =====

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/admin', function () {
            return view('admin');   // tu vista con el panel técnico (React)
        });
    });

    // ZONA TÉCNICO PROTEGIDA
    Route::middleware(['auth', 'tecnico'])->group(function () {

    // Vista del panel técnico
    Route::get('/tecnico', function () {
        return view('tecnico'); // donde montas tecnico.jsx
    });

    // JSON con los reportes asignados al técnico logueado
    Route::get('/tecnico/reportes', [TecnicoController::class, 'misReportes']);

    // Actualizar estado de un reporte asignado
    Route::put('/tecnico/reportes/{id}/estado', [TecnicoController::class, 'actualizarEstado'])
        ->name('tecnico.reportes.estado');
    });

    Route::get('/force-logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('/login');
    });

