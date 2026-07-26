import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiCalendar,
  FiBarChart2,
  FiWind,
  FiClock,
  FiCheckSquare,
  FiHeart,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import Enso from "./Enso";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/journal", label: "Journal", icon: FiBook },
  { to: "/calendar", label: "Calendar", icon: FiCalendar },
  { to: "/analytics", label: "Mood analytics", icon: FiBarChart2 },
  { to: "/breathe", label: "Breathe", icon: FiWind },
  { to: "/meditate", label: "Meditate", icon: FiClock },
  { to: "/todos", label: "Daily goals", icon: FiCheckSquare },
  { to: "/gratitude", label: "Gratitude", icon: FiHeart },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="glass-card fixed left-4 top-4 bottom-4 w-64 hidden md:flex flex-col p-5 z-20">
      <div className="flex items-center gap-2 mb-8 px-1">
        <Enso size={34} />
        <div>
          <p className="font-display text-xl leading-none">Serenity</p>
          <p className="text-xs opacity-70">Journal</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`
            }
          >
            <Icon /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-black/5 pt-4 mt-4">
        <p className="text-xs opacity-60 px-1 mb-2 truncate">{user?.name}</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 w-full"
        >
          <FiLogOut /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
