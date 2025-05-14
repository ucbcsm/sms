import { getHSLColor } from "@/lib/utils";
import { getDepartments } from "@/utils";
import { MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Dropdown, Row, Statistic } from "antd";
import Link from "next/link";

export function DepartmentsStatistics() {
  const {data, isPending}=useQuery({
    queryKey:["departments"],
    queryFn:getDepartments
  })
  if(isPending){
    return
  }
  return (
    <Row gutter={[16, 16]}>
      {data?.map((department) => (
        <Col key={department.id} span={8}>
          <Card
            title={
              <Link href={`/app/department/${department.id}`} style={{color:"#fff"}}>{department.name}</Link>
            }
            extra={
              <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Action 1" },
                    { key: "2", label: "Action 2" },
                  ],
                }}
              >
                <Button type="text" icon={<MoreOutlined />} style={{color:"#fff"}} />
              </Dropdown>
            }
            type="inner"
            styles={{header:{background:getHSLColor(department.name)}}}
          >
            <Row gutter={[16, 16]}>
              {/* <Col span={8}>
                <Statistic value={2} title="Départements" />
              </Col> */}
              <Col span={8}>
                <Statistic value={50} title="Cours" />
              </Col>
              <Col span={8}>
                <Statistic value={6} title="Semestres" />
              </Col>
              <Col span={8}>
                <Statistic value={103} title="Etudiants" />
              </Col>

              <Col span={8}>
                <Statistic value={9} title="Promotions" />
              </Col>
              <Col span={8}>
                <Statistic value={5} title="Personnel" />
              </Col>
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
