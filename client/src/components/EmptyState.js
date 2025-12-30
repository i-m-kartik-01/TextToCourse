export default function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        📄
      </div>

      <h2 className="text-xl font-semibold mb-2">
        No Course Selected
      </h2>

      <p className="text-gray-500 max-w-md mb-6">
        Select a course module from the sidebar to view its content,
        quizzes, and materials.
      </p>

      <div className="flex gap-4">
        <button className="px-4 py-2 border rounded-lg text-sm">
          ← Open Sidebar
        </button>

        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
          + Generate New Course
        </button>
      </div>
    </div>
  );
}
