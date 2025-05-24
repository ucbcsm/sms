import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { getHSLColor, getMaritalStatusName } from "@/lib/utils";
import { Department, Faculty, Teacher } from "@/types";
import { EditOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Descriptions,
  Flex,
  Image,
  Space,
  Typography,
} from "antd";
import { FC } from "react";
import { EditTeacherProfileForm } from "./edit";

type TeacherProfileDetailsProps = {
  teacher?: Teacher;
  isPending: boolean;
  isError: boolean;
  faculties?: Faculty[];
  departments?: Department[];
};
export const TeacherProfileDetails: FC<TeacherProfileDetailsProps> = ({
  teacher,
  isError,
  isPending,
  departments,
  faculties,
}) => {
  if (isError) {
    return <DataFetchErrorResult />;
  }

  if (teacher) {
    return (
      <>
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingLeft: 28, paddingRight: 28, paddingTop: 12 }}
        >
          <Typography.Title level={5} className="">
            Profile
          </Typography.Title>
          <EditTeacherProfileForm
            teacher={teacher}
            departments={departments}
            faculties={faculties}
          />
        </Flex>
        <Space
          direction="vertical"
          size="middle"
          style={{
            padding: "40px 0 40px 28px",
            width: "100%",
            height: "calc(100vh - 108px)",
            overflowY: "auto",
          }}
        >
          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            {teacher?.user.avatar ? (
              <Image
                height={100}
                width={100}
                src={teacher?.user.avatar || ""}
                alt="Avatar de l'enseignant"
                style={{
                  marginBottom: 28,
                  objectFit: "cover",
                }}
                className="rounded-full"
              />
            ) : (
              <Avatar
                size={100}
                style={{
                  background: getHSLColor(
                    `${teacher?.user.first_name} ${teacher?.user.last_name} ${teacher?.user.surname}`
                  ),
                  marginBottom: 16,
                }}
              >
                {`${teacher?.user.first_name?.[0]}${teacher?.user.last_name?.[0]}`}
              </Avatar>
            )}
            <Typography.Title level={4}>
              {teacher?.user.first_name} {teacher?.user.last_name}
            </Typography.Title>
            <Typography.Text type="secondary">
              ID: {teacher?.user.matricule.padStart(6, "0")}
            </Typography.Text>
          </div>
          <Descriptions
            title="Identité"
            column={1}
            items={[
              {
                key: "name",
                label: "Nom",
                children: teacher?.user.first_name || "",
              },
              {
                key: "postnom",
                label: "Postnom",
                children: teacher?.user.last_name || "",
              },
              {
                key: "prenom",
                label: "Prénom",
                children: teacher?.user.surname || "",
              },
              {
                key: "sex",
                label: "Genre",
                children: teacher?.gender === "M" ? "Homme" : "Femme",
              },
              {
                key: "nationalite",
                label: "Nationalité",
                children: teacher?.nationality,
              },
              {
                key: "marital_status",
                label: "État civil",
                children: getMaritalStatusName(`${teacher?.marital_status}`),
              },
              // {
              //   key: "lieu_naissance",
              //   label: "Lieu de naissance",
              //   children: "Bafwasende",
              // },
              // {
              //   key: "date_naissance",
              //   label: "Date de naissance",
              //   children: "01 Janvier 1980",
              // },

              // {
              //   key: "ville",
              //   label: "Ville",
              //   children: "Beni",
              // },
              // {
              //   key: "adresse",
              //   label: "Adresse",
              //   children: "123 Rue Exemple, Kinshasa",
              // },
            ]}
          />
          <Descriptions
            title="Contacts"
            column={1}
            items={[
              {
                key: "email",
                label: "Email",
                children: (
                  <a href={`mailto:${teacher?.user.email}`}>
                    {teacher?.user.email}
                  </a>
                ),
              },
              {
                key: "phone_number_1",
                label: "Téléphone 1",
                children: (
                  <a href={`tel:${teacher?.phone_number_1}`}>
                    {teacher?.phone_number_1}
                  </a>
                ),
              },
              {
                key: "phone_number_2",
                label: "Téléphone 2",
                children: (
                  <a href={`tel:${teacher?.phone_number_2}`}>
                    {teacher?.phone_number_2}
                  </a>
                ),
              },
            ]}
          />
        </Space>
      </>
    );
  }
  return (
    <div className="p-6">
      <DataFetchPendingSkeleton />
    </div>
  );
};
