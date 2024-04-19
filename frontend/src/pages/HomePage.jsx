import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { RoutePath } from "../config/route_path";
import { API_URL } from "../config/settings";

export const HomePage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { currentUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      localStorage.setItem("auth", token);
      /* navigate(RoutePath.Home.path);*/
      console.log(currentUser);
    }
  }, [setToken, navigate]);

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    const form = document.createElement("form");
    form.method = "GET";
    form.action = `${API_URL}/auth/google_oauth2`; // Google認証のエンドポイントURL
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <article className="pt-12 pb-12 max-w-[65%] m-auto">
      <div className="bg-white rounded p-[50px]">
        <div className="p-15">
          <section className="text-center">
            <div className="block mb-15">
              <h2 className="text-4xl font-semibold">Google認証</h2>
            </div>
            <div className="text-center">
              <button
                className="bg-gray-800 text-white py-2.5 px-5 rounded my-4"
                onClick={handleGoogleAuth}
              >
                <div className="flex items-center justify-center">
                  <span className="text-2xl">Googleでログインする</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
};
