import api from "@/fetcher";
import { Faculty } from "@/types";

export async function getFaculties() {
  const res = await api.get(`/main_config/faculty/`);
  return res.data.results as Faculty[];
}