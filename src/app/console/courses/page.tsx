"use client";

import {
  AppstoreOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  PrinterOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Input,
  Layout,
  List,
  Radio,
  Select,
  Space,
  Table,
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
              Gestion des cours
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
        //   tabBarExtraContent={

        //   }
        //   tabList={[
        //     {
        //       key: "all",
        //       label: "Tous",
        //     },
        //   ]}
        >
          {/* Contenu de l'onglet actif */}
          <Table
            title={() => (
              <header className="flex pb-3">
                <Space>
                  <Input.Search placeholder="Rechercher un cours ..." />
                  <Select placeholder="Faculté" options={[]} />
                </Space>
                <div className="flex-1" />
                <Space>
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    title="Ajouter un cours"
                    style={{ boxShadow: "none" }}
                  >
                    Ajouter
                  </Button>
                  <Button
                    icon={<PrinterOutlined />}
                    style={{ boxShadow: "none" }}
                  >
                    Imprimer
                  </Button>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "pdf",
                          label: "PDF",
                          icon: <FilePdfOutlined />,
                          title: "Exporter en pdf",
                        },
                        {
                          key: "excel",
                          label: "EXCEL",
                          icon: <FileExcelOutlined />,
                          title: "Exporter ver excel",
                        },
                      ],
                    }}
                  >
                    <Button
                      icon={<DownOutlined />}
                      style={{ boxShadow: "none" }}
                    >
                      Exporter
                    </Button>
                  </Dropdown>
                </Space>
              </header>
            )}
            columns={[
              {
                key: "name",
                dataIndex: "name",
                title: "Nom du cours",
                render: (value, record, index) => {
                  return (
                    <Link href={`/console/courses/${record.id}`}>{value}</Link>
                  );
                },
              },
              {
                key: "code",
                dataIndex: "code",
                title: "Code du cours",
              },
              {
                key: "faculty",
                dataIndex: "faculty",
                title: "Faculté",
              },
              {
                key: "credits",
                dataIndex: "credits",
                title: "Crédits",
              },
              {
                key: "actions",
                dataIndex: "actions",
                // title: "Actions",
                render: (value, record, index) => {
                  return (
                    <Space size="middle">
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: "edit",
                              label: "Modifier",
                              icon: <EditOutlined />,
                            },
                            {
                              key: "delete",
                              label: "Supprimer",
                              icon: <DeleteOutlined />,
                              danger: true,
                            },
                          ],
                        }}
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          title="Options"
                        />
                      </Dropdown>
                    </Space>
                  );
                },
                width: 50,
              },
            ]}
            dataSource={[
              {
                id: "1",
                code: "MATH101",
                name: "Algèbre Linéaire",
                faculty: "Faculté des Sciences",
                credits: 3,
              },
              {
                id: "2",
                code: "CS102",
                name: "Programmation Orientée Objet",
                faculty: "Faculté d'Informatique",
                credits: 4,
              },
              {
                id: "3",
                code: "CIV103",
                name: "Mécanique des Fluides",
                faculty: "Faculté de Génie Civil",
                credits: 3,
              },
              {
                id: "4",
                code: "MKT104",
                name: "Marketing Digital",
                faculty: "Faculté des Sciences Économiques",
                credits: 2,
              },
              {
                id: "5",
                code: "TEL105",
                name: "Réseaux Informatiques",
                faculty: "Faculté de Télécommunications",
                credits: 4,
              },
              {
                id: "6",
                code: "PHY106",
                name: "Physique Quantique",
                faculty: "Faculté des Sciences",
                credits: 3,
              },
              {
                id: "7",
                code: "BIO107",
                name: "Biologie Moléculaire",
                faculty: "Faculté des Sciences",
                credits: 3,
              },
              {
                id: "8",
                code: "CHE108",
                name: "Chimie Organique",
                faculty: "Faculté des Sciences",
                credits: 3,
              },
              {
                id: "9",
                code: "LAW109",
                name: "Droit Civil",
                faculty: "Faculté de Droit",
                credits: 3,
              },
              {
                id: "10",
                code: "MED110",
                name: "Anatomie Humaine",
                faculty: "Faculté de Médecine",
                credits: 4,
              },
              {
                id: "11",
                code: "ART111",
                name: "Histoire de l'Art",
                faculty: "Faculté des Arts",
                credits: 2,
              },
              {
                id: "12",
                code: "ENG112",
                name: "Littérature Anglaise",
                faculty: "Faculté des Lettres",
                credits: 3,
              },
              {
                id: "13",
                code: "PSY113",
                name: "Psychologie Cognitive",
                faculty: "Faculté de Psychologie",
                credits: 3,
              },
              {
                id: "14",
                code: "SOC114",
                name: "Sociologie Urbaine",
                faculty: "Faculté des Sciences Sociales",
                credits: 3,
              },
              {
                id: "15",
                code: "ECO115",
                name: "Macroéconomie",
                faculty: "Faculté des Sciences Économiques",
                credits: 3,
              },
              {
                id: "16",
                code: "PHI116",
                name: "Philosophie Moderne",
                faculty: "Faculté des Lettres",
                credits: 2,
              },
              {
                id: "17",
                code: "ARC117",
                name: "Architecture Contemporaine",
                faculty: "Faculté d'Architecture",
                credits: 4,
              },
              {
                id: "18",
                code: "AGR118",
                name: "Agronomie Tropicale",
                faculty: "Faculté d'Agronomie",
                credits: 3,
              },
              {
                id: "19",
                code: "ENV119",
                name: "Sciences Environnementales",
                faculty: "Faculté des Sciences",
                credits: 3,
              },
              {
                id: "20",
                code: "STA120",
                name: "Statistiques Avancées",
                faculty: "Faculté des Sciences",
                credits: 3,
              },
              {
                id: "21",
                code: "FIN121",
                name: "Finance d'Entreprise",
                faculty: "Faculté des Sciences Économiques",
                credits: 3,
              },
              {
                id: "22",
                code: "HRM122",
                name: "Gestion des Ressources Humaines",
                faculty: "Faculté des Sciences de Gestion",
                credits: 3,
              },
              {
                id: "23",
                code: "MED123",
                name: "Pharmacologie",
                faculty: "Faculté de Médecine",
                credits: 4,
              },
              {
                id: "24",
                code: "IT124",
                name: "Sécurité Informatique",
                faculty: "Faculté d'Informatique",
                credits: 4,
              },
              {
                id: "25",
                code: "GEO125",
                name: "Géologie Structurale",
                faculty: "Faculté des Sciences",
                credits: 3,
              },
            ]}
            rowKey="id"
            rowClassName={`bg-[#f5f5f5] odd:bg-white`}
            rowSelection={{
              type: "checkbox",
            }}
            size="small"
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 25, 50],
              size: "small",
            }}
            bordered={false}
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

      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <Card
          variant="borderless"
          title="Groupes de cours"
          style={{ boxShadow: "none" }}
          extra={
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              title="Ajouter un groupe"
            >
              Ajouter
            </Button>
          }
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Sciences de Base",
              },
              {
                id: "2",
                name: "Informatique",
              },
              {
                id: "3",
                name: "Génie Civil",
              },
              {
                id: "4",
                name: "Sciences Économiques",
              },
              {
                id: "5",
                name: "Médecine",
              },
            ]}
            renderItem={(item, index) => (
              <List.Item
                key={item.id}
                extra={
                  <Dropdown
                    menu={{
                      items: [
                        { key: "1", label: "Modifier" },
                        { key: "2", label: "Supprimer" },
                        { key: "3", label: "Voir détails" },
                      ],
                    }}
                  >
                    <Button icon={<MoreOutlined />} type="text" />
                  </Dropdown>
                }
              >
                <List.Item.Meta
                  avatar={<Avatar>G{index + 1}</Avatar>}
                  title={<Link href="#">{item.name}</Link>}
                />
              </List.Item>
            )}
          />
        </Card>
      </Layout.Sider>
    </Layout>
  );
}
