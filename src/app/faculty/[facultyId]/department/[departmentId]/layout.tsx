"use client";

import {
  Form,
  Layout,
  Menu,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getDepartment } from "@/lib/api";
import Link from "next/link";

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const { facultyId, departmentId } = useParams();
  const pathname = usePathname();

  const {
    data: department,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ queryKey }) => getDepartment(Number(queryKey[1])),
    enabled: !!departmentId,
  });
  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          // background: colorBgContainer,
          // overflowY: "auto",
          // height: "calc(100vh - 64px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f5f5f5",
            padding: 0,
          }}
        >
          <Space>
            {/* <BackButton /> */}
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {department?.name} (Mention)
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            {/* <Palette /> */}
          </Space>
        </Layout.Header>
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={[
            {
              key: `/faculty/${facultyId}/department/${departmentId}`,
              label: (
                <Link href={`/faculty/${facultyId}/department/${departmentId}`}>
                  Aperçu
                </Link>
              ),
            },
            {
              key: `/faculty/${facultyId}/department/${departmentId}/students`,
              label: (
                <Link
                  href={`/faculty/${facultyId}/department/${departmentId}/students`}
                >
                  Étudiants
                </Link>
              ),
            },
            // {
            //   key: `/faculty/${facultyId}/department/${departmentId}/classes`,
            //   label: "Promotions",
            // },
            {
              key: `/faculty/${facultyId}/department/${departmentId}/programs`,
              label: (
                <Link
                  href={`/faculty/${facultyId}/department/${departmentId}/programs`}
                >
                  Programmes
                </Link>
              ),
            },
            // {
            //   key: `/faculty/${facultyId}/department/${departmentId}/taught-courses`,
            //   label: (
            //     <Link
            //       href={`/faculty/${facultyId}/department/${departmentId}/taught-courses`}
            //     >
            //       Cours planifiés
            //     </Link>
            //   ),
            // },
            // {
            //   key: `/faculty/${facultyId}/department/${departmentId}/teachers`,
            //   label: "Enseignants",
            // },
          ]}
        />
        <div
          style={{
            // overflowY: "auto",
            // height: "calc(100vh - 174px)",
            paddingTop: 16,
            background:colorBgLayout
          }}
        >
          {children}
          {/* <Layout.Footer
            style={{
              display: "flex",
              background: colorBgContainer,
              padding: "24px 0",
            }}
          >
            <Typography.Text type="secondary">
              © {new Date().getFullYear()} UCBC. Tous droits réservés.
            </Typography.Text>
            <div className="flex-1" />
            <Space>
              <Palette />
            </Space>
          </Layout.Footer> */}
        </div>
      </Layout.Content>
    </Layout>
  );
}
