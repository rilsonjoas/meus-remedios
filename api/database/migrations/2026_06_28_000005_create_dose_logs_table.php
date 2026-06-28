<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dose_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dose_schedule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('medication_id')->constrained()->cascadeOnDelete();
            $table->foreignId('profile_id')->constrained()->cascadeOnDelete();
            $table->timestamp('scheduled_at');
            $table->timestamp('taken_at')->nullable();
            $table->enum('status', ['taken', 'skipped', 'missed'])->default('missed');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['profile_id', 'scheduled_at']);
            $table->index(['medication_id', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dose_logs');
    }
};
