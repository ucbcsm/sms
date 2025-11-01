import { getAsignedFaculty } from "@/lib/api/auth";
import { redirect } from "next/navigation";

export default async function Page() {
   const faculty = await getAsignedFaculty();
  
      if (!faculty) {
        redirect("/");
      }
      redirect(`/faculty/${faculty.id}`);
}