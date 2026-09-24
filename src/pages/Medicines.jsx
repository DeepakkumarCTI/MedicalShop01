
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
    <div className="mx-auto max-w-[1500px] pb-10">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <PageHeader
        title="Medicines"
        description="Search, monitor and manage your medicine inventory."
        action={
          <Link
            to="/medicines/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#C2DFE3] px-4 text-sm font-extrabold text-[#3F2930] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#AFCFD4] hover:shadow-md"
          >
            <Plus size={18} />
            Add medicine
          </Link>
        }
      />

      {/* =========================
          MAIN CARD
      ========================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3E8EA] bg-white shadow-[0_4px_24px_rgba(63,41,48,0.05)]">

        {/* =========================
            SEARCH + FILTER AREA
        ========================== */}

        <div className="border-b border-[#E7ECEE] bg-white p-4 sm:p-5">

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search */}

            <div className="relative min-w-0 flex-1">

              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A99BA0]"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-[#F7EEF0] hover:text-[#A96F7D]"
                >
                  <X size={16} />
                </button>
              )}

            </div>

            {/* Mobile Filters */}

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DDE4E6] bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-[#C2DFE3] hover:bg-[#F5F9FA] hover:text-[#5A3941] lg:hidden"
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

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">

            <span>
              Showing
            </span>

            <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-[#F0F5F6] px-2 py-1 font-extrabold text-[#6A414B]">
              {filtered.length}
            </span>

            <span>
              of {data.medicines.length} medicines
            </span>

          </div>

        </div>

        {/* =========================
            TABLE
        ========================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-left">

            <thead className="bg-[#F5F8F9]">

              <tr className="border-b border-[#E3E8EA] text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#8C7A80]">

                <th className="px-5 py-4">
                  Medicine
                </th>

                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Stock
                </th>

                <th className="px-5 py-4">
                  Price
                </th>

                <th className="px-5 py-4">
                  Expiry
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#EEF1F2]">

              {filtered.map((medicine) => (

                <tr
                  key={medicine.id}
                  className="group transition-colors hover:bg-[#FAFCFC]"
                >

                  {/* Medicine */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#DCE8EA] bg-[#EEF5F6] text-sm font-extrabold text-[#6A414B]">
                        {medicine.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-extrabold text-[#3F2930]">
                          {medicine.name}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">

                          <span>
                            {medicine.code}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-slate-300" />

                          <span>
                            Batch {medicine.batch}
                          </span>

                        </div>

                      </div>

                    </div>

                  </td>

                  {/* Category */}

                  <td className="px-5 py-4">

                    <span className="inline-flex items-center rounded-lg border border-[#E0EAEC] bg-[#F3F7F8] px-2.5 py-1.5 text-xs font-bold text-[#66777C]">
                      {medicine.category}
                    </span>

                  </td>

                  {/* Stock */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-extrabold text-slate-700">
                      {medicine.quantity}
                    </p>

                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                      Reorder at{" "}
                      {medicine.reorderLevel}
                    </p>

                  </td>

                  {/* Price */}

                  <td className="px-5 py-4">

                    <span className="text-sm font-extrabold text-[#6A414B]">
                      ₹
                      {Number(
                        medicine.unitPrice
                      ).toFixed(2)}
                    </span>

                  </td>

                  {/* Expiry */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-semibold text-slate-600">
                      {formatDate(
                        medicine.expiryDate
                      )}
                    </p>

                    <div className="mt-1.5">
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE4E6] bg-white text-[#8E727A] transition hover:border-[#C2DFE3] hover:bg-[#F1F8F9] hover:text-[#5E3C45]"
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
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-white text-rose-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
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

          {/* =========================
              EMPTY STATE
          ========================== */}

          {!filtered.length && (

            <div className="border-t border-[#EEF1F2] bg-[#FCFDFD] px-5 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E0EAEC] bg-[#F1F7F8] text-[#8EA3A8]">
                <Search size={23} />
              </div>

              <p className="mt-5 text-sm font-extrabold text-[#3F2930]">
                No medicines found
              </p>

              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
                No medicines match your current search
                or filter selection.
              </p>

              {(q ||
                category !== "All" ||
                status !== "All") && (

                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setCategory("All");
                    setStatus("All");
                  }}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#C2DFE3] px-4 text-xs font-extrabold text-[#3F2930] transition hover:bg-[#AFCFD4]"
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

