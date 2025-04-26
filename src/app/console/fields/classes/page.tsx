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
import { Button, Dropdown, Input, Space, Table, Typography } from "antd";

export default function Page() {
return (
    <Table
        title={() => (
            <header className="flex pb-3">
                <Space>
                    <Input.Search placeholder="Rechercher une promotion ..." />
                </Space>
                <div className="flex-1" />
                <Space>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        title="Ajouter une promotion"
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
                title: "Nom",
            },
            {
                key: "code",
                dataIndex: "code",
                title: "Code",
                render: (value, record) => (
                        `${record.cycle}${record.level}`
                ),
            },
            {
                key: "cycle",
                dataIndex: "cycle",
                title: "Cycle",
                render: (value) => (
                    <Typography.Text>
                        {value === "L" ? "Licence" : value === "M" ? "Master" : "Doctorat"}
                    </Typography.Text>
                ),
            },
            {
                key: "status",
                dataIndex: "status",
                title: "Statut",
                render: (value) => (
                    <Typography.Text type={value === "Active" ? "success" : "danger"}>
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
        dataSource={Array.from({ length: 8 }, (_, index) => ({
            id: (index + 1).toString(),
            name: `Promotion ${index + 1}`,
            level:[0,1,2,3][index % 4],
            cycle: ["L", "M", "D"][index % 3],
            status: index % 2 === 0 ? "Active" : "Inactive",
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
);
}
