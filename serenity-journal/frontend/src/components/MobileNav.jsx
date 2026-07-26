import { NavLink } from "react-router-dom";
import { FiHome, FiBook, FiCalendar, FiBarChart2, FiSettings } from "react-icons/fi";

// Compact bottom nav for small screens - mirrors the sidebar's top items
const links = [
  { to: "/dashboard", icon: FiHome, label: "Home" },
  { to: "/journal", icon: FiBook, label: "Journal" },
  { to: "/calendar", icon: FiCalendar, label: "Calendar" },
  { to: "/analytics", icon: FiBarChart2, label: "Mood" },
  { to: "/settings", icon: FiSettings, label: "Settings" },
];

const MobileNav = () => (
  <nav className="glass-card fixed bottom-3 left-3 right-3 flex justify-around p-2 md:hidden z-20">
    {links.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `flex flex-col items-center text-[10px] px-3 py-1.5 rounded-xl ${
            isActive ? "text-[var(--accent)]" : "opacity-70"
          }`
        }
      >
        <Icon size={18} />
        {label}
      </NavLink>
    ))}
  </nav>
);

export default MobileNav;
