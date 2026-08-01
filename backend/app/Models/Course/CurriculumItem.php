<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CurriculumItem extends Model
{
    protected $fillable = [
        'level_id',
        'item_name',
        'sort_order',
    ];

    public $timestamps = false;

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function level(): BelongsTo
    {
        return $this->belongsTo(CourseLevel::class, 'level_id');
    }
}
