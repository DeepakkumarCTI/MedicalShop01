
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit3,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  ExpiryBadge,
  StockBadge,
} from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import ConfirmModal from "../components/ConfirmModal";

const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Medicines() {
  const { data, deleteMedicine } = useApp();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    ...new Set(data.medicines.map((m) => m.category)),
  ];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return data.medicines.filter((medicine) => {
      const matchesQuery =
        !query ||
        [
          medicine.name,
          medicine.code,
          medicine.manufacturer,
          medicine.batch,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        medicine.category === category;

      let matchesStatus = true;

      if (status === "In stock") {
        matchesStatus =
          Number(medicine.quantity) >
          Number(medicine.reorderLevel);
      }

      if (status === "Low stock") {
        matchesStatus =
          Number(medicine.quantity) > 0 &&
          Number(medicine.quantity) <=
            Number(medicine.reorderLevel);
      }

      if (status === "Out of stock") {
        matchesStatus =
          Number(medicine.quantity) === 0;
      }

      if (status === "Expired") {
        matchesStatus =
          new Date(`${medicine.expiryDate}T23:59:59`) <
          new Date();
      }

      if (status === "Expiring soon") {
        const today = new Date();
        const limit = new Date(today);

        limit.setDate(today.getDate() + 30);

        const expiry = new Date(
          `${medicine.expiryDate}T23:59:59`
        );

        matchesStatus =
          expiry >= today && expiry <= limit;
      }

      return (
        matchesQuery &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [data.medicines, q, category, status]);

  const selected = data.medicines.find(
    (item) => item.id === deleteId
  );

  return (
    <div className="mx-auto max-w-[1500px] pb-8">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <PageHeader
        title="Medicines"
        description="Search, monitor and manage your medicine inventory."
        action={
          <Link
            to="/medicines/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[C2DFE3] px-4 py-2.5 text-sm font-bold text-[#3F2930] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#D7A5B0] hover:shadow-md"
          >
            <Plus size={18} />
            Add medicine
          </Link>
        }
      />

      {/* =========================
          MEDICINES CARD
      ========================== */}

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#EAD5D8] bg-white shadow-sm">

        {/* Search + Filters */}
        <div className="border-b border-[#EAD5D8] bg-white p-4 sm:p-5">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B29BA1]"
                size={18}
              />

              <input
                className="input pl-10 pr-10"
                placeholder="Search by medicine, code, manufacturer or batch..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#A96F7D]"
                >
                  <X size={17} />
                </button>
              )}

            </div>

            {/* Mobile Filters */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAD5D8] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[C2DFE3] hover:bg-[#5C6B73] hover:text-[#5A3941] lg:hidden"
              onClick={() =>
                setShowFilters((v) => !v)
              }
            >
              <Filter size={17} />
              Filters
            </button>

            {/* Filters */}
            <div
              className={`${
                showFilters ? "flex" : "hidden"
              } flex-col gap-3 lg:flex lg:flex-row`}
            >

              <select
                className="input lg:w-44"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                {categories.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                className="input lg:w-44"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                {[
                  "All",
                  "In stock",
                  "Low stock",
                  "Out of stock",
                  "Expiring soon",
                  "Expired",
                ].map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* Result Count */}
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            Showing{" "}
            <span className="rounded-full bg-[#5C6B73] px-2 py-0.5 font-bold text-[#7A4D58]">
              {filtered.length}
            </span>{" "}
            of {data.medicines.length} medicines
          </div>

        </div>

        {/* =========================
            TABLE
        ========================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] text-left">

            <thead className="bg-[#9DB4C0]">
              <tr className="text-xs font-bold uppercase tracking-wide text-[#9B858B]">

                <th className="px-5 py-3.5">
                  Medicine
                </th>

                <th className="px-5 py-3.5">
                  Category
                </th>

                <th className="px-5 py-3.5">
                  Stock
                </th>

                <th className="px-5 py-3.5">
                  Price
                </th>

                <th className="px-5 py-3.5">
                  Expiry
                </th>

                <th className="px-5 py-3.5">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0E2E4]">

              {filtered.map((medicine) => (

                <tr
                  key={medicine.id}
                  className="transition hover:bg-[#9DB4C0]"
                >

                  {/* Medicine */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold shadow-sm"
                        style={{
                          backgroundColor: "#5C6B73",
                          color: "#8E5A68",
                        }}
                      >
                        {medicine.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-[#3F2930]">
                          {medicine.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {medicine.code} • Batch{" "}
                          {medicine.batch}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 text-sm text-slate-600">
                    <span className="inline-flex rounded-lg bg-[#9DB4C0] px-2.5 py-1 text-xs font-semibold text-[#6A414B]">
                      {medicine.category}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-4">

                    <p className="text-sm font-bold text-slate-800">
                      {medicine.quantity}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Reorder at{" "}
                      {medicine.reorderLevel}
                    </p>

                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 text-sm font-bold text-[#6A414B]">
                    ₹{Number(medicine.unitPrice).toFixed(2)}
                  </td>

                  {/* Expiry */}
                  <td className="px-5 py-4">

                    <p className="text-sm text-slate-600">
                      {formatDate(
                        medicine.expiryDate
                      )}
                    </p>

                    <div className="mt-1">
                      <ExpiryBadge
                        date={medicine.expiryDate}
                      />
                    </div>

                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StockBadge
                      medicine={medicine}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {/* Edit */}
                      <Link
                        to={`/medicines/${medicine.id}/edit`}
                        className="rounded-lg border border-[#EAD5D8] bg-white p-2 text-[#8E727A] transition hover:border-[C2DFE3] hover:bg-[#5C6B73] hover:text-[#6A414B]"
                        title="Edit medicine"
                      >
                        <Edit3 size={16} />
                      </Link>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteId(medicine.id)
                        }
                        className="rounded-lg border border-rose-200 bg-white p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                        title="Delete medicine"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* Empty State */}
          {!filtered.length && (
            <div className="border-t border-[#F0E2E4] bg-[#9DB4C0] px-5 py-14 text-center">

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#EAD5D8] bg-[#5C6B73] text-[#A96F7D]">
                <Search size={21} />
              </div>

              <p className="mt-4 font-extrabold text-[#3F2930]">
                No medicines found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filters.
              </p>

              {(q || category !== "All" || status !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setCategory("All");
                    setStatus("All");
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[C2DFE3] px-3.5 py-2 text-xs font-bold text-[#3F2930] transition hover:bg-[#D7A5B0]"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}

            </div>
          )}

        </div>
      </div>

      {/* =========================
          DELETE CONFIRMATION
      ========================== */}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete medicine?"
        message={`This will remove ${
          selected?.name || "this medicine"
        } from your local demo data. This action cannot be undone.`}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteMedicine(deleteId);
          setDeleteId(null);
        }}
      />

    </div>
  );
}


