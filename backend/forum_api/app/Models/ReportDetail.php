<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id', 'type_id'
    ];

    public function report()
    {
        return $this->belongsTo(Report::class, 'report_id');
    }

    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id');
    }

}
