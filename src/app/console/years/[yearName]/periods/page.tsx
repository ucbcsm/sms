"use client";

import { Period } from "@/types";
import { getPeriods } from "@/utils/api/period";
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
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  TableColumnType,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { record } from "zod";

const columns: TableColumnType<Period>[] = [
  {
    title: "Nom",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Date de début",
    key: "dates",
    render: (_, record, __) => dayjs(record.start_date).format("DD/MM/YYYY"),
  },
  {
    title: "Date de fin",
    key: "dates",
    render: (_, record, __) => dayjs(record.end_date).format("DD/MM/YYYY"),
  },
  {
    title: "Statut",
    dataIndex: "status",
    key: "status",
    render: (_, record, __) => {
      let color = "";
      let text = "";
      switch (record.status) {
        case "pending":
          color = "orange";
          text = "En attente";
          break;
        case "progress":
          color = "blue";
          text = "En cours";
          break;
        case "finished":
          color = "green";
          text = "Terminé";
          break;
        case "suspended":
          color = "red";
          text = "Suspendu";
          break;
        default:
          color = "default";
          text = "Inconnu";
      }
      return (
        <Tag color={color} style={{ border: 0 }}>
          {text}
        </Tag>
      );
    },
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
  const { data: periods, isPending } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });
  return (
    <Table
      loading={isPending}
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
      dataSource={periods}
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
