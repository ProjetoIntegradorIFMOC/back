<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Aluno extends Model
{
    use HasFactory, Notifiable;


    // Informa ao Eloquent que a chave primária não é auto-incrementável
    public $incrementing = false;

    // Informa ao Eloquent qual é a chave primária
    protected $primaryKey = 'user_id';

    protected $fillable = ['user_id', 'curso_id', 'matricula'];

    // Relacionamento: Um Aluno pertence a um User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relacionamento: Um Aluno pertence a um Curso
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    public function turmas(): BelongsToMany
    {
        return $this->belongsToMany(
            Turma::class,
            'aluno_turma',
            'aluno_id',
            'turma_id',
            'user_id',
            'id'
        );
    }
}
