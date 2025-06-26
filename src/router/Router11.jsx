import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import ManageAttendance from "../pages/teacher/ManageAttendance";
import TeacherHome from "../pages/teacher/TeacherHome";
import ClassDetails from "../pages/teacher/ClassDetails";
import AddAttendance from "../pages/teacher/AddAttendance";
import StudentHome from "../pages/student/StudentHome";
import StClassDetails from "../pages/student/StClassDetails";
import ViewAttendance from "../pages/student/ViewAttendance";
import ViewLeaves from "../pages/student/LeavePage";
import CreateLeave from "../pages/student/CreateLeave";
import Navbar from "../componenets/NabBar";
import Footer from "../componenets/Footer";
import HomeScreen from "../pages/HomeScreen";
import TestSignin from "../pages/TestSignin";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  { path: "/", element: <HomeScreen /> },
  { path: "/login", element: <TestSignin /> },

  {
    path: "/",
    element: <Layout />,
    children: [
      // teacher routes
      { path: "attendance", element: <ManageAttendance /> },
      { path: "teacher", element: <TeacherHome /> },
      { path: "class", element: <ClassDetails /> },
      { path: "attendance", element: <AddAttendance /> },

      // student routes
      { path: "student", element: <StudentHome /> },
      { path: "student/class", element: <StClassDetails /> },
      { path: "student/class/:id/attendance", element: <ViewAttendance /> },
      { path: "student/leaves", element: <ViewLeaves /> },
      { path: "student/class/:id/leaves/new", element: <CreateLeave /> },
    ],
  },
]);

export default function Router11() {
  return <RouterProvider router={router} />;
}
