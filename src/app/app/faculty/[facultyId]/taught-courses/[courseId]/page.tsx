"use client";

import { Card } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";


export default function Page() {

  const { courseId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Card
      tabList={[
        {
          key: `/app/taught-course/${courseId}`,
          label: "Aperçu",
        },
        { key: `/app/taught-course/${courseId}/students`, label: "Étudiants" },
        {
          key: `/app/taught-course/${courseId}/departments`,
          label: "Présences",
        },
        {
          key: `/app/taught-course/${courseId}/taught-courses`,
          label: "Suivi des heures",
        },
        {
          key: `/app/taught-course/${courseId}/courses`,
          label: "Notes",
        },
        {
          key: `/app/taught-course/${courseId}/teachers`,
          label: "Evaluations",
        },
      ]}
      defaultActiveTabKey={pathname}
      activeTabKey={pathname}
      onTabChange={(key) => {
        router.push(key);
      }}
    >
      yo
    </Card>
  );
}
