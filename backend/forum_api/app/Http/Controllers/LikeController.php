<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request) {
        $request->validate([
            'userID' => 'required|integer|exists:users,user_id',
            'postID' => 'required|integer|exists:posts,post_id',
            'action' => 'required|in:like,unlike',
        ]);

        $like = Like::where('user_id', $request->userID)
                    ->where('post_id', $request->postID)
                    ->first();

        if (!$like) {
            $like = Like::create([
                'user_id' => $request->userID,
                'post_id' => $request->postID,
                'status' => $request->action === 'like' ? 1 : 0,
            ]);
        } else {
            $like->status = $request->action === 'like' ? 1 : 0;
            $like->save();
        }

        $mainPost = Post::with([
            'user.course',
            'media',
            'likes'
        ])
        ->where('topic_id', $request->postID)
        ->whereNull('reply')
        ->first();

        $likeCount = $mainPost->likes->where('status', 1)->count();

        return response()->json([
            'success' => true,
            'status' => $like->status === 0 ? 'liked' : 'unliked',
            'post' => $mainPost,
            'like_count' => $likeCount
        ]);
    }
}
