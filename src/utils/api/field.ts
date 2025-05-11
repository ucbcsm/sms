import api from "@/fetcher";
import { Field } from "@/types";

export async function getFields() {
  const res = await api.get(`/main_config/field/`);
  return res.data.results as Field[];
}

export async function createField(params: Omit<Field, "id">) {
  const res = await api.post(`/main_config/field/`, {
    //  cycle: Cycle,
    name: params.name,
    acronym: params.acronym,
  });
  return res.data;
}

export async function updateField({
  id,
  params,
}: {
  id: number;
  params: Partial<Field>;
}) {
  const res = await api.put(`/main_config/field/${id}/`, {
    //  cycle: Cycle,
     name: params.name,
     acronym: params.acronym,
  });
  return res.data;
}

export async function deleteField(id: number) {
  const res = await api.delete(`/main_config/field/${id}/`);
  return res.data;
}