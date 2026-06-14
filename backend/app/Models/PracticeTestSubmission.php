<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PracticeTestSubmission extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'practice_test_id',
        'test_section_id',
        'total_questions',
        'correct_answers',
        'total_marks',
        'awarded_marks',
        'percentage',
        'results',
        'module_scores',
        'submitted_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'total_questions' => 'integer',
        'correct_answers' => 'integer',
        'total_marks' => 'integer',
        'awarded_marks' => 'integer',
        'percentage' => 'float',
        'results' => 'array',
        'module_scores' => 'array',
        'submitted_at' => 'datetime',
    ];

    /**
     * Get the user (student) who submitted the test.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the practice test that was submitted.
     */
    public function practiceTest(): BelongsTo
    {
        return $this->belongsTo(PracticeTest::class);
    }

    /**
     * Get the specific section submitted, if applicable.
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(TestSection::class, 'test_section_id');
    }
}