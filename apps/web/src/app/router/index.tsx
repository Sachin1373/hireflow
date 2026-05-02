import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/Pages/Dashboard";
import AdminLayout from "@/Layout/AdminLayout";
import ReviewerLayout from "@/Layout/ReviewerLayout";
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
import Pipeline from "@/Pages/Applications/Pipeline";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: (
      <RequireAuth allowedRoles={["ADMIN", "HR"]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },

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
          { path: "responses/:jobId", element: <Responses /> },
          { path: "pipeline/:jobId", element: <Pipeline/> },
        ],
      },

      { path: "reviewers", element: <ReviewersPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },

  {
    path: "/reviewer-dashboard",
    element: (
      <RequireAuth allowedRoles={["REVIEWER"]}>
        <ReviewerLayout />
      </RequireAuth>
    ),
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

  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  { path: "/apply/:publicToken", element: <PublicApplyPage /> },
]);
