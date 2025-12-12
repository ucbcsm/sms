"use client";

import { getLoggedTeacher } from "@/lib/api";
import { getHSLColor, getMaritalStatusName, getPublicR2Url } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Form,
  Image,
  Layout,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { useSessionStore } from "@/store";
import Link from "next/link";

export default function Page() {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const { user } = useSessionStore();


  const {
    data: teacher,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["teacher"],
    queryFn: getLoggedTeacher,
    enabled: !!user?.id,
  });

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 28px 28px 28px",
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Layout.Header
          style={{
            background: colorBgLayout,
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          <Space>
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {/* Mon compte étudiant */}
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>{/* <Palette /> */}</Space>
        </Layout.Header>

        {!isPending ? (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            {teacher?.user.avatar ? (
              <Image
                height={100}
                width={100}
                src={teacher?.user.avatar || ""}
                className=" bg-gray-400 object-cover rounded-full"
                style={{ marginBottom: 16 }}
              />
            ) : (
              <Avatar
                size={100}
                style={{
                  background: getHSLColor(
                    `${teacher?.user.surname} ${teacher?.user.last_name} ${teacher?.user.first_name}`
                  ),
                  marginBottom: 16,
                }}
                src={getPublicR2Url(teacher?.user.avatar)}
              >
                {`${teacher?.user.first_name?.[0]}`}
              </Avatar>
            )}
            <Typography.Title
              level={4}
            >{`${teacher?.user.surname} ${teacher?.user.last_name} ${teacher?.user.first_name}`}</Typography.Title>
            <Typography.Text type="secondary">
              Matr. {teacher?.user.matricule}
            </Typography.Text>
          </div>
        ) : (
          <Flex vertical align="center" gap={8}>
            <Skeleton.Avatar size={100} active />
            <Skeleton.Input active size="large" />
            <Skeleton.Input active size="small" />
          </Flex>
        )}

        <Card loading={isPending}>
          <Space orientation="vertical" size="large">
            <Descriptions
              // extra={<EditTeacherProfileForm teacher={teacher} />}
              title="Identité"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "name",
                  label: "Nom",
                  children: teacher?.user.surname || "",
                },
                {
                  key: "postnom",
                  label: "Postnom",
                  children: teacher?.user.last_name || "",
                },
                {
                  key: "prenom",
                  label: "Prénom",
                  children: teacher?.user.first_name || "",
                },
                {
                  key: "sex",
                  label: "Sexe",
                  children: teacher?.gender === "M" ? "Masculin" : "Féminin",
                },
                {
                  key: "lieu_naissance",
                  label: "Lieu de naissance",
                  children: teacher?.place_of_birth || "",
                },
                {
                  key: "date_naissance",
                  label: "Date de naissance",
                  children: teacher?.date_of_birth
                    ? new Intl.DateTimeFormat("fr", {
                        dateStyle: "long",
                      }).format(new Date(`${teacher.date_of_birth}`))
                    : "",
                },
                {
                  key: "nationalite",
                  label: "Nationalité",
                  children: teacher?.nationality || "",
                },
                {
                  key: "marital_status",
                  label: "État civil",
                  children: getMaritalStatusName(`${teacher?.marital_status}`),
                },
                {
                  key: "physical_ability",
                  label: "Aptitude physique",
                  children:
                    teacher?.physical_ability === "normal"
                      ? "Normale"
                      : "Handicapé",
                },
                {
                  key: "religious_affiliation",
                  label: "Affiliation religieuse",
                  children: teacher?.religious_affiliation,
                },
                {
                  key: "stranger",
                  label: "Etranger?",
                  children: teacher?.is_foreign_country_teacher ? "Oui" : "Non",
                },
              ]}
            />
            <Divider />

            <Descriptions
              title="Études et titres académiques"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "education_level",
                  label: "Niveau d'éducation",
                  children: teacher?.education_level || "",
                },
                {
                  key: "field_of_study",
                  label: "Domaine d'étude",
                  children: teacher?.field_of_study || "",
                },
                {
                  key: "academic_title",
                  label: "Titre académique",
                  children: teacher?.academic_title || "",
                },
                {
                  key: "academic_grade",
                  label: "Grade académique",
                  children: teacher?.academic_grade || "",
                },
              ]}
            />
            <Descriptions
              title="Contacts"
              column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              items={[
                {
                  key: "email",
                  label: "Email",
                  children: teacher?.user.email || "",
                },
                {
                  key: "phone_number_1",
                  label: "Téléphone 1",
                  children: teacher?.phone_number_1 || "",
                },
                {
                  key: "phone_number_2",
                  label: "Téléphone 2",
                  children: teacher?.phone_number_2 || "",
                },
              ]}
            />
            <Divider />
            <Alert
              showIcon={false}
              type="error"
              title="Sécurité du compte"
              description="Mot de passe fort recommandé pour protéger vos informations personnelles."
              action={
                <Link href={`/auth/reset-password`}>
                  <Button color="danger" variant="solid">
                    Changer mot de passe
                  </Button>
                </Link>
              }
            />
          </Space>
        </Card>
      </Layout.Content>
    </Layout>
  );
}
