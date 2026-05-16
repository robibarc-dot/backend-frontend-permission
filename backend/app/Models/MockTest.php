<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MockTest extends Model
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
     * Get the questions assigned to the mock test.
     */
    public function mockTestQuestions()
    {
        return $this->hasMany(MockTestQuestion::class);
    }
}
