"use client";

import { ReactNode } from "react";
import { AccessProvider } from "./AccessProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <AccessProvider>{children}</AccessProvider>;
}
