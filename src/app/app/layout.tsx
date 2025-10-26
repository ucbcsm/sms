"use client";

import { AppsButton } from "@/components/appsButton";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { SupportDrawer } from "@/components/support-drawer";
import { UserProfileButton } from "@/components/userProfileButton";
import { YearSelector } from "@/components/yearSelector";
import { useInstitution } from "@/hooks/use-institution";
import { useYid } from "@/hooks/use-yid";
import { getFaculties } from "@/lib/api";
import { logout } from "@/lib/api/auth";
import {
  BranchesOutlined,
  DashboardOutlined,
  DollarOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MenuOutlined,
  NotificationOutlined,
  SettingOutlined,
  SubnodeOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Image,
  Layout,
  Menu,
  message,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoadingLogout, setIsLoadingLogout] = useState<boolean>(false);
  const { removeYid } = useYid();
  const { data: institution } = useInstitution();

  const router = useRouter();
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
    }));
    return facaltiesAsMenu;
  };

  return (
    <Layout>
      {contextHolder}
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
        <Link href="/app" style={{ display: "flex", alignItems: "center" }}>
          <div className="flex items-center pr-3">
            <Image src="/ucbc-logo.png" alt="Logo" width={36} preview={false} />
          </div>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            {institution?.acronym}
          </Typography.Title>
        </Link>
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
            // {
            //   key: "/app/enrollments",
            //   label: <Link href={`/app/enrollments`}>Inscriptions</Link>,
            //   icon: <SafetyCertificateOutlined />,
            // },
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
              key: "/app/finances",
              label: <Link href={`/app/finances`}>Finances</Link>,
              icon: <DollarOutlined />,
            },
            {
              key: "fields",
              label: "Filières",
              icon: <BranchesOutlined />,
              children: getFacultiesAsMenu(),
            },
            {
              key: "7",
              label: "Autres",
              children: [
                {
                  key: "/app/announcements",
                  label: <Link href={`/app/announcements`}>Annonces</Link>,
                  icon: <NotificationOutlined />,
                },
                {
                  key: "/console",
                  label: <Link href={`/console`}>Paramètres</Link>,
                  icon: <SettingOutlined />,
                },
              ],
            },
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          // onClick={({ key }) => {
          //   router.push(key);
          // }}
        />
        <Space>
          <YearSelector />
          <LanguageSwitcher />
          <SupportDrawer />
          <Link href="/console">
            <Button
              type="text"
              title="Console d'administration"
              icon={<SettingOutlined />}
            />
          </Link>
          <AppsButton />
          <UserProfileButton />
        </Space>
      </Layout.Header>
      <Layout.Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
          <div
            className=""
            style={{
              display: isLoadingLogout ? "flex" : "none",
              flexDirection: "column",
              background: "#fff",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 99,
              height: "100vh",
              width: "100%",
            }}
          >
            <div
              style={{
                width: 440,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
              <Typography.Title
                type="secondary"
                level={3}
                style={{ marginTop: 10 }}
              >
                Déconnexion en cours ...
              </Typography.Title>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}
