"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { getHoursTrackings, getHourTrackingActivityTypeName, getTaughtCours } from "@/lib/api";
import { HourTracking } from "@/types";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, DatePicker, Dropdown, Layout, Space, Switch, Table, theme, Typography } from "antd";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { NewHourTrackingForm } from "./_components/forms/new";
import { DeleteHourTrackingForm } from "./_components/forms/delete";
import { EditHourTrackingForm } from "./_components/forms/edit";
import { PrintableHoursTrackingReport } from "./_components/printable-report";
import dayjs from "dayjs";
import { EmptyPrintableTracking } from "./_components/empty-printable-tracking";

type ActionsBarProps = {
  record: HourTracking;
};

const ActionsBar: FC<ActionsBarProps> = ({ record }) => {
  
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditHourTrackingForm
        hourTracking={record}
        open={openEdit}
        setOpen={setOpenEdit}
      />
      <DeleteHourTrackingForm
        hourTracking={record}
        open={openDelete}
        setOpen={setOpenDelete}
      />
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

export default function Page() {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const { courseId } = useParams();

  const [openPrintEmptyAttendance, setOpenPrintEmptyAttendance] = useState<boolean>(false);

  const { data: course } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["course_hours_tracking", courseId],
    queryFn: ({ queryKey }) => getHoursTrackings(Number(queryKey[1])),
    enabled: !!courseId,
  });

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Layout>
      <Layout.Header
        style={{
          background: colorBgLayout,
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        <Space>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            Suivi des heures
          </Typography.Title>
        </Space>
      </Layout.Header>

      <Layout.Content
        style={{ padding: "0 28px 0 28px", minHeight: `calc(100vh - 174px)` }}
      >
        <Table
          bordered
          loading={isPending}
          title={() => (
            <header className="flex">
              <Space>
                <DatePicker
                  variant="filled"
                  placeholder="DD/MM/YYYY"
                  format="DD/MM/YYYY"
                />
              </Space>
              <div className="flex-1" />
              <Space>
                <NewHourTrackingForm />
                <PrintableHoursTrackingReport data={data} course={course} />
                <Dropdown
                  arrow
                  menu={{
                    items: [
                      {
                        key: "export_empty",
                        label: "Fiche de suivie des heures",
                        icon: <DownloadOutlined />,
                        extra: <Badge count="Vide" />,
                        onClick: () => {
                          setOpenPrintEmptyAttendance(true);
                        },
                      },
                    ],
                  }}
                >
                  <Button icon={<MoreOutlined />} type="text" />
                </Dropdown>
              </Space>
            </header>
          )}
          dataSource={data}
          columns={[
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
              render: (_, record, __) =>
                `${dayjs(record.date).locale("fr").format("dddd, DD/MM/YYYY")}`,
            },
            {
              title: "Leçon",
              dataIndex: "lesson",
              key: "lesson",
              render: (_, record, __) => record?.lesson,
            },
            {
              title: "Heure de début",
              dataIndex: "start_time",
              key: "start_time",
              render: (_, record, __) => record?.start_time.substring(0, 5),
            },
            {
              title: "Heure de fin",
              dataIndex: "end_time",
              key: "end_time",
              render: (_, record, __) => record?.end_time.substring(0, 5),
            },
            {
              title: "Type d'activité",
              dataIndex: "activity_type",
              key: "activity_type",
              render: (_, record, __) =>
                getHourTrackingActivityTypeName(record?.activity_type),
            },
            {
              title: "Heures prestées",
              dataIndex: "hours_completed",
              key: "hours_completed",
              render: (_, record, __) => record?.hours_completed,
            },
            {
              title: "Validation CP",
              dataIndex: "cp_validation",
              key: "cp_validation",
              render: (_, record, __) => (
                <Switch
                  checked={record?.cp_validation}
                  checkedChildren="Validé"
                  unCheckedChildren="Non validé"
                  disabled
                />
              ),
            },
            {
              title: "Validation enseignant",
              dataIndex: "teacher_validation",
              key: "teacher_validation",
              render: (_, record, __) => (
                <Switch
                  checked={record?.teacher_validation}
                  checkedChildren="Validé"
                  unCheckedChildren="Non validé"
                  disabled
                />
              ),
            },
            {
              title: "",
              key: "actions",
              render: (_, record, __) => {
                return <ActionsBar record={record} />;
              },
              width: 50,
            },
          ]}
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
        />
        <EmptyPrintableTracking
          course={course}
          open={openPrintEmptyAttendance}
          setOpen={setOpenPrintEmptyAttendance}
        />
      </Layout.Content>
    </Layout>
  );
}
