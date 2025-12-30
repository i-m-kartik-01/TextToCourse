import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function CourseGenerator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    console.log("Generate clicked");

    if (!topic.trim()) {
      console.log("Topic empty");
      return;
    }

    try {
      setLoading(true);

      console.log("Getting token...");
      const token = await getAccessTokenSilently();
      console.log("Token OK");

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/courses/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ topic }),
        }
      );

      console.log("Response status:", res.status);

      if (!res.ok) {
        const err = await res.text();
        console.error("Backend error:", err);
        alert("Course generation failed");
        return;
      }

      const course = await res.json();
      console.log("Generated course:", course);

      navigate(`/courses/${course._id}`);
    } catch (err) {
      console.error("Generate failed:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full flex items-center justify-center overflow-hidden">
      {/* Soft radial background */}
      <div className="
          absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,#e0ecff,transparent_60%),radial-gradient(circle_at_70%_70%,#f3e8ff,transparent_60%)]
          dark:bg-[radial-gradient(circle_at_30%_40%,#1e293b,transparent_60%),radial-gradient(circle_at_70%_70%,#312e81,transparent_60%)]
      " />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full px-6 text-center">
        <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl shadow-lg">
          ✨
        </div>

        <h1 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
          Create New Course
        </h1>

        <p className="text-gray-600 mb-10">
          Turn any topic into a structured learning path with AI.
        </p>

        {/* Input */}
        <div className="flex items-center bg-white rounded-2xl shadow-lg p-2 gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you want to learn?"
            className="flex-1 outline-none text-sm px-3 py-3"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-800 hover:bg-gray-900
                       text-white px-6 py-3 rounded-xl font-medium
                       disabled:opacity-60"
          >
            {loading ? "Generating..." : "📘 Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}

