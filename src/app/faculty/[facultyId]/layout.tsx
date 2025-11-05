import { getAsignedFaculty, getServerSession } from "@/lib/api/auth";
import { redirect } from "next/navigation";
import { ClientFacultyLayout } from "./layout.client";

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ facultyId: string }>;
}>) {
  const {facultyId}=await params
  const session = await getServerSession();
  const faculty = await getAsignedFaculty();

  const isSuperuser = session?.user?.is_superuser;
  const isAssignedToFaculty = faculty && facultyId === faculty.id.toString();

  if (!isSuperuser && !isAssignedToFaculty) {
    redirect("/");
  }

  return <ClientFacultyLayout>{children}</ClientFacultyLayout>;
}
