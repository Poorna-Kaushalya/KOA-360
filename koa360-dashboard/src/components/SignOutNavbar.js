import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

function SignOutNavbar({ isLoggedIn }) {
  const publicLinks = ["Home", "About", "Contact"];
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
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
      {/* Main Navbar */}
      <nav className="fixed w-full z-50 shadow-md rounded-b-2xl">
        <div className="max-w-9xl mx-auto px-6 py-4 flex  items-center">
          {/* Logo */}
          <div className="text-4xl font-extrabold tracking-wide text-blue-700">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KneeCare&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          {/* Links */}
          <div className="hidden md:flex gap-8">
            {publicLinks.map((link) => (
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/* Login/Register */}
          <div className="hidden md:block">
            <button
              className="bg-green-600 px-4 py-2 text-white rounded-lg hover:bg-green-600 transition shadow-md"
              onClick={() => (window.location.href = "/login")}
            >
              <b>New User</b>
            </button>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/* Top Bar with Date & Time */}
          <div className="text-white text-2xl text-right px-0 py-1 ">
            <b>
              <span>{formattedDateTime}</span>
            </b>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-2 bg-white/90 backdrop-blur-sm shadow-lg">
            {publicLinks.map((link) => (
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
              onClick={() => (window.location.href = "/login")}
              className="w-full text-left bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition shadow-md"
            >
              Login
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}

export default SignOutNavbar;
