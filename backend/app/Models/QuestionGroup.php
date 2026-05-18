<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionGroup extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'test_section_id',
        'question_type_id',
        'title',
        'instruction',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function testSection()
    {
        return $this->belongsTo(TestSection::class);
    }

    public function questionType()
    {
        return $this->belongsTo(QuestionType::class);
    }
}
