import { useEffect, useMemo, useState } from "react";
import type { Activity, Submission } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { getAllSubmissions } from "@/services/SubmissionsService";
import { getAllActivities } from "@/services/ActivitiesService";
import { useNavigate } from "react-router";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlayCircle,
  Search,
  Filter,
  TrendingUp,
  Award,
  Target,
  ArrowRight,
  Loader2,
  RefreshCw,
  Download,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Configuração dos possíveis status das submissões (cor, ícone, etc)
const statusConfig = {
  accepted: {
    label: "Aceito",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800 border-green-200",
    dotColor: "bg-green-500",
  },
  rejected: {
    label: "Rejeitado",
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200",
    dotColor: "bg-red-500",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dotColor: "bg-yellow-500",
  },
  running: {
    label: "Executando",
    icon: PlayCircle,
    className: "bg-blue-100 text-blue-800 border-blue-200",
    dotColor: "bg-blue-500",
  },
  "compile-error": {
    label: "Erro de Compilação",
    icon: AlertCircle,
    className: "bg-orange-100 text-orange-800 border-orange-200",
    dotColor: "bg-orange-500",
  },
} as const;

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
}

// Exibe o badge de status da submissão
function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

// Formata a data de envio e retorna string relativa (ex: "2h atrás")
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  const formatted = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let relative = "";

  if (diffMinutes < 1) {
    relative = "Agora mesmo";
  } else if (diffMinutes < 60) {
    relative = `${diffMinutes}min atrás`;
  } else if (diffHours < 24) {
    relative = `${diffHours}h atrás`;
  } else if (diffDays === 1) {
    relative = "Ontem";
  } else if (diffDays < 7) {
    relative = `${diffDays} dias atrás`;
  } else {
    relative = `${Math.floor(diffDays / 7)} semanas atrás`;
  }

  return { formatted, relative };
}

// Skeleton de loading exibido enquanto os dados são carregados
function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  description?: string;
}

// Card de estatística para exibição rápida dos dados
function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Submissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mapeia o id da atividade para o título dela (para exibir na tabela)
  const mapActivitiesTitle = useMemo(() => {
    return new Map(activities.map((activity) => [activity.id, activity.title]));
  }, [activities]);

  // Calcula estatísticas rápidas sobre as submissões
  const stats = useMemo(() => {
    const total = submissions.length;
    const accepted = submissions.filter((s) => s.status === "accepted").length;
    const rejected = submissions.filter((s) => s.status === "rejected").length;
    const pending = submissions.filter(
      (s) => s.status === "pending" || s.status === "running"
    ).length;
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    return { total, accepted, rejected, pending, acceptanceRate };
  }, [submissions]);

  // Busca todas as submissões do usuário
  async function fetchSubmissions() {
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  }

  // Busca todas as atividades para mapear títulos
  async function fetchActivities() {
    try {
      const data = await getAllActivities();
      setActivities(data.items);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  }

  // Carrega dados ao montar componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSubmissions(), fetchActivities()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Redireciona para o detalhe da submissão ao clicar na linha da tabela
  function redirectToSubmission(submission: Submission) {
    console.log("Redirecting to submission:", submission);
    navigate(`/submissions/${submission.id}`);
  }

  // Atualiza os dados ao clicar em "Atualizar"
  async function refreshData() {
    setLoading(true);
    try {
      await Promise.all([fetchSubmissions(), fetchActivities()]);
    } finally {
      setLoading(false);
    }
  }

  // Filtra submissões pelo termo de busca e filtro de status
  const filteredSubmissions = submissions.filter((submission) => {
    const activityTitle = mapActivitiesTitle.get(submission.activityId) || "";
    const matchesSearch = activityTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Ordena submissões da mais recente para a mais antiga
  const sortedSubmissions = [...filteredSubmissions].sort(
    (a, b) =>
      new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
  );

  // Obtém os status únicos presentes para montar o filtro do select
  const uniqueStatuses = [...new Set(submissions.map((s) => s.status))];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Submissões
          </h1>
          <p className="text-gray-600 mt-1">
            Acompanhe o histórico de todas as suas submissões
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas rápidas */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de Submissões"
            value={stats.total}
            icon={FileText}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            description="Todas as tentativas"
          />
          <StatsCard
            title="Aceitas"
            value={stats.accepted}
            icon={CheckCircle2}
            color="bg-gradient-to-r from-green-500 to-green-600"
            description="Soluções aprovadas"
          />
          <StatsCard
            title="Taxa de Sucesso"
            value={stats.acceptanceRate}
            icon={TrendingUp}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            description={`${stats.acceptanceRate}% de aprovação`}
          />
          <StatsCard
            title="Pendentes"
            value={stats.pending}
            icon={Clock}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            description="Aguardando avaliação"
          />
        </div>
      )}

      {/* Filtros de busca e status */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por atividade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[140px]"
          >
            <option value="all">Todos os status</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {statusConfig[status as keyof typeof statusConfig]?.label ||
                  status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de submissões */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <LoadingSkeleton />
          </div>
        ) : sortedSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "Nenhuma submissão encontrada"
                : "Nenhuma submissão ainda"}
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Suas submissões aparecerão aqui quando você enviar soluções"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Atividade
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data de Submissão
                  </div>
                </TableHead>

                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSubmissions.map((submission) => {
                const dateInfo = formatDate(submission.dateSubmitted);
                const activityTitle = mapActivitiesTitle.get(
                  submission.activityId
                );

                return (
                  <TableRow
                    key={submission.id}
                    onClick={() => redirectToSubmission(submission)}
                    className="cursor-pointer hover:bg-purple-50 transition-colors duration-200 group"
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-gray-900 group-hover:text-purple-600 transition-colors">
                          {activityTitle || "Atividade não encontrada"}
                        </span>
                        {!activityTitle && (
                          <span className="text-xs text-red-500 mt-1">
                            ID: {submission.activityId}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">
                          {dateInfo.formatted}
                        </span>
                        <span className="text-xs text-gray-500">
                          {dateInfo.relative}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Rodapé com info sobre os filtros aplicados */}
      {!loading && sortedSubmissions.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Mostrando {sortedSubmissions.length} de {submissions.length}{" "}
          submissões
          {(searchTerm || statusFilter !== "all") && " (filtradas)"}
        </div>
      )}
    </div>
  );
}
