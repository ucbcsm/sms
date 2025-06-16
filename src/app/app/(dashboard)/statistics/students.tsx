import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import { getYearDashboard, getYearProgressPercent } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Flex, Progress, Row, Skeleton, Statistic } from "antd";

export function StudentsStatistics() {
  const { yid } = useYid();
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard", `${yid}`],
    queryFn: ({ queryKey }) => getYearDashboard(Number(queryKey[1])),
    enabled: !!yid,
  });

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card>
          <Flex>
            <Statistic
              loading={isPending}
              title="Année"
              value={data?.year.name}
            />
            {!isPending ? (
              <Progress
                type="line"
                percent={getYearProgressPercent(
                  data?.year.start_date!,
                  data?.year.end_date!
                )}
                style={{ position: "absolute", right: 16, width: 100 }}
              />
            ) : (
              <Skeleton.Input
                size="small"
                active
                style={{ position: "absolute", right: 16, width: 100 }}
              />
            )}
          </Flex>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Etudiants"
              value={data?.student_counter}
            />
            {!isPending ? (
              <Progress type="dashboard" percent={100} size={58} />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Hommes"
              value={data?.male_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={(data?.male_count! / data?.student_counter!) * 100}
                size={58}
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Femmes"
              value={data?.female_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={(data?.female_count! / data?.student_counter!) * 100}
                size={58}
                strokeColor="cyan"
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Actifs"
              value={data?.actif_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={(data?.actif_count! / data?.student_counter!) * 100}
                size={58}
                strokeColor="cyan"
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Abandons"
              value={data?.inactif_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={(data?.inactif_count! / data?.student_counter!) * 100}
                size={58}
                strokeColor="cyan"
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Filières"
              value={data?.faculty_count}
            />
          </Flex>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Mentions"
              value={data?.departement_count}
            />
          </Flex>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Salles de classe"
              value={data?.class_room_count}
            />
          </Flex>
        </Card>
      </Col>
    </Row>
  );
}
