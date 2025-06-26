import { Link } from "react-router";

export default function HomeScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-100 px-6 flex flex-col">
      {/* Decorative blobs */}
      <div className="lg:block hidden absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-800 opacity-10 rounded-full animate-pulse" />
      <div className="lg:block hidden absolute bottom-[-15%] right-[-15%] w-96 h-96 bg-indigo-800 opacity-10 rounded-full animate-spin-slow" />
      <div className="lg:block hidden absolute top-1/2 right-20 w-56 h-56 bg-indigo-800 opacity-5 rounded-full" />

      {/* Logo */}
      <div className="pt-12 lg:pt-16 flex justify-center z-10">
        <img
          src="https://cdn.tuwaiq.edu.sa/landing/images/logo/logo-h.png"
          alt="Logo"
          className="h-32 lg:h-52 object-cover"
        />
      </div>

      {/* Hero text/buttons */}
      <div className="flex-grow flex flex-col items-center justify-center z-10 text-center max-w-xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-indigo-800 drop-shadow-xs">
          Attendance Management System
        </h1>
        <p className="mt-4 text-indigo-800/90 text-base sm:text-lg md:text-xl max-w-lg">
          Manage your attendance records and leave requests easily with our
          system. Designed for students and staff to track presence, absence and more.
        </p>

        {/* Sign In button only */}
        <div className="mt-20 lg:mt-8 flex justify-center">
          <Link
            to="/signin"
            className="inline-block px-8 py-3 bg-indigo-800 text-neutral-100 font-semibold rounded-full shadow-lg transform transition hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
