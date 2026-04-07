import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { Settings, MapPin, Link as LinkIcon, UserPlus, Globe } from "lucide-react";

export default function UserDashboardHeader({ variant = "header" }) {
  const { user } = useAuth();

  if (!user) return null;

  const isSidebar = variant === "sidebar";
  const accentColor = user.accentColor || "indigo";
  
  const accentRingMap = {
    indigo: "ring-indigo-500/20 border-indigo-500",
    pink: "ring-pink-500/20 border-pink-500",
    rose: "ring-rose-500/20 border-rose-500",
    sky: "ring-sky-500/20 border-sky-500",
    emerald: "ring-emerald-500/20 border-emerald-500",
    cyan: "ring-cyan-500/20 border-cyan-500",
    orange: "ring-orange-500/20 border-orange-500",
    violet: "ring-violet-500/20 border-violet-500",
  };

  const accentTextMap = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    pink: "text-pink-600 dark:text-pink-400",
    rose: "text-rose-500 dark:text-rose-400",
    sky: "text-sky-500 dark:text-sky-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
    orange: "text-orange-600 dark:text-orange-400",
    violet: "text-violet-600 dark:text-violet-400",
  };

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative w-full ${
        isSidebar 
          ? "bg-white/50 dark:bg-zinc-950/20 backdrop-blur-xl rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900/50 p-8 shadow-sm" 
          : "border-b border-zinc-100 dark:border-zinc-900/50 pb-8 pt-2"
      }`}
    >
      <div className={`flex flex-col ${isSidebar ? "items-center text-center" : "md:flex-row items-center md:items-start gap-8"}`}>
        {/* AVATAR SECTION */}
        <div className={`relative shrink-0 ${isSidebar ? "mb-6" : ""}`}>
          <div className={`${isSidebar ? "w-40 h-40" : "w-32 h-32"} rounded-full border-4 p-1 ${accentRingMap[accentColor]} ring-8`}>
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt={user.name}
              className="w-full h-full rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="absolute bottom-1 right-2 h-8 w-8 rounded-full bg-emerald-500 border-4 border-white dark:border-zinc-950 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        {/* INFO SECTION */}
        <div className={`flex-1 ${!isSidebar ? "text-center md:text-left pt-2" : "w-full"}`}>
          <div className={`flex flex-col ${isSidebar ? "items-center mb-6" : "md:flex-row items-center gap-4 mb-4"}`}>
            <h1 className={`${isSidebar ? "text-3xl" : "text-2xl"} font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-2 md:mb-0`}>
              {user.username}
            </h1>
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="px-4 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-[11px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                Edit
              </Link>
              <button className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* STATS BAR */}
          <div className={`flex items-center justify-center ${!isSidebar ? "md:justify-start gap-8" : "gap-10"} mb-8`}>
             <div className={`flex flex-col ${!isSidebar ? "items-center md:items-start" : "items-center"}`}>
               <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">{user.habitsCount || 0}</span>
               <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Habits</span>
             </div>
             <div className={`flex flex-col ${!isSidebar ? "items-center md:items-start" : "items-center"}`}>
               <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">{user.followersCount || 0}</span>
               <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Followers</span>
             </div>
             <div className={`flex flex-col ${!isSidebar ? "items-center md:items-start" : "items-center"}`}>
               <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">{user.followingCount || 0}</span>
               <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Following</span>
             </div>
          </div>

          {/* BIO SECTION */}
          <div className={`space-y-2 ${isSidebar ? "px-4" : ""}`}>
            <p className="text-md font-black text-zinc-900 dark:text-zinc-100">{user.name}</p>
            {user.tagline && <p className="text-[13px] text-zinc-600 dark:text-zinc-400 font-bold tracking-tight">{user.tagline}</p>}
            {user.bio && <p className="text-sm text-zinc-500 dark:text-zinc-500 max-w-md mx-auto md:mx-0 leading-relaxed font-medium">{user.bio}</p>}
            
            <div className={`flex items-center justify-center ${!isSidebar ? "md:justify-start" : ""} gap-4 pt-4 text-zinc-400 dark:text-zinc-500`}>
               {user.location && (
                 <div className="flex items-center gap-1.5">
                   <MapPin size={14} className="opacity-50" />
                   <span className="text-[11px] font-bold tracking-wide">{user.location}</span>
                </div>
               )}
               <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-100 dark:border-zinc-800">
                   <UserPlus size={14} className={accentTextMap[accentColor]} />
                   <span className="text-[11px] font-black tracking-tight text-zinc-900 dark:text-zinc-100">Score: {user.credibilityScore}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
}
