// src/pages/SignInPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignIn() {
    try {
      const { data } = await axios.post(
        "https://student-management-system-pnb9.onrender.com/signin",
        { email, password }
      );

      const { token, role } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      alert(
        `Login successful as ${role.charAt(0).toUpperCase() + role.slice(1)}`
      );

      // route based on role
      switch (role) {
        case "admin":
          navigate("/Admin");
          break;
        case "principal":
          navigate("/Princple");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-indigo-900 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center border-b-2 border-indigo-600 pb-2">
          Sign In
        </h2>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={handleSignIn}
          className="w-full bg-indigo-700 hover:bg-indigo-900 text-white font-semibold py-2 rounded-md transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
