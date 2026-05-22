<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'question_group_id',
        'module_id',
        'question_type_id',
        'question_text',
        'question_mark',
        'sequence_number',
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

    /**
     * Get the test context that owns the question.
     * 
     * @return BelongsTo
     */
    public function testContext(): BelongsTo
    {
        return $this->belongsTo(TestContext::class);
    }

    /**
     * Get the module that owns the question.
     * 
     * @return BelongsTo
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the question type that owns the question.
     * 
     * @return BelongsTo
     */
    public function questionType(): BelongsTo
    {
        return $this->belongsTo(QuestionType::class);
    }
}
