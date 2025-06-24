import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,Outlet
} from "react-router";
import SignUpComponenet from '../componenets/SignUpComponenet';
import SignInComponent from '../componenets/SignInComponent';
import AdminComponent from '../componenets/AdminComponent';
import PrincpleComponent from '../componenets/PrincpleComponent';
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
            element:<AdminComponent></AdminComponent>
        },
        {
            path:"/Princple",
            element:<PrincpleComponent></PrincpleComponent>
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