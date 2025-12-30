import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function CourseQuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- FETCH QUIZ (PUBLIC) ---------------- */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/courses/${courseId}/quiz`
        );

        if (!res.ok) throw new Error("QUIZ_NOT_FOUND");

        const data = await res.json();
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch {
        // Quiz does not exist yet
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  /* ---------------- GENERATE QUIZ ---------------- */
  const generateQuiz = async () => {
    let token;
    try {
      token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        },
      });
    } catch {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setGenerating(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/courses/${courseId}/quiz/generate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to generate quiz");

      const data = await res.json();
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------- SUBMIT QUIZ ---------------- */
  const submitQuiz = async () => {
    if (!isAuthenticated) {
      setError("Please login to submit the quiz.");
      return;
    }

    try {
      setSubmitting(true);

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        },
      });

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/courses/${courseId}/quiz/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (!res.ok) throw new Error("Submission failed");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-slate-600">Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  /* ---------------- NO QUIZ YET ---------------- */
  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white max-w-lg w-full p-10 rounded-2xl border shadow-sm text-center">
          <h1 className="text-3xl font-bold mb-4">
            Final Course Quiz
          </h1>

          <p className="text-slate-600 mb-8">
            Generate a comprehensive quiz covering the entire course.
          </p>

          <button
            onClick={generateQuiz}
            disabled={generating}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl transition disabled:bg-slate-400"
          >
            {generating ? "Generating quiz..." : "Generate Quiz"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- RESULT ---------------- */
  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">
            Quiz Completed
          </h1>

          <p className="text-2xl font-semibold">
            {result.correctAnswers} / {result.totalQuestions}
          </p>

          <p className="text-slate-600 mb-8">
            Score: {result.scorePercentage}%
          </p>

          <button
            onClick={() =>
              navigate(`/courses/${courseId}/quiz/review`)
            }
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl"
          >
            Review Answers
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- QUIZ UI ---------------- */
  const answeredCount = answers.filter(a => a !== null).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Final Course Quiz
          </h1>

          <p className="text-slate-600 mt-2">
            Answer all questions before submitting
          </p>

          <div className="mt-4 text-sm text-slate-500">
            Progress: {answeredCount} / {totalQuestions}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {quiz.questions.map((q, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <div className="flex gap-4 mb-5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {idx + 1}
                </div>
                <p className="text-lg font-medium text-slate-900">
                  {q.question}
                </p>
              </div>

              <div className="space-y-3">
                {q.options.map((opt, i) => {
                  const selected = answers[idx] === i;

                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        checked={selected}
                        onChange={() => {
                          const next = [...answers];
                          next[idx] = i;
                          setAnswers(next);
                        }}
                        className="hidden"
                      />

                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          selected
                            ? "border-blue-600"
                            : "border-slate-400"
                        }`}
                      >
                        {selected && (
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                        )}
                      </span>

                      <span className="text-slate-800">
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-0 bg-white border-t mt-10 py-5 flex justify-end">
          <button
            onClick={submitQuiz}
            disabled={
              submitting || answers.some(a => a === null)
            }
            className={`px-8 py-3 rounded-xl text-white font-medium transition ${
              submitting || answers.some(a => a === null)
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
