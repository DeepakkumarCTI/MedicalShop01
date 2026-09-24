
import { useState } from "react";
import {
  Building2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/PageHeader";
import ConfirmModal from "../components/ConfirmModal";

const blank = {
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
};

export default function Suppliers() {
  const {
    data,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  } = useApp();

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blank);
  const [deleteId, setDeleteId] = useState(null);

  const openAdd = () => {
    setForm(blank);
    setModal({ type: "add" });
  };

  const openEdit = (supplier) => {
    setForm(supplier);
    setModal({
      type: "edit",
      id: supplier.id,
    });
  };

  const change = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.company.trim() ||
      !form.phone.trim()
    ) {
      return;
    }

    if (modal.type === "edit") {
      updateSupplier(modal.id, form);
    } else {
      addSupplier(form);
    }

    setModal(null);
  };

  const medicineCount = (supplierId) =>
    data.medicines.filter(
      (medicine) => medicine.supplierId === supplierId
    ).length;

  return (
    <div className="mx-auto max-w-[1500px] pb-8">
      {/* =========================
          PAGE HEADER
      ========================== */}
      <PageHeader
        title="Suppliers"
        description="Maintain supplier contact details and linked medicines."
        action={
          <button
            type="button"
            onClick={openAdd}
            className="btn-primary"
          >
            <Plus size={18} />
            Add supplier
          </button>
        }
      />

      {/* =========================
          SUPPLIER GRID
      ========================== */}
      {data.suppliers.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
          {data.suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="card overflow-hidden p-3 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
            >
              {/* =========================
                  SUPPLIER HEADER
              ========================== */}
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#5C6B73] text-[#A96F7D] shadow-sm sm:h-12 sm:w-12 sm:rounded-xl">
                    <Truck
                      size={17}
                      className="sm:hidden"
                    />

                    <Truck
                      size={21}
                      className="hidden sm:block"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold text-[#3F2930] sm:text-base">
                      {supplier.name}
                    </h3>

                    <p className="mt-0.5 truncate text-[10px] text-[#A88F95] sm:text-xs">
                      {supplier.company}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-[#EAD5D8] bg-[#9DB4C0] px-1.5 py-0.5 text-[9px] font-bold text-[#7A4D58] sm:px-2.5 sm:py-1 sm:text-xs">
                  {medicineCount(supplier.id)} medicines
                </span>
              </div>

              {/* =========================
                  SUPPLIER DETAILS
              ========================== */}
              <div className="mt-3 space-y-2 border-t border-[#EAD5D8] pt-3 sm:mt-5 sm:space-y-3 sm:pt-4">
                {/* Phone */}
                <div className="flex items-start gap-1.5 text-[11px] text-[#5F4A50] sm:gap-2.5 sm:text-sm">
                  <Phone
                    size={14}
                    className="mt-0.5 shrink-0 text-[#A96F7D] sm:h-4 sm:w-4"
                  />

                  <span className="truncate">
                    {supplier.phone}
                  </span>
                </div>

                {/* Email */}
                <div className="flex items-start gap-1.5 text-[11px] text-[#5F4A50] sm:gap-2.5 sm:text-sm">
                  <Mail
                    size={14}
                    className="mt-0.5 shrink-0 text-[#A96F7D] sm:h-4 sm:w-4"
                  />

                  <span className="truncate">
                    {supplier.email || "No email"}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-1.5 text-[11px] leading-4 text-[#5F4A50] sm:gap-2.5 sm:text-sm sm:leading-5">
                  <MapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-[#A96F7D] sm:h-4 sm:w-4"
                  />

                  <span className="line-clamp-2">
                    {supplier.address || "No address"}
                  </span>
                </div>
              </div>

              {/* =========================
                  ACTIONS
              ========================== */}
              <div className="mt-3 flex justify-end gap-1.5 border-t border-[#EAD5D8] pt-3 sm:mt-5 sm:gap-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => openEdit(supplier)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#EAD5D8] bg-white px-2 py-1.5 text-[10px] font-bold text-[#6A414B] transition hover:border-[C2DFE3] hover:bg-[#5C6B73] hover:text-[#4A3037] sm:px-3 sm:py-2 sm:text-xs"
                >
                  <Edit3
                    size={13}
                    className="sm:h-[15px] sm:w-[15px]"
                  />

                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteId(supplier.id)
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white px-2 py-1.5 text-[10px] font-bold text-rose-500 transition hover:bg-rose-50 hover:text-rose-600 sm:px-3 sm:py-2 sm:text-xs"
                >
                  <Trash2
                    size={13}
                    className="sm:h-[15px] sm:w-[15px]"
                  />

                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* =========================
           EMPTY STATE
        ========================== */
        <div className="card p-8 text-center sm:p-14">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#5C6B73] text-[#A96F7D] shadow-sm">
            <Building2 size={21} />
          </div>

          <h3 className="mt-3 font-bold text-[#3F2930]">
            No suppliers yet
          </h3>

          <p className="mt-1 text-sm text-[#9A858B]">
            Add your first supplier to link it to medicines.
          </p>

          <button
            type="button"
            onClick={openAdd}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[C2DFE3] px-4 py-2.5 text-sm font-bold text-[#3F2930] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#D7A5B0] hover:shadow-md"
          >
            <Plus size={17} />
            Add supplier
          </button>
        </div>
      )}

      {/* =========================
          ADD / EDIT MODAL
      ========================== */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#3F2930]/60 p-3 backdrop-blur-sm sm:p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#EAD5D8] bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#EAD5D8] bg-[#9DB4C0] px-4 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A96F7D] sm:text-xs">
                  Supplier Management
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[#3F2930] sm:text-xl">
                  {modal.type === "edit"
                    ? "Edit supplier"
                    : "Add supplier"}
                </h3>

                <p className="mt-1 text-xs text-[#9A858B]">
                  {modal.type === "edit"
                    ? "Update supplier contact and business details."
                    : "Add a supplier to your pharmacy inventory."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModal(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#EAD5D8] bg-white text-[#9A858B] transition hover:border-[C2DFE3] hover:bg-[#5C6B73] hover:text-[#6A414B]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Supplier Form */}
            <form
              onSubmit={submit}
              className="grid gap-4 p-4 sm:p-6"
            >
              <div className="rounded-xl border border-[#EAD5D8] bg-[#9DB4C0] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[C2DFE3] text-[#5E3C45]">
                    <Truck size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-[#5A3941]">
                      Supplier details
                    </p>

                    <p className="text-[10px] text-[#9A858B]">
                      Fields marked with * are required.
                    </p>
                  </div>
                </div>
              </div>

              <Field label="Contact name *">
                <input
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={change}
                  placeholder="Supplier contact name"
                  required
                />
              </Field>

              <Field label="Company *">
                <input
                  className="input"
                  name="company"
                  value={form.company}
                  onChange={change}
                  placeholder="Company name"
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone *">
                  <input
                    className="input"
                    name="phone"
                    value={form.phone}
                    onChange={change}
                    placeholder="Phone number"
                    required
                  />
                </Field>

                <Field label="Email">
                  <input
                    className="input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={change}
                    placeholder="Email address"
                  />
                </Field>
              </div>

              <Field label="Address">
                <textarea
                  className="input resize-none"
                  rows="3"
                  name="address"
                  value={form.address}
                  onChange={change}
                  placeholder="Business address"
                />
              </Field>

              {/* Modal Actions */}
              <div className="mt-1 flex flex-col-reverse gap-2 border-t border-[#EAD5D8] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                >
                  <Plus size={17} />

                  {modal.type === "edit"
                    ? "Update"
                    : "Save"}{" "}
                  supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE CONFIRMATION
      ========================== */}
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete supplier?"
        message="The supplier will be removed. Any linked medicines will remain but will no longer have a supplier assigned."
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteSupplier(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

