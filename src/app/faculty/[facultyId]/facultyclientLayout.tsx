"use client";

import { AppsButton } from "@/components/appsButton";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { SupportDrawer } from "@/components/support-drawer";
import { UserProfileButton } from "@/components/userProfileButton";
import { YearSelector } from "@/components/yearSelector";
import { useInstitution } from "@/hooks/use-institution";
import { getDepartmentsByFacultyId, getFaculty } from "@/lib/api";
import { getPublicR2Url } from "@/lib/utils";
import {
  AppstoreOutlined,
  BookOutlined,
  BranchesOutlined,
  CrownOutlined,
  DashboardOutlined,
  MenuOutlined,
  RedoOutlined,
  SubnodeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Divider,
  Form,
  Image,
  Layout,
  Menu,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

export function ClientFacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                src={getPublicR2Url(institution?.logo) || undefined}
                alt="Logo"
                width="auto"
                height={36}
                preview={false}
              />
            </div>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {institution?.acronym}
            </Typography.Title>
          </Link>
          <Divider orientation="vertical" />
          <Typography.Title
            level={5}
            type="secondary"
            style={{ marginBottom: 0 }}
          >
            Filière:
          </Typography.Title>

          {!isPending ? (
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {faculty?.acronym}
            </Typography.Title>
          ) : (
            <Form>
              <Skeleton.Input active />
            </Form>
          )}
        </Space>

        <div className="flex-1" />
        <Space>
          <YearSelector />

          <LanguageSwitcher />
          <SupportDrawer />
          <AppsButton />
          <UserProfileButton />
        </Space>
      </Layout.Header>
      <div>
        <Menu
          mode="horizontal"
          theme="light"
          style={{ height: "100%", borderRight: 0 }}
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MenuOutlined />}
          items={[
            {
              key: `/faculty/${facultyId}`,
              label: <Link href={`/faculty/${facultyId}`}>Aperçu</Link>,
              icon: <DashboardOutlined />,
            },
            {
              key: `/faculty/${facultyId}/students`,
              label: (
                <Link href={`/faculty/${facultyId}/students`}>Étudiants</Link>
              ),
              icon: <TeamOutlined />,
            },
            {
              key: `/faculty/${facultyId}/taught-courses`,
              label: (
                <Link href={`/faculty/${facultyId}/taught-courses`}>
                  Cours planifiés
                </Link>
              ),
              icon: <BookOutlined />,
            },
            {
              key: `/faculty/${facultyId}/courses`,
              label: (
                <Link href={`/faculty/${facultyId}/courses`}>
                  Catalogue & UE
                </Link>
              ),
              icon: <AppstoreOutlined />,
            },
            {
              key: `departments`,
              label: "Mentions",
              icon: <BranchesOutlined />,
              children: getDepartmentsAsMenu(),
            },
            {
              key: `/faculty/${facultyId}/class-presidents`,
              label: (
                <Link href={`/faculty/${facultyId}/class-presidents`}>
                  Chefs de promotion
                </Link>
              ),
              icon: <CrownOutlined />,
            },
            {
              key: `/faculty/${facultyId}/courses-to-retake`,
              label: (
                <Link href={`/faculty/${facultyId}/courses-to-retake`}>
                  Cours à reprendre
                </Link>
              ),
              icon: <RedoOutlined />,
            },
          ]}
          // style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          // onClick={({ key }) => {
          //   router.push(key);
          // }}
        />
      </div>

      <div>{children}</div>
    </Layout>
  );
}
