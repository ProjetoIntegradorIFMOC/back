<?php

namespace Database\Seeders;

use App\Models\Aluno;
use App\Models\Professor;
use App\Models\Turma;
use Illuminate\Database\Seeder;

class TurmaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $prof1 = Professor::where('area_atuacao', 'Engenharia de Software')->first();
        $prof2 = Professor::where('area_atuacao', 'Banco de Dados')->first();
        $prof3 = Professor::where('area_atuacao', 'Inteligência Artificial')->first();

        if ($prof1) {
            Turma::create([
                'nome' => 'Arquitetura de Software',
                'professor_id' => $prof1->id
            ]);
            Turma::create([
                'nome' => 'Padrões de Projeto',
                'professor_id' => $prof1->id
            ]);
        }

        if ($prof2) {
            Turma::create([
                'nome' => 'Banco de Dados NoSQL',
                'professor_id' => $prof2->id
            ]);
        }

        if ($prof3) {
            Turma::create([
                'nome' => 'Aprendizado de Máquina',
                'professor_id' => $prof3->id
            ]);
            Turma::create([
                'nome' => 'Visão Computacional',
                'professor_id' => $prof3->id
            ]);
        }

        $alunoAna = Aluno::where('matricula', '2023001')->first();
        $alunoBruno = Aluno::where('matricula', '2023002')->first();
        $alunoCarlos = Aluno::where('matricula', '2023003')->first();

        $turmaArch = Turma::where('nome', 'Arquitetura de Software')->first();
        $turmaPatterns = Turma::where('nome', 'Padrões de Projeto')->first();
        $turmaNoSQL = Turma::where('nome', 'Banco de Dados NoSQL')->first();
        $turmaML = Turma::where('nome', 'Aprendizado de Máquina')->first();
        $turmaCV = Turma::where('nome', 'Visão Computacional')->first();

        if ($alunoAna && $turmaArch && $turmaPatterns) {
            $alunoAna->turmas()->attach([$turmaArch->id, $turmaPatterns->id]);
        }

        if ($alunoBruno && $turmaNoSQL) {
            $alunoBruno->turmas()->attach($turmaNoSQL->id);
        }

        if ($alunoCarlos && $turmaML && $turmaCV) {
            $alunoCarlos->turmas()->attach([$turmaML->id, $turmaCV->id]);
        }

        if ($alunoAna && $turmaML) {
            $alunoAna->turmas()->attach($turmaML->id);
        }
    }
}
