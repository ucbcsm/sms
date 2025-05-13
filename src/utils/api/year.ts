import api from "@/fetcher";
import { Year } from "@/types";
import dayjs from "dayjs";

export async function getYears() {
  const res = await api.get(`/main_config/academic-year/`);
  return res.data.results as Year[];
}

export async function getYearById(id: number) {
  const res = await api.get(`/main_config/academic-year/${id}`);
  return res.data as Year;
}

export async function createYear(params: Omit<Year, "id">) {
  const res = await api.post(`/main_config/academic-year/`, {
    name: params.name,
    start_date: dayjs(params.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(params.end_date).format("YYYY-MM-DD"),
    status: params.status,
    university: null,
  });
  return res.data;
}

export async function updateYear({ id, params }: { id: number; params: Partial<Year> }) {
  const res = await api.put(`/main_config/academic-year/${id}/`, {
    name: params.name,
    start_date: dayjs(params.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(params.end_date).format("YYYY-MM-DD"),
    status: params.status,
    university: null,
  });
  return res.data;
}

export async function deleteYear(id: number) {
  const res = await api.delete(`/main_config/academic-year/${id}/`);
  return res.data;
}

    
export function getYearStatusName(
  status: "pending" | "progress" | "finished" | "suspended" | string
) {
  switch (status) {
    case "pending":
      return "En attente";
      break;
    case "progress":
      return "En cours";
      break;
    case "finished":
      return "Terminé";
      break;
    case "suspended":
      return "Suspendu";
      break;
    default:
      return "Inconnu";
  }
}

export function getYearsAsOptions(years?: Year[]) {
  return years?.map((year) => {
    return { value: year.id, label: year.name };
  });
}