import { useState } from "react";

export default function CourseSidebar({
  modules,
  activeLessonId,
  onLessonSelect,
}) {
  const [openModuleId, setOpenModuleId] = useState(null);

  const toggleModule = (moduleId) => {
    setOpenModuleId((prev) =>
      prev === moduleId ? null : moduleId
    );
  };

  return (
    <aside className="w-72 bg-white border-r min-h-[calc(100vh-64px)] p-4">
      <p className="text-xs text-gray-400 font-semibold mb-4">
        COURSE CONTENT
      </p>

      <div className="space-y-3">
        {modules.map((module) => (
          <div key={module._id}>
            {/* Module row */}
            <button
              onClick={() => toggleModule(module._id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 text-left font-medium"
            >
              <span className="text-sm">
                Module {module.order}: {module.title}
              </span>

              <span className="text-gray-400 dark:text-slate-500">
                {openModuleId === module._id ? "▾" : "▸"}
              </span>
            </button>

            {/* Lessons (only when module is open) */}
            {openModuleId === module._id && (
              <ul className="ml-3 mt-2 space-y-1">
                {module.lessons.map((lesson) => (
                  <li
                    key={lesson._id}
                    onClick={() => onLessonSelect?.(lesson)}
                    className={`px-3 py-2 text-sm rounded-lg cursor-pointer ${
                      lesson._id === activeLessonId
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {module.order}.{lesson.orderNo} {lesson.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
