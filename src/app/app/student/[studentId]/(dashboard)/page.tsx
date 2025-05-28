"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { getYearEnrollment } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Flex,
  Progress,
  Row,
  Skeleton,
  Statistic,
} from "antd";
import { useParams } from "next/navigation";

export default function Page() {
  const { studentId } = useParams();

  const {
    data: enrolledStudent,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["enrollment", studentId],
    queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    enabled: !!studentId,
  });

  if (isError) {
      return <DataFetchErrorResult />;
    }

  return (
    <Row gutter={24}>
      <Col span={18}>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card>
              <Statistic
                loading={isPending}
                title="Promotion actuelle"
                value={enrolledStudent?.class_year.acronym}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Statut académique"
                  value={
                    enrolledStudent?.status === "enabled" ? "Actif" : "Abandon"
                  }
                />
                {!isPending ? (
                  <Progress
                    type="dashboard"
                    size={58}
                    percent={100}
                    status={
                      enrolledStudent?.status === "enabled"
                        ? "success"
                        : "exception"
                    }
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Frais d'inscription"
                  value={
                    enrolledStudent?.enrollment_fees === "paid"
                      ? "Payé"
                      : "Non payé"
                  }
                />
                {!isPending ? (
                  <Progress
                    type="dashboard"
                    percent={100}
                    size={58}
                    status={
                      enrolledStudent?.enrollment_fees === "paid"
                        ? "success"
                        : "exception"
                    }
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                loading={isPending}
                title="Frais académiques"
                value={`${new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                }).format(200)} / ${new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                }).format(500)}`}
              />
            </Card>
          </Col>
          
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Résultat S1"
                  value="60%"
                />
                {/* <Progress type="dashboard" percent={60} size={58} /> */}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Résultat S2"
                  value="62%"
                />
                {/* <Progress type="dashboard" percent={62} size={58} /> */}
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Moyenne générale"
                  value="61%"
                />
                {/* <Progress type="dashboard" percent={61} size={58} /> */}
              </Flex>
            </Card>
          </Col>

          <Col span={8}>
            <Card>
              <Statistic
                loading={isPending}
                title="Date de validation"
                value={
                  enrolledStudent?.date_of_enrollment
                    ? `${new Intl.DateTimeFormat("fr", {
                        dateStyle: "long",
                      }).format(
                        new Date(`${enrolledStudent?.date_of_enrollment}`)
                      )}`
                    : ""
                }
              />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={6}>
        <Card loading={isPending}>
          <Descriptions
            title="Filières"
            column={1}
            items={[
              {
                key: "domaine",
                label: "Domaine",
                children: enrolledStudent?.field.name || "",
              },
              {
                key: "faculte",
                label: "Faculté",
                children: enrolledStudent?.faculty.name || "",
              },
              {
                key: "departement",
                label: "Département",
                children: enrolledStudent?.departement.name || "",
              },
              {
                key: "cycle",
                label: "Cycle",
                children: enrolledStudent?.cycle.name,
              },
              {
                key: "specialisation",
                label: "Spécialisation",
                children: "",
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  );
}
