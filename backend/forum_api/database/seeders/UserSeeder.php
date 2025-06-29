<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'first_name' => 'Ramil',
            'last_name' => 'Yacat',
            'middle_name' => 'Ramos',
            'gender' => 'Male',
            'bdate' => '2005-03-11',
            'contact' => '09679554218',
            'course_id' => 1,
            'role' => 'admin',
            'status' => 'active',
            'bio' => 'my bio',
            'profile_pic' => 'default.png',
            'username' => 'Admin',
            'email' => 'admin.yacat@gmail.com',
            'registration_date' => now(),
            'password' => '$2y$12$CjiSnhgNxKVMnMssYO2va.SZA86XhUvd4Bq9USd/bvxZSlVmNFhsi',
        ]);
    }
}