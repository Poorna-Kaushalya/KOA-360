import { useState, useEffect } from "react";
import { FiMenu, FiX, FiWifi } from "react-icons/fi";

function SignInNavbar({ logout }) {
  const links = [
    "Home",
    "Dashboard",
    "Radiology",
    "BioData",
    "KOA Grade",
    "KneeMonitor",
  ];
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [connected, setConnected] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check device connection status every 5s
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch("http://192.168.8.102:5000/api/device-status"); // <-- update API
        const data = await res.json();
        setConnected(data.connected);
      } catch (err) {
        setConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const formattedDateTime = dateTime.toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="fixed w-full z-50">
      <div className="w-full bg-blue-600 text-white text-lg px-6 py-1 flex justify-end items-center gap-6 shadow-md">
        <div className="flex items-center gap-2">
          {/* Status Dot */}
          <span
            className={`w-3 h-3 rounded-full ${
              connected ? "bg-green-400" : "bg-red-500"
            }`}
          ></span>

          {/* Status Text and optional Wi-Fi icon */}
          <span className="flex items-center gap-1 font-semibold">
            {connected ? (
              <>
                Device Connected <FiWifi size={16} className="ml-1" /> &nbsp;&nbsp;&nbsp;&nbsp;|
              </>
            ) : (
              "Device Disconnected"
            )}
          </span>
        </div>

        {/* Date & Time */}
        <b>
          <span>{formattedDateTime}</span>
        </b>
      </div>

      {/* Main Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl shadow-md rounded-b-2xl">
        <div className="max-w-9xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-4xl font-extrabold tracking-wide text-blue-700">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KneeCare
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8">
            {links.map((link) => (
              <button
                key={link}
                onClick={() => setActive(link)}
                className={`font-semibold px-6 py-2 rounded-lg transition-all duration-300 ${
                  active === link
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-700 hover:bg-blue-100 hover:text-blue-900"
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <div className="hidden md:block">
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 text-white transition shadow-md"
            >
              <b>Logout</b>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-2 bg-white/90 backdrop-blur-sm shadow-lg">
            {links.map((link) => (
              <button
                key={link}
                onClick={() => {
                  setActive(link);
                  setMenuOpen(false);
                }}
                className={`w-full text-left font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                  active === link
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-700 hover:bg-blue-100 hover:text-blue-900"
                }`}
              >
                {link}
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full text-left bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default SignInNavbar;
