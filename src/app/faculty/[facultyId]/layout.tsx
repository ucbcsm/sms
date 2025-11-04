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

  if (!faculty || !session?.user?.is_superuser || facultyId !== faculty.id.toString()) {
    redirect("/");
  }

  return <ClientFacultyLayout>{children}</ClientFacultyLayout>;
}

