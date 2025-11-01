<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlunoTurmaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // arquivo duplicado pois o Resource de Aluno não recebe um Aluno mas sim um User
        return [
            'id' => $this->user->id,
            'name' => $this->user->name,
            'email' => $this->user->email,
            'created_at' => $this->user->created_at->toDateTimeString(),
            'matricula' => $this?->matricula,
            'curso' => $this?->curso ? [
                'id' => $this->curso->id,
                'nome' => $this->curso->nome,
            ] : null
        ];
    }
}
