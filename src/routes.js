import { redirect } from "react-router-dom";

export default {
  pages: [
    {
      path: "/components",
      name: "Components",
      layout: "ContainerLayout",
      dir: "Components",
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
    },
    {
      path: "/modules",
      name: "Modules",
      layout: "ContainerLayout",
      dir: "Modules",
      children: [
        {
          index: true,
          loader: () => redirect("/modules/introduction"),
        },
        {
          path: "introduction",
          mdx: "Introduction",
          children: [
            { 
              path: "2.1.0",
              mdx: "JobReportV2.1.0"
            }
          ]
        },
        {
          path: "job-report",
          mdx: "JobReport",
        }
      ]      
    }
  ]
}
