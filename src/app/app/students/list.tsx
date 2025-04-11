import { getHSLColor } from "@/lib/utils";
import {
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterOutlined,
  PrinterOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Space,
  Table,
  TableColumnType,
  Tag,
} from "antd";
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

const columns: TableColumnType<StudentType>[] = [
  {
    title: "Photo",
    dataIndex: "firstname",
    key: "image",
    render: (value, record) => (
      <Avatar
        style={{
          backgroundColor: getHSLColor(
            `${record.firstname} ${record.lastname} ${record.surname}`
          ),
        }}
      >
        {record?.firstname?.charAt(0).toUpperCase()}
        {record?.lastname?.charAt(0).toUpperCase()}
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
    render: (value) => value,
    align: "center",
  },
  {
    title: "Noms",
    dataIndex: "lastname",
    key: "name",
    render: (value, record) =>
      `${record.firstname} ${record.lastname} ${record.surname}`,
    ellipsis: true,
  },
  {
    title: "Sexe",
    dataIndex: "sex",
    key: "sex",
    width: 58,
    render: (value) => value,
    align: "center",
  },
  {
    title: "Promotion",
    dataIndex: "promotion",
    render: (value) => `${value}`,
    key: "class",
    ellipsis: true,
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 96,
    render: (value) => (
      <>
        {value === "active" && (
          <Tag bordered={false} color="success" className="w-full mr-0">
            Actif
          </Tag>
        )}
        {value === "abandon" && (
          <Tag bordered={false} color="warning" className="w-full mr-0">
            Abandon
          </Tag>
        )}
        {value === "dismissed" && (
          <Tag bordered={false} color="error" className="w-full mr-0">
            Renvoyé
          </Tag>
        )}
      </>
    ),
  },
];

const data: StudentType[] = Array.from({ length: 100 }, (_, index) => {
  const id = (index + 1).toString();
  return {
    id,
    key: id,
    firstname: "Kahindo",
    lastname: "Lwanzo",
    surname: "Alfred" + id,
    sex: "M",
    status: "active",
    avatar: "",
    matricule: `0024${13 + index}`,
    promotion: "L1 Genie informatique",
  };
});

export function StudentsList() {
  const router = useRouter();
  return (
    <Table
      title={() => (
        <header className="flex  pb-3">
          <Space>
            <Input.Search placeholder="Rechercher ..." />
            <Button icon={<FilterOutlined />} style={{ boxShadow: "none" }}>
              Filtrer
            </Button>
          </Space>
          <div className="flex-1" />
          <Space>
            <Dropdown
              menu={{
                items: [
                  { key: "old", label: "Réinscrire", icon: <UserOutlined /> },
                  {
                    key: "new",
                    label: "Inscrire un nouveau",
                    icon: <UserAddOutlined />,
                  },
                ],
              }}
            >
              <Button
                icon={<UserAddOutlined />}
                type="primary"
                style={{ boxShadow: "none" }}
                variant="dashed"
              >
                Inscrire
              </Button>
            </Dropdown>
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
      columns={columns}
      dataSource={data}
      rowClassName={`bg-[#f5f5f5] odd:bg-white hover:cursor-pointer`}
      rowSelection={{
        type: "checkbox",
      }}
      size="small"
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: [25, 50, 75, 100],
        size: "small",
      }}
      onRow={(record) => ({
        onClick: () => {
          router.push(`/app/students/${record.id}`); // Navigate to the student details page
        },
      })}
    />
  );
}
