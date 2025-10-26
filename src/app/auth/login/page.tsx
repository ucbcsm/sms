import { LoginForm } from "./form";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
