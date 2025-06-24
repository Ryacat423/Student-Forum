<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;

class MigrateSelected extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-selected';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drop and re-run selected table migrations only';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tables = [
            'users', 
            'topics', 
            'posts', 
            'media', 
            'likes',
            'reports'
        ];

        $migrations = [
            'database/migrations/0001_01_01_000000_create_users_table.php',
            'database/migrations/2025_06_21_230543_create_topics_table.php',
            'database/migrations/2025_06_21_230600_create_posts_table.php',
            'database/migrations/2025_06_21_230610_create_media_table.php',
            'database/migrations/2025_06_23_102342_create_likes_table.php',
            'database/migrations/2025_06_24_010756_create_reports_table.php',
        ];

        foreach ($tables as $table) {
            Schema::dropIfExists($table);
            $this->info("Dropped: {$table}");
        }

        foreach ($migrations as $migrationPath) {
            Artisan::call('migrate', ['--path' => $migrationPath]);
            $this->info("Migrated: {$migrationPath}");
        }

        $this->info("✅ Selected migrations re-run successfully.");
    }
}
