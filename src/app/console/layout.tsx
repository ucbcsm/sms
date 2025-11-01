import { getServerSession } from "@/lib/api/auth";
import { ClientConsoleLayout } from "./clientLayout";
import { redirect } from "next/navigation";

export default async function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();
  if(!session?.user?.is_superuser){
   redirect("/")
  }

  return (
    <ClientConsoleLayout>{children}</ClientConsoleLayout>
  );
}
