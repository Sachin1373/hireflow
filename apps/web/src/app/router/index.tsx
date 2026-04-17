import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/Layout/MainLayout";
import DashboardPage from "@/Pages/Dashboard";
import JobsPage from "@/Pages/Jobs";
import PipelinePage from "@/Pages/Pipeline";
import ReviewersPage from "@/Pages/Reviewers";
import SignUp from "@/Pages/Auth/SignUp";
import Login from "@/Pages/Auth/Login";
import RequireAuth from "@/Components/RequireAuth";

export const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/dashboard",
        element: <MainLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "jobs", element: <JobsPage /> },
          { path: "pipeline", element: <PipelinePage /> },
          { path: "reviewers", element: <ReviewersPage /> },
        ],
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);