import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Users = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  //ページネーション,ソート
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const location = useLocation();
  const navigate = useNavigate();

  //

  useEffect(() => {
    const params = new URLSearchParams(location.search); // URLのクエリパラメータを取得するためのヘルパー関数を作成
    const page = parseInt(params.get("page")) || 1; // 'page'クエリパラメータを取得し、整数に変換する。指定がない場合はデフォルトで1ページ目
    const sortCol = params.get("sort_column") || "created_at"; // 'sort_column'クエリパラメータを取得する。指定がない場合はデフォルトで'created_at'
    const sortDir = params.get("sort_direction") || "desc"; // 'sort_direction'クエリパラメータを取得する。指定がない場合はデフォルトで'desc'

    setCurrentPage(page);
    setSortColumn(sortCol);
    setSortDirection(sortDir);

    // ユーザーデータをAPIから取得するためのリクエストを送信
    fetch(
      `${API_URL}/api/v1/users?page=${page}&sort_column=${sortCol}&sort_direction=${sortDir}`
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
        setTotalPages(data.total_pages);
      })
      .catch((error) =>
        console.error("ユーザーデータの取得に失敗しました:", error)
      );
  }, [location.search]); // location.searchが変更されるたびにこのuseEffectが実行される

  // ページ番号の変更時に呼び出される関数
  // navigateを使って新しいURLを構築し、ページ番号、ソートカラム、ソート方向をクエリパラメータとして設定
  const handlePageChange = (page) => {
    navigate(
      `?page=${page}&sort_column=${sortColumn}&sort_direction=${sortDirection}`
    );
  };

  // ソートカラムの変更時に呼び出される関数
  const handleSortChange = (column) => {
    // 現在のソートカラムがクリックされたカラムと同じで、現在のソート方向が昇順（asc）の場合は降順（desc）に変更、それ以外の場合は昇順（asc）
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
    // 新しいURLを構築し、ページ番号を1にリセットしてソートカラムとソート方向をクエリパラメータとして設定
    navigate(`?page=1&sort_column=${column}&sort_direction=${newDirection}`);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
        <p>長時間画面が変わらない場合は、再度ログインしてください</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold mb-4">酒場</h1>
        <Link to={`/MyPage`} className="btn btn-ghost btn-xl">
          マイページ
        </Link>
      </div>
      {/* <div role="alert" className="alert alert-success my-2">
        <span>
          <p>冒険者一覧です</p>
          <p>ゲストログイン冒険者は酒場登録されません</p>
        </span>
      </div> */}

      {/* ソートボタン */}
      <div className="flex  mb-4">
        <button
          onClick={() => handleSortChange("created_at")}
          className="btn btn-ghost"
        >
          登録順{" "}
          {/* 現在のソートカラムが"created_at"の場合、ソート方向に応じて▲（昇順）または▼（降順）のアイコンを表示 */}
          {sortColumn === "created_at"
            ? sortDirection === "asc"
              ? "▲"
              : "▼"
            : ""}
        </button>
        <button
          onClick={() => handleSortChange("nickname")}
          className="btn btn-ghost"
        >
          ニックネーム{" "}
          {sortColumn === "nickname"
            ? sortDirection === "asc"
              ? "▲"
              : "▼"
            : ""}
        </button>
        <button
          onClick={() => handleSortChange("latest_status.level")}
          className="btn btn-ghost"
        >
          レベル{" "}
          {sortColumn === "latest_status.level"
            ? sortDirection === "asc"
              ? "▲"
              : "▼"
            : ""}
        </button>
        <button
          onClick={() => handleSortChange("latest_status.hp")}
          className="btn btn-ghost"
        >
          HP{" "}
          {sortColumn === "latest_status.hp"
            ? sortDirection === "asc"
              ? "▲"
              : "▼"
            : ""}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-base-200 bg-opacity-60 p-4 rounded-lg"
          >
            <div className="flex items-center mb-4">
              <img
                src={user.current_avatar_url}
                alt="User Avatar"
                className="w-32 h-32 rounded-lg mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">{user.nickname}</h2>
                <p>職業：{user.latest_status_as_json.job.name}</p>
                <p>レベル：{user.latest_status_as_json.level}</p>
                <p>HP：{user.latest_status_as_json.hp}</p>
              </div>
            </div>
            <div className="mb-4"></div>
            <div className="flex justify-between items-center">
              <div>
                <p>3日達成数：{user.achievement}</p>
                <p>{user.profile}</p>
              </div>
              <Link to={`/users/${user.id}`} className="btn btn-primary btn-sm">
                詳細
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/*ページネーションボタン*/}
      <div className="flex justify-center mt-4">
        <div className="btn-group">
          {/* totalPagesの数だけボタンを生成 */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              // ボタンのkey属性を設定。indexを使用して一意に識別
              key={index}
              // 現在のページ番号に応じてbtn-activeクラスを追加し、現在のページを視覚的に強調
              className={`btn ${index + 1 === currentPage ? "btn-active" : ""}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
