import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Mail,
  Minus,
  Phone,
  Plus,
  Printer,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

/* =========================================================
   HELPERS
========================================================= */

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   PHARMACY
========================================================= */

const PHARMACY = {
  name: "MediCare Pharmacy",
  address: "123, Main Road, Coimbatore, Tamil Nadu - 641001",
  phone: "+91 98765 43210",
  email: "medicare@example.com",
  gstin: "33ABCDE1234F1Z5",
  drugLicense: "TN-PH-123456",
  state: "Tamil Nadu",
  stateCode: "33",
};

const DEFAULT_GST_RATE = 18;

/* =========================================================
   NUMBER TO WORDS
========================================================= */

const numberToWords = (value) => {
  const number = Math.round(Number(value || 0));

  if (number === 0) {
    return "Zero Rupees Only";
  }

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];

  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const twoDigits = (n) => {
    if (n < 10) return ones[n];

    if (n < 20) {
      return teens[n - 10];
    }

    return (
      tens[Math.floor(n / 10)] +
      (n % 10 ? ` ${ones[n % 10]}` : "")
    );
  };

  const threeDigits = (n) => {
    if (n < 100) {
      return twoDigits(n);
    }

    return (
      `${ones[Math.floor(n / 100)]} Hundred` +
      (n % 100 ? ` ${twoDigits(n % 100)}` : "")
    );
  };

  let result = "";

  const crore = Math.floor(number / 10000000);
  let remainder = number % 10000000;

  const lakh = Math.floor(remainder / 100000);
  remainder %= 100000;

  const thousand = Math.floor(remainder / 1000);
  remainder %= 1000;

  const hundred = remainder;

  if (crore) {
    result += `${threeDigits(crore)} Crore `;
  }

  if (lakh) {
    result += `${threeDigits(lakh)} Lakh `;
  }

  if (thousand) {
    result += `${threeDigits(thousand)} Thousand `;
  }

  if (hundred) {
    result += `${threeDigits(hundred)} `;
  }

  return `${result.trim()} Rupees Only`;
};

/* =========================================================
   TAX CALCULATION
========================================================= */

const getItemTaxDetails = (item) => {
  const rawGst =
    item?.gstRate ??
    item?.gst ??
    item?.taxRate ??
    DEFAULT_GST_RATE;

  const parsedGst = Number(rawGst);

  const gstRate = Number.isFinite(parsedGst)
    ? Math.max(0, Math.min(100, parsedGst))
    : DEFAULT_GST_RATE;

  const quantity = Math.max(
    Number(item?.quantity || 0),
    0
  );

  const unitPrice = Math.max(
    Number(item?.unitPrice || 0),
    0
  );

  const discount = Math.max(
    Number(
      item?.discount ??
        item?.discountAmount ??
        0
    ),
    0
  );

  const gross = quantity * unitPrice;

  const taxableValue = Math.max(
    gross - discount,
    0
  );

  const gstAmount =
    taxableValue * (gstRate / 100);

  const cgstRate = gstRate / 2;
  const sgstRate = gstRate / 2;

  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  const total = taxableValue + gstAmount;

  return {
    gstRate,
    cgstRate,
    sgstRate,
    quantity,
    unitPrice,
    gross,
    discount,
    taxableValue,
    gstAmount,
    cgstAmount,
    sgstAmount,
    total,
  };
};

const calculateInvoiceTotals = (items) => {
  const details = items.map(getItemTaxDetails);

  const subtotal = details.reduce(
    (sum, item) => sum + item.gross,
    0
  );

  const discount = details.reduce(
    (sum, item) => sum + item.discount,
    0
  );

  const taxableAmount = details.reduce(
    (sum, item) => sum + item.taxableValue,
    0
  );

  const cgst = details.reduce(
    (sum, item) => sum + item.cgstAmount,
    0
  );

  const sgst = details.reduce(
    (sum, item) => sum + item.sgstAmount,
    0
  );

  const gst = cgst + sgst;

  const grandTotal = taxableAmount + gst;

  return {
    details,
    subtotal,
    discount,
    taxableAmount,
    cgst,
    sgst,
    gst,
    grandTotal,
  };
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function StaffCreateBill() {
  const { data, createSale } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  const initialCart = location.state?.cart || [];

  const [cart, setCart] = useState(() =>
    initialCart.map((item) => ({
      ...item,
      gstRate:
        item.gstRate ??
        item.gst ??
        item.taxRate ??
        DEFAULT_GST_RATE,
    }))
  );

  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
  });

  const [paymentMode, setPaymentMode] =
    useState("Cash");

  const [error, setError] = useState("");
  const [bill, setBill] = useState(null);

  const medicines = data?.medicines || [];

  /* =======================================================
     TOTALS
  ======================================================= */

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0) *
          Number(item.unitPrice || 0),
      0
    );
  }, [cart]);

  const cartInvoiceTotals = useMemo(
    () => calculateInvoiceTotals(cart),
    [cart]
  );

  /* =======================================================
     BACK
  ======================================================= */

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/staff", {
      replace: true,
    });
  };

  /* =======================================================
     QUANTITY
  ======================================================= */

  const changeQuantity = (
    medicineId,
    nextQuantity
  ) => {
    const medicine = medicines.find(
      (item) => item.id === medicineId
    );

    if (!medicine) return;

    if (nextQuantity <= 0) {
      setCart((current) =>
        current.filter(
          (item) =>
            item.medicineId !== medicineId
        )
      );

      return;
    }

    const availableStock = Math.max(
      Number(medicine.quantity || 0),
      0
    );

    const safeQuantity = Math.min(
      Number(nextQuantity),
      availableStock
    );

    setCart((current) =>
      current.map((item) =>
        item.medicineId === medicineId
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item
      )
    );
  };

  /* =======================================================
     GST
  ======================================================= */

  const changeGstRate = (
    medicineId,
    value
  ) => {
    let gstValue = Number(value);

    if (!Number.isFinite(gstValue)) {
      gstValue = 0;
    }

    gstValue = Math.max(
      0,
      Math.min(100, gstValue)
    );

    setCart((current) =>
      current.map((item) =>
        item.medicineId === medicineId
          ? {
              ...item,
              gstRate: gstValue,
            }
          : item
      )
    );
  };

  /* =======================================================
     GENERATE BILL
  ======================================================= */

  const generateBill = (e) => {
    e.preventDefault();

    setError("");

    if (!customer.name.trim()) {
      setError(
        "Please enter the customer name."
      );
      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        customer.mobile.trim()
      )
    ) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!cart.length) {
      setError(
        "Please add at least one medicine to the bill."
      );
      return;
    }

    try {
      const billCart = cart.map((item) => ({
        ...item,
        gstRate: Number(
          item.gstRate ?? DEFAULT_GST_RATE
        ),
      }));

      const result = createSale(
        customer,
        billCart
      );

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to create the bill."
        );
        return;
      }

      const sale = result.sale || {};

      setBill({
        ...sale,
        items: billCart,
        customerName:
          sale.customerName ||
          customer.name,
        customerMobile:
          sale.customerMobile ||
          customer.mobile,
        paymentMode,
        pharmacy: PHARMACY,
        createdAt:
          sale.createdAt ||
          new Date().toISOString(),
      });

      setCustomer({
        name: "",
        mobile: "",
      });

      setCart([]);
    } catch (err) {
      console.error(
        "Create bill error:",
        err
      );

      setError(
        "Something went wrong while creating the bill."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F8]">
      <style>{`
        @keyframes billOverlay {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes billPopup {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes successPop {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }

          70% {
            transform: scale(1.08);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .bill-overlay-animation {
          animation: billOverlay 0.2s ease-out;
        }

        .bill-popup-animation {
          animation: billPopup 0.3s ease-out;
        }

        .success-icon-animation {
          animation: successPop 0.45s ease-out;
        }

        .billing-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #D7E1E4;
          background: #FFFFFF;
          padding: 11px 13px;
          font-size: 13px;
          outline: none;
          color: #263238;
          transition: all 0.2s ease;
        }

        .billing-input::placeholder {
          color: #9AA8AD;
        }

        .billing-input:focus {
          border-color: #6B8792;
          box-shadow: 0 0 0 3px rgba(107, 135, 146, 0.12);
        }

        .billing-label {
          display: block;
          margin-bottom: 7px;
          font-size: 11px;
          font-weight: 800;
          color: #53666E;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .gst-input {
          width: 72px;
          border-radius: 9px;
          border: 1px solid #D7E1E4;
          background: white;
          padding: 7px;
          text-align: center;
          font-size: 12px;
          font-weight: 800;
          color: #344850;
          outline: none;
        }

        .gst-input:focus {
          border-color: #6B8792;
          box-shadow: 0 0 0 2px rgba(107, 135, 146, 0.12);
        }

        .invoice-scroll {
          scrollbar-width: thin;
          scrollbar-color: #A8BAC1 #EEF2F3;
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          .print-bill,
          .print-bill * {
            visibility: visible !important;
          }

          .print-bill {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 5px !important;
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .invoice-page {
            box-shadow: none !important;
            border: 1px solid #222 !important;
          }
        }
      `}</style>

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#DDE6E8] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#415A63] text-white shadow-sm">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="text-base font-black tracking-tight text-[#263238]">
                MediCare
              </p>

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#7A8C93]">
                Staff Billing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D7E1E4] bg-white px-3.5 py-2.5 text-xs font-bold text-[#52666E] transition hover:border-[#9DB4BC] hover:bg-[#F4F7F8] sm:text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1180px] px-3 py-6 sm:px-6 sm:py-8">
        {/* PAGE TITLE */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E4EEF0] text-[#526D77]">
              <FileText size={21} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight text-[#263238] sm:text-2xl">
                Create Bill
              </h1>

              <p className="mt-1 text-xs text-[#7A8C93] sm:text-sm">
                Create a professional invoice for your customer.
              </p>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="hidden rounded-xl border border-[#D7E1E4] bg-white px-3 py-2 text-right shadow-sm sm:block">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#8A9BA1]">
                Items
              </p>

              <p className="text-lg font-black text-[#344850]">
                {cart.reduce(
                  (sum, item) =>
                    sum +
                    Number(item.quantity || 0),
                  0
                )}
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            EMPTY CART
        ================================================= */}

        {!initialCart.length && !cart.length ? (
          <div className="rounded-2xl border border-[#DDE6E8] bg-white px-6 py-14 text-center shadow-sm sm:px-12">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#E8F0F2] text-[#607982]">
              <ShoppingCart size={29} />
            </div>

            <h2 className="mt-5 text-lg font-black text-[#263238]">
              No medicines selected
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-[#84949A]">
              Select medicines from the inventory before creating a bill.
            </p>

            <button
              type="button"
              onClick={goBack}
              className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl bg-[#415A63] px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#344A52] hover:shadow-md"
            >
              <ArrowLeft size={16} />
              Back to medicines
            </button>
          </div>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* =================================================
                LEFT - MEDICINES
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-[#DDE6E8] bg-white shadow-sm">
              {/* SECTION HEADER */}

              <div className="border-b border-[#E4EAEC] bg-[#FAFCFC] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E4EEF0] text-[#536E78]">
                      <ShoppingCart size={18} />
                    </div>

                    <div>
                      <h2 className="text-base font-black text-[#263238] sm:text-lg">
                        Selected Medicines
                      </h2>

                      <p className="mt-0.5 text-[11px] text-[#84949A]">
                        Adjust quantity and GST before billing.
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#EEF3F4] px-3 py-1 text-[10px] font-extrabold text-[#60747C]">
                    {cart.length}{" "}
                    {cart.length === 1
                      ? "Medicine"
                      : "Medicines"}
                  </span>
                </div>
              </div>

              {/* MEDICINE LIST */}

              <div className="space-y-3 p-4 sm:p-5">
                {cart.map((item, index) => {
                  const itemTax =
                    getItemTaxDetails(item);

                  return (
                    <div
                      key={item.medicineId}
                      className="rounded-2xl border border-[#E0E8EA] bg-[#FBFCFC] p-4 transition hover:border-[#B9C9CE] hover:shadow-sm"
                    >
                      {/* TOP */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#415A63] text-sm font-black text-white">
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-[#263238]">
                              {item.name}
                            </p>

                            <p className="mt-1 text-[11px] text-[#87979D]">
                              {item.code ||
                                "No medicine code"}
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#87979D]">
                              Unit price:{" "}
                              <span className="font-bold text-[#566A72]">
                                {money(
                                  item.unitPrice
                                )}
                              </span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.medicineId,
                              0
                            )
                          }
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#A86C72] transition hover:bg-[#FBECEE] hover:text-[#9B565E]"
                          title="Remove medicine"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* DIVIDER */}

                      <div className="my-4 h-px bg-[#E7ECEE]" />

                      {/* CONTROLS */}

                      <div className="grid gap-4 sm:grid-cols-3">
                        {/* QUANTITY */}

                        <div>
                          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#89999F]">
                            Quantity
                          </p>

                          <div className="inline-flex items-center rounded-xl border border-[#D8E2E5] bg-white p-1">
                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(
                                  item.medicineId,
                                  Number(
                                    item.quantity
                                  ) - 1
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-lg text-[#536970] transition hover:bg-[#EDF2F3]"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="w-9 text-center text-sm font-black text-[#263238]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                changeQuantity(
                                  item.medicineId,
                                  Number(
                                    item.quantity
                                  ) + 1
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-lg text-[#536970] transition hover:bg-[#EDF2F3]"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* GST */}

                        <div>
                          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#89999F]">
                            GST Rate
                          </p>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={
                                item.gstRate ??
                                DEFAULT_GST_RATE
                              }
                              onChange={(e) =>
                                changeGstRate(
                                  item.medicineId,
                                  e.target.value
                                )
                              }
                              className="gst-input"
                            />

                            <span className="text-xs font-bold text-[#667980]">
                              %
                            </span>
                          </div>
                        </div>

                        {/* TAX */}

                        <div>
                          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#89999F]">
                            Tax Split
                          </p>

                          <div className="inline-flex rounded-xl bg-[#EEF4F5] px-3 py-2">
                            <span className="text-xs font-black text-[#526970]">
                              CGST{" "}
                              {itemTax.cgstRate}%
                            </span>

                            <span className="mx-2 text-[#B2C0C4]">
                              /
                            </span>

                            <span className="text-xs font-black text-[#526970]">
                              SGST{" "}
                              {itemTax.sgstRate}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AMOUNT */}

                      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F0F5F6] px-3.5 py-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A9BA1]">
                            Item Total
                          </p>

                          <p className="mt-0.5 text-[11px] text-[#71848B]">
                            Including GST
                          </p>
                        </div>

                        <p className="text-base font-black text-[#344F58]">
                          {money(itemTax.total)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* CART SUMMARY */}

                <div className="rounded-2xl border border-[#D8E3E6] bg-[#F5F8F9] p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-wider text-[#536870]">
                      Bill Summary
                    </p>

                    <FileText
                      size={16}
                      className="text-[#82949A]"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <SummaryRow
                      label="Subtotal"
                      value={money(cartTotal)}
                    />

                    <SummaryRow
                      label="Discount"
                      value={`- ${money(
                        cartInvoiceTotals.discount
                      )}`}
                    />

                    <SummaryRow
                      label="Taxable Amount"
                      value={money(
                        cartInvoiceTotals.taxableAmount
                      )}
                    />

                    <SummaryRow
                      label="Total GST"
                      value={money(
                        cartInvoiceTotals.gst
                      )}
                    />
                  </div>

                  <div className="mt-4 border-t border-[#D8E2E5] pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#7E9096]">
                          Invoice Total
                        </p>

                        <p className="mt-0.5 text-xs text-[#8C9BA0]">
                          Final amount payable
                        </p>
                      </div>

                      <p className="text-2xl font-black tracking-tight text-[#344F58]">
                        {money(
                          cartInvoiceTotals.grandTotal
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                RIGHT - CUSTOMER
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-[#DDE6E8] bg-white shadow-sm">
              {/* HEADER */}

              <div className="border-b border-[#E4EAEC] bg-[#FAFCFC] px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E4EEF0] text-[#536E78]">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <h2 className="text-base font-black text-[#263238] sm:text-lg">
                      Customer Details
                    </h2>

                    <p className="mt-0.5 text-[11px] text-[#84949A]">
                      Enter billing information.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={generateBill}
                className="p-4 sm:p-5"
              >
                {/* ERROR */}

                {error && (
                  <div className="mb-4 flex gap-2.5 rounded-xl border border-[#F2C8CC] bg-[#FFF5F6] p-3 text-xs font-semibold text-[#A44F58]">
                    <AlertTriangle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* NAME */}

                  <div>
                    <label className="billing-label">
                      Customer Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0ADB1]"
                      />

                      <input
                        className="billing-input pl-10"
                        value={customer.name}
                        onChange={(e) => {
                          setCustomer(
                            (previous) => ({
                              ...previous,
                              name: e.target.value,
                            })
                          );

                          setError("");
                        }}
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* MOBILE */}

                  <div>
                    <label className="billing-label">
                      Mobile Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0ADB1]"
                      />

                      <input
                        className="billing-input pl-10"
                        inputMode="numeric"
                        maxLength={10}
                        value={customer.mobile}
                        onChange={(e) => {
                          setCustomer(
                            (previous) => ({
                              ...previous,
                              mobile:
                                e.target.value.replace(
                                  /\D/g,
                                  ""
                                ),
                            })
                          );

                          setError("");
                        }}
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* PAYMENT */}

                  <div>
                    <label className="billing-label">
                      Payment Mode
                    </label>

                    <select
                      className="billing-input"
                      value={paymentMode}
                      onChange={(e) =>
                        setPaymentMode(
                          e.target.value
                        )
                      }
                    >
                      <option value="Cash">
                        Cash
                      </option>

                      <option value="UPI">
                        UPI
                      </option>

                      <option value="Card">
                        Card
                      </option>

                      <option value="Net Banking">
                        Net Banking
                      </option>
                    </select>
                  </div>
                </div>

                {/* GST INFORMATION */}

                <div className="mt-5 rounded-2xl border border-[#DDE7E9] bg-[#F4F8F9] p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#E1ECEE] text-[#526D76]">
                      <ShieldCheck size={17} />
                    </div>

                    <div>
                      <p className="text-xs font-black text-[#344850]">
                        GST Editable
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-[#7D8E94]">
                        GST can be adjusted individually for each medicine before generating the invoice.
                      </p>
                    </div>
                  </div>
                </div>

                {/* QUICK SUMMARY */}

                <div className="mt-4 rounded-2xl border border-[#E0E7E9] bg-white p-4">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-[#71838A]">
                    Invoice Summary
                  </p>

                  <div className="space-y-2.5">
                    <SummaryRow
                      label="Total Items"
                      value={cart.reduce(
                        (sum, item) =>
                          sum +
                          Number(
                            item.quantity || 0
                          ),
                        0
                      )}
                    />

                    <SummaryRow
                      label="GST"
                      value={money(
                        cartInvoiceTotals.gst
                      )}
                    />

                    <SummaryRow
                      label="Taxable Amount"
                      value={money(
                        cartInvoiceTotals.taxableAmount
                      )}
                    />
                  </div>

                  <div className="mt-4 rounded-xl bg-[#415A63] px-4 py-3.5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">
                        Total Payable
                      </span>

                      <span className="text-lg font-black">
                        {money(
                          cartInvoiceTotals.grandTotal
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GENERATE */}

                <button
                  type="submit"
                  disabled={!cart.length}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#415A63] px-4 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#344A52] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FileText size={17} />
                  Generate Bill
                </button>

                <p className="mt-3 text-center text-[10px] leading-4 text-[#98A5A9]">
                  Review the customer details and invoice amount before generating.
                </p>
              </form>
            </section>
          </div>
        )}
      </main>

      {/* =====================================================
          BILL PREVIEW MODAL
      ===================================================== */}

      {bill && (
        <div className="bill-overlay-animation fixed inset-0 z-[100] flex items-center justify-center bg-[#263238]/75 p-2 backdrop-blur-sm sm:p-4">
          <div className="bill-popup-animation relative flex h-[96vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl border border-[#D7E1E4] bg-[#F4F7F8] shadow-2xl">
            {/* MODAL HEADER */}

            <div className="no-print flex shrink-0 items-center justify-between border-b border-[#DDE5E7] bg-white px-3 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="success-icon-animation grid h-9 w-9 place-items-center rounded-full bg-[#E5F1EC] text-[#3E8060]">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <p className="text-xs font-black text-[#263238] sm:text-sm">
                    Bill Generated Successfully
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#84949A]">
                    {bill.invoiceNo ||
                      "Invoice Generated"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBill(null)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-[#F1F4F5] text-[#718188] transition hover:bg-[#E7ECEE] hover:text-[#344850]"
              >
                <X size={16} />
              </button>
            </div>

            {/* INVOICE */}

            <div className="invoice-scroll min-h-0 flex-1 overflow-auto p-2 sm:p-4">
              <div className="print-bill">
                <ProfessionalBill bill={bill} />
              </div>
            </div>

            {/* FOOTER */}

            <div className="no-print flex shrink-0 flex-col gap-2 border-t border-[#DDE5E7] bg-white p-2.5 sm:flex-row sm:justify-end sm:p-3">
              <button
                type="button"
                onClick={() => setBill(null)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D7E1E4] bg-white px-4 py-2.5 text-xs font-bold text-[#62757D] transition hover:bg-[#F4F7F8] sm:text-sm"
              >
                <X size={15} />
                Close
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#415A63] px-5 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#344A52] sm:text-sm"
              >
                <Printer size={15} />
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-[#7A8B91]">
        {label}
      </span>

      <span className="text-xs font-bold text-[#40545C]">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   PROFESSIONAL BILL
========================================================= */

function ProfessionalBill({ bill }) {
  const items = Array.isArray(bill?.items)
    ? bill.items
    : [];

  const totals = calculateInvoiceTotals(items);

  const roundedTotal = Math.round(
    totals.grandTotal
  );

  const roundOff =
    roundedTotal - totals.grandTotal;

  const taxGroups = useMemo(() => {
    const groups = {};

    totals.details.forEach((item) => {
      const rate = Number(item.gstRate || 0);

      if (!groups[rate]) {
        groups[rate] = {
          rate,
          taxable: 0,
          cgst: 0,
          sgst: 0,
          gst: 0,
        };
      }

      groups[rate].taxable +=
        item.taxableValue;

      groups[rate].cgst +=
        item.cgstAmount;

      groups[rate].sgst +=
        item.sgstAmount;

      groups[rate].gst +=
        item.gstAmount;
    });

    return Object.values(groups).sort(
      (a, b) => a.rate - b.rate
    );
  }, [items]);

  return (
    <div className="invoice-page mx-auto w-full max-w-[1080px] overflow-hidden rounded-xl border border-[#D4DEE1] bg-white text-[#2F3B40] shadow-lg">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b-2 border-[#344850] bg-white px-5 py-5 sm:px-7">
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#415A63] text-white">
              <ShieldCheck size={24} />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#718890]">
                Trusted Pharmacy
              </p>

              <h1 className="text-xl font-black text-[#263238]">
                {PHARMACY.name}
              </h1>

              <p className="mt-1 max-w-[520px] text-[9px] leading-4 text-[#697B82]">
                {PHARMACY.address}
              </p>

              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[8px] text-[#697B82]">
                <span className="inline-flex items-center gap-1">
                  <Phone size={9} />
                  {PHARMACY.phone}
                </span>

                <span className="inline-flex items-center gap-1">
                  <Mail size={9} />
                  {PHARMACY.email}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-[#D8E2E5] bg-[#F3F7F8] px-4 py-3 text-right">
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#718890]">
              Tax Invoice
            </p>

            <p className="mt-0.5 text-lg font-black text-[#263238]">
              {bill.invoiceNo ||
                "INV-000001"}
            </p>

            <p className="mt-1 text-[8px] text-[#697B82]">
              {formatDate(bill.createdAt)}
              {" • "}
              {bill.createdAt
                ? new Date(
                    bill.createdAt
                  ).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          BUSINESS DETAILS
      =================================================== */}

      <div className="grid border-b border-[#D8E1E4] bg-[#F7F9FA] text-[9px] sm:grid-cols-3">
        <MiniInfo
          label="GSTIN"
          value={PHARMACY.gstin}
        />

        <MiniInfo
          label="Drug License"
          value={PHARMACY.drugLicense}
          border
        />

        <MiniInfo
          label="Place of Supply"
          value={`${PHARMACY.state} (${PHARMACY.stateCode})`}
          border
        />
      </div>

      {/* ===================================================
          CUSTOMER
      =================================================== */}

      <div className="border-b border-[#D8E1E4]">
        <div className="bg-[#344850] px-5 py-2">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white">
            Customer Details
          </p>
        </div>

        <div className="grid sm:grid-cols-3">
          <CustomerMini
            label="Customer Name"
            value={
              bill.customerName ||
              "Walk-in Customer"
            }
          />

          <CustomerMini
            label="Mobile Number"
            value={
              bill.customerMobile || "—"
            }
            border
          />

          <CustomerMini
            label="Payment Mode"
            value={
              bill.paymentMode || "Cash"
            }
            border
          />
        </div>
      </div>

      {/* ===================================================
          MEDICINE HEADER
      =================================================== */}

      <div className="border-b border-[#D8E1E4] px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-[#263238]">
              Medicine Details
            </p>

            <p className="mt-0.5 text-[8px] text-[#83949A]">
              Itemized medicines, GST and pricing
            </p>
          </div>

          <p className="rounded-full bg-[#EFF4F5] px-2.5 py-1 text-[8px] font-bold text-[#60747B]">
            Items:{" "}
            {items.reduce(
              (sum, item) =>
                sum +
                Number(
                  item.quantity || 0
                ),
              0
            )}
          </p>
        </div>
      </div>

      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-[8px]">
          <thead>
            <tr className="bg-[#E8EFF1] text-[#43565D]">
              <BillHead align="center">
                #
              </BillHead>

              <BillHead>
                Medicine / HSN
              </BillHead>

              <BillHead>
                Batch
              </BillHead>

              <BillHead align="center">
                Expiry
              </BillHead>

              <BillHead align="right">
                MRP
              </BillHead>

              <BillHead align="center">
                Qty
              </BillHead>

              <BillHead align="right">
                Rate
              </BillHead>

              <BillHead align="right">
                Disc.
              </BillHead>

              <BillHead align="right">
                Taxable
              </BillHead>

              <BillHead align="center">
                GST
              </BillHead>

              <BillHead align="right">
                CGST
              </BillHead>

              <BillHead align="right">
                SGST
              </BillHead>

              <BillHead align="right">
                Amount
              </BillHead>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const tax =
                totals.details[index];

              return (
                <tr
                  key={
                    item.medicineId ||
                    `${item.name}-${index}`
                  }
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-[#F8FAFA]"
                  }
                >
                  <BillCell align="center">
                    {index + 1}
                  </BillCell>

                  <BillCell>
                    <p className="font-black text-[#263238]">
                      {item.name ||
                        "Medicine"}
                    </p>

                    <p className="text-[7px] text-[#87969B]">
                      HSN:{" "}
                      {item.hsn ||
                        item.hsnCode ||
                        "3004"}
                    </p>
                  </BillCell>

                  <BillCell>
                    {item.batch ||
                      item.batchNo ||
                      "—"}
                  </BillCell>

                  <BillCell align="center">
                    {item.expiry ||
                      item.expiryDate ||
                      "—"}
                  </BillCell>

                  <BillCell align="right">
                    {money(
                      item.mrp ||
                        item.maximumRetailPrice ||
                        item.unitPrice
                    )}
                  </BillCell>

                  <BillCell
                    align="center"
                    bold
                  >
                    {tax.quantity}
                  </BillCell>

                  <BillCell align="right">
                    {money(tax.unitPrice)}
                  </BillCell>

                  <BillCell align="right">
                    {tax.discount > 0
                      ? money(tax.discount)
                      : "—"}
                  </BillCell>

                  <BillCell
                    align="right"
                    bold
                  >
                    {money(
                      tax.taxableValue
                    )}
                  </BillCell>

                  <BillCell align="center">
                    <span className="font-black text-[#405B64]">
                      {tax.gstRate}%
                    </span>

                    <span className="block text-[7px] text-[#8B9A9F]">
                      {tax.cgstRate}+
                      {tax.sgstRate}
                    </span>
                  </BillCell>

                  <BillCell align="right">
                    {money(tax.cgstAmount)}
                  </BillCell>

                  <BillCell align="right">
                    {money(tax.sgstAmount)}
                  </BillCell>

                  <BillCell
                    align="right"
                    bold
                  >
                    <span className="text-[#344F58]">
                      {money(tax.total)}
                    </span>
                  </BillCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===================================================
          TAX + TOTALS
      =================================================== */}

      <div className="grid border-t border-[#D8E1E4] sm:grid-cols-2">
        {/* GST */}

        <div className="border-b border-[#D8E1E4] p-4 sm:border-b-0 sm:border-r">
          <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-[#52666D]">
            GST Summary
          </p>

          <div className="overflow-hidden rounded-lg border border-[#DDE5E7]">
            <table className="w-full text-[8px]">
              <thead>
                <tr className="bg-[#F1F5F6]">
                  <th className="px-2 py-1.5 text-left">
                    Rate
                  </th>

                  <th className="px-2 py-1.5 text-right">
                    Taxable
                  </th>

                  <th className="px-2 py-1.5 text-right">
                    CGST
                  </th>

                  <th className="px-2 py-1.5 text-right">
                    SGST
                  </th>

                  <th className="px-2 py-1.5 text-right">
                    GST
                  </th>
                </tr>
              </thead>

              <tbody>
                {taxGroups.map((group) => (
                  <tr
                    key={group.rate}
                    className="border-t border-[#E2E8EA]"
                  >
                    <td className="px-2 py-1.5 font-bold">
                      {group.rate}%
                    </td>

                    <td className="px-2 py-1.5 text-right">
                      {money(group.taxable)}
                    </td>

                    <td className="px-2 py-1.5 text-right">
                      {money(group.cgst)}
                    </td>

                    <td className="px-2 py-1.5 text-right">
                      {money(group.sgst)}
                    </td>

                    <td className="px-2 py-1.5 text-right font-black">
                      {money(group.gst)}
                    </td>
                  </tr>
                ))}

                <tr className="border-t border-[#DDE5E7] bg-[#F1F5F6] font-black">
                  <td className="px-2 py-1.5">
                    Total
                  </td>

                  <td className="px-2 py-1.5 text-right">
                    {money(
                      totals.taxableAmount
                    )}
                  </td>

                  <td className="px-2 py-1.5 text-right">
                    {money(totals.cgst)}
                  </td>

                  <td className="px-2 py-1.5 text-right">
                    {money(totals.sgst)}
                  </td>

                  <td className="px-2 py-1.5 text-right text-[#344F58]">
                    {money(totals.gst)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTAL */}

        <div className="p-4">
          <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-[#52666D]">
            Invoice Summary
          </p>

          <div className="space-y-1.5 text-[9px]">
            <CompactSummary
              label="Subtotal"
              value={money(
                totals.subtotal
              )}
            />

            <CompactSummary
              label="Discount"
              value={`- ${money(
                totals.discount
              )}`}
            />

            <CompactSummary
              label="Taxable Amount"
              value={money(
                totals.taxableAmount
              )}
            />

            <CompactSummary
              label="CGST"
              value={money(totals.cgst)}
            />

            <CompactSummary
              label="SGST"
              value={money(totals.sgst)}
            />

            <CompactSummary
              label="Total GST"
              value={money(totals.gst)}
            />

            <CompactSummary
              label="Round Off"
              value={money(roundOff)}
            />
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#344850] px-3.5 py-3 text-white">
            <span className="text-[10px] font-black uppercase">
              Grand Total
            </span>

            <span className="text-base font-black">
              {money(roundedTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================
          AMOUNT WORDS
      =================================================== */}

      <div className="border-t border-[#D8E1E4] bg-[#F5F8F9] px-5 py-3">
        <p className="text-[7px] font-black uppercase tracking-wider text-[#84959A]">
          Amount in Words
        </p>

        <p className="mt-0.5 text-[10px] font-black text-[#263238]">
          {numberToWords(roundedTotal)}
        </p>
      </div>

      {/* ===================================================
          TERMS
      =================================================== */}

      <div className="grid border-t border-[#D8E1E4] sm:grid-cols-2">
        <div className="border-b border-[#D8E1E4] p-4 sm:border-b-0 sm:border-r">
          <p className="text-[8px] font-black uppercase tracking-wider text-[#52666D]">
            Terms & Conditions
          </p>

          <ul className="mt-1.5 space-y-0.5 text-[7px] leading-3.5 text-[#6F7F84]">
            <li>
              • Goods once sold will not be returned except as per applicable policy.
            </li>

            <li>
              • Please check medicines and invoice before leaving the pharmacy.
            </li>

            <li>
              • Medicines should be stored according to package instructions.
            </li>

            <li>
              • This is a computer-generated invoice.
            </li>
          </ul>
        </div>

        <div className="p-4 text-center">
          <p className="text-[8px] font-black uppercase tracking-wider text-[#52666D]">
            Authorized Signatory
          </p>

          <div className="mx-auto mt-8 h-px w-36 bg-[#AEBCC0]" />

          <p className="mt-1 text-[7px] text-[#839297]">
            For {PHARMACY.name}
          </p>
        </div>
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="border-t-2 border-[#344850] bg-[#F1F5F6] px-5 py-3 text-center">
        <p className="text-[9px] font-black text-[#344850]">
          Thank you for choosing{" "}
          {PHARMACY.name}
        </p>

        <p className="mt-0.5 text-[7px] text-[#87969B]">
          Computer Generated Tax Invoice • Please retain this invoice for your records.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function MiniInfo({
  label,
  value,
  border = false,
}) {
  return (
    <div
      className={`px-5 py-2.5 ${
        border
          ? "border-t border-[#D8E1E4] sm:border-l sm:border-t-0"
          : ""
      }`}
    >
      <p className="text-[7px] font-bold uppercase tracking-wide text-[#8B9BA0]">
        {label}
      </p>

      <p className="mt-0.5 font-black text-[#344850]">
        {value}
      </p>
    </div>
  );
}

function CustomerMini({
  label,
  value,
  border = false,
}) {
  return (
    <div
      className={`px-5 py-2.5 ${
        border
          ? "border-t border-[#E0E7E9] sm:border-l sm:border-t-0"
          : ""
      }`}
    >
      <p className="text-[7px] font-bold uppercase text-[#8B9BA0]">
        {label}
      </p>

      <p className="mt-0.5 font-black text-[#344850]">
        {value}
      </p>
    </div>
  );
}

function CompactSummary({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#718188]">
        {label}
      </span>

      <span className="font-bold text-[#344850]">
        {value}
      </span>
    </div>
  );
}

function BillHead({
  children,
  align = "left",
}) {
  const alignment =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";

  return (
    <th
      className={`border-r border-[#D5E0E3] px-2 py-2.5 font-black ${alignment}`}
    >
      {children}
    </th>
  );
}

function BillCell({
  children,
  align = "left",
  bold = false,
}) {
  const alignment =
    align === "right"
      ? "text-right"
      : align === "center"
      ? "text-center"
      : "text-left";

  return (
    <td
      className={`border-r border-b border-[#E3E9EB] px-2 py-2.5 ${alignment} ${
        bold
          ? "font-black text-[#263238]"
          : "text-[#4D5D62]"
      }`}
    >
      {children}
    </td>
  );
}