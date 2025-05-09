import api from "@/fetcher";
import { Class } from "@/types";

export async function getClasses() {
  const res = await api.get(`/main_config/class-year/`);
  return res.data.results as Class[];
}