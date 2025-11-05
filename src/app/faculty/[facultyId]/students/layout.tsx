"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import {
  getAllYearEnrollmentsByFaculty,
  getClasses,
  getDepartmentsByFacultyId,
  getPeriodEnrollmentsbyFaculty,
  getPeriodsByYear,
} from "@/lib/api";
import { Period } from "@/types";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  Layout,
  Menu,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { NewPeriodEnrollmentForm } from "./[periodId]/forms/new";
import Link from "next/link";

export default function StudentsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();
  const { facultyId, periodId } = useParams();
  const { yid } = useYid();

  const { data: yearEnrollments } = useQuery({
    queryKey: ["all_year_enrollments", `${yid}`, facultyId],
    queryFn: ({ queryKey }) =>
      getAllYearEnrollmentsByFaculty(Number(queryKey[1]), Number(queryKey[2])),
    enabled: !!yid && !!facultyId,
  });

  const {
    data: periods,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["periods", `${yid}`],
    queryFn: ({ queryKey }) => getPeriodsByYear(Number(queryKey[1])),
    enabled: !!yid,
  });

  const { data: periodEnrollments } = useQuery({
    queryKey: ["period_enrollments", `${yid}`, facultyId, periodId],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollmentsbyFaculty(
        Number(queryKey[1]),
        Number(queryKey[2]),
        Number(queryKey[3])
      ),
    enabled: !!yid && !!facultyId && !!periodId,
  });

  const getPeriodsAsTabs = (periods?: Period[]) => {
    return periods?.map((period) => ({
      key: `/faculty/${facultyId}/students/${period.id}`,
      label: (
        <Link
          href={`/faculty/${facultyId}/students/${period.id}`}
        >{`${period.name} (${period.acronym})`}</Link>
      ),
    }));
  };

  const { data: departments } = useQuery({
    queryKey: ["departments", facultyId],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!facultyId,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  const getPeriodsAsDropdownMenu = (periods?: Period[]) => {
    return periods?.map((period) => ({
      key: `${period.id}`,
      label: `${period.name} (${period.acronym})`,
      icon: <ClockCircleOutlined />,
    }));
  };

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          // background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f5f5f5",
            padding: 0,
          }}
        >
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Étudiants
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            {!isPending ? (
              <NewPeriodEnrollmentForm
                periodsAsMenu={[...(getPeriodsAsDropdownMenu(periods) || [])]}
                periods={periods}
                yearEnrollments={yearEnrollments}
                periodEnrollments={periodEnrollments}
                departments={departments}
                classes={classes} // Promotions
              />
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
        </Layout.Header>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          items={[
            {
              key: `/faculty/${facultyId}/students`,
              label: <Link href={`/faculty/${facultyId}/students`}>Année</Link>,
            },
            ...(getPeriodsAsTabs(periods) || []),
          ]}
        />

        <div
          className="pt-4"
        >
          {children}
        </div>
      </Layout.Content>
    </Layout>
  );
}
