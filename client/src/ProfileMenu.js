import { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfileMenu() {
  const { user, logout, isAuthenticated } = useAuth0();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div
      ref={menuRef} className="relative"
    >
      {/* Profile Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-gray-800"
      >
        <img
          src={user?.picture}
          alt="profile"
          className="w-5 h-5 rounded-full"
        />
        <span className="text-sm font-medium">
          {user?.name || "Profile"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="mt-2 w-40 bg-white rounded-lg shadow-lg border">
          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
            className="w-full text-left px-4 py-2 text-sm bg-blue-600 text-red-500 hover:bg-gray-100 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
