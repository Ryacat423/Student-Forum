<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $primaryKey = 'message_id';
    protected $fillable = [
        'from',
        'to',
        'subject',
        'content',
        'reply_to',
        'status',
    ];

    public function fromUser() {
        return $this->belongsTo(User::class, 'from', 'user_id');
    }

    public function toUser() {
        return $this->belongsTo(User::class, 'to', 'user_id');
    }
}
