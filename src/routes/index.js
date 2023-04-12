import Home from "../pages/Home/Home";
import Login from "./../pages/Login/Login";
import Product from "../pages/Product/Product";
import User from "../pages/User/User";
import LoginShop from "../pages/LoginShop/LoginShop";
import Shop from "../pages/Shop/Shop";
import LoginAdmin from "../pages/LoginAdmin/LoginAdmin";
import Admin from "../pages/Admin/Admin";

const publicRoutes = [
    { path: "/admin/login", component: LoginAdmin, layout: false },
    { path: "/admin", component: Admin, layout: false },
    { path: "/shop/login", component: LoginShop, layout: false },
    { path: "/shop", component: Shop, layout: false },
    { path: "/deal-da-tham-gia", component: User },
    { path: "/thong-bao", component: User },
    { path: "/product/:id", component: Product },
    { path: "/login", component: Login },
    { path: "/", component: Home },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
