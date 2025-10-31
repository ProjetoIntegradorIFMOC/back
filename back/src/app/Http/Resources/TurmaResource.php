<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TurmaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'nome_professor' => $this->professor->user->name,
            'num_alunos' => $this->alunos()->count(),
            'alunos' => AlunoTurmaResource::collection($this->whenLoaded('alunos')),
        ];
    }
}
