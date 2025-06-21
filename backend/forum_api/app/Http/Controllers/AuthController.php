<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function index() {
        $courses = User::all();
        return response()->json($courses, 200);
    }

    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'gender' => 'required|string',
            'bdate' => 'required|date',
            'address' => 'required|string|max:255',
            'contact' => 'required|string|max:20',
            'course_id' => 'required|integer',
            'role' => 'required|string',
            'status' => 'required|string',
            'bio' => 'string',
            'profile_pic' => 'required|string',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 403);
        }

        $validated = $validator->validated(); 
        
        try {  
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'],
                'gender' => $validated['gender'],
                'bdate' => $validated['bdate'],
                'address' => $validated['address'],
                'contact' => $validated['contact'],
                'course_id' => $validated['course_id'],
                'role' => $validated['role'],
                'status' => $validated['status'],
                'bio' => $validated['bio'],
                'profile_pic' => $validated['profile_pic'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'registration_date' => now(),
                'password' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'message' => 'User registered successfully',
                'success' => 1,
                'user' => $user
            ], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 403);
        }
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 403);
        }

        $validated = $validator->validated(); 

        $user = User::with('course')
            ->where('email', $request->email)
            ->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->status === 'pending') {
            return response()->json(['error' => 'Account not approved yet.'], 403);
        }

        if (!auth()->attempt($validated)) {
            return response()->json(['error' => 'Invalid credentials'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'success' => 1,
            'message' => 'User logged in successfully',
            'user' => $user->user_id
        ], 200);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => 1,
            'message' => 'Logged out'
        ], 200);
    }

    // Get all users with status = pending
    public function getApplicants() {
        $applicants = User::with('course')
                      ->where('status', 'pending')
                      ->get();

        $total = $applicants->count();

        return response()->json([
            'applicants' => $applicants,
            'total' => $total
        ], 200);
    }

    // Approve applicant by updating status to active
    public function approveApplicant(Request $request) {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 403);
        }

        $user = User::find($request->user_id);
        $user->status = 'active';
        $user->save();

        return response()->json([
            'message' => 'Applicant approved',
            'success' => 1,
            'user' => $user
        ], 200);
    }
}
