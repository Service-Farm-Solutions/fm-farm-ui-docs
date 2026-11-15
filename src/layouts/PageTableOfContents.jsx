import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

export default function PageTableOfContents({ articleRef }) {
  const location = useLocation();
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const article = articleRef.current;
    let targetId;
    try {
      targetId = decodeURIComponent(location.hash.slice(1));
    } catch (error) {
      if (!(error instanceof URIError)) throw error;
    }

    let scrolled = false;
    let frame;
    function updateHeadings() {
      const elements = Array.from(article.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"));
      const entries = elements.map(element => {
        const clone = element.cloneNode(true);
        clone.querySelector(":scope > .heading-anchor")?.remove();
        const label = clone.textContent.trim() || element.getAttribute("data-toc-label") || "Section";
        const anchor = element.querySelector(":scope > .heading-anchor");
        if (anchor) anchor.setAttribute("aria-label", `Link to ${label}`);
        return { id: element.id, label, depth: Number(element.tagName.slice(1)) };
      });
      const next = entries.filter(entry => entry.depth === 2 || entry.depth === 3);
      setHeadings(current => (
        current.length === next.length && current.every((item, index) =>
          item.id === next[index].id && item.label === next[index].label && item.depth === next[index].depth)
          ? current : next
      ));

      const target = targetId && elements.find(element => element.id === targetId);
      if (target && !scrolled) {
        scrolled = true;
        frame = requestAnimationFrame(() => target.scrollIntoView());
      }
    }

    updateHeadings();
    const observer = new MutationObserver(updateHeadings);
    observer.observe(article, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [articleRef, location.pathname, location.hash]);

  if (!headings.length) return null;

  return (
    <nav aria-label="On this page" className="page-toc mb-10 rounded-xl border border-slate-200 p-5 xl:col-start-2 xl:row-start-1 xl:mb-0">
      <h2 className="text-sm font-semibold text-slate-900">On this page</h2>
      <ul className="mt-4 space-y-3">
        {headings.map(heading => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-3" : ""}>
            <Link
              to={{ pathname: location.pathname, search: location.search, hash: `#${encodeURIComponent(heading.id)}` }}
              className="block text-sm leading-5 text-slate-600 hover:text-emerald-700"
              onClick={event => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                const target = Array.from(articleRef.current.querySelectorAll("h2[id], h3[id]"))
                  .find(element => element.id === heading.id);
                target?.focus({ preventScroll: true });
                if (location.hash === `#${encodeURIComponent(heading.id)}`) {
                  target?.scrollIntoView();
                }
              }}
            >
              {heading.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

PageTableOfContents.propTypes = {
  articleRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
};
