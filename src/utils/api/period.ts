import api from "@/fetcher";
import { Period } from "@/types";
import dayjs from "dayjs";

export async function getPeriods() {
  const res = await api.get(`/main_config/period/`);
  return res.data.results as Period[];
}

export async function createPeriod(params: Omit<Period, "id">) {
  const res = await api.post(`/main_config/period/`, {
    // cycle: Cycle,
    // academic_year: Year,
    name: params.name,
    acronym: params.acronym,
    type_of_period: params.type_of_period,
    order_number: params.order_number,
    start_date: dayjs(params.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(params.end_date).format("YYYY-MM-DD"),
    max_value: params.max_value,
    status: params.status,
  });
  return res.data;
}

export async function updatePeriod({
  id,
  params,
}: {
  id: number;
  params: Partial<Period>;
}) {
  const res = await api.put(`/main_config/period/${id}/`, {
    // cycle: Cycle,
    // academic_year: Year,
    name: params.name,
    acronym: params.acronym,
    type_of_period: params.type_of_period,
    order_number: params.order_number,
    start_date: dayjs(params.start_date).format("YYYY-MM-DD"),
    end_date: dayjs(params.end_date).format("YYYY-MM-DD"),
    max_value: params.max_value,
    status: params.status,
  });
  return res.data;
}

export async function deletePeriod(id: number) {
  const res = await api.delete(`/main_config/period/${id}/`);
  return res.data;
}
