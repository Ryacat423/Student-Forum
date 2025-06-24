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
            ->orderByDesc('created_at')
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

    public function updateTopic(Topic $topic, Request $request) {
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'content' => 'sometimes|required|string',
            'remove_current_images' => 'nullable',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        DB::beginTransaction();
        try {
            if (isset($validated['title'])) {
                $topic->update([
                    'title' => strip_tags($validated['title']),
                ]);
            }

            $post = $topic->post;
            if ($post && isset($validated['content'])) {
                $post->update([
                    'content' => strip_tags($validated['content']),
                ]);
            }

            if ($request->input('remove_current_images') && $post) {
                foreach ($post->media as $media) {
                    $filePath = public_path('media/' . $media->filename);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                    $media->delete();
                }
            }

            if ($request->hasFile('images') && $post) {
                foreach ($request->file('images') as $image) {
                    $filename = time() . '_' . $image->getClientOriginalName();
                    $image->move(public_path('media'), $filename);

                    \App\Models\Media::create([
                        'user_id' => $request->user()->user_id ?? $post->user_id,
                        'post_id' => $post->post_id,
                        'filename' => $filename
                    ]);
                }
            }

            DB::commit();
            return response()->json(['success' => true], 200);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function getTopics() {
        $topics = Topic::with(['user', 'category', 'post'])
            ->orderByDesc('topic_id')
            ->get();

        return response()->json($topics);
    }

    public function getTopicsByCategory(Request $request, $category_id) {
        $userId = $request->user()->id ?? null;
        $filter = $request->query('filter');

        $topics = Topic::with(['user', 'category', 'post'])
            ->where('category_id', $category_id)
            ->when($filter === 'own' && $userId, function ($query) use ($userId) {
                return $query->where('user_id', $userId);
            })
            ->orderByDesc('created_at')
            ->get();

        return response()->json($topics);
    }

    public function comment(Request $request) {
        $request->validate([
            'topic_id' => 'required|exists:topics,topic_id',
            'user_id' => 'required|exists:users,user_id',
            'content' => 'required|string',
            'reply' => 'nullable|integer',
            'images.*' => 'image|mimes:jpg,jpeg,png,gif|max:2048'
        ]);

        DB::beginTransaction();
        try {
            $post = Post::create([
                'topic_id' => $request->topic_id,
                'user_id' => $request->user_id,
                'content' => $request->content,
                'reply' => $request->reply,
            ]);

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
            ->where('topic_id', $request->topic_id)
            ->where('reply', 0)
            ->orderBy('created_at', 'desc')
            ->get();

            DB::commit();
            return response()->json([
                'success' => true, 
                'comments' => $comments
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updateComment(Request $request, Post $post) {
        $validated = $request->validate([
            'content' => 'sometimes|required|string',
            'topic_id' => 'required|exists:topics,topic_id'
        ]);

        DB::beginTransaction();
        try {
            // Update content if provided
            if (isset($validated['content'])) {
                $post->update([
                    'content' => strip_tags($validated['content'])
                ]);
            }

            // Fetch updated comments
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
            ->where('topic_id', $request->topic_id)
            ->where('reply', 0)
            ->orderBy('created_at', 'desc')
            ->get();

            DB::commit();

            return response()->json([
                'success' => true,
                'comments' => $comments
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteComment(Post $post) {
        DB::beginTransaction();
        try {
            foreach ($post->media as $media) {
                $filePath = public_path('media/' . $media->filename);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                $media->delete();
            }

            $replies = Post::where('reply', $post->post_id)->get();
            foreach ($replies as $reply) {
                foreach ($reply->media as $media) {
                    $filePath = public_path('media/' . $media->filename);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                    $media->delete();
                }
                $reply->delete();
            }
            $post->delete();

            DB::commit();
            return response()->json(['success' => true], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
