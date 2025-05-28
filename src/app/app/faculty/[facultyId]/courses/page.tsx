"use client";

import { DeleteCourseForm } from "@/app/console/courses/forms/delete";
import { EditCourseForm } from "@/app/console/courses/forms/edit";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getCoursesByFacultyId, getCourseTypeName } from "@/lib/api";
import { Course, Faculty } from "@/types";
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
import { Button, Dropdown, Input, Space, Table, Tag } from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";

type ActionsBarProps = {
  record: Course;
  faculties?: Faculty[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, faculties }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditCourseForm
        course={record}
        faculties={faculties}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteCourseForm
        course={record}
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

export default function Page() {
    const {facultyId}=useParams()
     const { data, isPending, isError } = useQuery({
    queryKey: ["courses", facultyId],
    queryFn: ({ queryKey }) =>
      getCoursesByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

   if (isPending) {
     return <DataFetchPendingSkeleton variant="table" />;
   }

   if (isError) {
     return <DataFetchErrorResult />;
   }
    return (
      <Table
        title={() => (
          <header className="flex pb-3">
            <Space>
              <Input.Search placeholder="Rechercher un cours dans le catalogue ..." />
            </Space>
            <div className="flex-1" />
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
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
        dataSource={data}
        columns={[
          {
            title: "Titre du cours",
            dataIndex: "title",
            key: "title",
            render: (_, record, __) => record.name,
          },
          {
            title: "Code",
            dataIndex: "code",
            key: "code",
            width:100,
          },
          {
            title: "Nature",
            dataIndex: "course_type",
            key: "type",
            render: (_, record, __) =>getCourseTypeName(record.course_type),
            // width:100,
            ellipsis:true
          },
          {
            title: "",
            key: "actions",
            render: (_, record, __) => {
              return <ActionsBar record={record} />;
            },
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
