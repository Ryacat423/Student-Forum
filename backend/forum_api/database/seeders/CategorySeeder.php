<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Academics', 'description' => 'Courses, Study Tips, and Educational Resources.', 'icon' => 'bi-journal-bookmark'],
            ['name' => 'Campus Life', 'description' => 'Events, Housing, and Student Activities.', 'icon' => 'bi-award'],
            ['name' => 'Technology', 'description' => 'Tech news, Coding, and Digital Tools', 'icon' => 'bi-laptop'],
            ['name' => 'Student Wellness', 'description' => 'Mental health, Self-care, and Stress Management', 'icon' => 'bi-person-heart'],
            ['name' => 'Sports', 'description' => 'Games, Fitness, and Athletic Events', 'icon' => 'bi-trophy'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}