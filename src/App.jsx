import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HeroUIProvider } from "@heroui/system";
import ErrorPage from "./Pages/ErrorPage";
import Root from "./Pages/Root";
import releases from "./routes";
import { loadDocument } from "./LayoutLoader";
import { createDocumentationRoutes } from "./docs/routing";

const ContainerLayout = lazy(() => import("./layouts/ContainerLayout"));

const router = createBrowserRouter([
  { path: "/", element: <Root />, errorElement: <ErrorPage /> },
  { path: "/redirect", element: <Root /> },
  { path: "/logout", loader: () => redirect("/") },
  ...createDocumentationRoutes(releases, <Suspense fallback="Loading..."><ContainerLayout /></Suspense>,
    loadDocument, <ErrorPage />),
  { path: "*", loader: () => { throw new Response("Page not found", { status: 404 }); }, errorElement: <ErrorPage /> },
], {
  basename: import.meta.env.BASE_URL,
});

export default function App() {
  return (
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  );
}
