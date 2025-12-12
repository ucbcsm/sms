"use client";

import { DeleteCourseForm } from "@/app/faculty/[facultyId]/courses/forms/delete";
import { EditCourseForm } from "@/app/faculty/[facultyId]/courses/forms/edit";
import { DataFetchErrorResult } from "@/components/errorResult";
import {
  getAllCourses,
  getCourses,
  getCourseTypeName,
  getCycles,
  getFaculties,
  getTeachingUnitsByfaculty,
} from "@/lib/api";
import { Course, Faculty, TeachingUnit } from "@/types";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Space,
  Splitter,
  Table,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewCourseForm } from "@/app/faculty/[facultyId]/courses/forms/new";
import { ListTeachingUnits } from "./teaching-units/list";
import { parseAsInteger, useQueryState, } from "nuqs";

type ActionsBarProps = {
  record: Course;
  faculties?: Faculty[];
  courses?: Course[];
  teachingUnits?: TeachingUnit[];
};

const ActionsBar: FC<ActionsBarProps> = ({ record, faculties,courses,teachingUnits }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditCourseForm
        course={record}
        faculties={faculties}
        courses={courses}
        teachingUnits={teachingUnits}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteCourseForm
        course={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <Dropdown
        arrow
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
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  
  const { facultyId } = useParams();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));

  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(25)
  );

  const [search, setSearch] = useQueryState("search");

  const { data, isPending:isPendngCourses, isError } = useQuery({
    queryKey: ["courses", facultyId, page, pageSize, search],
    queryFn: ({ queryKey }) =>
      getCourses({
        facultyId: Number(queryKey[1]),
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
        search: search !== null && search?.trim() !== "" ? search : undefined,
      }),
    enabled: !!facultyId,
  });

    const { data: allCourses } = useQuery({
      queryKey: ["all-courses", facultyId, "all"],
      queryFn: ({ queryKey }) =>
        getAllCourses({ facultyId: Number(queryKey[1]) }),
      enabled: !!facultyId,
    });

    const { data: teachingUnits, isPending } = useQuery({
      queryKey: ["teaching-units", facultyId],
      queryFn: ({ queryKey }) => getTeachingUnitsByfaculty(Number(queryKey[1])),
      enabled: !!facultyId,
    });

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const { data: cycles } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });

  // if (isPending) {
  //   return <DataFetchPendingSkeleton variant="table" />;
  // }
console.log(data);
  if (isError) {
    return <DataFetchErrorResult />;
  }
  return (
    <Splitter>
      <Splitter.Panel
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          // background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f5f5f5",
            padding: 0,
          }}
        >
          <Space>
            {/* <BackButton /> */}

            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Catalogue de cours
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>{/* <Palette /> */}</Space>
        </Layout.Header>

        <Table
          title={() => (
            <header className="flex">
              <Space>
                <Input.Search
                  placeholder="Titre, code ..."
                  onSearch={(value) => {
                    setPage(0);
                    setSearch(value);
                  }}
                  allowClear
                  prefix={<SearchOutlined />}
                  enterButton={<Button type="primary">Rechercher</Button>}
                />
              </Space>
              <div className="flex-1" />
              <Space>
                <NewCourseForm
                  faculties={faculties?.filter(
                    (fac) => fac.id === Number(facultyId)
                  )}
                  courses={allCourses}
                  teachingUnits={teachingUnits}
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
          dataSource={data?.results}
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
              width: 100,
            },
            {
              title: "Nature",
              dataIndex: "course_type",
              key: "type",
              render: (_, record, __) => getCourseTypeName(record.course_type),
              ellipsis: true,
            },
            {
              title: "Unité d'enseignement",
              dataIndex: "teaching_unit",
              key: "teaching_unit",
              render: (_, record, __) => record.teaching_unit?.name || "-",
              ellipsis: true,
            },
            {
              title: "Prérequis",
              dataIndex: "prerequisite_courses",
              key: "prerequisite_courses",
              render: (_, record, __) => (
                <Space wrap>
                  {record.prerequisite_courses.map((c) => (
                    <Tooltip title={c.name} key={c.id}>
                      <Tag style={{ marginRight: 0 }} variant="filled">
                        {c.code}
                      </Tag>
                    </Tooltip>
                  ))}
                </Space>
              ),
              ellipsis: true,
            },
            {
              title: "",
              key: "actions",
              render: (_, record, __) => {
                return (
                  <ActionsBar
                    record={record}
                    faculties={faculties?.filter(
                      (fac) => fac.id === Number(facultyId)
                    )}
                    courses={allCourses}
                    teachingUnits={teachingUnits}
                  />
                );
              },
              width: 50,
            },
          ]}
          rowKey="id"
          rowClassName={`bg-white odd:bg-[#f5f5f5]`}
          rowSelection={{
            type: "checkbox",
          }}
          scroll={{ y: "calc(100vh - 319px)" }}
          size="small"
          bordered
          loading={isPendngCourses}
          pagination={{
            defaultPageSize: 25,
            pageSizeOptions: [25, 50, 75, 100],
            size: "small",
            showSizeChanger: true,
            current: page !== 0 ? page : 1,
            pageSize: pageSize !== 0 ? pageSize : 25,
            total: data?.count,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Splitter.Panel>
      <Splitter.Panel min={400} max={512}>
        <ListTeachingUnits cycles={cycles} />
      </Splitter.Panel>
    </Splitter>
  );
}
