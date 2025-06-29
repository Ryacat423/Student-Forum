<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Type;

class TypeSeeder extends Seeder
{
    public function run()
    {
        $types = [
            ['label' => 'Spam', 'description' => 'This post contains spam or advertisements.'],
            ['label' => 'Inappropriate Content', 'description' => 'This post contains inappropriate or offensive content.'],
            ['label' => 'Harassment', 'description' => 'This post is harassing or bullying other users.'],
            ['label' => 'False Information', 'description' => 'This post contains false or misleading information.'],
            ['label' => 'Other', 'description' => 'This post should be reported for another reason.'],
        ];

        foreach ($types as $type) {
            Type::create($type);
        }
    }
}