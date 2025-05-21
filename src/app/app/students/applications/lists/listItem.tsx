"use client";

import { getHSLColor } from "@/lib/utils";
import { Application, RequiredDocument, TestCourse } from "@/lib/types";
import {
  getApplicationStatusName,
  getApplicationStatusTypographyType,
} from "@/lib/api";
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
import { DeleteApplicationForm } from "../forms/decisions/delete";
import { RejectApplicationForm } from "../forms/decisions/reject";
import { ValidateApplicationForm } from "../forms/decisions/validate";

type ListItemApplicationProps = {
  item: Application;
  courses?: TestCourse[];
  documents?: RequiredDocument[];
};

export const ListItemApplication: FC<ListItemApplicationProps> = ({
  item,
  courses,
  documents,
}) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);

  const toggleEdit = () => {
    setOpenEdit(true);
  };
  return (
    <>
      <EditApplicationForm
        application={item}
        open={openEdit}
        setOpen={setOpenEdit}
        setOpenReject={setOpenReject}
        setOpenValidate={setOpenValidate}
        courses={courses}
        documents={documents}
      />
      <DeleteApplicationForm
        application={item}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <RejectApplicationForm
        application={item}
        open={openReject}
        setOpen={setOpenReject}
      />
      <ValidateApplicationForm
        application={item}
        open={openValidate}
        setOpen={setOpenValidate}
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
                item.status === "pending"
                  ? {
                      key: "validate",
                      label: "Accepter",
                      icon: <CheckOutlined />,
                    }
                  : null,
                item.status === "pending"
                  ? {
                      key: "reject",
                      label: "Rejeter",
                      icon: <CloseOutlined />,
                    }
                  : null,
                item.status === "pending"
                  ? {
                      key: "delete",
                      label: "Supprimer",
                      icon: <DeleteOutlined />,
                      danger: true,
                    }
                  : null,
              ],
              onClick: ({ key }) => {
                if (key === "edit") {
                  toggleEdit();
                } else if (key === "delete") {
                  setOpenDelete(true);
                } else if (key === "reject") {
                  setOpenReject(true);
                } else if (key === "validate") {
                  setOpenValidate(true);
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
              <Typography.Text
                type={getApplicationStatusTypographyType(item.status!)}
              >
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
