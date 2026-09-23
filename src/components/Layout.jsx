import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Plus,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/medicines", label: "Medicines", icon: Pill },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentLabel =
    navItems.find((item) => item.to === location.pathname)?.label ||
    (location.pathname.includes("/medicines/")
      ? "Medicine"
      : "Medical Shop");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            {/* Purple + Yellow Logo */}
            <div
              className="grid h-10 w-10 place-items-center rounded-xl shadow-lg"
              style={{
                backgroundColor: "#3A0CA3",
                color: "#FFF275",
                boxShadow: "0 10px 25px rgba(58, 12, 163, 0.20)",
              }}
            >
              <Activity size={21} strokeWidth={2.5} />
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-900">
                MediCare
              </p>
              <p className="text-[11px] font-medium text-slate-400">
                SHOP MANAGEMENT
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-yellow-50 hover:text-purple-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Main menu
          </p>

          <nav className="space-y-1.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-purple-50 text-[#3A0CA3]"
                      : "text-slate-500 hover:bg-yellow-50 hover:text-[#3A0CA3]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      className={
                        isActive
                          ? "text-[#3A0CA3]"
                          : "text-slate-400 group-hover:text-[#3A0CA3]"
                      }
                    />

                    {label}

                    {/* Active Indicator */}
                    {isActive && (
                      <span
                        className="ml-auto h-2 w-2 rounded-full"
                        style={{ backgroundColor: "#FFF275" }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Demo Mode Card */}
        <div className="mt-auto p-4">
          <div
            className="rounded-2xl p-4 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #3A0CA3 0%, #4F16C4 70%, #FFF275 180%)",
              boxShadow: "0 10px 25px rgba(58, 12, 163, 0.15)",
            }}
          >
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: "#FFF275",
                color: "#3A0CA3",
              }}
            >
              <ShieldCheck size={18} />
            </div>

            <p className="text-sm font-bold text-white">Demo mode</p>

            <p className="mt-1 text-xs leading-5 text-purple-100">
              Data is saved locally in this browser for your presentation.
            </p>
          </div>
        </div>
      </aside>

      {/* =========================
          MAIN AREA
      ========================== */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          {/* Left Header */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-yellow-300 hover:bg-yellow-50 hover:text-[#3A0CA3] lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Medical Shop
              </p>

              <h1 className="text-lg font-bold text-slate-900">
                {currentLabel}
              </h1>
            </div>
          </div>

          {/* Right Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification */}
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-yellow-300 hover:bg-yellow-50 hover:text-[#3A0CA3]">
              <Bell size={19} />

              <span
                className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "#3A0CA3" }}
              />
            </button>

            {/* Add Medicine */}
            <button
              onClick={() => navigate("/medicines/new")}
              className="hidden items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 sm:flex"
              style={{
                backgroundColor: "#3A0CA3",
                boxShadow: "0 4px 12px rgba(58, 12, 163, 0.20)",
              }}
            >
              <Plus size={17} />

              Add Medicine
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pr-2.5 transition hover:border-yellow-300 hover:bg-yellow-50"
              >
                {/* Avatar */}
                <div
                  className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold"
                  style={{
                    backgroundColor: "#FFF275",
                    color: "#3A0CA3",
                  }}
                >
                  AD
                </div>

                <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                  Admin
                </span>

                <ChevronDown
                  size={15}
                  className="text-slate-400"
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <LogOut size={17} />

                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}