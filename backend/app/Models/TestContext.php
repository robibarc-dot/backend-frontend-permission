<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestContext extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'test_section_id',
        'passage_text',
        'image',
        'audio',
    ];

    /**
     * Get the test section that owns the context.
     */
    public function testSection()
    {
        return $this->belongsTo(TestSection::class);
    }
}
