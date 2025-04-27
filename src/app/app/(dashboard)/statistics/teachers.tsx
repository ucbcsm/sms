import { Card, Col, Flex, Progress, Row, Statistic } from "antd";

export function TeachersStatistics(){
    return <Row gutter={24}>
    <Col span={6}>
      <Card>
        <Flex>
          <Statistic title="Année" value={"2024-2025"} />
          <Progress
            type="line"
            percent={20}
            style={{ position: "absolute", right: 16, width: 100 }}
          />
        </Flex>
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Flex justify="space-between">
          <Statistic title="Enseignants" value={50} />
          <Progress type="dashboard" percent={100} size={58} />
        </Flex>
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Flex justify="space-between">
          <Statistic title="Hommes" value={25} />
          <Progress type="dashboard" percent={50} size={58} />
        </Flex>
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Flex justify="space-between">
          <Statistic title="Femmes" value={25} />
          <Progress
            type="dashboard"
            percent={50}
            size={58}
            strokeColor="cyan"
          />
        </Flex>
      </Card>
    </Col>
  </Row>
}