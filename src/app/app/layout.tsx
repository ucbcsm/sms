"use client";

import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import {
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  MoreOutlined,
  NotificationOutlined,
  QuestionOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Image,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorBorderSecondary,
    },
  } = theme.useToken();

  const router = useRouter();
  const pathname=usePathname()

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
        <Link href="/app" style={{ display: "flex", alignItems: "center" }}>
        <div className="flex items-center pr-3">
         <Image
          src="/ucbc-logo.png"
           alt="Logo ucbc"
           width={36}
           preview={false}
          />
          </div>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          CI-UCBC
        </Typography.Title>
        </Link>
        <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          overflowedIndicator={<MoreOutlined />}
          items={[
            { 
              key: "/app", 
              label: "Tableau de bord", 
              icon: <DashboardOutlined />,
            },
            {
              key: "/app/students",
              label: "Etudiants",
              icon: <UsergroupAddOutlined />,
            },
            { key: "/app/staff", label: "Enseigants", icon: <TeamOutlined /> },
            {
              key: "/app/finances",
              label: "Finances",
              icon: <DollarOutlined />,
            },
            {
              key: "/app/jurys",
              label: "Jurys",
              icon: <SafetyCertificateOutlined />,
            },
            {
              key: "7",
              label: "Autres",
              children: [
                {
                  key: "/app/announcements",
                  label: "Annonces",
                  icon: <NotificationOutlined />,
                },
                {
                  key: "/console",
                  label: "Paramètres",
                  icon: <SettingOutlined />,
                },
              ],
            },
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          onClick={({ key }) => {
            router.push(key);
          }}
        />
        <Space>
          <YearSelector />
          <Dropdown
            menu={{
              items: [
                {
                  key: "/app/profile",
                  label: "Mon profile",
                  icon: <UserOutlined />,
                },
                {
                  type: "divider",
                },
                { key: "", label: "Déconnexion", icon: <LogoutOutlined /> },
              ],
              onClick: ({ key }) => {},
            }}
            trigger={["hover"]}
            destroyPopupOnHide={true}
          >
            <Button type="text" icon={<UserOutlined />} />
          </Dropdown>
          <Link href="/console">
            <Button type="text" icon={<SettingOutlined />} />
          </Link>
          <Link href="/app/support">
            <Button type="text" icon={<QuestionOutlined />}></Button>
          </Link>
          <LanguageSwitcher />
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
        </div>
      </Layout.Content>
      {/* <Layout.Footer style={{ textAlign: "center" }}>
        © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
      </Layout.Footer> */}
    </Layout>
  );
}
