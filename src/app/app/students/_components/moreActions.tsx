"use client";

import { usePrevPathname } from "@/hooks/usePrevPathname";
import {
  CloseOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DollarOutlined,
  FolderOutlined,
  MoreOutlined,
  RedoOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

type StudentMoreActionsDropdownProps = {
  studentYearId: number;
};

export const StudentMoreActionsDropdown: FC<
  StudentMoreActionsDropdownProps
> = ({ studentYearId }) => {
  const pathname = usePathname();
  const { setPathname } = usePrevPathname();
  return (
    <Dropdown
      arrow
      menu={{
        items: [
          {
            key: `/student/${studentYearId}`,
            label: <Link href={`/student/${studentYearId}`}>Aperçu</Link>,
            icon: <DashboardOutlined />,
          },
          {
            key: `/student/${studentYearId}/documents`,
            label: (
              <Link href={`/student/${studentYearId}/documents`}>
                Documents
              </Link>
            ),
            icon: <FolderOutlined />,
          },
          {
            key: `/student/${studentYearId}/path`,
            label: (
              <Link href={`/student/${studentYearId}/path`}>
                Rélevés de notes
              </Link>
            ),
            icon: <SolutionOutlined />,
          },
          {
            key: `/student/${studentYearId}/fees`,
            label: (
              <Link href={`/student/${studentYearId}/fees`}>
                Frais & Paiements
              </Link>
            ),
            icon: <DollarOutlined />,
          },
          {
            key: `/student/${studentYearId}/retake`,
            label: (
              <Link href={`/student/${studentYearId}/retake`}>
                Cours à reprendre
              </Link>
            ),
            icon: <RedoOutlined />,
          },
          {
            key: `/student/${studentYearId}/student-card`,
            label: (
              <Link href={`/student/${studentYearId}/student-card`}>
                Carte d&apos;étudiant
              </Link>
            ),
            icon: <ContactsOutlined />,
          },
          {
            type: "divider",
          },
          {
            key: `/student/${studentYearId}/danger-zone`,
            label: (
              <Link href={`/student/${studentYearId}/danger-zone`}>
                Supprimer
              </Link>
            ),
            icon: <CloseOutlined />,
            danger: true,
          },
        ],
        onClick: () => {
          setPathname(pathname);
        },
      }}
    >
      <Button type="text" icon={<MoreOutlined />} />
    </Dropdown>
  );
};
