import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

const STORAGE_KEY = "medicare_shop_demo_v1";
const AUTH_KEY = "medicare_auth_v2";
const SALES_KEY = "medicare_sales_v1";

const seedData = {
  medicines: [
    {
      id: "med-001",
      name: "Paracetamol 500mg",
      code: "MED-1001",
      category: "Tablet",
      manufacturer: "CureWell Pharma",
      batch: "CW-25A01",
      quantity: 150,
      reorderLevel: 25,
      unitPrice: 2.5,
      expiryDate: "2027-08-15",
      supplierId: "sup-001",
      description: "Fever and mild pain relief tablets.",
    },
    {
      id: "med-002",
      name: "Amoxicillin 500mg",
      code: "MED-1002",
      category: "Capsule",
      manufacturer: "NovaCare Labs",
      batch: "NC-26B14",
      quantity: 8,
      reorderLevel: 20,
      unitPrice: 6.75,
      expiryDate: "2027-01-20",
      supplierId: "sup-002",
      description: "Antibiotic capsule. Prescription required.",
    },
    {
      id: "med-003",
      name: "Cetirizine 10mg",
      code: "MED-1003",
      category: "Tablet",
      manufacturer: "Healix",
      batch: "HX-26C03",
      quantity: 42,
      reorderLevel: 15,
      unitPrice: 1.8,
      expiryDate: "2026-12-05",
      supplierId: "sup-001",
      description: "Antihistamine for allergy symptoms.",
    },
    {
      id: "med-004",
      name: "Vitamin C 500mg",
      code: "MED-1004",
      category: "Tablet",
      manufacturer: "VitaPlus",
      batch: "VP-25D08",
      quantity: 0,
      reorderLevel: 15,
      unitPrice: 3.2,
      expiryDate: "2028-03-18",
      supplierId: "sup-003",
      description: "Vitamin C supplement tablets.",
    },
    {
      id: "med-005",
      name: "Omeprazole 20mg",
      code: "MED-1005",
      category: "Capsule",
      manufacturer: "CureWell Pharma",
      batch: "CW-26E22",
      quantity: 65,
      reorderLevel: 20,
      unitPrice: 4.25,
      expiryDate: "2026-10-11",
      supplierId: "sup-002",
      description: "Used for acidity and gastric conditions.",
    },
    {
      id: "med-006",
      name: "Azithromycin 250mg",
      code: "MED-1006",
      category: "Tablet",
      manufacturer: "NovaCare Labs",
      batch: "NC-25F19",
      quantity: 18,
      reorderLevel: 20,
      unitPrice: 8.5,
      expiryDate: "2026-09-28",
      supplierId: "sup-002",
      description: "Antibiotic tablet. Prescription required.",
    },
    {
      id: "med-007",
      name: "ORS Orange",
      code: "MED-1007",
      category: "Sachet",
      manufacturer: "HydraLife",
      batch: "HL-26G11",
      quantity: 90,
      reorderLevel: 25,
      unitPrice: 12,
      expiryDate: "2028-06-30",
      supplierId: "sup-003",
      description: "Oral rehydration solution sachet.",
    },
    {
      id: "med-008",
      name: "Cough Relief Syrup",
      code: "MED-1008",
      category: "Syrup",
      manufacturer: "Healix",
      batch: "HX-26H04",
      quantity: 12,
      reorderLevel: 15,
      unitPrice: 95,
      expiryDate: "2026-11-02",
      supplierId: "sup-001",
      description: "Relief syrup for common cough symptoms.",
    },
  ],
  suppliers: [
    {
      id: "sup-001",
      name: "Arun Medical Distributors",
      company: "Arun Healthcare Pvt Ltd",
      phone: "9876543210",
      email: "arunmedical@example.com",
      address: "Gandhipuram, Coimbatore",
    },
    {
      id: "sup-002",
      name: "Nova Pharma Supply",
      company: "Nova Pharma Distributors",
      phone: "9843217650",
      email: "novasupply@example.com",
      address: "RS Puram, Coimbatore",
    },
    {
      id: "sup-003",
      name: "Vita Health Traders",
      company: "Vita Health & Wellness",
      phone: "9798765432",
      email: "vitahealth@example.com",
      address: "Peelamedu, Coimbatore",
    },
  ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

function getInitialData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Fall back to seed data if storage is unavailable/corrupted.
  }
  return clone(seedData);
}

function getInitialAuth() {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    if (!saved) return { isAuthenticated: false, role: null };
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === "object") return parsed;
    return { isAuthenticated: false, role: null };
  } catch {
    return { isAuthenticated: false, role: null };
  }
}

function getInitialSales() {
  try {
    const saved = localStorage.getItem(SALES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(getInitialData);
  const initialAuth = getInitialAuth();
  const [auth, setAuth] = useState(initialAuth);
  const [sales, setSales] = useState(getInitialSales);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  }, [sales]);

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail === "admin@medicare.com" && password === "admin123") {
      setAuth({ isAuthenticated: true, role: "admin" });
      return { success: true, role: "admin" };
    }

    if (normalizedEmail === "staff@medicare.com" && password === "staff123") {
      setAuth({ isAuthenticated: true, role: "staff" });
      return { success: true, role: "staff" };
    }

    return { success: false, message: "Invalid email or password." };
  };

  const logout = () => setAuth({ isAuthenticated: false, role: null });

  const addMedicine = (medicine) => {
    setData((prev) => ({
      ...prev,
      medicines: [
        {
          ...medicine,
          id: `med-${Date.now()}`,
          quantity: Number(medicine.quantity),
          reorderLevel: Number(medicine.reorderLevel),
          unitPrice: Number(medicine.unitPrice),
        },
        ...prev.medicines,
      ],
    }));
  };

  const updateMedicine = (id, medicine) => {
    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((item) =>
        item.id === id
          ? {
              ...item,
              ...medicine,
              quantity: Number(medicine.quantity),
              reorderLevel: Number(medicine.reorderLevel),
              unitPrice: Number(medicine.unitPrice),
            }
          : item
      ),
    }));
  };

  const deleteMedicine = (id) => {
    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((item) => item.id !== id),
    }));
  };

  const createSale = (customer, items) => {
    const normalizedItems = items.map((item) => ({
      medicineId: item.medicineId,
      name: item.name,
      code: item.code,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total: Number(item.quantity) * Number(item.unitPrice),
    }));

    if (!customer.name.trim() || !customer.mobile.trim() || !normalizedItems.length) {
      return { success: false, message: "Customer details and at least one medicine are required." };
    }

    for (const item of normalizedItems) {
      const medicine = data.medicines.find((m) => m.id === item.medicineId);
      if (!medicine) return { success: false, message: `${item.name} is no longer available.` };
      if (Number(medicine.quantity) < item.quantity) {
        return {
          success: false,
          message: `Only ${medicine.quantity} unit(s) of ${medicine.name} are available.`,
        };
      }
      if (new Date(`${medicine.expiryDate}T23:59:59`) < new Date()) {
        return { success: false, message: `${medicine.name} is expired and cannot be sold.` };
      }
    }

    const sale = {
      id: `sale-${Date.now()}`,
      invoiceNo: `INV-${Date.now().toString().slice(-8)}`,
      customerName: customer.name.trim(),
      customerMobile: customer.mobile.trim(),
      items: normalizedItems,
      total: normalizedItems.reduce((sum, item) => sum + item.total, 0),
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((medicine) => {
        const sold = normalizedItems.find((item) => item.medicineId === medicine.id);
        return sold
          ? { ...medicine, quantity: Number(medicine.quantity) - sold.quantity }
          : medicine;
      }),
    }));
    setSales((prev) => [sale, ...prev]);

    return { success: true, sale };
  };

  const addSupplier = (supplier) => {
    setData((prev) => ({
      ...prev,
      suppliers: [{ ...supplier, id: `sup-${Date.now()}` }, ...prev.suppliers],
    }));
  };

  const updateSupplier = (id, supplier) => {
    setData((prev) => ({
      ...prev,
      suppliers: prev.suppliers.map((item) => (item.id === id ? { ...item, ...supplier } : item)),
    }));
  };

  const deleteSupplier = (id) => {
    setData((prev) => ({
      ...prev,
      suppliers: prev.suppliers.filter((item) => item.id !== id),
      medicines: prev.medicines.map((medicine) =>
        medicine.supplierId === id ? { ...medicine, supplierId: "" } : medicine
      ),
    }));
  };

  const resetDemoData = () => setData(clone(seedData));

  const stats = useMemo(() => {
    const today = new Date();
    const inThirtyDays = new Date(today);
    inThirtyDays.setDate(today.getDate() + 30);

    let inventoryValue = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let expired = 0;
    let expiringSoon = 0;

    data.medicines.forEach((medicine) => {
      inventoryValue += Number(medicine.quantity || 0) * Number(medicine.unitPrice || 0);
      if (Number(medicine.quantity) === 0) outOfStock += 1;
      else if (Number(medicine.quantity) <= Number(medicine.reorderLevel || 0)) lowStock += 1;

      const expiry = new Date(`${medicine.expiryDate}T23:59:59`);
      if (expiry < today) expired += 1;
      else if (expiry <= inThirtyDays) expiringSoon += 1;
    });

    const todayKey = new Date().toISOString().slice(0, 10);
    const todaySales = sales
      .filter((sale) => sale.createdAt?.slice(0, 10) === todayKey)
      .reduce((sum, sale) => sum + Number(sale.total || 0), 0);

    return {
      totalMedicines: data.medicines.length,
      totalUnits: data.medicines.reduce((sum, m) => sum + Number(m.quantity || 0), 0),
      lowStock,
      outOfStock,
      expired,
      expiringSoon,
      suppliers: data.suppliers.length,
      inventoryValue,
      totalSales: sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0),
      todaySales,
      totalBills: sales.length,
    };
  }, [data, sales]);

  const value = {
    data,
    stats,
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
    login,
    logout,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    createSale,
    sales,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
