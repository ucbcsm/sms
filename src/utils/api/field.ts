import api from "@/fetcher";
import { Field } from "@/types";

export async function getFields() {
  const res = await api.get(`/main_config/field/`);
  return res.data.results as Field[];
}