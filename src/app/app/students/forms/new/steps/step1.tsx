"use client";
import { Step1ApplicationFormDataType } from "@/lib/types";
import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import dayjs from "dayjs";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { Options } from "nuqs";
import { FC, useEffect } from "react";

type Props = {
  setStep: (
    value: number | ((old: number) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const Step1: FC<Props> = ({ setStep }) => {
  const [form] = Form.useForm<Step1ApplicationFormDataType>();

  useEffect(() => {
    const savedData = localStorage.getItem("d1");
    if (typeof savedData === "string") {
      const raw = decompressFromEncodedURIComponent(savedData);
      const data = JSON.parse(raw);
      form.setFieldsValue({
        ...data,
        date_of_birth: dayjs(data.date_of_birth, "YYYY-MM-DD"),
      });
    }
  }, []);

  return (
    <Form
      form={form}
      name="step1"
      style={{ maxWidth: 500 }}
      onFinish={(values) => {
        const compressedData = compressToEncodedURIComponent(
          JSON.stringify(values)
        );
        localStorage.setItem("d1", compressedData);
        setStep(1);
      }}
    >
      <Form.Item label="Nom" name="first_name" rules={[{ required: true }]}>
        <Input placeholder="Nom" />
      </Form.Item>
      <Form.Item label="Postnom" name="last_name" rules={[{ required: true }]}>
        <Input placeholder="Postnom" />
      </Form.Item>
      <Form.Item label="Prénom" name="surname" rules={[{ required: true }]}>
        <Input placeholder="Prénom" />
      </Form.Item>
      <Form.Item label="Sexe" name="gender" rules={[{ required: true }]}>
        <Radio.Group
          options={[
            { value: "M", label: "Homme" },
            { value: "F", label: "Femme" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Lieu de naissance"
        name="place_of_birth"
        rules={[{ required: true }]}
      >
        <Input placeholder="Lieu de naissance" />
      </Form.Item>
      <Form.Item
        label="Date de naissance"
        name="date_of_birth"
        rules={[{ required: true }]}
      >
        <DatePicker
          placeholder="DD/MM/YYYY"
          format={{ format: "DD/MM/YYYY" }}
          picker="date"
        />
      </Form.Item>
      <Form.Item
        label="Nationalité"
        name="nationality"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Nationalité"
          options={[
            { value: "afghanistan", label: "Afghanistan" },
            { value: "afrique_du_sud", label: "Afrique du Sud" },
            { value: "albanie", label: "Albanie" },
            { value: "algerie", label: "Algérie" },
            { value: "allemagne", label: "Allemagne" },
            { value: "andorre", label: "Andorre" },
            { value: "angola", label: "Angola" },
            { value: "antigua_et_barbuda", label: "Antigua-et-Barbuda" },
            { value: "arabie_saoudite", label: "Arabie Saoudite" },
            { value: "argentine", label: "Argentine" },
            { value: "armenie", label: "Arménie" },
            { value: "australie", label: "Australie" },
            { value: "autriche", label: "Autriche" },
            { value: "azerbaidjan", label: "Azerbaïdjan" },
            { value: "bahamas", label: "Bahamas" },
            { value: "bahrein", label: "Bahreïn" },
            { value: "bangladesh", label: "Bangladesh" },
            { value: "barbade", label: "Barbade" },
            { value: "belgique", label: "Belgique" },
            { value: "belize", label: "Belize" },
            { value: "benin", label: "Bénin" },
            { value: "bhoutan", label: "Bhoutan" },
            { value: "bielorussie", label: "Biélorussie" },
            { value: "birmanie", label: "Birmanie" },
            { value: "bolivie", label: "Bolivie" },
            { value: "bosnie_herzegovine", label: "Bosnie-Herzégovine" },
            { value: "botswana", label: "Botswana" },
            { value: "bresil", label: "Brésil" },
            { value: "brunei", label: "Brunei" },
            { value: "bulgarie", label: "Bulgarie" },
            { value: "burkina_faso", label: "Burkina Faso" },
            { value: "burundi", label: "Burundi" },
            { value: "cambodge", label: "Cambodge" },
            { value: "cameroun", label: "Cameroun" },
            { value: "canada", label: "Canada" },
            { value: "cap_vert", label: "Cap-Vert" },
            { value: "chili", label: "Chili" },
            { value: "chine", label: "Chine" },
            { value: "chypre", label: "Chypre" },
            { value: "colombie", label: "Colombie" },
            { value: "comores", label: "Comores" },
            { value: "congo_brazzaville", label: "Congo-Brazzaville" },
            { value: "congo_kinshasa", label: "Congo-Kinshasa" },
            { value: "coree_du_nord", label: "Corée du Nord" },
            { value: "coree_du_sud", label: "Corée du Sud" },
            { value: "costa_rica", label: "Costa Rica" },
            { value: "cote_d_ivoire", label: "Côte d'Ivoire" },
            { value: "croatie", label: "Croatie" },
            { value: "cuba", label: "Cuba" },
            { value: "danemark", label: "Danemark" },
            { value: "djibouti", label: "Djibouti" },
            { value: "dominique", label: "Dominique" },
            { value: "egypte", label: "Égypte" },
            { value: "emirats_arabes_unis", label: "Émirats Arabes Unis" },
            { value: "equateur", label: "Équateur" },
            { value: "erythree", label: "Érythrée" },
            { value: "espagne", label: "Espagne" },
            { value: "estonie", label: "Estonie" },
            { value: "eswatini", label: "Eswatini" },
            { value: "etats_unis", label: "États-Unis" },
            { value: "ethiopie", label: "Éthiopie" },
            { value: "fidji", label: "Fidji" },
            { value: "finlande", label: "Finlande" },
            { value: "france", label: "France" },
            { value: "gabon", label: "Gabon" },
            { value: "gambie", label: "Gambie" },
            { value: "georgie", label: "Géorgie" },
            { value: "ghana", label: "Ghana" },
            { value: "grece", label: "Grèce" },
            { value: "grenade", label: "Grenade" },
            { value: "guatemala", label: "Guatemala" },
            { value: "guinee", label: "Guinée" },
            { value: "guinee_bissau", label: "Guinée-Bissau" },
            { value: "guinee_equatoriale", label: "Guinée équatoriale" },
            { value: "guyana", label: "Guyana" },
            { value: "haiti", label: "Haïti" },
            { value: "honduras", label: "Honduras" },
            { value: "hongrie", label: "Hongrie" },
            { value: "inde", label: "Inde" },
            { value: "indonesie", label: "Indonésie" },
            { value: "irak", label: "Irak" },
            { value: "iran", label: "Iran" },
            { value: "irlande", label: "Irlande" },
            { value: "islande", label: "Islande" },
            { value: "israel", label: "Israël" },
            { value: "italie", label: "Italie" },
            { value: "jamaique", label: "Jamaïque" },
            { value: "japon", label: "Japon" },
            { value: "jordanie", label: "Jordanie" },
            { value: "kazakhstan", label: "Kazakhstan" },
            { value: "kenya", label: "Kenya" },
            { value: "kirghizistan", label: "Kirghizistan" },
            { value: "kiribati", label: "Kiribati" },
            { value: "kosovo", label: "Kosovo" },
            { value: "koweit", label: "Koweït" },
            { value: "laos", label: "Laos" },
            { value: "lesotho", label: "Lesotho" },
            { value: "lettonie", label: "Lettonie" },
            { value: "liban", label: "Liban" },
            { value: "liberia", label: "Libéria" },
            { value: "libye", label: "Libye" },
            { value: "liechtenstein", label: "Liechtenstein" },
            { value: "lituanie", label: "Lituanie" },
            { value: "luxembourg", label: "Luxembourg" },
            { value: "macedoine", label: "Macédoine" },
            { value: "madagascar", label: "Madagascar" },
            { value: "malaisie", label: "Malaisie" },
            { value: "malawi", label: "Malawi" },
            { value: "maldives", label: "Maldives" },
            { value: "mali", label: "Mali" },
            { value: "malte", label: "Malte" },
            { value: "maroc", label: "Maroc" },
            { value: "marshall", label: "Marshall" },
            { value: "maurice", label: "Maurice" },
            { value: "mauritanie", label: "Mauritanie" },
            { value: "mexique", label: "Mexique" },
            { value: "micronesie", label: "Micronésie" },
            { value: "moldavie", label: "Moldavie" },
            { value: "monaco", label: "Monaco" },
            { value: "mongolie", label: "Mongolie" },
            { value: "montenegro", label: "Monténégro" },
            { value: "mozambique", label: "Mozambique" },
            { value: "namibie", label: "Namibie" },
            { value: "nauru", label: "Nauru" },
            { value: "nepal", label: "Népal" },
            { value: "nicaragua", label: "Nicaragua" },
            { value: "niger", label: "Niger" },
            { value: "nigeria", label: "Nigéria" },
            { value: "norvege", label: "Norvège" },
            { value: "nouvelle_zelande", label: "Nouvelle-Zélande" },
            { value: "oman", label: "Oman" },
            { value: "ouganda", label: "Ouganda" },
            { value: "ouzbekistan", label: "Ouzbékistan" },
            { value: "pakistan", label: "Pakistan" },
            { value: "palaos", label: "Palaos" },
            { value: "panama", label: "Panama" },
            {
              value: "papouasie_nouvelle_guinee",
              label: "Papouasie-Nouvelle-Guinée",
            },
            { value: "paraguay", label: "Paraguay" },
            { value: "pays_bas", label: "Pays-Bas" },
            { value: "perou", label: "Pérou" },
            { value: "philippines", label: "Philippines" },
            { value: "pologne", label: "Pologne" },
            { value: "portugal", label: "Portugal" },
            { value: "qatar", label: "Qatar" },
            {
              value: "republique_centrafricaine",
              label: "République Centrafricaine",
            },
            {
              value: "republique_dominicaine",
              label: "République Dominicaine",
            },
            { value: "republique_tcheque", label: "République Tchèque" },
            { value: "roumanie", label: "Roumanie" },
            { value: "royaume_uni", label: "Royaume-Uni" },
            { value: "russie", label: "Russie" },
            { value: "rwanda", label: "Rwanda" },
            { value: "saint_kitts_et_nevis", label: "Saint-Kitts-et-Nevis" },
            { value: "saint_marin", label: "Saint-Marin" },
            {
              value: "saint_vincent_et_les_grenadines",
              label: "Saint-Vincent-et-les-Grenadines",
            },
            { value: "sainte_lucie", label: "Sainte-Lucie" },
            { value: "salomon", label: "Salomon" },
            { value: "salvador", label: "Salvador" },
            { value: "samoa", label: "Samoa" },
            { value: "sao_tome_et_principe", label: "Sao Tomé-et-Principe" },
            { value: "senegal", label: "Sénégal" },
            { value: "serbie", label: "Serbie" },
            { value: "seychelles", label: "Seychelles" },
            { value: "sierra_leone", label: "Sierra Leone" },
            { value: "singapour", label: "Singapour" },
            { value: "slovaquie", label: "Slovaquie" },
            { value: "slovenie", label: "Slovénie" },
            { value: "somalie", label: "Somalie" },
            { value: "soudan", label: "Soudan" },
            { value: "soudan_du_sud", label: "Soudan du Sud" },
            { value: "sri_lanka", label: "Sri Lanka" },
            { value: "suede", label: "Suède" },
            { value: "suisse", label: "Suisse" },
            { value: "suriname", label: "Suriname" },
            { value: "syrie", label: "Syrie" },
            { value: "tadjikistan", label: "Tadjikistan" },
            { value: "tanzanie", label: "Tanzanie" },
            { value: "tchad", label: "Tchad" },
            { value: "thailande", label: "Thaïlande" },
            { value: "timor_oriental", label: "Timor oriental" },
            { value: "togo", label: "Togo" },
            { value: "tonga", label: "Tonga" },
            { value: "trinite_et_tobago", label: "Trinité-et-Tobago" },
            { value: "tunisie", label: "Tunisie" },
            { value: "turkmenistan", label: "Turkménistan" },
            { value: "turquie", label: "Turquie" },
            { value: "tuvalu", label: "Tuvalu" },
            { value: "ukraine", label: "Ukraine" },
            { value: "uruguay", label: "Uruguay" },
            { value: "vanuatu", label: "Vanuatu" },
            { value: "venezuela", label: "Venezuela" },
            { value: "vietnam", label: "Vietnam" },
            { value: "yemen", label: "Yémen" },
            { value: "zambie", label: "Zambie" },
            { value: "zimbabwe", label: "Zimbabwe" },
          ]}
          showSearch
        />
      </Form.Item>
      <Form.Item
        label="État civil"
        name="marital_status"
        rules={[{ required: true }]}
      >
        <Radio.Group
          options={[
            { value: "single", label: "Célibataire" },
            { value: "married", label: "Marié(e)" },
            { value: "divorced", label: "Divorcé(e)" },
            { value: "widowed", label: "Veuf(ve)" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Affiliation religieuse"
        name="religious_affiliation"
        rules={[{ required: true }]}
      >
        <Input placeholder="Affiliation religieuse" />
      </Form.Item>
      <Form.Item
        label="Aptitude physique"
        name="physical_ability"
        rules={[{ required: true, message: "Ce champ est requis" }]}
      >
        <Radio.Group
          options={[
            { value: "normal", label: "Normale" },
            { value: "disabled", label: "Handicapé" },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Langues parlées"
        name="spoken_language"
        rules={[{ required: true }]}
      >
        <Input placeholder="Langues parlées" />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        label="Téléphone 1"
        name="phone_number_1"
        rules={[{ required: true }]}
      >
        <Input placeholder="Téléphone 1" />
      </Form.Item>
      <Form.Item
        label="Téléphone 2"
        name="phone_number_2"
        rules={[{ required: false }]}
      >
        <Input placeholder="Numéro de téléphone 2" />
      </Form.Item>
      <Form.Item
        style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20 }}
      >
        <Button type="primary" htmlType="submit" style={{ boxShadow: "none" }}>
          Suivant
        </Button>
      </Form.Item>
    </Form>
  );
};
