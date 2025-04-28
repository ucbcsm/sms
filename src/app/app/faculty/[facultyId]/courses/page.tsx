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
import { Button, Dropdown, Input, Space, Table, Tag } from "antd";

export default function Page() {
    return (
        <Table
            title={() => (
                <header className="flex pb-3">
                    <Space>
                        <Input.Search placeholder="Rechercher un cours dans le catalogue ..." />
                    </Space>
                    <div className="flex-1" />
                    <Space>
                        <Button type="primary" icon={<PlusOutlined/>} style={{boxShadow:"none"}}>Ajouter</Button>
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
                                        title: "Exporter en PDF",
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
                    code: "INF101",
                    title: "Introduction à l'Informatique",
                    teacher: "Dr. Kabasele Mwamba",
                    credits: 3,
                    hours: 45,
                    semester: "Semestre 1",
                    type: "Obligatoire",
                },
                {
                    key: "2",
                    code: "INF202",
                    title: "Structures de Données",
                    teacher: "Dr. Mbuyi Tshibanda",
                    credits: 4,
                    hours: 60,
                    semester: "Semestre 2",
                    type: "Obligatoire",
                },
                {
                    key: "3",
                    code: "INF303",
                    title: "Bases de Données",
                    teacher: "Dr. Nzinga Lunda",
                    credits: 3,
                    hours: 45,
                    semester: "Semestre 3",
                    type: "Électif",
                },
                {
                    key: "4",
                    code: "INF404",
                    title: "Développement Web",
                    teacher: "Dr. Ilunga Kalala",
                    credits: 3,
                    hours: 45,
                    semester: "Semestre 4",
                    type: "Obligatoire",
                },
            ]}
            columns={[
                {
                    title: "Code",
                    dataIndex: "code",
                    key: "code",
                },
                {
                    title: "Titre du cours",
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "Crédits",
                    dataIndex: "credits",
                    key: "credits",
                    align: "center",
                },
                {
                    title: "Heures",
                    dataIndex: "hours",
                    key: "hours",
                    align: "center",
                },
                {
                    title: "Type",
                    dataIndex: "type",
                    key: "type",
                    render: (type) => {
                        let color = type === "Obligatoire" ? "blue" : "green";
                        return (
                            <Tag color={color} bordered={false} style={{ borderRadius: 10 }}>
                                {type}
                            </Tag>
                        );
                    },
                },
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <Space>
                            <Button style={{ boxShadow: "none" }}>Voir détails</Button>
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
