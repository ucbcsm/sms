"use client";

import { Badge, Tabs } from "antd";
import { FC } from "react";
import { useYid } from "@/hooks/use-yid";
import { usePendingApplications } from "@/hooks/use-pending-application";
import { ListPendingApplications } from "./listPending";
import { ListRejectedApplications } from "./listRejected";
import { ListValidatedApplications } from "./listValidated";

export const ListReApplications: FC = () => {
  const {yid}=useYid()
 const {data}=usePendingApplications("is_old_student", yid)

  return (
    <Tabs
      tabBarStyle={{ paddingLeft: 20, marginBottom: 0 }}
      items={[
        {
          key: "pending",
          label: (
            <Badge count={data?.results.length} color="red" overflowCount={9}>
              En attentes
            </Badge>
          ),
          children: (
            <div
              style={{
                height: "calc(100vh - 210px)",
                overflowY: "auto",
                paddingLeft: 28,
                paddingRight: 12,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              <ListPendingApplications
                typeOfApplication="is_old_student"
                year={yid}
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
                height: "calc(100vh - 210px)",
                overflowY: "auto",
                paddingLeft: 28,
                paddingRight: 12,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              <ListRejectedApplications
                typeOfApplication="is_old_student"
                year={yid}
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
                height: "calc(100vh - 210px)",
                overflowY: "auto",
                paddingLeft: 28,
                paddingRight: 12,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              <ListValidatedApplications
                typeOfApplication="is_old_student"
                year={yid}
              />
            </div>
          ),
        },
      ]}
    />
  );
};
