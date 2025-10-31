<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Turma extends Model
{
    protected $table = 'turma';
    protected $primaryKey = 'id';

    protected $fillable = ['nome', 'professor_id'];

    use HasFactory;

    public function professor(): HasOne
    {
        return $this->hasOne(Professor::class, 'id', 'professor_id');
    }

    public function alunos(): BelongsToMany
    {
        return $this->belongsToMany(Aluno::class, 'aluno_turma', 'turma_id', 'aluno_id', 'id', 'user_id');
    }
}
