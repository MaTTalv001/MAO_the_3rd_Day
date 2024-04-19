import { useAuth } from "providers/auth";
import { RoutePath } from "config/route_path";
import { Link, useNavigate } from "react-router-dom";
import { memo, useEffect } from "react";

export const Header = memo(() => {
  const { setToken, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
  }, [localStorage.getItem("authToken")]);

  const handleClickLogout = () => {
    logout(); // トークンをクリアしてログアウト処理
    console.log("logout");
    navigate(RoutePath.Home.path); // ログインページにリダイレクト
  };

  return (
    <header className="bg-white h-16 flex justify-between items-center drop-shadow-md z-50">
      <div className="flex gap-3 m-4 items-center">
        <h1 className="text-runteq-primary text-xl font-semibold">
          {/* ログイン済みであればユーザー一覧を表示するようにしています */}
          <Link to="#">3日目に魔王がいる</Link>
        </h1>
        <nav className="m-7">
          <ul className="flex gap-7">
            <li>
              <p to="#" className="text-gray-400">
                ダミー
              </p>
            </li>
            <li>
              <p to="#" className="text-gray-400">
                ダミー
              </p>
            </li>
            <li>
              <p to="#" className="text-gray-400">
                ダミー
              </p>
            </li>
            <li>
              <p to="#" className="text-gray-400">
                ダミー
              </p>
            </li>
            <li>
              <Link to="#">ダミー</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center h-full mr-4">
        {currentUser ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex flex-col justify-center items-center w-24 gap-2 hover:opacity-80"
              type="button"
            >
              <span className="text-xs">マイページ</span>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] shadow bg-white rounded mt-2 p-0 py-2 text-base w-36"
            >
              <li>
                <Link
                  to="#"
                  className="rounded-none hover:rounded-none hover:bg-runteq-primary px-6"
                >
                  マイページ
                </Link>
              </li>
              <li>
                <button
                  onClick={handleClickLogout}
                  className="rounded-none hover:rounded-none hover:bg-runteq-primary px-6"
                >
                  ログアウト
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="#" className="px-4">
            ダミー
          </Link>
        )}
      </div>
    </header>
  );
});
