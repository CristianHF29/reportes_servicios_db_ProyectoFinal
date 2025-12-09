<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reporte extends Model
{
    use HasFactory;

    protected $table = 'reportes';

    protected $fillable = [
        'user_id',
        'tipo_servicio',
        'titulo',
        'descripcion',
        'proveedor',
        'departamento',
        'municipio',
        'zona',
        'latitud',
        'longitud',
        'estado',
        'assignee_id',
        'codigo',
        'assigned_at',
    ];

    protected $casts = [
    'assigned_at' => 'datetime',
    ];

    // Relación: un reporte pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }
}

