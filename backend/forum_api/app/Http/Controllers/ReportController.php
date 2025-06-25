<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ReportController extends Controller
{
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

    foreach ($request->types as $typeId) {
        Report::create([
            'user_id' => $request->userid,
            'post_id' => $request->post_id,
            'type_id' => $typeId,
            'reason' => $request->explanation,
            'status' => 'pending',
        ]);
    }

    return response()->json(['success' => true, 'message' => 'Report submitted successfully.']);
}


}
