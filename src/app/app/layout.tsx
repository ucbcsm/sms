"use client";

import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import {
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  NotificationOutlined,
  QuestionOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space, theme, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary, colorBorderSecondary },
  } = theme.useToken();

  const router = useRouter();

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
        <Typography.Title level={5} style={{marginBottom:0}}>CI-UCBC</Typography.Title>
        <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "/app", label: "Dashboard", icon: <DashboardOutlined /> },
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
                { key: "/app/announcements", label: "Annonces", icon:<NotificationOutlined /> },
                { key: "/app/rooms", label: "Salles de classe", icon:<TagsOutlined/> },
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
          <Link href="/console">
            <Button type="text" icon={<SettingOutlined />} />
          </Link>
          <Link href="/app/support">
            <Button type="text" icon={<QuestionOutlined />}></Button>
          </Link>
          <LanguageSwitcher />
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
            <Avatar
              className=" text-inherit bg-transparent"
              icon={<UserOutlined />}
              src={undefined}
              style={{ background: colorPrimary }}
            />
          </Dropdown>
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
