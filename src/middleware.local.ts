// No funciona por el nombre del archivo
//  Es una demostración. No es la forma correcta de establecer autenticación

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

const checkLocalAuth = (authHeaders: string | null, next: MiddlewareNext) => {
  if (authHeaders) {

    const authValue = authHeaders.split(" ").at(-1) ?? "user:pass";
    const decodedValue = atob(authValue).split(":");

    const [user, password] = decodedValue;

    if (user === "admin" && password === "admin") {
      return next();
    }


  }

  return new Response("Auth Necesaria", {
    status: 401,
    headers: {
      "WWW-Authenticate": "Basic real = 'Secure Area'"
    }
  });
};
