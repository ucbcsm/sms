"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
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
  Tag,
} from "antd";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { EditPeriodForm } from "./forms/edit";
import { DeletePeriodForm } from "./forms/delete";
import { NewPeriodForm } from "./forms/new";

type ActionsBarProps = {
  record: Period;
};

const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditPeriodForm period={record} open={openEdit} setOpen={setOpenEdit} />
      <DeletePeriodForm
        period={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
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
          onClick: ({ key }) => {
            if (key === "edit") {
              setOpenEdit(true);
            } else if (key === "delete") {
              setOpenDelete(true);
            }
          },
        }}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};

export function ListPeriods() {
  const {
    data: periods,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: getPeriods,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }
  if (isError) {
    return <DataFetchErrorResult />;
  }

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
            <NewPeriodForm/>
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
      columns={[
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
          render: (_, record, __) =>
            dayjs(record.start_date).format("DD/MM/YYYY"),
        },
        {
          title: "Date de fin",
          key: "dates",
          render: (_, record, __) =>
            dayjs(record.end_date).format("DD/MM/YYYY"),
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
          render: (_, record, __) => <ActionsBar record={record} />,
          width: 50,
        },
      ]}
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
