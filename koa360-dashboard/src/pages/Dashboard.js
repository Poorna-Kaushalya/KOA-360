import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import api from "../api/api";
import Navbar from "../components/Navbar"; // adjust path if needed

function Dashboard({ logout }) {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/api/sensor-data");
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        logout();
      } else {
        console.error(err);
      }
    }
  }, [logout]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div>
      <Navbar logout={logout} />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">KOA 360 Dashboard</h1>
        <LineChart width={800} height={400} data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="createdAt" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avg_ax" stroke="red" />
          <Line type="monotone" dataKey="avg_ay" stroke="blue" />
          <Line type="monotone" dataKey="avg_az" stroke="green" />
        </LineChart>
      </div>
    </div>
  );
}

export default Dashboard;
