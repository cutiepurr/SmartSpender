import Home from "./components/Home";
import TransactionList from "./components/Transaction/TransactionList";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: "/transactions",
    element: <TransactionList />
  },
  {
    path: "/transactions/:year/:month",
    element: <TransactionList />
  }
];

export default AppRoutes;
