"use client";

import { AppsButton } from "@/components/appsButton";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { SupportDrawer } from "@/components/support-drawer";
import { UserProfileButton } from "@/components/userProfileButton";
import { YearSelector } from "@/components/yearSelector";
import { useInstitution } from "@/hooks/use-institution";
import { useYid } from "@/hooks/use-yid";
import { getJurysForUser } from "@/lib/api";
import { getPublicR2Url } from "@/lib/utils";
import {
  CalendarOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Divider,
  Empty,
  Image,
  Layout,
  List,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import Link from "next/link";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { yid } = useYid();

  const { data: institution } = useInstitution();

  const {
    data: jurys,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["get", yid],
    queryFn: ({ queryKey }) => getJurysForUser(Number(queryKey[1])),
    enabled: !!yid,
  });

  return (
    <Layout>
      <Layout.Header
        style={{
          background: colorBgContainer,
          borderBottom: `1px solid ${colorBorderSecondary}`,
          paddingLeft: 32,
          paddingRight: 32,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Space>
          <Link
            href={`/jury`}
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
          <Divider type="vertical" />
          <Typography.Title
            level={5}
            style={{ marginBottom: 0 }}
          >
            Jurys
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
      <Layout.Content
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 28,
          minHeight: `calc(100vh - 64px)`,
        }}
      >
        <div style={{ width: 520, margin: "auto" }}>
          <Card loading={isPending}>
            <Typography.Title level={4}>Jurys d&apos;évaluation</Typography.Title>
            <List
              dataSource={jurys}
              renderItem={(item) => (
                <Link key={item.id} href={`/jury/${item.id}`}>
                  <List.Item
                    className=" hover:cursor-pointer hover:bg-[#f5f5f5]"
                    extra={<RightOutlined />}
                    style={{ paddingLeft: 16, paddingRight: 16 }}
                  >
                    <List.Item.Meta
                      title={item.name}
                      description={
                        <Space wrap>
                          {item.faculties.map((fac) => (
                            <Tag style={{ borderRadius: 10 }}>
                              {fac.acronym}
                            </Tag>
                          ))}
                        </Space>
                      }
                      avatar={<CalendarOutlined />}
                    />
                  </List.Item>
                </Link>
              )}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Vous n'êtes pas associé à ce jury dans le système. Merci de contacter l'administrateur afin qu'il vous associe à ce jury."
                  />
                ),
              }}
            />
          </Card>
        </div>
      </Layout.Content>
    </Layout>
  );
}
