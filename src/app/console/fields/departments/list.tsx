"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { Department } from "@/types";
import { getDepartments } from "@/utils";
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
import { EditDepartmentForm } from "./forms/edit";
import { DeleteDepartmentForm } from "./forms/delete";
import { NewDepartmentForm } from "./forms/new";

type ActionsBarProps = {
  record: Department;
};

const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <Button
        title="Gérer le département"
        onClick={() => {}}
        style={{ boxShadow: "none" }}
      >
        Gérer
      </Button>
      <EditDepartmentForm
        department={record}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteDepartmentForm
        department={record}
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

export function ListDepartments() {
  const {
    data: departments,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
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
            <Input.Search placeholder="Rechercher un département ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <NewDepartmentForm/>
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
          title: "Nom du département",
        },
        {
          key: "acronym",
          dataIndex: "acronym",
          title: "Code",
          width: 100,
        },
        {
          key: "faculty",
          dataIndex: "faculty",
          title: "Faculté",
          render: (_, record, __) => `${record.faculty.name}`,
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
      dataSource={departments}
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
