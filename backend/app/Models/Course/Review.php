<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'course_id',
        'user_name',
        'rating',
        'comment',
    ];

    public $timestamps = false;

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
