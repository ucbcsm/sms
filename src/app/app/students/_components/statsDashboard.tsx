"use client";

import { useYid } from "@/hooks/use-yid";
import { getYearDashboard } from "@/lib/api";
import { toFixedNumber } from "@/lib/utils";
import { CloseOutlined, DashboardOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Drawer,
  Flex,
  Progress,
  Skeleton,
  Statistic,
} from "antd";
import { parseAsBoolean, useQueryState } from "nuqs";

export const StudentsStatsDashboard = () => {
  const { yid } = useYid();
  const [open, setOpen] = useQueryState(
    "view-stats",
    parseAsBoolean.withDefault(false)
  );
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard", `${yid}`],
    queryFn: ({ queryKey }) => getYearDashboard(Number(queryKey[1])),
    enabled: !!yid,
  });

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        // type="text"
        icon={<DashboardOutlined />}
        onClick={() => setOpen(true)}
        title={`Statistiques étudiants ${data?.year.name}`}
        style={{boxShadow:"none"}}
      />
      <Drawer
        title={`Statistiques ${data?.year.name}`}
        open={open}
        onClose={onClose}
        destroyOnHidden
        closable={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        }
      >
        <Flex vertical gap={16}>
          <Card variant="borderless">
            <Flex justify="space-between" align="center">
              <Statistic
                loading={isPending}
                title="Total"
                value={data?.student_counter}
                valueStyle={{ color: "#1677ff", fontWeight: 600 }}
              />
              {!isPending ? (
                <Progress
                  type="dashboard"
                  percent={100}
                  size={58}
                  strokeColor="#1677ff"
                />
              ) : (
                <Skeleton.Avatar size={58} active />
              )}
            </Flex>
          </Card>
          <Card variant="borderless">
            <Flex justify="space-between" align="center">
              <Statistic
                loading={isPending}
                title="Hommes"
                value={data?.male_count}
                valueStyle={{ color: "#52c41a", fontWeight: 600 }}
              />
              {!isPending ? (
                <Progress
                  type="dashboard"
                  percent={toFixedNumber(
                    (data?.male_count! / data?.student_counter!) * 100
                  )}
                  size={58}
                  strokeColor={"#52c41a"}
                />
              ) : (
                <Skeleton.Avatar size={58} active />
              )}
            </Flex>
          </Card>
          <Card variant="borderless">
            <Flex justify="space-between" align="center">
              <Statistic
                loading={isPending}
                title="Femmes"
                value={data?.female_count}
                valueStyle={{ color: "#eb2f96", fontWeight: 600 }}
              />
              {!isPending ? (
                <Progress
                  type="dashboard"
                  percent={toFixedNumber(
                    (data?.female_count! / data?.student_counter!) * 100
                  )}
                  size={58}
                  strokeColor="#eb2f96"
                />
              ) : (
                <Skeleton.Avatar size={58} active />
              )}
            </Flex>
          </Card>
          <Card variant="borderless">
            <Flex justify="space-between" align="center">
              <Statistic
                loading={isPending}
                title="Actifs"
                value={data?.actif_count}
                valueStyle={{ color: "#faad14", fontWeight: 600 }}
              />
            </Flex>
          </Card>
          <Card variant="borderless">
            <Flex justify="space-between" align="center">
              <Statistic
                loading={isPending}
                title="Abandons"
                value={data?.inactif_count}
                valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
              />
            </Flex>
          </Card>
        </Flex>
      </Drawer>
    </>
  );
};
