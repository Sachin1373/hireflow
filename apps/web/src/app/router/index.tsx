import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/Layout/MainLayout";
import DashboardPage from "@/Pages/Dashboard";
import SignUp from "@/Pages/Auth/SignUp";
import Login from "@/Pages/Auth/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/signup',
    element: <SignUp/>,
  },
  {
    path: '/login',
    element: <Login/>,
  }
]);