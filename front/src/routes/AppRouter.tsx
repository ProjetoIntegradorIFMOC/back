import App from "@/App";
import Activities from "@/pages/activities/Activities";
import ActivitiesDetails from "@/pages/activitiesDetails/ActivitiesDetails";
import AppLayout from "@/pages/AppLayout";
import Home from "@/pages/home/Home";
import Login from "@/pages/login/Login";
import RequireAuth from "@/pages/RequireAuth";
import RequireRole from "@/pages/RequireRole";
import Unauthorized from "@/pages/Unauthorized";
import Submissions from "@/pages/submissions/Submissions";
import SubmissionsDetails from "@/pages/submissionsDetails/SubmissionsDetails";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";


export function RedirectToHome() {
  return <Navigate to="/home" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<RedirectToHome />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<App />} />
            <Route path="home" element={<Home />} />
            {/* Routes accessible by both admin and professor */}
            <Route element={<RequireRole allowedRoles={["admin", "professor", "student"]} />}>
              <Route path="activities">
                <Route index element={<Activities />} />
                <Route path=":id" element={<ActivitiesDetails />} />
              </Route>
              <Route path="submissions">
                <Route index element={<Submissions />} />
                <Route
                  path=":activityId/:submissionId"
                  element={<SubmissionsDetails />}
                />
              </Route>
            </Route>
            {/* Add admin-only routes here if needed */}
            {/* Example:
            <Route element={<RequireRole allowedRoles={["admin"]} />}>
              <Route path="admin-panel" element={<AdminPanel />} />
            </Route>
            */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
