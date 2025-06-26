import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
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
    { path: "/signin", element: < TestSignin/> },

    {
        path: "/",
        element: <Layout />,
        children: [
            // teacher
            { path: "classes/:classId/attendance/teacher", element: <ManageAttendance /> },
            { path: "teacher", element: <TeacherHome /> },
            { path: "classes/:classId/teacher", element: <ClassDetails /> },
            { path: "add-attendance/:classId/:attendanceId", element: <AddAttendance /> },
            
            // student
            { path: "student", element: <StudentHome /> },
            { path: "classes/:classId/student", element: <StClassDetails /> },
            { path: "classes/:classId/attendance/student", element: <ViewAttendance /> },
            { path: "leaves", element: <ViewLeaves /> },
            { path: "classes/:classId/leaves/new", element: <CreateLeave /> },
        ],
    },
]);

export default function Router11() {
    return <RouterProvider router={router} />;
}
