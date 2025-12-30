import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function LessonVideoPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // const token = await getAccessTokenSilently();

        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/lessons/${lessonId}/video`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch lesson video");
        }

        const data = await res.json();
        setVideoId(data.videoId);
      } catch (err) {
        console.error("Video fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [lessonId, getAccessTokenSilently]);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-t-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="p-10 text-center text-gray-500">
        No video available for this lesson
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <div className="font-semibold">CourseGen</div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Lesson
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">
          Video Lesson
        </h1>

        <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Lesson Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </main>
    </div>
  );
}
