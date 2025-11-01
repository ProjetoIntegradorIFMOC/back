<?php

namespace Database\Seeders;

use App\Models\Professor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfessorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $user1 = User::create([
                'name' => 'Dr. Ricardo Neves',
                'email' => 'ricardo.neves@email.com',
                'password' => 'password123'
            ]);

            $user1->assignRole('professor');

            Professor::create([
                'id' => $user1->id,
                'area_atuacao' => 'Engenharia de Software'
            ]);

            $user2 = User::create([
                'name' => 'Dra. Beatriz Lima',
                'email' => 'beatriz.lima@email.com',
                'password' => 'password123'
            ]);

            $user2->assignRole('professor');

            Professor::create([
                'id' => $user2->id,
                'area_atuacao' => 'Banco de Dados'
            ]);

            $user3 = User::create([
                'name' => 'Dr. Tiago Mendes',
                'email' => 'tiago.mendes@email.com',
                'password' => 'password123'
            ]);

            $user3->assignRole('professor');

            Professor::create([
                'id' => $user3->id,
                'area_atuacao' => 'Inteligência Artificial'
            ]);
        });
    }
}
