const cachingMiddleware = async (
  { request }: { request: Request },
  next: () => Promise<Response>,
) => {
  // caches.default is only available on cloudflare workers
  // other platforms implementing the Web Cache API require using the `open` method
  // `const cache = await caches.open("default")`
  const cache = (caches as any).default as Cache;

  const cachedResponse = await cache.match(request);

  // return the cached response if there was one
  if (cachedResponse) return cachedResponse;
  else {
    // render a fresh response
    const response = await next();

    // add to cache
    await cache.put(request, response.clone());

    // return fresh response
    return response;
  }
};

export const onRequest =
  // avoid using caches when it is not available. for example, when testing locally with node
  typeof globalThis.CacheStorage === 'function' && globalThis.caches instanceof globalThis.CacheStorage
    ? cachingMiddleware
    : // a middleware that does nothing
      (_: any, next: any) => next();
