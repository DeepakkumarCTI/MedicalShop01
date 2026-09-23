export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {/* Section Label */}
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#3A0CA3]">
          Management
        </p>

        {/* Page Title */}
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {/* Page Action */}
      {action}
    </div>
  );
}