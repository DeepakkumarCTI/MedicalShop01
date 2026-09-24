
export default function PageHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {/* Section Label */}
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A96F7D] sm:text-xs">
          Management
        </p>

        {/* Page Title */}
        <h2 className="text-2xl font-extrabold tracking-tight text-[#3F2930] sm:text-3xl">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[#8F7A80] sm:mt-1.5 sm:text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Page Action */}
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

