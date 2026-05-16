<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MockTestQuestion extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'mock_test_id',
        'question_id',
        'order',
        'module_id',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'mock_test_id' => 'integer',
        'question_id' => 'integer',
        'order' => 'integer',
        'module_id' => 'integer',
    ];

    /**
     * Get the mock test this question assignment belongs to.
     */
    public function mockTest()
    {
        return $this->belongsTo(MockTest::class);
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
