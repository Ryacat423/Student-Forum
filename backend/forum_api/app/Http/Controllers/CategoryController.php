<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index() {
        $categories = Category::all();
        $total_categories = $categories->count();

        return response()->json([
            'categories' => $categories,
            'total' => $total_categories
        ], 200);
    }

    public function saveCategory(Request $request) {
        $categoryData = json_decode($request->input('category_data'), true);

        $validator = Validator::make(array_merge($categoryData, ['icon' => $request->file('icon')]), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'icon' => $request->hasFile('icon') ? 'image|mimes:jpeg,png,jpg,gif,svg|max:2048' : '',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $isUpdate = isset($categoryData['id']) && $categoryData['id'] != 0;

            $filename = null;

            if ($request->hasFile('icon')) {
                $file = $request->file('icon');
                $filename = 'icon_' . time() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('media'), $filename);
            }

            if ($isUpdate) {
                $category = Category::find($categoryData['id']);

                if (!$category) {
                    return response()->json(['error' => 'Category not found'], 404);
                }

                $category->name = $categoryData['name'];
                $category->description = $categoryData['description'];

                if ($filename) {
                    $category->icon = $filename;
                }

                $category->save();
            } else {
                $category = Category::create([
                    'name' => $categoryData['name'],
                    'description' => $categoryData['description'],
                    'icon' => $filename ?? '',
                ]);
            }

            $allCategories = Category::all()->map(function ($cat) {
                $cat->icon_url = $cat->icon ? url('media/' . $cat->icon) : null;
                return $cat;
            });

            return response()->json([
                'message' => 1,
                'categories' => $allCategories
            ], 200);

        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

}
