"use client";

import { Card, Flex, Layout, Statistic, theme, Typography } from "antd";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

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
        width={260}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            borderBottom: `1px solid ${colorBorderSecondary}`,
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          <Typography.Title
            type="secondary"
            style={{ marginBottom: 0 }}
            level={5}
            ellipsis={{}}
          >
            Statistiques
          </Typography.Title>
        </div>

        <div
          style={{
            height: "calc(100vh - 128px)",
            overflowY: "auto",
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 28,
            paddingTop: 16,
          }}
        >
          <Flex vertical gap={16}>
            <Card>
              <Statistic title="Total" />
            </Card>
            <Card>
              <Statistic title="Hommes" />
            </Card>
            <Card>
              <Statistic title="Femmes" />
            </Card>
            <Card>
              <Statistic title="Actifs" />
            </Card>
            <Card>
              <Statistic title="Abandons" />
            </Card>
          </Flex>
        </div>
      </Layout.Sider>
    </Layout>
  );
}
