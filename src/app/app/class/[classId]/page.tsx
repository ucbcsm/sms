"use client";

import {
  AppstoreOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Layout,
  List,
  Radio ,
  Space ,
  theme,
  Typography as AntTypography,
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
              Nom de la promotion ou classe
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
                title="Modifier la promotion"
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
            { key: "courses", label: "Cours" },
            {key:"planing", label:"Planning des cours"},
            {key:"attendances", label:"Présences"},
            {key:"jury", label:"Jury"},
             { key: "teachers", label: "Enseignants" },
             {key:"fees", label:"Frais"},
          ]}
          defaultActiveTabKey="details"
        >
          <div>
            <List
              dataSource={[
                { label: "Nom", value: "Nom de la promotion ou classe" },
                { label: "Code de la promotion", value: "PROM123" },
                { label: "Filière", value: "Informatique" },
                { label: "Année académique", value: "2023-2024" },
                { label: "Nombre d'étudiants", value: "45" },
                { label: "Nombre de filles", value: "25 (55.56%)" },
                { label: "Nombre de garçons", value: "20 (44.44%)" },
                { label: "Responsable", value: "Mme. Jane Doe" },
                { label: "Date de création", value: "2018" },
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
          title="Statistiques"
          style={{ boxShadow: "none" }}
        >
          <List
            dataSource={[
              { label: "Taux de réussite", value: "85%" },
              { label: "Taux d'abandon", value: "5%" },
              { label: "Nombre de cours", value: "12" },
              { label: "Nombre d'enseignants", value: "8" },
              { label: "Projets réalisés", value: "3" },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={item.label} description={item.value} />
              </List.Item>
            )}
          />
        </Card>
        {/* <Card
          variant="borderless"
          title="Ressources"
          style={{ boxShadow: "none", marginTop: 16 }}
        >
          <List
            dataSource={[
              { label: "Guide de la promotion", link: "/guide" },
              { label: "Règlement intérieur", link: "/reglement" },
          
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<Link href={item.link}>{item.label}</Link>}
                />
              </List.Item>
            )}
          />
        </Card> */}
      </Layout.Sider>
    </Layout>
  );
}
