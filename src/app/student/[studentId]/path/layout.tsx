"use client";

import { Layout, theme } from "antd";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, },
  } = theme.useToken();
 
  return (
    <Layout>
      <Layout.Content style={{ background: colorBgContainer }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}
