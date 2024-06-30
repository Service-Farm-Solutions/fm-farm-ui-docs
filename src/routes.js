import { redirect } from "react-router-dom";

export default {
  pages: [
    {
      path: "/components",
      name: "Components",
      layout: "ContainerLayout",
      dir: "./Pages/Components",
      children: [
        {
          index: true,
          loader: () => redirect("/components/introduction"),
        },
        {
          path: "introduction",
          mdx: "Introduction",
        },
        {
          path: "table-view",
          mdx: "TableView",
        },
        {
          path: "filters-view",
          mdx: "FiltersView",
        },
      ]      
    }
  ]
}
