import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "../components/Loading";
import { RoutePath } from "../config/route_path";
import { HomePage } from "../pages/HomePage";
import { MyPage } from "../pages/MyPage";
import { Shop } from "../pages/Shop";
import { Users } from "../pages/Users";
import { UsersShow } from "../pages/UsersShow";
import { CreateAvatar } from "../pages/CreateAvatar";
import { MyItems } from "../pages/MyItems";
import { Battle } from "../pages/Battle";
import { Boss } from "../pages/Boss";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import { TermsOfService } from "../pages/TermsOfService";
import { PublicAvatar } from "../pages/PublicAvatar";
import { EnemyDirectory } from "../components/EnemyDirectory";
import { ItemDirectory } from "../components/ItemDirectory";
import { Config } from "../pages/Config";

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
      { path: RoutePath.UsersShow.path(), element: <UsersShow /> },
      { path: RoutePath.CreateAvatar.path, element: <CreateAvatar /> },
      { path: RoutePath.MyItems.path, element: <MyItems /> },
      { path: RoutePath.Battle.path, element: <Battle /> },
      { path: RoutePath.Boss.path, element: <Boss /> },
      { path: RoutePath.PrivacyPolicy.path, element: <PrivacyPolicy /> },
      { path: RoutePath.TermsOfService.path, element: <TermsOfService /> },
      { path: RoutePath.PublicAvatar.path, element: <PublicAvatar /> },
      { path: RoutePath.EnemyDirectory.path, element: <EnemyDirectory /> },
      { path: RoutePath.ItemDirectory.path, element: <ItemDirectory /> },
      { path: RoutePath.Config.path, element: <Config /> },
    ],
  },
];
