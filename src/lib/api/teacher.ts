import { Teacher } from "@/types";
import api from "../fetcher";
import { updateUser } from "./user";

export async function getTeachers() {
  const res = await api.get(`/faculty/teachers/`);
  return res.data.results as Teacher[];
}

export async function getTeacher(id: number) {
  const res = await api.get(`/faculty/teachers/${id}/`);
  return res.data as Teacher;
}
export async function createTeacher(
  params: Omit<
    Teacher,
    "id" | "user" | "assigned_departements" | "assigned_faculties"
  > & {
    is_permanent_teacher: boolean;
    assigned_departements: number[];
    assigned_faculties: number[];
    first_name: string;
    last_name: string;
    surname: string;
    email: string;
    origin: string;
    religious_affiliation: string;
    physical_ability: "normal" | "disabled";
    avatar:string|null
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
  params: Partial<
    Omit<
      Teacher,
      "id" | "user" | "assigned_departements" | "assigned_faculties"
    >
  > & {
    assigned_departements: number[];
    assigned_faculties: number[];
    user: {
      id: number;
      first_name: string;
      last_name: string;
      surname: string;
      email: string;
      religious_affiliation: string;
      physical_ability: "normal" | "disabled";
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
