<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

        // Reportes asignados (todos)
    public function reportesAsignados()
    {
        return $this->hasMany(\App\Models\Reporte::class, 'assignee_id');
    }

    // Reportes asignados con estado PENDIENTE
    public function reportesPendientes()
    {
        return $this->hasMany(\App\Models\Reporte::class, 'assignee_id')
            ->where('estado', 'pendiente');
    }

    // Reportes asignados HOY (cualquier estado)
    public function reportesHoy()
    {
        return $this->hasMany(\App\Models\Reporte::class, 'assignee_id')
            ->whereDate('assigned_at', now()->toDateString());
    }
}
