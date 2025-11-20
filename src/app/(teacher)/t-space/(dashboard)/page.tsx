"use client";

import { useYid } from "@/hooks/use-yid";
import {
  getLoggedTeacher,
  getTeacherTaughtCourses,
  getTeacherYears,
} from "@/lib/api";
import { useSessionStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Layout,
  Row,
  Space,
  Statistic,
  theme,
  Typography,
} from "antd";
import Link from "next/link";

export default function Page() {
  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const { user } = useSessionStore();
  const { yid } = useYid();

  const {
    data: teacher,
    isPending: isPendingTeacher,
    isError: isErrorTeacher,
  } = useQuery({
    queryKey: ["teacher"],
    queryFn: getLoggedTeacher,
    enabled: !!user?.id,
  });

  const {
    data: years,
    isPending: isPendingYears,
    isError: isErrorYears,
  } = useQuery({
    queryKey: ["years"],
    queryFn: getTeacherYears,
  });

  const {
    data: courses,
    isPending: isPendingCourses,
    isError: isErrorCourses,
  } = useQuery({
    queryKey: ["courses", `${yid}`],
    queryFn: ({ queryKey }) => getTeacherTaughtCourses(Number(queryKey[1])),
    enabled: !!yid,
  });

  const getCurrentYear = () => {
    return years?.find((y) => y.id === yid);
  };

  return (
    <Layout>
      <Layout.Content
        style={{
          padding: "0 28px 28px 28px",
          overflowY: "auto",
          height: "calc(100vh - 110px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            padding: 0,
            background: colorBgLayout,
          }}
        >
          <Space>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Tableau de bord
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space></Space>
        </Layout.Header>
        <Flex vertical={true} gap={24}>
          <Row
            gutter={[
              { xs: 16, sm: 18, md: 24 },
              { xs: 16, sm: 18, md: 24 },
            ]}
          >
            <Col xs={24} md={18}>
              <Row
                gutter={[
                  { xs: 16, sm: 18, md: 24 },
                  { xs: 16, sm: 18, md: 24 },
                ]}
              >
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      loading={isPendingYears}
                      title="Année"
                      value={getCurrentYear()?.name || ""}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Flex justify="space-between" align="flex-end">
                      <Statistic
                        loading={isPendingCourses}
                        title="Mes cours"
                        value={courses?.length || 0}
                      />
                      <Link href={`/t-space/courses`}>
                        <Button type="link">Voir les cours</Button>
                      </Link>
                    </Flex>
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Card>
                    <Statistic
                      loading={isPendingTeacher}
                      title="Mon titre"
                      value={teacher?.academic_title || "N/A"}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={6}>
              <Card loading={isPendingTeacher}>
                <Descriptions
                  extra={
                    <Link href={`/t-space/profile`}>
                      <Button type="link">Gérer</Button>
                    </Link>
                  }
                  title="Autres informations"
                  column={1}
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
              </Card>
            </Col>
          </Row>
        </Flex>
      </Layout.Content>
    </Layout>
  );
  // <Layout>
  //   <Layout.Content
  //     style={{
  //       overflowY: "auto",
  //       height: "calc(100vh - 64px)",
  //       padding: 24
  //     }}
  //   >
  //     <Card>
  //       <Alert
  //         showIcon
  //         type="info"
  //         message="Information"
  //         description="Cette partie est en cours de migration depuis l'ancienne version séparée et sera bientôt disponible."
  //       />
  //     </Card>
  //   </Layout.Content>
  // </Layout>
}
