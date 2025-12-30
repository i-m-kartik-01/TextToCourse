import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function MyCourses() {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load courses");

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (loading) {
    return (
      <div className="px-3 py-2 text-sm text-gray-400">
        Loading courses…
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="px-3 py-2 text-sm text-gray-400">
        No courses created yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
        My Courses
      </p>

      {courses.map((course) => (
        <div
          key={course._id}
          onClick={() => navigate(`/courses/${course._id}`)}
          className="px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-slate-100"
        >
          {course.title}
        </div>
      ))}
    </div>
  );
}
