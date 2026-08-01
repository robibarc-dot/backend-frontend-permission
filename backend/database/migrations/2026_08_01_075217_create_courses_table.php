<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('category')->nullable();       // New field replacing the categories table
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('thumbnail_url', 500)->nullable();
            $table->string('promo_video_url', 500)->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('regular_price', 10, 2)->nullable();
            $table->integer('duration_hours')->default(0);
            $table->integer('duration_minutes')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};