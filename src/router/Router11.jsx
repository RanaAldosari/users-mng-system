import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import ManageAttendance from "../pages/teacher/ManageAttendance";
import TeacherHome from "../pages/teacher/TeacherHome";
import LoginPage from "../pages/LoginPage";
import ClassDetails from "../pages/teacher/ClassDetails";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "classes/:classId/attendance/teacher", element: <ManageAttendance /> },
      { path: "/teacher", element: <TeacherHome /> },
      { path: "/classes/:classId/teacher", element: <ClassDetails /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
]);

export default function Router11() {
  return <RouterProvider router={router} />;
}
