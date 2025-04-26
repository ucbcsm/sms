"use client";

import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Layout, List, Space, theme, Typography } from "antd";

import { Palette } from "@/components/palette";
import { useParams, usePathname, useRouter } from "next/navigation";
import BackButton from "@/components/backButton";

export default function YearLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { yearName } = useParams();
  const pathname = usePathname();
  const router = useRouter();

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
              Année {yearName}
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            {
              key: `/console/years/${yearName}/periods`,
              label: "Périodes",
            },
            {
              key: `/console/years/${yearName}/fees`,
              label: "Frais",
            },
            {
              key: `/console/years/${yearName}/jurys`,
              label: "Jurys d'examen",
            },
            {
              key: `/console/years/${yearName}/currencies`,
              label: "Monnaies",
            },
            {
              key: `/console/years/${yearName}/payment-methods`,
              label: "Modes de paiement",
            },
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
          variant="borderless"
          title="Détails de l'année"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<EditOutlined />}
              title="Modifier l'année"
            >
              Modifier
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "0",
                name: "Nom",
                description: `${yearName}`,
              },
              {
                id: "1",
                name: "Date de début",
                description: `${new Intl.DateTimeFormat("FR", {
                  dateStyle: "full",
                }).format(new Date())}`,
              },
              {
                id: "2",
                name: "Date de fin",
                description: `${new Intl.DateTimeFormat("FR", {
                  dateStyle: "full",
                }).format(new Date())}`,
              },
              {
                id: "3",
                name: "Status",
                description: "En cours",
              },
            ]}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={<Typography.Text strong>{item.name}</Typography.Text>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
