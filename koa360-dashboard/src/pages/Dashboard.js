import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/api";
import Navbar2 from "../components/SignInNavbar";

function Dashboard({ logout }) {
  const [data, setData] = useState([]);
  const [steps, setSteps] = useState(0);

  // Degree function
  const formatDegrees = (value) => {
    return value % 1 === 0 ? `${value}°` : `${value.toFixed(1)}°`;
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/api/sensor-data");
      const allData = res.data;
      const lastPoints = allData.slice(-600).reverse(); // last 10 min if 1-sec interval
      setData(lastPoints);

      // Step count logic using accelerometer + gyro
      const magnitudes = lastPoints.map((d) => {
        const upperMag = Math.sqrt(
          d.avg_upper.ax ** 2 + d.avg_upper.ay ** 2 + d.avg_upper.az ** 2
        );
        const lowerMag = Math.sqrt(
          d.avg_lower.ax ** 2 + d.avg_lower.ay ** 2 + d.avg_lower.az ** 2
        );
        const gyroMag =
          Math.sqrt(
            d.avg_upper.gx ** 2 + d.avg_upper.gy ** 2 + d.avg_upper.gz ** 2
          ) +
          Math.sqrt(
            d.avg_lower.gx ** 2 + d.avg_lower.gy ** 2 + d.avg_lower.gz ** 2
          );
        return upperMag + lowerMag + 0.5 * gyroMag;
      });

      // Moving average for smoothing
      const smoothMagnitudes = magnitudes.map((val, i, arr) => {
        const windowSize = 5;
        const start = Math.max(0, i - windowSize + 1);
        const window = arr.slice(start, i + 1);
        return window.reduce((sum, v) => sum + v, 0) / window.length;
      });

      // Step detection (simple peak detection)
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
    const interval = setInterval(fetchData, 120000);
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
      <div className="p-8">
        <br />
        <br />
        <br />
        <br />
        <br />
        <h2 className="mb-4 text-xl font-bold">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Step Count: {steps}
        </h2>
        <hr className="w-full border-t-2 border-blue-400 my-2" />
        <div className="flex flex-wrap">
          {/* Upper Accelerometer */}
          <div className="flex-1 min-w-[350px]">
            <br />
            <h3 className="mb-2 font-semibold">Upper Leg Motion</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid stroke="#ccc" horizontal={false} />
                <XAxis dataKey="createdAt" tickFormatter={formatTime} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip labelFormatter={formatTime} />
                <Line
                  type="monotone"
                  dataKey="avg_upper.ax"
                  stroke="red"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg_upper.ay"
                  stroke="blue"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg_upper.az"
                  stroke="green"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Upper Gyroscope */}
          <div className="flex-1 min-w-[350px]">
            <br />
            <h3 className="mb-2 font-semibold">Upper Leg Rotation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid stroke="#ccc" horizontal={false} />
                <XAxis dataKey="createdAt" tickFormatter={formatTime} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip labelFormatter={formatTime} />
                <Line
                  type="monotone"
                  dataKey="avg_upper.gx"
                  stroke="orange"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg_upper.gy"
                  stroke="purple"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg_upper.gz"
                  stroke="brown"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Lower Accelerometer */}
          <div className="flex-1 min-w-[350px]">
            <br />
            <h3 className="mb-2 font-semibold">Lower Leg Motion`</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid stroke="#ccc" horizontal={false} />
                <XAxis dataKey="createdAt" tickFormatter={formatTime} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip labelFormatter={formatTime} />
                <Line
                  type="monotone"
                  dataKey="avg_lower.ax"
                  stroke="red"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg_lower.ay"
                  stroke="blue"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg_lower.az"
                  stroke="green"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Lower Gyroscope */}
          <div className="flex-1 min-w-[350px]">
            <br />
            <h3 className="mb-2 font-semibold">Lower Leg Rotation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid stroke="#ccc" horizontal={false} />
                <XAxis dataKey="createdAt" tickFormatter={formatTime} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip labelFormatter={formatTime} />
                <Line
                  type="monotone"
                  dataKey="avg_lower.gx"
                  stroke="orange"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg_lower.gy"
                  stroke="purple"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg_lower.gz"
                  stroke="brown"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Knee Angle Chart */}
        <div className="mt-12">
          <h3 className="mb-2 font-semibold">Knee Angle</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="createdAt" tickFormatter={formatTime} />
              <YAxis domain={["auto", "auto"]} tickFormatter={formatDegrees} />
              <Tooltip labelFormatter={formatTime} formatter={formatDegrees} />
              <Line
                type="monotone"
                dataKey="avg_knee_angle"
                stroke="orange"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
