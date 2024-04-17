import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "../components/Loading";
import { RoutePath } from "../config/route_path";
import { HomePage } from "../pages/HomePage";

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
    children: [{ path: RoutePath.Home.path, element: <HomePage /> }],
  },
];
