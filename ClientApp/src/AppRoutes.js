import Home from "./components/Home";
import TransactionList from "./components/Transaction/TransactionList.tsx";
import AuthenticationGuard from "./components/Auth/AuthenticationGuard";

const AppRoutes = [
  {
    index: true,
    element: <Home/>
  },
  {
    path: "/transactions",
    element: <AuthenticationGuard component={TransactionList} />
  },
  {
    path: "/transactions/:year/:month",
    element: <AuthenticationGuard component={TransactionList} />
  }
];

export default AppRoutes;
