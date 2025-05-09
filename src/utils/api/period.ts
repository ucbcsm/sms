import api from "@/fetcher";
import { Period } from "@/types";

export async function getPeriods() {
  const res = await api.get(`/main_config/period/`);
  return res.data.results as Period[];
}