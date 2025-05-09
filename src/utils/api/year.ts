import api from "@/fetcher";
import { Year } from "@/types";

export async function getYears() {
  const res = await api.get(`/main_config/academic-year/`);
  return res.data.results as Year[];
}