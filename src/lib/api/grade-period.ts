import { PeriodGrades } from "@/types";
import api from "../fetcher";

export async function getGradeByPeriod(searchParams: {
  yearId: number;
  facultyId: number;
  departmentId: number;
  classId: number;
  periodId: number;
  moment: "before_appeal" | "after_appeal";
  session: "main_session" | "retake_session";
}) {
  const {
    yearId,
    facultyId,
    departmentId,
    classId,
    periodId,
    moment,
    session,
  } = searchParams;
  const queryParams = new URLSearchParams();

  queryParams.append("academic_year__id", yearId.toString());
  queryParams.append("faculty__id", facultyId.toString());
  queryParams.append("departement__id", departmentId.toString());
  queryParams.append("class_year__id", classId.toString());
  queryParams.append("period__id", periodId.toString());
  queryParams.append("session", session.toString());
  queryParams.append("moment", moment.toString());

  const res = await api.get(`/jury/period-grades?${queryParams.toString()}`);

  return res.data.results as PeriodGrades[];
}
