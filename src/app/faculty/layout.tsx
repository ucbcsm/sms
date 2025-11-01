import { getAsignedFaculty } from "@/lib/api/auth";
import { redirect } from "next/navigation";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const faculty = await getAsignedFaculty();

    if (!faculty) {
      redirect("/");
    }
  return <>{children}</>;
}
