<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'userID' => 'required|integer|exists:users,user_id',
            'topicID' => 'required|integer|exists:topics,topic_id',
            'action' => 'required|in:like,unlike',
            'postID' => 'integer'
        ]);

        $like = Like::where('user_id', $request->userID)
                    ->where('topic_id', $request->topicID)
                    ->first();

        if (!$like) {
            $like = Like::create([
                'user_id' => $request->userID,
                'topic_id' => $request->topicID,
                'status' => $request->action === 'like' ? 1 : 0,
                'post_id' => $request->postID
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
        ->where('topic_id', $request->topicID)
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
