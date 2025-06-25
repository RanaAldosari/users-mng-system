import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,Outlet
} from "react-router";
import SignUpComponenet from '../componenets/SignUpComponenet';
import SignInComponent from '../componenets/SignInComponent';
import AdminComponent from '../componenets/AdminComponent';
import PrincpleComponent from '../componenets/PrincpleComponent';
import ViewUsersComponent from '../componenets/ViewUsersComponent';
import ViewClassComponent from '../componenets/ViewClassComponent';
// import AdminSigdbar from '../componenets/AdminSigdbar';
import AdminPageClass from '../pages/AdminPageClass';
import LeavesPage from '../pages/LeavesPage';
// create layout
function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}


// define paths
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children:[
        {
            path:"/",
element:<SignUpComponenet></SignUpComponenet>
        },
        {
            path:"/SignIn",
            element:<SignInComponent></SignInComponent>
        },
        {
            path:"/Admin",
            element:<AdminComponent></AdminComponent>,
        },
        {
          path:"/AdminCreateClass",
          element:<AdminPageClass></AdminPageClass>
        },
        {
            path:"/Princple",
            element:<PrincpleComponent></PrincpleComponent>
        },
        {
          path:"/Viewusers",
          element:<ViewUsersComponent></ViewUsersComponent>
        },
        {
          path:"/viewclass",
          element:<ViewClassComponent></ViewClassComponent>
},
{
  path:"/leaves-action",
  element:<LeavesPage></LeavesPage>
}
    ]
  },
]);


function Routerr() {
  return (
 <>
  <RouterProvider router={router} />
 </>
  )
}

export default Routerr