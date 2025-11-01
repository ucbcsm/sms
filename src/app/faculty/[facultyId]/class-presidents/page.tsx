"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  getClasses,
  getClassPresidentsByFaculty,
  getDepartmentsByFacultyId,
  getYearEnrollmentsByFacultyId,
} from "@/lib/api";
import { Class, ClassPresident, Department, Enrollment } from "@/types";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Layout,
  Skeleton,
  Space,
  Table,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { Palette } from "@/components/palette";
import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import { NewClassPresidentForm } from "./forms/new";
import { EditClassPresidentForm } from "./forms/edit";
import { useYid } from "@/hooks/use-yid";

type ActionsBarProps = {
  record: ClassPresident;
  departments?: Department[];
  classes?: Class[];
  students?: Enrollment[];
};

const ActionsBar: FC<ActionsBarProps> = ({
  record,
  departments,
  classes,
  students,
}) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  //   const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditClassPresidentForm
        classPresident={record}
        departments={departments}
        classes={classes}
        students={students}
        open={openEdit}
        setOpen={setOpenEdit}
      />
    </Space>
  );
};

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { yid } = useYid();
  const { facultyId } = useParams();

  const {
    data: class_presidents,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["class_presidents", facultyId],
    queryFn: ({ queryKey }) => getClassPresidentsByFaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const {
    data: classes,
    isPending: isPendingClasses,
    isError: isErrorClasses,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  const {
    data: students,
    isPending: isPendingStudents,
    isError: isErrorStudents,
  } = useQuery({
    queryKey: ["year_enrollments", `${yid}`, facultyId],
    queryFn: ({ queryKey }) =>
      getYearEnrollmentsByFacultyId(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!yid && !!facultyId,
  });


  if (isError) {
    return <DataFetchErrorResult />;
  }
  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            {/* <BackButton /> */}
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                Chefs de promotion
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            
          </Space>
        </Layout.Header>

        <Table
          loading={isPending}
          // bordered
          title={() => (
            <header className="flex pb-3">
              <Space>
                <Typography.Title
                  level={5}
                  style={{ marginBottom: 0 }}
                  type="secondary"
                >
                  Liste des chefs
                </Typography.Title>
              </Space>
              <div className="flex-1" />
              <Space>
                <NewClassPresidentForm
                  departments={departments}
                  classes={classes}
                  students={students}
                />
                <Button
                  icon={<PrinterOutlined />}
                  style={{ boxShadow: "none" }}
                >
                  Imprimer
                </Button>
                {/* <Dropdown
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
                </Dropdown> */}
              </Space>
            </header>
          )}
          dataSource={class_presidents}
          columns={[
            {
              title: "Photo",
              dataIndex: "student",
              key: "photo",
              render: (_, record, __) => (
                <Avatar
                  style={{
                    backgroundColor: getHSLColor(
                      `${record.student?.user.surname} ${record.student?.user.last_name} ${record.student?.user.first_name}`
                    ),
                  }}
                  src={getPublicR2Url(record.student?.user.avatar)}
                >
                  {record.student?.user.first_name?.charAt(0).toUpperCase()}
                </Avatar>
              ),
              width: 56,
            },
            {
              title: "Matricule",
              dataIndex: "student",
              key: "matricule",
              render: (_, record, __) => record.student?.user.matricule,
              width: 80,
            },
            {
              title: "Noms",
              dataIndex: "student",
              key: "student",
              render: (_, record, __) =>
                `${record.student?.user.surname} ${record.student.user.last_name} ${record.student.user.first_name}`,
            },
            {
              title: "Promotion",
              dataIndex: "class_year",
              key: "class_year",
              render: (_, record, __) =>
                `${record.class_year.acronym} ${record.departement.name}`,
            },
            {
              title: "",
              key: "actions",
              render: (_, record, __) => {
                return (
                  <ActionsBar
                    record={record}
                    departments={departments}
                    classes={classes}
                    students={students}
                  />
                );
              },
              width: 128,
            },
          ]}
          rowKey="id"
          rowClassName={`bg-white odd:bg-[#f5f5f5]`}
          // rowSelection={{
          //   type: "checkbox",
          // }}
          scroll={{ y: "calc(100vh - 270px)" }}
          size="small"
          pagination={{
            defaultPageSize: 25,
            pageSizeOptions: [25, 50, 75, 100],
            size: "small",
          }}
        />
      </Layout.Content>
    </Layout>
  );
}
