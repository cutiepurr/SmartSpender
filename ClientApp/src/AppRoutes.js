import Home from "./components/Home";
import TransactionListPage from "./components/Transaction/TransactionListPage";
import AuthenticationGuard from "./components/Auth/AuthenticationGuard";
import MonthlyTargetIndex from "./components/MonthlyTarget/MonthlyTargetIndex";

const AppRoutes = [
  {
    index: true,
    element: <Home/>
  },
  {
    path: "/transactions",
    element: <AuthenticationGuard component={TransactionListPage} />
  },
  {
    path: "/transactions/:year/:month",
    element: <AuthenticationGuard component={TransactionListPage} />
  },
  {
    path: "/targets",
    element: <AuthenticationGuard component={MonthlyTargetIndex} />
  }
];

export default AppRoutes;
