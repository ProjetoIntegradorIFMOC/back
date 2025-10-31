import axios from "axios";
import type {
  Class,
  CreateClassDTO,
  UpdateClassDTO,
  ClassStudent,
  AddStudentToClassDTO,
} from "@/types/classes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token se necessário
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ClassesService = {
  // Listar todas as turmas
  getAllClasses: async (): Promise<Class[]> => {
    const response = await api.get("/turmas");
    return response.data.data || response.data;
  },

  // Buscar turma por ID
  getClassById: async (id: number): Promise<Class> => {
    const response = await api.get(`/turmas/${id}`);
    return response.data.data || response.data;
  },

  // Criar nova turma
  createClass: async (data: CreateClassDTO): Promise<Class> => {
    const response = await api.post("/turmas", data);
    return response.data.data || response.data;
  },

  // Atualizar turma
  updateClass: async (id: number, data: UpdateClassDTO): Promise<Class> => {
    const response = await api.put(`/turmas/${id}`, data);
    return response.data.data || response.data;
  },

  // Deletar turma
  deleteClass: async (id: number): Promise<void> => {
    await api.delete(`/turmas/${id}`);
  },

  // Listar alunos de uma turma
  getClassStudents: async (classId: number): Promise<ClassStudent[]> => {
    const response = await api.get(`/turmas/${classId}`);
    const turma = response.data.data || response.data;
    
    // Transformar os alunos do backend para o formato esperado pelo frontend
    if (turma.alunos && Array.isArray(turma.alunos)) {
      return turma.alunos.map((aluno: any) => ({
        id: aluno.id,
        classId: classId,
        studentId: aluno.user_id,
        studentName: aluno.nome || aluno.name,
        studentEmail: aluno.email,
        enrolledAt: aluno.pivot?.created_at || new Date().toISOString(),
      }));
    }
    return [];
  },

  // Adicionar aluno à turma
  addStudentToClass: async (
    classId: number,
    data: AddStudentToClassDTO
  ): Promise<ClassStudent> => {
    const response = await api.post(`/turmas/${classId}/alunos`, data);
    return response.data.data || response.data;
  },

  // Remover aluno da turma
  removeStudentFromClass: async (
    classId: number,
    studentId: number
  ): Promise<void> => {
    await api.delete(`/turmas/${classId}/alunos/${studentId}`);
  },

  // Buscar turmas de um professor
  getClassesByTeacher: async (teacherId: number): Promise<Class[]> => {
    const response = await api.get(`/professores/${teacherId}/turmas`);
    return response.data.data || response.data;
  },

  // Buscar turmas de um aluno
  getClassesByStudent: async (studentId: number): Promise<Class[]> => {
    const response = await api.get(`/alunos/${studentId}/turmas`);
    return response.data.data || response.data;
  },
};

export default ClassesService;
