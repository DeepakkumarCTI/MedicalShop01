import { useMemo } from "react";
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

const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Dashboard() {
  const { data, stats, sales } = useApp();

  const attentionItems = useMemo(() => {
    const today = new Date();
    const limit = new Date(today);
    limit.setDate(today.getDate() + 30);

    return data.medicines
      .filter((medicine) => {
        const expiry = new Date(`${medicine.expiryDate}T23:59:59`);

        return (
          Number(medicine.quantity) <= Number(medicine.reorderLevel) ||
          expiry <= limit
        );
      })
      .sort(
        (a, b) =>
          new Date(a.expiryDate) - new Date(b.expiryDate)
      )
      .slice(0, 5);
  }, [data.medicines]);

  const cards = [
    {
      label: "Total Medicines",
      value: stats.totalMedicines,
      note: `${stats.totalUnits} total units`,
      icon: Pill,
      tone: "purple",
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      note: "Needs attention",
      icon: PackageCheck,
      tone: "yellow",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
      note: "Restock required",
      icon: XCircle,
      tone: "rose",
    },
    {
      label: "Expiring Soon",
      value: stats.expiringSoon,
      note: "Next 30 days",
      icon: CalendarClock,
      tone: "purpleLight",
    },
  ];

  const toneClasses = {
    purple: "bg-purple-50 text-[#3A0CA3]",
    yellow: "bg-[#FFF275] text-[#3A0CA3]",
    rose: "bg-rose-50 text-rose-600",
    purpleLight: "bg-[#F0EBFF] text-[#3A0CA3]",
  };

  return (
    <div className="mx-auto max-w-[1500px]">

      {/* =========================
          HERO / OVERVIEW
      ========================== */}

      <div
        className="mb-7 flex flex-col gap-4 rounded-3xl p-6 text-white shadow-xl sm:p-7 lg:flex-row lg:items-center lg:justify-between"
        style={{
          background:
            "linear-gradient(135deg, #3A0CA3 0%, #4813B8 70%, #5A1ED0 100%)",
          boxShadow: "0 15px 35px rgba(58, 12, 163, 0.15)",
        }}
      >
        <div>
          <p className="text-sm font-semibold text-purple-100">
            Good morning, Admin 👋
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
            Here’s your shop overview.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-purple-100">
            Monitor medicines, inventory levels and expiry dates from one
            place.
          </p>
        </div>

        <Link
          to="/medicines/new"
          className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition hover:opacity-90"
          style={{
            backgroundColor: "#FFF275",
            color: "#3A0CA3",
          }}
        >
          <Plus size={18} />

          Add medicine
        </Link>
      </div>

      {/* =========================
          STATISTICS CARDS
      ========================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ({ label, value, note, icon: Icon, tone }) => (
            <div
              key={label}
              className="card p-5 transition hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {label}
                  </p>

                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    {value}
                  </p>
                </div>

                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl ${toneClasses[tone]}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold text-slate-400">
                {note}
              </p>
            </div>
          )
        )}
      </div>



      {/* =========================
          SALES SUMMARY
      ========================== */}

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400">Today&apos;s Sales</p>
          <p className="mt-1 text-2xl font-black text-[#3A0CA3]">
            ₹{stats.todaySales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-slate-400">Generated from staff bills</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400">Total Sales</p>
          <p className="mt-1 text-2xl font-black text-slate-900">
            ₹{stats.totalSales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-slate-400">{stats.totalBills} bills generated</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-slate-400">Staff Billing</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">Live stock sync</p>
          <p className="mt-1 text-xs text-slate-400">Staff sales immediately reduce inventory</p>
        </div>
      </div>

      {/* =========================
          CUSTOMER BILLING HISTORY
      ========================== */}

      <div className="card mt-5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900">Customer Billing History</h3>
            <p className="mt-1 text-xs text-slate-400">
              Customer details and bills generated by staff
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#F0EBFF] px-3 py-2 text-xs font-bold text-[#3A0CA3]">
            <Receipt size={15} />
            {stats.totalBills} bill{stats.totalBills !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          {sales.length ? (
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Mobile</th>
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Medicines</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="transition hover:bg-purple-50/40">
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F0EBFF] text-[#3A0CA3]">
                          <UserRound size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {sale.customerName}
                          </p>
                          <p className="text-[11px] text-slate-400">Customer</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Phone size={14} className="text-slate-400" />
                        {sale.customerMobile}
                      </div>
                    </td>
                    <td className="py-4 text-sm font-bold text-[#3A0CA3]">
                      {sale.invoiceNo}
                    </td>
                    <td className="py-4">
                      <div className="max-w-[280px] space-y-1">
                        {sale.items?.map((item) => (
                          <p key={`${sale.id}-${item.medicineId}`} className="text-xs text-slate-600">
                            <span className="font-semibold text-slate-800">{item.name}</span>
                            <span className="text-slate-400"> × {item.quantity}</span>
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-600">
                      {new Date(sale.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 text-right text-sm font-black text-emerald-600">
                      ₹{Number(sale.total || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Receipt className="mx-auto text-slate-300" size={30} />
              <p className="mt-2 text-sm font-bold text-slate-600">No customer bills yet</p>
              <p className="mt-1 text-xs text-slate-400">Staff-generated bills will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div className="mt-5 grid gap-5 xl:grid-cols-3">

        {/* Medicine Attention List */}
        <div className="card p-5 xl:col-span-2">

          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900">
                Medicine attention list
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Low stock or expiry within 30 days
              </p>
            </div>

            <Link
              to="/medicines"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#3A0CA3] transition hover:text-purple-800"
            >
              View all

              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">

            {attentionItems.length ? (
              <table className="w-full min-w-[680px] text-left">

                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <th className="pb-3">Medicine</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Expiry</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {attentionItems.map((medicine) => (
                    <tr
                      key={medicine.id}
                      className="transition hover:bg-yellow-50/40"
                    >
                      <td className="py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {medicine.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {medicine.code} • {medicine.batch}
                        </p>
                      </td>

                      <td className="py-4 text-sm font-semibold text-slate-700">
                        {medicine.quantity} units
                      </td>

                      <td className="py-4 text-sm text-slate-600">
                        {formatDate(medicine.expiryDate)}
                      </td>

                      <td className="py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <StockBadge medicine={medicine} />
                          <ExpiryBadge date={medicine.expiryDate} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center text-sm font-semibold text-emerald-700">
                All medicines look good right now.
              </div>
            )}

          </div>
        </div>

        {/* =========================
            RIGHT SIDE CARDS
        ========================== */}

        <div className="space-y-5">

          {/* Suppliers */}
          <div className="card p-5">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0EBFF] text-[#3A0CA3]">
                <Truck size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Suppliers
                </p>

                <p className="text-xl font-black text-slate-900">
                  {stats.suppliers}
                </p>
              </div>

            </div>

            <Link
              to="/suppliers"
              className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-[#FFFDE7] hover:text-[#3A0CA3]"
            >
              Manage suppliers

              <ArrowRight size={16} />
            </Link>

          </div>

          {/* Inventory Value */}
          <div className="card p-5">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF275] text-[#3A0CA3]">
                <IndianRupee size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">
                  Inventory value
                </p>

                <p className="text-xl font-black text-slate-900">
                  ₹
                  {stats.inventoryValue.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Boxes size={15} />

              Based on current quantity × unit price
            </div>

          </div>

          {/* Expiry Monitoring */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

            <div className="flex gap-3">

              <AlertTriangle
                className="mt-0.5 shrink-0 text-yellow-700"
                size={19}
              />

              <div>
                <p className="text-sm font-extrabold text-yellow-900">
                  Expiry monitoring
                </p>

                <p className="mt-1 text-xs leading-5 text-yellow-800">
                  Check the medicine list regularly and review products
                  marked as expired or expiring soon.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}