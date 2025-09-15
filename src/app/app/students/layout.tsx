"use client";
import {
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  Layout,
  Space,
  theme,
  Typography,
} from "antd";
import { ListStudents } from "./list";

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
      <Layout.Sider
        width={360}
        theme="light"
        style={{ borderRight: `1px solid ${colorBorderSecondary}` }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 20 }}
        >
          <Typography.Title level={3} className="" style={{ marginBottom: 0 }}>
            Gestion des étudiants
          </Typography.Title>
        </Flex>

        <div
          style={{
            height: "calc(100vh - 116px)",
            overflowY: "auto",
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 28,
            paddingTop: 16,
          }}
        ></div>
      </Layout.Sider>
      <Layout.Content
        style={{
          background: colorBgContainer,
          padding: "0 28px",
        }}
      >
        {children}
      </Layout.Content>
    </Layout>
  );
}
