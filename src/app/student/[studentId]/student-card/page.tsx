"use client";

import { useInstitution } from "@/hooks/use-institution";
import { getYearEnrollment } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Row, Col, } from "antd";
import { useParams } from "next/navigation";

export default function StudentCardPage() {

  const {studentId}=useParams()

  const {
    data: institution,
    isPending: isPendingInstitution,
    isError: isErrorInstitution,
  } = useInstitution();

   const {
      data: enrolledStudent,
      isPending,
      isError,
    } = useQuery({
      queryKey: ["enrollment", studentId],
      queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
      enabled: !!studentId,
    });

    return (
      <div>
        <Row justify="center" gutter={[16, 16]} style={{ marginTop: 40 }}>
          <Col>
            <Card
              style={{
                width: 350,
              }}
            >
              <Typography.Text type="secondary">Recto soon...</Typography.Text>
            </Card>
          </Col>
          <Col>
            <Card
              style={{
                width: 350,
              }}
            >
              <div className="text-center">
                <Typography.Title level={3}>Laisser passer</Typography.Title>
                <Typography.Paragraph>
                  Cette carte est une propriété privée de l&apos;
                  {institution?.acronym || "l'institution"}, en cas de perte la
                  retourner à l&apos;{institution?.acronym || "l'institution"}.
                  Les autorités tant civiles que militaires sont priées
                  d&apos;apporter assistance au porteur de la présente.
                </Typography.Paragraph>
                <Typography.Title
                  level={5}
                  style={{ textTransform: "uppercase", textAlign: "center" }}
                >
                  {institution?.parent_organization}
                </Typography.Title>
                <Typography.Title
                  level={5}
                  style={{ textTransform: "uppercase", textAlign: "center" }}
                >
                  {institution?.name}
                </Typography.Title>
                <Typography.Title
                  level={5}
                  style={{ textTransform: "uppercase", textAlign: "center" }}
                >
                  République Démogratique du Congo
                </Typography.Title>

                <Typography.Text>{institution?.web_site}</Typography.Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
}
