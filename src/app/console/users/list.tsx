"use client";

import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PlusOutlined,
  PrinterOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Input, Space, Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  getGroups,
  getPermissions,
  getRoleName,
  getRoles,
  getUsers,
} from "@/lib/api";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { DataFetchErrorResult } from "@/components/errorResult";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { Group, Permission, Role, User } from "@/types";
import { DeleteUserForm } from "./forms/delete";
import { EditUserForm } from "./forms/edit";
import { getHSLColor } from "@/lib/utils";

type ActionsBarProps = {
  record: User;
  groups?: Group[];
  roles?: Role[];
  permissions?: Permission[];
};

const ActionsBar: FC<ActionsBarProps> = ({
  record,
  groups,
  roles,
  permissions,
}) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditUserForm
        user={record}
        open={openEdit}
        setOpen={setOpenEdit}
        groups={groups}
        roles={roles}
        permissions={permissions}
      />
      <DeleteUserForm user={record} open={openDelete} setOpen={setOpenDelete} />
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
          onClick: ({ key }) => {
            if (key === "edit") {
              setOpenEdit(true);
            } else if (key === "delete") {
              setOpenDelete(true);
            }
          },
        }}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};

type ListUsersProps = {

};

export const ListUsers: FC<ListUsersProps> = ({}) => {
  const {
    data: users,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    data: groups,
    isPending: isPendingGroups,
    isError: isErrorGroups,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const {
    data: roles,
    isPending: isPendingRoles,
    isError: isErrorRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const {
    data: permissions,
    isPending: isPendingPermissions,
    isError: isErrorPermissions,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  if (isPending || isPendingGroups || isPendingRoles || isPendingPermissions) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError || isErrorGroups || isErrorRoles || isErrorPermissions) {
    return <DataFetchErrorResult />;
  }

  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Input.Search placeholder="Rechercher un utilisateur ..." />
          </Space>
          <div className="flex-1" />
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              title="Ajouter un utilisateur"
              style={{ boxShadow: "none" }}
            >
              Ajouter
            </Button>
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
          key: "avatar",
          dataIndex: "avatar",
          title: "Photo",
          render: (_, record) => (
            <Avatar
              src={record.avatar}
              alt={record?.first_name || ""}
              style={{
                background: getHSLColor(
                  `${record.first_name || ""} ${record.last_name || ""} ${
                    record.surname || ""
                  }`
                ),
              }}
            >
              {record.first_name?.charAt(0) || "U"}
            </Avatar>
          ),
          width: 56,
        },
        {
          key: "fullName",
          dataIndex: "fullName",
          title: "Nom complet",
          render: (_, record, __) =>
            `${record.first_name || ""} ${record.last_name || ""} ${
              record.surname || ""
            }`,
        },
        {
          key: "matricule",
          dataIndex: "matricule",
          title: "Matricule",
        },
        {
          key: "email",
          dataIndex: "email",
          title: "Email",
        },
        {
          key: "roles",
          dataIndex: "roles",
          title: "Rôles",
          render: (_, record) => (
            <Space wrap>
              {record.roles.map((r) => (
                <Tag>{getRoleName(r.name)}</Tag>
              ))}
            </Space>
          ),
        },
        {
          key: "groups",
          dataIndex: "groups",
          title: "Groupes",
          render: (_, record) => (
            <Space wrap>
              {record.groups.map((g) => (
                <Tag icon={<TeamOutlined />} bordered={false}>
                  {g.name}
                </Tag>
              ))}
            </Space>
          ),
        },
        {
          key: "date_joined",
          dataIndex: "date_joined",
          title: "Création",
          render: (_, record, __) =>
            dayjs(record.date_joined).format("DD/MM/YYYY"),
          ellipsis: true,
        },
        {
          key: "status",
          dataIndex: "status",
          title: "Statut",
          render: (_, record, __) => (
            <Tag
              color={record.is_active ? "green" : "red"}
              style={{ border: 0 }}
            >
              {record.is_active ? "Actif" : "Bloqué"}
            </Tag>
          ),
          width: 60,
        },
        {
          key: "actions",
          dataIndex: "actions",
          render: (_, record, __) => {
            return <ActionsBar record={record} groups={groups} roles={roles} permissions={permissions}/>;
          },
          width: 50,
        },
      ]}
      dataSource={users}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      rowSelection={{
        type: "checkbox",
      }}
      size="small"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: [10, 25, 50],
        size: "small",
      }}
      bordered={false}
    />
  );
};
