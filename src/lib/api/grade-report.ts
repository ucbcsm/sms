import { GradeReportResponse } from "@/types";
import api from "../fetcher";


export async function getStudentPeriodGrades(searchParams: {
  userId: number;
  page?: number;
  pageSize?: number;
  session?: "main_session" | "retake_session";
  moment?: "before_appeal" | "after_appeal";
}) {
  const { userId, page, pageSize, session, moment } = searchParams;
  const query = new URLSearchParams();
  query.append("user__id", userId.toString());
  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    query.append("page_size", pageSize.toString());
  }
  if (session !== undefined) {
    query.append("session", session.toString());
  }
  if (moment !== undefined) {
    query.append("moment", moment.toString());
  }
  const res = await api.get(`/jury/period-grades/?${query.toString()}`);
  return res.data as {
    count: number;
    next: number | null;
    previous: number | null;
    results: any[];
  };
}

export async function getStudentYearGrades(searchParams: {
  userId: number;
  page?: number;
  pageSize?: number;
  session?: "main_session" | "retake_session";
  moment?: "before_appeal" | "after_appeal";
}) {
  const { userId, page, pageSize, session, moment } = searchParams;
  const query = new URLSearchParams();
  query.append("user__id", userId.toString());
  if (page !== undefined) {
    query.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    query.append("page_size", pageSize.toString());
  }
  if (session !== undefined) {
    query.append("session", session.toString());
  }
  if (moment !== undefined) {
    query.append("moment", moment.toString());
  }
  const res = await api.get(`/jury/year-grades/?${query.toString()}`);
  return res.data as {
    count: number;
    next: number | null;
    previous: number | null;
    results: any[];
  };
}

export async function getStudentGradeReport(searchParams: {
  mode?: "PERIOD-GRADE" | "YEAR-GRADE";
  period_grade__id?: number;
  year_grade__id?: number;
}) {
  const { mode, period_grade__id, year_grade__id } = searchParams;
  const query = new URLSearchParams();
  if (mode !== undefined) {
    query.append("mode", mode.toString());
  }
  if (period_grade__id !== undefined) {
    query.append("period_grade__id", period_grade__id.toString());
  }
  if (year_grade__id !== undefined) {
    query.append("year_grade__id", year_grade__id.toString());
  }
  const res = await api.get(`/jury/grade-report/?${query.toString()}`);
  return res.data as GradeReportResponse | null;
}
