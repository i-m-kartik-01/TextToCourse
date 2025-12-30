import ProfileMenu from "../ProfileMenu";
import { useState, useEffect } from "react";




export default function TopBar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-700 flex items-center justify-between px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 font-semibold dark:text-white">
        <div className="w-8 h-8 bg-blue-800 rounded-md flex items-center justify-center text-white">
          C
        </div>
        CourseGen
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + New Course
        </button>

        <ProfileMenu />
       </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-sm px-3 py-1 rounded-lg border
                   border-slate-300 dark:border-slate-600
                   text-slate-700 dark:text-slate-200
                   hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
}
