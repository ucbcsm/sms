"use client";
import { ClockCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Layout, Space, theme } from "antd";

export default function Page() {
    const {token}=theme.useToken()
  return (
    <Layout>
      <Layout.Header className="flex sticky top-0 z-[1]" style={{background:token.colorBgContainer}}>
        <Space className="font-medium">
          <ClockCircleOutlined /> Années academiques
        </Space>
        <div className="flex-1" />
        <Space>
          <Button type="dashed" icon={<PlusOutlined />} className="shadow-none" style={{boxShadow:"none"}}>
            Nouvelle année
          </Button>
        </Space>
      </Layout.Header>
      <Layout.Content className="px-4 md:px-8 bg-white">
        <div
          style={{ borderTop: "1px solid #f0f0f0" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3 pt-8 "
        >
            sdjkafasdkj sadkfjasdjkf
        </div>
      </Layout.Content>
    </Layout>
  );
}
