import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleSignIn() {
    try {
      const response = await axios.post('https://student-management-system-pnb9.onrender.com/auth/signin', {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      // Admin
      if (email === "admin@admin.com" && password === "admin123") {
        alert("Login successful as Admin");
        navigate("/Admin");
        return;
      }

      // Principal
      if (email.startsWith("principal") && email.endsWith("@gmail.com") && password === "password123") {
        alert("Login successful as Principal");
        navigate("/Princple");
        return;
      }

      // Teacher
      if (email.startsWith("teacher") && email.endsWith("@gmail.com") && password === "password123") {
        alert("Login successful as Teacher");
        navigate("/teacher");
        return;
      }

      // Student
      if (email.startsWith("student") && email.endsWith("@gmail.com") && password === "password123") {
        alert("Login successful as Student");
        navigate("/student");
        return;
      }

      alert("Login successful but role unknown. Please check user role.");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your email and password.");
    }
  }

  return (
    <>
  
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-indigo-900 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center border-b-2 border-indigo-600 pb-2">
          Sign In
        </h2>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
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
      </>
  );
}

export default SignInPage;
