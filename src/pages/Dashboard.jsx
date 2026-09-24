import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarClock,
  IndianRupee,
  PackageCheck,
  Pill,
  Plus,
  Phone,
  Receipt,
  UserRound,
  Truck,
  XCircle,
  TrendingUp,
  Activity,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import { ExpiryBadge, StockBadge } from "../components/StatusBadge";

/* ============================================================
   HELPERS
============================================================ */

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/* ============================================================
   DASHBOARD
============================================================ */

export default function Dashboard() {
  const { data, stats, sales } = useApp();

  const [showAllSales, setShowAllSales] = useState(false);

  const medicines = Array.isArray(data?.medicines)
    ? data.medicines
    : [];

  const suppliers = Array.isArray(data?.suppliers)
    ? data.suppliers
    : [];

  const allSales = Array.isArray(sales) ? sales : [];

  /* ============================================================
     MEDICINE ATTENTION
  ============================================================ */

  const attentionItems = useMemo(() => {
    const today = new Date();

    const limit = new Date(today);
    limit.setDate(today.getDate() + 30);

    return medicines
      .filter((medicine) => {
        if (!medicine) return false;

        const quantity = Number(medicine.quantity || 0);
        const reorderLevel = Number(medicine.reorderLevel || 0);

        let expiry = null;

        if (medicine.expiryDate) {
          expiry = new Date(
            `${medicine.expiryDate}T23:59:59`
          );
        }

        const lowStock = quantity <= reorderLevel;

        const expiringSoon =
          expiry &&
          !Number.isNaN(expiry.getTime()) &&
          expiry <= limit;

        return lowStock || expiringSoon;
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.expiryDate || "9999-12-31"}T23:59:59`
        );

        const dateB = new Date(
          `${b.expiryDate || "9999-12-31"}T23:59:59`
        );

        return dateA - dateB;
      })
      .slice(0, 5);
  }, [medicines]);

  /* ============================================================
     DASHBOARD COUNTS
  ============================================================ */

  const lowStockCount = useMemo(() => {
    return medicines.filter(
      (medicine) =>
        Number(medicine.quantity || 0) <=
        Number(medicine.reorderLevel || 0)
    ).length;
  }, [medicines]);

  const outOfStockCount = useMemo(() => {
    return medicines.filter(
      (medicine) => Number(medicine.quantity || 0) <= 0
    ).length;
  }, [medicines]);

  const expiringSoonCount = useMemo(() => {
    const today = new Date();

    const limit = new Date(today);
    limit.setDate(today.getDate() + 30);

    return medicines.filter((medicine) => {
      if (!medicine.expiryDate) return false;

      const expiry = new Date(
        `${medicine.expiryDate}T23:59:59`
      );

      return (
        !Number.isNaN(expiry.getTime()) &&
        expiry <= limit
      );
    }).length;
  }, [medicines]);

  /* ============================================================
     INVENTORY VALUE
  ============================================================ */

  const inventoryValue = useMemo(() => {
    return medicines.reduce((total, medicine) => {
      const quantity = Number(medicine.quantity || 0);
      const unitPrice = Number(medicine.unitPrice || 0);

      return total + quantity * unitPrice;
    }, 0);
  }, [medicines]);

  /* ============================================================
     SALES DATA
  ============================================================ */

  const sortedSales = useMemo(() => {
    return [...allSales].sort((a, b) => {
      const dateA = new Date(
        a?.createdAt ||
          a?.date ||
          a?.timestamp ||
          0
      ).getTime();

      const dateB = new Date(
        b?.createdAt ||
          b?.date ||
          b?.timestamp ||
          0
      ).getTime();

      return dateB - dateA;
    });
  }, [allSales]);

  const displayedSales = showAllSales
    ? sortedSales
    : sortedSales.slice(0, 5);

  /* ============================================================
     SALES TOTALS
  ============================================================ */

  const totalSalesAmount = useMemo(() => {
    return allSales.reduce((total, sale) => {
      return (
        total +
        Number(
          sale?.total ??
            sale?.grandTotal ??
            sale?.amount ??
            sale?.totalAmount ??
            0
        )
      );
    }, 0);
  }, [allSales]);

  const todaySalesAmount = useMemo(() => {
    const today = new Date();

    return allSales.reduce((total, sale) => {
      const saleDate = new Date(
        sale?.createdAt ||
          sale?.date ||
          sale?.timestamp ||
          0
      );

      if (Number.isNaN(saleDate.getTime())) {
        return total;
      }

      const isToday =
        saleDate.getDate() === today.getDate() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear();

      if (!isToday) return total;

      return (
        total +
        Number(
          sale?.total ??
            sale?.grandTotal ??
            sale?.amount ??
            sale?.totalAmount ??
            0
        )
      );
    }, 0);
  }, [allSales]);

  /* ============================================================
     STAFF BILLING
  ============================================================ */

  const staffBillingAmount = useMemo(() => {
    return allSales
      .filter((sale) => {
        const staff =
          sale?.staffName ||
          sale?.createdBy ||
          sale?.billedBy ||
          sale?.role;

        return (
          Boolean(staff) &&
          String(sale?.role || "").toLowerCase() === "staff"
        );
      })
      .reduce((total, sale) => {
        return (
          total +
          Number(
            sale?.total ??
              sale?.grandTotal ??
              sale?.amount ??
              sale?.totalAmount ??
              0
          )
        );
      }, 0);
  }, [allSales]);

  /* ============================================================
     STAT CARD
  ============================================================ */

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    iconClass,
    valueClass = "text-slate-900",
  }) => (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-extrabold tracking-tight ${valueClass}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />

        <p className="text-xs font-medium text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );

  /* ============================================================
     RETURN
  ============================================================ */

  return (
    <div className="min-h-full space-y-7 bg-[#f8fafc] pb-10">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_6px_30px_rgba(15,23,42,0.05)]">
        {/* Background decoration */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-rose-100/50 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-7 px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-teal-700">
              <Activity size={13} />
              Pharmacy Management
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Good morning, Admin{" "}
              <span className="inline-block">👋</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Manage your medicines, monitor inventory, track
              sales and keep your pharmacy operations organized
              from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/medicines/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#115e59] hover:shadow-md"
            >
              <Plus size={17} />
              Add Medicine
            </Link>

            <Link
              to="/medicines"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              View Medicines
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

     {/* ======================================================
    STAT CARDS
====================================================== */}
<section className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

  <StatCard
    title="Total Medicines"
    value={stats?.totalMedicines ?? medicines.length}
    description="Medicines currently in inventory"
    icon={Pill}
    iconClass="bg-teal-50 text-teal-700"
  />

  <StatCard
    title="Low Stock"
    value={stats?.lowStock ?? lowStockCount}
    description="Medicines need stock attention"
    icon={AlertTriangle}
    iconClass="bg-amber-50 text-amber-600"
    valueClass="text-amber-600"
  />

  <StatCard
    title="Out of Stock"
    value={stats?.outOfStock ?? outOfStockCount}
    description="Medicines currently unavailable"
    icon={XCircle}
    iconClass="bg-red-50 text-red-600"
    valueClass="text-red-600"
  />

  <StatCard
    title="Expiring Soon"
    value={stats?.expiringSoon ?? expiringSoonCount}
    description="Expiring within next 30 days"
    icon={CalendarClock}
    iconClass="bg-rose-50 text-rose-600"
    valueClass="text-rose-600"
  />

</section>

{/* ======================================================
    SALES SUMMARY
====================================================== */}
<section>
  <div className="mb-4 flex items-end justify-between">
    <div>
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
        Sales Overview
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Track pharmacy revenue and billing activity
      </p>
    </div>

    <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 sm:flex">
      <TrendingUp size={19} />
    </div>
  </div>

  <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">

    {/* Today */}
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:rounded-2xl sm:p-5">
      <div className="flex items-center justify-between gap-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 sm:h-11 sm:w-11 sm:rounded-xl">
          <IndianRupee size={16} className="sm:h-[21px] sm:w-[21px]" />
        </div>

        <span className="rounded-full bg-teal-50 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-teal-700 sm:px-3 sm:py-1 sm:text-[10px]">
          Today
        </span>
      </div>

      <p className="mt-3 text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:mt-5 sm:text-xs sm:tracking-[0.08em]">
        Today's Sales
      </p>

      <p className="mt-1 truncate text-sm font-extrabold tracking-tight text-slate-900 sm:text-2xl">
        {formatCurrency(todaySalesAmount)}
      </p>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100 sm:mt-4">
        <div className="h-full w-2/3 rounded-full bg-teal-500" />
      </div>
    </div>

    {/* Total */}
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:rounded-2xl sm:p-5">
      <div className="flex items-center justify-between gap-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 sm:h-11 sm:w-11 sm:rounded-xl">
          <Receipt size={16} className="sm:h-[21px] sm:w-[21px]" />
        </div>

        <span className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-violet-600 sm:px-3 sm:py-1 sm:text-[10px]">
          All Time
        </span>
      </div>

      <p className="mt-3 text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:mt-5 sm:text-xs sm:tracking-[0.08em]">
        Total Sales
      </p>

      <p className="mt-1 truncate text-sm font-extrabold tracking-tight text-slate-900 sm:text-2xl">
        {formatCurrency(totalSalesAmount)}
      </p>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100 sm:mt-4">
        <div className="h-full w-full rounded-full bg-violet-500" />
      </div>
    </div>

    {/* Staff */}
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:rounded-2xl sm:p-5">
      <div className="flex items-center justify-between gap-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 sm:h-11 sm:w-11 sm:rounded-xl">
          <UserRound size={16} className="sm:h-[21px] sm:w-[21px]" />
        </div>

        <span className="rounded-full bg-sky-50 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-sky-600 sm:px-3 sm:py-1 sm:text-[10px]">
          Staff
        </span>
      </div>

      <p className="mt-3 text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:mt-5 sm:text-xs sm:tracking-[0.08em]">
        Staff Billing
      </p>

      <p className="mt-1 truncate text-sm font-extrabold tracking-tight text-slate-900 sm:text-2xl">
        {formatCurrency(staffBillingAmount)}
      </p>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100 sm:mt-4">
        <div className="h-full w-1/3 rounded-full bg-sky-500" />
      </div>
    </div>

  </div>
</section>
      {/* ======================================================
          BILLING HISTORY
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Receipt size={19} />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Customer Billing History
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Latest customer transactions
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {allSales.length}{" "}
            {allSales.length === 1 ? "Bill" : "Bills"}
          </span>
        </div>

        {allSales.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Receipt size={24} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              No billing history
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Customer bills will appear here after a sale is
              created.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE */}

            <div className="space-y-3 p-4 md:hidden">
              {displayedSales.map((sale, index) => {
                const customerName =
                  sale?.customerName ||
                  sale?.customer ||
                  sale?.name ||
                  "Walk-in Customer";

                const customerPhone =
                  sale?.customerPhone ||
                  sale?.phone ||
                  sale?.mobile ||
                  sale?.customerMobile ||
                  "";

                const amount = Number(
                  sale?.total ??
                    sale?.grandTotal ??
                    sale?.amount ??
                    sale?.totalAmount ??
                    0
                );

                const items = Array.isArray(sale?.items)
                  ? sale.items
                  : [];

                const saleDate =
                  sale?.createdAt ||
                  sale?.date ||
                  sale?.timestamp;

                return (
                  <div
                    key={
                      sale?.id ||
                      `${saleDate}-${index}`
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-200 hover:bg-teal-50/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                          <UserRound size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {customerName}
                          </p>

                          {customerPhone && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <Phone size={11} />
                              {customerPhone}
                            </p>
                          )}
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-extrabold text-teal-700">
                        {formatCurrency(amount)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Bill Date
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {formatDateTime(saleDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Items
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {items.length ||
                            sale?.itemCount ||
                            sale?.quantity ||
                            0}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Items
                    </th>

                    <th className="px-6 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {displayedSales.map((sale, index) => {
                    const customerName =
                      sale?.customerName ||
                      sale?.customer ||
                      sale?.name ||
                      "Walk-in Customer";

                    const customerPhone =
                      sale?.customerPhone ||
                      sale?.phone ||
                      sale?.mobile ||
                      sale?.customerMobile ||
                      "-";

                    const amount = Number(
                      sale?.total ??
                        sale?.grandTotal ??
                        sale?.amount ??
                        sale?.totalAmount ??
                        0
                    );

                    const items = Array.isArray(
                      sale?.items
                    )
                      ? sale.items
                      : [];

                    const saleDate =
                      sale?.createdAt ||
                      sale?.date ||
                      sale?.timestamp;

                    return (
                      <tr
                        key={
                          sale?.id ||
                          `${saleDate}-${index}`
                        }
                        className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                              <UserRound size={16} />
                            </div>

                            <p className="text-sm font-bold text-slate-800">
                              {customerName}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Phone size={13} />
                            {customerPhone}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                          {formatDateTime(saleDate)}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {items.length ||
                              sale?.itemCount ||
                              sale?.quantity ||
                              0}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-extrabold text-teal-700">
                            {formatCurrency(amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* VIEW MORE */}

            {allSales.length > 5 && (
              <div className="flex justify-center border-t border-slate-100 px-4 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setShowAllSales(
                      (previous) => !previous
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                >
                  {showAllSales
                    ? "Show Less"
                    : `View More (${allSales.length - 5} more)`}

                  <ArrowRight
                    size={14}
                    className={
                      showAllSales
                        ? "-rotate-90"
                        : "rotate-90"
                    }
                  />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ======================================================
          MEDICINE ATTENTION + QUICK ACTIONS
      ====================================================== */}

      <section className="grid gap-5 lg:grid-cols-3">

        {/* MEDICINE ATTENTION */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] lg:col-span-2">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Medicine Attention
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Medicines that need your attention
              </p>
            </div>

            <Link
              to="/medicines"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-teal-700 transition hover:bg-teal-50"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          {attentionItems.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <PackageCheck size={24} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-800">
                Everything looks good
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                No medicines currently require attention.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {attentionItems.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Pill size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {medicine.name ||
                          "Unnamed Medicine"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Quantity:{" "}
                        <span className="font-bold text-slate-700">
                          {medicine.quantity ?? 0}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StockBadge medicine={medicine} />
                    <ExpiryBadge medicine={medicine} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

          <div className="border-b border-slate-100 px-5 py-5">
            <h2 className="text-base font-extrabold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Frequently used pharmacy actions
            </p>
          </div>

          <div className="space-y-2.5 p-4">

            {/* Add Medicine */}

            <Link
              to="/medicines/new"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-teal-200 hover:bg-teal-50/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
                <Plus size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">
                  Add Medicine
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Add a new medicine
                </p>
              </div>

              <ArrowRight
                size={15}
                className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-teal-700"
              />
            </Link>

            {/* Manage Medicines */}

            <Link
              to="/medicines"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-violet-200 hover:bg-violet-50/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Pill size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">
                  Manage Medicines
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Update stock and medicine details
                </p>
              </div>

              <ArrowRight
                size={15}
                className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600"
              />
            </Link>

            {/* Suppliers */}

            <Link
              to="/suppliers"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-sky-200 hover:bg-sky-50/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Truck size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">
                  Manage Suppliers
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  View and manage suppliers
                </p>
              </div>

              <ArrowRight
                size={15}
                className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-600"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          BOTTOM INFORMATION
      ====================================================== */}

      <section className="grid grid-cols-3 gap-2 sm:gap-4">

  {/* Suppliers */}

  <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:rounded-2xl sm:p-5">
    <div className="flex items-center justify-between gap-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 sm:h-11 sm:w-11 sm:rounded-xl">
        <Truck size={16} className="sm:h-5 sm:w-5" />
      </div>

      <Link
        to="/suppliers"
        className="text-[8px] font-bold text-teal-700 hover:underline sm:text-xs"
      >
        View
      </Link>
    </div>

    <p className="mt-3 text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:mt-5 sm:text-[11px] sm:tracking-[0.08em]">
      Suppliers
    </p>

    <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-2xl">
      {suppliers.length}
    </p>

    <p className="mt-1 text-[8px] leading-4 text-slate-500 sm:text-xs">
      Suppliers available in the system
    </p>
  </div>


  {/* Inventory */}

  <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:rounded-2xl sm:p-5">
    <div className="flex items-center justify-between">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 sm:h-11 sm:w-11 sm:rounded-xl">
        <Boxes size={16} className="sm:h-5 sm:w-5" />
      </div>
    </div>

    <p className="mt-3 text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:mt-5 sm:text-[11px] sm:tracking-[0.08em]">
      Inventory Value
    </p>

    <p className="mt-1 truncate text-sm font-extrabold text-slate-900 sm:text-2xl">
      {formatCurrency(inventoryValue)}
    </p>

    <p className="mt-1 text-[8px] leading-4 text-slate-500 sm:text-xs">
      Current value of medicine stock
    </p>
  </div>


  {/* Expiry */}

  <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:rounded-2xl sm:p-5">
    <div className="flex items-center justify-between gap-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 sm:h-11 sm:w-11 sm:rounded-xl">
        <CalendarClock
          size={16}
          className="sm:h-5 sm:w-5"
        />
      </div>

      <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[7px] font-bold text-rose-600 sm:px-2.5 sm:py-1 sm:text-[10px]">
        30 Days
      </span>
    </div>

    <p className="mt-3 text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:mt-5 sm:text-[11px] sm:tracking-[0.08em]">
      Expiry Monitoring
    </p>

    <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-2xl">
      {expiringSoonCount}
    </p>

    <p className="mt-1 text-[8px] leading-4 text-slate-500 sm:text-xs">
      Medicines expiring within 30 days
    </p>
  </div>

</section>
    </div>
  );
}