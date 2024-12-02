import { redirect } from "react-router";
import { logout } from "~/services/auth";

export function clientAction() {
  logout();
  return redirect("/login");
}
