"use client";

import { DeleteCourseForm } from "@/app/console/courses/forms/delete";
import { EditCourseForm } from "@/app/console/courses/forms/edit";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import {
  getCourseTypeName,
  getTaughtCoursesByFacultyId,
  getYearStatusColor,
  getYearStatusName,
} from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { Faculty, TaughtCourse } from "@/types";
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
import { Avatar, Button, Dropdown, Input, Space, Table, Tag } from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { record } from "zod";

type ActionsBarProps = {
  record: TaughtCourse;
  faculties?: Faculty[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, faculties }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      {/* <EditCourseForm
        course={record}
        faculties={faculties}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteCourseForm
        course={record}
        open={openDelete}
        setOpen={setOpenDelete}
      /> */}
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
  const { yid } = useYid();
  const { facultyId } = useParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["taught_courses", `${yid}`, facultyId],
    queryFn: ({ queryKey }) =>
      getTaughtCoursesByFacultyId(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!yid && !!facultyId,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }
  console.log(data);
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
          render: (_, record, __) => record?.available_course?.name,
        },
        {
          title: "Code",
          dataIndex: "code",
          key: "code",
          render: (_, record, __) => record?.available_course?.code,
          width: 100,
        },
        {
          title: "Crédits",
          dataIndex: "credits",
          key: "credits",
          align: "center",
          width: 68,
          render: (_, record, __) => record.credit_count,
        },
        {
          title: "Heures théorique",
          dataIndex: "hours",
          key: "hours",
          //   width: 68,
          render: (_, record, __) => record.theoretical_hours,
          ellipsis: true,
        },
        {
          title: "Heures pratique",
          dataIndex: "hours",
          key: "hours",
          //   width: 68,
          render: (_, record, __) => record.practical_hours,
          ellipsis: true,
        },
        {
          title: "Date de début",
          dataIndex: "start_date",
          key: "start_date",
          render: (_, record, __) =>
            record.start_date
              ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                  new Date(`${record.start_date}`)
                )
              : "",
          width: 100,
          ellipsis: true,
        },
        {
          title: "Date de fin",
          dataIndex: "end_date",
          key: "end_date",
          render: (_, record, __) =>
            record?.end_date
              ? new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                  new Date(`${record.end_date}`)
                )
              : "",
          width: 100,
          ellipsis: true,
        },
        {
          title: "Max",
          dataIndex: "max_value",
          key: "max_value",
          render: (_, record, __) => record.max_value,
          width: 44,
          ellipsis: true,
          align: "center",
        },
        {
          title: "Période",
          dataIndex: "period",
          key: "period",
          render: (_, record, __) => record.period?.acronym,
          width: 100,
          ellipsis: true,
        },
        {
          title: "Enseignant",
          dataIndex: "teacher",
          key: "teacher",
          render: (_, record, __) => (
            <Space>
              <Avatar
                style={{
                  backgroundColor: getHSLColor(
                    `${record.teacher?.user.first_name} ${record.teacher?.user.last_name} ${record.teacher?.user.surname}`
                  ),
                }}
              >
                {record.teacher?.user.first_name?.charAt(0).toUpperCase()}
                {record.teacher?.user.last_name?.charAt(0).toUpperCase()}
              </Avatar>{" "}
              {record.teacher?.user.surname}
            </Space>
          ),
          ellipsis: true,
        },
        {
          title: "Statut",
          dataIndex: "status",
          key: "status",
          render: (_, record, __) => (
            <Tag
              color={getYearStatusColor(`${record.status}`)}
              style={{ border: 0 }}
            >
              {getYearStatusName(`${record.status}`)}
            </Tag>
          ),
          width: 100,
          ellipsis: true,
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
