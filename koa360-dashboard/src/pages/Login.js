/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import api from "../api/api";

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
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 ">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-700/50 rounded-3xl shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Login 🔑
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-indigo-600 hover:underline dark:text-indigo-400">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Don’t have an account?{" "}
            <a href="#" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Register
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
