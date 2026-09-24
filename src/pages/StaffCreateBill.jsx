import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  Mail,
  MapPin,
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
  address:
    "123, Main Road, Coimbatore, Tamil Nadu - 641001",
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
    (sum, item) =>
      sum + item.gross,
    0
  );

  const discount = details.reduce(
    (sum, item) =>
      sum + item.discount,
    0
  );

  const taxableAmount = details.reduce(
    (sum, item) =>
      sum + item.taxableValue,
    0
  );

  const cgst = details.reduce(
    (sum, item) =>
      sum + item.cgstAmount,
    0
  );

  const sgst = details.reduce(
    (sum, item) =>
      sum + item.sgstAmount,
    0
  );

  const gst = cgst + sgst;

  const grandTotal =
    taxableAmount + gst;

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

  const initialCart =
    location.state?.cart || [];

  const [cart, setCart] =
    useState(() =>
      initialCart.map((item) => ({
        ...item,
        gstRate:
          item.gstRate ??
          item.gst ??
          item.taxRate ??
          DEFAULT_GST_RATE,
      }))
    );

  const [customer, setCustomer] =
    useState({
      name: "",
      mobile: "",
    });

  const [paymentMode, setPaymentMode] =
    useState("Cash");

  const [error, setError] =
    useState("");

  const [bill, setBill] =
    useState(null);

  const medicines =
    data?.medicines || [];

  /* =======================================================
     CART TOTAL
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

  /* =======================================================
     CART GST PREVIEW
  ======================================================= */

  const cartInvoiceTotals = useMemo(
    () =>
      calculateInvoiceTotals(cart),
    [cart]
  );

  /* =======================================================
     GO BACK
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
     CHANGE QUANTITY
  ======================================================= */

  const changeQuantity = (
    medicineId,
    nextQuantity
  ) => {
    const medicine =
      medicines.find(
        (item) =>
          item.id === medicineId
      );

    if (!medicine) return;

    if (nextQuantity <= 0) {
      setCart((current) =>
        current.filter(
          (item) =>
            item.medicineId !==
            medicineId
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
        item.medicineId ===
        medicineId
          ? {
              ...item,
              quantity:
                safeQuantity,
            }
          : item
      )
    );
  };

  /* =======================================================
     CHANGE GST
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
        item.medicineId ===
        medicineId
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
      /*
       * Keep GST rate inside the cart items so the
       * professional invoice can use the edited rate.
       */
      const billCart = cart.map(
        (item) => ({
          ...item,
          gstRate: Number(
            item.gstRate ??
              DEFAULT_GST_RATE
          ),
        })
      );

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

      /*
       * Use the edited cart for the invoice preview.
       * This ensures the GST percentage entered by
       * the staff is shown correctly.
       */
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
    <div className="min-h-screen bg-[#9DB4C0]">
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
            transform: translateY(20px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes successPop {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }

          70% {
            transform: scale(1.1);
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

        .label {
          display: block;
          margin-bottom: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #6f5a60;
        }

        .input {
          width: 100%;
          border-radius: 11px;
          border: 1px solid #ead5d8;
          background: white;
          padding: 10px 12px;
          font-size: 13px;
          outline: none;
          color: #3f2930;
          transition: 0.2s;
        }

        .input:focus {
          border-color: #d7a5b0;
          box-shadow: 0 0 0 3px rgba(226, 180, 189, 0.2);
        }

        .gst-input {
          width: 72px;
          border-radius: 8px;
          border: 1px solid #dfc3c8;
          background: white;
          padding: 6px 7px;
          text-align: center;
          font-size: 12px;
          font-weight: 800;
          color: #5e3c45;
          outline: none;
        }

        .gst-input:focus {
          border-color: #c78d9a;
          box-shadow: 0 0 0 2px rgba(226, 180, 189, 0.25);
        }

        .invoice-scroll {
          scrollbar-width: thin;
          scrollbar-color: #d7a5b0 #9DB4C0;
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

      <header className="sticky top-0 z-30 border-b border-[#EAD5D8] bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1150px] items-center justify-between px-4 sm:h-[70px] sm:px-6">
          <div>
            <p className="text-lg font-black text-[#3F2930]">
              MediCare
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A88F95]">
              Staff Billing
            </p>
          </div>

          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAD5D8] bg-white px-3 py-2 text-xs font-bold text-[#6A414B] transition hover:border-[C2DFE3] hover:bg-[#9DB4C0] sm:px-4 sm:text-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </header>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-[1150px] px-3 py-5 sm:px-6 sm:py-7">
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#5C6B73] text-[#A96F7D] shadow-sm">
              <FileText size={21} />
            </div>

            <div>
              <h1 className="text-xl font-black text-[#3F2930] sm:text-2xl">
                Create Bill
              </h1>

              <p className="mt-1 text-xs text-[#8F7A80] sm:text-sm">
                Add medicines, adjust GST and generate the invoice.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            EMPTY CART
        ================================================= */}

        {!initialCart.length &&
        !cart.length ? (
          <div className="rounded-2xl border border-[#EAD5D8] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#5C6B73] text-[#A96F7D]">
              <ShoppingCart size={30} />
            </div>

            <h2 className="mt-4 text-lg font-black text-[#3F2930]">
              No medicines selected
            </h2>

            <p className="mt-1 text-sm text-[#8F7A80]">
              Please select medicines before creating a bill.
            </p>

            <button
              type="button"
              onClick={goBack}
              className="mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[C2DFE3] px-5 py-2.5 text-sm font-extrabold text-[#3F2930] shadow-sm transition hover:bg-[#D7A5B0]"
            >
              <ArrowLeft size={16} />
              Back to medicines
            </button>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_390px]">
            {/* =================================================
                MEDICINES
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-[#EAD5D8] bg-white shadow-sm">
              <div className="border-b border-[#EAD5D8] bg-gradient-to-r from-[#9DB4C0] to-white p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[C2DFE3] text-[#5E3C45]">
                    <ShoppingCart size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#3F2930]">
                      Selected Medicines
                    </h2>

                    <p className="mt-0.5 text-xs text-[#8F7A80]">
                      Adjust quantity and GST before generating the bill.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 sm:p-5">
                {cart.map((item) => {
                  const itemTax =
                    getItemTaxDetails(
                      item
                    );

                  return (
                    <div
                      key={
                        item.medicineId
                      }
                      className="rounded-xl border border-[#EAD5D8] bg-[#9DB4C09F9] p-3 transition hover:border-[C2DFE3] sm:p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-bold text-[#3F2930]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[#8F7A80]">
                            {item.code ||
                              "No code"}{" "}
                            •{" "}
                            {money(
                              item.unitPrice
                            )}{" "}
                            each
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.medicineId,
                              0
                            )
                          }
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-rose-500 transition hover:bg-rose-50"
                          title="Remove medicine"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        {/* QUANTITY */}

                        <div>
                          <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-[#9B858B]">
                            Quantity
                          </p>

                          <div className="flex items-center gap-2">
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
                              className="grid h-8 w-8 place-items-center rounded-lg border border-[#EAD5D8] bg-white text-[#6F5A60] transition hover:bg-[#5C6B73]"
                            >
                              <Minus
                                size={14}
                              />
                            </button>

                            <span className="w-7 text-center text-sm font-extrabold text-[#3F2930]">
                              {
                                item.quantity
                              }
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
                              className="grid h-8 w-8 place-items-center rounded-lg border border-[#EAD5D8] bg-white text-[#6F5A60] transition hover:bg-[#5C6B73]"
                            >
                              <Plus
                                size={14}
                              />
                            </button>
                          </div>
                        </div>

                        {/* GST */}

                        <div>
                          <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-[#9B858B]">
                            GST %
                          </p>

                          <div className="flex items-center gap-1.5">
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
                                  e.target
                                    .value
                                )
                              }
                              className="gst-input"
                            />

                            <span className="text-xs font-bold text-[#6F5A60]">
                              %
                            </span>
                          </div>
                        </div>

                        {/* TAX */}

                        <div className="rounded-lg bg-white px-3 py-2">
                          <p className="text-[9px] font-bold uppercase text-[#9B858B]">
                            CGST / SGST
                          </p>

                          <p className="mt-0.5 text-xs font-black text-[#6A414B]">
                            {
                              itemTax.cgstRate
                            }
                            % /{" "}
                            {
                              itemTax.sgstRate
                            }%
                          </p>
                        </div>

                        {/* AMOUNT */}

                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-bold uppercase text-[#9B858B]">
                            Amount
                          </p>

                          <p className="font-black text-[#6A414B]">
                            {money(
                              itemTax.total
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* CART TOTAL */}

                <div className="rounded-xl border border-[#EAD5D8] bg-[#9DB4C0] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#6F5A60]">
                      Subtotal
                    </span>

                    <span className="font-black text-[#A96F7D]">
                      {money(
                        cartTotal
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[#8F7A80]">
                      Taxable Amount
                    </span>

                    <span className="text-sm font-bold text-[#3F2930]">
                      {money(
                        cartInvoiceTotals.taxableAmount
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[#8F7A80]">
                      Total GST
                    </span>

                    <span className="text-sm font-bold text-[#6A414B]">
                      {money(
                        cartInvoiceTotals.gst
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#EAD5D8] pt-3">
                    <span className="font-black text-[#3F2930]">
                      Invoice Total
                    </span>

                    <span className="text-xl font-black text-[#A96F7D]">
                      {money(
                        cartInvoiceTotals.grandTotal
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                CUSTOMER
            ================================================= */}

            <section className="h-fit overflow-hidden rounded-2xl border border-[#EAD5D8] bg-white shadow-sm">
              <div className="border-b border-[#EAD5D8] bg-gradient-to-r from-[#9DB4C0] to-white p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#5C6B73] text-[#A96F7D]">
                    <UserRound size={17} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-[#3F2930]">
                      Customer Details
                    </h2>

                    <p className="mt-1 text-xs text-[#8F7A80]">
                      Enter customer information.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={generateBill}
                className="p-4 sm:p-5"
              >
                {error && (
                  <div className="mb-4 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                    <AlertTriangle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="label">
                      Customer Name *
                    </label>

                    <input
                      className="input"
                      value={
                        customer.name
                      }
                      onChange={(e) => {
                        setCustomer(
                          (previous) => ({
                            ...previous,
                            name: e.target
                              .value,
                          })
                        );

                        setError("");
                      }}
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Mobile Number *
                    </label>

                    <input
                      className="input"
                      inputMode="numeric"
                      maxLength={10}
                      value={
                        customer.mobile
                      }
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
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Payment Mode
                    </label>

                    <select
                      className="input"
                      value={
                        paymentMode
                      }
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

                {/* GST NOTE */}

                <div className="mt-5 rounded-xl border border-[#EAD5D8] bg-[#9DB4C0] p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#5C6B73] text-[#A96F7D]">
                      <ShieldCheck
                        size={16}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-black text-[#3F2930]">
                        GST Editable
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-[#8F7A80]">
                        Staff can edit the GST percentage for each medicine before generating the invoice.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SUMMARY */}

                <div className="mt-4 rounded-xl border border-[#EAD5D8] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8F7A80]">
                      Items
                    </span>

                    <span className="font-bold text-[#3F2930]">
                      {cart.reduce(
                        (sum, item) =>
                          sum +
                          Number(
                            item.quantity ||
                              0
                          ),
                        0
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[#8F7A80]">
                      GST
                    </span>

                    <span className="font-bold text-[#6A414B]">
                      {money(
                        cartInvoiceTotals.gst
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#EAD5D8] pt-3">
                    <span className="font-black text-[#3F2930]">
                      Total
                    </span>

                    <span className="text-xl font-black text-[#A96F7D]">
                      {money(
                        cartInvoiceTotals.grandTotal
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!cart.length}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[C2DFE3] px-4 text-sm font-extrabold text-[#3F2930] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#D7A5B0] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileText size={17} />
                  Generate Bill
                </button>
              </form>
            </section>
          </div>
        )}
      </main>

      {/* =====================================================
          BILL PREVIEW
      ===================================================== */}

      {bill && (
        <div className="bill-overlay-animation fixed inset-0 z-[100] flex items-center justify-center bg-[#3F2930]/70 p-1.5 backdrop-blur-sm sm:p-3">
          <div className="bill-popup-animation relative flex h-[94vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-2xl border border-[#EAD5D8] bg-[#9DB4C0] shadow-2xl">
            {/* PREVIEW HEADER */}

            <div className="no-print flex shrink-0 items-center justify-between border-b border-[#EAD5D8] bg-white px-3 py-2.5 sm:px-5 sm:py-3">
              <div className="flex items-center gap-2.5">
                <div className="success-icon-animation grid h-8 w-8 place-items-center rounded-full bg-[#5C6B73] text-[#A96F7D]">
                  <CheckCircle2
                    size={18}
                  />
                </div>

                <div>
                  <p className="text-xs font-black text-[#3F2930] sm:text-sm">
                    Bill Generated Successfully
                  </p>

                  <p className="text-[10px] text-[#8F7A80]">
                    {bill.invoiceNo ||
                      "Invoice Generated"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setBill(null)
                }
                className="grid h-8 w-8 place-items-center rounded-lg bg-[#9DB4C0] text-[#7E6A70] transition hover:bg-[#5C6B73]"
              >
                <X size={16} />
              </button>
            </div>

            {/* INVOICE */}

            <div className="invoice-scroll min-h-0 flex-1 overflow-auto p-1.5 sm:p-3">
              <div className="print-bill">
                <ProfessionalBill
                  bill={bill}
                />
              </div>
            </div>

            {/* FOOTER BUTTONS */}

            <div className="no-print flex shrink-0 flex-col gap-2 border-t border-[#EAD5D8] bg-white p-2.5 sm:flex-row sm:justify-end sm:p-3">
              <button
                type="button"
                onClick={() =>
                  setBill(null)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAD5D8] bg-white px-4 py-2 text-xs font-bold text-[#6F5A60] transition hover:bg-[#9DB4C0] sm:text-sm"
              >
                <X size={15} />
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  window.print()
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[C2DFE3] px-4 py-2 text-xs font-extrabold text-[#3F2930] shadow-sm transition hover:bg-[#D7A5B0] sm:text-sm"
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
   PROFESSIONAL BILL
========================================================= */

function ProfessionalBill({ bill }) {
  const items = Array.isArray(
    bill?.items
  )
    ? bill.items
    : [];

  const totals =
    calculateInvoiceTotals(items);

  const roundedTotal =
    Math.round(
      totals.grandTotal
    );

  const roundOff =
    roundedTotal -
    totals.grandTotal;

  /* =======================================================
     TAX GROUPS
  ======================================================= */

  const taxGroups = useMemo(() => {
    const groups = {};

    totals.details.forEach(
      (item) => {
        const rate =
          Number(item.gstRate || 0);

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
      }
    );

    return Object.values(
      groups
    ).sort(
      (a, b) =>
        a.rate - b.rate
    );
  }, [items]);

  return (
    <div className="invoice-page mx-auto w-full max-w-[1080px] overflow-hidden rounded-lg border border-[#D8C4C8] bg-white text-[#2F2428] shadow-md">
      {/* ===================================================
          COMPACT HEADER
      =================================================== */}

      <div className="border-b border-[#3F2930] bg-white px-4 py-4 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#5C6B73] text-[#A96F7D]">
              <ShieldCheck
                size={23}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#A96F7D]">
                Trusted Pharmacy
              </p>

              <h1 className="text-lg font-black text-[#3F2930] sm:text-xl">
                {PHARMACY.name}
              </h1>

              <p className="mt-0.5 max-w-[520px] text-[9px] leading-4 text-[#6F5A60]">
                {PHARMACY.address}
              </p>

              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[8px] text-[#6F5A60]">
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

          <div className="shrink-0 rounded-lg border border-[#EAD5D8] bg-[#9DB4C0] px-3 py-2.5 text-right">
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A96F7D]">
              Tax Invoice
            </p>

            <p className="mt-0.5 text-base font-black text-[#3F2930]">
              {bill.invoiceNo ||
                "INV-000001"}
            </p>

            <p className="mt-1 text-[8px] text-[#6F5A60]">
              {formatDate(
                bill.createdAt
              )}{" "}
              •{" "}
              {bill.createdAt
                ? new Date(
                    bill.createdAt
                  ).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute:
                        "2-digit",
                    }
                  )
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          GST / LICENSE
      =================================================== */}

      <div className="grid border-b border-[#D9C7CB] bg-[#9DB4C09F9] text-[9px] sm:grid-cols-3">
        <MiniInfo
          label="GSTIN"
          value={PHARMACY.gstin}
        />

        <MiniInfo
          label="Drug License"
          value={
            PHARMACY.drugLicense
          }
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

      <div className="border-b border-[#D9C7CB]">
        <div className="bg-[#3F2930] px-4 py-1.5">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white">
            Customer Details
          </p>
        </div>

        <div className="grid text-[9px] sm:grid-cols-3">
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
              bill.customerMobile ||
              "—"
            }
            border
          />

          <CustomerMini
            label="Payment Mode"
            value={
              bill.paymentMode ||
              "Cash"
            }
            border
          />
        </div>
      </div>

      {/* ===================================================
          MEDICINES
      =================================================== */}

      <div className="border-b border-[#D9C7CB] px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-[#3F2930]">
              Medicine Details
            </p>

            <p className="text-[8px] text-[#8F7A80]">
              Itemized medicines, GST and pricing
            </p>
          </div>

          <p className="text-[8px] font-bold text-[#6F5A60]">
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
          COMPACT TABLE
      =================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-[8px]">
          <thead>
            <tr className="bg-[#5C6B73] text-[#4D333A]">
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
            {items.map(
              (item, index) => {
                const tax =
                  totals.details[
                    index
                  ];

                return (
                  <tr
                    key={
                      item.medicineId ||
                      `${item.name}-${index}`
                    }
                    className={
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-[#9DB4C0AFA]"
                    }
                  >
                    <BillCell align="center">
                      {index + 1}
                    </BillCell>

                    <BillCell>
                      <p className="font-black text-[#3F2930]">
                        {item.name ||
                          "Medicine"}
                      </p>

                      <p className="text-[7px] text-[#8F7A80]">
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
                      {money(
                        tax.unitPrice
                      )}
                    </BillCell>

                    <BillCell align="right">
                      {tax.discount > 0
                        ? money(
                            tax.discount
                          )
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
                      <span className="font-black text-[#6A414B]">
                        {tax.gstRate}%
                      </span>
                      <span className="block text-[7px] text-[#8F7A80]">
                        {tax.cgstRate}+
                        {tax.sgstRate}
                      </span>
                    </BillCell>

                    <BillCell align="right">
                      {money(
                        tax.cgstAmount
                      )}
                    </BillCell>

                    <BillCell align="right">
                      {money(
                        tax.sgstAmount
                      )}
                    </BillCell>

                    <BillCell
                      align="right"
                      bold
                    >
                      <span className="text-[#6A414B]">
                        {money(
                          tax.total
                        )}
                      </span>
                    </BillCell>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      {/* ===================================================
          GST + TOTALS
      =================================================== */}

      <div className="grid border-t border-[#D9C7CB] sm:grid-cols-2">
        {/* GST */}

        <div className="border-b border-[#D9C7CB] p-3 sm:border-b-0 sm:border-r">
          <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-[#6A414B]">
            GST Summary
          </p>

          <div className="overflow-hidden rounded-lg border border-[#E7D9DC]">
            <table className="w-full text-[8px]">
              <thead>
                <tr className="bg-[#9DB4C0]">
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
                {taxGroups.map(
                  (group) => (
                    <tr
                      key={
                        group.rate
                      }
                      className="border-t border-[#E7D9DC]"
                    >
                      <td className="px-2 py-1.5 font-bold">
                        {group.rate}%
                      </td>

                      <td className="px-2 py-1.5 text-right">
                        {money(
                          group.taxable
                        )}
                      </td>

                      <td className="px-2 py-1.5 text-right">
                        {money(
                          group.cgst
                        )}
                      </td>

                      <td className="px-2 py-1.5 text-right">
                        {money(
                          group.sgst
                        )}
                      </td>

                      <td className="px-2 py-1.5 text-right font-black">
                        {money(
                          group.gst
                        )}
                      </td>
                    </tr>
                  )
                )}

                <tr className="border-t border-[#E7D9DC] bg-[#9DB4C0] font-black">
                  <td className="px-2 py-1.5">
                    Total
                  </td>

                  <td className="px-2 py-1.5 text-right">
                    {money(
                      totals.taxableAmount
                    )}
                  </td>

                  <td className="px-2 py-1.5 text-right">
                    {money(
                      totals.cgst
                    )}
                  </td>

                  <td className="px-2 py-1.5 text-right">
                    {money(
                      totals.sgst
                    )}
                  </td>

                  <td className="px-2 py-1.5 text-right text-[#A96F7D]">
                    {money(
                      totals.gst
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTAL */}

        <div className="p-3">
          <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-[#6A414B]">
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
              value={money(
                totals.cgst
              )}
            />

            <CompactSummary
              label="SGST"
              value={money(
                totals.sgst
              )}
            />

            <CompactSummary
              label="Total GST"
              value={money(
                totals.gst
              )}
            />

            <CompactSummary
              label="Round Off"
              value={money(
                roundOff
              )}
            />
          </div>

          <div className="mt-2 flex items-center justify-between rounded-lg bg-[#3F2930] px-3 py-2.5 text-white">
            <span className="text-[10px] font-black uppercase">
              Grand Total
            </span>

            <span className="text-base font-black">
              {money(
                roundedTotal
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================
          AMOUNT WORDS
      =================================================== */}

      <div className="border-t border-[#D9C7CB] bg-[#9DB4C0] px-4 py-2.5">
        <p className="text-[7px] font-black uppercase tracking-wider text-[#9B858B]">
          Amount in Words
        </p>

        <p className="mt-0.5 text-[10px] font-black text-[#3F2930]">
          {numberToWords(
            roundedTotal
          )}
        </p>
      </div>

      {/* ===================================================
          TERMS + SIGNATURE
      =================================================== */}

      <div className="grid border-t border-[#D9C7CB] sm:grid-cols-2">
        <div className="border-b border-[#D9C7CB] p-3 sm:border-b-0 sm:border-r">
          <p className="text-[8px] font-black uppercase tracking-wider text-[#6A414B]">
            Terms & Conditions
          </p>

          <ul className="mt-1.5 space-y-0.5 text-[7px] leading-3.5 text-[#6F5A60]">
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

        <div className="p-3 text-center">
          <p className="text-[8px] font-black uppercase tracking-wider text-[#6A414B]">
            Authorized Signatory
          </p>

          <div className="mx-auto mt-7 h-px w-36 bg-[#BDAEB2]" />

          <p className="mt-1 text-[7px] text-[#8F7A80]">
            For {PHARMACY.name}
          </p>
        </div>
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="border-t border-[#3F2930] bg-[#9DB4C0] px-4 py-2.5 text-center">
        <p className="text-[9px] font-black text-[#3F2930]">
          Thank you for choosing{" "}
          {PHARMACY.name}
        </p>

        <p className="mt-0.5 text-[7px] text-[#8F7A80]">
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
      className={`px-4 py-2 ${
        border
          ? "border-t border-[#D9C7CB] sm:border-l sm:border-t-0"
          : ""
      }`}
    >
      <p className="text-[7px] font-bold uppercase tracking-wide text-[#9B858B]">
        {label}
      </p>

      <p className="mt-0.5 font-black text-[#3F2930]">
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
      className={`px-4 py-2 ${
        border
          ? "border-t border-[#E7D9DC] sm:border-l sm:border-t-0"
          : ""
      }`}
    >
      <p className="text-[7px] font-bold uppercase text-[#9B858B]">
        {label}
      </p>

      <p className="mt-0.5 font-black text-[#3F2930]">
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
      <span className="text-[#6F5A60]">
        {label}
      </span>

      <span className="font-bold text-[#3F2930]">
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
      className={`border-r border-[#D9C7CB] px-2 py-2 font-black ${alignment}`}
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
      className={`border-r border-b border-[#E7D9DC] px-2 py-2 ${alignment} ${
        bold
          ? "font-black text-[#3F2930]"
          : "text-[#4D3B40]"
      }`}
    >
      {children}
    </td>
  );
}