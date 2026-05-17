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
        Schema::create('test_contexts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('test_section_id');
            $table->text('passage_text')->nullable();
            $table->string('image')->nullable();
            $table->string('audio')->nullable();            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('passages');
    }
};
