<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResourceSection extends Model
{
    /**
     * Explicitly map to the sections table name.
     *
     * @var string
     */
    protected $table = 'resource_sections';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'resource_id',
        'title',
        'text_content',
        'image_url',
        'status',
    ];

    /**
     * Get the parent resource that owns this section.
     *
     * @return BelongsTo
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class, 'resource_id', 'id');
    }
}