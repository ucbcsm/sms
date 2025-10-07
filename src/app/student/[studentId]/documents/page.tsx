"use client";

import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileOutlined,
  FolderOutlined,
  MoreOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space, Switch, Table, Tag, Typography } from "antd";
import { ButtonAddNewDocument } from "./_components/addNewDocument";
import { useParams } from "next/navigation";
import { useYearEnrollment } from "@/hooks/useYearEnrollment";
import { getApplicationStatusName, getApplicationTagColor } from "@/lib/api";
import { useAllRequiredDocuments } from "@/hooks/useAllRequiredDocuments";

export default function Page() {
  const { studentId } = useParams();
  const { data: enrollment, isPending: isPendingEnrollment } = useYearEnrollment(Number(studentId));
  

const {data:documents}=useAllRequiredDocuments()

  return (
    <Table
      loading={isPendingEnrollment}
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              <FolderOutlined /> Eléments du dossier
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <ButtonAddNewDocument
              documents={documents}
              currentDocuments={
                enrollment?.common_enrollment_infos.application_documents
              }
            />
          </Space>
        </header>
      )}
      dataSource={enrollment?.common_enrollment_infos.application_documents}
      columns={[
        {
          key: "index",
          title: "",
          render: (_text, _record, index) => <FileOutlined />,
          width: 28,
        },
        {
          title: "Intitulé",
          dataIndex: "name",
          key: "name",
          render: (_, record) => record.required_document?.title,
        },
        {
          title: "Version papier",
          dataIndex: "exist",
          key: "type",
          render: (_, record) => (
            <Switch
              // checked={record.exist}
              checkedChildren="✓ Présent"
              unCheckedChildren="✗ Absent"
              disabled
            />
          ),
        },
        {
          title: "Version électronique",
          key: "file",
          render: (_, record) => {
            return (
              <Space>
                <Button
                  icon={<EyeOutlined />}
                  style={{
                    boxShadow: "none",
                    display: record.status === "validated" ? "block" : "none",
                  }}
                />
                {record.status === "validated" ? (
                  <Button
                    icon={<DownloadOutlined />}
                    style={{ boxShadow: "none" }}
                  >
                    Télécharger
                  </Button>
                ) : (
                  <Button
                    icon={<UploadOutlined />}
                    style={{ boxShadow: "none" }}
                  >
                    Téléverser
                  </Button>
                )}
                <Dropdown
                  menu={{
                    items: [
                      { key: "1", label: "Modifier", icon: <EditOutlined /> },
                      {
                        key: "2",
                        label: "Supprimer",
                        danger: true,
                        icon: <DeleteOutlined />,
                      },
                    ],
                  }}
                >
                  <Button
                    icon={<MoreOutlined />}
                    style={{
                      boxShadow: "none",
                      display: record.status === "validated" ? "block" : "none",
                    }}
                  />
                </Dropdown>
              </Space>
            );
          },
        },
        {
          key: "status",
          dataIndex: "status",
          title: "Statut de verification",
          ellipsis: true,
          render: (_, record) => (
            <Tag
              color={getApplicationTagColor(record.status)}
              bordered={false}
              style={{ borderRadius: 10 }}
            >
              {getApplicationStatusName(record.status)}
            </Tag>
          ),
        },
      ]}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      size="small"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50],
        size: "small",
      }}
    />
  );
}
