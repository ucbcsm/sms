"use client";

import { StudentMoreActionsDropdown } from "@/app/app/students/_components/moreActions";
import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import { useClasses } from "@/hooks/useClasses";
import { usePrevPathname } from "@/hooks/usePrevPathname";
import {
  getClasses,
  getClassesYearsAsOptions,
  getCurrentDepartmentsAsOptions,
  getDepartmentsByFacultyId,
  getYearEnrollments,
} from "@/lib/api";
import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import {
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";

export default function Page() {
  const { facultyId } = useParams();
  const pathname = usePathname();
  const { setPathname } = usePrevPathname();
  const { yid } = useYid();
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
    data,
    isPending: isPendingEnrollememts,
    isError,
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
    enabled: !!yid && !!facultyId,
  });

  const { data: departments, isPending: isPendingDepartments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: classes, isPending: isPendingClasses } = useClasses();

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Table
      bordered
      title={() => (
        <header className="flex pb-3">
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
          </Space>
          <div className="flex-1" />
          <Space>
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
            <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
              Imprimer
            </Button>
            {/* <Dropdown
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
            </Dropdown> */}
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
              src={getPublicR2Url(record.user.avatar)}
              style={{
                backgroundColor: getHSLColor(
                  `${record.user.first_name} ${record.user.last_name} ${record.user.surname}`
                ),
              }}
            >
              {record?.user.first_name?.charAt(0).toUpperCase()}
            </Avatar>
          ),
          width: 56,
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "name",
          key: "name",
          render: (_, record) => (
            <Link href={`/student/${record.id}`}>
              {record.user.surname} {record.user.last_name}{" "}
              {record.user.first_name}
            </Link>
          ),
          ellipsis: true,
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          render: (_, record) => (
            <Link href={`/student/${record.id}`}>{record.user.matricule}</Link>
          ),
          width: 80,
          align: "center",
        },
        {
          title: "Genre",
          dataIndex: "gender",
          key: "gender",
          render: (_, record, __) => record.user.gender || "",
          width: 56,
          align: "center",
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
          title: "Département",
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
              <StudentMoreActionsDropdown studentYearId={record.id} />
            </Space>
          ),
          width: 120,
        },
      ]}
      rowKey="id"
      rowClassName={`bg-white odd:bg-[#f5f5f5]`}
      rowSelection={{
        type: "checkbox",
      }}
      scroll={{ y: "calc(100vh - 394px)" }}
      size="small"
      loading={isPendingEnrollememts}
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
      onRow={(row) => {
        return {
          onClick: () => {
            setPathname(pathname);
          },
        };
      }}
    />
  );
}
