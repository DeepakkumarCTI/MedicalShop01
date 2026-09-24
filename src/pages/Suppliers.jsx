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
  Package,
  Users,
  CheckCircle2,
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
      (medicine) =>
        medicine.supplierId === supplierId
    ).length;

  return (
    <div className="mx-auto max-w-[1500px] pb-8">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        title="Suppliers"
        description="Manage supplier information and track their linked medicines."
        action={
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C2DFE3] px-4 py-2.5 text-xs font-black text-[#34464B] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#B2D4D9] hover:shadow-md sm:text-sm"
          >
            <Plus size={17} />
            Add supplier
          </button>
        }
      />

      {/* =====================================================
          SUPPLIER OVERVIEW
      ====================================================== */}

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={Truck}
          label="Total Suppliers"
          value={data.suppliers.length}
        />

        <SummaryCard
          icon={Package}
          label="Linked Medicines"
          value={data.medicines.filter(
            (medicine) =>
              medicine.supplierId
          ).length}
        />

        <div className="col-span-2 sm:col-span-1">
          <SummaryCard
            icon={Users}
            label="Supplier Records"
            value={data.suppliers.length}
          />
        </div>
      </div>

      {/* =====================================================
          SUPPLIER GRID
      ====================================================== */}

      {data.suppliers.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.suppliers.map((supplier) => {
            const linkedMedicines =
              medicineCount(supplier.id);

            return (
              <div
                key={supplier.id}
                className="group overflow-hidden rounded-2xl border border-[#DCE5E8] bg-white shadow-[0_4px_18px_rgba(38,50,56,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-[#C5DDE1] hover:shadow-[0_10px_28px_rgba(38,50,56,0.09)]"
              >
                {/* =================================================
                    CARD TOP
                ================================================== */}

                <div className="relative overflow-hidden border-b border-[#E6ECEE] bg-gradient-to-br from-[#F4F8F9] to-white p-4 sm:p-5">
                  <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#EAF2F3] opacity-70" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E5EFF1] text-[#61757C] transition duration-200 group-hover:bg-[#D9EAED]">
                        <Truck size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-[#2F3E43] sm:text-base">
                          {supplier.name}
                        </h3>

                        <p className="mt-0.5 truncate text-[10px] font-medium text-[#8C9A9F] sm:text-xs">
                          {supplier.company}
                        </p>
                      </div>
                    </div>

                    <span className="relative shrink-0 rounded-full border border-[#DCE8EA] bg-white px-2 py-1 text-[9px] font-black text-[#71848A] shadow-sm sm:px-2.5 sm:text-[10px]">
                      {linkedMedicines}{" "}
                      {linkedMedicines === 1
                        ? "medicine"
                        : "medicines"}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    CARD DETAILS
                ================================================== */}

                <div className="p-4 sm:p-5">
                  <div className="space-y-3">
                    {/* Phone */}

                    <SupplierDetail
                      icon={Phone}
                      label="Phone"
                      value={
                        supplier.phone ||
                        "No phone number"
                      }
                    />

                    {/* Email */}

                    <SupplierDetail
                      icon={Mail}
                      label="Email"
                      value={
                        supplier.email ||
                        "No email address"
                      }
                    />

                    {/* Address */}

                    <SupplierDetail
                      icon={MapPin}
                      label="Address"
                      value={
                        supplier.address ||
                        "No address provided"
                      }
                      multiline
                    />
                  </div>

                  {/* =================================================
                      LINKED MEDICINE STATUS
                  ================================================== */}

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E2EAEC] bg-[#F7FAFA] px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#E8F2F3] text-[#6A7E84]">
                        <Package size={14} />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wide text-[#9AA7AB]">
                          Linked Inventory
                        </p>

                        <p className="text-[11px] font-black text-[#53666C]">
                          {linkedMedicines} medicine
                          {linkedMedicines === 1
                            ? ""
                            : "s"}
                        </p>
                      </div>
                    </div>

                    {linkedMedicines > 0 && (
                      <CheckCircle2
                        size={15}
                        className="text-emerald-500"
                      />
                    )}
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================== */}

                  <div className="mt-4 flex gap-2 border-t border-[#E7ECEE] pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        openEdit(supplier)
                      }
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#DCE5E8] bg-white px-3 py-2 text-[10px] font-black text-[#617278] transition duration-200 hover:border-[#BFD7DB] hover:bg-[#F2F7F8] hover:text-[#40545A] sm:text-xs"
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteId(
                          supplier.id
                        )
                      }
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-white px-3 py-2 text-[10px] font-black text-rose-500 transition duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 sm:text-xs"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* =====================================================
           EMPTY STATE
        ====================================================== */

        <div className="overflow-hidden rounded-2xl border border-[#DCE5E8] bg-white shadow-[0_4px_18px_rgba(38,50,56,0.05)]">
          <div className="px-5 py-16 text-center sm:px-8 sm:py-20">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#EDF4F5] text-[#70838A]">
              <Building2 size={27} />
            </div>

            <h3 className="mt-5 text-base font-black text-[#35464B] sm:text-lg">
              No suppliers yet
            </h3>

            <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#8B999E] sm:text-sm">
              Add your first supplier to start
              managing supplier details and linking
              medicines to them.
            </p>

            <button
              type="button"
              onClick={openAdd}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#C2DFE3] px-5 py-2.5 text-xs font-black text-[#34464B] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#B2D4D9] hover:shadow-md sm:text-sm"
            >
              <Plus size={16} />
              Add first supplier
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5">
          <div className="flex max-h-[94vh] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-[#DCE5E8] bg-white shadow-[0_25px_70px_rgba(15,23,42,0.22)]">
            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="shrink-0 border-b border-[#E4EAEC] bg-gradient-to-br from-[#F2F7F8] to-white px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#E4EFF1] text-[#60757C]">
                    <Truck size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8C9CA1] sm:text-[10px]">
                      Supplier Management
                    </p>

                    <h3 className="mt-1 text-lg font-black text-[#304147] sm:text-xl">
                      {modal.type === "edit"
                        ? "Edit supplier"
                        : "Add supplier"}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setModal(null)
                  }
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#DCE5E8] bg-white text-[#8D9A9F] transition duration-200 hover:border-[#C5D9DC] hover:bg-[#F3F7F8] hover:text-[#52656B]"
                  aria-label="Close"
                >
                  <X size={17} />
                </button>
              </div>

              <p className="mt-3 pl-[52px] text-[10px] leading-4 text-[#89979C] sm:text-xs">
                {modal.type === "edit"
                  ? "Update the supplier's contact and business information."
                  : "Add supplier contact and business information to your pharmacy."}
              </p>
            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={submit}
              className="min-h-0 overflow-y-auto"
            >
              <div className="grid gap-4 p-4 sm:p-6">
                {/* Info Banner */}

                <div className="flex items-start gap-3 rounded-xl border border-[#DCE9EB] bg-[#F5F9FA] p-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#E3EFF1] text-[#61767D]">
                    <Building2 size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-black text-[#50636A]">
                      Supplier information
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-[#8D9A9F]">
                      Fields marked with * are
                      required.
                    </p>
                  </div>
                </div>

                {/* Contact Name */}

                <Field label="Contact name *">
                  <div className="relative">
                    <UserFieldIcon />

                    <input
                      className="supplier-input pl-10"
                      name="name"
                      value={form.name}
                      onChange={change}
                      placeholder="Enter contact name"
                      required
                    />
                  </div>
                </Field>

                {/* Company */}

                <Field label="Company *">
                  <div className="relative">
                    <BuildingFieldIcon />

                    <input
                      className="supplier-input pl-10"
                      name="company"
                      value={form.company}
                      onChange={change}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                </Field>

                {/* Phone / Email */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Phone *">
                    <div className="relative">
                      <Phone
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA7AB]"
                      />

                      <input
                        className="supplier-input pl-10"
                        name="phone"
                        value={form.phone}
                        onChange={change}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                  </Field>

                  <Field label="Email">
                    <div className="relative">
                      <Mail
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA7AB]"
                      />

                      <input
                        className="supplier-input pl-10"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={change}
                        placeholder="Email address"
                      />
                    </div>
                  </Field>
                </div>

                {/* Address */}

                <Field label="Address">
                  <div className="relative">
                    <MapPin
                      size={15}
                      className="absolute left-3 top-3.5 text-[#9AA7AB]"
                    />

                    <textarea
                      className="supplier-input min-h-[100px] resize-none pl-10"
                      rows="3"
                      name="address"
                      value={form.address}
                      onChange={change}
                      placeholder="Enter business address"
                    />
                  </div>
                </Field>
              </div>

              {/* =================================================
                  MODAL ACTIONS
              ================================================== */}

              <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E4EAEC] bg-[#FAFCFC] p-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() =>
                    setModal(null)
                  }
                  className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#DCE5E8] bg-white px-4 text-xs font-black text-[#68797F] transition hover:bg-[#F3F7F8] sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#C2DFE3] px-5 text-xs font-black text-[#34464B] shadow-sm transition duration-200 hover:bg-[#B2D4D9] hover:shadow-md sm:w-auto"
                >
                  {modal.type === "edit" ? (
                    <Edit3 size={15} />
                  ) : (
                    <Plus size={16} />
                  )}

                  {modal.type === "edit"
                    ? "Update supplier"
                    : "Save supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION
      ====================================================== */}

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

      {/* =====================================================
          LOCAL INPUT STYLES
      ====================================================== */}

      <style>{`
        .supplier-input {
          width: 100%;
          min-height: 42px;
          border-radius: 11px;
          border: 1px solid #dce5e8;
          background: #f9fbfb;
          padding: 9px 12px;
          font-size: 12px;
          font-weight: 500;
          color: #35464b;
          outline: none;
          transition: all 0.2s ease;
        }

        .supplier-input::placeholder {
          color: #a2adb1;
        }

        .supplier-input:hover {
          border-color: #cbdde0;
          background: #ffffff;
        }

        .supplier-input:focus {
          border-color: #9fbfc5;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(194, 223, 227, 0.28);
        }

        .label {
          display: block;
          margin-bottom: 7px;
          font-size: 11px;
          font-weight: 800;
          color: #607278;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#DCE5E8] bg-white p-3.5 shadow-[0_3px_14px_rgba(38,50,56,0.04)] sm:p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF2F3] text-[#667A80]">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[9px] font-bold uppercase tracking-wide text-[#9AA7AB]">
          {label}
        </p>

        <p className="mt-0.5 text-lg font-black text-[#455960]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SUPPLIER DETAIL
========================================================= */

function SupplierDetail({
  icon: Icon,
  label,
  value,
  multiline = false,
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F0F5F6] text-[#788A90]">
        <Icon size={14} />
      </div>

      <div className="min-w-0 pt-0.5">
        <p className="text-[8px] font-black uppercase tracking-wide text-[#A0ACB0]">
          {label}
        </p>

        <p
          className={`mt-0.5 text-[11px] font-semibold leading-4 text-[#586A70] ${
            multiline
              ? "line-clamp-2"
              : "truncate"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function Field({ label, children }) {
  return (
    <div>
      <label className="label">
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   FORM ICONS
========================================================= */

function UserFieldIcon() {
  return (
    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA7AB]">
      <Users size={15} />
    </div>
  );
}

function BuildingFieldIcon() {
  return (
    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA7AB]">
      <Building2 size={15} />
    </div>
  );
}