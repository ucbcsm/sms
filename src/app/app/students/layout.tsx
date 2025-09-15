"use client";

import { useYid } from "@/hooks/use-yid";
import { getYearDashboard } from "@/lib/api";
import { toFixedNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Flex,
  Layout,
  Progress,
  Skeleton,
  Statistic,
  theme,
  Typography,
} from "antd";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { yid } = useYid();
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard", `${yid}`],
    queryFn: ({ queryKey }) => getYearDashboard(Number(queryKey[1])),
    enabled: !!yid,
  });

  return (
    <Layout>
      <Layout.Content
        style={{
          background: colorBgContainer,
          padding: "0 28px",
        }}
      >
        {children}
      </Layout.Content>
      <Layout.Sider
        width={360}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            // borderBottom: `1px solid ${colorBorderSecondary}`,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Typography.Title
            type="secondary"
            style={{ marginBottom: 0, textTransform:"uppercase" }}
            level={5}
            ellipsis={{}}
          >
            Statistiques {data?.year.name}
          </Typography.Title>
        </div>

        <div
          style={{
            height: "calc(100vh - 128px)",
            overflowY: "auto",
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 28,
            // paddingTop: 16,
          }}
        >
          <Flex vertical gap={16}>
            <Card variant="borderless">
              <Flex justify="space-between" align="center">
                <Statistic
                  loading={isPending}
                  title="Total"
                  value={data?.student_counter}
                  valueStyle={{ color: "#1677ff", fontWeight: 600 }}
                />
                {!isPending ? (
                  <Progress
                    type="dashboard"
                    percent={100}
                    size={58}
                    strokeColor="#1677ff"
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
            <Card variant="borderless">
              <Flex justify="space-between" align="center">
                <Statistic
                  loading={isPending}
                  title="Hommes"
                  value={data?.male_count}
                  valueStyle={{ color: "#52c41a", fontWeight: 600 }}
                />
                {!isPending ? (
                  <Progress
                    type="dashboard"
                    percent={toFixedNumber(
                      (data?.male_count! / data?.student_counter!) * 100
                    )}
                    size={58}
                    strokeColor={"#52c41a"}
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
            <Card variant="borderless">
              <Flex justify="space-between" align="center">
                <Statistic
                  loading={isPending}
                  title="Femmes"
                  value={data?.female_count}
                  valueStyle={{ color: "#eb2f96", fontWeight: 600 }}
                />
                {!isPending ? (
                  <Progress
                    type="dashboard"
                    percent={toFixedNumber(
                      (data?.female_count! / data?.student_counter!) * 100
                    )}
                    size={58}
                    strokeColor="#eb2f96"
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
            <Card variant="borderless">
              <Flex justify="space-between" align="center">
                <Statistic
                  loading={isPending}
                  title="Actifs"
                  value={data?.actif_count}
                  valueStyle={{ color: "#faad14", fontWeight: 600 }}
                />
              </Flex>
            </Card>
            <Card variant="borderless">
              <Flex justify="space-between" align="center">
                <Statistic
                  loading={isPending}
                  title="Abandons"
                  value={data?.inactif_count}
                  valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
                />
              </Flex>
            </Card>
          </Flex>
        </div>
      </Layout.Sider>
    </Layout>
  );
}
