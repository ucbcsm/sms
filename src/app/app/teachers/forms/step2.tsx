import { Button, Form, Input, Select, Space } from "antd";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";
import { z } from "zod";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

const formSchema = z.object({
  field_of_study: z.string().nonempty("Le domaine d'étude est requis"),
  education_level: z.enum(["bachelor", "master", "phd"], {
    required_error: "Le niveau d'éducation est requis",
  }),
  academic_title: z.string().nonempty("Le titre académique est requis"),
  academic_grade: z.string().nonempty("Le grade académique est requis"),
  assigned_faculties: z
    .array(z.enum(["science", "arts", "engineering"]))
    .nonempty("Au moins une faculté assignée est requise"),
  assigned_departements: z
    .array(z.enum(["math", "physics", "chemistry"]))
    .nonempty("Au moins un département assigné est requis"),
  other_responsabilities: z.string().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export const Step2: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<FormSchemaType>();

  useEffect(() => {
    const savedData = localStorage.getItem("dt2");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({
        ...data,
      });
    }
  }, []);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("dt2", compressedData);
        setStep(2);
      }}
      style={{ maxWidth: 520, margin: "auto" }}
    >
    <Form.Item
      label="Domaine d'étude"
      name="field_of_study"
      rules={[{ required: true }]}
    >
      <Select
        placeholder="Domaine d'étude"
        options={[
        { value: "humanities", label: "Sciences humaines" },
        { value: "literature_and_languages", label: "Lettres et langues" },
        { value: "social_sciences", label: "Sciences sociales" },
        { value: "law", label: "Droit" },
        { value: "economics_and_management", label: "Économie et gestion" },
        { value: "natural_sciences", label: "Sciences exactes" },
        { value: "mathematics", label: "Mathématiques" },
        { value: "computer_science", label: "Informatique" },
        { value: "engineering", label: "Sciences de l’ingénieur" },
        { value: "health", label: "Santé" },
        { value: "medicine", label: "Médecine" },
        { value: "education", label: "Éducation" },
        { value: "arts", label: "Arts" },
        { value: "architecture", label: "Architecture" },
        { value: "environmental_sciences", label: "Sciences de l’environnement" },
        { value: "agricultural_sciences", label: "Agronomie" },
        ]}
      />
    </Form.Item>
      {/* <Form.Item
        label="Niveau d'éducation"
        name="education_level"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Niveau d'éducation"
          options={[
            { value: "bachelor", label: "Licence" },
            { value: "master", label: "Master" },
            { value: "phd", label: "Doctorat" },
          ]}
        />
      </Form.Item> */}
      <Form.Item
        label="Titre académique"
        name="academic_title"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Titre académique"
          options={[
            { value: "bachelor", label: "Licence / Bachelor" },
            {
              value: "professional_bachelor",
              label: "Licence Professionnelle",
            },
            { value: "master", label: "Master" },
            { value: "research_master", label: "Master Recherche" },
            { value: "professional_master", label: "Master Professionnel" },
            { value: "engineer_degree", label: "Ingénieur diplômé" },
            { value: "specialized_master", label: "Mastère Spécialisé (MS)" },
            { value: "mba", label: "MBA (Master of Business Administration)" },
            { value: "phd", label: "Doctorat / PhD" },
            {
              value: "professional_doctorate",
              label: "Doctorat Professionnel",
            },
            {
              value: "hdr",
              label: "Habilitation à diriger des recherches (HDR)",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Grade académique"
        name="academic_grade"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Grade académique"
          options={[
            {
              value: "teaching_assistant",
              label: "Assistant d’enseignement / Moniteur",
            },
            { value: "research_assistant", label: "Assistant de recherche" },
            {
              value: "lecturer",
              label: "Chargé de cours / Chargé d’enseignement",
            },
            {
              value: "associate_lecturer",
              label: "Attaché temporaire d’enseignement et de recherche (ATER)",
            },
            { value: "associate_professor", label: "Maître de conférences" },
            { value: "full_professor", label: "Professeur des universités" },
            { value: "emeritus_professor", label: "Professeur émérite" },
            {
              value: "researcher",
              label: "Chargé de recherche (CNRS, INRAE, etc.)",
            },
            { value: "senior_researcher", label: "Directeur de recherche" },
            { value: "doctoral_candidate", label: "Doctorant / Doctorante" },
            {
              value: "postdoctoral_fellow",
              label: "Postdoctorant / Postdoctorante",
            },
            { value: "adjunct_professor", label: "Professeur associé" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Facultés assignées"
        name="assigned_faculties"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder="Facultés assignées"
          options={[
            { value: "science", label: "Sciences" },
            { value: "arts", label: "Arts" },
            { value: "engineering", label: "Ingénierie" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Départements assignés"
        name="assigned_departements"
        rules={[{ required: true }]}
      >
        <Select
          mode="multiple"
          placeholder="Départements assignés"
          options={[
            { value: "math", label: "Mathématiques" },
            { value: "physics", label: "Physique" },
            { value: "chemistry", label: "Chimie" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Autres responsabilités/Charge administrative"
        name="other_responsabilities"
        rules={[{ required: false }]}
      >
        <Input.TextArea placeholder="Autres responsabilités/Charge administrative" />
      </Form.Item>
      <Form.Item
        style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20 }}
      >
        <Space>
          <Button onClick={() => setStep(0)} style={{ boxShadow: "none" }}>
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
