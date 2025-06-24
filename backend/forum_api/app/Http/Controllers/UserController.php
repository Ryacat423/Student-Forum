<?php

namespace App\Http\Controllers;

use App\Models\Post;
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

    public function update(Request $request) {
        $user = $request->user();
        $request->validate([
            'username' => 'required|string|unique:users,username,' . $user->user_id . ',user_id',
            'email' => 'required|email|unique:users,email,' . $user->user_id . ',user_id',
            'first_name' => 'nullable|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'birthday' => 'nullable|date',
            'course_id' => 'nullable|exists:courses,course_id',
            'bio' => 'nullable|string'
        ]);
        $user->update($request->all());
        return response()->json(['success' => true, 'user' => $user]);
    }

    public function updateProfileImage(Request $request) {
        $request->validate([
            'profile_img' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $user = $request->user();
        $file = $request->file('profile_img');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('media'), $filename);

        $user->profile_pic = url('media/' . $filename);
        $user->save();

        return response()->json(['success' => true]);
    }

    public function activities(Request $request) {
        $userId = $request->user()->user_id;

        $posts = Post::with(['topic.category'])
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['activities' => $posts]);
    }

    
}
