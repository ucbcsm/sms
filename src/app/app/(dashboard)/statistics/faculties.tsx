import { getHSLColor } from "@/lib/utils";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Card, Col, Dropdown, Row, Statistic } from "antd";
import Link from "next/link";

export function FacultiesStatistics(){
    return <Row gutter={[16, 16]}>
    {[1, 2, 3, 4].map((index) => (
      <Col key={index} span={8}>
        <Card
          title={
            <Link href={`/app/faculty/${index}`} style={{color:"#fff"}}>Faculté {index}</Link>
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
          styles={{header:{background:getHSLColor(`Faculté ${index+60}`)}}}
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic
                value={2}
                title="Départements"
              />
            </Col>
            <Col span={8}>
              <Statistic
                value={50}
                title="Cours"
              />
            </Col>
            <Col span={8}>
              <Statistic
                value={6}
                title="Semestres"
              />
            </Col>
            <Col span={8}>
              <Statistic
                value={103}
                title="Etudiants"
              />
            </Col>

            <Col span={8}>
              <Statistic
                value={9}
                title="Promotions"
              />
            </Col>
            <Col span={8}>
              <Statistic
                value={5}
                title="Personnel"
              />
            </Col>
            {/* <Col span={12}>
              <Statistic
                value={30}
                title="Enseignants"
                prefix={<UsergroupAddOutlined />}
                // valueStyle={{ color: '#3f8600' }}
              />
            </Col> */}
          </Row>
        </Card>
      </Col>
    ))}
  </Row>
}