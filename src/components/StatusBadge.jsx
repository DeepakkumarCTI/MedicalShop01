
export function StockBadge({ medicine }) {
  const quantity = Number(medicine.quantity);
  const reorder = Number(medicine.reorderLevel || 0);

  if (quantity === 0) {
    return (
      <Badge className="border border-rose-200 bg-rose-50 text-rose-700">
        Out of stock
      </Badge>
    );
  }

  if (quantity <= reorder) {
    return (
      <Badge className="border border-[C2DFE3] bg-[#5C6B73] text-[#6A414B]">
        Low stock
      </Badge>
    );
  }

  return (
    <Badge className="border border-[C2DFE3]/70 bg-[C2DFE3]/35 text-[#6A414B]">
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
      <Badge className="border border-rose-200 bg-rose-50 text-rose-700">
        Expired
      </Badge>
    );
  }

  if (expiry <= inThirty) {
    return (
      <Badge className="border border-[C2DFE3] bg-[#5C6B73] text-[#6A414B]">
        Expiring soon
      </Badge>
    );
  }

  return (
    <Badge className="border border-[C2DFE3]/70 bg-[C2DFE3]/35 text-[#6A414B]">
      Valid
    </Badge>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}

