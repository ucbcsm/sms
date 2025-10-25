"use client";

import { getYearEnrollment } from "@/lib/api";
import { MenuOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Layout, Menu, Space, theme, Typography } from "antd";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { studentId } = useParams();
    const pathname = usePathname();
  
    // const {
    //   data: enrolledStudent,
    //   isPending,
    //   isError,
    // } = useQuery({
    //   queryKey: ["enrollment", studentId],
    //   queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    //   enabled: !!studentId,
    // });
  return (
    <Layout>
      {/* <Layout.Header
        style={{
          background: colorBgContainer,
          padding: "0 28px",
          borderBottom: `1px solid ${colorBorderSecondary}`,
        }}
      >
        <Space>
          <Typography.Title
            //   type="secondary"
            level={5}
            style={{ marginBottom: 16 }}
          >
            Parcours académique
          </Typography.Title>
        </Space>
      </Layout.Header> */}
      <Layout>
        {/* <Layout.Sider
          width={260}
          style={{
            borderRight: `1px solid ${colorBorderSecondary}`,
            paddingTop: 20,
            background: colorBgContainer,
            height: `calc(100vh - 174px)`,
            overflow: "auto",
          }}
        >
          <Menu
            mode="inline"
            theme="light"
            style={{ height: "100%", borderRight: 0 }}
            defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            overflowedIndicator={<MenuOutlined />}
            items={[
              {
                key: `/`,
                label: "Menu",
                type: "group",
                children: [
                  // { key: "courses", label: "Cours", children: <CoursesTab /> },
                  {
                    key: `/student/${studentId}/path`,
                    label: (
                      <Link href={`/student/${studentId}/path`}>
                        Relevé de notes
                      </Link>
                    ),
                  },
                  {
                    key: `/student/${studentId}/path/attendance`,
                    label: (
                      <Link href={`/student/${studentId}/path/attendance`}>
                        Attestation de fréquentation
                      </Link>
                    ),
                  },
                ],
              },
            ]}
          />
        </Layout.Sider> */}
        <Layout.Content style={{ background: colorBgContainer }}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
