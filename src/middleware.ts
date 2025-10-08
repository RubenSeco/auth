import { defineMiddleware } from "astro:middleware";
import { firebase } from '~/firebase/config';


const privateRoutes = ["/protected"];
const notAuthenticatedRoutes = ["/login", "/register"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(({ url, request, locals, redirect }, next) => {

  const isLoggedIn = !!firebase.auth.currentUser;
  const user = firebase.auth.currentUser;
  locals.isLoggedIn = isLoggedIn;

  if (user) {
    locals.user = {
      email: user.email || '',
      name: user.displayName || '',
      avatar: user.photoURL || '',
      emailVerified: user.emailVerified
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
