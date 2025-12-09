<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ReporteController;
use App\Http\Controllers\Admin\AdminController;

// =============== RUTAS PÚBLICAS DE REPORTES ============

// Lista y creación
Route::get('/reportes', [ReporteController::class, 'index']);
Route::post('/reportes', [ReporteController::class, 'store']);

// Rutas especiales (poner antes de {id})
Route::get('/reportes/estadisticas/resumen', [ReporteController::class, 'resumen']);
Route::get('/reportes/estado/{estado}', [ReporteController::class, 'porEstado']);
Route::get('/reportes/tipo/{tipo_servicio}', [ReporteController::class, 'porTipo']);
Route::get('/reportes/buscar', [ReporteController::class, 'buscar']);

// CRUD por ID
Route::get('/reportes/{id}', [ReporteController::class, 'show']);
Route::put('/reportes/{id}', [ReporteController::class, 'update']);
Route::delete('/reportes/{id}', [ReporteController::class, 'destroy']);


// ===================== RUTAS ADMIN =====================
Route::prefix('admin')->group(function () {

    // Lista de reportes para el panel admin
    Route::get('/reportes', [AdminController::class, 'index']);

    // Lista de técnicos
    Route::get('/tecnicos', [AdminController::class, 'tecnicos']);

    // Asignar técnico a un reporte
    Route::put('/reportes/{id}/asignar', [AdminController::class, 'asignarTecnico']);

    // Finalizar reporte
    Route::put('/reportes/{id}/finalizar', [AdminController::class, 'finalizar']);
});


// ===================== RUTAS TÉCNICO ===================
Route::middleware(['auth:sanctum'])->group(function () {

    // Reportes asignados al técnico logueado
    Route::get('/tecnico/reportes', [AdminController::class, 'misReportes']);

    // Actualizar estado (en_proceso / resuelto)
    Route::put('/tecnico/reportes/{id}/estado', [AdminController::class, 'actualizarEstadoTecnico']);
});





