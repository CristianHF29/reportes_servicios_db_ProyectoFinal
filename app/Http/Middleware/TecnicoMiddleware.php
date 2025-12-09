<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TecnicoMiddleware
{
    /**
     * Solo deja pasar a usuarios con role = 'tecnico'
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check() || Auth::user()->role !== 'tecnico') {
            return redirect('/login');
        }

        return $next($request);
    }
}
