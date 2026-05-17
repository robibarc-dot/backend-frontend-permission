<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'module_id',
        'question_type_id',
        'status',
    ];

    /**
     * Get the options for the question.
     * 
     * @return HasMany
     */
    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class);
    }
}
