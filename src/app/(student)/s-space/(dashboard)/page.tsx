'use client'

import { Alert, Card, Layout } from "antd"

export default function Page(){

    return (
      <Layout>
        <Layout.Content
          style={{
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            padding: 24
          }}
        >
          <Card>
            <Alert
              showIcon
              type="info"
              message="Information"
              description="Cette partie est en cours de migration depuis l'ancienne version séparée et sera bientôt disponible."
            />
          </Card>
        </Layout.Content>
      </Layout>
    );
}