import { lazy, Suspense } from 'react';

export function lazyLoadComponents(componentName) {
  const LazyElement = lazy(() => import(`./layouts/${componentName}.jsx`));

  return (
    <Suspense fallback="Loading...">
      <LazyElement />
    </Suspense>
  );
}

export function lazyLoadMdx(mdxPath) {
  const LazyElement = lazy(() => import(`./Pages/Components/${mdxPath}.mdx`));

  return (
    <Suspense fallback="Loading...">
      <LazyElement />
    </Suspense>
  );
}