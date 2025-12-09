<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reporte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    // GET /api/reportes
    // Lista de reportes con paginación
    public function index(Request $request)
    {
        // Leer per_page desde la URL, por defecto 200
        $perPage = (int) $request->get('per_page', 200);

        return Reporte::orderBy('id', 'desc')
            ->paginate($perPage);
    }

    // POST /api/reportes
    // Crear un nuevo reporte
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo_servicio' => 'required|in:electricidad,agua,internet',
            'descripcion'   => 'required|string',
            'titulo'        => 'nullable|string|max:255',
            'proveedor'     => 'nullable|string|max:255',
            'departamento'  => 'nullable|string|max:255',
            'municipio'     => 'nullable|string|max:255',
            'zona'          => 'nullable|string|max:255',
            'latitud'       => 'nullable|numeric',
            'longitud'      => 'nullable|numeric',
            'estado'        => 'nullable|in:pendiente,en_proceso,resuelto,descartado',
        ]);

        // Público: sin usuario asociado
        $validated['user_id'] = null;

        // 1) Crear el reporte
        $reporte = Reporte::create($validated);

        // 2) Generar código tipo A00001
        $reporte->codigo = 'A' . str_pad($reporte->id, 5, '0', STR_PAD_LEFT);
        $reporte->save();

        return response()->json($reporte, 201);
    }

    // GET /api/reportes/{id}
    public function show($id)
    {
        $reporte = Reporte::findOrFail($id);
        return response()->json($reporte);
    }

    // PUT /api/reportes/{id}
    public function update(Request $request, $id)
    {
        $reporte = Reporte::findOrFail($id);

        $validated = $request->validate([
            'tipo_servicio' => 'sometimes|in:electricidad,agua,internet',
            'descripcion'   => 'sometimes|string',
            'titulo'        => 'sometimes|nullable|string|max:255',
            'proveedor'     => 'sometimes|nullable|string|max:255',
            'departamento'  => 'sometimes|nullable|string|max:255',
            'municipio'     => 'sometimes|nullable|string|max:255',
            'zona'          => 'sometimes|nullable|string|max:255',
            'latitud'       => 'sometimes|nullable|numeric',
            'longitud'      => 'sometimes|nullable|numeric',
            'estado'        => 'sometimes|in:pendiente,en_proceso,resuelto,descartado',
        ]);

        $reporte->update($validated);

        return response()->json($reporte);
    }

    // DELETE /api/reportes/{id}
    public function destroy($id)
    {
        $reporte = Reporte::findOrFail($id);
        $reporte->delete();

        return response()->json([
            'message' => 'Reporte eliminado correctamente',
        ]);
    }

    // GET /api/reportes/estado/{estado}
    public function porEstado($estado, Request $request)
    {
        $estadosValidos = ['pendiente', 'en_proceso', 'resuelto', 'descartado'];

        if (!in_array($estado, $estadosValidos, true)) {
            return response()->json([
                'message' => 'Estado no válido',
            ], 400);
        }

        $perPage = (int) $request->query('per_page', 20);

        return Reporte::where('estado', $estado)
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    // GET /api/reportes/tipo/{tipo_servicio}
    public function porTipo($tipo_servicio, Request $request)
    {
        $tiposValidos = ['electricidad', 'agua', 'internet'];

        if (!in_array($tipo_servicio, $tiposValidos, true)) {
            return response()->json([
                'message' => 'Tipo de servicio no válido',
            ], 400);
        }

        $perPage = (int) $request->query('per_page', 10);

        return Reporte::where('tipo_servicio', $tipo_servicio)
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    // GET /api/reportes/buscar?...
    public function buscar(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);

        $query = Reporte::query();

        if ($request->filled('departamento')) {
            $query->where('departamento', 'LIKE', '%' . $request->departamento . '%');
        }

        if ($request->filled('municipio')) {
            $query->where('municipio', 'LIKE', '%' . $request->municipio . '%');
        }

        if ($request->filled('zona')) {
            $query->where('zona', 'LIKE', '%' . $request->zona . '%');
        }

        if ($request->filled('proveedor')) {
            $query->where('proveedor', 'LIKE', '%' . $request->proveedor . '%');
        }

        if ($request->filled('tipo_servicio')) {
            $query->where('tipo_servicio', $request->tipo_servicio);
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        return $query
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    // GET /api/reportes/estadisticas/resumen
    public function resumen()
    {
        $porEstado = Reporte::select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->get();

        $porTipo = Reporte::select('tipo_servicio', DB::raw('COUNT(*) as total'))
            ->groupBy('tipo_servicio')
            ->get();

        $total = Reporte::count();

        return response()->json([
            'total_reportes' => $total,
            'por_estado'     => $porEstado,
            'por_tipo'       => $porTipo,
        ]);
    }
}