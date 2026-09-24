
import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#9DB4C0] p-6">

      {/* Decorative background */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[C2DFE3]/35 blur-3xl" />
      <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#5C6B73]/60 blur-3xl" />

      <div className="relative z-10 w-full max-w-md text-center">

        {/* 404 Card */}
        <div className="rounded-3xl border border-[#EAD5D8] bg-white px-6 py-8 shadow-xl shadow-[C2DFE3]/15 sm:px-10 sm:py-10">

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5C6B73] text-[#A96F7D] shadow-sm">
            <SearchX size={30} />
          </div>

          {/* 404 */}
          <p className="mt-6 text-6xl font-black tracking-tight text-[#A96F7D] sm:text-7xl">
            404
          </p>

          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[C2DFE3]" />

          {/* Message */}
          <h1 className="mt-5 text-2xl font-extrabold text-[#3F2930]">
            Page not found
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            The page you are looking for doesn't exist or may have been
            moved to another location.
          </p>

          {/* Action */}
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[C2DFE3] px-5 py-2.5 text-sm font-extrabold text-[#3F2930] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#D7A5B0] hover:shadow-md"
          >
            <Home size={17} />
            Go to dashboard
          </Link>

          <Link
            to="/"
            className="mx-auto mt-3 flex w-fit items-center gap-1.5 text-xs font-semibold text-[#A96F7D] transition hover:text-[#7A4D58]"
          >
            <ArrowLeft size={14} />
            Return home
          </Link>

        </div>

        {/* Small footer text */}
        <p className="mt-5 text-[11px] font-medium text-[#A88F95]">
          MediCare Management System
        </p>

      </div>
    </div>
  );
}
 