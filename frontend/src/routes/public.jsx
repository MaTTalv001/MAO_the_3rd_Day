import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "../components/Loading";
import { RoutePath } from "../config/route_path";
import { HomePage } from "../pages/HomePage";
import { MyPage } from "../pages/MyPage";
import { Shop } from "../pages/Shop";
import { Users } from "../pages/Users";

const App = () => {
  return (
    <>
      <Suspense fallback={<Loading />} />
      <Outlet />
    </>
  );
};

export const PUBLIC_ROUTES = [
  {
    path: RoutePath.Home.path,
    element: <App />,
    children: [
      { path: RoutePath.Home.path, element: <HomePage /> },
      { path: RoutePath.MyPage.path, element: <MyPage /> },
      { path: RoutePath.Shop.path, element: <Shop /> },
      { path: RoutePath.Users.path, element: <Users /> },
    ],
  },
];
