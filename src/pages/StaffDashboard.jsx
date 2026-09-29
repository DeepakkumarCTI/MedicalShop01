import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LogOut,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import defaultMedicineImage from "../assets/images/medicinesyrup.png";
import logo from "../assets/logo.png";

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

  const medicinesData = data?.medicines || [];

  const categories = useMemo(() => {
    return [
      "all",
      ...Array.from(
        new Set(
          medicinesData
            .map((medicine) => medicine.category)
            .filter(Boolean)
        )
      ),
    ];
  }, [medicinesData]);

  const medicines = useMemo(() => {
    const q = query.trim().toLowerCase();

    return medicinesData.filter((medicine) => {
      const medicineName = String(medicine.name || "").toLowerCase();
      const medicineCode = String(medicine.code || "").toLowerCase();
      const manufacturer = String(
        medicine.manufacturer || ""
      ).toLowerCase();

      const matchesQuery =
        !q ||
        medicineName.includes(q) ||
        medicineCode.includes(q) ||
        manufacturer.includes(q);

      const matchesCategory =
        category === "all" ||
        medicine.category === category;

      const notExpired =
        !medicine.expiryDate ||
        new Date(`${medicine.expiryDate}T23:59:59`) >=
        new Date();

      return matchesQuery && matchesCategory && notExpired;
    });
  }, [medicinesData, query, category]);

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity) *
      Number(item.unitPrice),
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const addToCart = (medicine) => {
    if (Number(medicine.quantity) <= 0) {
      return;
    }

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
    const medicine = medicinesData.find(
      (item) => item.id === medicineId
    );

    if (!medicine) return;

    setCart((current) =>
      current
        .map((item) =>
          item.medicineId === medicineId
            ? {
              ...item,
              quantity: Math.min(
                Math.max(
                  0,
                  Number(item.quantity) + amount
                ),
                Number(medicine.quantity)
              ),
            }
            : item
        )
        .filter((item) => Number(item.quantity) > 0)
    );
  };

  const removeFromCart = (medicineId) => {
    setCart((current) =>
      current.filter(
        (item) => item.medicineId !== medicineId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createBill = () => {
    if (!cart.length) return;

    navigate("/staff/create-bill", {
      state: { cart },
    });
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-[#DCE9ED] via-[#F2F7F8] to-[#C2DFE3] text-[#263238]">
      {/* Background gradient decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {/* Top-left blue glow */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#7FA6B5]/45 via-[#9DB4C0]/30 to-transparent blur-[110px]" />

        {/* Right-side aqua glow */}
        <div className="absolute -right-40 top-[15%] h-[520px] w-[520px] rounded-full bg-gradient-to-bl from-[#8CCFD0]/45 via-[#C2DFE3]/40 to-transparent blur-[120px]" />

        {/* Bottom teal glow */}
        <div className="absolute -bottom-48 left-[20%] h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-[#5C6B73]/20 via-[#9DB4C0]/25 to-transparent blur-[120px]" />

        {/* Soft highlight */}
        <div className="absolute right-[25%] top-[-120px] h-[350px] w-[350px] rounded-full bg-white/70 blur-[110px]" />

        {/* Subtle center gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#5C6B73]/[0.04]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 shadow-[0_4px_20px_rgba(38,50,56,0.08)] backdrop-blur-2xl">
          <div className="mx-auto flex min-h-[68px] max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Brand */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden sm:h-16 sm:w-16">
                <img
                  src={logo}
                  alt="MediCare Logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[17px] font-black tracking-tight text-[#263238] sm:text-lg">
                  MediCare
                </h1>

                <p className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-[#71858D] sm:block">
                  Pharmacy Management
                </p>
              </div>
            </div>

            {/* Header right */}
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-white/80 bg-gradient-to-br from-white/95 to-[#E8F1F4]/90 px-3 py-2 shadow-sm sm:flex">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#DCE9ED] to-[#C2DFE3] text-[#526970]">
                  <UserRound size={14} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#82949A]">
                    Logged in as
                  </p>

                  <p className="text-xs font-black text-[#405157]">
                    Staff
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E3D8DA] bg-white/90 px-3 text-xs font-bold text-[#6C5960] transition duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 sm:px-4"
              >
                <LogOut size={15} />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto max-w-[1480px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          {/* Page intro */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white/95 via-white/85 to-[#E8F1F4]/90 shadow-[0_12px_35px_rgba(38,50,56,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#DCE9ED] to-[#C2DFE3] text-[#526970] shadow-sm sm:grid">
                  <ShoppingCart size={22} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#D5E5E8] bg-gradient-to-r from-[#EAF3F5] to-[#DCE9ED] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#526970]">
                      Staff Workspace
                    </span>

                    {cart.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#F7E9EC] to-[#F2DDE2] px-2.5 py-1 text-[9px] font-black text-[#8A5965]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B97987]" />
                        {cartCount} item
                        {cartCount === 1 ? "" : "s"} in cart
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#263238] sm:text-3xl">
                    Medicines & Billing
                  </h2>

                  <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#71838A] sm:text-sm">
                    Search medicines, select the required
                    quantity and continue to create a
                    customer bill.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={createBill}
                disabled={!cart.length}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C2DFE3] via-[#B5D8DD] to-[#A7CFD5] px-5 text-xs font-black text-[#34464B] shadow-[0_5px_14px_rgba(82,105,112,0.12)] transition duration-200 hover:-translate-y-0.5 hover:from-[#B2D4D9] hover:to-[#94C5CC] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 sm:text-sm"
              >
                <ShoppingCart size={16} />
                Create Bill

                {cartCount > 0 && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-[#526970] px-1.5 py-0.5 text-[9px] text-white">
                    {cartCount}
                  </span>
                )}

                <ArrowRight size={15} />
              </button>
            </div>

            {/* Small stats */}
            <div className="grid border-t border-[#DCE7E9]/80 sm:grid-cols-3">
              <DashboardStat
                label="Available Medicines"
                value={medicinesData.length}
              />

              <DashboardStat
                label="Filtered Results"
                value={medicines.length}
                border
              />

              <DashboardStat
                label="Current Cart"
                value={cartCount}
                border
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* Medicines */}
            <section className="min-w-0 overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white/95 via-white/90 to-[#EAF2F4]/90 shadow-[0_12px_35px_rgba(38,50,56,0.08)] backdrop-blur-xl">
              {/* Search header */}
              <div className="border-b border-[#DCE7E9]/80 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-[#34464B]">
                      Medicine Inventory
                    </h3>

                    <p className="mt-0.5 text-[11px] text-[#71838A]">
                      Select medicines to add them to
                      the current bill.
                    </p>
                  </div>

                  <div className="hidden items-center rounded-lg bg-gradient-to-r from-[#EDF4F5] to-[#E3EEF0] px-2.5 py-1.5 text-[10px] font-bold text-[#61767D] sm:flex">
                    {medicines.length} results
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  {/* Search */}
                  <div className="relative min-w-0 flex-1">
                    <Search
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82969D]"
                    />

                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search medicine, code or manufacturer..."
                      className="h-11 w-full rounded-xl border border-[#D3E1E4] bg-white/85 pl-10 pr-4 text-xs font-medium text-[#35464B] outline-none transition duration-200 placeholder:text-[#91A3A9] focus:border-[#8DB8C1] focus:bg-white focus:ring-4 focus:ring-[#C2DFE3]/40 sm:text-sm"
                    />

                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 grid -translate-y-1/2 place-items-center rounded-md p-1 text-[#98A5AA] transition hover:bg-[#EDF2F3] hover:text-[#596B71]"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 rounded-xl border border-[#D3E1E4] bg-white/85 px-3 text-xs font-bold text-[#53666C] outline-none transition focus:border-[#8DB8C1] focus:bg-white sm:min-w-[165px] sm:text-sm"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item === "all" ? "All categories" : item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Medicine cards */}
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
                {medicines.map((medicine) => {
                  const inCart = cart.find(
                    (item) => item.medicineId === medicine.id
                  );

                  const available = Math.max(
                    0,
                    Number(medicine.quantity || 0)
                  );

                  const soldOut = available <= 0;

                  const maxReached =
                    Number(inCart?.quantity || 0) >= available;

                  return (
                    <article
                      key={medicine.id}
                      className="group relative overflow-hidden rounded-2xl border border-[#DCE7E9] bg-gradient-to-br from-white via-[#FAFCFC] to-[#EEF5F6] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#AFCFD5] hover:from-white hover:to-[#F2FAFB] hover:shadow-[0_10px_28px_rgba(70,90,96,0.12)]"
                    >
                      {/* Selected indicator */}
                      {inCart && (
                        <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-r from-[#526970] to-[#3F5961] px-2.5 py-1.5 text-[8px] font-black text-white">
                          IN CART
                        </div>
                      )}

                      {/* Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#E0E9EB] bg-white p-1.5 transition group-hover:border-[#BCD9DD] sm:h-16 sm:w-16">
                          <img
                            src={
                              medicine.image ||
                              defaultMedicineImage
                            }
                            alt={medicine.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                defaultMedicineImage;
                            }}
                          />
                        </div>

                        <span className="max-w-[120px] truncate rounded-lg bg-gradient-to-r from-[#EDF3F4] to-[#E2ECEE] px-2 py-1 text-[9px] font-bold text-[#63777E]">
                          {medicine.category || "Medicine"}
                        </span>
                      </div>

                      {/* Medicine name */}
                      <h4 className="mt-4 min-h-[40px] text-sm font-black leading-5 text-[#2E3D42]">
                        {medicine.name}
                      </h4>

                      {/* Code / Manufacturer */}
                      <div className="mt-1.5 min-h-[32px]">
                        <p className="truncate text-[10px] font-semibold text-[#82949A]">
                          {medicine.code || "No code"}
                        </p>

                        <p className="truncate text-[10px] text-[#91A1A6]">
                          {medicine.manufacturer ||
                            "Manufacturer unavailable"}
                        </p>
                      </div>

                      {/* Price / Stock */}
                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#E0E9EB] pt-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wide text-[#82949A]">
                            Unit Price
                          </p>

                          <p className="mt-0.5 text-base font-black text-[#405D66]">
                            {money(medicine.unitPrice)}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${soldOut
                                  ? "bg-rose-400"
                                  : available <= 5
                                    ? "bg-amber-400"
                                    : "bg-emerald-400"
                                }`}
                            />

                            <p
                              className={`text-[10px] font-bold ${soldOut
                                  ? "text-rose-500"
                                  : available <= 5
                                    ? "text-amber-600"
                                    : "text-[#6F858C]"
                                }`}
                            >
                              {soldOut
                                ? "Out of stock"
                                : `${available} in stock`}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(medicine)}
                          disabled={soldOut || maxReached}
                          className="inline-flex min-w-[78px] items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C2DFE3] to-[#A9D1D7] px-3 py-2 text-[10px] font-black text-[#35474C] transition duration-200 hover:from-[#B2D4D9] hover:to-[#91C3CB] disabled:cursor-not-allowed disabled:from-[#E9EEEF] disabled:to-[#E9EEEF] disabled:text-[#A3AFB3] sm:text-xs"
                        >
                          {inCart ? (
                            <>
                              <CheckCircle2 size={14} />
                              {inCart.quantity}
                            </>
                          ) : (
                            <>
                              <Plus size={14} />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Empty search */}
              {!medicines.length && (
                <div className="border-t border-[#E0E9EB] px-5 py-16 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#EAF3F5] to-[#DCE9ED] text-[#71838A]">
                    <Search size={25} />
                  </div>

                  <h4 className="mt-4 text-sm font-black text-[#35464B]">
                    No medicines found
                  </h4>

                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#71838A]">
                    Try searching with another medicine
                    name, code, manufacturer or category.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 rounded-lg px-3 py-2 text-xs font-black text-[#607E86] transition hover:bg-[#EAF3F5] hover:text-[#526970]"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </section>

            {/* Cart */}
            <aside className="h-fit overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white/95 via-white/90 to-[#E7F1F3]/95 shadow-[0_12px_35px_rgba(38,50,56,0.08)] backdrop-blur-xl lg:sticky lg:top-[88px]">
              {/* Cart header */}
              <div className="border-b border-[#DCE7E9]/80 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#DCE9ED] to-[#C2DFE3] text-[#526970]">
                      <ShoppingCart size={18} />
                    </div>

                    <div>
                      <h3 className="text-base font-black text-[#34464B]">
                        Current Cart
                      </h3>

                      <p className="mt-0.5 text-[10px] text-[#71838A]">
                        {cartCount} item
                        {cartCount === 1 ? "" : "s"} selected
                      </p>
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="rounded-lg px-2 py-1.5 text-[10px] font-black text-rose-500 transition hover:bg-rose-50"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Cart items */}
              <div className="max-h-[455px] space-y-3 overflow-y-auto p-4 sm:p-5">
                {!cart.length ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#EEF5F6] to-[#DCE9ED] text-[#82969D]">
                      <ShoppingCart size={25} />
                    </div>

                    <h4 className="mt-4 text-sm font-black text-[#405157]">
                      Your cart is empty
                    </h4>

                    <p className="mx-auto mt-1.5 max-w-[230px] text-[11px] leading-5 text-[#7F9197]">
                      Select medicines from the inventory
                      to add them here.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const medicine = medicinesData.find(
                      (medicineItem) =>
                        medicineItem.id === item.medicineId
                    );

                    const stock = Number(
                      medicine?.quantity || 0
                    );

                    const maxReached =
                      Number(item.quantity) >= stock;

                    return (
                      <div
                        key={item.medicineId}
                        className="rounded-xl border border-[#DCE7E9] bg-gradient-to-br from-white to-[#F2F7F8] p-3.5 transition hover:border-[#BCD9DD]"
                      >
                        {/* Item header */}
                        <div className="flex items-start gap-2">
                          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-[#E0E9EB] bg-white p-1">
                            <img
                              src={
                                medicine?.image ||
                                defaultMedicineImage
                              }
                              alt={item.name}
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                  defaultMedicineImage;
                              }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-black text-[#35464B]">
                              {item.name}
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium text-[#82949A]">
                              {item.code || "No code"} •{" "}
                              {money(item.unitPrice)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.medicineId)
                            }
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[#91A1A6] transition hover:bg-rose-50 hover:text-rose-500"
                            title="Remove medicine"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Quantity */}
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center overflow-hidden rounded-lg border border-[#D3E1E4] bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(
                                  item.medicineId,
                                  -1
                                )
                              }
                              className="grid h-8 w-8 place-items-center text-[#75868C] transition hover:bg-[#EDF3F4] hover:text-[#455960]"
                            >
                              <Minus size={13} />
                            </button>

                            <span className="grid h-8 w-8 place-items-center border-x border-[#E2E9EB] text-xs font-black text-[#35464B]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(
                                  item.medicineId,
                                  1
                                )
                              }
                              disabled={maxReached}
                              className="grid h-8 w-8 place-items-center text-[#75868C] transition hover:bg-[#EDF3F4] hover:text-[#455960] disabled:cursor-not-allowed disabled:text-[#C5CED1]"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <p className="text-sm font-black text-[#405D66]">
                            {money(
                              Number(item.quantity) *
                              Number(item.unitPrice)
                            )}
                          </p>
                        </div>

                        {maxReached && (
                          <p className="mt-2 text-right text-[9px] font-bold text-amber-600">
                            Maximum available stock reached
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Cart summary */}
              <div className="border-t border-[#DCE7E9]/80 bg-gradient-to-br from-[#F8FBFB] to-[#EAF2F4] p-4 sm:p-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#71838A]">
                      Items
                    </span>

                    <span className="text-xs font-black text-[#52666D]">
                      {cartCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#71838A]">
                      Subtotal
                    </span>

                    <span className="text-lg font-black text-[#35464B]">
                      {money(cartTotal)}
                    </span>
                  </div>
                </div>

                <div className="my-4 border-t border-dashed border-[#D3E1E4]" />

                <button
                  type="button"
                  onClick={createBill}
                  disabled={!cart.length}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C2DFE3] via-[#B5D8DD] to-[#A7CFD5] px-4 text-xs font-black text-[#34464B] shadow-[0_5px_14px_rgba(82,105,112,0.12)] transition duration-200 hover:-translate-y-0.5 hover:from-[#B2D4D9] hover:to-[#94C5CC] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 sm:text-sm"
                >
                  Continue to Customer Details
                  <ArrowRight size={15} />
                </button>

                <p className="mt-3 text-center text-[9px] leading-4 text-[#82949A]">
                  GST and customer details can be
                  completed on the next step.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD STAT
========================================================= */

function DashboardStat({
  label,
  value,
  border = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-5 py-5 sm:px-6 sm:py-6 ${border
          ? "border-t border-[#DCE7E9] sm:border-l sm:border-t-0"
          : ""
        }`}
    >
      <span className="text-sm font-extrabold uppercase tracking-wide text-[#526970] sm:text-base">
        {label}
      </span>

      <span
        className={`text-2xl font-black sm:text-3xl ${label === "Available Medicines"
            ? "text-[#0F766E]"
            : label === "Filtered Results"
              ? "text-[#2563EB]"
              : "text-[#C2410C]"
          }`}
      >
        {value}
      </span>
    </div>
  );
}