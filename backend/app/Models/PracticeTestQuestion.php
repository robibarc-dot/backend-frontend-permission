<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PracticeTestQuestion extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'practice_test_id',
        'question_id',
        'order',
        'module_id',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'practice_test_id' => 'integer',
        'question_id' => 'integer',
        'order' => 'integer',
        'module_id' => 'integer',
    ];

    /**
     * Get the practice test this question assignment belongs to.
     */
    public function practiceTest()
    {
        return $this->belongsTo(PracticeTest::class);
    }

    /**
     * Get the assigned question.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Get the module for this question assignment.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
