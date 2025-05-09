"use client";

import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Layout,
  List,
  Space,
  theme,
  Typography,
} from "antd";

import { Palette } from "@/components/palette";
import Link from "next/link";
import BackButton from "@/components/backButton";
import { getHSLColor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCycles } from "@/utils";
import { NewCycleForm } from "./(cycles)/forms/newCycle";

export default function FieldsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();

  const { data: cycles, isPending } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
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
            <BackButton />
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Gestion des cycles et filières
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            { key: "/console/fields", label: "Domaines" },
            { key: "/console/fields/faculties", label: "Facultés" },
            { key: "/console/fields/departments", label: "Départements" },
            { key: "/console/fields/classes", label: "Promotions" },
          ]}
          activeTabKey={pathname}
          onTabChange={(key) => {
            router.push(key);
          }}
        >
          {children}
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: "24px 0",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Footer>
      </Layout.Content>

      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <Card
          loading={isPending}
          variant="borderless"
          title="Cycles"
          style={{ boxShadow: "none" }}
          extra={<NewCycleForm cycles={cycles} />}
        >
          <List
            dataSource={cycles}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                extra={
                  <Dropdown
                    menu={{
                      items: [
                        { key: "1", label: "Modifier", icon: <EditOutlined /> },
                        {
                          key: "2",
                          label: "Supprimer",
                          icon: <DeleteOutlined />,
                          danger: true,
                        },
                      ],
                    }}
                  >
                    <Button icon={<MoreOutlined />} type="text" />
                  </Dropdown>
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ background: getHSLColor(item.name) }}>
                      {item.symbol || item.name[0].toUpperCase()}
                    </Avatar>
                  }
                  title={item.name}
                  description={item.purpose}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
