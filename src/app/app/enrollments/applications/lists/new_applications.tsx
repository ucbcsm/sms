"use client";

import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { Badge, Tabs } from "antd";
import { FC } from "react";
import { ListRejectedApplications } from "./listRejected";
import { ListValidatedApplications } from "./listValidated";
import { ListPendingApplications } from "./listPending";
import { usePendingApplications } from "@/hooks/use-pending-application";
import { useYid } from "@/hooks/use-yid";


export const DataFetchingSkeleton = () => (
  <>
    <DataFetchPendingSkeleton />
    <div className="mt-5">
      <DataFetchPendingSkeleton />
    </div>
  </>
);

export const ListNewApplications: FC = () => {
  const {yid}=useYid()
  const {data}=usePendingApplications("is_new_student",yid)

  return (
    <Tabs
      tabPosition="bottom"
      type="card"
      tabBarStyle={{ paddingLeft: 28, marginTop: 0 }}
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
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              <ListPendingApplications
                typeOfApplication="is_new_student"
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
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              <ListRejectedApplications
                typeOfApplication="is_new_student"
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
                paddingLeft: 16,
                paddingRight: 16,
                paddingBottom: 28,
                paddingTop: 20,
              }}
            >
              <ListValidatedApplications
                typeOfApplication="is_new_student"
                year={yid}
              />
            </div>
          ),
        },
      ]}
    />
  );
};
