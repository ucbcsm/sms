"use client";
import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import { PeriodEnrollment } from "@/types";
import {
  CheckOutlined,
  CloseOutlined,
  HourglassOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Select,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { PendingSinglePeriodEnrollmentForm } from "./forms/decisions/pending";
import { ValidateSignlePeriodEnllmentForm } from "./forms/decisions/validate";
import { RejectSinglePeriodEnrollmentForm } from "./forms/decisions/reject";
import { parseAsInteger, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import {
  getClasses,
  getClassesYearsAsOptions,
  getCurrentDepartmentsAsOptions,
  getDepartmentsByFacultyId,
  getPeriodEnrollments,
} from "@/lib/api";
import { useYid } from "@/hooks/use-yid";
import { DeleteSinglePeriodEnrollmentForm } from "./forms/decisions/delete";

type ActionsBarProps = {
  item: PeriodEnrollment;
};
const ActionsBar: FC<ActionsBarProps> = ({ item }) => {
  const {
    token: { colorSuccessActive, colorWarningActive },
  } = theme.useToken();
  const [openPending, setOpenPending] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <>
      <PendingSinglePeriodEnrollmentForm
        open={openPending}
        setOpen={setOpenPending}
        enrollment={item}
      />
      <ValidateSignlePeriodEnllmentForm
        open={openValidate}
        setOpen={setOpenValidate}
        enrollment={item}
      />
      <RejectSinglePeriodEnrollmentForm
        open={openReject}
        setOpen={setOpenReject}
        enrollment={item}
      />
      <DeleteSinglePeriodEnrollmentForm
        open={openDelete}
        setOpen={setOpenDelete}
        enrollment={item}
      />

      <Space>
        <Link href={`/student/${item.year_enrollment.id}`}>
          <Button
            color="primary"
            variant="dashed"
            style={{ boxShadow: "none" }}
          >
            Gérer
          </Button>
        </Link>
        <Dropdown
          menu={{
            items: [
              item.status === "pending" || item.status === "rejected"
                ? {
                    key: "validate",
                    label: "Accepter",
                    icon: (
                      <CheckOutlined style={{ color: colorSuccessActive }} />
                    ),
                  }
                : null,
              item.status === "validated" || item.status === "rejected"
                ? {
                    key: "pending",
                    label: "Marquer en attente",
                    icon: (
                      <HourglassOutlined
                        style={{ color: colorWarningActive }}
                      />
                    ),
                  }
                : null,
              item.status === "pending" || item.status === "validated"
                ? {
                    key: "reject",
                    label: "Rejeter",
                    icon: <CloseOutlined />,
                    danger: true,
                  }
                : null,
              {
                key: "delete",
                label: "Supprimer",
                icon: <CloseOutlined />,
                danger: true,
              },
            ],
            onClick: ({ key }) => {
              if (key === "pending") {
                setOpenPending(true);
              } else if (key === "reject") {
                setOpenReject(true);
              } else if (key === "validate") {
                setOpenValidate(true);
              } else if (key === "delete") {
                setOpenDelete(true);
              }
            },
          }}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      </Space>
    </>
  );
};

type ListPeriodStudentsValidatedProps = {
  // periodEnrollments?: PeriodEnrollment[];
};

export const ListPeriodValidatedStudents: FC<
  ListPeriodStudentsValidatedProps
> = ({}) => {
  const { facultyId, periodId } = useParams();
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
    parseAsInteger.withDefault(25)
  );
  const [search, setSearch] = useQueryState("search");

  const {
    data,
    isPending: isPendingPeriodEnrollments,
    isError: isErrorPeriodEnrollments,
  } = useQuery({
    queryKey: [
      "period_enrollments",
      `${yid}`,
      facultyId,
      periodId,
      departmentId,
      classId,
      page,
      pageSize,
      search,
    ],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollments({
        yearId: Number(queryKey[1]),
        facultyId: Number(queryKey[2]),
        periodId: Number(queryKey[3]),
        departmentId: departmentId !== 0 ? departmentId : undefined,
        classId: classId !== 0 ? classId : undefined,
        page: page !== 0 ? page : undefined,
        pageSize: pageSize !== 0 ? pageSize : undefined,
        search: search !== null && search.trim() !== "" ? search : undefined,
        status: "validated",
      }),
    enabled: !!yid && !!facultyId && !!periodId,
  });

  const { data: departments, isPending: isPendingDepartments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: classes, isPending: isPendingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Validées
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Input.Search
              placeholder="Rechercher ..."
              onChange={(e) => {
                setPage(0);
                setSearch(e.target.value);
              }}
              allowClear
              variant="filled"
              style={{ maxWidth: 180 }}
            />
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
                    label: "Exporter PDF",
                    icon: <FilePdfOutlined />,
                    title: "Exporter en pdf",
                  },
                  {
                    key: "excel",
                    label: "Exporter EXCEL",
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
              src={getPublicR2Url(record.year_enrollment.user.avatar)}
              style={{
                backgroundColor: getHSLColor(
                  `${record.year_enrollment.user.surname} ${record.year_enrollment.user.last_name} ${record.year_enrollment.user.first_name}`
                ),
              }}
            >
              {record.year_enrollment.user.first_name?.charAt(0).toUpperCase()}
            </Avatar>
          ),
          width: 56,
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          render: (_, record) => (
            <Link href={`/student/${record.year_enrollment.id}`}>
              {record.year_enrollment.user.matricule}
            </Link>
          ),
          width: 80,
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "name",
          key: "name",
          render: (_, record) => (
            <Link href={`/student/${record.year_enrollment.id}`}>
              {record.year_enrollment.user.surname}{" "}
              {record.year_enrollment.user.last_name}{" "}
              {record.year_enrollment.user.first_name}
            </Link>
          ),
          ellipsis: true,
        },
        {
          title: "Promotion",
          dataIndex: "promotion",
          render: (_, record, __) =>
            `${record.year_enrollment.class_year.acronym}`,
          key: "class",
          width: 86,
          ellipsis: true,
        },
        {
          title: "Département",
          dataIndex: "department",
          key: "department",
          render: (_, record, __) =>
            `${record.year_enrollment.departement.name}`,
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
              color={
                record?.year_enrollment.status === "enabled" ? "success" : "red"
              }
              className="w-full mr-0"
            >
              {record?.year_enrollment?.status === "enabled"
                ? "Actif"
                : "Abandon"}
            </Tag>
          ),
          align: "start",
        },
        {
          title: "Actions",
          key: "actions",
          render: (_, record, __) => <ActionsBar item={record} />,
          width: 120,
        },
      ]}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      rowSelection={{
        type: "checkbox",
      }}
      scroll={{ y: "calc(100vh - 392px)" }}
      size="small"
      loading={isPendingPeriodEnrollments}
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
        showSizeChanger: true,
        current: page !== 0 ? page : 1,
        total: data?.count,
        onChange: (page, pageSize) => {
          setPage(page);
          setPageSize(pageSize);
        },
      }}
    />
  );
};
