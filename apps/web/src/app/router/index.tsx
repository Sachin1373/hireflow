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
import JobDetails from "@/Pages/Jobs/JobDetails";
import PublicApplyPage from "@/Pages/PublicApply";
import { Responses } from "@/Pages/Applications/Responses";
import ReviewerApplicationsPage from "@/Pages/ReviewerDashboard/ReviewerApplicationsPage";
import ReviewApplications from "@/Pages/ReviewerDashboard/ReviewerApplicationsPage/Applications";

export const router = createBrowserRouter([
  {
    element: <RequireAuth allowedRoles={["ADMIN", "HR", "REVIEWER"]} />,
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
                  { path: ":jobId", element: <JobDetails /> },
                ],
              },

              {
                path: "applications",
                children: [
                  { index: true, element: <Applications /> },
                  { path: ":jobId", element: <Responses /> },
                ],
              },

              { path: "reviewers", element: <ReviewersPage /> },
              { path: "users", element: <UsersPage /> },
            ],
          },
        ],
      },
      {
        path: "/reviewer-dashboard",
        element: <MainLayout />,
        children: [
          {
            element: <RequireAuth allowedRoles={["REVIEWER"]} />,
            children: [
              {
                path: "application",
                element: <ReviewerApplicationsPage />,
              },
              {
                path: "application/:jobId",
                element: <ReviewApplications />,
              },
            ],
          },
        ],
      },
    ],
  },

  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  { path: "/apply/:publicToken", element: <PublicApplyPage /> },
]);
