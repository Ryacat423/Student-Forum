<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    /** @use HasFactory<\Database\Factories\TopicFactory> */
    use HasFactory;
    protected $primaryKey = 'topic_id';
    protected $fillable = [
        'category_id',
        'user_id',
        'title',
        'views'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function post() {
        return $this->hasOne(Post::class, 'topic_id')->whereNull('reply');
    }

    public function posts() {
        return $this->hasMany(Post::class, 'topic_id');
    }
}
