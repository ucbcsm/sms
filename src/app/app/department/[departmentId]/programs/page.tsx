"use client";

import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Space, Table } from "antd";

export default function Page() {
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un programme ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              title="Ajouter un programme"
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
                    title: "Exporter vers Excel",
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
      dataSource={[
        {
          key: "1",
          semester: "Semestre 1",
          code: "INF101-S1",
          name: "Introduction à la Programmation",
          description: "Programme couvrant les bases de la programmation.",
          duration: "6 mois",
          courses: ["Algorithmique", "Programmation en C"],
        },
        {
          key: "2",
          semester: "Semestre 2",
          code: "INF102-S2",
          name: "Structures de Données",
          description:
            "Programme axé sur les structures de données et algorithmes.",
          duration: "6 mois",
          courses: ["Listes", "Arbres", "Graphes"],
        },
        {
          key: "3",
          semester: "Semestre 3",
          code: "INF201-S1",
          name: "Développement Web",
          description: "Programme dédié au développement d'applications web.",
          duration: "6 mois",
          courses: ["HTML/CSS", "JavaScript", "React"],
        },
        {
          key: "4",
          semester: "Semestre 4",
          code: "INF202-S2",
          name: "Bases de Données",
          description:
            "Programme sur la conception et gestion des bases de données.",
          duration: "6 mois",
          courses: ["SQL", "NoSQL", "Optimisation"],
        },
        {
          key: "5",
          semester: "Semestre 5",
          code: "INF301-S1",
          name: "Intelligence Artificielle",
          description:
            "Programme sur les bases de l'intelligence artificielle.",
          duration: "6 mois",
          courses: ["Machine Learning", "Réseaux de Neurones"],
        },
        {
          key: "6",
          semester: "Semestre 6",
          code: "INF302-S2",
          name: "Cybersécurité",
          description: "Programme sur la sécurité des systèmes informatiques.",
          duration: "6 mois",
          courses: ["Cryptographie", "Sécurité Réseau"],
        },
      ]}
      columns={[
        {
          title: "Semestre",
          dataIndex: "semester",
          key: "semester",
        },
        {
          title: "Code",
          dataIndex: "code",
          key: "code",
        },
        {
          title: "Nom",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
        },
        {
          title: "Durée",
          dataIndex: "duration",
          key: "duration",
        },
        {
          title: "Cours",
          dataIndex: "courses",
          key: "courses",
          render: (_, record) => record.courses.length,
          align: "start",
        },
        {
          title: "",
          key: "actions",
          render: (_, record) => (
            <Space>
              <Button style={{ boxShadow: "none" }}>Gérer</Button>
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
            </Space>
          ),
          width: 50,
        },
      ]}
      rowKey="key"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      rowSelection={{
        type: "checkbox",
      }}
      size="small"
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
      }}
    />
  );
}
