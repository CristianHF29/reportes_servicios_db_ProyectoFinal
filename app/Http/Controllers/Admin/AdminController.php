<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Reporte;
use App\Models\User;

class AdminController extends Controller
{
    // ===================== PANEL ADMIN =====================

    /**
     * GET /api/admin/reportes
     * Lista paginada de reportes para el panel admin.
     * Soporta filtro por tipo_servicio y per_page.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $tipo    = $request->query('tipo_servicio');

        $query = Reporte::with(['assignedTo'])
            ->orderBy('id', 'asc');

        if ($tipo) {
            $query->where('tipo_servicio', $tipo);
        }

        return $query->paginate($perPage);
    }

    /**
     * PUT /api/admin/reportes/{id}/finalizar
     * (opcional, si lo usas)
     */
    public function finalizar($id)
    {
        $reporte = Reporte::findOrFail($id);
        $reporte->estado = 'resuelto';
        $reporte->save();

        return response()->json($reporte);
    }

    /**
     * GET /api/admin/tecnicos
     *
     * Devuelve la lista de técnicos + conteos:
     * - total_reportes      → todos los asignados
     * - pendientes_reportes → solo pendientes
     * - hoy_reportes        → asignados hoy
     */
    public function tecnicos()
    {
        return User::where('role', 'tecnico')
            ->withCount([
                'reportesAsignados as total_reportes',
                'reportesPendientes as pendientes_reportes',
                'reportesHoy as hoy_reportes',
            ])
            ->orderBy('id')
            ->get(['id', 'name', 'email']);
    }

    /**
     * PUT /api/admin/reportes/{id}/asignar
     *
     * Asignar o cambiar de técnico un reporte.
     * Incluye límite de 5 reportes por técnico al día.
     */
    public function asignarTecnico(Request $request, $id)
    {
        $reporte = Reporte::findOrFail($id);

        // Validar que el técnico exista (o permitir NULL para "sin asignar")
        $data = $request->validate([
            'assignee_id' => ['nullable', 'exists:users,id'],
        ]);

        $nuevoTecnicoId = $data['assignee_id'] ?? null;

        // Si viene un técnico, verificamos que de verdad sea "tecnico"
        if (!empty($nuevoTecnicoId)) {
            $esTecnico = User::where('id', $nuevoTecnicoId)
                ->where('role', 'tecnico')
                ->exists();

            if (!$esTecnico) {
                return response()->json([
                    'message' => 'El usuario seleccionado no es un técnico válido.',
                ], 422);
            }

            // ====== LÍMITE DE 5 REPORTES POR DÍA ======
            $hoy = now()->toDateString();

            $reportesHoy = Reporte::where('assignee_id', $nuevoTecnicoId)
                ->whereDate('assigned_at', $hoy)
                ->count();

            if ($reportesHoy >= 5) {
                return response()->json([
                    'message' => 'Este técnico ya tiene el máximo de 5 reportes asignados para hoy.',
                ], 422);
            }

            // Si pasa la validación, asignamos técnico y marcamos assigned_at = ahora
            $reporte->assignee_id = $nuevoTecnicoId;
            $reporte->assigned_at = now();
        } else {
            // Quitar asignación
            $reporte->assignee_id = null;
            $reporte->assigned_at = null;
        }

        $reporte->save();

        // Devolvemos el reporte con el técnico cargado
        return response()->json(
            $reporte->load('assignedTo')
        );
    }

    // ===================== ZONA TÉCNICO (API) =====================

    /**
     * GET /api/tecnico/reportes
     * Devuelve los reportes asignados al técnico logueado (JSON).
     */
    public function misReportes()
    {
        $userId = Auth::id();

        $reportes = Reporte::where('assignee_id', $userId)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($reportes);
    }

    /**
     * PUT /api/tecnico/reportes/{id}/estado
     * Permite al técnico cambiar solo su propio reporte a
     * "en_proceso" o "resuelto".
     */
    public function actualizarEstadoTecnico(Request $request, $id)
    {
        $userId = Auth::id();

        // Solo puede tocar reportes que le pertenecen
        $reporte = Reporte::where('id', $id)
            ->where('assignee_id', $userId)
            ->firstOrFail();

        $data = $request->validate([
            'estado' => ['required', 'in:en_proceso,resuelto'],
        ]);

        $reporte->estado = $data['estado'];
        $reporte->save();

        return response()->json($reporte);
    }
}