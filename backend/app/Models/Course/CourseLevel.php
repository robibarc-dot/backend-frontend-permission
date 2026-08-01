<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseLevel extends Model
{
    protected $fillable = [
        'course_id',
        'level_title',
        'sub_title',
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

    public function curriculumItems(): HasMany
    {
        return $this->hasMany(CurriculumItem::class, 'level_id')->orderBy('sort_order');
    }
}
