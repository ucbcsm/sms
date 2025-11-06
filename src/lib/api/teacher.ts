import { Teacher } from "@/types";
import api from "../fetcher";
import { updateUser } from "./user";

export async function getTeachers(searchParams: {
  search?: string;
  gender?: "M" | "F";
  is_permanent_teacher?:boolean
  page?:number,
  page_size?:number
}) {
  const { gender, search, is_permanent_teacher, page, page_size } =
    searchParams;
  const query = new URLSearchParams();
  if (gender !== undefined) {
    query.append("gender", gender.toString());
  }
  if (search !== undefined) {
    query.append("search", search.toString());
  }
  if (is_permanent_teacher !== undefined) {
    query.append("is_permanent_teacher", String(is_permanent_teacher));
  }
  if(page!==undefined){
    query.append("page", page.toString())
  }
  if(page_size!==undefined){
    query.append("page_size", page_size.toString());
  }
  const res = await api.get(`/faculty/teachers/?${query.toString()}`);
  return res.data as {
    results: Teacher[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

export async function getAllTeachers() {
  const res = await api.get(`/faculty/teachers/?get_all=true`);
  return res.data as Teacher[];
}

export async function getTeachersByFaculty(facultyId: number) {
  const res = await api.get(
    `/faculty/teachers/?assigned_faculties__id=${facultyId}`
  );
  return res.data.results as Teacher[];
}

export async function getTeacher(id: number) {
  const res = await api.get(`/faculty/teachers/${id}/`);
  return res.data as Teacher;
}
export async function createTeacher(
  params: Omit<
    Teacher,
    "id" | "user"
    //  | "assigned_departements" | "assigned_faculties"
  > & {
    is_permanent_teacher: boolean;
    gender: "M" | "F";
    // assigned_departements: number[];
    // assigned_faculties: number[];
    matricule?: string;
    first_name: string;
    last_name: string;
    surname: string;
    email: string;
    avatar: string | null;
    pending_avatar: string | null;
  }
) {
  const res = await api.post(`/faculty/teachers/`, params);
  return res.data;
}

export async function updateTeacher({
  id,
  params,
}: {
  id: number;
  params: Partial<Omit<Teacher, "id" | "user">> & {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      surname: string;
      email: string;
      avatar: string | null;
      pending_avatar: string | null;
      matricule: string;
      gender: "M" | "F";
      is_permanent_teacher: boolean;
      is_active: boolean;
      is_staff: boolean;
      is_student: boolean;
      is_superuser: boolean;
      groups: number[];
      roles: number[];
      user_permissions: number[];
      last_login: string;
      date_joined: string;
      username: string | "";
    };
  };
}) {
  const res = await api.put(`/faculty/teachers/${id}/`, {
    ...params,
    user: params.user.id,
  });
  await updateUser({ id: params.user.id, params: { ...params.user } });
  return res.data;
}

export function getTeachersAsOptions(teachers?: Teacher[]) {
  return teachers?.map((teacher) => {
    return {
      value: teacher.id,
      label: `${teacher.user.surname} ${teacher.user.last_name} ${teacher.user.first_name} (${teacher.user.matricule})`,
      disabled: !teacher.user.is_active,
    };
  });
}

export async function getTeacherDashboard(yearId: number, teacherId: number) {
  const res = await api.get(
    `/teacher/teacher-dashboard/?academic_year__id=${yearId}&teacher__id=${teacherId}`
  );

  return res.data as {
    taught_course_count: number;
  };
}

export async function getTeachersDashboard() {
  const res = await api.get(`/faculty/teachers-dashboard/`);
  return res.data as {
    teachers_count: 2;
    guest_teacher_count: 0;
    permanent_teacher_count: 0;
    male_count: 2;
    female_count: 0;
    actif_count: 2;
    inactif_count: 0;
  };
}
