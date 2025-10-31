import axios from "axios";
import type {
  Class,
  CreateClassDTO,
  UpdateClassDTO,
  ClassStudent,
  AddStudentToClassDTO,
} from "@/types/classes";
import { mockClasses, mockClassStudents } from "@/mocks/classes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
    try {
      const response = await api.get("/classes");
      return response.data;
    } catch (error) {
      console.warn("API não disponível, usando dados mockados", error);
      return Promise.resolve(mockClasses);
    }
  },

  // Buscar turma por ID
  getClassById: async (id: number): Promise<Class> => {
    try {
      const response = await api.get(`/classes/${id}`);
      return response.data;
    } catch (error) {
      console.warn("API não disponível, usando dados mockados", error);
      const mockClass = mockClasses.find((c) => c.id === id);
      if (!mockClass) throw new Error("Turma não encontrada");
      return Promise.resolve(mockClass);
    }
  },

  // Criar nova turma
  createClass: async (data: CreateClassDTO): Promise<Class> => {
    try {
      const response = await api.post("/classes", data);
      return response.data;
    } catch (error) {
      console.warn("API não disponível, simulando criação", error);
      const newClass: Class = {
        id: Math.max(...mockClasses.map((c) => c.id)) + 1,
        ...data,
        studentsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClasses.push(newClass);
      return Promise.resolve(newClass);
    }
  },

  // Atualizar turma
  updateClass: async (id: number, data: UpdateClassDTO): Promise<Class> => {
    try {
      const response = await api.put(`/classes/${id}`, data);
      return response.data;
    } catch (error) {
      console.warn("API não disponível, simulando atualização", error);
      const classIndex = mockClasses.findIndex((c) => c.id === id);
      if (classIndex === -1) throw new Error("Turma não encontrada");
      
      mockClasses[classIndex] = {
        ...mockClasses[classIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return Promise.resolve(mockClasses[classIndex]);
    }
  },

  // Deletar turma
  deleteClass: async (id: number): Promise<void> => {
    try {
      await api.delete(`/classes/${id}`);
    } catch (error) {
      console.warn("API não disponível, simulando exclusão", error);
      const classIndex = mockClasses.findIndex((c) => c.id === id);
      if (classIndex !== -1) {
        mockClasses.splice(classIndex, 1);
      }
      return Promise.resolve();
    }
  },

  // Listar alunos de uma turma
  getClassStudents: async (classId: number): Promise<ClassStudent[]> => {
    try {
      const response = await api.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      console.warn("API não disponível, usando dados mockados", error);
      return Promise.resolve(mockClassStudents[classId] || []);
    }
  },

  // Adicionar aluno à turma
  addStudentToClass: async (
    classId: number,
    data: AddStudentToClassDTO
  ): Promise<ClassStudent> => {
    try {
      const response = await api.post(`/classes/${classId}/students`, data);
      return response.data;
    } catch (error) {
      console.warn("API não disponível, simulando adição de aluno", error);
      const newStudent: ClassStudent = {
        id: Date.now(),
        classId,
        studentId: data.studentId,
        studentName: "Aluno Mock",
        studentEmail: "aluno.mock@ifmoc.edu.br",
        enrolledAt: new Date().toISOString(),
      };
      if (!mockClassStudents[classId]) {
        mockClassStudents[classId] = [];
      }
      mockClassStudents[classId].push(newStudent);
      return Promise.resolve(newStudent);
    }
  },

  // Remover aluno da turma
  removeStudentFromClass: async (
    classId: number,
    studentId: number
  ): Promise<void> => {
    try {
      await api.delete(`/classes/${classId}/students/${studentId}`);
    } catch (error) {
      console.warn("API não disponível, simulando remoção de aluno", error);
      if (mockClassStudents[classId]) {
        mockClassStudents[classId] = mockClassStudents[classId].filter(
          (s) => s.studentId !== studentId
        );
      }
      return Promise.resolve();
    }
  },

  // Buscar turmas de um professor
  getClassesByTeacher: async (teacherId: number): Promise<Class[]> => {
    const response = await api.get(`/teachers/${teacherId}/classes`);
    return response.data;
  },

  // Buscar turmas de um aluno
  getClassesByStudent: async (studentId: number): Promise<Class[]> => {
    try {
      const response = await api.get(`/students/${studentId}/classes`);
      return response.data;
    } catch (error) {
      console.warn("API não disponível, usando dados mockados para turmas do aluno", error);
      // Encontrar todas as turmas onde o aluno está matriculado nos mocks
      const classIds = Object.entries(mockClassStudents)
        .filter(([, students]) => students.some((s) => s.studentId === studentId))
        .map(([classId]) => Number(classId));

      const result = mockClasses.filter((c) => classIds.includes(c.id));
      return Promise.resolve(result);
    }
  },
};

export default ClassesService;
