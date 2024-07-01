import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import ErrorPage from './Pages/ErrorPage'
import Root from './Pages/Root'
import { NextUIProvider } from "@nextui-org/react";
import routes from './routes';
import { lazyLoadMdx, lazyLoadComponents } from './LayoutLoader'

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
          } : {
            element: lazyLoadMdx(child.mdx),
          }),
      }))
    }))),
  ];
  const router = createBrowserRouter(allRoutes, {
    basename: import.meta.env.BASE_URL
  })
  return (
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  )
}

export default App
