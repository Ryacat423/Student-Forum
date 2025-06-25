<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;
    protected $primaryKey = 'post_id';
    protected $fillable = [
        'topic_id',
        'user_id',
        'content',
        'reply'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function topic() {
        return $this->belongsTo(Topic::class, 'topic_id');
    }

    public function media() {
        return $this->hasMany(Media::class, 'post_id');
    }

    public function replies() {
        return $this->hasMany(Post::class, 'reply', 'post_id');
    }

    public function parent() {
        return $this->belongsTo(Post::class, 'reply');
    }

    public function likes() {
        return $this->hasMany(Like::class, 'post_id', 'post_id');
    }
    public function reports() {
        return $this->hasMany(Report::class, 'post_id');
    }

}
