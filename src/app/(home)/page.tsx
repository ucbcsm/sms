import { getServerSession } from "@/lib/api/auth";
import { HomeClient } from "./_components/homeClient";

export default async function Home() {
 const session = await getServerSession();

  return (
      <HomeClient
        apps={session?.apps || []}
        user={session?.user || null}
      />
  )
}
