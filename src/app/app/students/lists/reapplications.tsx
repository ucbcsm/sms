"use client";

import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getApplicationStatusName, getPendingApplications } from "@/lib/api";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  List,
  Tabs,
  Typography,
} from "antd";
import { FC } from "react";

export const ListReApplications: FC = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["applications", "pending"],
    queryFn: async ({ queryKey }) => getPendingApplications(),
  });
  if (isPending) {
    return (
      <>
        <DataFetchPendingSkeleton />
        <div className="mt-5">
          <DataFetchPendingSkeleton />
        </div>
      </>
    );
  }
  return (
    <Tabs
      tabBarStyle={{ paddingLeft: 28 }}
      items={[
        {
          key: "pending",
          label: (
            <Badge count={41} color="red" overflowCount={9}>
              En attentes
            </Badge>
          ),
          children: (
            <div
              style={{
                height: "calc(100vh - 242px)",
                overflowY: "auto",
                paddingLeft: 28,
                paddingRight: 12,
                paddingBottom: 28,
              }}
            >
              <Input
                placeholder="Rechercher ..."
                allowClear
                className="mb-4 mt-2"
                prefix={<SearchOutlined />}
                variant="borderless"
              />

              <List
                loading={isPending}
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                    extra={
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: "3",
                              label: "Voir",
                              icon: <EyeOutlined />,
                            },
                            {
                              key: "4",
                              label: "Accepter",
                              icon: <CheckOutlined />,
                            },
                            {
                              key: "5",
                              label: "Rejeter",
                              icon: <CloseOutlined />,
                            },
                            {
                              key: "1",
                              label: "Modifier",
                              icon: <EditOutlined />,
                            },
                            {
                              key: "2",
                              label: "Supprimer",
                              icon: <DeleteOutlined />,
                              danger: true,
                            },
                          ],
                        }}
                      >
                        <Button icon={<MoreOutlined />} type="text" />
                      </Dropdown>
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                        />
                      }
                      title={
                        <>
                          <Badge
                            color="green"
                            count={
                              item.type_of_enrollment === "new_application"
                                ? "New"
                                : ""
                            }
                          >
                            {item.first_name} {item.last_name} {item.surname}
                          </Badge>
                        </>
                      }
                      description={
                        <>
                          <Typography.Text type="danger">
                            {getApplicationStatusName(`${item.status}`)}
                          </Typography.Text>{" "}
                          : {item.class_year.acronym} {item.departement.name}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          ),
        },
        {
          key: "rejected",
          label: "Rejetées",
          children: (
            <div
              style={{
                height: "calc(100vh - 242px)",
                overflowY: "auto",
                paddingLeft: 28,
                paddingRight: 12,
                paddingBottom: 28,
              }}
            >
              <Input.Search
                placeholder="Rechercher ..."
                allowClear
                onSearch={() => {}}
                className="my-3"
              />
              <List />
            </div>
          ),
        },
      ]}
    />
  );
};
