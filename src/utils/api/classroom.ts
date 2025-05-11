import api from "@/fetcher";
import { Classroom } from "@/types";

export async function getClassrooms() {
  const res = await api.get(`/main_config/class-room/`);
  return res.data.results as Classroom[];
}

/**
 * Creates a new classroom by sending a POST request to the API.
 *
 * @param params - The classroom details excluding the `id` field.
 *   - `name`: The name of the classroom.
 *   - `room_type`: The type of the classroom (e.g., lecture hall, lab).
 *   - `capacity`: The maximum number of occupants the classroom can hold.
 *   - `code`: A unique code identifying the classroom.
 *   - `status`: The current status of the classroom (e.g., active, inactive).
 * 
 * @returns A promise that resolves to the data of the created classroom.
 * 
 * @throws An error if the API request fails.
 */
export async function createClassroom(params: Omit<Classroom, "id">) {
  const res = await api.post(`/main_config/class-room/`, {
    name: params.name,
    room_type: params.room_type,
    capacity: params.capacity,
    code: params.code,
    status: params.status,
  });
  return res.data;
}

export async function updateClassroom({
  id,
  params,
}: {
  id: number;
  params: Partial<Classroom>;
}) {
  const res = await api.put(`/main_config/class-room/${id}/`, {
    name: params.name,
    room_type: params.room_type,
    capacity: params.capacity,
    code: params.code,
    status: params.status,
  });
  return res.data;
}

export async function deleteClassroom(id: number) {
  const res = await api.delete(`/main_config/class-room/${id}/`);
  return res.data;
}
