"use client";

import { AppsButton } from "@/components/appsButton";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { SupportDrawer } from "@/components/support-drawer";
import { UserProfileButton } from "@/components/userProfileButton";
import { YearSelector } from "@/components/yearSelector";
import { useInstitution } from "@/hooks/use-institution";
import { getFaculties } from "@/lib/api";
import { getPublicR2Url } from "@/lib/utils";
import {
  BranchesOutlined,
  DashboardOutlined,
  DollarOutlined,
  MenuOutlined,
  NotificationOutlined,
  SettingOutlined,
  SubnodeOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Divider,
  Image,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { usePathname} from "next/navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  } = theme.useToken();
  const { data: institution } = useInstitution();

  const pathname = usePathname();

  const { data: faculties, isPending: isPendingFacalties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const getFacultiesAsMenu = () => {
    const facaltiesAsMenu = faculties?.map((fac) => ({
      key: `/faculty/${fac.id}`,
      label: <Link href={`/faculty/${fac.id}`}>{fac.name}</Link>,
      icon: <SubnodeOutlined />,
      disabled: isPendingFacalties,
    }));
    return facaltiesAsMenu;
  };

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        <Space>
          <Link href="/app" style={{ display: "flex", alignItems: "center" }}>
            <div className="flex items-center pr-3">
              <Image
                src={getPublicR2Url(institution?.logo) || undefined}
                alt="Logo"
                width={36}
                preview={false}
              />
            </div>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {institution?.acronym}
            </Typography.Title>
          </Link>
          <Divider type="vertical" />
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            Apparitorat
          </Typography.Title>
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
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MenuOutlined />}
          items={[
            {
              key: "/app",
              label: <Link href={`/app`}>Tableau de bord</Link>,
              icon: <DashboardOutlined />,
            },
            {
              key: "/app/students",
              label: <Link href={`/app/students`}>Étudiants</Link>,
              icon: <UsergroupAddOutlined />,
            },
            {
              key: "/app/teachers",
              label: <Link href={`/app/teachers`}>Enseigants</Link>,
              icon: <TeamOutlined />,
            },
            {
              key: "fields",
              label: "Filières",
              icon: <BranchesOutlined />,
              disabled: isPendingFacalties,
              children: getFacultiesAsMenu(),
            },
            // {
            //   key: "/app/finances",
            //   label: <Link href={`/finances`}>Finances</Link>,
            //   icon: <DollarOutlined />,
            // },
            {
              key: "/app/announcements",
              label: <Link href={`/app/announcements`}>Annonces</Link>,
              icon: <NotificationOutlined />,
            },
          ]}
          style={{}}
        />
      </div>
      <div
        style={{
          background: colorBgContainer,
          minHeight: 280,
          borderRadius: borderRadiusLG,
        }}
      >
        {children}
      </div>
    </Layout>
  );
}
