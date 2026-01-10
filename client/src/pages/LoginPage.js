import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  /* ================= DARK MODE SYNC ================= */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-body">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 font-display font-semibold text-lg text-slate-900 dark:text-white">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
            C
          </div>
          CourseGen
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-3 py-1 rounded-lg border
                       border-slate-300 dark:border-slate-600
                       text-slate-700 dark:text-slate-200
                       hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button type="button" className="link-btn">
            Contact Support
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Left Feature Card */}
          <div className="hidden md:block rounded-2xl overflow-hidden shadow-lg bg-slate-900 relative">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
              alt="Library"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />

            <div className="relative p-8 h-full flex flex-col justify-between text-white">
              <div>
                <span className="inline-block mb-4 px-3 py-1 text-xs bg-primary rounded-full">
                  New Feature
                </span>

                <h1 className="text-3xl font-bold leading-snug">
                  Turn your chaotic notes into structured courses in seconds.
                </h1>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="font-semibold mb-1">Instant Generation</p>
                <p className="text-sm text-gray-200">
                  Our AI analyzes your text and builds a full curriculum automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-10 flex flex-col justify-center border dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
              Welcome back
            </h2>

            <p className="text-gray-600 dark:text-slate-400 mb-8">
              Log in to access your course dashboard and start creating.
            </p>

            <button
              onClick={() => loginWithRedirect()}
              className="w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Continue with Auth0
            </button>

            <div className="my-6 flex items-center gap-3 text-gray-400 dark:text-slate-500 text-sm">
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
              Secured by Auth0
              <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 text-sm text-gray-600 dark:text-slate-400 text-center">
              Don’t have an account?
              <button
                onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                className="text-primary font-medium ml-1 hover:underline"
                type="button"
              >
                Sign up
              </button>
            </div>

            <div className="flex justify-center gap-6 mt-8 text-sm text-gray-400 dark:text-slate-500">
                <button type="button" className="link-btn">Terms</button>
                <button type="button" className="link-btn">Privacy</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-400 dark:text-slate-500 py-6">
        © 2023 CourseGen Inc. All rights reserved.
      </footer>
    </div>
  );
}
