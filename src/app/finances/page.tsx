"use client";

import {
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Card,
  Divider,
  Image,
  Layout,
  Radio,
  Space,
  theme,
  Typography,
} from "antd";
import { StaffList } from "./list";
import Link from "next/link";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { UserProfileButton } from "@/components/userProfileButton";
import { AppsButton } from "@/components/appsButton";
import { SupportDrawer } from "@/components/support-drawer";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { YearSelector } from "@/components/yearSelector";
import { useInstitution } from "@/hooks/use-institution";
import { getPublicR2Url } from "@/lib/utils";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { data: institution } = useInstitution();
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
            href={`/finances`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="flex items-center pr-3">
              <Image
                src={getPublicR2Url(institution?.logo) || undefined}
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
          <Typography.Text>Finances</Typography.Text>
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
      <Layout.Content
        style={{
          padding: "0 32px 24px 32px",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f5f5f5",
            padding: 0,
          }}
        >
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Finances
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            {
              key: "all",
              label: "Factures",
            },
            {
              key: "fees",
              label: "Frais",
            },
          ]}
        >
          <StaffList />
        </Card>
      </Layout.Content>
    </Layout>
  );
}
