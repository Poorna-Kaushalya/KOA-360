import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function Dashboard({ token }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://192.168.8.102:5000/api/sensor-data", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div>
      <h1>KOA 360 Dashboard</h1>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid stroke="#ccc"/>
        <XAxis dataKey="createdAt"/>
        <YAxis/>
        <Tooltip/>
        <Line type="monotone" dataKey="avg_ax" stroke="red"/>
        <Line type="monotone" dataKey="avg_ay" stroke="blue"/>
        <Line type="monotone" dataKey="avg_az" stroke="green"/>
      </LineChart>
    </div>
  );
}

export default Dashboard;
