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
import { Button, Dropdown, Input, Space, Table, TableColumnType } from "antd";

const columns: TableColumnType<any>[] = [
  {
    title: "Nom",
    dataIndex: "name",
    key: "name",
    render: (text, record) => text,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Date de début",
    key: "dates",
    render: (_, record) => `${record.startDate}`,
  },
  {
    title: "Date de fin",
    key: "dates",
    render: (_, record) => `${record.endDate}`,
  },
  {
    title: "Statut",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "",
    key: "actions",
    render: (_, record) => (
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
    ),
    width: 50,
  },
];

export default function Page() {
  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher une période ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              title="Ajouter un période"
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
      dataSource={[
        {
          id: "1",
          name: "Semestre 1",
          type: "Semestre",
          startDate: "01/01/2023",
          endDate: "30/06/2023",
          status: "En cours",
        },
        {
          id: "2",
          name: "Semestre 2",
          type: "Semestre",
          startDate: "01/07/2023",
          endDate: "31/12/2023",
          status: "À venir",
        },
        {
          id: "3",
          name: "Bloc semestre",
          type: "Session",
          startDate: "01/08/2023",
          endDate: "31/08/2023",
          status: "Terminée",
        },
        {
          id: "5",
          name: "Session spéciale",
          type: "Session",
          startDate: "01/09/2023",
          endDate: "30/09/2023",
          status: "À venir",
        },
      ]}
      columns={columns}
      rowKey="id"
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
