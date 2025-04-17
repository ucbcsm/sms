"use client";

import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
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
            <BackButton />
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Gestion des frais académiques
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
                title="Ajouter un frais académique"
                style={{ boxShadow: "none" }}
              >
                Ajouter un frais
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
              label: "Tous",
            },
            { key: "paid", label: "Payés" },
            { key: "unpaid", label: "Non payés" },
          ]}
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Frais d'inscription",
                description: "Frais pour l'inscription annuelle",
                amount: "50 USD",
                classes: ["1ère année", "2ème année"],
              },
              {
                id: "2",
                name: "Frais de scolarité",
                description: "Frais pour le semestre en cours",
                amount: "200 USD",
                classes: ["Toutes les années"],
              },
              {
                id: "3",
                name: "Frais de bibliothèque",
                description: "Frais pour l'accès à la bibliothèque",
                amount: "10 USD",
                classes: ["1ère année", "3ème année"],
              },
              {
                id: "4",
                name: "Frais de laboratoire",
                description: "Frais pour l'utilisation des laboratoires",
                amount: "30 USD",
                classes: ["2ème année", "3ème année"],
              },
            ]}
            renderItem={(item, index) => (
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
                          danger: true,
                          icon: <DeleteOutlined />,
                        },
                      ],
                    }}
                  >
                    <Button icon={<MoreOutlined />} type="text" />
                  </Dropdown>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar>F{index + 1}</Avatar>}
                  title={<Link href="#">{item.name}</Link>}
                  description={
                    <>
                      <div>{item.description}</div>
                      <div>Montant: {item.amount}</div>
                      <div>Classes: {item.classes.join(", ")}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
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
    </Layout>
  );
}
