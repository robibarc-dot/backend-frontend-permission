<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = [
        'category',
        'title',
        'subtitle',
        'slug',
        'description',
        'thumbnail_url',
        'promo_video_url',
        'price',
        'regular_price',
        'duration_hours',
        'duration_minutes',
        'is_published',
    ];

    public $timestamps = false;

    protected $casts = [
        'price' => 'decimal:2',
        'regular_price' => 'decimal:2',
        'duration_hours' => 'integer',
        'duration_minutes' => 'integer',
        'is_published' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function features(): HasMany
    {
        return $this->hasMany(CourseFeature::class)->orderBy('sort_order');
    }

    public function structures(): HasMany
    {
        return $this->hasMany(CourseStructure::class)->orderBy('sort_order');
    }

    public function levels(): HasMany
    {
        return $this->hasMany(CourseLevel::class)->orderBy('sort_order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->latest('created_at');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class)->latest('enrolled_at');
    }
}
