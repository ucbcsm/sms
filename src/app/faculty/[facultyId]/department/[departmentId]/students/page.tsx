"use client";

import { StudentMoreActionsDropdown } from "@/app/app/students/_components/moreActions";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import { usePrevPathname } from "@/hooks/usePrevPathname";
import { getYearEnrollmentsByDepatmentId } from "@/lib/api";
import { getHSLColor, getPublicR2Url } from "@/lib/utils";
import {
  AppstoreOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Radio,
  Space,
  Table,
  Tag,
} from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function Page() {

  const { departmentId } = useParams();
  const pathname = usePathname();
  const { setPathname } = usePrevPathname();
  const { yid } = useYid();
  const { data, isPending, isError } = useQuery({
    queryKey: ["year_enrollments", `${yid}`, departmentId],
    queryFn: ({ queryKey }) =>
      getYearEnrollmentsByDepatmentId(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!yid && !!departmentId,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }
  return (
    <Table
      bordered
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un étudiant ..." />
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
          render: (_, record) => (
            <Link href={`/student/${record.id}`}>
              {record.user.surname} {record.user.last_name}{" "}
              {record.user.first_name}
            </Link>
          ),
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
          title: "Promotion",
          dataIndex: "promotion",
          render: (_, record, __) => `${record.class_year.acronym}`,
          key: "class",
          width: 86,
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
      scroll={{ y: "calc(100vh - 393px)" }}
      size="small"
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
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
