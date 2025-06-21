<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    public function index() {
        $courses = Course::all();
        return response()->json($courses, 200);
    }

    public function create(Request $request) {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 403);
        }

        $validated = $validator->validated(); 
        
        try {  
            $course = Course::create([
                'code' => $validated['code'],
                'name' => $validated['name'],
                'parent_id' => $validated['parent_id'] ?? null,
            ]);

            return response()->json([
                'message' => 'Course created',
                'course' => $course
            ], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 403);
        }
    }
}
