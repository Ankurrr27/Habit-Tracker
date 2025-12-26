import { Home, Flame, Plus, Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MobileBottomBar({ onAddHabit }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-50
        h-16
        bg-black border-t border-zinc-800
        flex items-center justify-around
        md:hidden
      "
    >
      <Item icon={<Home />} label="Home" onClick={() => navigate("/dashboard")} />
      <Item icon={<Flame />} label="Streaks" onClick={() => navigate("/dashboard")} />

      {/* CENTER FAB */}
      <button
        onClick={onAddHabit}
        aria-label="Add Habit"
        className="
          -mt-6
          w-14 h-14
          rounded-full
          bg-indigo-600 hover:bg-indigo-700
          text-white
          flex items-center justify-center
          shadow-xl
          active:scale-95
          transition
        "
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      <Item icon={<Users />} label="Users" onClick={() => navigate("/users")} />
      <Item
        icon={<User />}
        label="Profile"
        onClick={() => user && navigate(`/u/${user.username}`)}
      />
    </nav>
  );
}

function Item({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-col items-center
        text-xs text-zinc-400
        hover:text-white
        transition
      "
    >
      <div className="w-5 h-5 mb-1">{icon}</div>
      {label}
    </button>
  );
}
