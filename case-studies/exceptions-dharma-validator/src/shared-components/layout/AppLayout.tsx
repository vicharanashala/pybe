import { Outlet } from "react-router-dom";
import Backdrop from "./Backdrop";

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full relative text-ink font-body">
      <Backdrop />
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <Outlet />
      </main>
    </div>
  );
}