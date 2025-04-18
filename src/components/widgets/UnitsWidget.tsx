"use client";

import { Card, Table, Tag } from "antd";

const unitsData = [
  {
    key: "1",
    code: "INF101",
    title: "Algorithmes et Structures de données",
    credits: 4,
    teacher: "Prof. Jean Mukendi",
    courses: ["Introduction", "Listes chaînées", "TP n°1", "Examen final"],
  },
  {
    key: "2",
    code: "MTH203",
    title: "Mathématiques avancées",
    credits: 3,
    teacher: "Prof. Léa Matondo",
    courses: ["Algèbre linéaire", "Analyse", "Contrôle continu"],
  },
  {
    key: "3",
    code: "WEB205",
    title: "Développement Web",
    credits: 5,
    teacher: "Prof. Marie Kabeya",
    courses: ["HTML & CSS", "ReactJS", "Projet final"],
  },
];

const columns = [
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    render: (text: string) => (
      <Tag color="blue" className="font-semibold text-sm">{text}</Tag>
    ),
  },
  {
    title: "Intitulé",
    dataIndex: "title",
    key: "title",
    render: (text: string) => (
      <span className="text-gray-800 font-medium">{text}</span>
    ),
  },
  {
    title: "Crédits",
    dataIndex: "credits",
    key: "credits",
    render: (text: number) => (
      <span className="text-green-600 font-semibold">{text}</span>
    ),
  },
  {
    title: "Enseignant",
    dataIndex: "teacher",
    key: "teacher",
    render: (text: string) => (
      <span className="text-gray-600 italic">{text}</span>
    ),
  },
];

export function UnitsWidget() {
  return (
    <Card
      variant="borderless"
      className="bg-gradient-to-br from-white via-[#f0fdf4] to-[#ccfbf1] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Unités d’enseignement</h3>
      <div className="overflow-x-auto">
        <Table
          dataSource={unitsData}
          columns={columns}
          pagination={false}
          bordered
          expandable={{
            expandedRowRender: (record) => (
              <div className="pl-4 pt-2 pb-1">
                <h4 className="text-gray-700 font-semibold mb-2">Cours disponibles :</h4>
                <ul className="space-y-1 text-sm text-gray-700 list-none">
                  {record.courses.map((course, index) => (
                    <li key={index} className="pl-2 border-l-4 border-teal-300 text-[13px]">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ),
            rowExpandable: (record) => record.courses.length > 0,
          }}
          rowClassName="cursor-pointer hover:bg-[#f0fdf4]/60 transition-all"
          className="rounded-xl overflow-hidden"
        />
      </div>
    </Card>
  );
}