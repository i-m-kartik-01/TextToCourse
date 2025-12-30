import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH USER COURSES ---------------- */
  useEffect(() => {
    console.log("API BASE URL =", process.env.REACT_APP_API_BASE_URL);

    const fetchCourses = async () => {
      try {
        if (!isAuthenticated) {
          setCourses([]);
          return;
        }

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          },
        });

        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load courses");

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Sidebar course fetch error:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, getAccessTokenSilently]);

  /* ---------------- UI ---------------- */
  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Search */}
      <div className="p-4">
        <input
          placeholder="Filter courses..."
          className="
            w-full px-3 py-2 text-sm rounded-lg outline-none
            bg-slate-100 dark:bg-slate-800
            text-slate-900 dark:text-slate-200
            placeholder-slate-400 dark:placeholder-slate-500
          "
        />
      </div>

      {/* Course List */}
      <div className="flex-1 overflow-auto px-2">
        {loading && (
          <p className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500">
            Loading courses…
          </p>
        )}

        {error && (
          <p className="px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && courses.length === 0 && (
          <p className="px-3 py-2 text-sm text-gray-400 dark:text-slate-500">
            No courses yet
          </p>
        )}

        {!loading && courses.length > 0 && (
          <>
            <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500">
              My Courses
            </p>

            <div className="space-y-1">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="
                    px-3 py-2 rounded-lg text-sm cursor-pointer
                    text-slate-800 dark:text-slate-200
                    hover:bg-slate-100 dark:hover:bg-slate-800
                  "
                >
                  {course.title}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-2 text-sm">
        <div className="cursor-pointer text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white">
          ⚙ Settings
        </div>
        <div className="cursor-pointer text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white">
          ❓ Help & Support
        </div>
      </div>
    </aside>
  );
}
