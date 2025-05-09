import api from "@/fetcher";
import { Department } from "@/types";

export async function getDepartments() {
  const res = await api.get(`/main_config/departement/`);
  return res.data.results as Department[];
}