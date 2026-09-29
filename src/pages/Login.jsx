import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,

} from "lucide-react";

import logo from "../assets/logo.png";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useApp();
  const navigate = useNavigate();

  const selectRole = (nextRole) => {
  setRole(nextRole);
  setEmail("");
  setPassword("");
  setError("");
  setShowPassword(false);
};

 const submit = (e) => {
  e.preventDefault();
  setError("");

  const result = login(email.trim(), password);

  if (result.success) {
    navigate(result.role === "staff" ? "/staff" : "/");
  } else {
    setError(result.message || "Invalid email or password");
  }
};

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F5F8F9]">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#C2DFE3]/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#9DB4C0]/40 blur-3xl" />

      {/* Main */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-3 py-4 sm:px-5 sm:py-8">

        <div
          className="
            grid
            w-full
            max-w-5xl
            overflow-hidden
            rounded-2xl
            border
            border-[#E2EAED]
            bg-white
            shadow-[0_20px_60px_rgba(37,50,55,0.12)]
            sm:rounded-3xl
            lg:grid-cols-2
          "
        >

          {/* =================================================
              LEFT BRAND PANEL
              Desktop only
          ================================================= */}

          <div className="relative hidden overflow-hidden bg-[#5C6B73] p-10 lg:flex lg:flex-col lg:justify-between">

            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C2DFE3]/20 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#9DB4C0]/20 blur-3xl" />

            <div className="relative z-10">

              {/* Logo */}
              {/* Logo */}
              {/* Desktop Logo */}
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center">
                  <img
                    src={logo}
                    alt="MediCare Logo"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h2 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
                    MediCare
                  </h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#C5DDE1]">
                    Shop Management
                  </p>
                </div>
              </div>

              {/* Brand Content */}
              <div className="mt-20 max-w-sm">

                <p className="text-sm font-semibold text-[#C2DFE3]">
                  Pharmacy Management System
                </p>

                <h1 className="mt-3 text-4xl font-black leading-tight text-white">
                  Manage your pharmacy{" "}
                  <span className="text-[#C2DFE3]">
                    smarter.
                  </span>
                </h1>

                <p className="mt-5 text-sm leading-6 text-white/70">
                  Manage medicines, inventory, suppliers and customer
                  billing from one simple workspace.
                </p>

              </div>
            </div>

            {/* Secure Workspace */}
            <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C2DFE3] text-[#253237]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Secure workspace
                </p>

                <p className="text-xs text-white/60">
                  Role-based access for your pharmacy
                </p>
              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT LOGIN AREA
          ================================================= */}

          <div className="w-full p-5 sm:p-8 lg:p-10">

            {/* Mobile Logo */}
            {/* Mobile Logo */}
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden sm:h-24 sm:w-24">
                <img
                  src={logo}
                  alt="MediCare Pharmacy Logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-col justify-center">
                <p className="text-lg font-black leading-tight text-[#253237]">
                  MediCare
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#5C6B73]">
                  Shop Management
                </p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-6 sm:mb-7">

              <div className="mb-3 inline-flex rounded-full bg-[#C2DFE3]/50 px-3 py-1">

                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5C6B73]">
                  Secure Access
                </span>

              </div>

              <h2 className="text-2xl font-black tracking-tight text-[#253237] sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-5 text-[#66757C]">
                Sign in to access your MediCare workspace.
              </p>

            </div>

            {/* Role Selector */}
            <div className="mb-5 rounded-2xl border border-[#E3EAED] bg-[#F5F8F9] p-1.5 sm:mb-6">

              <div className="grid grid-cols-2 gap-1.5">

                {[
                  {
                    value: "admin",
                    label: "Admin",
                    icon: ShieldCheck,
                  },
                  {
                    value: "staff",
                    label: "Staff",
                    icon: UserRound,
                  },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => selectRole(value)}
                    className={`
                      flex
                      min-h-[44px]
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      font-bold
                      transition
                      active:scale-[0.98]
                      ${role === value
                        ? "bg-white text-[#253237] shadow-sm"
                        : "text-[#7A898F] hover:text-[#5C6B73]"
                      }
                    `}
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                ))}

              </div>
            </div>

            {/* Portal Information */}
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#D8E7EA] bg-[#F2F8F9] p-3 sm:mb-6 sm:p-3.5">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C2DFE3] text-[#5C6B73] sm:h-10 sm:w-10">
                <LockKeyhole size={17} />
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-bold text-[#253237]">
                  {role === "admin"
                    ? "Admin Portal"
                    : "Staff Billing Portal"}
                </p>

                <p className="mt-0.5 text-[11px] leading-4 text-[#66757C] sm:text-xs">
                  {role === "admin"
                    ? "Full inventory and supplier management"
                    : "View stock and create customer bills"}
                </p>

              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold leading-5 text-red-700">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={submit}
              className="space-y-4 sm:space-y-5"
            >

              {/* Email */}
              <div>

                <label className="label">
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A999E]"
                  />

                  <input
                    className="input h-12 pl-10"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    required
                  />

                </div>
              </div>

              {/* Password */}
              <div>

                <label className="label">
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A999E]"
                  />

                  <input
                    className="input h-12 pl-10 pr-11"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A999E] transition hover:text-[#5C6B73]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  group
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#5C6B73]
                  px-4
                  text-sm
                  font-bold
                  text-white
                  shadow-md
                  shadow-[#5C6B73]/20
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#48565D]
                  hover:shadow-lg
                  active:translate-y-0
                "
              >
                Sign in as{" "}
                {role === "admin" ? "Admin" : "Staff"}

                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

            </form>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 sm:mt-7">

              <div className="h-px flex-1 bg-[#E7ECEE]" />

              <span className="whitespace-nowrap text-[9px] font-medium text-[#94A1A6] sm:text-[10px]">
                MediCare Management
              </span>

              <div className="h-px flex-1 bg-[#E7ECEE]" />

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}