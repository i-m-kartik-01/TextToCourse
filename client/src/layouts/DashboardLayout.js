import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 relative bg-slate-50 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
