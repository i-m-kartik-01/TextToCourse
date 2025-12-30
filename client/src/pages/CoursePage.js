import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [openModuleId, setOpenModuleId] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ================= FETCH COURSE ================= */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const headers = {};

        if (isAuthenticated) {
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            },
          });
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/courses/${courseId}`,
          { headers }
        );

        if (!res.ok) throw new Error("Failed to load course");

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Fetch course error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isAuthenticated, getAccessTokenSilently]);

  const handleLessonClick = async (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin h-10 w-10 border-t-2 border-blue-800 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 dark:text-red-400 bg-slate-50 dark:bg-slate-950">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950">
        Course not found
      </div>
    );
  }

  const toggleModule = (moduleId) => {
    setOpenModuleId((prev) =>
      prev === moduleId ? null : moduleId
    );
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* TOP BAR */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
        <div className="font-semibold text-lg">
          CourseGen AI
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

      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 min-h-[calc(100vh-64px)] p-4">
          <Link
            to="/dashboard"
            className="text-sm text-gray-600 dark:text-slate-300 hover:text-black dark:hover:text-white block mb-6"
          >
            ← Back to Dashboard
          </Link>

          <p className="text-xs text-gray-400 font-semibold mb-4">
            COURSE CONTENT
          </p>

          <div className="space-y-3">
            {course.modules?.map((module) => (
              <div key={module._id}>
                <button
                  onClick={() => toggleModule(module._id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg 
                             hover:bg-slate-100 dark:hover:bg-slate-800
                             text-left font-medium text-sm"
                >
                  <span>
                    Module {module.order}: {module.title}
                  </span>

                  <span
                    className={`transition-transform duration-300 ${
                      openModuleId === module._id ? "rotate-90" : ""
                    }`}
                  >
                    ▸
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ml-3 ${
                    openModuleId === module._id
                      ? "max-h-96 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="space-y-1">
                    {module.lessons?.map((lesson) => (
                      <li
                        key={lesson._id}
                        onClick={() => handleLessonClick(lesson._id)}
                        className="px-3 py-2 text-sm rounded-lg cursor-pointer 
                                   hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {module.order}.{lesson.orderNo} {lesson.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
            Courses › {course.title} › Overview
          </p>

          <h1 className="text-4xl font-bold mb-4">
            {course.title}
          </h1>

          {course.tags?.length > 0 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full 
                             bg-blue-100 text-blue-800 
                             dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {course.description && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">
                About this Course
              </h2>
              <p className="text-gray-600 dark:text-slate-300">
                {course.description}
              </p>
            </div>
          )}

          <div
            onClick={() => navigate(`/courses/${courseId}/quiz`)}
            className="cursor-pointer bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-8"
          >
            <h3 className="text-2xl font-semibold">
              Final Course Quiz
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Evaluate your understanding of the course
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
