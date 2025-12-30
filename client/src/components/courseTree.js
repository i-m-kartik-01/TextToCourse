export default function CourseTree() {
  return (
    <div className="space-y-4">
      <Section title="RECENT">
        <Course title="React Native Basics" open>
          <Lesson active>2. Components & Props</Lesson>
          <Lesson>1. Environment Setup</Lesson>
          <Lesson>3. State Management</Lesson>
          <Lesson>4. Navigation</Lesson>
        </Course>

        <Course title="Cognitive Psychology" />
        <Course title="Digital Marketing 101" />
        <Course title="History of Modern Art" />
      </Section>

      <Section title="ARCHIVED">
        <Course title="Intro to Python (Legacy)" />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="px-3 text-xs font-semibold text-gray-400 mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function Course({ title, open, children }) {
  return (
    <div className="mb-1">
      <div className="px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer font-medium text-sm">
        {title}
      </div>

      {open && (
        <div className="ml-4 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

function Lesson({ children, active }) {
  return (
    <div
      className={`px-3 py-1.5 rounded-md text-sm cursor-pointer
        ${
          active
            ? "bg-blue-50 text-primary"
            : "hover:bg-slate-100 text-gray-600"
        }`}
    >
      {children}
    </div>
  );
}
