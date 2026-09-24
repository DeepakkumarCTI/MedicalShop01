export default function PageHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">

        {/* Section Label */}
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8CAEB5]" />

          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8C9CA1] sm:text-[10px]">
            Management
          </p>
        </div>

        {/* Page Title */}
        <h2 className="truncate text-2xl font-black tracking-tight text-[#35464B] sm:text-3xl">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="mt-1.5 max-w-2xl text-xs font-medium leading-5 text-[#829197] sm:mt-2 sm:text-sm">
            {description}
          </p>
        )}
      </div>

      {/* Page Action */}
      {action && (
        <div className="w-full shrink-0 sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}