"use client";

import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/lib/redux/store";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}