<?php

namespace App\Http\Controllers\Tecnico;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Reporte;

class TecnicoController extends Controller
{
    public function misReportes()
    {
        $userId = Auth::id();

        $reportes = Reporte::where('assignee_id', $userId)
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($reportes);
    }

    public function actualizarEstado(Request $request, $id)
    {
        // Solo permitir estos dos estados
        $data = $request->validate([
            'estado' => 'required|in:en_proceso,resuelto',
        ]);

        // Buscar solo reportes asignados a este técnico
        $reporte = Reporte::where('id', $id)
            ->where('assignee_id', Auth::id())
            ->firstOrFail();

        $reporte->estado = $data['estado'];
        $reporte->save();

        return response()->json($reporte);
    }
}

