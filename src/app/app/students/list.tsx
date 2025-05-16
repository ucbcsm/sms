"use client";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getHSLColor } from "@/lib/utils";
import { getEnrollments } from "@/utils";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterOutlined,
  MoreOutlined,
  PrinterOutlined,
  UserAddOutlined,
  UserOutlined,
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
  TableColumnType,
  Tag,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type StudentType = {
  id: string | number;
  key: string;
  avatar: string;
  firstname: string;
  lastname: string;
  surname: string;
  matricule: string;
  sex: "M" | "F";
  promotion: string;
  status: "active" | "abandon" | "dismissed";
};

// const data: StudentType[] = Array.from({ length: 100 }, (_, index) => {
//   const id = (index + 1).toString();
//   return {
//     id,
//     key: id,
//     firstname: "Kahindo",
//     lastname: "Lwanzo",
//     surname: "Alfred" + id,
//     sex: "M",
//     status: "active",
//     avatar: "",
//     matricule: `0024${13 + index}`,
//     promotion: "L1 Genie informatique",
//   };
// });

export function StudentsList() {
  const router = useRouter();
  const { data, isPending, isError } = useQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollments,
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
        <header className="flex  pb-3">
          <Space>
            <Input.Search placeholder="Rechercher ..." />
            <Select placeholder="Faculté" showSearch />
            <Select placeholder="Département" showSearch />
            <Select placeholder="Promotion" showSearch />
            {/* <Button icon={<FilterOutlined />} style={{ boxShadow: "none" }}>
              Filtrer
            </Button> */}
          </Space>
          <div className="flex-1" />
          <Space>
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
                    title: "Exporter ver excel",
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
          title: "Photo",
          dataIndex: "firstname",
          key: "image",
          render: (value, record) => (
            <Avatar
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
          width: 58,
          align: "center",
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          width: 92,
          render: (value, record) => (
            <Link href={`/app/student/${record.id}`}>
              {record.user.matricule}
            </Link>
          ),
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "lastname",
          key: "name",
          render: (value, record) => (
            <Link href={`/app/student/${record.id}`}>
              {record.user.first_name} {record.user.last_name}{" "}
              {record.user.surname}
            </Link>
          ),
          ellipsis: true,
        },
        {
          title: "Sexe",
          dataIndex: "sex",
          key: "gender",
          width: 58,
          render: (_, record, __) => `${record.common_enrollment_infos.gender}`,
          align: "center",
        },
        {
          title: "Promotion",
          dataIndex: "promotion",
          render: (_, record, __) =>
            `${record.class_year.acronym} ${record.departement.name}`,
          key: "class",
          ellipsis: true,
        },
        {
          title: "Période",
          dataIndex: "period",
          render: (_, record, __) => `${record.period.name}`,
          key: "class",
          ellipsis: true,
        },
        {
          title: "Status",
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
        },
        {
          key: "actions",
          title: "Actions",
          render: () => (
            <Space>
              <Button type="dashed">Gérer</Button>
              <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Action 1" },
                    { key: "2", label: "Action 2" },
                    { key: "3", label: "Action 3" },
                  ],
                }}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </Space>
          ),
          width: 120,
        },
      ]}
      dataSource={data}
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
      // onRow={(record) => ({
      //   onClick: () => {
      //     router.push(`/app/students/${record.id}`); // Navigate to the student details page
      //   },
      // })}
    />
  );
}
