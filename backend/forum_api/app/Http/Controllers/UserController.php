<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request) {
        return $request->user()->load('course');
    }

    public function me($id) {
        $user = User::with('course')->findOrFail($id);
        return response()->json($user);
    }
}
