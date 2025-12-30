import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseQuizReviewPage() {
  const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/courses/${courseId}/quiz/review`
      );
      const data = await res.json();
      setQuiz(data);
    };

    fetchReview();
  }, [courseId]);

  if (!quiz) return <div className="p-10">Loading review…</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <h1 className="text-3xl font-bold mb-8">Quiz Review</h1>

      {quiz.questions.map((q) => (
        <div
          key={q.questionNo}
          className="mb-6 bg-white p-6 rounded-xl border"
        >
          <p className="font-semibold mb-4">
            {q.questionNo}. {q.question}
          </p>

          {q.options.map((opt, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                i === q.correctAnswerIndex
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
