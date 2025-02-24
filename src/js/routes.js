import DashboardPage from "../pages/dashboard.vue";
import LeftPanel from "../pages/left.vue";
import LoginPage from "../pages/login.vue";
import RegisterPage from "../pages/register.vue";
import PartiesRoutes from "@/js/router/parties";
import ProductManagerRoutes from "@/js/router/product-managers";
import ExpensesRoutes from "@/js/router/expenses";
import StockRoutes from "@/js/router/stock";
import ReportsRoutes from "@/js/router/reports";
import SettingsRoutes from "@/js/router/settings";
import NotFoundPage from "../pages/404.vue";
import subscriptions from "./router/subscriptions";

var routes = [
  {
    path: "/dashboard/",
    component: DashboardPage,
  },
  {
    path: "/left/",
    component: LeftPanel,
  },
  {
    path: "/login/",
    component: LoginPage,
  },
  {
    path: "/register/",
    component: RegisterPage,
  },
  ...PartiesRoutes,
  ...ProductManagerRoutes,
  ...ExpensesRoutes,
  ...StockRoutes,
  ...ReportsRoutes,
  ...SettingsRoutes,
  ...subscriptions,
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
