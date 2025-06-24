<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\TopicController;
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
    Route::get('/user/activities', [UserController::class, 'activities']);
    Route::get('/user/{id}', [UserController::class, 'me']);

    Route::put('/profile/update', [UserController::class, 'update']);
    Route::post('/profile/image', [UserController::class, 'updateProfileImage']);
});

//Course API
Route::get('/get_courses', [CourseController::class, 'index']);
Route::post('/add_course', [CourseController::class, 'create']);

//Category API
Route::get('/get_categories', [CategoryController::class, 'index']);
Route::get('/category/{id}', [CategoryController::class, 'getCategory']);
Route::post('/edit_category', [CategoryController::class, 'saveCategory']);

//Forum API
Route::get('/dashboard-stats', [DataController::class, 'getDashboardStats']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/topics', [ForumController::class, 'createTopic']);
    Route::post('/posts', [ForumController::class, 'comment']);

    Route::put('/update/{topic}', [ForumController::class, 'updateTopic']);
    Route::put('/comment/{post}', [ForumController::class, 'updateComment']);
    Route::delete('/comment/{post}', [ForumController::class, 'deleteComment']);
    Route::delete('/topic/{topic}', [ForumController::class, 'deleteTopic']);

});

Route::get('/topics/{category_id}', [ForumController::class, 'getTopics']);
Route::get('/topics/category/{category_id}', [ForumController::class, 'getTopicsByCategory']);

//Topic Routes
Route::get('/posts/{topic_id}', [TopicController::class, 'show']);
Route::get('/topic/{topic_id}/comments', [TopicController::class, 'getComments']);
Route::get('/post/{post_id}/replies', [TopicController::class, 'getReplies']);

Route::post('/like', [LikeController::class, 'toggle']);