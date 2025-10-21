import { getHSLColor } from "@/lib/utils";
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { NewTeacherForm } from "./forms/new";
import { useQuery } from "@tanstack/react-query";
import { getTeachers } from "@/lib/api";
import { DataFetchErrorResult } from "@/components/errorResult";
import Link from "next/link";
import {  parseAsBoolean, parseAsInteger, parseAsStringEnum, useQueryState } from "nuqs";

export function ListTeachers() {

  const [gender, setGender] = useQueryState(
    "gender",
    parseAsStringEnum(["all", "M", "F"]).withDefault("all")
  );
  const [search, setSearch]=useQueryState("search")
  const [category, setCategory] = useQueryState(
    "permanent",
    parseAsStringEnum(["all", "permanent", "visitor"]).withDefault("all")
  );

  const [page, setPage]=useQueryState("page", parseAsInteger.withDefault(0))
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(0)
  );

  const [openNewTeacherForm, setOpenNewTeacherForm] = useQueryState(
      "new",
      parseAsBoolean.withDefault(false)
    );
    const [openNewFormerTeacherForm, setOpenNewFormerTeacherForm] =
      useQueryState("new-former", parseAsBoolean.withDefault(false));


  const { data, isPending, isError } = useQuery({
    queryKey: ["teachers", gender, category, page, pageSize, search],
    queryFn: ({ queryKey }) =>
      getTeachers({
        search: search !== null && search.length !== 0 ? search : undefined,
        gender: gender !== "all" ? gender : undefined,
        is_permanent_teacher:
          category !== "all"
            ? category === "permanent"
              ? true
              : false
            : undefined,
        page: page !== 0 ? page : undefined,
        page_size: pageSize !== 0 ? pageSize : undefined,
      }),
  });


  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <>
      <Table
        title={() => (
          <header className="flex  pb-3">
            <Space>
              <Input.Search
                variant="filled"
                placeholder="Rechercher ..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Typography.Text type="secondary">Catégorie</Typography.Text>
              <Select
                value={category}
                placeholder="Catégorie"
                options={[
                  { value: "all", label: "Tous" },
                  { value: "permanent", label: "Permanents" },
                  { value: "visitor", label: "Visiteurs" },
                ]}
                variant="filled"
                onSelect={(value) => {
                  setCategory(value);
                }}
              />
              <Typography.Text type="secondary">Genre</Typography.Text>
              <Select
                value={gender}
                placeholder="Genre"
                options={[
                  { value: "all", label: "Tous" },
                  { value: "M", label: "Masculin" },
                  { value: "F", label: "Féminin" },
                ]}
                variant="filled"
                onSelect={(value) => {
                  setGender(value);
                }}
              />
            </Space>
            <div className="flex-1" />
            <Space>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "new",
                      label: " Nouvel enseignant",
                      icon: <UserAddOutlined />,
                      onClick: () => {
                        setOpenNewTeacherForm(true);
                      },
                    },
                    {
                      type: "divider",
                    },
                    {
                      key: "new-former",
                      label: "Enregistrement",
                      icon: <PlusCircleOutlined />,
                      onClick: () => {
                        setOpenNewFormerTeacherForm(true);
                      },
                      extra: <Badge count="Ancien staff" />,
                    },
                  ],
                }}
              >
                <Button
                  icon={<UserAddOutlined />}
                  color="primary"
                  style={{ boxShadow: "none" }}
                  variant="dashed"
                  title="Créer un nouvel enseignant"
                >
                  Créer
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
                      label: "Exporter .pdf",
                      icon: <FilePdfOutlined />,
                      title: "Exporter en pdf",
                    },
                    {
                      key: "excel",
                      label: "Exporter .xlsx",
                      icon: <FileExcelOutlined />,
                      title: "Exporter vers excel",
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
        loading={isPending}
        columns={[
          {
            title: "Photo",
            dataIndex: "avatar",
            key: "avatar",
            render: (_, record, __) => (
              <Avatar
                style={{
                  backgroundColor: getHSLColor(
                    `${record.user.surname} ${record.user.last_name} ${record.user.first_name}`
                  ),
                }}
              >
                {record.user.first_name?.charAt(0).toUpperCase()}
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
            render: (_, record, __) => (
              <Link href={`/app/teacher/${record.id}`}>
                {record.user.matricule}
              </Link>
            ),
            align: "center",
          },
          {
            title: "Noms",
            dataIndex: "lastname",
            key: "name",
            render: (_, record, __) => (
              <Link href={`/app/teacher/${record.id}`}>
                {record.user.surname} {record.user.last_name}{" "}
                {record.user.first_name}
              </Link>
            ),
            ellipsis: true,
          },
          {
            title: "Sexe",
            dataIndex: "gender",
            key: "gender",
            width: 58,
            render: (value) => value,
            align: "center",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (_, record, __) => record.user.email || "",
            ellipsis: true,
          },
          {
            title: "Téléphone",
            dataIndex: "phone_number_1",
            key: "phone_number_1",
            render: (value) => `${value}`,
            ellipsis: true,
          },
          {
            title: "Catégorie",
            dataIndex: "category",
            key: "category",
            render: (_, record, __) =>
              record.user.is_permanent_teacher ? "Permanent" : "Visiteur",
            ellipsis: true,
          },

          {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            render: (_, record, __) => (
              <Tag
                color={record.user.is_active ? "green" : "red"}
                style={{ border: 0, width: "100%" }}
              >
                {record.user.is_active ? "Actif" : "Inactif"}
              </Tag>
            ),
            width: 80,
          },
          {
            key: "actions",
            title: "Actions",
            dataIndex: "actions",
            width: 120,
            render: (_, record, __) => (
              <Space>
                <Link href={`/app/teacher/${record.id}`}>
                  <Button
                    variant="dashed"
                    color="primary"
                    style={{ boxShadow: "none" }}
                  >
                    Gérer
                  </Button>
                </Link>
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
                        danger: true,
                        icon: <DeleteOutlined />,
                      },
                    ],
                  }}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            ),
          },
        ]}
        dataSource={data?.results}
        rowClassName={`bg-[#f5f5f5] odd:bg-white `}
        rowSelection={{
          type: "checkbox",
        }}
        rowKey="id"
        size="small"
        scroll={{ y: `calc(100vh - 240px)` }}
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
      <NewTeacherForm
        open={openNewTeacherForm}
        setOpen={setOpenNewTeacherForm}
        isFormer={false}
      />
      <NewTeacherForm
        open={openNewFormerTeacherForm}
        setOpen={setOpenNewFormerTeacherForm}
        isFormer={true}
      />
    </>
  );
}
