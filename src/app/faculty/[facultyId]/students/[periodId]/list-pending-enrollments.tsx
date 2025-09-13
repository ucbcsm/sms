"use client";

import { List } from "antd";
import { ListPeriodEnrollmentItem } from "./list-item";
import { useQuery } from "@tanstack/react-query";
import { getPeriodEnrollments } from "@/lib/api";
import { useParams } from "next/navigation";
import { useYid } from "@/hooks/use-yid";

export const ListPeriodPendingStudents = () => {
  const { facultyId, periodId } = useParams();
  const { yid } = useYid();
  const {
    data,
    isPending: isPendingPeriodEnrollments,
    isError: isErrorPeriodEnrollments,
  } = useQuery({
    queryKey: [
      "period_enrollments",
      `${yid}`,
      facultyId,
      periodId,
      "pending",
      //   departmentId,
      //   classId,
      //   page,
      //   pageSize,
      //   search,
    ],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollments({
        yearId: Number(queryKey[1]),
        facultyId: Number(queryKey[2]),
        periodId: Number(queryKey[3]),
        // departmentId: departmentId !== 0 ? departmentId : undefined,
        // classId: classId !== 0 ? classId : undefined,
        // page: page !== 0 ? page : undefined,
        // pageSize: pageSize !== 0 ? pageSize : undefined,
        // search: search !== null && search.trim() !== "" ? search : undefined,
        status: "pending",
      }),
    enabled: !!yid && !!facultyId && !!periodId,
  });
  return (
    <List
      loading={isPendingPeriodEnrollments}
      dataSource={data?.results}
      renderItem={(item) => (
        <ListPeriodEnrollmentItem key={item.id} item={item} />
      )}
    />
  );
};
