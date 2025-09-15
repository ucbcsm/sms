"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import {
  getPeriodEnrollmentsbyFaculty,
  getPeriodEnrollmentsCountByStatus,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Badge, Col, Row, Tabs, Typography } from "antd";
import { useParams } from "next/navigation";
import { ListPeriodValidatedStudents } from "./list-validated-enrollments";
import { ListPeriodPendingStudents } from "./list-pending-enrollments";
import { ListPeriodRejectedStudents } from "./list-rejected-enrollments";

export default function Page() {
  const { facultyId, periodId } = useParams();
  const { yid } = useYid();
  const { data, isPending, isError } = useQuery({
    queryKey: ["period_enrollments", `${yid}`, facultyId, periodId],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollmentsbyFaculty(
        Number(queryKey[1]),
        Number(queryKey[2]),
        Number(queryKey[3])
      ),
    enabled: !!yid && !!facultyId && !!periodId,
  });

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[24, 24]} style={{ marginRight: 0 }}>
      <Col span={16}>
        <ListPeriodValidatedStudents />
      </Col>
      <Col span={8}>
        <div>
          <Typography.Title level={3}>Autres</Typography.Title>
          <Tabs
            tabBarStyle={{}}
            items={[
              {
                key: "pending",
                label: (
                  <Badge
                    count={getPeriodEnrollmentsCountByStatus(data, "pending")}
                    color="red"
                    overflowCount={9}
                  >
                    En attentes
                  </Badge>
                ),
                children: (
                  <div>
                    <ListPeriodPendingStudents />
                  </div>
                ),
              },
              {
                key: "rejected",
                label: "Rejetées",
                children: (
                  <div>
                    <ListPeriodRejectedStudents />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Col>
    </Row>
  );
}
