import { getServerSession } from "@/lib/api/auth";
import { Suspense } from "react";
import { HomeClient } from "./_components/homeClient";

export default async function Home() {
 const session= await getServerSession();

  return (
    <Suspense>
      <HomeClient
        apps={session?.apps || []}
        user={session?.user || null}
      />
    </Suspense>
  );
}
