"use client";

import { AppsButton } from "@/components/appsButton";
import { DataFetchErrorResult } from "@/components/errorResult";
import { LanguageSwitcher } from "@/components/languageSwitcher";
import { Palette } from "@/components/palette";
import { SupportDrawer } from "@/components/support-drawer";
import { UserProfileButton } from "@/components/userProfileButton";
import { useInstitution } from "@/hooks/use-institution";
import { useYid } from "@/hooks/use-yid";
import { getUserIsJury, getYears } from "@/lib/api";
import { getPublicR2Url } from "@/lib/utils";
import {
  CalendarOutlined,
  LoadingOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Divider,
  Flex,
  Image,
  Layout,
  List,
  message,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const [yearId, setYearId] = useState<number | undefined>();
  const [messageApi, contextHolder] = message.useMessage();
  const { setYid,removeYid } = useYid();

  const { data: institution } = useInstitution();

  const {
    data: years,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  const {
    data: jury,
    isLoading,
    isError: isErrorJury,
    error,
  } = useQuery({
    queryKey: ["get", `${yearId}`],
    queryFn: ({ queryKey }) => getUserIsJury(Number(queryKey[1])),
    enabled: !!yearId,
    refetchOnReconnect:false,
    refetchOnWindowFocus:false
  });

  if (jury && yearId) {
    setYid(yearId);
    redirect(`/jury/${jury.id}`);
  }

  if (isError) {
    return (
      <Layout>
        <Layout.Content
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
            padding: 28,
          }}
        >
          <DataFetchErrorResult />
        </Layout.Content>
      </Layout>
    );
  }

  useEffect(() => {
    if (
      isErrorJury &&
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      ((error as any).status === 404 || (error as any).status === 503)
    ) {
      messageApi.error("Vous n'êtes pas associé(e) à ce jury!");
    } else if (isErrorJury) {
      messageApi.error("Erreur inconnue. Merci de réessayer.");
      setYearId(undefined);
    }
  }, [error]);

  return (
    <Layout>
      {contextHolder}

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
          <Typography.Title
            level={5}
            type="secondary"
            style={{ marginBottom: 0 }}
          >
            Jury
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
          width: "100%",
          padding: 28,
          // background: colorBgContainer,
          minHeight: `calc(100vh - 64px)`,
        }}
      >
        <div style={{ width: 520, margin: "auto" }}>
          {isErrorJury &&
            ((error as any).status === 404 ||
              (error as any).status === 503) && (
              <Alert
                showIcon
                type="info"
                message="Accès non autorisé"
                description="Vous n'êtes pas associé à ce jury dans le système. Merci de contacter l'administrateur afin qu'il vous associe à ce jury."
                style={{ marginBottom: 20, border: 0 }}
                action={
                  <Link href="/">
                    <Button type="primary" style={{ boxShadow: "none" }}>
                      OK
                    </Button>
                  </Link>
                }
              />
            )}
          <Card
            loading={isPending}
            // variant="borderless"
            // style={{ boxShadow: "none" }}
          >
            <Typography.Title level={4}>Année</Typography.Title>
            <List
              dataSource={years}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  className=" hover:cursor-pointer hover:bg-[#f5f5f5]"
                  extra={
                    isLoading && item.id === yearId ? (
                      <LoadingOutlined />
                    ) : (
                      <RightOutlined />
                    )
                  }
                  style={{ paddingLeft: 16, paddingRight: 16 }}
                  onClick={() => {
                    if (!isLoading) {
                      setYearId(item.id);
                    }
                  }}
                >
                  <List.Item.Meta
                    title={item.name}
                    avatar={<CalendarOutlined />}
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </Layout.Content>
    </Layout>
  );
}
