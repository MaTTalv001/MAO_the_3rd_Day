import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config/settings";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// auth.jsx 内

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // URLからクエリパラメータを解析してトークンを取得
    const query = new URLSearchParams(window.location.search);
    const tokenFromUrl = query.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem("authToken", tokenFromUrl); // トークンをlocalStorageに保存
    }
  }, []);
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/v1/users/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setCurrentUser(data.user))
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [token]); // 依存配列にtokenを指定

  const logout = () => {
    setCurrentUser(null); // ユーザー情報をクリア
    setToken(""); // トークンをクリア
    localStorage.removeItem("authToken"); // localStorageからトークンを削除
  };

  return (
    <AuthContext.Provider
      value={{ token, logout, setToken, currentUser, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
