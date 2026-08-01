<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('curriculum_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_id')->constrained('course_levels')->onDelete('cascade');
            $table->string('item_name');
            $table->integer('sort_order')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curriculum_items');
    }
};