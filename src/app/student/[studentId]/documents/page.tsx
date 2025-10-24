"use client";

import {
  DeleteOutlined,
  EyeOutlined,
  FileOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { Button, Space, Switch, Table, Tag, Typography } from "antd";
import { ButtonAddNewDocument } from "./_components/addNewDocument";
import { useParams } from "next/navigation";
import { useYearEnrollment } from "@/hooks/useYearEnrollment";
import { getApplicationStatusName, getApplicationTagColor } from "@/lib/api";
import { useAllRequiredDocuments } from "@/hooks/useAllRequiredDocuments";
import { EditDocument } from "./_components/editDocument";
import { DeleteDocument } from "./_components/deleteDocument";

export default function Page() {
  const { studentId } = useParams();
  const { data: enrollment, isPending: isPendingEnrollment } =
    useYearEnrollment(Number(studentId));

  const { data: documents } = useAllRequiredDocuments();

  return (
    <div className="p-6">
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
                yearEnrollment={enrollment}
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
                checked={record.exist}
                checkedChildren="✓ Présent"
                unCheckedChildren="✗ Absent"
                disabled
              />
            ),
            width: 110,
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
                      display: record.file_url ? "block" : "none",
                    }}
                  />
                </Space>
              );
            },
          },
          {
            key: "status",
            dataIndex: "status",
            title: "Statut de vérification",
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
          {
            key: "actions",
            dataIndex: "actions",
            title: "",
            render: (_, record) => (
              <Space>
                <EditDocument
                  doc={record}
                  documents={documents}
                  currentDocuments={
                    enrollment?.common_enrollment_infos.application_documents
                  }
                />
                <DeleteDocument doc={record} />
              </Space>
            ),
            width: 96,
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
    </div>
  );
}
