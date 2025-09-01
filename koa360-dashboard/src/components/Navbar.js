import { useState } from "react";

function Navbar({ logout }) {
  const links = ["Dashboard", "Profile", "Settings"];
  const [active, setActive] = useState("Dashboard");

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wide">KOA 360</div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => setActive(link)}
              className={`font-semibold hover:text-gray-200 transition ${
                active === link ? "underline underline-offset-4 decoration-2" : ""
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
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
          >
            Logout
          </button>
        </div>

        </div>
    </nav>
  );
}

export default Navbar;
