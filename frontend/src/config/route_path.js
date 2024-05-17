export const RoutePath = {
  Home: {
    path: "/",
    name: "ホーム",
  },
  MyPage: {
    path: "/mypage",
    name: "マイページ",
  },
  Shop: {
    path: "/shop",
    name: "ショップ",
  },
  Users: {
    path: "/users",
    name: "酒場",
  },
  UsersShow: {
    path: (id = ":id") => `/users/${id}`,
    name: "冒険者ステータス",
  },
  CreateAvatar: {
    path: "/create_avatar",
    name: "アバター生成",
  },
  MyItems: {
    path: "/my_items",
    name: "所持品",
  },
  Battle: {
    path: "/battle",
    name: "モンスター討伐",
  },
};
