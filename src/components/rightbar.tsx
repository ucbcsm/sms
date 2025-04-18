"use client";

import { Card, Input, Button, Modal, Form } from "antd";
import { useState } from "react";

const { Search } = Input;

export default function Rightbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const sections = [
    {
      title: "Annonces administratives",
      messages: [
        { subject: "Inscriptions Bloc semestre", content: "Ouvertes jusqu’au 20 avril", recipient: "Étudiants" },
        { subject: "Rapports de stage", content: "À remettre avant le 25 avril", recipient: "Étudiants" },
      ],
    },
    {
      title: "Messages récents",
      messages: [
        { subject: "Prof. Kalume", content: "Cours déplacé à 14h", recipient: "Prof. Kalume" },
        { subject: "Admin", content: "Nouveaux horaires disponibles", recipient: "Étudiants" },
      ],
    },
    {
      title: "Évènements à venir",
      messages: [
        { subject: "15 avril", content: "Séminaire sur l’IA", recipient: "Tous les étudiants" },
        { subject: "22 avril", content: "Activité culturelle", recipient: "Tous les étudiants" },
      ],
    },
    {
      title: "Rapports & Résultats",
      messages: [
        { subject: "Crédits", content: "60/60", recipient: "Vous" },
        { subject: "Semestre 1", content: "Réussi", recipient: "Vous" },
        { subject: "Semestre 2", content: "En attente", recipient: "Vous" },
        { subject: "Bloc", content: "Validé", recipient: "Vous" },
        { subject: "Résultat final", content: "Admis", recipient: "Vous" },
        { subject: "Mention", content: "Distinction", recipient: "Vous" },
      ],
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredSections = sections.map((section) => ({
    ...section,
    messages: section.messages.filter(
      (msg) =>
        msg.subject.toLowerCase().includes(searchTerm) ||
        msg.content.toLowerCase().includes(searchTerm) ||
        msg.recipient.toLowerCase().includes(searchTerm)
    ),
  }));

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log("Message envoyé:", values);
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  return (
    <section className="w-full px-4 py-6 bg-white rounded-lg shadow-lg">
      {/* Barre de recherche & bouton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <Search
          placeholder="Rechercher un message..."
          onChange={handleSearch}
          className="w-full sm:w-2/3"
          allowClear
        />
        <Button type="primary" onClick={showModal}>
          Nouveau message
        </Button>
      </div>

      {/* Affichage des sections */}
      <div className="overflow-y-auto max-h-[450px]">
        {filteredSections.map((section, index) => (
          <Card
            key={index}
            bordered={false}
            bodyStyle={{ padding: "16px 20px" }}
            className="shadow-none bg-white text-gray-800 mb-4"
          >
            <h4 className="text-base font-semibold mb-3">{section.title}</h4>
            <div className="space-y-2 text-sm">
              {section.messages.length === 0 ? (
                <p className="text-gray-400">Aucun message trouvé.</p>
              ) : (
                section.messages.map((msg, idx) => (
                  <div key={idx} className="p-1 hover:bg-gray-50 transition duration-200">
                    <p className="font-medium">{msg.subject}</p>
                    <p className="text-gray-600 text-[13px]">{msg.content}</p>
                    <p className="text-gray-400 text-[12px]">Destinataire: {msg.recipient}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de rédaction */}
      <Modal
        title="Nouveau message"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Envoyer"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Destinataire"
            name="recipient"
            rules={[{ required: true, message: "Veuillez saisir le destinataire" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Objet"
            name="subject"
            rules={[{ required: true, message: "Veuillez saisir l'objet" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contenu"
            name="content"
            rules={[{ required: true, message: "Veuillez écrire le message" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}