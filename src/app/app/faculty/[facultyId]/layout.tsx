"use client";

import {
  AppstoreOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Layout,
  List,
  Radio,
  Space,
  theme,
  Typography,
} from "antd";

import Link from "next/link";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function FacultyLayout({children}:Readonly<{children:ReactNode}>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const { facultyId } = useParams();
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
              Nom de la Faculté
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabBarExtraContent={
            <Space>
              <Button
                type="dashed"
                title="Programmer un cours"
                style={{boxShadow:"none"}}
              >
                Programmer
              </Button>
              <Radio.Group>
                <Radio.Button value="grid">
                  <AppstoreOutlined />
                </Radio.Button>
                <Radio.Button value="list">
                  <UnorderedListOutlined />
                </Radio.Button>
              </Radio.Group>
              <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Action 1" },
                    { key: "2", label: "Action 2" },
                    { key: "3", label: "Action 3" },
                  ],
                }}
              >
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          }
          tabList={[
            {
              key: `/app/faculty/${facultyId}`,
              label: "Aperçu",
            },
            { key: `/app/faculty/${facultyId}/students`, label: "Étudiants" },
            {
              key: `/app/faculty/${facultyId}/departments`,
              label: "Départements",
            },
            { key: `/app/faculty/${facultyId}/classes`, label: "Promotions" },
            { key: `/app/faculty/${facultyId}/courses`, label: "Cours" },
            { key: `/app/faculty/${facultyId}/teachers`, label: "Enseignants" },
          ]}
          defaultActiveTabKey={pathname}
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
          title="Personnel"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter un membre du personnel"
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Dr. Alfred L.",
                role: "Responsable",
              },
              {
                id: "2",
                name: "Mme. Sophie K.",
                role: "Secrétaire académique",
              },
              {
                id: "3",
                name: "M. Jean P.",
                role: "Chargé des finances",
              },
              {
                id: "4",
                name: "Mme. Claire T.",
                role: "Coordonnatrice des cours",
              },
              {
                id: "5",
                name: "M. David M.",
                role: "Technicien informatique",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                extra={<Button type="text" icon={<RightOutlined />} />}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={<Link href="#">{item.name}</Link>}
                  description={item.role}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
