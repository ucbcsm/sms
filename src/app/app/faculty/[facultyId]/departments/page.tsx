"use client";

import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    MoreOutlined,
    PrinterOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Space, Table} from "antd";
import { useRouter } from "next/navigation";

export default function Page() {
    const router =useRouter()
    return (
        <Table
            title={() => (
                <header className="flex pb-3">
                    <Space>
                        <Input.Search placeholder="Rechercher un département ..." />
                    </Space>
                    <div className="flex-1" />
                    <Space>
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
                    name: "Informatique",
                    head: "Dr. Alice Dupont",
                    programs: 6,
                    students: 400,
                },
                {
                    key: "2",
                    name: "Mathématiques",
                    head: "Dr. Jean Martin",
                    programs: 6,
                    students: 250,
                },
                {
                    key: "3",
                    name: "Physique",
                    head: "Dr. Clara Bernard",
                    programs: 6,
                    students: 300,
                },
                {
                    key: "4",
                    name: "Chimie",
                    head: "Dr. Pierre Durand",
                    programs: 6,
                    students: 150,
                },
            ]}
            columns={[
                {
                    title: "Nom du département",
                    dataIndex: "name",
                    key: "name",
                },
                {
                    title: "Programmes",
                    dataIndex: "programs",
                    key: "programs",
                },
                {
                    title: "Etudiants",
                    dataIndex: "students",
                    key: "students",
                    align: "end",
                },
                {
                    title: "Actions",
                    key: "actions",
                    render: (_, record) => (
                        <Space>
                            <Button style={{ boxShadow: "none" }} onClick={()=>{router.push(`/app/department/1`)}}>Voir détails</Button>
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
