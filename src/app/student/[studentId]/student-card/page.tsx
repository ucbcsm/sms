"use client";

import { useInstitution } from "@/hooks/use-institution";
import { getYearEnrollment } from "@/lib/api";
import { getPublicR2Url } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Row, Col, Image, Flex, QRCode, } from "antd";
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
              loading={isPending || isPendingInstitution}
            >
              <Typography.Title
                level={5}
                style={{ textTransform: "uppercase", textAlign: "center" }}
              >
                {institution?.name}
              </Typography.Title>
              <Typography.Title
                level={5}
                className="text-center"
                style={{ textTransform: "uppercase" }}
              >
                Carte d&apos;étudiant
              </Typography.Title>
              <Flex justify="space-between">
                <div>
                  <Typography.Text style={{ display: "block" }}>
                    Matricule: {enrolledStudent?.user.matricule}
                  </Typography.Text>
                  <Typography.Text style={{ display: "block" }}>
                    Nom:{" "}
                    {`${enrolledStudent?.user.surname} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.first_name}`}
                  </Typography.Text>
                  <Typography.Text style={{ display: "block" }}>
                    Sexe: {enrolledStudent?.user.gender}
                  </Typography.Text>
                  <Typography.Text style={{ display: "block" }}>
                    Date de naissance:{" "}
                    {new Date(
                      enrolledStudent?.common_enrollment_infos.date_of_birth ||
                        ""
                    ).toLocaleDateString()}
                  </Typography.Text>
                  <Typography.Text>
                    Lieu de naissance:{" "}
                    {enrolledStudent?.common_enrollment_infos.place_of_birth}
                  </Typography.Text>
                  <Typography.Text style={{ display: "block" }}>
                    Filière: {enrolledStudent?.faculty.name}
                  </Typography.Text>
                  <Typography.Text style={{ display: "block" }}>
                    Mention: {enrolledStudent?.departement.name}
                  </Typography.Text>
                  <QRCode value={`${enrolledStudent?.user.matricule}`} />
                </div>
                <div>
                  <Image
                    alt="Photo"
                    src={
                      getPublicR2Url(enrolledStudent?.user.avatar) || undefined
                    }
                    height="auto"
                    width={96}
                  />
                </div>
              </Flex>
            </Card>
          </Col>
          <Col>
            <Card
              loading={isPending || isPendingInstitution}
              style={{
                width: 350,
              }}
            >
              <div className="text-center">
                <Typography.Title
                  level={5}
                  style={{ textTransform: "uppercase" }}
                >
                  Laisser passer
                </Typography.Title>
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
