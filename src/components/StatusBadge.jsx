export function StockBadge({ medicine }) {
  const quantity = Number(medicine.quantity);
  const reorder = Number(medicine.reorderLevel || 0);

  if (quantity === 0) {
    return (
      <
      >
        Out of stock  |
      </>
    );
  }

  if (quantity <= reorder) {
    return (
      <
      >
        Low stock  | 
      </>
    );
  }

  return (
    <
    >
      In stock  |
    </>
  );
}

export function ExpiryBadge({ date }) {
  const today = new Date();
  const expiry = new Date(`${date}T23:59:59`);

  const inThirty = new Date(today);
  inThirty.setDate(today.getDate() + 30);

  if (expiry < today) {
    return (
      <
      >
       |   Expired
      </>
    );
  }

  if (expiry <= inThirty) {
    return (
      < 
      >
        |  Expiring soon
      </>
    );
  }

  return (
    <>
        |  Valid
      </>
      
    
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