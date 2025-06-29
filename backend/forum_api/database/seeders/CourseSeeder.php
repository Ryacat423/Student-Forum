<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run()
    {
        $courses = [
            ['code' => 'BSIT', 'name' => 'Bachelor of Science in Information Technology', 'parent_id' => null],
            ['code' => 'BSBA', 'name' => 'Bachelor of Science in Business Administration', 'parent_id' => null],
            ['code' => 'BSPsych', 'name' => 'Bachelor of Science in Psychology', 'parent_id' => null],
            ['code' => 'BEED', 'name' => 'Bachelor of Science in Elementary Education', 'parent_id' => null],
            ['code' => 'BAT', 'name' => 'Bachelor of Arts in Theology', 'parent_id' => null],
            ['code' => 'BSN', 'name' => 'Bachelor of Science in Nursing', 'parent_id' => null],
            ['code' => 'BSED', 'name' => 'Bachelor of Science in Secondary Education', 'parent_id' => null],
            ['code' => 'BSED', 'name' => 'Major in Science', 'parent_id' => 7],
            ['code' => 'BSED', 'name' => 'Major in Filipino', 'parent_id' => 7],
            ['code' => 'BSED', 'name' => 'Major in English', 'parent_id' => 7],
            ['code' => 'BSED', 'name' => 'Major in Math', 'parent_id' => 7],
            ['code' => 'BSED', 'name' => 'Major in Music', 'parent_id' => 7],
            ['code' => 'BSED', 'name' => 'Major in History', 'parent_id' => 7],
            ['code' => 'BSA', 'name' => 'Bachelor of Science in Accountancy', 'parent_id' => null],
            ['code' => 'BSMA', 'name' => 'Bachelor of Science in Management Accounting', 'parent_id' => null],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}