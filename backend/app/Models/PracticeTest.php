<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PracticeTest extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'question_type',
        'duration_mins',
        'category',
        'type',
        'slug',
    ];

    /**
     * Get the questions assigned to the practice test.
     */
    public function practiceTestQuestions()
    {
        return $this->hasMany(PracticeTestQuestion::class);
    }

    /**
     * Get the configured sections for this practice test.
     */
    public function testSections()
    {
        return $this->hasMany(TestSection::class, 'test_id')
            ->where('test_type', 'practice');
    }
}
