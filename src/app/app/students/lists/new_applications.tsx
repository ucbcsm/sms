"use client";

import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  getPendingApplications,
  getRejectedApplications,
  getValidatedApplications,
} from "@/lib/api";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Input, List, Tabs } from "antd";
import { FC } from "react";
import { ListItemApplication } from "./listItem";

export const ListNewApplications: FC = () => {
  const {
    data: pendingApplications,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["applications", "pending"],
    queryFn: async ({ queryKey }) => getPendingApplications({}),
  });

  const { data: rejectedApplications } = useQuery({
    queryKey: ["applications", "rejected"],
    queryFn: async ({ queryKey }) => getRejectedApplications({}),
  });

  const { data: validatedApplications } = useQuery({
    queryKey: ["applications", "validated"],
    queryFn: async ({ queryKey }) => getValidatedApplications({}),
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
                dataSource={pendingApplications}
                renderItem={(item) => (
                  <ListItemApplication key={item.id} item={item} />
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
              <Input
                placeholder="Rechercher ..."
                allowClear
                className="mb-4 mt-2"
                prefix={<SearchOutlined />}
                variant="borderless"
              />
              <List
                loading={isPending}
                dataSource={rejectedApplications}
                renderItem={(item) => (
                  <ListItemApplication key={item.id} item={item} />
                )}
              />
            </div>
          ),
        },
        {
          key: "validated",
          label: "Acceptées",
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
                dataSource={validatedApplications}
                renderItem={(item) => (
                  <ListItemApplication key={item.id} item={item} />
                )}
              />
            </div>
          ),
        },
      ]}
    />
  );
};
