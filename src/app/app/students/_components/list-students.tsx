"use client";

import { getClasses, getClassesYearsAsOptions, getCurrentDepartmentsAsOptions, getCurrentFacultiesAsOptions, getDepartmentsByFacultyId, getFaculties, getYearEnrollments } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Input,
  List,
  Select,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { FC } from "react";
import { useYid } from "@/hooks/use-yid";
import { useParams, useRouter } from "next/navigation";
import { Enrollment } from "@/types";
import { getHSLColor } from "@/lib/utils";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { DataFetchErrorResult } from "@/components/errorResult";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { DownOutlined, FileExcelOutlined, FilePdfOutlined, MoreOutlined, PrinterOutlined } from "@ant-design/icons";

type ListItemProps = {
  item: Enrollment;
};

export const ListItem: FC<ListItemProps> = ({ item }) => {
  const {
    token: { colorBgTextHover },
  } = theme.useToken();
  const router = useRouter();
  const { studentId } = useParams();

  const goToStudentDetails = () => {
    router.push(`/app/students/${item.id}`);
  };
  return (
    <Link href={`/app/students/${item.id}`}>
      <List.Item
        style={{
          background: Number(studentId) === item.id ? colorBgTextHover : "",
          cursor: "pointer",
          // paddingLeft: 12,
          // paddingRight: 12,
          // borderRadius:Number(studentId) === item.id ? 8 : ""
        }}
        // onClick={goToStudentDetails}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={item.user?.avatar}
              style={{
                backgroundColor: getHSLColor(
                  `${item.user.first_name} ${item.user.last_name} ${item.user.surname}`
                ),
              }}
            >
              {item.user.first_name?.charAt(0).toUpperCase()}
              {item.user.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={
            <Typography.Text>
              {item.user.first_name} {item.user.last_name} {item.user.surname} [
              {item.user.matricule}]
            </Typography.Text>
          }
          description={
            <Flex justify="space-between">
              <span>
                {item.class_year?.acronym || ""} {item.departement.name}
              </span>
              <Tag
                bordered={false}
                color={item.status === "enabled" ? "success" : "red"}
                className=" rounded-full"
                style={{ marginRight: 0 }}
              >
                {item.status === "enabled" ? "Actif" : "Abandon"}
              </Tag>
            </Flex>
          }
        />
      </List.Item>
    </Link>
  );
};

export const ListStudents: FC = () => {
  const { yid } = useYid();
  const router = useRouter();
    const [facultyId, setFacultyId] = useQueryState(
      "fac",
      parseAsInteger.withDefault(0)
    );
   const [departmentId, setDepartmentId] = useQueryState(
      "dep",
      parseAsInteger.withDefault(0)
    );
    const [classId, setClassId] = useQueryState(
      "class",
      parseAsInteger.withDefault(0)
    );
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
    const [pageSize, setPageSize] = useQueryState(
      "size",
      parseAsInteger.withDefault(0)
    );
    const [search, setSearch] = useQueryState("search");
  const {
    data: data,
    isPending: isPendingStudents,
    isError: isErrorStudents,
  } = useQuery({
    queryKey: [
      "year_enrollments",
      `${yid}`,
      facultyId,
      departmentId,
      classId,
      page,
      pageSize,
      search,
    ],
    queryFn: ({ queryKey }) =>
      getYearEnrollments({
        yearId: Number(queryKey[1]),
        facultyId: Number(queryKey[2]),
        departmentId: departmentId !== 0 ? departmentId : undefined,
        classId: classId !== 0 ? classId : undefined,
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
        search: search !== null && search.trim() !== "" ? search : undefined,
      }),
    enabled: !!yid,
  });

    const { data: faculties, isPending: isPendingFacalties } = useQuery({
      queryKey: ["faculties"],
      queryFn: getFaculties,
    });

      const { data: departments, isPending: isPendingDepartments } = useQuery({
        queryKey: ["departments", facultyId],
        queryFn: ({ queryKey }) =>
          getDepartmentsByFacultyId(Number(queryKey[1])),
        enabled: !!facultyId,
      });

      const { data: classes, isPending: isPendingClasses } = useQuery({
        queryKey: ["classes"],
        queryFn: getClasses,
      });


  if (isErrorStudents) {
    return <DataFetchErrorResult />;
  }

  return (
    <Table
      title={() => (
        <header className="flex flex-col md:flex-row md:items-end  pb-3 gap-2">
          <Space wrap>
            <div className="flex flex-row md:flex-col gap-2">
              <Typography.Text type="secondary">Filière</Typography.Text>
              <Select
                value={facultyId}
                variant="filled"
                onChange={(value) => {
                  setPage(0);
                  setFacultyId(value);
                }}
                options={[
                  { value: 0, label: "Toutes les filières" },
                  ...(getCurrentFacultiesAsOptions(faculties) || []),
                ]}
                style={{ minWidth: 150 }}
                loading={isPendingFacalties}
              />
            </div>
            <div className="flex flex-row md:flex-col gap-2">
              <Typography.Text type="secondary">Promotion</Typography.Text>
              <Select
                value={classId}
                variant="filled"
                onChange={(value) => {
                  setPage(0);
                  setClassId(value);
                }}
                options={[
                  { value: 0, label: "Toutes les promotions" },
                  ...(getClassesYearsAsOptions({ classes }) || []),
                ]}
                loading={isPendingClasses}
                style={{ minWidth: 92, maxWidth: 160 }}
              />
            </div>
            <div className="flex flex-row md:flex-col gap-2">
              <Typography.Text type="secondary">Mention</Typography.Text>
              <Select
                value={departmentId}
                variant="filled"
                onChange={(value) => {
                  setPage(0);
                  setDepartmentId(value);
                }}
                options={[
                  { value: 0, label: "Toutes les mentions" },
                  ...(getCurrentDepartmentsAsOptions(departments) || []),
                ]}
                style={{ minWidth: 150 }}
                loading={isPendingDepartments}
              />
            </div>
          </Space>
          <div className="flex-1" />
          <Space>
            <Input.Search
              placeholder="Rechercher un étudiant ..."
              onChange={(e) => {
                setPage(0);
                setSearch(e.target.value);
              }}
              allowClear
              variant="filled"
            />
            <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
              Imprimer
            </Button>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "pdf",
                    label: "Exporter .pdf",
                    icon: <FilePdfOutlined />,
                    title: "Exporter en pdf",
                  },
                  {
                    key: "excel",
                    label: "Exporter .xlsx",
                    icon: <FileExcelOutlined />,
                    title: "Exporter vers Excel",
                  },
                ],
              }}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ boxShadow: "none" }}
              />
            </Dropdown>
          </Space>
        </header>
      )}
      dataSource={data?.results}
      columns={[
        {
          title: "Photo",
          dataIndex: "avatar",
          key: "avatar",
          render: (_, record) => (
            <Avatar
              src={record.user.avatar || null}
              style={{
                backgroundColor: getHSLColor(
                  `${record.user.first_name} ${record.user.last_name} ${record.user.surname}`
                ),
              }}
            >
              {record?.user.first_name?.charAt(0).toUpperCase()}
              {record?.user.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          ),
          width: 56,
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          render: (_, record) => (
            <Link href={`/student/${record.id}`}>
              {record.user.matricule.padStart(6, "0")}
            </Link>
          ),
          width: 80,
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "name",
          key: "name",
          render: (value, record) => (
            <Link href={`/student/${record.id}`}>
              {record.user.first_name} {record.user.last_name}{" "}
              {record.user.surname}
            </Link>
          ),
          ellipsis: true,
        },
        {
          title: "Filière",
          dataIndex: "faculty",
          render: (_, record, __) => `${record.faculty.name}`,
          key: "faculty",
          ellipsis: true,
        },
        {
          title: "Promotion",
          dataIndex: "promotion",
          render: (_, record, __) => `${record.class_year.acronym}`,
          key: "class",
          width: 86,
          ellipsis: true,
        },
        {
          title: "Mention",
          dataIndex: "department",
          key: "department",
          render: (_, record, __) => `${record.departement.name}`,
          ellipsis: true,
        },
        {
          title: "Statut",
          dataIndex: "status",
          key: "status",
          width: 96,
          render: (_, record, __) => (
            <Tag
              bordered={false}
              color={record.status === "enabled" ? "success" : "red"}
              className="w-full mr-0"
            >
              {record.status === "enabled" ? "Actif" : "Abandon"}
            </Tag>
          ),
          align: "start",
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record, __) => (
            <Space>
              <Link href={`/student/${record.id}`}>
                <Button
                  color="primary"
                  variant="dashed"
                  // onClick={() => router.push(`/student/${record.id}`)}
                  style={{ boxShadow: "none" }}
                >
                  Gérer
                </Button>
              </Link>
              {/* <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Action 1" },
                    { key: "2", label: "Action 2" },
                    { key: "3", label: "Action 3" },
                  ],
                }}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown> */}
            </Space>
          ),
          width: 120,
        },
      ]}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      rowSelection={{
        type: "checkbox",
      }}
      size="small"
      loading={isPendingStudents}
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
        showSizeChanger: true,
        total: data?.count,
        current: page !== 0 ? page : 1,
        pageSize: pageSize !== 0 ? pageSize : 25,
        onChange: (page, pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        },
      }}
    />
  );
};
