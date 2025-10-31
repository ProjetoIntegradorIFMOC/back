<?php

namespace App\Http\Controllers;

use App\Http\Requests\TurmaRequest;
use App\Http\Resources\TurmaResource;
use App\Models\Turma;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;


class TurmaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::find(Auth::id());
        if ($user->professor) {
            return TurmaResource::collection($user->professor->turmas)->response();
        } else {
            return TurmaResource::collection($user->aluno->turmas)->response();
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TurmaRequest $request)
    {
        $request->validated();

        if (!$request->user()->professor) {
            return response()->json('Erro ao salvar!', 403);
        }

        $turma = Turma::create([
            'nome' => $request['nome'],
            'professor_id' => $request->user()->professor->id
        ]);

        return (new TurmaResource($turma))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $turma_id)
    {
        $turma = Turma::with(['alunos'])->find($turma_id);

        if (!$turma) {
            return response()->json('Turma não encontrada!', 404);
        }

        return (new TurmaResource($turma))->response();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TurmaRequest $request, int $turma_id)
    {
        $request->validated();

        $turma = Turma::find($turma_id);
        if (!$turma) {
            return response()->json('Turma não encontrada!', 404);
        }

        $turma->nome = $request['nome'];
        $turma->save();

        return (new TurmaResource($turma))->response();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $turma_id)
    {
        $turma = Turma::find($turma_id);
        if (!$turma) {
            return response()->json('Turma não encontrada!', 404);
        }

        try {
            $turma->delete();
        } catch (Exception $e) {
            return response()->json('Erro ao apagar.', 500);
        }

        return response()->noContent();
    }
}
