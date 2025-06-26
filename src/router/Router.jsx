// src/Router.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

// Layouts
import Navbar from "../componenets/NabBar";
import Footer from "../componenets/Footer";
import AdminLayout from "../componenets/AdminLayout";

// Public pages
import HomeScreen from "../pages/HomeScreen";
import TestSignin from "../pages/TestSignin";
import PrincipalPage from "../pages/PrincplePage";

// Teacher pages
import TeacherHome from "../pages/teacher/TeacherHome";
import ClassDetails from "../pages/teacher/ClassDetails";
import ManageAttendance from "../pages/teacher/ManageAttendance";
import AddAttendance from "../pages/teacher/AddAttendance";

// Student pages
import StudentHome from "../pages/student/StudentHome";
import StClassDetails from "../pages/student/StClassDetails";
import ViewAttendance from "../pages/student/ViewAttendance";
import ViewLeaves from "../pages/student/LeavePage";
import CreateLeave from "../pages/student/CreateLeave";

// Admin pages
import AdminPageClass from "../pages/AdminPageClass";
import ViewUsersPage from "../pages/ViewUsersPage";
import ViewClass from "../pages/ViewClass";
import LeavesPage from "../pages/LeavesPage";

// Public layout with header/footer
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// ProtectedRoute wrapper
function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/signin" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const router = createBrowserRouter([
  // Public+principal+teacher+student under PublicLayout
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      // Home & sign-in
      { index: true, element: <HomeScreen /> },
      { path: "signin", element: <TestSignin /> },

      // Principal (only principal/admin)
      {
        path: "Princple",
        element: (
          <ProtectedRoute allowedRoles={["principal", "admin"]}>
            <PrincipalPage />
          </ProtectedRoute>
        ),
      },

      // Teacher section (only teacher/admin)
      {
        path: "teacher",
        element: (
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <TeacherHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "classes/:classId/teacher",
        element: (
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <ClassDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "classes/:classId/attendance/teacher",
        element: (
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <ManageAttendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-attendance/:classId/:attendanceId",
        element: (
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <AddAttendance />
          </ProtectedRoute>
        ),
      },

      // Student section (only student/admin)
      {
        path: "student",
        element: (
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <StudentHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "classes/:classId/student",
        element: (
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <StClassDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "classes/:classId/attendance/student",
        element: (
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <ViewAttendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "leaves",
        element: (
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <ViewLeaves />
          </ProtectedRoute>
        ),
      },
      {
        path: "classes/:classId/leaves/new",
        element: (
          <ProtectedRoute allowedRoles={["student", "admin"]}>
            <CreateLeave />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Admin section under its own layout (only admin)
  {
    path: "/Admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminPageClass /> },
      { path: "viewusers", element: <ViewUsersPage /> },
      { path: "viewclass", element: <ViewClass /> },
      { path: "leaves-action", element: <LeavesPage /> },
      { path: "AdminCreateClass", element: <AdminPageClass /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
