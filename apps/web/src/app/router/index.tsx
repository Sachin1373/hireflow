import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/Layout/MainLayout";
import DashboardPage from "@/Pages/Dashboard";
import JobsPage from "@/Pages/Jobs";
import Applications from "@/Pages/Applications";
import ReviewersPage from "@/Pages/Reviewers";
import UsersPage from "@/Pages/Users";
import SignUp from "@/Pages/Auth/SignUp";
import Login from "@/Pages/Auth/Login";
import RequireAuth from "@/Components/RequireAuth";
import CreateNewJob from "@/Pages/Jobs/CreateNewJob";
import PublicApplyPage from "@/Pages/PublicApply";
import { Responses } from "@/Pages/Applications/Responses";

export const router = createBrowserRouter([
  {
    element: <RequireAuth />, // Base login check
    children: [
      {
        path: "/dashboard",
        element: <MainLayout />,
        children: [
          { index: true, element: <DashboardPage /> },

          {
            element: <RequireAuth allowedRoles={["ADMIN", "HR"]} />,
            children: [
              {
                path: "jobs",
                children: [
                  { index: true, element: <JobsPage /> },
                  { path: "new", element: <CreateNewJob /> },
                  // { path: ":jobId", element: <JobDetails /> },
                  // { path: ":jobId/edit", element: <EditJob /> },
                ]
              },
              { path: "applications",
                children: [
                  { index: true, element:<Applications /> },
                  { path: ":jobId", element: <Responses />},
                ],
              },
              { path: "reviewers", element: <ReviewersPage /> },
              { path: "users", element: <UsersPage /> },
            ]
          }
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
  {
    path: "/apply/:publicToken",
    element: <PublicApplyPage />,
  },
]);