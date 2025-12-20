import { ToastContainer } from "react-toastify";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { appRoutes } from "./routes/_index";
import { Socket } from "./Socket";

createRoot(document.getElementById("root")!).render(
  <>
    <Socket />
    <ToastContainer theme="colored" />
    <RouterProvider router={appRoutes} />
  </>,
);
