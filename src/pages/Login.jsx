import { useState } from "react";
import {
ArrowRight,
Eye,
EyeOff,
HeartPulse,
LockKeyhole,
Mail,
ShieldCheck,
UserRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
const [role, setRole] = useState("admin");
const [email, setEmail] = useState("admin@medicare.com");
const [password, setPassword] = useState("admin123");
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState("");
const { login } = useApp();
const navigate = useNavigate();

const selectRole = (nextRole) => {
setRole(nextRole);
setError("");


if (nextRole === "admin") {
  setEmail("admin@medicare.com");
  setPassword("admin123");
} else {
  setEmail("staff@medicare.com");
  setPassword("staff123");
}


};

const submit = (e) => {
e.preventDefault();


const result = login(email, password);

if (result.success) {
  navigate(result.role === "staff" ? "/staff" : "/");
} else {
  setError(result.message);
}


};

return ( <div className="relative min-h-screen overflow-hidden bg-[#9DB4C0]">
{/* Decorative background shapes */} <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[C2DFE3]/30 blur-3xl" /> <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#5C6B73]/60 blur-3xl" />


  <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:py-10">
    <div className="w-full max-w-[440px]">

      {/* Logo / Header */}
      <div className="mb-4 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[C2DFE3] text-[#4A3037] shadow-lg shadow-[C2DFE3]/30">
          <HeartPulse size={28} />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B87887]">
          MediCare
        </p>

        <h1 className="mt-1 text-2xl font-black text-[#3F2930] sm:text-3xl">
          Medical Shop Management
        </h1>
      </div>

      {/* Login Card */}
      <div className="rounded-[1.6rem] border border-[#EAD5D8] bg-white p-5 shadow-xl shadow-[C2DFE3]/15 sm:p-7">

        {/* Heading */}
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B87887]">
            Secure access
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-900">
            Sign in to continue
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Choose your account type to access the correct workspace.
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[#9DB4C0] p-1.5">
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
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                role === value
                  ? "bg-[C2DFE3] text-[#3F2930] shadow-sm"
                  : "text-slate-500 hover:bg-[#5C6B73]/60 hover:text-[#4A3037]"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Portal Information */}
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-[C2DFE3] bg-[#5C6B73]/55 px-3 py-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[C2DFE3] text-[#4A3037]">
            <LockKeyhole size={14} />
          </div>

          <div>
            <p className="text-[11px] font-extrabold text-[#6A414B]">
              {role === "admin"
                ? "Admin Portal"
                : "Staff Billing Portal"}
            </p>

            <p className="text-[10px] text-slate-500">
              {role === "admin"
                ? "Full inventory and supplier management"
                : "View stock and create customer bills"}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="label">Email address</label>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                className="input h-11 pl-9"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>

            <div className="relative">
              <LockKeyhole
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                className="input h-11 pl-9 pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#B87887]"
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[C2DFE3] px-4 text-sm font-bold text-[#3F2930] shadow-lg shadow-[C2DFE3]/25 transition hover:-translate-y-0.5 hover:bg-[#D7A5B0]"
          >
            Sign in as {role === "admin" ? "Admin" : "Staff"}

            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</div>


);
}
