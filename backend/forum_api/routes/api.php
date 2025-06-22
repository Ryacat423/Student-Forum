<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Auth API
Route::get('/get_all_users', [AuthController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/applicants', [AuthController::class, 'getApplicants']);
    Route::post('/applicants/approve', [AuthController::class, 'approveApplicant']);
});

//User API
Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user/{id}', [UserController::class, 'me']);
});

//Course API
Route::get('/get_courses', [CourseController::class, 'index']);
Route::post('/add_course', [CourseController::class, 'create']);

//Category API
Route::get('/get_categories', [CategoryController::class, 'index']);
Route::get('/category/{id}', [CategoryController::class, 'getCategory']);
Route::post('/edit_category', [CategoryController::class, 'saveCategory']);

//Forum API
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/topics', [ForumController::class, 'createTopic']);
    Route::post('/posts', [ForumController::class, 'comment']);
});

Route::get('/topics/{category_id}', [ForumController::class, 'getTopics']);
Route::get('/topics/category/{category_id}', [ForumController::class, 'getTopicsByCategory']);
Route::get('/topics/{topic_id}/comments', [ForumController::class, 'getComments']);
Route::get('/posts/{post_id}/replies', [ForumController::class, 'getReplies']);