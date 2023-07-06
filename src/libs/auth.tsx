import { NextApiRequest } from "next";
import { IncomingMessage } from "node:http";
import Router from "next/router";
import Cookies from "js-cookie";

import { AuthUser } from "@/types/auth";
import { fetcher } from "@/libs/fetcher";

export const setToken = (data: AuthUser) => {
  // Next.jsがサーバーで実行されるウィンドウオブジェクトがページに含まれている場合 `window is not defined` ノエラーになってwindowにアクセスする事はできない
  // ウィンドウオブジェクトにアクセスする必要がある場合は「SSR」を無効にするために早期Returnの必要がある
  if (typeof window === "undefined") return;

  Cookies.set("id", data.user.id.toString());
  Cookies.set("username", data.user.username);
  Cookies.set("jwt", data.jwt);

  if (Cookies.get("username")) {
    Router.reload();
  }
};

export const unsetToken = () => {
  if (typeof window === "undefined") return;

  Cookies.remove("id");
  Cookies.remove("username");
  Cookies.remove("jwt");

  Router.reload();
};

export const getIdFromLocalCookie = () => {
  const jwt = getTokenFromLocalCookie();

  if (jwt) {
    return fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((data) => data.id)
      .catch((error) => console.log(error));
  } else {
    return;
  }
};

export const getUserFromLocalCookie = () => {
  const jwt = getTokenFromLocalCookie();

  if (jwt) {
    return fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((data) => data.username)
      .catch((error) => console.log(error));
  } else {
    return;
  }
};

export const getTokenFromLocalCookie = () => {
  return Cookies.get("jwt");
};

export const getIdFromServerCookie = (req: NextApiRequest) => {
  if (!req.headers.cookie || "") return undefined;

  const idCookie = req.headers.cookie
    .split(";")
    .find((c: string) => c.trim().startsWith("id="));

  if (!idCookie) return undefined;

  const id = idCookie.split("=")[1];
  return id;
};

export const getTokenFromServerCookie = (req: IncomingMessage) => {
  if (!req.headers.cookie || "") return undefined;

  const jwtCookie = req.headers.cookie
    .split(";")
    .find((c: string) => c.trim().startsWith("jwt="));

  if (!jwtCookie) return undefined;

  const jwt = jwtCookie.split("=")[1];
  return jwt;
};
