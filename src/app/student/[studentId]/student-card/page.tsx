"use client";

import { Card, Typography, Row, Col, } from "antd";

export default function StudentCardPage() {
    return (
      <Row justify="center" style={{ marginTop: 40 }}>
        <Col>
          <Card
            style={{
              width: 350,
            }}
          >
            <Typography.Text type="secondary">Comming soon...</Typography.Text>
          </Card>
        </Col>
      </Row>
    );
}
