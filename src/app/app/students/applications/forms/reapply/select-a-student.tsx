"use client";

import { getYearEnrollments } from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { Enrollment } from "@/types";
import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Empty, Select, Spin, Typography } from "antd";
import { Options } from "nuqs";
import { CSSProperties, Dispatch, FC, SetStateAction, useEffect, useState } from "react";

const useSearchDebounce = (value: string | null, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Cas spécial : si l'utilisateur efface tout, on répond immédiatement
    if (value === "" || value === null) {
      setDebouncedValue(value);
      return;
    }

    // Cas spécial : si la valeur est très courte, on attend moins
    const actualDelay = value.length <= 2 ? 500 : delay;

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, actualDelay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

type SelectAStudentProps = {
  search: string | null;
  setSearch: (
    value: string | ((old: string | null) => string | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
  selectedStudent?: Enrollment;
  setSelectedStudent: Dispatch<SetStateAction<Enrollment | undefined>>;
  variant?:"outlined" | "borderless" | "filled" | "underlined";
  style?:CSSProperties
};

export const SelectAStudent: FC<SelectAStudentProps> = ({
  selectedStudent,
  setSelectedStudent,
  search,
  setSearch,
  variant="outlined",
  style
}) => {
  const debouncedSearch = useSearchDebounce(search, 300);

  const {
    data: data,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useQuery({
    queryKey: ["search_year_enrollments", debouncedSearch],
    queryFn: () =>
      getYearEnrollments({
        search:
          debouncedSearch && debouncedSearch.trim() !== ""
            ? debouncedSearch
            : undefined,
      }),
  });

  return (
    <Select
      searchValue={search ? (selectedStudent ? undefined : search) : undefined}
      variant={variant}
      prefix={
        variant !== "borderless" && variant !== "underlined" ? (
          <UserOutlined />
        ) : undefined
      }
      placeholder="Nom ou matricule de l'étudiant"
      showSearch
      labelInValue
      size="large"
      filterOption={false}
      value={
        data?.results && data?.results.length > 0 && selectedStudent
          ? selectedStudent.id
          : undefined
      }
      options={(data?.results ?? []).map((enrollment) => ({
        label: `${enrollment.user.matricule} - ${enrollment.user.first_name} ${enrollment.user.last_name} ${enrollment.user.surname}`,
        value: enrollment.id,
        avatar:
          enrollment.user.avatar ||
          `${enrollment.user.first_name
            ?.charAt(0)
            .toUpperCase()}${enrollment.user.last_name
            ?.charAt(0)
            .toUpperCase()}`,
      }))}
      loading={isLoadingStudents || search !== debouncedSearch}
      notFoundContent={
        isLoadingStudents ? (
          <Spin size="small" />
        ) : isErrorStudents ? (
          "Erreur de chargement"
        ) : search && search.trim() !== "" ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Aucun étudiant trouvé"
            children={`Recherche: "${search}"`}
          />
        ) : (
          "Saisir pour rechercher"
        )
      }
      allowClear
      style={style}
      styles={{}}
      onClear={() => {
        setSelectedStudent(undefined);
        setSearch(null);
      }}
      onSearch={(value) => {
        setSearch(value);
      }}
      optionRender={(option) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {option.data.avatar && (
            <Avatar
              src={option.data.avatar}
              style={{
                marginRight: 8,
                backgroundColor: getHSLColor(option.data.label),
              }}
            >
              {option.data.label.split("-")[1].substring(0, 2)}
            </Avatar>
          )}
          <Typography.Text style={{ flex: 1 }} ellipsis={{}}>
            {option.label}
          </Typography.Text>
        </div>
      )}
      onSelect={(_, { value }) => {
        const selected = data?.results.find(
          (enrollment) => enrollment.id === value
        );
        setSelectedStudent(selected);
      }}
    />
  );
};
