<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
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
Route::post('/edit_category', [CategoryController::class, 'saveCategory']);