import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Optional: auto-logout if token becomes invalid
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return token ? (
    <Dashboard token={token} logout={handleLogout} />
  ) : (
    <Login setToken={setToken} />
  );
}

export default App;
