import Router from "next/router";
import Cookies from "js-cookie";

import { AuthUser } from "@/types/auth";

const useAuth = () => {
  const setToken = (data: AuthUser) => {
    // Next.jsがサーバーで実行されるウィンドウオブジェクトがページに含まれている場合 `window is not defined` ノエラーになってwindowにアクセスする事はできない
    // ウィンドウオブジェクトにアクセスする必要がある場合は「SSR」を無効にするために早期Returnの必要がある
    if (typeof window === "undefined") return;

    Cookies.set("id", data.user.id.toString());
    Cookies.set("username", data.user.username);
    Cookies.set("jwt", data.jwt);

    if (Cookies.get("username")) {
      console.log("reload!!! in useAuth.tsx");

      Router.reload();
    }
  };

  const unsetToken = () => {
    if (typeof window === "undefined") return;

    Cookies.remove("id");
    Cookies.remove("username");
    Cookies.remove("jwt");

    Router.reload();
  };

  const getIdFromLocalCookie = () => {
    return Cookies.get("id");
  };

  const getUserFromLocalCookie = () => {
    return Cookies.get("username");
  };

  const getTokenFromLocalCookie = () => {
    return Cookies.get("jwt");
  };

  const getIdFromServerCookie = (req: any) => {
    if (!req.headers.cookie || "") return undefined;

    const idCookie = req.headers.cookie
      .split(";")
      .find((c: string) => c.trim().startsWith("id="));

    if (!idCookie) return undefined;

    const id = idCookie.split("=")[1];
    return id;
  };

  const getTokenFromServerCookie = (req: any) => {
    if (!req.headers.cookie || "") return undefined;

    const jwtCookie = req.headers.cookie
      .split(";")
      .find((c: string) => c.trim().startsWith("jwt="));

    if (!jwtCookie) return undefined;

    const jwt = jwtCookie.split("=")[1];
    return jwt;
  };

  return {
    setToken,
    unsetToken,
    getIdFromLocalCookie,
    getUserFromLocalCookie,
    getTokenFromLocalCookie,
    getIdFromServerCookie,
    getTokenFromServerCookie,
  };
};

export default useAuth;
