"use client";

import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Layout,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import Dropdown from "antd/es/dropdown/dropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewYearForm } from "./forms/newYear";
import { Palette } from "@/components/palette";
import BackButton from "@/components/backButton";
import { useQuery } from "@tanstack/react-query";
import { getYears } from "@/utils";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  const { data: years, isPending } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });
  return (
    <Layout>
      <Layout.Content
        style={{
          padding: "0 32px 0 32px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
        className="px-4 md:px-8 bg-white"
      >
        <Layout.Header
          className="flex top-0 z-[1]"
          style={{ background: colorBgContainer, padding: 0 }}
        >
          <Space className="font-medium">
            <BackButton />
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Années académiques
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card loading={isPending}>
          <Table
            title={() => (
              <header className="flex  pb-3">
                <Space>
                  <Input.Search placeholder="Rechercher ..." />
                </Space>
                <div className="flex-1" />
                <Space>
                  <NewYearForm />
                  <Button
                    icon={<PrinterOutlined />}
                    style={{ boxShadow: "none" }}
                  >
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
                    <Button
                      icon={<DownOutlined />}
                      style={{ boxShadow: "none" }}
                    >
                      Exporter
                    </Button>
                  </Dropdown>
                </Space>
              </header>
            )}
            columns={[
              {
                key: "name",
                dataIndex: "name",
                title: "Nom",
                render: (value) => {
                  return (
                    <Link href={`/console/years/${value}/periods`}>
                      {value}
                    </Link>
                  );
                },
              },
              {
                key: "start_date",
                dataIndex: "start_date",
                title: "Date de début",
              },
              { key: "end_date", dataIndex: "end_date", title: "Date de fin" },
              {
                key: "status",
                dataIndex: "status",
                title: "Status",
                render: (_, record, __) => {
                  let color = "";
                  let text = "";
                  switch (record.status) {
                    case "pending":
                      color = "orange";
                      text = "En attente";
                      break;
                    case "progress":
                      color = "blue";
                      text = "En cours";
                      break;
                    case "finished":
                      color = "green";
                      text = "Terminé";
                      break;
                    case "suspended":
                      color = "red";
                      text = "Suspendu";
                      break;
                    default:
                      color = "default";
                      text = "Inconnu";
                  }
                  return <Tag color={color} style={{border:0}}>{text}</Tag>;
                },
              },
              {
                key: "actions",
                dataIndex: "actions",
                title: "Actions",
                render: (_, record, __) => {
                  return (
                    <Space size="middle">
                      <Button
                        title="Gérer l'année académique"
                        onClick={() => {
                          router.push(`/console/years/${record.name}/periods`);
                        }}
                        style={{ boxShadow: "none" }}
                      >
                        Gérer
                      </Button>
                      <Dropdown
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
                        }}
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          title="Ajouter un membre du bureau"
                        />
                      </Dropdown>
                    </Space>
                  );
                },
                width: 120,
              },
            ]}
            dataSource={years}
            rowKey="id"
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
            bordered={false}
          />
        </Card>
        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: " 24px 0",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Footer>
      </Layout.Content>
    </Layout>
  );
}
