'use client';
import { FC } from "react";
import { Drawer } from "antd";
import { Options } from "nuqs";

type Props = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ReapplyForm: FC<Props> = ({ open, setOpen }) => {
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer width={`100%`} title="Réinscription" onClose={onClose} open={open}>

    </Drawer>
  );
};
