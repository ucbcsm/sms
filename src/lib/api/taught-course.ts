import { TaughtCourse } from "@/types";
import api from "../fetcher";
import dayjs from "dayjs";

export async function getTaughtCourses(searchParams: {
  yearId: number;
  facultyId: number;
  departmentId?: number;
  periodId?: number;
  page?: number;
  pageSize?: number;
  search?:string
}) {
  const { yearId, facultyId, periodId, departmentId, page, pageSize, search } = searchParams;

  const queryParams = new URLSearchParams();

  // Paramètres obligatoires
  queryParams.append("academic_year__id", yearId.toString());
  queryParams.append("faculty__id", facultyId.toString());
  // Paramètres optionnels
  if (periodId !== undefined) {
    queryParams.append("period__id", periodId.toString());
  }
  if (departmentId !== undefined) {
    queryParams.append("departements__id", departmentId.toString());
  }
  if (page !== undefined) {
    queryParams.append("page", page.toString());
  }
  if (pageSize !== undefined) {
    queryParams.append("page_size", pageSize.toString());
  }
  if (search!==undefined && search.trim()!=="") {
    queryParams.append("search", search.trim());
  }

  const res = await api.get(
    `/faculty/taught-course/?${queryParams.toString()}`
  );
  return res.data as {
    results: TaughtCourse[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getTaughtCoursesByFacultyId(
  yearId: number,
  facultyId: number,
  periodId?: number,
  page?: number,
  pageSize?: number
) {
  const res = await api.get(
    `/faculty/taught-course/?academic_year__id=${yearId}&faculty__id=${facultyId}`
  );
  return res.data as {
    results: TaughtCourse[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getTaughtCoursesByDepartmentId(
  yearId: number,
  departmentId: number
) {
  const res = await api.get(
    `/faculty/taught-course/?academic_year__id=${yearId}&departement__id=${departmentId}`
  );
  return res.data.results as TaughtCourse[];
}

export async function getTaughtCours(taughtCourseId: number) {
  const res = await api.get(`/faculty/taught-course/${taughtCourseId}/`);
  return res.data as TaughtCourse;
}

export async function createTaughtCourse(
  data: Omit<
    TaughtCourse,
    | "id"
    | "teacher"
    | "academic_year"
    | "teaching_unit"
    | "period"
    | "available_course"
    | "faculty"
    | "departements"
    | "class_room"
    | "assistants"
  > & {
    teacher_id?: number;
    academic_year_id: number;
    teaching_unit_id?: number;
    period_id: number;
    available_course_id: number;
    faculty_id: number;
    departments_ids: number[];
    class_room_id?: number;
    assistants?: number[];
  }
) {
  const res = await api.post("/faculty/taught-course/", {
    teacher: data.teacher_id || null,
    academic_year: data.academic_year_id,
    teaching_unit: data.teaching_unit_id || null,
    period: data.period_id,
    available_course: data.available_course_id,
    faculty: data.faculty_id,
    departements: data.departments_ids,
    credit_count: data.credit_count || null,
    theoretical_hours: data.theoretical_hours || null,
    practical_hours: data.practical_hours || null,
    max_value: data.max_value || null,
    start_date: data.start_date
      ? dayjs(data.start_date).format("YYYY-MM-DD")
      : null,
    end_date: data.end_date ? dayjs(data.end_date).format("YYYY-MM-DD") : null,
    status: data.status || "pending",
    class_room: data.class_room_id || null,
    assistants: data.assistants || [],
    attendance_threshold: data.attendance_threshold,
  });

  return res.data as TaughtCourse;
}

export async function deleteTaughtCourse(id: number) {
  const res = await api.delete(`/faculty/taught-course/${id}/`);
  return res.data;
}

export async function updateTaughtCourse(
  id: number,
  data: Omit<
    TaughtCourse,
    | "id"
    | "teacher"
    | "academic_year"
    | "teaching_unit"
    | "period"
    | "available_course"
    | "faculty"
    | "departements"
    | "class_room"
    | "assistants"
  > & {
    teacher_id?: number;
    academic_year_id: number;
    teaching_unit_id?: number;
    period_id: number;
    available_course_id: number;
    faculty_id: number;
    departments_ids: number[];
    class_room_id?: number;
    assistants?: number[];
  }
) {
  const res = await api.put(`/faculty/taught-course/${id}/`, {
    teacher: data.teacher_id || null,
    academic_year: data.academic_year_id,
    teaching_unit: data.teaching_unit_id || null,
    period: data.period_id,
    available_course: data.available_course_id,
    faculty: data.faculty_id,
    departements: data.departments_ids,
    credit_count: data.credit_count || null,
    theoretical_hours: data.theoretical_hours || null,
    practical_hours: data.practical_hours || null,
    max_value: data.max_value || null,
    start_date: data.start_date
      ? dayjs(data.start_date).format("YYYY-MM-DD")
      : null,
    end_date: data.end_date ? dayjs(data.end_date).format("YYYY-MM-DD") : null,
    status: data.status || "pending",
    class_room: data.class_room_id || null,
    assistants: data.assistants || [],
    attendance_threshold: data.attendance_threshold
  });
  return res.data;
}

export function getTaughtCoursAsOptions(courses?: TaughtCourse[]) {
  return courses?.map((course) => {
    return {
      value: course.id,
      label: `${course.available_course.name} (${course.available_course.code})`,
    };
  });
}
