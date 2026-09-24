import { useState } from "react";
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
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useApp } from "../context/AppContext";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/medicines",
    label: "Medicines",
    icon: Pill,
  },
  {
    to: "/suppliers",
    label: "Suppliers",
    icon: Truck,
  },
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
    navItems.find(
      (item) => item.to === location.pathname
    )?.label ||
    (location.pathname.includes("/medicines/")
      ? "Medicine"
      : "Medical Shop");

  return (
    <div className="min-h-screen bg-[#F4F7F8] text-[#35464B]">

      {/* =========================
          MOBILE SIDEBAR OVERLAY
      ========================== */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[#DCE5E8] bg-white shadow-[8px_0_30px_rgba(38,50,56,0.05)] transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* =========================
            LOGO
        ========================== */}
        <div className="flex h-[76px] items-center justify-between border-b border-[#E5EBED] px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#C2DFE3] text-[#42565C] shadow-sm">
              <Activity
                size={21}
                strokeWidth={2.5}
              />
            </div>

            <div>
              <p className="text-[17px] font-black tracking-tight text-[#35464B]">
                MediCare
              </p>

              <p className="mt-0.5 text-[9px] font-bold tracking-[0.17em] text-[#91A0A5]">
                SHOP MANAGEMENT
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="grid h-9 w-9 place-items-center rounded-xl border border-[#DCE5E8] text-[#77878C] transition duration-200 hover:bg-[#F1F6F7] hover:text-[#4C5F65] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}
        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-[9px] font-black uppercase tracking-[0.18em] text-[#9AA7AB]">
            Main menu
          </p>

          <nav className="space-y-1.5">
            {navItems.map(
              ({
                to,
                label,
                icon: Icon,
              }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[#EAF2F3] text-[#40545A] shadow-sm"
                        : "text-[#718187] hover:bg-[#F4F8F9] hover:text-[#43575D]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active left indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#8CAEB5]" />
                      )}

                      <div
                        className={`grid h-8 w-8 place-items-center rounded-lg transition ${
                          isActive
                            ? "bg-white text-[#61787F] shadow-sm"
                            : "bg-transparent text-[#91A0A5] group-hover:bg-white group-hover:text-[#63777D]"
                        }`}
                      >
                        <Icon size={17} />
                      </div>

                      <span>{label}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#7D9EA5]" />
                      )}
                    </>
                  )}
                </NavLink>
              )
            )}
          </nav>
        </div>

        {/* =========================
            DEMO MODE CARD
        ========================== */}
        <div className="mt-auto p-4">
          <div className="relative overflow-hidden rounded-2xl border border-[#D8E7E9] bg-gradient-to-br from-[#EEF5F6] via-[#E4F0F2] to-[#D4E6E8] p-4 shadow-sm">

            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/40" />

            <div className="relative">
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-white text-[#61777D] shadow-sm">
                <ShieldCheck size={18} />
              </div>

              <p className="text-sm font-black text-[#40545A]">
                Demo mode
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#708187]">
                Data is saved locally in this browser for your
                presentation.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================
          MAIN AREA
      ========================== */}
      <div className="lg:pl-[270px]">

        {/* =========================
            HEADER
        ========================== */}
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#DCE5E8] bg-white/95 px-3 shadow-[0_2px_15px_rgba(38,50,56,0.04)] backdrop-blur sm:px-6 lg:px-8">

          {/* Left Header */}
          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#DCE5E8] bg-white text-[#718187] transition duration-200 hover:border-[#C7DADD] hover:bg-[#F3F7F8] hover:text-[#52666C] lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={19} />
            </button>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#9AA7AB] sm:text-[10px]">
                Medical Shop
              </p>

              <h1 className="mt-0.5 truncate text-base font-black text-[#35464B] sm:text-lg">
                {currentLabel}
              </h1>
            </div>
          </div>

          {/* Right Header */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* =========================
                NOTIFICATION
            ========================== */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#DCE5E8] bg-white text-[#718187] transition duration-200 hover:border-[#C7DADD] hover:bg-[#F3F7F8] hover:text-[#52666C]"
            >
              <Bell size={18} />

              <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[#8CAEB5] ring-2 ring-white" />
            </button>

            {/* =========================
                ADD MEDICINE
            ========================== */}
            <button
              type="button"
              onClick={() =>
                navigate("/medicines/new")
              }
              className="hidden items-center gap-2 rounded-xl bg-[#C2DFE3] px-3.5 py-2.5 text-xs font-black text-[#40545A] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#B2D4D9] hover:shadow-md sm:flex"
            >
              <Plus size={16} />
              Add Medicine
            </button>

            {/* =========================
                PROFILE
            ========================== */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((v) => !v)
                }
                className="flex items-center gap-2 rounded-xl border border-[#DCE5E8] bg-white p-1.5 pr-2.5 transition duration-200 hover:border-[#C7DADD] hover:bg-[#F4F8F9]"
              >
                {/* Avatar */}
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#E4EFF1] text-[10px] font-black text-[#61777D]">
                  AD
                </div>

                <span className="hidden text-xs font-black text-[#596B71] sm:block">
                  Admin
                </span>

                <ChevronDown
                  size={14}
                  className={`text-[#91A0A5] transition duration-200 ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* =========================
                  PROFILE DROPDOWN
              ========================== */}
              {profileOpen && (
                <>
                  {/* Small outside click area */}
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-[#DCE5E8] bg-white p-1.5 shadow-[0_15px_40px_rgba(38,50,56,0.12)]">

                    <div className="mb-1 flex items-center gap-3 border-b border-[#E7ECEE] px-3 py-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#EAF2F3] text-[10px] font-black text-[#61777D]">
                        AD
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-black text-[#40545A]">
                          Admin Account
                        </p>

                        <p className="mt-0.5 truncate text-[10px] font-medium text-[#99A5A9]">
                          Shop Administrator
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black text-rose-500 transition duration-200 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* =========================
            PAGE CONTENT
        ========================== */}
        <main className="min-h-[calc(100vh-4.75rem)] px-3 py-5 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}