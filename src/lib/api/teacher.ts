import { Teacher } from "@/types";
import api from "../fetcher";

export async function getTeachers() {
  const res = await api.get(`/faculty/teachers/`);
  return res.data.results as Teacher[];
}

export async function getTeacher(id: number) {
  const res = await api.get(`/faculty/teachers/${id}/`);
  return res.data as Teacher;
}
export async function createTeacher(params: Omit<Teacher, "id">) {
  const res = await api.post(`/faculty/teachers/`, params);
  return res.data;
}

export async function updateTeacher({
  id,
  params,
}: {
  id: number;
  params: Partial<Omit<Teacher, "id">>;
}) {
  const res = await api.patch(`/faculty/teachers/${id}/`, {
    ...params,
  });
  return res.data;
}
