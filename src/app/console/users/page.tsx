"use client";

import {
  AppstoreOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  KeyOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  PrinterOutlined,
  UnorderedListOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
  Input,
  Layout,
  List,
  Radio,
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
              Gestion des utilisateurs
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
              key: "all",
              label: "Tous",
            },
            { key: "students", label: "Étudiants" },
            { key: "teachers", label: "Enseignants" },
            { key: "admins", label: "Administrateurs" },
          ]}
        >
          {/* Contenu de l'onglet actif */}
          <Table
            title={() => (
              <header className="flex pb-3">
                <Space>
                  <Input.Search placeholder="Rechercher un utilisateur ..." />
                </Space>
                <div className="flex-1" />
                <Space>
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    title="Ajouter un utilisateur"
                    style={{ boxShadow: "none" }}
                  >
                    Ajouter
                  </Button>
                  <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
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
              <Button icon={<DownOutlined />} style={{ boxShadow: "none" }}>
                Exporter
              </Button>
            </Dropdown>
                </Space>
              </header>
            )}
            columns={[
              {
                key: "avatar",
                dataIndex: "avatar",
                title: "Avatar",
                render: (value, record) => (
                  <Avatar src={value} alt={record.fullName}>
                    {record.fullName.charAt(0)}
                  </Avatar>
                ),
              },
              {
                key: "fullName",
                dataIndex: "fullName",
                title: "Nom complet",
              },
              {
                key: "matricule",
                dataIndex: "matricule",
                title: "Matricule",
              },
              {
                key: "email",
                dataIndex: "email",
                title: "Email",
              },
              {
                key: "role",
                dataIndex: "role",
                title: "Rôle",
              },
              {
                key: "status",
                dataIndex: "status",
                title: "Statut",
                render: (value) => (
                  <Typography.Text
                    type={value === "Actif" ? "success" : "danger"}
                  >
                    {value}
                  </Typography.Text>
                ),
              },
              {
                key: "actions",
                dataIndex: "actions",
                render: (value, record, index) => {
                  return (
                    <Space size="middle">
                      <Button style={{ boxShadow: "none" }}>
                        Gérer
                      </Button>
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
            dataSource={Array.from({ length: 30 }, (_, index) => ({
              id: (index + 1).toString(),
              avatar: null,
              fullName: [
                "Jean Kabila",
                "Marie Lumumba",
                "Josephine Tshisekedi",
                "Patrick Mobutu",
                "Alice Kasavubu",
                "Emmanuel Ilunga",
                "Grace Mbuyi",
                "Fabrice Katanga",
                "Sylvie Kalala",
                "Christian Mukendi",
                "Esther Kabamba",
                "Jacques Lunda",
                "Claudine Moke",
                "Pascal Kanku",
                "Viviane Lushiku",
                "Jean-Pierre Banza",
                "Monique Tshibanda",
                "Alain Mulumba",
                "Chantal Ilunga",
                "Eric Kitenge",
                "Florence Mwamba",
                "Didier Kimbangu",
                "Rachel Mbayo",
                "Hervé Ngalula",
                "Patricia Kanku",
                "Serge Kalombo",
                "Nadine Mbuyi",
                "François Lunda",
                "Catherine Tshibola",
                "Michel Kabasele",
              ][index % 30],
              matricule: `2023${(index + 1).toString().padStart(3, "0")}`,
              email: `user${index + 1}@example.com`,
              role: [
                "Administrateur",
                "Enseignant",
                "Étudiant",
                "Secrétaire académique",
                "Bibliothécaire",
              ][index % 5],
              status: index % 2 === 0 ? "Actif" : "Inactif",
            }))}
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
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 12 }}
        >
          <Typography.Title level={5} className="">
            Rôles
          </Typography.Title>
          <Button
            type="link"
            icon={<PlusCircleOutlined />}
            title="Ajouter un rôle"
          >
            Ajouter
          </Button>
        </Flex>
        <div
          style={{
            padding: "20px 12px 28px 28px",
            width: "100%",
            height: "calc(100vh - 108px)",
            overflowY: "auto",
          }}
        >
          <List
            dataSource={[
              {
                id: "1",
                name: "Administrateur",
                description: "Accès complet au système",
              },
              {
                id: "2",
                name: "Enseignant",
                description: "Dispenser des cours",
              },
              {
                id: "3",
                name: "Étudiant",
                description: "Accès aux cours et aux notes",
              },
              {
                id: "4",
                name: "Secrétaire académique",
                description: "Gestion des inscriptions et des dossiers",
              },
              {
                id: "5",
                name: "Bibliothécaire",
                description: "Gestion des ressources de la bibliothèque",
              },
              {
                id: "6",
                name: "Apparitaire",
                description: "Support logistique et administratif",
              },
              {
                id: "7",
                name: "Coordonateur de faculté",
                description: "Supervision des programmes académiques",
              },
              {
                id: "8",
                name: "Secrétaire de faculté",
                description: "Gestion administrative de la faculté",
              },
            ]}
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
                  avatar={
                    <Avatar icon={<KeyOutlined />}>
                      {item.name.charAt(0)}
                    </Avatar>
                  }
                  title={<Link href="#">{item.name}</Link>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </div>
        {/* </Card> */}
      </Layout.Sider>
    </Layout>
  );
}
