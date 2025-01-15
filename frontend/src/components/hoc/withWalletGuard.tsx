import React from "react";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { walletStore } from "@/stores";

export const withWalletGuard = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return observer((props: P) => {
    if (!walletStore.address) {
      return <Navigate to="/" replace />;
    }

    return <Component {...props} />;
  });
};
