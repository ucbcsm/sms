"use client";

import {
  MenuOutlined,
} from "@ant-design/icons";
import {
  Image,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import { SupportDrawer } from "@/components/support-drawer";
import { AppsButton } from "@/components/appsButton";
import { UserProfileButton } from "@/components/userProfileButton";
import { getPublicR2Url } from "@/lib/utils";
import { useInstitution } from "@/hooks/use-institution";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const { data: institution } = useInstitution();

  const pathname = usePathname();
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
        <Space>
          <Link
            href="/t-space"
            style={{ display: "flex", alignItems: "center" }}
          >
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
              key: `/s-space`,
              label: <Link href={`/s-space`}>Aperçu</Link>,
            },
            {
              key: `/s-space/courses/`,
              label: "Cours",
              disabled: true,
            },
            { key: "/s-space/fees", label: "Frais & Paiements", disabled: true },
            {
              key: `/s-space/programs`,
              label: "Programmes d'études",
              disabled: true,
            },
            {
              key: `/s-space/documents`,
              label: "Documents",
              disabled: true,
            },

            // {
            //   key: `/s-space/discipline`,
            //   label: "Discipline",
            //   disabled: true,
            // },
            { key: "/s-space/terms", label: "Règlement intérieur", disabled: true },
          ]}
          style={{ flex: 1, minWidth: 0, borderBottom: 0 }}
          onClick={({ key }) => {
            router.push(key);
          }}
        />
        <Space>
          <YearSelector />
          <LanguageSwitcher />
          <SupportDrawer />
          <AppsButton />
          <UserProfileButton />
        </Space>
      </Layout.Header>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
