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
        Schema::create('turma', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->unsignedBigInteger('professor_id');
            $table->foreign('professor_id')->references('id')->on('professor')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('aluno_turma', function (Blueprint $table) {
            $table->unsignedBigInteger('aluno_id');
            $table->unsignedBigInteger('turma_id');
            $table->foreign('aluno_id')->references('user_id')->on('alunos')->onDelete('cascade');
            $table->foreign('turma_id')->references('id')->on('turma')->onDelete('cascade');
            $table->primary(['aluno_id', 'turma_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aluno_turma');

        Schema::dropIfExists('turma');
    }
};
