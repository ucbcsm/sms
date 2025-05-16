"use client";

import { getHSLColor } from "@/lib/utils";
import { Application } from "@/types";
import { getApplicationStatusName } from "@/utils";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, List, Typography } from "antd";
import { FC, useState } from "react";
import { EditApplicationForm } from "../forms/edit";
import { DeleteApplicationForm } from "../forms/delete";

type ListItemApplicationProps = {
  item: Application;
};

export const ListItemApplication: FC<ListItemApplicationProps> = ({ item }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const toggleEdit = () => {
    setOpenEdit(true);
  };
  return (
    <>
      <EditApplicationForm
        application={item}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteApplicationForm
        application={item}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <List.Item
        extra={
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: "Voir",
                  icon: <EyeOutlined />,
                },
                {
                  key: "validate",
                  label: "Accepter",
                  icon: <CheckOutlined />,
                },
                {
                  key: "rejecte",
                  label: "Rejeter",
                  icon: <CloseOutlined />,
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
                  toggleEdit();
                } else if (key === "delete") {
                  setOpenDelete(true);
                }
              },
            }}
          >
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        }
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={item.avatar}
              style={{
                backgroundColor: getHSLColor(
                  `${item.first_name} ${item.last_name} ${item.surname}`
                ),
                cursor: "pointer",
              }}
              onClick={toggleEdit}
            >
              {item.first_name?.charAt(0).toUpperCase()}
              {item.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={
            <Typography.Text onClick={toggleEdit} style={{ cursor: "pointer" }}>
              {item.first_name} {item.last_name} {item.surname}
            </Typography.Text>
          }
          description={
            <div onClick={toggleEdit} style={{ cursor: "pointer" }}>
              <Typography.Text type="danger">
                {getApplicationStatusName(`${item.status}`)}
              </Typography.Text>{" "}
              : {item.class_year.acronym} {item.departement.name}
            </div>
          }
        />
      </List.Item>
    </>
  );
};
