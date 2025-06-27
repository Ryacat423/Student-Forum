<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Report;
use App\Models\Post;

class MessageController extends Controller
{

    public function index(Request $request) {
        $user = $request->user();

        $messages = Message::with(['fromUser'])
            ->where('to', $user->user_id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($msg) {
                if ($msg->fromUser && $msg->fromUser->profile_pic) {
                    $msg->fromUser->profile_pic = url('media/' . $msg->fromUser->profile_pic);
                } else {
                    $msg->fromUser->profile_pic = url('img/default-avatar.png');
                }
                return $msg;
            });

        return response()->json([
            'messages' => $messages
        ]);
    }

    public function show(Request $request) {
        $messageID = $request->query('message_id');

        $message = Message::with(['fromUser', 'toUser'])->findOrFail($messageID);

        $replies = Message::with(['fromUser', 'toUser'])
            ->where('reply_to', $messageID)
            ->orderBy('created_at', 'asc')
            ->get();

        $formatProfilePic = function ($msg) {
            foreach (['fromUser', 'toUser'] as $role) {
                if ($msg->$role && $msg->$role->profile_pic) {
                    $msg->$role->profile_pic = url('media/' . $msg->$role->profile_pic);
                } else {
                    $msg->$role->profile_pic = url('img/default-avatar.png');
                }
            }
            return $msg;
        };

        $message = $formatProfilePic($message);
        $replies = $replies->map($formatProfilePic);

        return response()->json([
            'message' => $message,
            'replies' => $replies
        ]);
    }

    public function getNotifications(Request $request) {
        $user = $request->user();
        $userPostIds = Post::where('user_id', $user->user_id)->pluck('post_id');

        $hasReportedPost = Report::whereIn('post_id', $userPostIds)->exists();
        $noticeMessages = Message::where('to', $user->user_id)
            ->where('subject', 'Notice!')
            ->get();

        return response()->json([
            'reported' => $hasReportedPost,
            'notified' => $noticeMessages->isNotEmpty(),
            'messages' => $noticeMessages
        ]);
    }
}
