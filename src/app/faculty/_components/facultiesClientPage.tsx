"use client";

import { AppsButton } from "@/components/appsButton";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { SupportDrawer } from "@/components/support-drawer";
import { UserProfileButton } from "@/components/userProfileButton";
import { useInstitution } from "@/hooks/use-institution";
import { useFaculties } from "@/hooks/useFaculties";
import { getPublicR2Url } from "@/lib/utils";
import { RightOutlined } from "@ant-design/icons";
import {
  Card,
  Divider,
  Empty,
  Image,
  Layout,
  List,
  Space,
  theme,
  Typography,
} from "antd";
import Link from "next/link";

export const FacultiesClientPage = () => {

  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { data: institution } = useInstitution();
  const { data, isPending, isError } = useFaculties();

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
          <Link href={`/`} style={{ display: "flex", alignItems: "center" }}>
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
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            Filières
          </Typography.Title>
        </Space>
        <div className="flex-1" />
        <Space>
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
          //  background: colorBgContainer,
          padding: 28,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Card
          loading={isPending}
          style={{ width: 520, margin: "auto" }}
        >
          <Typography.Title level={4}>Filières</Typography.Title>
          <List
            size="small"
            dataSource={data}
            renderItem={(fac) => (
              <Link key={fac.id} href={`/faculty/${fac.id}`}>
                <List.Item
                  style={{ cursor: "pointer" }}
                  className=" hover:bg-[#f5f5f5] rounded-md"
                  extra={<RightOutlined />}
                >
                  <List.Item.Meta
                    title={`${fac.acronym} (${fac.field.cycle?.name})`}
                    description={fac.name}
                  />
                </List.Item>
              </Link>
            )}
            locale={{
              emptyText: isError ? (
                <Empty
                  description="Erreur lors du chargement des filières"
                  //   image={}
                />
              ) : (
                <Empty
                  description="Aucune filière trouvée"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </Card>
      </Layout.Content>
    </Layout>
  );
};
