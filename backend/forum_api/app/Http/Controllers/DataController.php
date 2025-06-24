<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;

class DataController extends Controller
{
    public function getDashboardStats()
    {
        $totalStudents = User::where('role', 'student')
                            ->where('status', '!=', 'pending')
                            ->count();

        $pendingApplications = User::where('status', 'pending')->count();
        $activeDiscussions = Topic::count();

        $totalPosts = Post::count();

        return response()->json([
            'students' => $totalStudents,
            'pending' => $pendingApplications,
            'discussions' => $activeDiscussions,
            'posts' => $totalPosts,
        ]);
    }
}
