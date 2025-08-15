<?php

namespace App\Http\Controllers;

use App\Facades\Judge0;
use App\Lib\Dicionarios\Status;
use App\Models\Correcao;
use App\Models\Submissao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CorrecaoController extends Controller
{
    public function buscaPorSubmissao(Submissao $submissao){
        $correcoes = Correcao::where('submissao_id', '=', $submissao->id)
            ->select('correcao.id', 'token', 'caso_teste_id', 'submissao_id', 'status_correcao_id as status')
            ->get();


        foreach($correcoes as $correcao){
            $token = $correcao['token'];
            $status = Judge0::getStatus($token);
            $id = $status['id'];

            DB::update("update correcao set status_correcao_id = $id where token = '$token'");
            $correcao['status'] = Status::get($id)['nome'];
            unset($correcao['token']);
        }

        return response()->json($correcoes);
    }
}
