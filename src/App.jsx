import React from "react";
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import ErrorPage from './Pages/ErrorPage'
import Root from './Pages/Root'
// import { NextUIProvider } from "@nextui-org/react";
import routes from './routes';
import {  lazyLoadComponents, lazyLoadComponentMdx, lazyLoadModulesMdx } from './LayoutLoader'
import {HeroUIProvider} from "@heroui/system";

function App() {

  const allRoutes = [
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/redirect",
      element: <Root />
    },
    {
      path: "/logout",
      loader: () => redirect("/")
    },
    ...(routes.pages.map(page => ({
      path: page.path,
      element: lazyLoadComponents(page.layout),
      errorElement: <ErrorPage />,
      children: page.children.map(child => ({
        path: child.path,
        ...(child.index ?
          {
            index: true,
            loader: child.loader
          } : page.name === "Components" ? {
            element:  lazyLoadComponentMdx(child.mdx),
          }: page.name === "Modules" ? {
            element: lazyLoadModulesMdx(child.mdx)
          }: {}),
          errorElement: <ErrorPage />
      }))
    }))),
  ];
  const router = createBrowserRouter(allRoutes, {
    basename: import.meta.env.BASE_URL
  })
  return (
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  )
}

export default App
