import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router";

// import SignUpComponenet from '../componenets/SignUpComponenet';
import SignInComponent from '../componenets/SignInComponent';
import AdminComponent from '../componenets/AdminComponent';
import PrincpleComponent from '../componenets/PrincpleComponent';
import ViewUsersComponent from '../componenets/ViewUsersComponent';
import ViewClassComponent from '../componenets/ViewClassComponent';
import AdminPageClass from '../pages/AdminPageClass';
import LeavesPage from '../pages/LeavesPage';

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-indigo-900">
{/* side bar */}
      <div className="w-60 bg-white shadow-md rounded-r-lg p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold border-b-2 border-indigo-600 pb-2">Admin Panel</h2>

        <Link to="/Admindashboard" className="text-indigo-700 hover:text-indigo-900 font-medium transition">
          Dashboard
        </Link>
        <Link to="/Admin" className="text-indigo-700 hover:text-indigo-900 font-medium transition">
          Add Users
        </Link>
        <Link to="/Admin/AdminCreateClass" className="text-indigo-700 hover:text-indigo-900 font-medium transition">
          Create Class
        </Link>
        <Link to="/Admin/Viewusers" className="text-indigo-700 hover:text-indigo-900 font-medium transition">
          View Users
        </Link>
        <Link to="/Admin/viewclass" className="text-indigo-700 hover:text-indigo-900 font-medium transition">
          View Classes
        </Link>
        <Link to="/Admin/leaves-action" className="text-indigo-700 hover:text-indigo-900 font-medium transition">
          View Leaves
        </Link>
      </div>
{/* content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <SignInComponent /> },
      // { path: "/SignIn", element: <SignInComponent /> },
      { path: "/Princple", element: <PrincpleComponent /> },

      {
        path: "/Admin",
        element: <AdminLayout />,
        children: [
          { path: "", element: <AdminComponent /> },
          { path: "Viewusers", element: <ViewUsersComponent /> },
          { path: "viewclass", element: <ViewClassComponent /> },
          { path: "leaves-action", element: <LeavesPage /> },
          { path: "AdminCreateClass", element: <AdminPageClass /> },


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
        ]
      },
    ]
  }
]);

function Routerr() {
  return (
    <RouterProvider router={router} />
  )
}

export default Routerr;
