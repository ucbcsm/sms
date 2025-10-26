"use client";

import { AppsButton } from "@/components/appsButton";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { SupportDrawer } from "@/components/support-drawer";
import { UserProfileButton } from "@/components/userProfileButton";
import { YearSelector } from "@/components/yearSelector";
import { useInstitution } from "@/hooks/use-institution";
import { getDepartmentsByFacultyId, getFaculty } from "@/lib/api";
import { MenuOutlined, SubnodeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Divider, Form, Image, Layout, Menu, Skeleton, Space, theme, Typography } from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function FacultyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  } = theme.useToken();

  const { facultyId } = useParams();
  const { data: institution } = useInstitution();

  const {
    data: faculty,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["faculty", facultyId],
    queryFn: ({ queryKey }) => getFaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const router = useRouter();
  const pathname = usePathname();

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const getDepartmentsAsMenu = () => {
    const menu = departments?.map((dep) => ({
      key: `/faculty/${dep.faculty.id}/department/${dep.id}`,
      label: (
        <Link href={`/faculty/${dep.faculty.id}/department/${dep.id}`}>
          {dep.name}
        </Link>
      ),
      icon: <SubnodeOutlined />,
    }));
    return menu;
  };

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <Space>
          <Link
            href={`/faculty/${facultyId}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="flex items-center pr-3">
              <Image
                src={institution?.logo || "/ucbc-logo.png"}
                alt="Logo"
                width={36}
                height="auto"
                preview={false}
              />
            </div>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {institution?.acronym}
            </Typography.Title>
          </Link>
          <Divider type="vertical" />
          <Typography.Text type="secondary">Filière:</Typography.Text>

          {!isPending ? (
            <Typography.Text>
              {faculty?.acronym}
            </Typography.Text>
          ) : (
            <Form>
              <Skeleton.Input active />
            </Form>
          )}
        </Space>

        {/* <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MenuOutlined />}
          items={[
            {
              key: `/faculty/${facultyId}`,
              label: "Aperçu",
            },
            { key: `/faculty/${facultyId}/students`, label: "Étudiants" },
            {
              key: `/faculty/${facultyId}/taught-courses`,
              label: "Cours",
            },
            {
              key: `/faculty/${facultyId}/courses`,
              label: "Catalogue",
            },
            {
              key: `departments`,
              label: "Mentions",
              //  icon: <BranchesOutlined />,
              children: getDepartmentsAsMenu(),
            },
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          onClick={({ key }) => {
            router.push(key);
          }}
        /> */}
        <div className="flex-1" />
        <Space>
          <YearSelector />

          <LanguageSwitcher />
          <SupportDrawer />
          <AppsButton />
          <UserProfileButton />
        </Space>
      </Layout.Header>
      <Layout>
        <Layout.Sider
          width={260}
          style={{
            borderRight: `1px solid ${colorBorderSecondary}`,
            paddingTop: 20,
            background: colorBgContainer,
            height: `calc(100vh - 64px)`,
            overflow: "auto",
          }}
        >
          <Layout style={{}}>
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
                    {
                      key: `/faculty/${facultyId}`,
                      label: <Link href={`/faculty/${facultyId}`}>Aperçu</Link>,
                    },
                    {
                      key: `/faculty/${facultyId}/students`,
                      label: (
                        <Link href={`/faculty/${facultyId}/students`}>
                          Étudiants
                        </Link>
                      ),
                    },
                    {
                      key: `/faculty/${facultyId}/taught-courses`,
                      label: (
                        <Link href={`/faculty/${facultyId}/taught-courses`}>
                          Cours planifiés
                        </Link>
                      ),
                    },
                    {
                      key: `/faculty/${facultyId}/courses`,
                      label: (
                        <Link href={`/faculty/${facultyId}/courses`}>
                          Catalogue & UE
                        </Link>
                      ),
                    },
                    {
                      key: `departments`,
                      label: "Mentions",
                      //  icon: <BranchesOutlined />,
                      children: getDepartmentsAsMenu(),
                    },
                    {
                      key: `/faculty/${facultyId}/class-presidents`,
                      label: (
                        <Link href={`/faculty/${facultyId}/class-presidents`}>
                          Chefs de promotion
                        </Link>
                      ),
                    },
                    {
                      key: `/faculty/${facultyId}/courses-to-retake`,
                      label: (
                        <Link href={`/faculty/${facultyId}/courses-to-retake`}>
                          Cours à reprendre
                        </Link>
                      ),
                    },
                  ],
                },
              ]}
              // style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
              // onClick={({ key }) => {
              //   router.push(key);
              // }}
            />

            {/* {
                      key: "/console/classrooms",
                      label: "Salles de classe",
                      icon: <TagsOutlined />,
                      className: "normal-case",
                    },
                {
                  key: "/console/users",
                  label: "Utilisateurs",
                  icon: <TeamOutlined />,
                },
              ]}
              onClick={({ key }) => {
                router.push(key);
              }}
            /> */}
            {/* <Layout.Footer
              style={{
                padding: "20px 16px",
                borderTop: `1px solid ${colorBorderSecondary}`,
                background: colorBgContainer,
              }}
            >
              <Typography.Text type="secondary">
                © 2025 CI-UCBC. Tous droits réservés.
              </Typography.Text>
            </Layout.Footer> */}
          </Layout>
        </Layout.Sider>
        <Layout.Content>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MenuOutlined />}
          items={[
            {
                  key: `/`,
                  label: "Menu",
                  type: "group",
                  children:[
            {
              key: `/faculty/${facultyId}`,
              label: "Aperçu",
            },
            { key: `/faculty/${facultyId}/students`, label: "Étudiants" },
            {
              key: `/faculty/${facultyId}/taught-courses`,
              label: "Cours",
            },
            {
              key: `/faculty/${facultyId}/courses`,
              label: "Catalogue",
            },
            {
              key: `departments`,
              label: "Mentions",
              //  icon: <BranchesOutlined />,
              children: getDepartmentsAsMenu(),
            },]
          }
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          onClick={({ key }) => {
            router.push(key);
          }}
        /> */}
            {children}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
