
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Package,
  Pill,
  Save,
  Truck,
} from "lucide-react";
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
    if (existing) {
      setForm(existing);
    }
  }, [existing]);

  const isEdit = Boolean(id);

  const change = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
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

    if (isEdit) {
      updateMedicine(id, form);
    } else {
      addMedicine(form);
    }

    navigate("/medicines");
  };

  if (isEdit && !existing) {
    return (
      <div className="min-h-[70vh] bg-[#F5F7F8] px-4 py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#E4EAED] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7E9EC] text-[#8E5A68]">
            <span className="text-2xl font-black">!</span>
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-[#3F2930]">
            Medicine not found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            The medicine you are trying to edit could not be found in the
            current inventory.
          </p>

          <Link
            to="/medicines"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#C2DFE3] px-4 text-sm font-bold text-[#3F2930] transition hover:bg-[#AFCFD4]"
          >
            <ArrowLeft size={16} />
            Back to medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-10">
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

      <form onSubmit={submit} className="mt-6 space-y-5">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm font-semibold text-rose-700 shadow-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-black">
              !
            </span>

            <p>{error}</p>
          </div>
        )}

        {/* Medicine Information */}
        <section className="overflow-hidden rounded-2xl border border-[#E3E8EA] bg-white shadow-[0_4px_20px_rgba(63,41,48,0.04)]">
          <SectionHeader
            icon={Pill}
            title="Medicine information"
            description="Basic identification and product details."
          />

          <div className="p-5 sm:p-6">
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
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#A96F7D]">
                    ₹
                  </span>

                  <input
                    name="unitPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="input pl-9"
                    value={form.unitPrice}
                    onChange={change}
                  />
                </div>
              </Field>
            </div>
          </div>
        </section>

        {/* Inventory & Expiry */}
        <section className="overflow-hidden rounded-2xl border border-[#E3E8EA] bg-white shadow-[0_4px_20px_rgba(63,41,48,0.04)]">
          <SectionHeader
            icon={Package}
            title="Inventory & expiry"
            description="Keep stock levels and expiry information up to date."
          />

          <div className="p-5 sm:p-6">
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
                    className="input pr-11"
                    value={form.expiryDate}
                    onChange={change}
                  />

                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A96F7D]"
                  />
                </div>
              </Field>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#DDE8EA] bg-[#F4F8F9] px-4 py-3.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#DCECEF]">
                <CheckCircle2 size={16} className="text-[#6C8C95]" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#4B363C]">
                  Stock reorder reminder
                </p>

                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Set the reorder level to receive stock attention when the
                  quantity reaches the specified limit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supplier Details */}
        <section className="overflow-hidden rounded-2xl border border-[#E3E8EA] bg-white shadow-[0_4px_20px_rgba(63,41,48,0.04)]">
          <SectionHeader
            icon={Truck}
            title="Supplier details"
            description="Link this medicine to a supplier already in the system."
          />

          <div className="p-5 sm:p-6">
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
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#E3E8EA] pt-5 sm:flex-row sm:justify-end">
          <Link
            to="/medicines"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#DCE2E5] bg-white px-5 text-sm font-bold text-slate-600 transition hover:border-[#C2DFE3] hover:bg-[#F5F9FA] hover:text-[#4B363C]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#C2DFE3] px-6 text-sm font-extrabold text-[#3F2930] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#AFCFD4] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#C2DFE3]/40"
          >
            <Save size={18} />
            {isEdit ? "Update medicine" : "Save medicine"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#E7ECEE] bg-gradient-to-r from-[#F3F7F8] to-white px-5 py-4 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCECEF] text-[#5E3C45] shadow-sm">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-extrabold text-[#3F2930] sm:text-base">
            {title}
          </h3>

          <span className="hidden h-1.5 w-1.5 rounded-full bg-[#AFCFD4] sm:block" />
        </div>

        <p className="mt-0.5 text-[11px] leading-5 text-slate-500 sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-[#4B363C] sm:text-sm">
        {label}
      </label>

      {children}
    </div>
  );
}

