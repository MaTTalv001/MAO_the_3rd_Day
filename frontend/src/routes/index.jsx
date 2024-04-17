import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { PROTECTED_ROUTES } from "./protected";
import { PUBLIC_ROUTES } from "./public";
import { useRoutes } from "react-router-dom";

export const AppRoutes = () => {
  const { currentUser } = useAuth(); // 認証状態をuseAuthフックから取得
  const routes = currentUser ? PROTECTED_ROUTES : PUBLIC_ROUTES; // 認証状態に応じてルートを切り替え
  const element = useRoutes([...routes]);

  return <>{element}</>;
};
