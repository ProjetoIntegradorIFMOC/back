<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\RBAC\RoleSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,

            CursoSeeder::class, // Primeiro cria os cursos
            AlunoSeeder::class, // Depois cria os alunos, que dependem dos cursos
            ProfessorSeeder::class,
            TurmaSeeder::class,
        ]);
    }
}
