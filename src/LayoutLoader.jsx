import React from "react";
import { lazy, Suspense } from 'react';

export function lazyLoadComponents(componentName) {
  const LazyElement = lazy(() => import(`./layouts/${componentName}.jsx`));

  return (
    <Suspense fallback="Loading...">
      <LazyElement />
    </Suspense>
  );
}

export function lazyLoadComponentMdx(mdxPath) {
  const LazyElement = lazy(() => import(`./Pages/Components/${mdxPath}.mdx`));

  return (
    <Suspense fallback="Loading...">
      <LazyElement />
    </Suspense>
  );
}

export function lazyLoadModulesMdx(mdxPath) {
  const LazyElement = lazy(() => import(`./Pages/Modules/${mdxPath}.mdx`));

  return (
    <Suspense fallback="Loading...">
      <LazyElement />
    </Suspense>
  );
}