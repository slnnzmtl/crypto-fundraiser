import React from "react";
import { ErrorProvider } from "./hooks/useError";
import { ModalProvider } from "./hooks/useModal";
import { useWalletEvents } from "./hooks/useWalletEvents";
import Modals from "./components/modals";
import "./styles/globals.css";
import Router from "./Router";

function App() {
  useWalletEvents();

  return (
    <ErrorProvider>
      <ModalProvider>
        <div className="min-h-screen text-white">
          <main className="container mx-auto px-4">
            <Router />
          </main>
          <Modals />
        </div>
      </ModalProvider>
    </ErrorProvider>
  );
}

export default App;
