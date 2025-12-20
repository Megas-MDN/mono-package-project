import { createBrowserRouter, Outlet } from "react-router-dom";
import { mainRoutes, routeWihtoutLayout } from "./_routes";

export const appRoutes = createBrowserRouter(
  [
    {
      element: <Outlet />,
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
