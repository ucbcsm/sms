'use client'

import { getYearEnrollments } from "@/lib/api"
import { Enrollment } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { List, Typography } from "antd"
import { Dispatch, FC, SetStateAction, useEffect } from "react"

type StudentEnrollmentsProps = {
  matricule?: string;
  setPreviousEnrollments?: Dispatch<SetStateAction<Enrollment[] | undefined>>;
};

export const StudentEnrollments:FC<StudentEnrollmentsProps>=({matricule, setPreviousEnrollments})=>{

    const {
      data,
      isPending,
      isError,
    } = useQuery({
      queryKey: ["student_enrollments", matricule],
      queryFn: () =>
        getYearEnrollments({
          search: matricule,
        }),
      enabled: !!matricule,
    });

    useEffect(() => {
      if (data?.results) {
        setPreviousEnrollments && setPreviousEnrollments(data.results);
      }
    }, [data, setPreviousEnrollments]);

return (
  <List
    header={
      <Typography.Title level={5} style={{ marginBottom: 0 }}>
        Anciennes inscriptions
      </Typography.Title>
    }
    size="small"
    loading={isPending}
    dataSource={data?.results}
    renderItem={(item) => (
      <List.Item key={item.id}>
        <List.Item.Meta
          title={item.academic_year.name}
          description={`${item.class_year.acronym} ${item.departement.name}`}
        />
      </List.Item>
    )}
  />
);
}