import { authApi } from "@/fetcher";
import { User } from "@/types";

export async function getUsers() {
  const res = await authApi.get(`/users/`);
  return res.data as User[];
}

export async function updateUser({
  id,
  params,
}: {
  id: number;
  params: Omit<User, "id">;
}) {
  const res = await authApi.put(`/users/${id}`, {
    ...params,
  });

  return res.data;
}

export async function deleteUser(id: number) {
  const res = await authApi.delete(`/users/${id}/`);
  return res.data;
}
