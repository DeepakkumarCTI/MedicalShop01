export function StockBadge({ medicine }) {
  const quantity = Number(medicine.quantity);
  const reorder = Number(medicine.reorderLevel || 0);

  if (quantity === 0) {
    return (
      <Badge
        image="/images/total.png"
        className="border border-rose-200 bg-rose-50 text-rose-600"
      >
        Out of stock
      </Badge>
    );
  }

  if (quantity <= reorder) {
    return (
      <Badge
        image="/images/total.png"
        className="border border-[#D8E7E9] bg-[#EDF5F6] text-[#61777D]"
      >
        Low stock
      </Badge>
    );
  }

  return (
    <Badge
      image="/images/total.png"
      className="border border-[#D5E5E7] bg-[#F1F7F8] text-[#60767C]"
    >
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
      <Badge
        image="/images/total.png"
        className="border border-rose-200 bg-rose-50 text-rose-600"
      >
        Expired
      </Badge>
    );
  }

  if (expiry <= inThirty) {
    return (
      <Badge
        image="/images/total.png"
        className="border border-[#D8E7E9] bg-[#EDF5F6] text-[#61777D]"
      >
        Expiring soon
      </Badge>
    );
  }

  return (
    <Badge
      image="/images/total.png"
      className="border border-[#D5E5E7] bg-[#F1F7F8] text-[#60767C]"
    >
      Valid
    </Badge>
  );
}

function Badge({ children, className, image }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-black tracking-wide ${className}`}
    >
      <img
        src={image}
        alt=""
        className="h-4 w-4 shrink-0 object-contain"
      />

      {children}
    </span>
  );
}