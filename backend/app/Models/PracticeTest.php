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
}
