<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Resource extends Model
{
    /**
     * Explicitly map to the custom root table name.
     *
     * @var string
     */
    protected $table = 'resources';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'module_id',
        'topic',
        'status',
    ];

    /**
     * Get the sections for this free resource.
     * Establishes a One-to-Many relationship.
     *
     * @return HasMany
     */
    public function sections(): HasMany
    {
        return $this->hasMany(ResourceSection::class, 'resource_id', 'id');
    }

    /**
     * Get the module that owns this resource.
     *
     * @return BelongsTo
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id', 'id');
    }
}
