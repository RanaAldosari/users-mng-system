// src/Router.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Public layout with Navbar & Footer
import Navbar from "../componenets/NabBar";
import Footer from "../componenets/Footer";

// Admin nav‐bar layout
import AdminLayout from "../componenets/AdminLayout";

// Public‐facing pages
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

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      // Home & sign-in
      { index: true, element: <HomeScreen /> },
      { path: "signin", element: <TestSignin /> },

      // Principal (public-facing)
      { path: "Princple", element: <PrincipalPage /> },

      // Teacher section
      { path: "teacher", element: <TeacherHome /> },
      { path: "classes/:classId/teacher", element: <ClassDetails /> },
      { path: "classes/:classId/attendance/teacher", element: <ManageAttendance /> },
      { path: "add-attendance/:classId/:attendanceId", element: <AddAttendance /> },

      // Student section
      { path: "student", element: <StudentHome /> },
      { path: "classes/:classId/student", element: <StClassDetails /> },
      { path: "classes/:classId/attendance/student", element: <ViewAttendance /> },
      { path: "leaves", element: <ViewLeaves /> },
      { path: "classes/:classId/leaves/new", element: <CreateLeave /> },
    ],
  },
  {
    path: "/Admin",
    element: <AdminLayout />,
    children: [
      // Admin dashboard
      { index: true, element: <AdminPageClass /> },
      // Admin CRUD
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
