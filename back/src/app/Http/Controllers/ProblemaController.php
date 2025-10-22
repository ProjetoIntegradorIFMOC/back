<?php

namespace App\Http\Controllers;

use App\Models\Problema;
use App\Services\ProblemaService;
use Exception;
use Illuminate\Http\Request;

class ProblemaController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/problemas",
     *      operationId="getProblemasList",
     *      tags={"Problemas"},
     *      summary="Lista todos os problemas",
     *      description="Retorna uma lista de problemas, incluindo seus respectivos casos de teste.",
     *      @OA\Response(
     *          response=200,
     *          description="Operação bem-sucedida",
     *          @OA\JsonContent(
     *              type="array",
     *              @OA\Items(ref="#/components/schemas/ProblemaComCasosTeste")
     *          )
     *      )
     * )
     */
    public function index()
    {
        $problemas = Problema::with('casosTeste')->get();


        return response()->json([$problemas]);
    }

    /**
     * @OA\Post(
     *      path="/api/problemas",
     *      operationId="storeProblema",
     *      tags={"Problemas"},
     *      summary="Cria um novo problema",
     *      description="Cria um novo problema e seus casos de teste associados em uma única requisição.",
     *      @OA\RequestBody(
     *          required=true,
     *          description="Dados do problema e seus casos de teste.",
     *          @OA\JsonContent(
     *              required={"titulo", "enunciado", "tempo_limite", "memoria_limite", "casos_teste"},
     *              @OA\Property(property="titulo", type="string", example="Soma Simples"),
     *              @OA\Property(property="enunciado", type="string", example="Faça um programa que some dois números."),
     *              @OA\Property(property="tempo_limite", type="integer", example=1),
     *              @OA\Property(property="memoria_limite", type="integer", example=1024),
     *              @OA\Property(
     *                  property="casos_teste",
     *                  type="array",
     *                  description="Lista de casos de teste para o problema.",
     *                  @OA\Items(
     *                      type="object",
     *                      required={"entrada", "saida"},
     *                      @OA\Property(property="entrada", type="string", example="1 2"),
     *                      @OA\Property(property="saida", type="string", example="3"),
     *                      @OA\Property(property="privado", type="boolean", description="Define se o caso de teste é público (false) ou privado (true). O padrão é false se não for enviado.", example=false)
     *                  )
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Problema criado com sucesso",
     *          @OA\JsonContent(ref="#/components/schemas/Problema")
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Erro ao salvar",
     *          @OA\JsonContent(type="string", example="Erro ao salvar!")
     *      )
     * )
     */
    public function store(Request $request)
    {
        $problemaService = new ProblemaService($request);

        if(!$problemaService->salvar()){
            return response()->json('Erro ao salvar!', 400);
        }

        return response()->json($problemaService->getProblema());
    }

    /**
     * @OA\Get(
     *      path="/api/problemas/{problema}",
     *      operationId="getProblemaById",
     *      tags={"Problemas"},
     *      summary="Exibe um problema específico",
     *      description="Retorna os dados de um único problema, sem os casos de teste.",
     *      @OA\Parameter(
     *          name="problema",
     *          in="path",
     *          required=true,
     *          description="ID do problema",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Operação bem-sucedida",
     *          @OA\JsonContent(ref="#/components/schemas/Problema")
     *      ),
     *      @OA\Response(response=404, description="Problema não encontrado")
     * )
     */
    public function show(Problema $problema)
    {
        return response()->json($problema);
    }

    /**
     * @OA\Put(
     *      path="/api/problemas/{problema}",
     *      operationId="updateProblema",
     *      tags={"Problemas"},
     *      summary="Atualiza um problema (Não implementado)",
     *      deprecated=true,
     *      description="Este endpoint ainda não foi implementado.",
     *      @OA\Parameter(name="problema", in="path", required=true, @OA\Schema(type="integer")),
     *      @OA\Response(response=501, description="Não implementado")
     * )
     */
    public function update(Request $request, Problema $problema)
    {

    }
    public function teste(){

    }

    /**
     * @OA\Delete(
     *      path="/api/problemas/{problema}",
     *      operationId="deleteProblema",
     *      tags={"Problemas"},
     *      summary="Remove um problema",
     *      description="Apaga um problema e seus dados associados do banco de dados.",
     *      @OA\Parameter(
     *          name="problema",
     *          in="path",
     *          required=true,
     *          description="ID do problema a ser removido",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Removido com sucesso",
     *          @OA\JsonContent(type="string", example="Apagado com sucesso!")
     *      ),
     *      @OA\Response(response=400, description="Erro ao apagar"),
     *      @OA\Response(response=404, description="Problema não encontrado")
     * )
     */
    public function destroy(Problema $problema)
    {
        try{
            $problema->delete();
        } catch(Exception $e){
            return response()->json(['Erro ao apagar.'], 400);
        }

        return response()->json(['Apagado com sucesso!']);
    }
}
