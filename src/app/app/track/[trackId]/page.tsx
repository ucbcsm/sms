"use client";

import {
  AppstoreOutlined,
  EditOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
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
            <BackButton/>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Nom de la filière (Faculté ou Département)
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
                type="primary"
                icon={<PlusOutlined />}
                title="Ajouter"
                style={{ boxShadow: "none" }}
              />
              <Button
                type="dashed"
                icon={<EditOutlined />}
                title="Modifier la filière"
              >
                Modifier
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
              key: "details",
              label: "Détails",
            },
            { key: "students", label: "Étudiants" },
            { key: "departement", label: "Filières enfant" },
            { key: "batches", label: "Promotions" }, 
            { key: "courses", label: "Cours" },
            { key: "staff", label: "Personnel" },
            { key: "teachers", label: "Enseignants" },
               
          ]}
          defaultActiveTabKey="details"
        >
          <div>
            <List
              dataSource={[
                { label: "Nom", value: "Nom de la filière" },
                { label: "Code de la filière", value: "FIL123" },
                {
                  label: "Type",
                  value: "Faculté ou Département ou Spécialisation",
                },
                { label: "Filière parent", value: "Sciences et Technologies" },
                { label: "Nombre de filières enfants", value: "5" },
                { label: "Nombre d'étudiants", value: "120" },
                { 
                  label: "Nombre de filles", 
                  value: "70 (58.33%)" 
                },
                { 
                  label: "Nombre de garçons", 
                  value: "50 (41.67%)" 
                },
                { label: "Responsable", value: "Dr. Alfred L." },
                { label: "Année de création", value: "2005" },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={item.label} description={item.value} />
                </List.Item>
              )}
            />
          
          </div>
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
          title="Filières enfant"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter une filière enfant"
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
                type: "Domaine",
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
                extra={<Button type="text" icon={<RightOutlined />} />}
              >
                <List.Item.Meta
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
