import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  LogOut,
  Minus,
  Plus,
  Printer,
  Search,
  ShoppingCart,
  Trash2,
  UserRound,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function StaffDashboard() {
  const { data, stats, createSale, logout } = useApp();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ name: "", mobile: "" });
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [bill, setBill] = useState(null);

  const availableMedicines = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.medicines.filter((medicine) => {
      const available =
        Number(medicine.quantity) > 0 &&
        new Date(`${medicine.expiryDate}T23:59:59`) >= new Date();
      const matches =
        !q ||
        `${medicine.name} ${medicine.code} ${medicine.category}`
          .toLowerCase()
          .includes(q);
      return available && matches;
    });
  }, [data.medicines, query]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );

  const addToCart = (medicine) => {
    setError("");
    setCart((current) => {
      const existing = current.find((item) => item.medicineId === medicine.id);
      if (existing) {
        if (existing.quantity >= Number(medicine.quantity)) return current;
        return current.map((item) =>
          item.medicineId === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
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

  const changeQuantity = (medicineId, nextQuantity) => {
    const medicine = data.medicines.find((item) => item.id === medicineId);
    if (!medicine) return;

    if (nextQuantity <= 0) {
      setCart((current) => current.filter((item) => item.medicineId !== medicineId));
      return;
    }

    const safeQuantity = Math.min(nextQuantity, Number(medicine.quantity));
    setCart((current) =>
      current.map((item) =>
        item.medicineId === medicineId
          ? { ...item, quantity: safeQuantity }
          : item
      )
    );
  };

  const generateBill = (e) => {
    e.preventDefault();
    setError("");

    if (!customer.name.trim()) {
      setError("Please enter the customer name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(customer.mobile.trim())) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!cart.length) {
      setError("Please add at least one medicine to the bill.");
      return;
    }

    const result = createSale(customer, cart);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setBill(result.sale);
    setCustomer({ name: "", mobile: "" });
    setCart([]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF275] text-[#3A0CA3]">
              <UserRound size={21} />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">MediCare</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Staff Billing Desk
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary px-3 py-2 text-xs sm:px-4 sm:text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:p-0">
        <div className="mb-6 grid gap-4 sm:grid-cols-3 print:hidden">
          <Stat label="Available Medicines" value={stats.totalMedicines - stats.outOfStock} />
          <Stat label="Total Stock Units" value={stats.totalUnits} />
          <Stat label="Low Quantity" value={stats.lowStock} warning />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr] print:block">
          <section className="card overflow-hidden print:hidden">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Available medicines
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Select medicines requested by the customer.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    className="input pl-9"
                    placeholder="Search medicine..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="max-h-[620px] overflow-y-auto p-4">
              {availableMedicines.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {availableMedicines.map((medicine) => {
                    const low =
                      Number(medicine.quantity) <= Number(medicine.reorderLevel);
                    const inCart = cart.find((item) => item.medicineId === medicine.id);

                    return (
                      <div
                        key={medicine.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#3A0CA3]/30 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-slate-900">{medicine.name}</h3>
                            <p className="mt-1 text-[11px] text-slate-400">
                              {medicine.code} • {medicine.category}
                            </p>
                          </div>
                          {low && (
                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                              Low stock
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs text-slate-400">Stock</p>
                            <p className={`text-lg font-black ${low ? "text-amber-600" : "text-slate-800"}`}>
                              {medicine.quantity} units
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">Price</p>
                            <p className="font-bold text-[#3A0CA3]">{money(medicine.unitPrice)}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToCart(medicine)}
                          disabled={Boolean(inCart && inCart.quantity >= Number(medicine.quantity))}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3A0CA3] px-3 py-2.5 text-sm font-bold text-white transition hover:bg-[#2f0988] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={16} />
                          {inCart ? `Added (${inCart.quantity})` : "Add to bill"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
                  <AlertTriangle className="mx-auto text-amber-500" />
                  <p className="mt-2 text-sm font-bold text-slate-700">
                    No available medicines found.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="card h-fit print:hidden">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center gap-2">
                <ShoppingCart size={19} className="text-[#3A0CA3]" />
                <h2 className="text-lg font-black text-slate-900">Create bill</h2>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Enter customer details and generate the invoice.
              </p>
            </div>

            <form onSubmit={generateBill} className="p-5">
              {error && (
                <div className="mb-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  <AlertTriangle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                <div>
                  <label className="label">Customer name *</label>
                  <input
                    className="input"
                    value={customer.name}
                    onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="label">Mobile number *</label>
                  <input
                    className="input"
                    inputMode="numeric"
                    maxLength={10}
                    value={customer.mobile}
                    onChange={(e) =>
                      setCustomer((p) => ({
                        ...p,
                        mobile: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-800">Selected medicines</p>
                  <span className="text-xs font-semibold text-slate-400">
                    {cart.length} item{cart.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {cart.length ? (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.medicineId} className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{item.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {money(item.unitPrice)} each
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.medicineId, 0)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.medicineId, item.quantity - 1)}
                              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.medicineId, item.quantity + 1)}
                              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <p className="font-black text-slate-800">
                            {money(item.quantity * item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs font-semibold text-slate-400">
                    Add medicines from the list.
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-600">Total</span>
                <span className="text-2xl font-black text-[#3A0CA3]">{money(cartTotal)}</span>
              </div>

              <button type="submit" className="btn-primary mt-4 w-full">
                <FileText size={17} />
                Generate bill
              </button>
            </form>
          </section>

          {bill && (
            <Bill bill={bill} onClose={() => setBill(null)} />
          )}
        </div>

        {bill && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 print:hidden">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" size={19} />
                <p className="text-sm font-bold text-emerald-800">
                  Bill {bill.invoiceNo} generated successfully. Stock has been reduced.
                </p>
              </div>
              <button onClick={() => window.print()} className="btn-secondary">
                <Printer size={16} />
                Print bill
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, warning }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-black ${warning ? "text-amber-600" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

function Bill({ bill }) {
  return (
    <div className="bill-print card p-6 xl:col-span-1 print:mx-auto print:block print:max-w-3xl print:border-0 print:shadow-none">
      <div className="border-b border-slate-200 pb-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3A0CA3]">
          MediCare
        </p>
        <h2 className="mt-1 text-2xl font-black text-slate-900">Sales Invoice</h2>
        <p className="mt-1 text-xs text-slate-400">{bill.invoiceNo}</p>
      </div>

      <div className="grid gap-2 border-b border-slate-100 py-4 text-sm sm:grid-cols-2">
        <p><span className="font-bold">Customer:</span> {bill.customerName}</p>
        <p><span className="font-bold">Mobile:</span> {bill.customerMobile}</p>
        <p className="sm:col-span-2"><span className="font-bold">Date:</span> {formatDateTime(bill.createdAt)}</p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
              <th className="pb-3">Medicine</th>
              <th className="pb-3 text-center">Qty</th>
              <th className="pb-3 text-right">Price</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bill.items.map((item) => (
              <tr key={item.medicineId}>
                <td className="py-3 font-semibold">{item.name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{money(item.unitPrice)}</td>
                <td className="py-3 text-right font-bold">{money(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex justify-end border-t border-slate-200 pt-4">
        <div className="w-full max-w-xs flex items-center justify-between text-lg font-black">
          <span>Total</span>
          <span className="text-[#3A0CA3]">{money(bill.total)}</span>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        Thank you for visiting MediCare.
      </p>
    </div>
  );
}
