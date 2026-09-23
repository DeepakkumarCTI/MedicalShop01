export function StockBadge({ medicine }) {
  const quantity = Number(medicine.quantity);
  const reorder = Number(medicine.reorderLevel || 0);

  if (quantity === 0) {
    return (
      <Badge className="bg-rose-50 text-rose-700">
        Out of stock
      </Badge>
    );
  }

  if (quantity <= reorder) {
    return (
      <Badge className="bg-[#FFF275] text-[#3A0CA3]">
        Low stock
      </Badge>
    );
  }

  return (
    <Badge className="bg-[#3A0CA3]/10 text-[#3A0CA3]">
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
      <Badge className="bg-rose-50 text-rose-700">
        Expired
      </Badge>
    );
  }

  if (expiry <= inThirty) {
    return (
      <Badge className="bg-[#FFF275] text-[#3A0CA3]">
        Expiring soon
      </Badge>
    );
  }

  return (
    <Badge className="bg-[#3A0CA3]/10 text-[#3A0CA3]">
      Valid
    </Badge>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}