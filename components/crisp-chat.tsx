"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("48750f03-61e3-42f0-b0db-b100d21cf9f7");
  }, []);

  return null;
};
