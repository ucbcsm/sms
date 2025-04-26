"use client";

import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
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
import { Button, Card, Dropdown, Input, Layout, Space, Table, theme, Typography } from "antd";

export default function Page() {
    const { token:{colorBgContainer }} = theme.useToken();
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
              Salles de classe
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card>
        <Table
            title={() => (
                <header className="flex pb-3">
                    <Space>
                        <Input.Search placeholder="Rechercher une salle de classe ..." />
                    </Space>
                    <div className="flex-1" />
                    <Space>
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            title="Ajouter une salle de classe"
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
                                        title: "Exporter vers excel",
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
                    key: "name",
                    dataIndex: "name",
                    title: "Nom de la salle",
                },
                {
                    key: "code",
                    dataIndex: "code",
                    title: "Code",
                },
                {
                    key: "capacity",
                    dataIndex: "capacity",
                    title: "Capacité",
                },
                {
                    key: "type",
                    dataIndex: "type",
                    title: "Type",
                },
                {
                    key: "status",
                    dataIndex: "status",
                    title: "Statut",
                    render: (value) => (
                        <Typography.Text type={value === "Disponible" ? "success" : "danger"}>
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
                                <Button style={{ boxShadow: "none" }}>Gérer</Button>
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
                                    <Button type="text" icon={<MoreOutlined />} title="Options" />
                                </Dropdown>
                            </Space>
                        );
                    },
                    width: 50,
                },
            ]}
            dataSource={Array.from({ length: 10 }, (_, index) => ({
                id: (index + 1).toString(),
                name: [
                    "Salle A101",
                    "Salle B202",
                    "Salle C303",
                    "Salle D404",
                    "Salle E505",
                    "Salle F606",
                    "Salle G707",
                    "Salle H808",
                    "Salle I909",
                    "Salle J1010",
                ][index % 10],
                code: `SAL${(index + 1).toString().padStart(3, "0")}`,
                capacity: [30, 40, 50, 60, 20, 25, 35, 45, 55, 65][index % 10],
                type: [
                    "Amphithéâtre",
                    "Salle de cours",
                    "Laboratoire",
                    "Salle informatique",
                    "Salle de réunion",
                ][index % 5],
                status: index % 2 === 0 ? "Disponible" : "Occupée",
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
        </Layout>
    );
}
