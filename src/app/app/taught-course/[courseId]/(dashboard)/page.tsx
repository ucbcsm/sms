"use client";

import { Card } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";


export default function Page() {

  const { courseId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
   <div>
    yo
   </div>
  );
}
