import api from "@/fetcher";
import { Faculty } from "@/types";

export async function getFaculties() {
  const res = await api.get(`/main_config/faculty/`);
  return res.data.results as Faculty[];
}

export async function createFaculty(params: Omit<Faculty, "id">) {
  const res = await api.post(`/main_config/faculty/`, {
    name: params?.name,
    // field: Field,
    acronym: params.acronym,
  });
  return res.data;
}

export async function updateFaculty({
  id,
  params,
}: {
  id: number;
  params: Partial<Faculty>;
}) {
  const res = await api.put(`/main_config/faculty/${id}/`, {
    name: params?.name,
    // field: Field,
    acronym: params.acronym,
  });
  return res.data;
}

export async function deleteFaculty(id: number) {
  const res = await api.delete(`/main_config/faculty/${id}/`);
  return res.data;
}