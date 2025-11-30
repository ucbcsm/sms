"use client";

import { Card, Layout, Space, theme, Typography } from "antd";

export default function Page() {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  return (
    <Layout>
      <Layout.Header
        style={{
          background: colorBgLayout,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        <Space>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Notes (CC & Examens)
          </Typography.Title>
        </Space>
      </Layout.Header>
      <Layout.Content
        style={{ padding: "0 28px 0 28px", minHeight: `calc(100vh - 174px)` }}
      >
        <Card></Card>
      </Layout.Content>
    </Layout>
  );
}
