<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseStructure extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'badge_icon',
        'sort_order',
    ];

    public $timestamps = false;

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
