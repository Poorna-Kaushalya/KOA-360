/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import api from "../api/api";
import backgroundImg from "../images/background.jpg";
import SignOutNavbar from "../components/SignOutNavbar";
import logo from "../images/Logo.png";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { username, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Include Sign-in Navbar */}
      <SignOutNavbar />
      <img
        src={logo}
        alt="Project Logo"
        className="w-84 h-36 mx-72 my-36 shadow-xl rounded-3xl"
      />

      {/* Card */}
      <div className="absolute top-[36rem] left-[33rem] w-[450px] rounded-2xl p-8 transform -translate-x-1/2">
        <h2 className="text-3xl font-bold text-left text-gray-900 dark:text-dark mb-6">
          Login 🔑
        </h2>

        {error && (
          <p className="text-red-500 text-left mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username & Password on same line */}
          <div className="flex space-x-4">
            {/* Username */}
            <div className="flex-1">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-800"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600  text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>

            {/* Password */}
            <div className="flex-1">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 text-gray-900  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                required
              />
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-800">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-800 focus:ring-indigo-800"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="text-indigo-600 hover:underline dark:text-indigo-500"
            >
              <b>Forgot password?</b>
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
