<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('practice_test_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('practice_test_id');
            $table->unsignedBigInteger('question_id');
            $table->integer('order')->default(1); // Maintains 1-40 sequence
            $table->unsignedBigInteger('module_id'); // 'reading', 'listening', etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practice_test_questions');
    }
};
