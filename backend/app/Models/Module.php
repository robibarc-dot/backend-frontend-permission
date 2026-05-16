<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'status',
    ];

    /**
     * Get the question types for the module.
     */
    public function questionTypes()
    {
        return $this->hasMany(QuestionType::class);
    }
}
