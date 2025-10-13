import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";


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
      name: user.name!,
      email: user.email!,



    };
    
  }

  if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
    return redirect("/");
  }
  if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
    return redirect("/");
  }

  return next();
});

// You can also define multiple middleware functions
