import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "../api/api";
import Navbar2 from "../components/SignInNavbar";

function Dashboard({ logout }) {
  const [data, setData] = useState([]);
  const [steps, setSteps] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/api/sensor-data");
      const allData = res.data;

      const lastPoints = allData.slice(-600).reverse();
      setData(lastPoints);

      // Step count using accelerometer + gyroscope
      const magnitudes = lastPoints.map((d) => {
        const accMag = Math.sqrt(d.avg_ax ** 2 + d.avg_ay ** 2 + d.avg_az ** 2);
        const gyroMag = Math.sqrt(d.avg_gx ** 2 + d.avg_gy ** 2 + d.avg_gz ** 2);
        return accMag + 0.5 * gyroMag; // weighted combination
      });

      // Smooth values with moving average
      const smoothMagnitudes = magnitudes.map((val, i, arr) => {
        const windowSize = 5;
        const start = Math.max(0, i - windowSize + 1);
        const window = arr.slice(start, i + 1);
        return window.reduce((sum, v) => sum + v, 0) / window.length;
      });

      // Peak detection for steps
      let stepCount = 0;
      const threshold = 1.5; 
      for (let i = 1; i < smoothMagnitudes.length - 1; i++) {
        if (
          smoothMagnitudes[i] > threshold &&
          smoothMagnitudes[i] > smoothMagnitudes[i - 1] &&
          smoothMagnitudes[i] > smoothMagnitudes[i + 1]
        ) {
          stepCount++;
        }
      }

      setSteps(stepCount);
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

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div>
      <Navbar2 logout={logout} />
      <div className="p-32">
        <h2 className="mb-4 text-xl font-bold">Step Count: {steps}</h2>

        {/* Charts container */}
        <div className="flex flex-row gap-24">
          {/* Accelerometer Chart */}
          <div>
            <h3 className="mb-2 font-semibold">Accelerometer</h3>
            <LineChart width={550} height={270} data={data}>
              <CartesianGrid stroke="#ccc" horizontal={false} />
              <XAxis dataKey="createdAt" tickFormatter={formatTime} />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip labelFormatter={(label) => formatTime(label)} />
              <Line type="monotone" dataKey="avg_ax" stroke="red" dot={false} />
              <Line type="monotone" dataKey="avg_ay" stroke="blue" dot={false} />
              <Line type="monotone" dataKey="avg_az" stroke="green" dot={false} />
            </LineChart>
          </div>

          {/* Gyroscope Chart */}
          <div>
            <h3 className="mb-2 font-semibold">Gyroscope</h3>
            <LineChart width={550} height={270} data={data}>
              <CartesianGrid stroke="#ccc" horizontal={false} />
              <XAxis dataKey="createdAt" tickFormatter={formatTime} />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip labelFormatter={(label) => formatTime(label)} />
              <Line type="monotone" dataKey="avg_gx" stroke="orange" dot={false} />
              <Line type="monotone" dataKey="avg_gy" stroke="purple" dot={false} />
              <Line type="monotone" dataKey="avg_gz" stroke="brown" dot={false} />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
