"use client";

import { PeriodEnrollment } from "@/types";
import {
  Avatar,
  Button,
  Checkbox,
  Dropdown,
  List,
  Space,
  theme,
  Typography,
} from "antd";
import { FC, useState } from "react";
import { PendingSinglePeriodEnrollmentForm } from "./forms/decisions/pending";
import { ValidateSignlePeriodEnllmentForm } from "./forms/decisions/validate";
import { RejectSinglePeriodEnrollmentForm } from "./forms/decisions/reject";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  HourglassOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { getHSLColor } from "@/lib/utils";
import {
  getApplicationStatusName,
  getApplicationStatusTypographyType,
} from "@/lib/api";
import { DeleteSinglePeriodEnrollmentForm } from "./forms/decisions/delete";

type ListPeriodEnrollmentItemProps = {
  item: PeriodEnrollment;
};

export const ListPeriodEnrollmentItem: FC<ListPeriodEnrollmentItemProps> = ({
  item,
}) => {
  const {
    token: { colorSuccessActive, colorWarningActive },
  } = theme.useToken();
  const [openPending, setOpenPending] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <>
      <PendingSinglePeriodEnrollmentForm
        open={openPending}
        setOpen={setOpenPending}
        enrollment={item}
      />
      <ValidateSignlePeriodEnllmentForm
        open={openValidate}
        setOpen={setOpenValidate}
        enrollment={item}
      />
      <RejectSinglePeriodEnrollmentForm
        open={openReject}
        setOpen={setOpenReject}
        enrollment={item}
      />
      <DeleteSinglePeriodEnrollmentForm
        open={openDelete}
        setOpen={setOpenDelete}
        enrollment={item}
      />

      <List.Item
        extra={
          <Dropdown
            menu={{
              items: [
                item.status === "pending" || item.status === "rejected"
                  ? {
                      key: "validate",
                      label: "Accepter",
                      icon: (
                        <CheckOutlined style={{ color: colorSuccessActive }} />
                      ),
                    }
                  : null,
                item.status === "validated" || item.status === "rejected"
                  ? {
                      key: "pending",
                      label: "Marquer en attente",
                      icon: (
                        <HourglassOutlined
                          style={{ color: colorWarningActive }}
                        />
                      ),
                    }
                  : null,
                item.status === "pending"
                  ? {
                      key: "reject",
                      label: "Rejeter",
                      icon: <CloseOutlined />,
                      danger: true,
                    }
                  : null,
                item.status === "rejected"
                  ? {
                      key: "delete",
                      label: "Supprimer",
                      icon: <DeleteOutlined />,
                      danger: true,
                    }
                  : null,
              ].filter(Boolean) as any[],
              onClick: ({ key }) => {
                if (key === "pending") {
                  setOpenPending(true);
                } else if (key === "reject") {
                  setOpenReject(true);
                } else if (key === "validate") {
                  setOpenValidate(true);
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
              src={item.year_enrollment.user.avatar || null}
              style={{
                backgroundColor: getHSLColor(
                  `${item.year_enrollment.user.first_name} ${item.year_enrollment.user.last_name} ${item.year_enrollment.user.surname}`
                ),
                cursor: "pointer",
              }}
            >
              {item.year_enrollment.user.first_name?.charAt(0).toUpperCase()}
              {item.year_enrollment.user.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={
            <Typography.Text style={{ cursor: "pointer" }}>
              {item.year_enrollment.user.first_name}{" "}
              {item.year_enrollment.user.last_name}{" "}
              {item.year_enrollment.user.surname}
            </Typography.Text>
          }
          description={
            <Space>
              <Checkbox />
              <div style={{ cursor: "pointer" }}>
                <Typography.Text
                  type={getApplicationStatusTypographyType(item.status!)}
                >
                  {getApplicationStatusName(`${item.status}`)}
                </Typography.Text>{" "}
                : {item.year_enrollment.class_year.acronym}{" "}
                {item.year_enrollment.departement.name}
              </div>
            </Space>
          }
        />
      </List.Item>
    </>
  );
};
