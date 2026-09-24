
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
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-[#9DB4C0]">
      {/* =========================
          MOBILE SIDEBAR OVERLAY
      ========================== */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-[#3F2930]/45 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#EAD5D8] bg-white shadow-xl shadow-[C2DFE3]/10 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* =========================
            LOGO
        ========================== */}
        <div className="flex h-20 items-center justify-between border-b border-[#EAD5D8] px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[C2DFE3] text-[#4A3037] shadow-lg shadow-[C2DFE3]/25">
              <Activity
                size={21}
                strokeWidth={2.5}
              />
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-[#3F2930]">
                MediCare
              </p>

              <p className="text-[10px] font-semibold tracking-[0.14em] text-[#A88F95]">
                SHOP MANAGEMENT
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-lg text-[#253237] transition hover:bg-[#5C6B73] hover:text-[#6A414B] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}
        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A88F95]">
            Main menu
          </p>

          <nav className="space-y-1.5">
            {navItems.map(
              ({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#5C6B73] text-[#6A414B] shadow-sm"
                        : "text-[#7E6A70] hover:bg-[#9DB4C0] hover:text-[#6A414B]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-[#A96F7D]"
                            : "text-[#A88F95] transition group-hover:text-[#A96F7D]"
                        }
                      />

                      <span>{label}</span>

                      {/* Active Indicator */}
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-[C2DFE3] shadow-sm" />
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
          <div className="rounded-2xl border border-[C2DFE3] bg-gradient-to-br from-[C2DFE3] via-[#E8C0C6] to-[#5C6B73] p-4 shadow-lg shadow-[C2DFE3]/20">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/60 text-[#6A414B] shadow-sm">
              <ShieldCheck size={18} />
            </div>

            <p className="text-sm font-bold text-[#3F2930]">
              Demo mode
            </p>

            <p className="mt-1 text-xs leading-5 text-[#6A414B]">
              Data is saved locally in this browser for your
              presentation.
            </p>
          </div>
        </div>
      </aside>

      {/* =========================
          MAIN AREA
      ========================== */}
      <div className="lg:pl-72">
        {/* =========================
            HEADER
        ========================== */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#EAD5D8] bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">
          {/* Left Header */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#EAD5D8] bg-white text-[#6F5A60] transition hover:border-[C2DFE3] hover:bg-[#5C6B73] hover:text-[#6A414B] lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-[11px] font-medium text-[#A88F95]">
                Medical Shop
              </p>

              <h1 className="text-lg font-bold text-[#3F2930]">
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
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#EAD5D8] bg-white text-[#7E6A70] transition hover:border-[C2DFE3] hover:bg-[#5C6B73] hover:text-[#6A414B]"
            >
              <Bell size={19} />

              <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[#A96F7D] ring-2 ring-white" />
            </button>

            {/* =========================
                ADD MEDICINE
            ========================== */}
            <button
              type="button"
              onClick={() =>
                navigate("/medicines/new")
              }
              className="hidden items-center gap-2 rounded-xl bg-[C2DFE3] px-3.5 py-2.5 text-sm font-bold text-[#3F2930] shadow-sm shadow-[C2DFE3]/25 transition hover:-translate-y-0.5 hover:bg-[#D7A5B0] hover:shadow-md sm:flex"
            >
              <Plus size={17} />
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
                className="flex items-center gap-2 rounded-xl border border-[#EAD5D8] bg-white p-1.5 pr-2.5 transition hover:border-[C2DFE3] hover:bg-[#9DB4C0]"
              >
                {/* Avatar */}
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#5C6B73] text-sm font-bold text-[#6A414B]">
                  AD
                </div>

                <span className="hidden text-sm font-semibold text-[#5F4A50] sm:block">
                  Admin
                </span>

                <ChevronDown
                  size={15}
                  className={`text-[#A88F95] transition ${
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

                  <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-[#EAD5D8] bg-white p-1.5 shadow-xl shadow-[#3F2930]/10">
                    <div className="mb-1 border-b border-[#EAD5D8] px-3 py-2.5">
                      <p className="text-xs font-bold text-[#3F2930]">
                        Admin Account
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#A88F95]">
                        Shop Administrator
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      <LogOut size={17} />
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
        <main className="min-h-[calc(100vh-5rem)] px-3 py-5 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

