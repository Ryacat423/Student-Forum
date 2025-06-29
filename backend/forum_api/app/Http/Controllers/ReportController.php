<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\ReportDetail;

class ReportController extends Controller
{

    public function getAllReports() {
        $reports = Report::with([
            'post.user.course',
            'post.media', 
            'post.topic',         
            'details.type'
        ])
        ->withCount('duplicates')   
        ->orderByDesc('created_at')
        ->get();

        return response()->json($reports);
    }

    public function reportPost(Request $request) {
        $validator = Validator::make($request->all(), [
            'post_id' => 'required|exists:posts,post_id',
            'userid' => 'required|exists:users,user_id',
            'types' => 'required|array',
            'types.*' => 'exists:types,type_id',
            'explanation' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $existing = Report::where('user_id', $request->userid)
            ->where('post_id', $request->post_id)
            ->exists();

        if ($existing) {
            $message = 'You have already reported this post.';
        } else {
            $report = Report::create([
                'user_id' => $request->userid,
                'post_id' => $request->post_id,
                'reason' => $request->explanation,
                'status' => 'pending'
            ]);

            foreach ($request->types as $typeId) {
                ReportDetail::create([
                    'report_id' => $report->report_id,
                    'type_id' => $typeId,
                ]);
            }

            $message = 'Report submitted successfully.';
        }

        return response()->json(['success' => true, 'message' => $message]);
    }
}
