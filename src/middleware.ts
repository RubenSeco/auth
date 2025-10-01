import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";


const privateRoutes = ["/protected"];
// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(({ url, request }, next) => {

  const authHeaders = request.headers.get("authorization");

  if (privateRoutes.includes(url.pathname)) {

    return checkLocalAuth(authHeaders, next);

  }
  return next();
});

// You can also define multiple middleware functions

const chechLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (!authHeaders) {

    return new Response("Auth Necesaria", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic real = 'Secure Area'"
      }
    });
  }
};
