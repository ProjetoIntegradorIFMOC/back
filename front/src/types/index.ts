export type ActivityStatus = "completed" | "pending" | "overdue";
export type SubmissionStatus =
  | "approved"
  | "partial"
  | "failed"
  | "compile-error";
export type Language = "c" | "cpp" | "java" | "python";

export type Activity = {
  id: number;
  problemId: number;
  title: string;
  dueDate: string; // ISO date string
  status: ActivityStatus;
};

export type Problem = {
  id: number;
  title: string;
  statement: string;
  timeLimitMs: number;
  memoryLimitKb: number;
  testCases?: TestCase[];
};

export type Submission = {
  id: number;
  activityId: number;
  dateSubmitted: string; // ISO date string
  language: Language;
  status: SubmissionStatus;
};

export type Evaluation = {
  id: number;
  submissionId: number;
  token: string;
  status: SubmissionStatus;
};

export type TestCase = {
  id: number;
  input: string;
  expectedOutput: string;
  private: boolean;
};

export type TestCaseResult = {
  id: number;
  testCaseId: number;
  submissionId: number;
  status: string;
};

export type SubmissionReport = {
  submissionId: number;
  activityTitle: string;
  language: Language;
  dateSubmitted: string;
  overallStatus: SubmissionStatus;
  testCases: TestCaseResult[];
  compileLog?: string;
};

export type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type LoginRequest = {
  email: string;
  password: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
}
export type Student = {
  id: number;
  name: string;
  email: string;
  matricula: string | number;
  curso_id?: number;
  curso?: {
    id: number;
    nome: string;
  };
  created_at?: string;
  password?: string;
  password_confirmation?: string;
}
