import { Button, Form, Input, Space } from "antd";
import { Options } from "nuqs";
import { FC } from "react";

type Props = {
    setStep: (
        value: number | ((old: number) => number | null) | null,
        options?: Options
    ) => Promise<URLSearchParams>;
};

export const Step4: FC<Props> = ({ setStep }) => {
    const onFinish = (values: any) => {
        setStep(4);
    };

    return (
        <Form style={{ width: 500 }} onFinish={onFinish}>
            <Form.Item
                label="Ville actuelle"
                name="current_city"
                rules={[{ required: true }]}
            >
                <Input placeholder="Ville actuelle" />
            </Form.Item>
            <Form.Item
                label="Municipalité actuelle"
                name="current_municipality"
                rules={[{ required: true }]}
            >
                <Input placeholder="Municipalité actuelle" />
            </Form.Item>
            <Form.Item
                label="Adresse actuel"
                name="current_neighborhood"
                rules={[{ required: true }]}
            >
                <Input placeholder="Quartier ou Avenue et No" />
            </Form.Item>

            <Form.Item
                style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20 }}
            >
                <Space>
                    <Button onClick={() => setStep(2)} style={{ boxShadow: "none" }}>
                        Précédent
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ boxShadow: "none" }}
                    >
                        Suivant
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
