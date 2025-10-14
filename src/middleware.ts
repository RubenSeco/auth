import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";
import { LocalsNotAnObject } from "node_modules/astro/dist/core/errors/errors-data";


const privateRoutes = ["/protected"];
const notAuthenticatedRoutes = ["/login", "/register"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async ({ url, request, locals, redirect }, next) => {

  const session = await getSession(request);

  const isLoggedIn = !!session;
  const user = session?.user;


  locals.isLoggedIn = isLoggedIn;
  locals.user = null;
  locals.isAdmin = false;

  if (user) {
    locals.user = {
      email: user.email!,
      name: user.name!,
    };
    locals.isAdmin = user.role === "admin";
  }

  if (!locals.isAdmin && url.pathname.startsWith("/dashboard")) {
    return redirect("/");
  }
  if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
    return redirect("/");
  }

  return next();
});

// You can also define multiple middleware functions
