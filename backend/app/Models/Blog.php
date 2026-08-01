<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Blog extends Model
{
    /**
     * Explicitly map to the blogs table.
     *
     * @var string
     */
    protected $table = 'blogs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'module_id',
        'title',
        'banner_img',
        'short_description',
        'status',
    ];

    /**
     * Get the sections for this blog.
     * Establishes a One-to-Many relationship.
     *
     * @return HasMany
     */
    public function sections(): HasMany
    {
        return $this->hasMany(BlogSection::class, 'blog_id', 'id');
    }

    /**
     * Get the module that owns this blog.
     *
     * @return BelongsTo
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id', 'id');
    }
}