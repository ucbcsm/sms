'use client'

import { InputNumber } from "antd";
import { FC } from "react";

type InputResultTestProps = {
  value?: number | null;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
  max:number,
};
export const InputResultTest: FC<InputResultTestProps> = ({
  value,
  onChange,
  disabled,
  max
}) => {
  return (
    <InputNumber
      min={0}
      max={max}
      step={0.01}
      value={value}
      disabled={disabled}
      onChange={onChange}
      variant="filled"
      style={{ width: "100%", textAlign: "right" }}
      precision={2}
      suffix={`/${max}`}
    />
  );
};
