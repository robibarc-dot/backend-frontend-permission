<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseFeature extends Model
{
    protected $fillable = [
        'course_id',
        'icon_type',
        'feature_text',
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
