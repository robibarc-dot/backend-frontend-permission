<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogSection extends Model
{
    /**
     * Explicitly map to the blog_sections table.
     *
     * @var string
     */
    protected $table = 'blog_sections';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'blog_id',
        'type',
        'title',
        'text_content',
        'image_url',
        'status',
    ];

    /**
     * Get the parent blog that owns this section.
     *
     * @return BelongsTo
     */
    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class, 'blog_id', 'id');
    }
}