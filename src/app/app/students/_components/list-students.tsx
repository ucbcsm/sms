"use client";

import {
  getClasses,
  getClassesYearsAsOptions,
  getCurrentCyclesAsOptions,
  getCurrentDepartmentsAsOptions,
  getCurrentFacultiesAsOptions,
  getDepartmentsByFacultyId,
  getFaculties,
  getYearEnrollments,
} from "@/lib/api";
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
  Typography,
} from "antd";
import { FC, useState } from "react";
import { useYid } from "@/hooks/use-yid";
import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import { DataFetchErrorResult } from "@/components/errorResult";
import Link from "next/link";
import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";
import {
  DownloadOutlined,
  MoreOutlined,
  PrinterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { StudentMoreActionsDropdown } from "./moreActions";
import { usePathname } from "next/navigation";
import { usePrevPathname } from "@/hooks/usePrevPathname";
import { ExportTemplateFormModal } from "./exportTemplateFormModal";
import { useCycles } from "@/hooks/useCycles";
import { ImportStudentsDataDrawer } from "./importStudentsDataDrawer";

export const ListStudents: FC = () => {
  const { yid } = useYid();
  const pathname = usePathname();
  const { setPathname } = usePrevPathname();

  const [openExportTemplate, setOpenExportTemplate] = useState<boolean>(false);
  const [openImportData, setOpenImportData]= useQueryState("import", parseAsBoolean.withDefault(false))

  const [cycleId, setCycleId] = useQueryState(
    "cycle",
    parseAsInteger.withDefault(0)
  );
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
      cycleId,
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
        cycleId: cycleId !== 0 ? cycleId : undefined,
        facultyId: facultyId !== 0 ? facultyId : undefined,
        departmentId: departmentId !== 0 ? departmentId : undefined,
        classId: classId !== 0 ? classId : undefined,
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
        search: search !== null && search.trim() !== "" ? search : undefined,
      }),
    enabled: !!yid,
  });

  const {data:cycles}=useCycles()

  const { data: faculties, isPending: isPendingFaculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  const { data: departments, isPending: isPendingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
  });

  const { data: classes, isPending: isPendingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  console.log("Dep:",departments)

  if (isErrorStudents) {
    return <DataFetchErrorResult />;
  }

  return (
    <>
      <Table
        title={() => (
          <header className="flex flex-col md:flex-row md:items-end  pb-3 gap-2">
            <Space wrap>
              <div className="flex flex-row md:flex-col gap-2">
                <Typography.Text type="secondary">Cycle</Typography.Text>
                <Select
                  value={cycleId}
                  variant="filled"
                  onChange={(value) => {
                    setPage(0);
                    setCycleId(value);
                  }}
                  options={[
                    { value: 0, label: "Tous les cycles" },
                    ...(getCurrentCyclesAsOptions(cycles) || []),
                  ]}
                  style={{ minWidth: 150 }}
                  loading={isPendingFaculties}
                />
              </div>
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
                  loading={isPendingFaculties}
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
                  loading={facultyId !== 0 && isPendingDepartments}
                />
              </div>
            </Space>
            <div className="flex-1" />
            <Space wrap>
              <Input.Search
                placeholder="Rechercher un étudiant ..."
                // onChange={(e) => {
                //   // if(search && e.target.value.trim()!==""){
                //   setPage(0);
                //   setSearch(e.target.value);
                //   // }
                // }}
                onSearch={(value) => {
                  setPage(0);
                  setSearch(value);
                }}
                allowClear
                variant="filled"
                value={search?.trim() || undefined}
              />
              <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
                Imprimer
              </Button>
              <Dropdown
                arrow
                menu={{
                  items: [
                    {
                      key: "import",
                      label: "Importer les données des étudiants",
                      icon: <UploadOutlined />,
                      title: "Importer les données des étudiants",
                    },
                    {
                      type: "divider",
                    },
                    {
                      key: "export",
                      label: "Télécharger le modèle d'import .xlsx",
                      icon: <DownloadOutlined />,
                      title: "Modèle d'import Excel",
                    },
                  ],
                  onClick: ({ key }) => {
                    if (key === "export") {
                      setOpenExportTemplate(true);
                    } else if (key === "import") {
                      setOpenImportData(true);
                    }
                  },
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
                src={getPublicR2Url(record.user.avatar)}
                style={{
                  backgroundColor: getHSLColor(
                    `${record.user.surname} ${record.user.last_name} ${record.user.first_name}`
                  ),
                }}
              >
                {record?.user.first_name?.charAt(0).toUpperCase()}
              </Avatar>
            ),
            width: 56,
          },
          {
            title: "Noms",
            dataIndex: "name",
            key: "name",
            render: (value, record) => (
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
              <Link href={`/student/${record.id}`}>
                {record.user.matricule}
              </Link>
            ),
            width: 80,
            align: "center",
          },
          {
            title: "Genre",
            dataIndex: "gender",
            key: "gender",
            render: (_, record, __) => record.user.gender,
            width: 56,
            align: "center",
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
        scroll={{ y: "calc(100vh - 362px)" }}
        size="small"
        bordered
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
        onRow={(row) => {
          return {
            onClick: () => {
              setPathname(pathname);
            },
          };
        }}
      />
      <ExportTemplateFormModal
        open={openExportTemplate}
        setOpen={setOpenExportTemplate}
        cycles={cycles}
        faculties={faculties}
        departments={departments}
        classes={classes}
      />
      <ImportStudentsDataDrawer
        open={openImportData}
        setOpen={setOpenImportData}
        yearId={Number(yid)}
        cycles={cycles}
        faculties={faculties}
        departments={departments}
        classes={classes}
      />
    </>
  );
};
