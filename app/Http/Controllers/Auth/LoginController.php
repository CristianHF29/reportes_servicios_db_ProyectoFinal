<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        // Si ya tiene sesión, evitar mostrar login
        if (Auth::check()) {
            $role = Auth::user()->role;

            if ($role === 'admin') return redirect('/admin');
            if ($role === 'tecnico') return redirect('/tecnico');

            return redirect('/');
        }

        return view('login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Admin → permitido usar intended
            if ($user->role === 'admin') {
                return redirect()->intended('/admin');
            }

            // Técnico → siempre a su panel (sin intended)
            if ($user->role === 'tecnico') {
                return redirect('/tecnico');
            }

            // Usuario normal
            return redirect('/');
        }

        return back()->withErrors([
            'email' => 'Las credenciales no son válidas.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
