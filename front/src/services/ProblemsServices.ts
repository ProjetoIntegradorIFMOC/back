/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Problem } from "../types";
import { fakeProblems } from "../mocks";
import axios from "axios";

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

/**
 * Simula uma chamada de API para buscar um problema pelo id.
 * @param id id do problema
 * @returns Promise<Problem | undefined>
 */
export async function getProblemById(id: string): Promise<Problem | undefined> {
  try {
    const response = await axios.get(`${API_URL}/api/problemas/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const problema = response.data;
    return {
      id: problema.id,
      title: problema.titulo,
      statement: problema.enunciado,
      timeLimitMs: problema.tempo_limite,
      memoryLimitKb: problema.memoria_limite,
      testCases: problema.casos_teste?.map((caso: any) => ({
        id: caso.id,
        input: caso.entrada,
        expectedOutput: caso.saida,
        private: caso.privado,
      })) || [],
    };
  } catch (error) {
    console.log("erro", error);
    // Fallback para dados fake
    await new Promise((resolve) => setTimeout(resolve, 200));
    return fakeProblems.find((p) => p.id === parseInt(id));
  }
}

export async function getAllProblems(): Promise<Problem[]> {
  try {
    const response = await axios.get(`${API_URL}/api/problemas`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const problemas = Array.isArray(response.data) ? response.data : response.data[0] || [];
    
    return problemas.map((problema: any) => ({
      id: problema.id,
      title: problema.titulo,
      statement: problema.enunciado,
      timeLimitMs: problema.tempo_limite,
      memoryLimitKb: problema.memoria_limite,
      testCases: problema.casos_teste?.map((caso: any) => ({
        id: caso.id,
        input: caso.entrada,
        expectedOutput: caso.saida,
        private: caso.privado,
      })) || [],
    }));
  } catch (error) {
    console.log("erro", error);
    return [];
  }
}

export async function createProblem(problemData: {
  titulo: string;
  enunciado: string;
  tempo_limite: number;
  memoria_limite: number;
  casos_teste: Array<{
    entrada: string;
    saida: string;
    privado?: boolean;
  }>;
  privado?: boolean;
  created_by?: number;

}): Promise<Problem | null> {
  try {
    const response = await axios.post(`${API_URL}/api/problemas`, problemData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const problema = response.data;
    return {
      id: problema.id,
      title: problema.titulo,
      statement: problema.enunciado,
      timeLimitMs: problema.tempo_limite,
      memoryLimitKb: problema.memoria_limite,
    };
  } catch (error) {
    console.error("Erro ao criar problema:", error);
    return null;
  }
}

export async function updateProblem(id: number, problemData: {
  titulo: string;
  enunciado: string;
  tempo_limite: number;
  memoria_limite: number;
  casos_teste: Array<{
    entrada: string;
    saida: string;
    privado?: boolean;
  }>;
}): Promise<Problem | null> {
  try {
    const response = await axios.put(`${API_URL}/api/problemas/${id}`, problemData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const problema = response.data;
    return {
      id: problema.id,
      title: problema.titulo,
      statement: problema.enunciado,
      timeLimitMs: problema.tempo_limite,
      memoryLimitKb: problema.memoria_limite,
    };
  } catch (error) {
    console.error("Erro ao atualizar problema:", error);
    return null;
  }
}

export async function deleteProblem(id: number): Promise<boolean> {
  try {
    await axios.delete(`${API_URL}/api/problemas/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return true;
  } catch (error) {
    console.error("Erro ao excluir problema:", error);
    return false;
  }
}
