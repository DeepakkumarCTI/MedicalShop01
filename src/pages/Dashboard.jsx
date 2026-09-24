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
} from "lucide-react";

import { useApp } from "../context/AppContext";
import { ExpiryBadge, StockBadge } from "../components/StatusBadge";

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
      expiry = new Date(`${medicine.expiryDate}T23:59:59`);
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

return ( <div className="space-y-6 pb-8">


  {/* ======================================================
      HERO
  ====================================================== */}

  <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[C2DFE3] via-[#E8C0C6] to-[#5C6B73] px-5 py-6 text-[#3F2930] shadow-lg shadow-[C2DFE3]/20 sm:px-7 sm:py-7">
    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/30 blur-3xl" />

    <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/20 blur-3xl" />

    <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="mb-1 text-sm font-medium text-[#6A414B]">
          Pharmacy Management
        </p>

        <h1 className="text-2xl font-extrabold tracking-tight text-[#3F2930] sm:text-3xl">
          Good morning, Admin 👋
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#65474E]">
          Monitor your medicines, inventory, sales and customer
          billing from one place.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/medicines/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#6A414B] shadow-sm transition hover:bg-[#9DB4C0]"
        >
          <Plus size={17} />
          Add Medicine
        </Link>

        <Link
          to="/medicines"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/25 px-4 py-2.5 text-sm font-bold text-[#4A3037] backdrop-blur transition hover:bg-white/40"
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

  <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">

    {/* Total Medicines */}
    <div className="rounded-2xl border border-[#EAD5D8] bg-white p-4 shadow-sm transition hover:border-[C2DFE3] hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total Medicines
          </p>

          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {stats?.totalMedicines ?? medicines.length}
          </p>
        </div>

        <div className="rounded-xl bg-[#5C6B73] p-2.5 text-[#A96F7D]">
          <Pill size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Medicines in inventory
      </p>
    </div>

    {/* Low Stock */}
    <div className="rounded-2xl border border-[#EAD5D8] bg-white p-4 shadow-sm transition hover:border-[C2DFE3] hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Low Stock
          </p>

          <p className="mt-2 text-2xl font-extrabold text-[#A96F7D]">
            {stats?.lowStock ?? lowStockCount}
          </p>
        </div>

        <div className="rounded-xl bg-[#5C6B73] p-2.5 text-[#A96F7D]">
          <AlertTriangle size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Need stock attention
      </p>
    </div>

    {/* Out Of Stock */}
    <div className="rounded-2xl border border-[#EAD5D8] bg-white p-4 shadow-sm transition hover:border-[C2DFE3] hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Out of Stock
          </p>

          <p className="mt-2 text-2xl font-extrabold text-[#9A626E]">
            {stats?.outOfStock ?? outOfStockCount}
          </p>
        </div>

        <div className="rounded-xl bg-[#9DB4C0] p-2.5 text-[#9A626E]">
          <XCircle size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Currently unavailable
      </p>
    </div>

    {/* Expiring Soon */}
    <div className="rounded-2xl border border-[#EAD5D8] bg-white p-4 shadow-sm transition hover:border-[C2DFE3] hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Expiring Soon
          </p>

          <p className="mt-2 text-2xl font-extrabold text-[#B87887]">
            {stats?.expiringSoon ?? expiringSoonCount}
          </p>
        </div>

        <div className="rounded-xl bg-[#5C6B73] p-2.5 text-[#B87887]">
          <CalendarClock size={20} />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Within the next 30 days
      </p>
    </div>
  </section>

  {/* ======================================================
      SALES SUMMARY
  ====================================================== */}

  <section>
    <div className="mb-3 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">
          Sales Summary
        </h2>

        <p className="text-xs text-slate-500">
          Overview of your pharmacy sales
        </p>
      </div>

      <Receipt size={20} className="text-[#B87887]" />
    </div>

    <div className="grid grid-cols-3 gap-2 sm:gap-4">

      {/* Today's Sales */}
      <div className="rounded-2xl border border-[#EAD5D8] bg-white p-3 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-1">
          <div className="rounded-lg bg-[#5C6B73] p-2 text-[#A96F7D] sm:rounded-xl sm:p-3">
            <IndianRupee size={17} className="sm:h-[21px] sm:w-[21px]" />
          </div>

          <span className="rounded-full bg-[#5C6B73] px-1.5 py-0.5 text-[8px] font-bold text-[#7A4D58] sm:px-2.5 sm:py-1 sm:text-[11px]">
            Today
          </span>
        </div>

        <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
          Today's Sales
        </p>

        <p className="mt-1 truncate text-base font-extrabold text-slate-900 sm:text-2xl">
          {formatCurrency(todaySalesAmount)}
        </p>
      </div>

      {/* Total Sales */}
      <div className="rounded-2xl border border-[#EAD5D8] bg-white p-3 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-1">
          <div className="rounded-lg bg-[C2DFE3] p-2 text-[#5E3C45] sm:rounded-xl sm:p-3">
            <Receipt size={17} className="sm:h-[21px] sm:w-[21px]" />
          </div>

          <span className="rounded-full bg-[C2DFE3]/50 px-1.5 py-0.5 text-[8px] font-bold text-[#6A414B] sm:px-2.5 sm:py-1 sm:text-[11px]">
            All Time
          </span>
        </div>

        <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
          Total Sales
        </p>

        <p className="mt-1 truncate text-base font-extrabold text-slate-900 sm:text-2xl">
          {formatCurrency(totalSalesAmount)}
        </p>
      </div>

      {/* Staff Billing */}
      <div className="rounded-2xl border border-[#EAD5D8] bg-white p-3 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-1">
          <div className="rounded-lg bg-[#9DB4C0] p-2 text-[#A96F7D] sm:rounded-xl sm:p-3">
            <UserRound size={17} className="sm:h-[21px] sm:w-[21px]" />
          </div>

          <span className="rounded-full bg-[#9DB4C0] px-1.5 py-0.5 text-[8px] font-bold text-[#7A4D58] sm:px-2.5 sm:py-1 sm:text-[11px]">
            Staff
          </span>
        </div>

        <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
          Staff Billing
        </p>

        <p className="mt-1 truncate text-base font-extrabold text-slate-900 sm:text-2xl">
          {formatCurrency(staffBillingAmount)}
        </p>
      </div>
    </div>
  </section>

  {/* ======================================================
      CUSTOMER BILLING HISTORY
  ====================================================== */}

  <section className="rounded-2xl border border-[#EAD5D8] bg-white shadow-sm">

    <div className="flex flex-col gap-3 border-b border-[#F0E2E4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#5C6B73] p-2 text-[#A96F7D]">
            <Receipt size={18} />
          </div>

          <h2 className="text-base font-extrabold text-slate-900">
            Customer Billing History
          </h2>
        </div>

        <p className="mt-1 pl-10 text-xs text-slate-500">
          Showing the latest customer transactions
        </p>
      </div>

      <span className="w-fit rounded-full bg-[#9DB4C0] px-3 py-1 text-xs font-bold text-[#7A4D58]">
        {allSales.length}{" "}
        {allSales.length === 1 ? "Bill" : "Bills"}
      </span>
    </div>

    {allSales.length === 0 ? (
      <div className="px-5 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#9DB4C0] text-[#B87887]">
          <Receipt size={22} />
        </div>

        <h3 className="mt-3 text-sm font-bold text-slate-800">
          No billing history
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Customer bills will appear here after a sale is created.
        </p>
      </div>
    ) : (
      <>
        {/* MOBILE BILLING CARDS */}

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
                key={sale?.id || `${saleDate}-${index}`}
                className="rounded-xl border border-[#EAD5D8] bg-[#9DB4C0]/70 p-4 transition hover:border-[C2DFE3]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5C6B73] text-[#A96F7D]">
                        <UserRound size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {customerName}
                        </p>

                        {customerPhone && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                            <Phone size={12} />
                            {customerPhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="shrink-0 text-sm font-extrabold text-[#A96F7D]">
                    {formatCurrency(amount)}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#EAD5D8] pt-3">
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

        {/* DESKTOP BILLING TABLE */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-[#EAD5D8] bg-[#9DB4C0] text-left">
                <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                  Phone
                </th>

                <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                  Items
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
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

                const items = Array.isArray(sale?.items)
                  ? sale.items
                  : [];

                const saleDate =
                  sale?.createdAt ||
                  sale?.date ||
                  sale?.timestamp;

                return (
                  <tr
                    key={sale?.id || `${saleDate}-${index}`}
                    className="border-b border-[#F0E2E4] last:border-0 hover:bg-[#9DB4C0]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5C6B73] text-[#A96F7D]">
                          <UserRound size={16} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {customerName}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Phone size={13} />
                        {customerPhone}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                      {formatDateTime(saleDate)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#9DB4C0] px-2.5 py-1 text-xs font-bold text-[#7A4D58]">
                        {items.length ||
                          sale?.itemCount ||
                          sale?.quantity ||
                          0}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-extrabold text-[#A96F7D]">
                        {formatCurrency(amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* VIEW MORE / SHOW LESS */}

        {allSales.length > 5 && (
          <div className="flex justify-center border-t border-[#EAD5D8] px-4 py-4">
            <button
              type="button"
              onClick={() =>
                setShowAllSales((previous) => !previous)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[C2DFE3] bg-[#5C6B73] px-5 py-2.5 text-xs font-bold text-[#6A414B] transition hover:bg-[C2DFE3] hover:shadow-sm"
            >
              {showAllSales
                ? "Show Less"
                : `View More (${allSales.length - 5} more)`}

              <ArrowRight
                size={15}
                className={
                  showAllSales
                    ? "rotate-[-90deg]"
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
      MAIN CONTENT
  ====================================================== */}

  <section className="grid gap-6 lg:grid-cols-3">

    {/* MEDICINE ATTENTION */}

    <div className="rounded-2xl border border-[#EAD5D8] bg-white shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between border-b border-[#EAD5D8] px-5 py-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Medicine Attention
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Medicines that require your attention
          </p>
        </div>

        <Link
          to="/medicines"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#A96F7D] hover:underline"
        >
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      {attentionItems.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#5C6B73] text-[#A96F7D]">
            <PackageCheck size={22} />
          </div>

          <h3 className="mt-3 text-sm font-bold text-slate-800">
            Everything looks good
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            No medicines currently require attention.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#F0E2E4]">
          {attentionItems.map((medicine) => (
            <div
              key={medicine.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5C6B73] text-[#A96F7D]">
                  <Pill size={18} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {medicine.name || "Unnamed Medicine"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Qty:{" "}
                    <span className="font-semibold text-slate-700">
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

    <div className="rounded-2xl border border-[#EAD5D8] bg-white shadow-sm">
      <div className="border-b border-[#EAD5D8] px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="text-base font-extrabold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Frequently used pharmacy actions
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 sm:block sm:space-y-3 sm:p-5">

        {/* Add Medicine */}
        <Link
          to="/medicines/new"
          className="flex flex-col items-center justify-center rounded-xl border border-[#EAD5D8] p-2.5 text-center transition hover:border-[C2DFE3] hover:bg-[#9DB4C0] sm:flex-row sm:justify-start sm:gap-3 sm:p-3 sm:text-left"
        >
          <div className="rounded-lg bg-[#5C6B73] p-2 text-[#A96F7D]">
            <Plus size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mt-1 text-[10px] font-bold text-slate-800 sm:mt-0 sm:text-sm">
              Add Medicine
            </p>

            <p className="hidden text-[11px] text-slate-500 sm:block">
              Add a new medicine
            </p>
          </div>

          <ArrowRight
            size={15}
            className="mt-1 text-slate-400 sm:mt-0"
          />
        </Link>

        {/* Manage Medicines */}
        <Link
          to="/medicines"
          className="flex flex-col items-center justify-center rounded-xl border border-[#EAD5D8] p-2.5 text-center transition hover:border-[C2DFE3] hover:bg-[#9DB4C0] sm:flex-row sm:justify-start sm:gap-3 sm:p-3 sm:text-left"
        >
          <div className="rounded-lg bg-[C2DFE3]/60 p-2 text-[#6A414B]">
            <Pill size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mt-1 text-[10px] font-bold text-slate-800 sm:mt-0 sm:text-sm">
              Manage Medicines
            </p>

            <p className="hidden text-[11px] text-slate-500 sm:block">
              Update stock and medicine details
            </p>
          </div>

          <ArrowRight
            size={15}
            className="mt-1 text-slate-400 sm:mt-0"
          />
        </Link>

        {/* Manage Suppliers */}
        <Link
          to="/suppliers"
          className="flex flex-col items-center justify-center rounded-xl border border-[#EAD5D8] p-2.5 text-center transition hover:border-[C2DFE3] hover:bg-[#9DB4C0] sm:flex-row sm:justify-start sm:gap-3 sm:p-3 sm:text-left"
        >
          <div className="rounded-lg bg-[#5C6B73] p-2 text-[#A96F7D]">
            <Truck size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="mt-1 text-[10px] font-bold text-slate-800 sm:mt-0 sm:text-sm">
              Manage Suppliers
            </p>

            <p className="hidden text-[11px] text-slate-500 sm:block">
              View and manage suppliers
            </p>
          </div>

          <ArrowRight
            size={15}
            className="mt-1 text-slate-400 sm:mt-0"
          />
        </Link>
      </div>
    </div>
  </section>

  {/* ======================================================
      BOTTOM INFORMATION CARDS
  ====================================================== */}

  <section className="grid grid-cols-3 gap-2 sm:gap-4">

    {/* Suppliers */}
    <div className="rounded-2xl border border-[#EAD5D8] bg-white p-3 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-[#5C6B73] p-2 text-[#A96F7D] sm:p-3">
          <Truck size={18} className="sm:h-5 sm:w-5" />
        </div>

        <Link
          to="/suppliers"
          className="text-[10px] font-bold text-[#A96F7D] hover:underline sm:text-xs"
        >
          View
        </Link>
      </div>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
        Suppliers
      </p>

      <p className="mt-1 text-lg font-extrabold text-slate-900 sm:text-2xl">
        {suppliers.length}
      </p>

      <p className="mt-1 hidden text-xs text-slate-500 sm:block">
        Suppliers available in the system
      </p>
    </div>

    {/* Inventory Value */}
    <div className="rounded-2xl border border-[#EAD5D8] bg-white p-3 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-[C2DFE3]/60 p-2 text-[#6A414B] sm:p-3">
          <Boxes size={18} className="sm:h-5 sm:w-5" />
        </div>
      </div>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
        Inventory Value
      </p>

      <p className="mt-1 text-lg font-extrabold text-slate-900 sm:text-2xl">
        {formatCurrency(inventoryValue)}
      </p>

      <p className="mt-1 hidden text-xs text-slate-500 sm:block">
        Current value of available medicine stock
      </p>
    </div>

    {/* Expiry Monitoring */}
    <div className="rounded-2xl border border-[#EAD5D8] bg-white p-3 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-[#5C6B73] p-2 text-[#A96F7D] sm:p-3">
          <CalendarClock size={18} className="sm:h-5 sm:w-5" />
        </div>

        <span className="rounded-full bg-[#9DB4C0] px-2 py-1 text-[9px] font-bold text-[#7A4D58] sm:px-2.5 sm:py-1 sm:text-[11px]">
          30 Days
        </span>
      </div>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:mt-4 sm:text-xs">
        Expiry Monitoring
      </p>

      <p className="mt-1 text-lg font-extrabold text-slate-900 sm:text-2xl">
        {expiringSoonCount}
      </p>

      <p className="mt-1 hidden text-xs text-slate-500 sm:block">
        Medicines expiring within 30 days
      </p>
    </div>
  </section>
</div>


);
}
