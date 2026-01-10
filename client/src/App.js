import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/Dashboard";
import CourseGenerator from "./components/CourseGenerator";
import ProtectedRoute from "./components/ProtectedRoute";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import LessonVideoPage from "./pages/LessonVideoPage";
import CourseQuizPage from "./pages/CourseQuizPage";
import CourseQuizReviewPage from "./pages/CourseQuizReviewPage";

function App() {
  const {isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-t-2 border-blue-800 rounded-full" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={<LoginPage />}
      />


      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <CourseGenerator />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:courseId"
        element={
            <CoursePage />
        }
      />
      <Route
        path="/lessons/:lessonId"
        element={<LessonPage />}
      />

      
      <Route
        path="/lessons/:lessonId/video"
        element={
            <LessonVideoPage />
        }
      />

      <Route 
      path="/courses/:courseId/quiz" 
      element={<CourseQuizPage />} 
      />
      <Route 
      path="/courses/:courseId/quiz/review" 
      element={<CourseQuizReviewPage />} 
      />
    </Routes>
  );
}

export default App;
