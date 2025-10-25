"use client";

import {
  Tabs,
} from "antd";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { PeriodGradesTab } from "./_components/periodGradesTab";
import { YearGradesTab } from "./_components/yearGradesTab";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getYearEnrollment } from "@/lib/api";

export default function Page() {
  const [selectedTab, setSelectedTab] = useQueryState(
    "tab",
    parseAsStringEnum(["year-grade", "period-grade"]).withDefault("year-grade")
  );
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
  
  return (
    <div className="px-6">
      <Tabs
        type="line"
        items={[
          {
            key: "year-grade",
            label: "Rélevé de notes annuel",
            children: <YearGradesTab userId={enrolledStudent?.user.id} />,
          },
          {
            key: "period-grade",
            label: "Rélevé de notes par période",
            children: <PeriodGradesTab userId={enrolledStudent?.user.id} />,
          },
        ]}
        onChange={(key) => {
          setSelectedTab(key as "year-grade" | "period-grade");
        }}
      />

      {/* Résumé des crédits */}
      {/* <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Flex justify="space-between">
              <Statistic title="Total des crédits" value={180} />
              <Progress type="dashboard" percent={100} size={58} />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Flex justify="space-between">
              <Statistic title="Crédits validés" value={90} />
              <Progress type="dashboard" percent={50} size={58} />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Flex justify="space-between">
              <Statistic
                title="Nombre de cours"
                value={40} // Remplacez par le nombre total de cours
              />
              <Progress type="dashboard" percent={100} size={58} />
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6}>
          <Card>
            <Flex justify="space-between">
              <Statistic title="Cours validés" value={20} />
              <Progress type="dashboard" percent={50} size={58} />
            </Flex>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}
