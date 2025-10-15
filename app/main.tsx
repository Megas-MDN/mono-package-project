import { ToastContainer } from "react-toastify";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <ToastContainer theme="colored" />
    <App />
  </>,
);
