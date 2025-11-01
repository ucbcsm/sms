"use client";

import {
  Card,
  Layout,
  Space,
  theme,
  Typography,
} from "antd";
import { ListTeachers } from "./list";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";

export default function Page() {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            {/* <BackButton /> */}
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Enseignants
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card>
          <ListTeachers />
        </Card>
      </Layout.Content>
    </Layout>
  );
}
