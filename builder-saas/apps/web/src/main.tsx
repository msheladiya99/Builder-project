import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { MultiTenantRouter } from "./app/MultiTenantRouter.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MultiTenantRouter />
  </BrowserRouter>
);