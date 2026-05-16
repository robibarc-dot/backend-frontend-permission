<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionType extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'module_id',
        'name',
        'slug',
        'upload_hints',
    ];

    /**
     * Get the module that owns the question type.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
