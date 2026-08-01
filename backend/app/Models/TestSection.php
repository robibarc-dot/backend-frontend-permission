<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestSection extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'test_type',
        'test_id',
        'title',
        'module_id',
        'order',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Get the module that owns the test section.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the contexts for the test section.
     */
    public function context()
    {
        return $this->hasOne(TestContext::class);
    }

    public function questionGroups(){
        return $this->hasMany(QuestionGroup::class);
    }

    /**
     * Get the practice test for this section when test_type is practice.
     */
    public function test()
    {
        return $this->morphTo();
    }
}
