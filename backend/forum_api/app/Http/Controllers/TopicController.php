<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function show($topic_id, Request $request) {
        $topic = Topic::with([
            'category',
            'user.course'
        ])->findOrFail($topic_id);

        $mainPost = Post::with([
            'user.course',
            'media',
            'likes'
        ])
        ->where('topic_id', $topic_id)
        ->whereNull('reply')
        ->first();

        $likeCount = $mainPost->likes->where('status', 1)->count();

        return response()->json([
            'topic' => $topic,
            'post' => $mainPost,
            'like_count' => $likeCount
        ]);
    }

    public function getComments($topic_id) {
        $comments = Post::with([
            'user.course',
            'media',
            'likes',
            'replies.user.course',
            'replies.media',
            'replies.likes',
            'replies.replies.user.course',
            'replies.replies.media',
            'replies.replies.likes',
        ])
        ->where('topic_id', $topic_id)
        ->where('reply', 0)
        ->orderBy('created_at', 'asc')
        ->get();


        $comments->transform(function ($comment) {
            $comment->like_count = $comment->likes->where('status', 0)->count();
            $comment->replies->transform(function ($reply) {
                $reply->like_count = $reply->likes->where('status', 0)->count();
                return $reply;
            });

            return $comment;
        });

        return response()->json($comments);
    }


    public function getReplies($post_id) {
        $replies = Post::with(['user.course', 'media'])
            ->where('reply', $post_id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($replies);
    }
}
