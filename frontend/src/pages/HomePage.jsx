import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { Link } from "react-router-dom";
import { RoutePath } from "../config/route_path";
import { API_URL } from "../config/settings";
import { TitleComponent } from "../components/TitleComponent";

export const HomePage = () => {
  const navigate = useNavigate();
  const { setToken, currentUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setToken(token);
      localStorage.setItem("auth", token);
    }
  }, [setToken, navigate]);

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    const form = document.createElement("form");
    form.method = "GET";
    form.action = `${API_URL}/auth/google_oauth2`;
    document.body.appendChild(form);
    form.submit();
  };

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/guest_login`, {
        method: "POST",
      });
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("auth", data.token);
      navigate("/MyPage");
    } catch (error) {
      console.error("Error logging in as guest:", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 mb-10 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img
              src="imgs/title/title002.png"
              alt="App Title"
              className="max-w-full h-auto"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-md mb-2">習慣化支援RPG</p>
            <h2 className="text-4xl font-bold mb-4">3日目に魔王がいる</h2>
            <p className="text-xl mb-8">MAO the 3rd Day</p>
            <div className="space-y-4">
              {currentUser ? (
                <Link to="/MyPage" className="btn btn-accent gap-2 w-full">
                  マイページへ
                </Link>
              ) : (
                <>
                  <button
                    className="btn btn-accent gap-2 w-full"
                    onClick={handleGoogleAuth}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                      <path
                        fill="#FF3D00"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      ></path>
                      <path
                        fill="#4CAF50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      ></path>
                      <path
                        fill="#1976D2"
                        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      ></path>
                    </svg>
                    Googleログイン
                  </button>
                  <div
                    className="tooltip w-full"
                    data-tip="ゲストログインでほぼ全ての機能を利用できますが、再ログイン時にデータはリセットされます。"
                  >
                    <button
                      className="btn btn-accent gap-2 w-full"
                      onClick={handleGuestLogin}
                    >
                      <img
                        src="imgs/title/guest_login.png"
                        alt="Guest Login"
                        className="w-6 h-6"
                      />
                      ゲストログイン
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <TitleComponent />
    </div>
  );
};
