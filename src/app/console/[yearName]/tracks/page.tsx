"use client";

import {
  AppstoreOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
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

import { Palette } from "@/components/palette";
import Link from "next/link";

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
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Gestion des filières
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
                icon={<PlusOutlined />}
                type="primary"
                title="Ajouter une filière"
                style={{ boxShadow: "none" }}
              >
                Ajouter une filière
              </Button>
              <Radio.Group>
                <Radio.Button value="grid">
                  <AppstoreOutlined />
                </Radio.Button>
                <Radio.Button value="list">
                  <UnorderedListOutlined />
                </Radio.Button>
              </Radio.Group>
            </Space>
          }
          tabList={[
            {
              key: "all",
              label: "Toutes",
            },
            { key: "domains", label: "Domaines" },
            { key: "faculties", label: "Facultés" },
            { key: "departments", label: "Départements" },
            { key: "specializations", label: "Spécialisations" },
          ]}
        >
          {/* Contenu de l'onglet actif */}
          <Typography.Text>
          Contenu de l&apos;onglet actif 
          </Typography.Text>
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
          title="Promotions (Classes)"
          style={{ boxShadow: "none"}}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter une promotion"
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Informatique",
                type: "Département",
              },
              {
                id: "2",
                name: "Génie Civil",
                type: "Département",
              },
              {
                id: "3",
                name: "Sciences de Gestion",
                type: "Faculté",
              },
              {
                id: "4",
                name: "Sciences et Technologies",
                type: "Département",
              },
              {
                id: "5",
                name: "Réseaux et Télécoms",
                type: "Spécialisation",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                extra={
                  <Dropdown menu={{ items: [{key:"1", label:"Action 1"}, {key:"2", label:"Action 2"}, {key:"3", label:"Action 3"}] }}>
                    <Button icon={<MoreOutlined />} type="text" />
                  </Dropdown>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar>L{index}</Avatar>}
                  title={<Link href="#">{item.name}</Link>}
                  description={item.type}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
