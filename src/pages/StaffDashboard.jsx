import { useMemo, useState } from "react";
import {
  Activity,
  LogOut,
  Plus,
  Minus,
  Search,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Package,
  UserRound,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function StaffDashboard() {
  const { data, logout } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(data.medicines.map((m) => m.category).filter(Boolean))),
    ];
  }, [data.medicines]);

  const medicines = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.medicines.filter((medicine) => {
      const matchesQuery =
        !q ||
        medicine.name.toLowerCase().includes(q) ||
        medicine.code.toLowerCase().includes(q) ||
        medicine.manufacturer.toLowerCase().includes(q);

      const matchesCategory =
        category === "all" || medicine.category === category;

      const notExpired =
        new Date(`${medicine.expiryDate}T23:59:59`) >= new Date();

      return matchesQuery && matchesCategory && notExpired;
    });
  }, [data.medicines, query, category]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const addToCart = (medicine) => {
    if (Number(medicine.quantity) <= 0) return;

    setCart((current) => {
      const existing = current.find(
        (item) => item.medicineId === medicine.id
      );

      if (existing) {
        return current.map((item) =>
          item.medicineId === medicine.id
            ? {
                ...item,
                quantity: Math.min(
                  Number(item.quantity) + 1,
                  Number(medicine.quantity)
                ),
              }
            : item
        );
      }

      return [
        ...current,
        {
          medicineId: medicine.id,
          name: medicine.name,
          code: medicine.code,
          unitPrice: Number(medicine.unitPrice),
          quantity: 1,
        },
      ];
    });
  };

  const changeQuantity = (medicineId, amount) => {
    const medicine = data.medicines.find((m) => m.id === medicineId);
    if (!medicine) return;

    setCart((current) =>
      current
        .map((item) =>
          item.medicineId === medicineId
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(0, Number(item.quantity) + amount),
                  Number(medicine.quantity)
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (medicineId) => {
    setCart((current) =>
      current.filter((item) => item.medicineId !== medicineId)
    );
  };

  const clearCart = () => setCart([]);

  const createBill = () => {
    if (!cart.length) return;
    navigate("/staff/create-bill", { state: { cart } });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#9DB4C0]">
      <header className="sticky top-0 z-30 border-b border-[#EAD5D8] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1450px] items-center justify-between gap-3 px-3 sm:min-h-20 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[C2DFE3] text-[#4A3037] shadow-sm">
              <Activity size={21} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-black text-[#3F2930]">MediCare</p>
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#A88F95] sm:block">
                Staff Billing Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl bg-[#9DB4C0] px-3 py-2 sm:flex">
              <UserRound size={15} className="text-[#A96F7D]" />
              <span className="text-xs font-bold text-[#5F4A50]">Staff</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAD5D8] bg-white px-3 py-2 text-xs font-bold text-[#6F5A60] transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1450px] px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A96F7D]">
              Staff workspace
            </p>
            <h1 className="mt-1 text-2xl font-black text-[#3F2930] sm:text-3xl">
              Medicines & Billing
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Select medicines, review your cart, and create a customer bill.
            </p>
          </div>

          <button
            type="button"
            onClick={createBill}
            disabled={!cart.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[C2DFE3] px-4 py-2.5 text-sm font-extrabold text-[#3F2930] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#D7A5B0] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <ShoppingCart size={17} />
            Create Bill ({cartCount})
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-2xl border border-[#EAD5D8] bg-white shadow-sm">
            <div className="border-b border-[#EAD5D8] p-4 sm:p-5">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search medicine, code or manufacturer..."
                    className="h-11 w-full rounded-xl border border-[#EAD5D8] bg-[#9DB4C0DFD] pl-10 pr-4 text-sm outline-none transition focus:border-[#D7A5B0] focus:ring-2 focus:ring-[C2DFE3]/25"
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 rounded-xl border border-[#EAD5D8] bg-white px-3 text-sm font-semibold text-[#5F4A50] outline-none focus:border-[#D7A5B0]"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item === "all" ? "All categories" : item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
              {medicines.map((medicine) => {
                const inCart = cart.find(
                  (item) => item.medicineId === medicine.id
                );
                const available = Number(medicine.quantity);
                const soldOut = available <= 0;

                return (
                  <article
                    key={medicine.id}
                    className="rounded-2xl border border-[#EAD5D8] bg-[#9DB4C0DFD] p-4 transition hover:-translate-y-0.5 hover:border-[C2DFE3] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#5C6B73] text-[#8E5A68]">
                        <Package size={20} />
                      </div>
                      <span className="rounded-lg bg-[#9DB4C0] px-2 py-1 text-[10px] font-bold text-[#8E5A68]">
                        {medicine.category || "Medicine"}
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-sm font-black text-[#3F2930]">
                      {medicine.name}
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {medicine.code} • {medicine.manufacturer}
                    </p>

                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-base font-black text-[#6A414B]">
                          {money(medicine.unitPrice)}
                        </p>
                        <p
                          className={`mt-0.5 text-[11px] font-semibold ${
                            soldOut ? "text-rose-500" : "text-slate-500"
                          }`}
                        >
                          Stock: {available}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(medicine)}
                        disabled={soldOut || Number(inCart?.quantity || 0) >= available}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[C2DFE3] px-3 py-2 text-xs font-extrabold text-[#3F2930] transition hover:bg-[#D7A5B0] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <Plus size={15} />
                        {inCart ? `Added ${inCart.quantity}` : "Add"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {!medicines.length && (
              <div className="border-t border-[#EAD5D8] px-5 py-14 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#5C6B73] text-[#A96F7D]">
                  <Search size={22} />
                </div>
                <p className="mt-4 text-sm font-extrabold text-[#3F2930]">
                  No medicines found
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                  className="mt-3 text-xs font-bold text-[#A96F7D] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-[#EAD5D8] bg-white shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-[#EAD5D8] p-4 sm:p-5">
              <div>
                <h2 className="text-base font-black text-[#3F2930]">Current Cart</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {cartCount} item{cartCount === 1 ? "" : "s"} selected
                </p>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="max-h-[430px] space-y-3 overflow-y-auto p-4 sm:p-5">
              {!cart.length ? (
                <div className="py-10 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#9DB4C0] text-[#A96F7D]">
                    <ShoppingCart size={24} />
                  </div>
                  <p className="mt-3 text-sm font-bold text-[#3F2930]">
                    Cart is empty
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add medicines from the list to start a bill.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.medicineId}
                    className="rounded-xl border border-[#EAD5D8] bg-[#9DB4C0DFD] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#3F2930]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {money(item.unitPrice)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.medicineId)}
                        className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-lg border border-[#EAD5D8] bg-white">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.medicineId, -1)}
                          className="grid h-8 w-8 place-items-center text-slate-500 hover:bg-[#9DB4C0]"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-[#3F2930]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.medicineId, 1)}
                          className="grid h-8 w-8 place-items-center text-slate-500 hover:bg-[#9DB4C0]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-black text-[#6A414B]">
                        {money(item.quantity * item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#EAD5D8] p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">Subtotal</span>
                <span className="text-xl font-black text-[#3F2930]">
                  {money(cartTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={createBill}
                disabled={!cart.length}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[C2DFE3] px-4 text-sm font-extrabold text-[#3F2930] transition hover:bg-[#D7A5B0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Customer Details
                <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Prevent accidental stale overlay/close button from trapping clicks. */}
      <button
        type="button"
        aria-label="Close unused dialog"
        className="hidden"
        onClick={() => {}}
      >
        <X size={1} />
      </button>
    </div>
  );
}
