export function StockBadge({ medicine }) {
  const quantity = Number(medicine.quantity);
  const reorder = Number(medicine.reorderLevel || 0);

  if (quantity === 0) {
    return (
      <Badge className="border border-rose-200 bg-rose-50 text-rose-600">
        Out of stock
      </Badge>
    );
  }

  if (quantity <= reorder) {
    return (
      <Badge className="border border-[#D8E7E9] bg-[#EDF5F6] text-[#61777D]">
        Low stock
      </Badge>
    );
  }

  return (
    <Badge className="border border-[#D5E5E7] bg-[#F1F7F8] text-[#60767C]">
      In stock
    </Badge>
  );
}

export function ExpiryBadge({ date }) {
  const today = new Date();
  const expiry = new Date(`${date}T23:59:59`);

  const inThirty = new Date(today);
  inThirty.setDate(today.getDate() + 30);

  if (expiry < today) {
    return (
      <Badge className="border border-rose-200 bg-rose-50 text-rose-600">
        Expired
      </Badge>
    );
  }

  if (expiry <= inThirty) {
    return (
      <Badge className="border border-[#D8E7E9] bg-[#EDF5F6] text-[#61777D]">
        Expiring soon
      </Badge>
    );
  }

  return (
    <Badge className="border border-[#D5E5E7] bg-[#F1F7F8] text-[#60767C]">
      Valid
    </Badge>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}