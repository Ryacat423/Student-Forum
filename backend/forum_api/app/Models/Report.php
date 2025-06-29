<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;
    protected $primaryKey = 'report_id';
    protected $fillable = [
        'user_id',
        'post_id',
        'type_id',
        'reason',
        'status',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function post() {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function details() {
        return $this->hasMany(ReportDetail::class, 'report_id');
    }

    public function types() {
        return $this->belongsToMany(Type::class, 'report_details', 'report_id', 'type_id');
    }

    public function duplicates() {
        return $this->hasMany(Report::class, 'post_id', 'post_id');
    }
}
