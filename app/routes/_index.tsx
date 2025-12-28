import { createBrowserRouter } from "react-router-dom";
import { mainRoutes, routeWihtoutLayout } from "./_routes";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const appRoutes = createBrowserRouter(
  [
    {
      element: <ProtectedRoute />,
      children: mainRoutes,
    },
    ...routeWihtoutLayout,
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
