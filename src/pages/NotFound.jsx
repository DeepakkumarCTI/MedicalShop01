import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="text-center">
        <p className="text-6xl font-black text-teal-600">404</p>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-900">Page not found</h1>
        <Link to="/" className="mt-5 inline-flex text-sm font-bold text-teal-600">Go to dashboard</Link>
      </div>
    </div>
  );
}
