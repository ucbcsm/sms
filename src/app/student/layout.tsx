"use client";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  MonitorOutlined,
  QuestionOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  BookOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary, colorBorder },
  } = theme.useToken();

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorder}`,
        }}
      >
        <div className="Logo">CI-UCBC</div>
        <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", label: "Dashboard", icon: <DashboardOutlined /> },
            { key: "2", label: "Cours", icon: <BookOutlined/> },
            { key: "3", label: "Resultats", icon: <BarChartOutlined /> },
            { key: "4", label: "Finances", icon: <DollarOutlined /> },
            { key: "5", label: "Demandes", icon: <FileTextOutlined /> },
            {
              key: "7",
              label: "Autres",
              children: [
                { key: "8", label: "Evennements" },
                { key: "9", label: "Annonces" },
              ],
            },
          ]}
          style={{ flex: 1, minWidth: 0 , borderBottom:0}}
        />
        <Space>
          <YearSelector/>
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
              style={{background:colorPrimary}}
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