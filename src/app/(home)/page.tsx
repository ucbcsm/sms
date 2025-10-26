import { getServerSession } from "@/lib/api/auth";
import { Suspense } from "react";
import { HomeClient } from "./_components/homeClient";
import { ALL_APPS } from "@/lib/data/apps";



function roleLabel(role: string) {
  switch (role) {
    case "etudiant":
      return "Étudiant";
    case "enseignant":
      return "Enseignant";
    case "faculte":
      return "Faculté";
    case "apparitorat":
      return "Apparitorat";
    case "jury":
      return "Jury";
    case "finance":
      return "Finance";
    case "admin":
      return "Admin";
    default:
      return role;
  }
}

export default async function Home() {
  // Try to get session; fallback to a default role for demo if not available
  let userRoles: {
    id: number;
    name: string;
  }[] = [];
  try {
    const session = await getServerSession();
    // Expect session.user.roles to be string[] or a single string
    if (session?.user?.roles) {
      userRoles = Array.isArray(session.user.roles)
        ? session.user.roles
        : [session.user.roles];
    } else if (session?.user?.roles) {
      userRoles = session.user.roles;
    }
  } catch {
    // ignore and use fallback role
  }

  // Compute visible apps: apps that have at least one matching role
  const visibleApps = ALL_APPS;
  // .filter(app => app.roles.some(r => userRoles.includes(r.)) || userRoles.includes("admin"));

  return (
    <Suspense>
      <HomeClient visibleApps={visibleApps} userRoles={userRoles} />
    </Suspense>
  );
}
