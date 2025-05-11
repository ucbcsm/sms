"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { Class } from "@/types";
import { getClasses } from "@/utils/api/class";
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
import { Button, Dropdown, Input, Space, Table } from "antd";
import { FC, useState } from "react";
import { EditClassForm } from "./forms/edit";
import { DeleteClassForm } from "./forms/delete";
import { NewClassForm } from "./forms/new";

type ActionsBarProps = {
  record: Class;
};

const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditClassForm classe={record} open={openEdit} setOpen={setOpenEdit} />
      <DeleteClassForm
        classe={record}
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

export function ListClasses() {
  const {
    data: classes,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
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
            <Input.Search placeholder="Rechercher une promotion ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewClassForm/>
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
          key: "acronym",
          dataIndex: "acronym",
          title: "Code",
          width: 100,
        },
        {
          key: "cycle",
          dataIndex: "cycle",
          title: "Cycle",
          render: (_, record, __) => `${record.cycle?.name || ""}`,
        },
        {
          key: "actions",
          dataIndex: "actions",
          render: (_, record, __) => {
            return <ActionsBar record={record} />;
          },
          width: 50,
        },
      ]}
      dataSource={classes}
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
