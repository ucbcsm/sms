"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Input, List } from "antd";
import { FC, useState } from "react";
import { ListItemApplication } from "./listItem";
import { useQuery } from "@tanstack/react-query";
import { getValidatedApplications } from "@/lib/api";
import { DataFetchingSkeleton } from "./new_applications";
import { DataFetchErrorResult } from "@/components/errorResult";
type ListValidatedApplicationsProps = {
  typeOfApplication: "is_new_student" | "is_old_student";
  year?: number;
};
export const ListValidatedApplications: FC<ListValidatedApplicationsProps> = ({
  typeOfApplication,
  year
}) => {

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [search, setSearch] = useState<string|null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: [
      "applications",
      year,
      "validated",
      typeOfApplication,
      page,
      pageSize,
      search,
    ],
    queryFn: async ({ queryKey }) =>
      getValidatedApplications({
        year: Number(year),
        student_tab_type: typeOfApplication,
        page: page !== 0 ? page : undefined,
        page_size: pageSize !== 0 ? pageSize : undefined,
        search: search !== null ? search : undefined,
      }),
    enabled: !!year,
  });

  return (
    <>
      <Input
        placeholder="Rechercher ..."
        allowClear
        className="mb-4 mt-2"
        prefix={<SearchOutlined />}
        variant="borderless"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      {data && (
        <>
          <List
            size="small"
            dataSource={data.results}
            renderItem={(item) => (
              <ListItemApplication key={item.id} item={item} />
            )}
            pagination={{
              defaultPageSize: 25,
              pageSizeOptions: [25, 50, 75, 100],
              size: "small",
              showSizeChanger: true,
              total: data?.count,
              current: page !== 0 ? page : 1,
              pageSize: pageSize !== 0 ? pageSize : 25,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </>
      )}
      {isPending && <DataFetchingSkeleton />}
      {isError && <DataFetchErrorResult />}
    </>
  );
};
