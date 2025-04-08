import { Select } from "antd";

export function YearSelector() {
  return (
    <Select
      defaultValue="2023-2024"
      variant="filled"
      options={[
        { value: "2023-2024", label: "2023-2024" },
        { value: "2024-2025", label: "2024-2025" },
      ]}
      style={{}}
    />
  );
}
