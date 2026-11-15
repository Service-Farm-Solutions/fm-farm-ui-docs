import GithubSlugger, { slug } from "github-slugger";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

export default function remarkHeadings() {
  return tree => {
    const slugger = new GithubSlugger();
    slugger.slug("main-content");
    slugger.slug("mobile-navigation-title");

    visit(tree, "heading", node => {
      const label = toString(node).trim();
      const id = slugger.slug(slug(label) ? label : "section");
      let dynamic = false;
      visit(node, child => {
        if (child.type === "mdxTextExpression" || child.type === "mdxJsxTextElement") dynamic = true;
      });
      node.data = node.data || {};
      node.data.hProperties = { ...node.data.hProperties, id, tabIndex: -1 };
      if (!dynamic) node.data.hProperties["data-toc-label"] = label || "Section";
      node.children.push({
        type: "link",
        url: `#${encodeURIComponent(id)}`,
        data: { hProperties: {
          className: ["heading-anchor"],
          ariaLabel: dynamic ? "Link to this heading" : `Link to ${label || "section"}`,
        } },
        children: [{ type: "text", value: "#" }],
      });
    });
  };
}
