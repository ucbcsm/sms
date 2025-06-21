import { checkInstitutionExistence } from "@/lib/api";
import { LoginForm } from "./form";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/api/auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const callback = (await searchParams).callback;
  const exists = await checkInstitutionExistence();
  const auth = await getServerSession();

  if (!exists) {
    redirect("/config");
  }

  if (auth?.user && typeof auth.faculty === "undefined") {
    redirect(callback || "/app");
  } else if (auth?.user && typeof auth.faculty?.id === "number") {
    redirect(callback || `/app/faculty/${auth.faculty.id}`);
  }

  return <LoginForm />;
}
