<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Topic;
use App\Models\Post;
use App\Models\Media;
use Illuminate\Support\Facades\DB;

class ForumController extends Controller
{
    public function createTopic(Request $request){
        $request->validate([
            'category_id' => 'required|exists:categories,category_id',
            'user_id' => 'required|exists:users,user_id',
            'title' => 'required|string',
            'content' => 'required|string',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        DB::beginTransaction();
        try {
            $topic = Topic::create([
                'category_id' => $request->category_id,
                'user_id' => $request->user_id,
                'title' => $request->title,
                'views' => 0
            ]);

            $post = Post::create([
                'topic_id' => $topic->topic_id,
                'user_id' => $request->user_id,
                'content' => $request->content,
                'reply' => null
            ]);

            $topics = Topic::with(['user', 'category', 'post'])
            ->where('category_id', $request->category_id)
            ->orderByDesc('topic_id')
            ->get();

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $filename = time().'_'.$image->getClientOriginalName();
                    $image->move(public_path('media'), $filename);


                    Media::create([
                        'user_id' => $request->user_id,
                        'post_id' => $post->post_id,
                        'filename' => $filename
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'success' => true, 
                'topic' => $topic, 
                'post' => $post, 
                'topics'=>$topics
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }


    }

    public function getTopics()
    {
        $topics = Topic::with(['user', 'category', 'post'])
            ->orderByDesc('topic_id')
            ->get();

        return response()->json($topics);
    }

    public function getTopicsByCategory(Request $request, $category_id)
    {
        $userId = $request->user()->id ?? null;
        $filter = $request->query('filter');

        $topics = Topic::with(['user', 'category', 'post'])
            ->where('category_id', $category_id)
            ->when($filter === 'own' && $userId, function ($query) use ($userId) {
                return $query->where('user_id', $userId);
            })
            ->orderByDesc('topic_id')
            ->get();

        return response()->json($topics);
    }

    public function comment(Request $request)
    {
        $request->validate([
            'topic_id' => 'required|exists:topics,topic_id',
            'user_id' => 'required|exists:users,user_id',
            'content' => 'required|string',
            'reply' => 'nullable|integer'
        ]);

        $post = Post::create([
            'topic_id' => $request->topic_id,
            'user_id' => $request->user_id,
            'content' => $request->content,
            'reply' => $request->reply
        ]);

        return response()->json(['success' => true, 'post' => $post], 201);
    }
}
