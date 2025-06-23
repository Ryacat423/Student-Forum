<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function show($topic_id) {
        $topic = Topic::with([
            'category',
            'user.course'
        ])->findOrFail($topic_id);

        $mainPost = Post::with([
            'user.course',
            'media'
        ])
        ->where('topic_id', $topic_id)
        ->whereNull('reply')
        ->first();

        return response()->json([
            'topic' => $topic,
            'post' => $mainPost,
        ]);
    }
}
