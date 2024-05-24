import { useAuth } from "providers/auth";
import { RoutePath } from "config/route_path";
import { Link, useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";

export const Header = memo(() => {
  const { setToken, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [hasBattledToday, setHasBattledToday] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("authToken"));
  }, [localStorage.getItem("authToken")]);
  //console.log(currentUser);

  useEffect(() => {
    if (currentUser && currentUser.battle_logs) {
      const today = new Date();
      const todayBattles = currentUser.battle_logs.filter((log) => {
        const logDate = new Date(log.created_at);
        return (
          logDate.getFullYear() === today.getFullYear() &&
          logDate.getMonth() === today.getMonth() &&
          logDate.getDate() === today.getDate()
        );
      });
      setHasBattledToday(todayBattles.length > 0);
    }
  }, [currentUser]);

  const handleClickLogout = () => {
    logout(); // トークンをクリアしてログアウト処理
    console.log("logout");
    navigate(RoutePath.Home.path); // ログインページにリダイレクト
  };

  return (
    <header className="navbar bg-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link
                to="/MyPage"
                className={`btn btn-ghost normal-case text-xl ${
                  !currentUser && "btn-disabled"
                }`}
              >
                マイページ
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className={`btn btn-ghost normal-case text-xl ${
                  !currentUser && "btn-disabled"
                }`}
              >
                酒場
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className={`btn btn-ghost normal-case text-xl ${
                  !currentUser && "btn-disabled"
                }`}
              >
                ショップ
              </Link>
            </li>
            <li>
              <Link
                to="/battle"
                className={`btn btn-ghost normal-case text-xl ${
                  hasBattledToday ? "btn-disabled" : ""
                } ${!currentUser && "btn-disabled"}`}
                onClick={(e) =>
                  (!currentUser || hasBattledToday) && e.preventDefault()
                }
              >
                討伐
              </Link>
            </li>
            {currentUser && (
              <li>
                <a
                  onClick={handleClickLogout}
                  className="btn btn-ghost normal-case text-xl"
                >
                  ログアウト
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost normal-case text-2xl">
          3日目に魔王がいる
        </Link>
      </div>
      <div className="navbar-end">
        {currentUser && (
          <div className="flex items-center">
            <span className="text-md mr-2 stat-value">
              <i className="fas fa-coins mr-1"></i>
              {currentUser.coin.amount}
            </span>
            <span className="text-lg mr-2 px-2 bg-secondary rounded-md">
              {currentUser.nickname}
            </span>
          </div>
        )}
      </div>
    </header>
  );
});
