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
      <Layout.Content style={{ padding: 24,  }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}
