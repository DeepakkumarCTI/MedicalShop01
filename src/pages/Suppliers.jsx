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
  const { data, addSupplier, updateSupplier, deleteSupplier } = useApp();

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blank);
  const [deleteId, setDeleteId] = useState(null);

  const openAdd = () => {
    setForm(blank);
    setModal({ type: "add" });
  };

  const openEdit = (supplier) => {
    setForm(supplier);
    setModal({ type: "edit", id: supplier.id });
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
    data.medicines.filter((m) => m.supplierId === supplierId).length;

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        title="Suppliers"
        description="Maintain supplier contact details and linked medicines."
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus size={18} />
            Add supplier
          </button>
        }
      />

      {data.suppliers.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="card p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Supplier Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#FFF275] text-[#3A0CA3]">
                    <Truck size={21} />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      {supplier.name}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {supplier.company}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-[#3A0CA3]/10 px-2.5 py-1 text-xs font-bold text-[#3A0CA3]">
                  {medicineCount(supplier.id)} medicines
                </span>
              </div>

              {/* Supplier Details */}
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Phone size={16} className="text-[#3A0CA3]" />
                  {supplier.phone}
                </div>

                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Mail size={16} className="text-[#3A0CA3]" />

                  <span className="truncate">
                    {supplier.email || "No email"}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-sm leading-5 text-slate-600">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-[#3A0CA3]"
                  />

                  {supplier.address || "No address"}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => openEdit(supplier)}
                  className="btn-secondary px-3 py-2 text-xs"
                >
                  <Edit3 size={15} />
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(supplier.id)}
                  className="btn-danger px-3 py-2 text-xs"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="card p-14 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#FFF275] text-[#3A0CA3]">
            <Building2 size={21} />
          </div>

          <h3 className="mt-3 font-bold text-slate-800">
            No suppliers yet
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Add your first supplier to link it to medicines.
          </p>
        </div>
      )}

      {/* Add / Edit Supplier Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#3A0CA3]">
                  Supplier
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                  {modal.type === "edit"
                    ? "Edit supplier"
                    : "Add supplier"}
                </h3>
              </div>

              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-[#FFF275]/50 hover:text-[#3A0CA3]"
              >
                <X size={19} />
              </button>
            </div>

            {/* Supplier Form */}
            <form onSubmit={submit} className="mt-6 grid gap-4">
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
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button className="btn-primary">
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

      {/* Delete Confirmation */}
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