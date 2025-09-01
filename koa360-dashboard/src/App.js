import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  return token ? <Dashboard token={token}/> : <Login setToken={setToken}/>;
}

export default App;
