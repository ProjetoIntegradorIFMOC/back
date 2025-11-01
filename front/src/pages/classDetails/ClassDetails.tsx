import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import type { Class, ClassStudent } from "@/types/classes";
import type { Student, Activity } from "@/types";
import ClassesService from "@/services/ClassesService";
import { getAllStudents } from "@/services/StudentsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";
import { ArrowLeft, UserPlus, UserMinus, Users, Search, BookOpen, Plus } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClassDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasAnyRole } = useUserRole();

  const defaultTab = searchParams.get("tab") || "activities";

  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (id) {
      loadClassData();
      loadClassStudents();
      loadAllStudents();
      loadClassActivities();
    }
  }, [id]);

  useEffect(() => {
    filterAvailableStudents();
  }, [searchTerm, allStudents, students]);

  const loadClassData = async () => {
    try {
      const data = await ClassesService.getClassById(Number(id));
      setClassData(data);
    } catch (error) {
      console.error("Erro ao carregar turma:", error);
      showNotification("Erro ao carregar turma", "error");
    }
  };

  const loadClassStudents = async () => {
    try {
      const data = await ClassesService.getClassStudents(Number(id));
      setStudents(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      showNotification("Erro ao carregar alunos", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadAllStudents = async () => {
    try {
      const data = await getAllStudents();
      setAllStudents(data);
    } catch (error) {
      console.error("Erro ao carregar lista de alunos:", error);
    }
  };

  const loadClassActivities = async () => {
    try {
      // Mock de atividades - substituir por chamada real da API
      const mockActivities: Activity[] = [
        {
          id: 1,
          problemId: 101,
          title: "Implementar QuickSort",
          dueDate: "2024-12-15T23:59:59Z",
          status: "pending",
        },
        {
          id: 2,
          problemId: 102,
          title: "Árvore Binária de Busca",
          dueDate: "2024-12-20T23:59:59Z",
          status: "pending",
        },
        {
          id: 3,
          problemId: 103,
          title: "Lista Encadeada",
          dueDate: "2024-11-30T23:59:59Z",
          status: "overdue",
        },
      ];
      setActivities(mockActivities);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
    }
  };

  const filterAvailableStudents = () => {
    const enrolledIds = students.map((s) => s.studentId);
    let available = allStudents.filter((s) => !enrolledIds.includes(s.id));

    if (searchTerm.trim()) {
      available = available.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(available);
  };

  const handleAddStudent = async (studentId: number) => {
    try {
      await ClassesService.addStudentToClass(Number(id), { studentId });
      showNotification("Aluno adicionado com sucesso!", "success");
      loadClassStudents();
      setSearchTerm("");
    } catch (error) {
      console.error("Erro ao adicionar aluno:", error);
      showNotification("Erro ao adicionar aluno", "error");
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!confirm("Tem certeza que deseja remover este aluno da turma?")) return;

    try {
      await ClassesService.removeStudentFromClass(Number(id), studentId);
      showNotification("Aluno removido com sucesso!", "success");
      loadClassStudents();
    } catch (error) {
      console.error("Erro ao remover aluno:", error);
      showNotification("Erro ao remover aluno", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) return <Loading />;

  if (!classData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Turma não encontrada</p>
          <Button onClick={() => navigate("/classes")} className="mt-4">
            Voltar para Turmas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/classes")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">{classData.nome}</h1>
          {classData.teacherName && (
            <p className="mt-2 text-gray-700">
              Professor: {classData.teacherName}
            </p>
          )}
        </div>
      </div>

      {/* Tabs: Atividades e Alunos */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Atividades ({activities.length})
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Alunos ({students.length})
          </TabsTrigger>
        </TabsList>

        {/* Aba de Atividades */}
        <TabsContent value="activities">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Atividades da Turma</h2>
              {hasAnyRole(["professor", "admin"]) && (
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Atividade
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma atividade cadastrada para esta turma
                </p>
              ) : (
                activities.map((activity) => {
                  const dueDate = new Date(activity.dueDate);
                  const isOverdue = activity.status === "overdue";
                  const isPending = activity.status === "pending";

                  return (
                    <div
                      key={activity.id}
                      className={`p-4 rounded-lg border-l-4 transition-colors ${
                        isOverdue
                          ? "bg-red-50 border-red-500"
                          : isPending
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-green-50 border-green-500"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Prazo: {dueDate.toLocaleDateString("pt-BR")} às{" "}
                            {dueDate.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <span
                            className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                              isOverdue
                                ? "bg-red-100 text-red-700"
                                : isPending
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isOverdue
                              ? "Atrasada"
                              : isPending
                              ? "Pendente"
                              : "Concluída"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>

        {/* Aba de Alunos */}
        <TabsContent value="students">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Alunos Matriculados</h2>
              {hasAnyRole(["professor", "admin"]) && (
                <Button onClick={() => setShowAddStudent(!showAddStudent)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar Aluno
                </Button>
              )}
            </div>

            {/* Formulário de adicionar aluno */}
            {showAddStudent && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar alunos disponíveis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredStudents.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      {searchTerm
                        ? "Nenhum aluno encontrado"
                        : "Todos os alunos já estão matriculados"}
                    </p>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex justify-between items-center p-3 bg-white rounded border hover:border-blue-300 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            {student.email}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddStudent(student.id)}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Lista de alunos matriculados */}
            <div className="space-y-2">
              {students.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhum aluno matriculado nesta turma
                </p>
              ) : (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{student.studentName}</p>
                      <p className="text-sm text-gray-600">
                        {student.studentEmail}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Matriculado em:{" "}
                        {new Date(student.enrolledAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                    {hasAnyRole(["professor", "admin"]) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveStudent(student.studentId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
