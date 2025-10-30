"use client";

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
import {
  AppstoreOutlined,
  MoreOutlined,
  NotificationOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Palette } from "@/components/palette";

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
          height: "calc(100vh - 112px)",
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
              Annonces
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          variant="borderless"
          tabBarExtraContent={
            <Button
              icon={<PlusOutlined />}
              color="primary"
              variant="dashed"
              style={{ boxShadow: "none" }}
            >
              Créer une annonce
            </Button>
          }
          tabList={[
            {
              key: "all",
              label: "Toutes",
            },
            { key: "academic", label: "Académiques" },
            { key: "events", label: "Événements" },
            { key: "others", label: "Autres" },
          ]}
          style={{ boxShadow: "none" }}
        >
          <List
            dataSource={[
              {
                id: "1",
                title: "Réunion académique",
                description: "Réunion prévue le 15 mars à 10h.",
              },
              {
                id: "2",
                title: "Nouvelle session d'inscription",
                description:
                  "Les inscriptions pour le semestre prochain sont ouvertes.",
              },
              {
                id: "3",
                title: "Conférence sur l'innovation",
                description: "Participez à la conférence le 20 mars.",
              },
              {
                id: "4",
                title: "Mise à jour des horaires",
                description: "Consultez les nouveaux horaires des cours.",
              },
              {
                id: "5",
                title: "Fermeture exceptionnelle",
                description: "L'université sera fermée le 25 mars.",
              },
              {
                id: "6",
                title: "Atelier de développement personnel",
                description: "Inscrivez-vous à l'atelier du 22 mars.",
              },
              {
                id: "7",
                title: "Journée portes ouvertes",
                description: "Découvrez l'université le 30 mars.",
              },
              {
                id: "8",
                title: "Mise à jour des bibliothèques",
                description: "Les horaires des bibliothèques ont changé.",
              },
              {
                id: "9",
                title: "Nouvelle cafétéria",
                description:
                  "La nouvelle cafétéria ouvre ses portes le 1er avril.",
              },
              {
                id: "10",
                title: "Programme de mentorat",
                description:
                  "Rejoignez le programme de mentorat pour les étudiants.",
              },
              {
                id: "11",
                title: "Concours de projets",
                description: "Participez au concours de projets étudiants.",
              },
              {
                id: "12",
                title: "Séance d'information",
                description: "Séance d'information sur les stages le 5 avril.",
              },
              {
                id: "13",
                title: "Campagne de dons",
                description:
                  "Participez à la campagne de dons pour les étudiants.",
              },
              {
                id: "14",
                title: "Nouvelle application mobile",
                description:
                  "Téléchargez l'application mobile de l'université.",
              },
              {
                id: "15",
                title: "Semaine de la santé",
                description:
                  "Participez aux activités de la semaine de la santé.",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                extra={
                  <Space>
                    <Dropdown
                      menu={{
                        items: [
                          { key: "1", label: "Action 1" },
                          { key: "2", label: "Action 2" },
                          { key: "3", label: "Action 3" },
                        ],
                      }}
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  </Space>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<NotificationOutlined />} />}
                  title={<Link href="#">{item.title}</Link>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Content>
    </Layout>
  );
}
