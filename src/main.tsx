import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { Header } from "./components/parts/header.component";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header />
    <main className="flex h-full w-full max-w-full flex-grow items-center pt-4">
      <App />
    </main>
  </StrictMode>,
);
