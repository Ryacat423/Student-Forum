<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $primaryKey = 'like_id';
    protected $fillable = [
        'topic_id',
        'post_id',
        'user_id',
        'status'
    ];

    public function topic()
    {
        return $this->belongsTo(Topic::class, 'topic_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

}
