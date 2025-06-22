<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    /** @use HasFactory<\Database\Factories\MediaFactory> */
    use HasFactory;
    protected $primaryKey = 'media_id';
    protected $fillable = [
        'user_id',
        'post_id',
        'filename'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function post() {
        return $this->belongsTo(Post::class, 'post_id');
    }

}
