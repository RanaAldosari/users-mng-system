// src/Router.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

// Public layout (just renders the current route)
function Layout() {
  return <Outlet />;
}

// Import your AdminLayout with the nav-bar
import AdminLayout from "../componenets/AdminLayout";

// Pages
import SignInPage from "../pages/SignInPage";
import PrincipalPage from "../pages/PrincplePage";
import ViewClass from "../pages/ViewClass";

import AdminPageClass from "../pages/AdminPageClass";
import LeavesPage from "../pages/LeavesPage";
import ViewUsersPage from "../pages/ViewUsersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <SignInPage /> },
      { path: "/Princple", element: <PrincipalPage /> },
      {
        path: "/Admin",
        element: <AdminLayout />,
        children: [
          // when you hit /Admin
          { index: true, element: <AdminPageClass /> },
          // /Admin/Viewusers
          { path: "viewusers", element: <ViewUsersPage /> },
          { path: "viewclass", element: <ViewClass /> },
          // /Admin/leaves-action
          { path: "leaves-action", element: <LeavesPage /> },
          // /Admin/AdminCreateClass
          { path: "AdminCreateClass", element: <AdminPageClass /> },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
