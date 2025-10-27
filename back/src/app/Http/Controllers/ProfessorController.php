<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Professor;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProfessorController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Professor::class, 'professor');
    }

    public function index()
    {
        $professores = Professor::with('user')->get();

        return response()->json($professores, 200);
    }


    public function store(StoreProfessorRequest $request)
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $request->name,
                'email' => strtolower($request->email),
                'password' => Hash::make($request->password),
            ]);

            $professor = Professor::create([
                'id' => $user->id,
                'area_atuacao' => $request->area_atuacao,
            ]);

            $user->assignRole('professor');
            DB::commit();


            return response()->json($professor->load('user'), 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao criar professor', 'details' => $e->getMessage()], 500);
        }
    }


    public function update(UpdateProfessorRequest $request, $id)
    {
        $professor = Professor::findOrFail($id);
        $user = User::findOrFail($professor->id);


        try {
            DB::beginTransaction();

            $professor->area_atuacao = $request->area_atuacao ?? $professor->area_atuacao;
            $professor->save();

            $user->name = $request->name ?? $user->name;
            $user->email = isset($request->email) ? strtolower($request->email) : $user->email;
            $user->save();

            DB::commit();


            return response()->json($professor->load('user'), 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao atualizar professor', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $professor = Professor::findOrFail($id);

        return response()->json($professor->load('user'), 200);
    }

    public function destroy($id)
    {
        $professor = Professor::findOrFail($id);
        $user = User::findOrFail($id);

        $professor->delete();
        $user->delete();

        return response()->json(null, 204);
    }
}
