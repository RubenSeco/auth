import { loginWhithGoogle } from "./auth/login-google.action";
import { loginUser } from "./auth/login.action";
import { logout } from "./auth/logout.action";
import { registerUser } from "./auth/register.action";
import { getProductsByPage } from "./products/get-products-by-page.action";

export const server = {

  registerUser,
  logout,
  loginUser,
  loginWhithGoogle,
  getProductsByPage
};

