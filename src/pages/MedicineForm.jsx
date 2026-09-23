import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/PageHeader";

const emptyForm = {
  name: "",
  code: "",
  category: "Tablet",
  manufacturer: "",
  batch: "",
  quantity: 0,
  reorderLevel: 10,
  unitPrice: 0,
  expiryDate: "",
  supplierId: "",
  description: "",
};

export default function MedicineForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, addMedicine, updateMedicine } = useApp();

  const existing = useMemo(
    () => data.medicines.find((item) => item.id === id),
    [data.medicines, id]
  );

  const [form, setForm] = useState(existing || emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existing) setForm(existing);
  }, [existing]);

  const isEdit = Boolean(id);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.code.trim() ||
      !form.manufacturer.trim() ||
      !form.batch.trim() ||
      !form.expiryDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isEdit) updateMedicine(id, form);
    else addMedicine(form);

    navigate("/medicines");
  };

  if (isEdit && !existing) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF275] text-[#3A0CA3]">
          <span className="text-xl font-extrabold">!</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Medicine not found
        </h2>

        <Link
          to="/medicines"
          className="mt-4 inline-flex text-sm font-bold text-[#3A0CA3] transition hover:underline"
        >
          Back to medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={isEdit ? "Edit medicine" : "Add medicine"}
        description={
          isEdit
            ? "Update medicine details and inventory information."
            : "Add a new medicine to your shop inventory."
        }
        action={
          <Link to="/medicines" className="btn-secondary">
            <ArrowLeft size={17} />
            Back
          </Link>
        }
      />

      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Medicine Information */}
        <section className="card p-5 sm:p-6">
          <div className="mb-5 border-b border-slate-100 pb-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#3A0CA3]" />

              <h3 className="font-extrabold text-slate-900">
                Medicine information
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Basic identification and product details.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Medicine name *">
              <input
                name="name"
                className="input"
                value={form.name}
                onChange={change}
                placeholder="e.g. Paracetamol 500mg"
              />
            </Field>

            <Field label="Medicine code *">
              <input
                name="code"
                className="input"
                value={form.code}
                onChange={change}
                placeholder="e.g. MED-1009"
              />
            </Field>

            <Field label="Category">
              <select
                name="category"
                className="input"
                value={form.category}
                onChange={change}
              >
                {[
                  "Tablet",
                  "Capsule",
                  "Syrup",
                  "Injection",
                  "Sachet",
                  "Drops",
                  "Cream",
                  "Other",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>

            <Field label="Manufacturer *">
              <input
                name="manufacturer"
                className="input"
                value={form.manufacturer}
                onChange={change}
                placeholder="Manufacturer name"
              />
            </Field>

            <Field label="Batch number *">
              <input
                name="batch"
                className="input"
                value={form.batch}
                onChange={change}
                placeholder="e.g. B2026-001"
              />
            </Field>

            <Field label="Unit price (₹)">
              <input
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                className="input"
                value={form.unitPrice}
                onChange={change}
              />
            </Field>
          </div>
        </section>

        {/* Inventory & Expiry */}
        <section className="card p-5 sm:p-6">
          <div className="mb-5 border-b border-slate-100 pb-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#FFF275] ring-1 ring-[#3A0CA3]/20" />

              <h3 className="font-extrabold text-slate-900">
                Inventory & expiry
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Keep stock levels and expiry information up to date.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Quantity">
              <input
                name="quantity"
                type="number"
                min="0"
                className="input"
                value={form.quantity}
                onChange={change}
              />
            </Field>

            <Field label="Reorder level">
              <input
                name="reorderLevel"
                type="number"
                min="0"
                className="input"
                value={form.reorderLevel}
                onChange={change}
              />
            </Field>

            <Field label="Expiry date *">
              <div className="relative">
                <input
                  name="expiryDate"
                  type="date"
                  className="input pr-10"
                  value={form.expiryDate}
                  onChange={change}
                />

                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3A0CA3]"
                />
              </div>
            </Field>
          </div>
        </section>

        {/* Supplier Details */}
        <section className="card p-5 sm:p-6">
          <div className="mb-5 border-b border-slate-100 pb-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#3A0CA3]" />

              <h3 className="font-extrabold text-slate-900">
                Supplier details
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Link this medicine to a supplier already in the system.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Supplier">
              <select
                name="supplierId"
                className="input"
                value={form.supplierId}
                onChange={change}
              >
                <option value="">Select supplier</option>

                {data.suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} — {supplier.company}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                rows="3"
                className="input resize-none"
                value={form.description}
                onChange={change}
                placeholder="Optional notes about this medicine..."
              />
            </Field>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <Link to="/medicines" className="btn-secondary">
            Cancel
          </Link>

          <button type="submit" className="btn-primary">
            <Save size={18} />
            {isEdit ? "Update medicine" : "Save medicine"}
          </button>
        </div>
      </form>
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