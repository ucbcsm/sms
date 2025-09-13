"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import {
  getApplicationStatusName,
  getApplicationStatusTypographyType,
  getPeriodEnrollmentsbyFaculty,
  getPeriodEnrollmentsByStatus,
  getPeriodEnrollmentsCountByStatus,
} from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { PeriodEnrollment } from "@/types";
import { CheckOutlined, CloseOutlined, HourglassOutlined, MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Col,
  Dropdown,
  List,
  Row,
  Space,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { ListPeriodValidatedStudents } from "./list-validated-enrollments";
import { ValidateSignlePeriodEnllmentForm } from "./forms/decisions/validate";
import { RejectSinglePeriodEnrollmentForm } from "./forms/decisions/reject";
import { PendingSinglePeriodEnrollmentForm } from "./forms/decisions/pending";
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

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[24, 24]}>
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
                    {/* <List
                      dataSource={getPeriodEnrollmentsByStatus(data, "pending")}
                      renderItem={(item) => (
                        <ListPeriodEnrollmentItem key={item.id} item={item} />
                      )}
                    /> */}
                  </div>
                ),
              },
              {
                key: "rejected",
                label: "Rejetées",
                children: (
                  <div>
                    <ListPeriodRejectedStudents />
                    {/* <List
                      dataSource={getPeriodEnrollmentsByStatus(
                        data,
                        "rejected"
                      )}
                      renderItem={(item) => (
                        <ListPeriodEnrollmentItem key={item.id} item={item} />
                      )}
                    /> */}
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
