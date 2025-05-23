import api from "@/lib/fetcher";
import { Department } from "@/types";

export async function getDepartments() {
  const res = await api.get(`/main_config/departement/`);
  return res.data.results as Department[];
}

export async function createDepartment(
  params: Omit<Department, "id" | "faculty"> & { faculty_id: number }
) {
  const res = await api.post(`/main_config/departement/`, {
    start_class_year: null,
    end_class_year: null, // To remove next time
    faculty: params.faculty_id,
    chair_person: null,
    name: params?.name,
    acronym: params.acronym,
  });
  return res.data;
}

export async function updateDepartment({
  id,
  params,
}: {
  id: number;
  params: Omit<Department, "id" | "faculty"> & { faculty_id: number };
}) {
  const res = await api.put(`/main_config/departement/${id}/`, {
    start_class_year: null,
    end_class_year: null, // To remove next time
    faculty: params.faculty_id,
    chair_person: null,
    name: params.name,
    acronym: params.acronym,
  });
  return res.data;
}

export async function deleteDepartment(id: number) {
  const res = await api.delete(`/main_config/departement/${id}/`);
  return res.data;
}

export function getCurrentDepartmentsAsOptions(departments?: Department[]) {
  return departments?.map((department) => {
    return { value: department.id, label: department.name };
  });
}
