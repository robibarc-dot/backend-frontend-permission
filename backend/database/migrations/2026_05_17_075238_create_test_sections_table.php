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
        Schema::create('test_sections', function (Blueprint $table) {
            $table->id();
            $table->enum('test_type',['practice','mock']);
            $table->unsignedBigInteger('test_id');
            $table->string('title');
            $table->unsignedBigInteger('module_id'); // 'reading', 'listening', etc.
            $table->integer('order')->default(1); // Maintains 1-40 sequence
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_sections');
    }
};
