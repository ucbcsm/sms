"use client";

import {
  DashboardOutlined,
  MenuOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  Image,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
} from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import { SupportDrawer } from "@/components/support-drawer";
import { AppsButton } from "@/components/appsButton";
import { UserProfileButton } from "@/components/userProfileButton";
import { useInstitution } from "@/hooks/use-institution";
import { getPublicR2Url } from "@/lib/utils";

export default function TeacherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { data: institution } = useInstitution();

  const pathname = usePathname();

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
            <Link href="/t-space" style={{ display: "flex", alignItems: "center" }}>
              <div className="flex items-center pr-3">
                <Image
                  src={getPublicR2Url(institution?.logo) || undefined}
                  alt="Logo"
                  height={36}
                  width="auto"
                  preview={false}
                />
              </div>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {institution?.acronym}
              </Typography.Title>
            </Link>
          </Space>
          <Menu
            mode="horizontal"
            theme="light"
            defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            overflowedIndicator={<MenuOutlined />}
            items={[
              {
                key: `/t-space`,
                label: <Link href={`/t-space`}>Aperçu</Link>,
                icon: <DashboardOutlined />,
              },
              {
                key: `/t-space/courses/`,
                label: <Link href={`/t-space/courses/`}>Cours</Link>,
                icon: <ReadOutlined />,
                disabled:true
              },
            ]}
            style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          />
          <Space>
            <YearSelector />
            <LanguageSwitcher />
            <SupportDrawer />
            <AppsButton />
            <UserProfileButton />
          </Space>
        </Layout.Header>
        <Layout.Content
         
        >
          {children}
        </Layout.Content>
      </Layout>
  );
}
