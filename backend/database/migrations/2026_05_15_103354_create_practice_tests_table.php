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
        Schema::create('practice_tests', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->integer('duration_mins'); // Total time for the test
            $table->enum('category', ['academic', 'general']);
            $table->enum('type', ['free', 'paid']);
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practice_tests');
    }
};
