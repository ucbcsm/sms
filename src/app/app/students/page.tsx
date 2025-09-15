"use client";

import { Layout, Space, theme, Typography } from "antd";
import { ListStudents } from "./_components/list-students";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          padding: 0,
        }}
      >
        <Space>
          <Typography.Title level={3} className="" style={{ marginBottom: 0 }}>
            Étudiants
          </Typography.Title>
        </Space>
        <div className="flex-1" />
        <Space></Space>
      </Layout.Header>
      <Layout.Content style={{ background: colorBgContainer }}>
        <ListStudents />
      </Layout.Content>
    </Layout>
  );
}
