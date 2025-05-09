import { checkInstitutionExistence } from "@/utils";
import {LoginForm} from "./form";
import { redirect } from "next/navigation";

export default async function Page() {
  const exists = await checkInstitutionExistence();
  if (!exists) {
    redirect("/config");
  }
  return <LoginForm />;
}
