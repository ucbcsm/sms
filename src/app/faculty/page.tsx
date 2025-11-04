import { getAsignedFaculty, getServerSession } from "@/lib/api/auth";
import { redirect } from "next/navigation";
import { FacultiesClientPage } from "./_components/facultiesClientPage";

export default async function Page() {
  const session = await getServerSession();
  const faculty = await getAsignedFaculty();

  if (faculty) {
    redirect(`/faculty/${faculty.id}`);
  }

  if (!session?.user?.is_superuser) {
    redirect("/");
  }
  return <FacultiesClientPage />;
}
