import React, { useState } from "react";
import {
  BedDouble,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Home,
  Layers,
  Package,
  Plus,
  Printer,
  Scissors,
  Search,
  ShieldAlert,
  Shirt,
  ShoppingCart,
  Sparkles,
  Tag,
  UserCheck,
  UserMinus,
  UserPlus,
  Utensils,
} from "lucide-react";
import { BusinessSector, Invoice, Product } from "../types";

export interface KotTicketItem {
  id: string;
  table: string;
  mode: string;
  itemsSummary: string;
  note: string;
  time: string;
  status: "PREPARING" | "READY";
}

export interface ServiceAppointmentItem {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  timeSlot: string;
  stylistName: string;
  duration: string;
  status: "BOOKED" | "IN_SESSION" | "COMPLETED";
}

const RESTAURANT_TABLES = [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "VIP Booth 1",
  "Patio 2",
];

interface KdsTableModuleViewProps {
  selectedTable: string;
  orderMode: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  kotTickets: KotTicketItem[];
  products: Product[];
  onSelectTableForPos: (table: string, mode: "DINE_IN" | "TAKEAWAY" | "DELIVERY") => void;
  onToggleKotStatus: (kotId: string) => void;
  onQuickAddAndSpoolKot: (table: string, product: Product) => void;
  onClearTableKot: (table: string) => void;
  onOpenPos: () => void;
}

export function KdsTableModuleView({
  selectedTable,
  orderMode,
  kotTickets,
  products,
  onSelectTableForPos,
  onToggleKotStatus,
  onQuickAddAndSpoolKot,
  onClearTableKot,
  onOpenPos,
}: KdsTableModuleViewProps) {
  const [quickItemId, setQuickItemId] = useState<string>(products[0]?.id || "");
  const activeDish = products.find((p) => p.id === quickItemId) || products[0];

  return (
    <div className="space-y-6" id="sector-kds-module-view">
      <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
            🍽️ Restaurant &amp; F&amp;B Module Active
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            Floor Table Management &amp; Kitchen Display System (KDS)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign dine-in tables, spool Kitchen Order Tickets (KOT), and track live kitchen preparation status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {products.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-1.5">
              <select
                value={activeDish?.id || ""}
                onChange={(e) => setQuickItemId(e.target.value)}
                className="bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 max-w-[200px]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>
              {activeDish && (
                <button
                  type="button"
                  onClick={() => onQuickAddAndSpoolKot(selectedTable, activeDish)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  + Spool KOT to {selectedTable}
                </button>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={onOpenPos}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
            <span>Open POS Counter</span>
          </button>
        </div>
      </div>

      {/* Floor Plan Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-600" />
            Live Dining Floor &amp; Table Status ({RESTAURANT_TABLES.length} Tables)
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">
            Selected: <strong className="text-amber-700">{selectedTable} ({orderMode.replace("_", "-")})</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESTAURANT_TABLES.map((tbl) => {
            const tableKots = kotTickets.filter((k) => k.table === tbl);
            const hasPreparing = tableKots.some((k) => k.status === "PREPARING");
            const isOccupied = tableKots.length > 0;
            const isSelected = selectedTable === tbl;

            return (
              <div
                key={tbl}
                className={`p-4 rounded-xl border-2 transition-all space-y-3 ${
                  isSelected
                    ? "border-amber-500 bg-amber-50/70 shadow-sm"
                    : isOccupied
                    ? "border-rose-200 bg-rose-50/40"
                    : "border-emerald-200 bg-emerald-50/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">{tbl}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      hasPreparing
                        ? "bg-amber-100 text-amber-800"
                        : isOccupied
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {hasPreparing ? "Preparing KOT" : isOccupied ? "Served / Active" : "Available"}
                  </span>
                </div>

                {tableKots.length > 0 ? (
                  <div className="space-y-1 text-[11px] text-slate-700">
                    <p className="font-bold text-slate-800 truncate">{tableKots[0].itemsSummary}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {tableKots.length} KOT ticket(s) • Last at {tableKots[0].time}
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">Ready for dine-in seating or instant KOT assignment.</p>
                )}

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTableForPos(tbl, "DINE_IN");
                      onOpenPos();
                    }}
                    className="flex-1 py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10.5px] font-bold cursor-pointer"
                  >
                    Bill in POS
                  </button>
                  {isOccupied && (
                    <button
                      type="button"
                      onClick={() => onClearTableKot(tbl)}
                      className="py-1.5 px-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[10.5px] font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Kitchen Display System Queue */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Kitchen Display Queue (Live KOT Tickets: {kotTickets.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Click status badge to mark Ready / Preparing</span>
        </div>

        {kotTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kotTickets.map((kot) => (
              <div
                key={kot.id}
                className={`p-4 rounded-xl border space-y-2.5 ${
                  kot.status === "READY"
                    ? "bg-emerald-950/50 border-emerald-500/40"
                    : "bg-slate-800 border-amber-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-amber-300">
                    {kot.id} • {kot.table}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleKotStatus(kot.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase cursor-pointer ${
                      kot.status === "READY"
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-amber-500 text-slate-950"
                    }`}
                  >
                    {kot.status}
                  </button>
                </div>
                <p className="text-xs font-bold text-white leading-snug">{kot.itemsSummary}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-700/80">
                  <span>Note: {kot.note}</span>
                  <span>{kot.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-700 rounded-xl">
            No active KOT tickets yet. Select a dish above or send items from POS to spool a Kitchen Order Ticket.
          </div>
        )}
      </div>
    </div>
  );
}

interface RxBatchModuleViewProps {
  sector: BusinessSector;
  products: Product[];
  invoices: Invoice[];
  rxNumber: string;
  rxDoctorName: string;
  rxScheduleHVerified: boolean;
  onUpdateRxDraft: (patch: { rxNumber?: string; rxDoctorName?: string; rxScheduleHVerified?: boolean }) => void;
  onAddProductToPos: (product: Product) => void;
  onOpenPos: () => void;
}

export function RxBatchModuleView({
  sector,
  products,
  invoices,
  rxNumber,
  rxDoctorName,
  rxScheduleHVerified,
  onUpdateRxDraft,
  onAddProductToPos,
  onOpenPos,
}: RxBatchModuleViewProps) {
  const today = new Date();
  const rxInvoices = invoices.filter(
    (inv) => inv.sectorMetadata?.rxNumber || inv.sectorMetadata?.rxDoctorName
  );

  const sortedBatches = [...products].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <div className="space-y-6" id="sector-rx-module-view">
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
            💊 {sector === "PHARMACY" ? "Pharmacy Rx & Schedule H Compliance" : "Batch & Expiry Control"}
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            {sector === "PHARMACY"
              ? "Prescription (Rx) Register & Batch Expiry Monitor"
              : "Product Batch & Shelf-Life Expiry Monitor"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor batch numbers, upcoming expiries, and prescription doctor compliance before dispensing at checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPos}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Dispense in POS</span>
        </button>
      </div>

      {sector === "PHARMACY" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Prescription Pre-Fill */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Active POS Prescription (Rx) Draft
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Prescription Rx Number
                </label>
                <input
                  type="text"
                  value={rxNumber}
                  onChange={(e) => onUpdateRxDraft({ rxNumber: e.target.value })}
                  placeholder="e.g. RX-2026-441"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Prescribing Doctor / Clinic
                </label>
                <input
                  type="text"
                  value={rxDoctorName}
                  onChange={(e) => onUpdateRxDraft({ rxDoctorName: e.target.value })}
                  placeholder="e.g. Dr. K. Rao, MD (Reg #44812)"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>
              <label className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 cursor-pointer font-bold text-rose-900">
                <input
                  type="checkbox"
                  checked={rxScheduleHVerified}
                  onChange={(e) => onUpdateRxDraft({ rxScheduleHVerified: e.target.checked })}
                  className="accent-rose-600"
                />
                <span>Schedule H / Batch Verification Completed</span>
              </label>
              <button
                type="button"
                onClick={onOpenPos}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Apply Rx to POS Checkout
              </button>
            </div>
          </div>

          {/* Dispensed Rx Register */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">
              Dispensed Prescription Register ({rxInvoices.length} bills)
            </h3>
            {rxInvoices.length > 0 ? (
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
                {rxInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-black text-slate-900 font-mono">
                        {inv.sectorMetadata?.rxNumber || "RX-WALKIN"} • {inv.id}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Patient: <strong>{inv.customerName || "Walk-in"}</strong> • Doctor:{" "}
                        <strong>{inv.sectorMetadata?.rxDoctorName || "N/A"}</strong>
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      ₹{inv.grandTotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Enter an Rx Number &amp; Doctor Name and complete a Pharmacy checkout in POS to record Schedule H dispensations.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Batch & Expiry Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-rose-600" />
          Batch Number &amp; Shelf-Life Expiry Matrix ({sortedBatches.length} SKUs)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-mono border-b border-slate-200">
                <th className="p-3">Product</th>
                <th className="p-3">Batch No.</th>
                <th className="p-3">Expiry Date</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Compliance Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedBatches.map((p) => {
                const diffDays = Math.ceil(
                  (new Date(p.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                const isExpired = diffDays < 0;
                const isNear = diffDays >= 0 && diffDays <= 90;
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] font-mono text-slate-500">SKU: {p.sku} • {p.category}</p>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">{p.batchNumber || "GEN-01"}</td>
                    <td className="p-3 font-mono font-bold text-slate-700">{p.expiryDate}</td>
                    <td className="p-3 font-mono font-bold">{p.stock} {p.unit}s</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isExpired
                            ? "bg-rose-100 text-rose-800"
                            : isNear
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isExpired ? "Expired — Hold" : isNear ? `Expiring in ${diffDays}d` : "Valid Batch"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          onAddProductToPos(p);
                          onOpenPos();
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10.5px] font-bold cursor-pointer"
                      >
                        Add to POS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface AppointmentsModuleViewProps {
  products: Product[];
  appointments: ServiceAppointmentItem[];
  onCreateAppointment: (item: ServiceAppointmentItem) => void;
  onUpdateStatus: (id: string, status: ServiceAppointmentItem["status"]) => void;
  onBillAppointmentInPos: (item: ServiceAppointmentItem) => void;
}

export function AppointmentsModuleView({
  products,
  appointments,
  onCreateAppointment,
  onUpdateStatus,
  onBillAppointmentInPos,
}: AppointmentsModuleViewProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [serviceId, setServiceId] = useState(products[0]?.id || "");
  const [timeSlot, setTimeSlot] = useState("11:30 AM");
  const [stylistName, setStylistName] = useState("Meera K. (Senior Stylist)");
  const [duration, setDuration] = useState("45 Min");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const svc = products.find((p) => p.id === serviceId) || products[0];
    if (!customerName.trim() || !svc) return;
    onCreateAppointment({
      id: `APT-${String(appointments.length + 1).padStart(3, "0")}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || "+91 9800000000",
      serviceId: svc.id,
      serviceName: svc.name,
      timeSlot,
      stylistName,
      duration,
      status: "BOOKED",
    });
    setCustomerName("");
    setCustomerPhone("");
  };

  return (
    <div className="space-y-6" id="sector-appointments-module-view">
      <div className="bg-white rounded-2xl border border-violet-200 p-6 shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-widest text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full">
          ✂️ Services &amp; Salon Module Active
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-2">
          Appointment Scheduler &amp; Stylist Assignment Board
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Book client time slots, assign therapists/stylists, track in-session services, and bill directly into POS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleBook}
          className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 text-xs"
        >
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-violet-600" />
            Book New Appointment
          </h3>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Client Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ananya Sharma"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Mobile Number</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Select Service</label>
            <select
              value={serviceId || products[0]?.id || ""}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 font-bold"
              >
                {["10:00 AM", "11:30 AM", "01:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"].map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 font-bold"
              >
                {["30 Min", "45 Min", "60 Min", "90 Min", "120 Min"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Assigned Stylist / Staff</label>
            <select
              value={stylistName}
              onChange={(e) => setStylistName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold"
            >
              {[
                "Meera K. (Senior Stylist)",
                "Vikram S. (Hair Specialist)",
                "Riya D. (Skin Therapist)",
                "Arjun P. (Spa Lead)",
              ].map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs cursor-pointer"
          >
            Confirm Appointment Booking
          </button>
        </form>

        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-600" />
            Today's Appointment Schedule ({appointments.length})
          </h3>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-[10px] bg-violet-100 text-violet-800 px-2 py-0.5 rounded">
                      {apt.id}
                    </span>
                    <span className="font-bold text-slate-900">{apt.customerName}</span>
                    <span className="text-slate-400 font-mono">{apt.customerPhone}</span>
                  </div>
                  <p className="font-bold text-violet-800">{apt.serviceName}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.timeSlot} ({apt.duration})</span>
                    <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> {apt.stylistName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={apt.status}
                    onChange={(e) => onUpdateStatus(apt.id, e.target.value as ServiceAppointmentItem["status"])}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold"
                  >
                    <option value="BOOKED">Booked</option>
                    <option value="IN_SESSION">In Session</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => onBillAppointmentInPos(apt)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingCart className="w-3 h-3 text-violet-300" />
                    <span>Bill in POS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface VariantMatrixModuleViewProps {
  products: Product[];
  selectedSize: string;
  selectedColor: string;
  onSelectSize: (sz: string) => void;
  onSelectColor: (clr: string) => void;
  onAddVariantToPos: (product: Product, size: string, color: string) => void;
  onPrintLabel: (product: Product) => void;
  canPrintLabels: boolean;
}

const RETAIL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "UK 8", "UK 9"];
const RETAIL_COLORS = ["Classic Black", "Navy Blue", "Ivory White", "Olive Green", "Burgundy"];

export function VariantMatrixModuleView({
  products,
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
  onAddVariantToPos,
  onPrintLabel,
  canPrintLabels,
}: VariantMatrixModuleViewProps) {
  return (
    <div className="space-y-6" id="sector-variants-module-view">
      <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
            🛍️ Retail &amp; Apparel Variant Matrix Active
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            Size &amp; Color Variant Matrix &amp; Hang-Tag Studio
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pick active size and color combinations to add variants directly to POS checkout or print shelf/apparel hang tags.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-indigo-900">Active Matrix:</span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-indigo-200 font-black text-indigo-800">
            {selectedSize} / {selectedColor}
          </span>
        </div>
      </div>

      {/* Interactive Variant Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">1. Select Size</p>
            <div className="flex flex-wrap gap-2">
              {RETAIL_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectSize(sz)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    selectedSize === sz
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 hover:bg-indigo-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">2. Select Colorway</p>
            <div className="flex flex-wrap gap-2">
              {RETAIL_COLORS.map((clr) => (
                <button
                  key={clr}
                  type="button"
                  onClick={() => onSelectColor(clr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    selectedColor === clr
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {clr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Variant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">{p.category}</span>
                <span className="text-slate-500 font-bold">Stock: {p.stock}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-2">{p.name}</h4>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">SKU: {p.sku} • ₹{p.price.toFixed(2)}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-700">
                <Layers className="w-3 h-3 text-indigo-600" />
                <span>Variant: {selectedSize} • {selectedColor}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onAddVariantToPos(p, selectedSize, selectedColor)}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Add Variant to POS</span>
              </button>
              {canPrintLabels && (
                <button
                  type="button"
                  onClick={() => onPrintLabel(p)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Print Shelf / Apparel Tag"
                >
                  <Tag className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface PgHostelRoomItem {
  roomNo: string;
  floor: "Floor 1" | "Floor 2";
  occupancyType: "Single AC" | "2-Sharing AC" | "3-Sharing Non-AC" | "4-Bed Dorm";
  acType: "AC" | "Non-AC";
  capacity: number;
  beds: string[];
  defaultMonthlyRent: number;
}

export interface PgResidentRecord {
  id: string;
  name: string;
  phone: string;
  idProofNo: string;
  roomNo: string;
  bedNo: string;
  occupancyType: string;
  messPlan: string;
  monthlyRent: number;
  checkInDate: string;
  rentStatus: "PAID" | "DUE";
  lastBilledMonth: string;
}

export const PG_HOSTEL_ROOMS: PgHostelRoomItem[] = [
  {
    roomNo: "Room 101",
    floor: "Floor 1",
    occupancyType: "2-Sharing AC",
    acType: "AC",
    capacity: 2,
    beds: ["Bed A", "Bed B"],
    defaultMonthlyRent: 8500
  },
  {
    roomNo: "Room 102",
    floor: "Floor 1",
    occupancyType: "3-Sharing Non-AC",
    acType: "Non-AC",
    capacity: 3,
    beds: ["Bed A", "Bed B", "Bed C"],
    defaultMonthlyRent: 6000
  },
  {
    roomNo: "Room 103",
    floor: "Floor 1",
    occupancyType: "Single AC",
    acType: "AC",
    capacity: 1,
    beds: ["Bed A"],
    defaultMonthlyRent: 14500
  },
  {
    roomNo: "Room 104",
    floor: "Floor 1",
    occupancyType: "2-Sharing AC",
    acType: "AC",
    capacity: 2,
    beds: ["Bed A", "Bed B"],
    defaultMonthlyRent: 8500
  },
  {
    roomNo: "Room 201",
    floor: "Floor 2",
    occupancyType: "2-Sharing AC",
    acType: "AC",
    capacity: 2,
    beds: ["Bed A", "Bed B"],
    defaultMonthlyRent: 8500
  },
  {
    roomNo: "Room 202",
    floor: "Floor 2",
    occupancyType: "3-Sharing Non-AC",
    acType: "Non-AC",
    capacity: 3,
    beds: ["Bed A", "Bed B", "Bed C"],
    defaultMonthlyRent: 6000
  },
  {
    roomNo: "Room 203",
    floor: "Floor 2",
    occupancyType: "4-Bed Dorm",
    acType: "Non-AC",
    capacity: 4,
    beds: ["Bed A", "Bed B", "Bed C", "Bed D"],
    defaultMonthlyRent: 5200
  },
  {
    roomNo: "Room 204",
    floor: "Floor 2",
    occupancyType: "Single AC",
    acType: "AC",
    capacity: 1,
    beds: ["Bed A"],
    defaultMonthlyRent: 14500
  }
];

interface PgHostelModuleViewProps {
  selectedRoomNo: string;
  selectedBedNo: string;
  billingMonth: string;
  messPlan: string;
  residents: PgResidentRecord[];
  products: Product[];
  onSelectBedForPos: (roomNo: string, bedNo: string, occupancyType: string) => void;
  onUpdateBillingMonth: (month: string) => void;
  onUpdateMessPlan: (plan: string) => void;
  onCheckInResident: (resident: PgResidentRecord) => void;
  onCheckOutResident: (residentId: string) => void;
  onToggleRentStatus: (residentId: string) => void;
  onBillResidentInPos: (resident: PgResidentRecord, includeMess: boolean) => void;
  onOpenPos: () => void;
}

export function PgHostelModuleView({
  selectedRoomNo,
  selectedBedNo,
  billingMonth,
  messPlan,
  residents,
  products,
  onSelectBedForPos,
  onUpdateBillingMonth,
  onUpdateMessPlan,
  onCheckInResident,
  onCheckOutResident,
  onToggleRentStatus,
  onBillResidentInPos,
  onOpenPos,
}: PgHostelModuleViewProps) {
  const [floorFilter, setFloorFilter] = useState<"ALL" | "Floor 1" | "Floor 2">("ALL");
  const [acFilter, setAcFilter] = useState<"ALL" | "AC" | "Non-AC">("ALL");
  const [residentSearch, setResidentSearch] = useState<string>("");

  // Check-In Form State
  const [newName, setNewName] = useState<string>("");
  const [newPhone, setNewPhone] = useState<string>("");
  const [newIdProof, setNewIdProof] = useState<string>("");
  const [checkInRoom, setCheckInRoom] = useState<string>(selectedRoomNo || "Room 101");
  const [checkInBed, setCheckInBed] = useState<string>(selectedBedNo || "Bed A");
  const [checkInMessPlan, setCheckInMessPlan] = useState<string>(messPlan || "3-Meal Home Mess");
  const [checkInRent, setCheckInRent] = useState<string>("8500");

  const totalBeds = PG_HOSTEL_ROOMS.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedCount = residents.length;
  const vacantCount = Math.max(0, totalBeds - occupiedCount);
  const dueResidents = residents.filter((r) => r.rentStatus === "DUE");
  const pendingRentAmount = dueResidents.reduce((acc, r) => acc + r.monthlyRent, 0);

  const visibleRooms = PG_HOSTEL_ROOMS.filter((room) => {
    if (floorFilter !== "ALL" && room.floor !== floorFilter) return false;
    if (acFilter !== "ALL" && room.acType !== acFilter) return false;
    return true;
  });

  const filteredResidents = residents.filter((res) => {
    const q = residentSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      res.name.toLowerCase().includes(q) ||
      res.roomNo.toLowerCase().includes(q) ||
      res.phone.toLowerCase().includes(q) ||
      res.idProofNo.toLowerCase().includes(q)
    );
  });

  const selectedRoomObj = PG_HOSTEL_ROOMS.find((r) => r.roomNo === checkInRoom) || PG_HOSTEL_ROOMS[0];

  const handleRoomDropdownChange = (roomNo: string) => {
    setCheckInRoom(roomNo);
    const roomObj = PG_HOSTEL_ROOMS.find((r) => r.roomNo === roomNo);
    if (roomObj) {
      setCheckInRent(String(roomObj.defaultMonthlyRent));
      const firstFreeBed = roomObj.beds.find(
        (b) => !residents.some((res) => res.roomNo === roomNo && res.bedNo === b)
      );
      setCheckInBed(firstFreeBed || roomObj.beds[0]);
    }
  };

  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    const isBedTaken = residents.some((r) => r.roomNo === checkInRoom && r.bedNo === checkInBed);
    if (isBedTaken) return;

    const roomMeta = PG_HOSTEL_ROOMS.find((r) => r.roomNo === checkInRoom);
    const record: PgResidentRecord = {
      id: `RES-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      idProofNo: newIdProof.trim() || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      roomNo: checkInRoom,
      bedNo: checkInBed,
      occupancyType: roomMeta?.occupancyType || "2-Sharing AC",
      messPlan: checkInMessPlan,
      monthlyRent: Math.max(1000, Number(checkInRent) || roomMeta?.defaultMonthlyRent || 8500),
      checkInDate: new Date().toISOString().split("T")[0],
      rentStatus: "DUE",
      lastBilledMonth: billingMonth,
    };
    onCheckInResident(record);
    setNewName("");
    setNewPhone("");
    setNewIdProof("");
  };

  const messFeeItem = products.find((p) => p.sku.includes("MES") || p.category.toLowerCase().includes("mess"));

  return (
    <div className="space-y-6" id="sector-pg-hostel-module-view">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-teal-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-teal-700" />
            PG &amp; Hostel Rooms, Bed Allocation &amp; Monthly Rent Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign vacant beds, manage resident check-ins, track monthly rent &amp; mess plans, and dispatch bills straight to POS checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-teal-50/80 border border-teal-200 p-2 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 px-2">
            <Home className="w-3.5 h-3.5 text-teal-700" />
            <span className="font-bold text-teal-950">POS Linked:</span>
            <span className="font-mono font-black text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
              {selectedRoomNo} / {selectedBedNo}
            </span>
          </div>
          <select
            value={billingMonth}
            onChange={(e) => onUpdateBillingMonth(e.target.value)}
            className="bg-white border border-teal-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            title="Active Rent Billing Month"
          >
            {["Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={messPlan}
            onChange={(e) => onUpdateMessPlan(e.target.value)}
            className="bg-white border border-teal-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            title="Default Mess Plan"
          >
            {["3-Meal Home Mess", "2-Meal Tiffin Plan", "Breakfast Only", "Room Only (No Mess)"].map((plan) => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={onOpenPos}
            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Open POS Terminal</span>
          </button>
        </div>
      </div>

      {/* Occupancy & Rent KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-teal-100 p-4 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Hostel Beds</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{totalBeds}</h3>
          <p className="text-[11px] font-medium text-teal-700 mt-0.5">{PG_HOSTEL_ROOMS.length} Active Rooms • 2 Floors</p>
        </div>
        <div className="bg-white rounded-2xl border border-teal-100 p-4 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Occupied Beds</p>
          <h3 className="text-2xl font-black text-teal-700 mt-1 tabular-nums">{occupiedCount}</h3>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 tabular-nums">
            {Math.round((occupiedCount / Math.max(1, totalBeds)) * 100)}% Occupancy Rate
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-teal-100 p-4 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vacant Beds Ready</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">{vacantCount}</h3>
          <p className="text-[11px] font-medium text-emerald-700 mt-0.5">Click any Vacant bed to allocate</p>
        </div>
        <div className="bg-white rounded-2xl border border-teal-100 p-4 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending Monthly Rent ({billingMonth})</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1 tabular-nums">₹{pendingRentAmount.toLocaleString("en-IN")}</h3>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 tabular-nums">
            {dueResidents.length} {dueResidents.length === 1 ? "resident" : "residents"} due for collection
          </p>
        </div>
      </div>

      {/* Floor & Room Grid + Resident Check-In Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room & Bed Allocation Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700" />
                Floor &amp; Room Bed Matrix
              </h3>
              <p className="text-[11px] text-slate-500">
                Select a bed slot to prepare check-in or link directly to POS rent billing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
              {(["ALL", "Floor 1", "Floor 2"] as const).map((fl) => (
                <button
                  key={fl}
                  type="button"
                  onClick={() => setFloorFilter(fl)}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                    floorFilter === fl
                      ? "bg-teal-700 text-white border-teal-700"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50"
                  }`}
                >
                  {fl === "ALL" ? "All Floors" : fl}
                </button>
              ))}
              {(["ALL", "AC", "Non-AC"] as const).map((ac) => (
                <button
                  key={ac}
                  type="button"
                  onClick={() => setAcFilter(ac)}
                  className={`px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                    acFilter === ac
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {ac === "ALL" ? "All Types" : ac}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleRooms.map((room) => {
              const roomResidents = residents.filter((r) => r.roomNo === room.roomNo);
              return (
                <div
                  key={room.roomNo}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{room.roomNo}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                          {room.floor}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {room.occupancyType} • <span className="font-mono font-bold text-slate-700 tabular-nums">₹{room.defaultMonthlyRent.toLocaleString("en-IN")}/mo</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 tabular-nums">
                      {roomResidents.length}/{room.capacity} Occupied
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {room.beds.map((bed) => {
                      const occupant = roomResidents.find((r) => r.bedNo === bed);
                      const isSelectedSlot = selectedRoomNo === room.roomNo && selectedBedNo === bed;
                      return (
                        <button
                          key={bed}
                          type="button"
                          onClick={() => {
                            onSelectBedForPos(room.roomNo, bed, room.occupancyType);
                            if (!occupant) {
                              setCheckInRoom(room.roomNo);
                              setCheckInBed(bed);
                              setCheckInRent(String(room.defaultMonthlyRent));
                            }
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelectedSlot
                              ? "ring-2 ring-teal-500 border-teal-600 bg-white"
                              : occupant
                              ? occupant.rentStatus === "DUE"
                                ? "bg-amber-50/80 border-amber-200 hover:border-amber-400"
                                : "bg-white border-teal-200 hover:border-teal-400"
                              : "bg-emerald-50/70 border-dashed border-emerald-300 hover:border-emerald-500"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-black text-slate-800">{bed}</span>
                            {occupant ? (
                              <span
                                className={`font-bold px-1.5 py-0.5 rounded ${
                                  occupant.rentStatus === "PAID"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {occupant.rentStatus}
                              </span>
                            ) : (
                              <span className="font-bold text-emerald-700">VACANT</span>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-slate-700 truncate mt-1">
                            {occupant ? occupant.name : "Available for Check-In"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resident Check-In & Bed Allocation Form */}
        <form
          onSubmit={handleSubmitCheckIn}
          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 h-fit"
        >
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-teal-700" />
            Check-In / Allocate Resident
          </h3>
          <p className="text-[11px] text-slate-500">
            Assign an incoming student or working professional to a vacant bed.
          </p>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Resident Full Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Karthik Nair"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">ID / Roll No.</label>
                <input
                  type="text"
                  value={newIdProof}
                  onChange={(e) => setNewIdProof(e.target.value)}
                  placeholder="AADHAR / EMP"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Room No.</label>
                <select
                  value={checkInRoom}
                  onChange={(e) => handleRoomDropdownChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-2 font-bold text-slate-800 bg-white focus:border-teal-500 focus:outline-none"
                >
                  {PG_HOSTEL_ROOMS.map((r) => (
                    <option key={r.roomNo} value={r.roomNo}>
                      {r.roomNo} ({r.acType})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Bed Slot</label>
                <select
                  value={checkInBed}
                  onChange={(e) => setCheckInBed(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-2 font-bold text-slate-800 bg-white focus:border-teal-500 focus:outline-none"
                >
                  {selectedRoomObj.beds.map((b) => {
                    const taken = residents.some((r) => r.roomNo === checkInRoom && r.bedNo === b);
                    return (
                      <option key={b} value={b} disabled={taken}>
                        {b} {taken ? "(Occupied)" : "(Vacant)"}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Mess Plan</label>
                <select
                  value={checkInMessPlan}
                  onChange={(e) => setCheckInMessPlan(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-2 font-bold text-slate-800 bg-white focus:border-teal-500 focus:outline-none"
                >
                  {["3-Meal Home Mess", "2-Meal Tiffin Plan", "Breakfast Only", "Room Only (No Mess)"].map((plan) => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  min="1000"
                  step="100"
                  value={checkInRent}
                  onChange={(e) => setCheckInRent(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-slate-800 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {residents.some((r) => r.roomNo === checkInRoom && r.bedNo === checkInBed) && (
              <p className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5">
                {checkInRoom} {checkInBed} is currently occupied. Pick a vacant bed slot.
              </p>
            )}

            <button
              type="submit"
              disabled={residents.some((r) => r.roomNo === checkInRoom && r.bedNo === checkInBed)}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Assign Bed &amp; Check-In Resident</span>
            </button>
          </div>
        </form>
      </div>

      {/* Resident Directory & Monthly Rent Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Active Resident Directory &amp; Rent Ledger ({filteredResidents.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Toggle monthly rent status, dispatch itemized room rent + mess bills to POS, or process resident check-out.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={residentSearch}
              onChange={(e) => setResidentSearch(e.target.value)}
              placeholder="Search resident, room, mobile, or ID..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:border-teal-500 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3">Resident</th>
                <th className="py-2.5 px-3">Room / Bed</th>
                <th className="py-2.5 px-3">Mess Plan</th>
                <th className="py-2.5 px-3 text-right">Monthly Rent</th>
                <th className="py-2.5 px-3">Status ({billingMonth})</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map((res) => (
                <tr key={res.id} className="hover:bg-teal-50/30 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{res.name}</p>
                    <p className="text-[10.5px] font-mono text-slate-500">
                      {res.phone} • ID: {res.idProofNo}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{res.roomNo}</span>{" "}
                    <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                      {res.bedNo}
                    </span>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">{res.occupancyType}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {res.messPlan}
                    <p className="text-[10px] text-slate-400">Since {res.checkInDate}</p>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-slate-900 tabular-nums">
                    ₹{res.monthlyRent.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => onToggleRentStatus(res.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black border cursor-pointer transition-colors ${
                        res.rentStatus === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                      }`}
                      title="Click to toggle Paid / Due status"
                    >
                      {res.rentStatus === "PAID" ? "✓ PAID" : "● DUE"}
                    </button>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onBillResidentInPos(res, false)}
                        className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-[10.5px] font-bold cursor-pointer"
                      >
                        Bill Rent
                      </button>
                      {messFeeItem && res.messPlan !== "Room Only (No Mess)" && (
                        <button
                          type="button"
                          onClick={() => onBillResidentInPos(res, true)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10.5px] font-bold cursor-pointer"
                          title={`Add Rent + ${messFeeItem.name}`}
                        >
                          + Mess
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onCheckOutResident(res.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg cursor-pointer"
                        title="Check-Out Resident & Free Bed"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredResidents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No matching residents found. Allocate a vacant bed above to add a resident.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export interface GarmentAlterationSlip {
  id: string;
  customerName: string;
  customerPhone: string;
  garmentName: string;
  productId: string;
  size: string;
  color: string;
  fit: string;
  alterationTask: string;
  measurementsNote: string;
  readyDate: string;
  feeAmount: number;
  status: "PENDING" | "IN_TAILORING" | "READY" | "DELIVERED";
}

interface FashionTailoringModuleViewProps {
  products: Product[];
  selectedSize: string;
  selectedColor: string;
  selectedFit: string;
  selectedSeason: string;
  alterations: GarmentAlterationSlip[];
  onSelectSize: (sz: string) => void;
  onSelectColor: (clr: string) => void;
  onSelectFit: (fit: string) => void;
  onSelectSeason: (season: string) => void;
  onAddGarmentToPos: (
    product: Product,
    size: string,
    color: string,
    fit: string,
    season: string
  ) => void;
  onCreateAlterationSlip: (slip: GarmentAlterationSlip) => void;
  onAdvanceAlterationStatus: (slipId: string) => void;
  onBillAlterationInPos: (slip: GarmentAlterationSlip) => void;
  onPrintLabel: (product: Product) => void;
  canPrintLabels: boolean;
  onOpenPos: () => void;
}

const FASHION_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "28", "30", "32", "34", "36"];
const FASHION_COLORS = [
  "Ivory Cream",
  "Midnight Navy",
  "Burgundy Rose",
  "Olive Sage",
  "Jet Black",
  "Indigo Denim",
  "Mustard Gold",
];
const FASHION_FITS = ["Slim Fit", "Regular Fit", "Tailored Fit", "Relaxed Ethnic"];
const FASHION_SEASONS = ["SS 2026", "Festive 2026", "AW 2026"];
const ALTERATION_TASKS = [
  "Trouser Hemming",
  "Sleeve Length Fit",
  "Waist / Side Taper",
  "Kurta & Ethnic Fit",
  "Custom Blouse Stitching",
];

export function FashionTailoringModuleView({
  products,
  selectedSize,
  selectedColor,
  selectedFit,
  selectedSeason,
  alterations,
  onSelectSize,
  onSelectColor,
  onSelectFit,
  onSelectSeason,
  onAddGarmentToPos,
  onCreateAlterationSlip,
  onAdvanceAlterationStatus,
  onBillAlterationInPos,
  onPrintLabel,
  canPrintLabels,
  onOpenPos,
}: FashionTailoringModuleViewProps) {
  const [slipSearch, setSlipSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | GarmentAlterationSlip["status"]
  >("ALL");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedGarmentId, setSelectedGarmentId] = useState(
    products[0]?.id || ""
  );
  const [alterationTask, setAlterationTask] = useState("Trouser Hemming");
  const [measurementsNote, setMeasurementsNote] = useState("");
  const [readyDate, setReadyDate] = useState("2026-11-26");
  const [feeAmount, setFeeAmount] = useState("250");

  const pendingCount = alterations.filter(
    (a) => a.status === "PENDING" || a.status === "IN_TAILORING"
  ).length;
  const readyCount = alterations.filter((a) => a.status === "READY").length;

  const filteredSlips = alterations.filter((slip) => {
    if (statusFilter !== "ALL" && slip.status !== statusFilter) return false;
    const q = slipSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      slip.id.toLowerCase().includes(q) ||
      slip.customerName.toLowerCase().includes(q) ||
      slip.garmentName.toLowerCase().includes(q) ||
      slip.alterationTask.toLowerCase().includes(q)
    );
  });

  const handleSubmitSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;
    const matchedProd =
      products.find((p) => p.id === selectedGarmentId) || products[0];
    const slip: GarmentAlterationSlip = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      garmentName: matchedProd?.name || "Custom Garment Item",
      productId: matchedProd?.id || "",
      size: selectedSize,
      color: selectedColor,
      fit: selectedFit,
      alterationTask,
      measurementsNote: measurementsNote.trim() || "Standard boutique finish",
      readyDate: readyDate || "2026-11-26",
      feeAmount: Math.max(0, Number(feeAmount) || 0),
      status: "PENDING",
    };
    onCreateAlterationSlip(slip);
    setCustomerName("");
    setCustomerPhone("");
    setMeasurementsNote("");
  };

  const statusBadgeClass = (status: GarmentAlterationSlip["status"]) => {
    if (status === "READY") return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    if (status === "IN_TAILORING") return "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100";
    if (status === "DELIVERED") return "bg-slate-100 text-slate-600 border-slate-200";
    return "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100";
  };

  return (
    <div className="space-y-6" id="sector-fashion-module-view">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Shirt className="w-5 h-5 text-rose-800" />
            <span>Fashion Garment Matrix &amp; Tailoring Studio</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure Size, Shade, Fit &amp; Collection tags for POS checkout, print hang tags, and manage customer alteration job slips.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-700" />
            <span className="font-bold text-rose-950">
              {selectedSize} / {selectedColor} • {selectedFit} ({selectedSeason})
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenPos}
            className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Open POS Terminal</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Active Styles / SKUs</p>
          <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{products.length}</p>
          <p className="text-[11px] font-semibold text-rose-700 mt-0.5">Boutique catalog ready</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200/80 p-4 shadow-sm">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Pending Alterations</p>
          <p className="text-2xl font-black text-amber-700 mt-1 tabular-nums">{pendingCount}</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">In tailoring queue</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 shadow-sm">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Ready for Pickup</p>
          <p className="text-2xl font-black text-emerald-700 mt-1 tabular-nums">{readyCount}</p>
          <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">Stitched &amp; steamed</p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-100 p-4 shadow-sm">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Season Collection</p>
          <p className="text-xl font-black text-rose-900 mt-1">{selectedSeason}</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Active POS tag preset</p>
        </div>
      </div>

      {/* Interactive Garment Size / Shade / Fit / Season Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
              1. Apparel / Waist Size
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FASHION_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectSize(sz)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    selectedSize === sz
                      ? "bg-rose-900 text-white border-rose-900 shadow-xs"
                      : "bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
              2. Fabric Shade / Colorway
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FASHION_COLORS.map((clr) => (
                <button
                  key={clr}
                  type="button"
                  onClick={() => onSelectColor(clr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    selectedColor === clr
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {clr}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
              3. Garment Fit Profile
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FASHION_FITS.map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => onSelectFit(fit)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    selectedFit === fit
                      ? "bg-rose-700 text-white border-rose-700 shadow-xs"
                      : "bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
              4. Collection / Season Tag
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FASHION_SEASONS.map((season) => (
                <button
                  key={season}
                  type="button"
                  onClick={() => onSelectSeason(season)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                    selectedSeason === season
                      ? "bg-amber-700 text-white border-amber-700 shadow-xs"
                      : "bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Garment SKU Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded font-bold uppercase">
                  {p.category}
                </span>
                <span className="text-slate-500 font-bold tabular-nums">Stock: {p.stock}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-2">{p.name}</h4>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5 tabular-nums">
                SKU: {p.sku} • ₹{p.price.toFixed(2)}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50/70 text-[11px] font-bold text-rose-900 border border-rose-100">
                <Layers className="w-3 h-3 text-rose-700" />
                <span>
                  {selectedSize} • {selectedColor} • {selectedFit}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  onAddGarmentToPos(
                    p,
                    selectedSize,
                    selectedColor,
                    selectedFit,
                    selectedSeason
                  )
                }
                className="flex-1 py-2 px-3 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Add Garment to POS</span>
              </button>
              {canPrintLabels && (
                <button
                  type="button"
                  onClick={() => onPrintLabel(p)}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Print Garment Hang Tag"
                >
                  <Tag className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tailoring & Alteration Job Slips */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Create Slip Form */}
        <form
          onSubmit={handleSubmitSlip}
          className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm space-y-3"
        >
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-rose-800" />
            <span>New Alteration &amp; Tailoring Slip</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Kavya Nair"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-400 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Mobile Number *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 11223"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-400 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Garment Item
              </label>
              <select
                value={selectedGarmentId}
                onChange={(e) => setSelectedGarmentId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-400 outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Alteration Task
                </label>
                <select
                  value={alterationTask}
                  onChange={(e) => setAlterationTask(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-2 font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-400 outline-none"
                >
                  {ALTERATION_TASKS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Tailoring Fee (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-2 font-mono font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-400 outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Ready Date
                </label>
                <input
                  type="date"
                  value={readyDate}
                  onChange={(e) => setReadyDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2.5 py-2 font-mono font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-400 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Active Matrix
                </label>
                <div className="border border-rose-100 bg-rose-50/70 rounded-xl px-2.5 py-2 text-[11px] font-bold text-rose-900 truncate">
                  {selectedSize} / {selectedFit}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                Measurements / Instructions
              </label>
              <input
                type="text"
                value={measurementsNote}
                onChange={(e) => setMeasurementsNote(e.target.value)}
                placeholder="e.g. Shorten length by 1.5 in, keep original hem"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-rose-400 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Alteration Slip</span>
          </button>
        </form>

        {/* Alteration Slip Register */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Tailoring &amp; Alteration Slip Queue
              </h3>
              <p className="text-[11px] text-slate-500">
                Click any status badge to advance workflow or bill the garment + tailoring fee in POS.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={slipSearch}
                  onChange={(e) => setSlipSearch(e.target.value)}
                  placeholder="Search slip or customer..."
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-rose-400 outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "ALL" | GarmentAlterationSlip["status"]
                  )
                }
                className="text-xs font-bold border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 text-slate-800 outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_TAILORING">In Tailoring</option>
                <option value="READY">Ready</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-2.5 px-3">Slip &amp; Customer</th>
                  <th className="py-2.5 px-3">Garment &amp; Matrix</th>
                  <th className="py-2.5 px-3">Alteration Task</th>
                  <th className="py-2.5 px-3 text-right">Fee</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-mono text-[10.5px] font-black text-rose-800">{slip.id}</p>
                      <p className="font-bold text-slate-900">{slip.customerName}</p>
                      <p className="text-[10.5px] text-slate-500 font-mono">{slip.customerPhone}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">{slip.garmentName}</p>
                      <p className="text-[10.5px] text-slate-500">
                        {slip.size} • {slip.color} • {slip.fit}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">{slip.alterationTask}</p>
                      <p className="text-[10.5px] text-slate-500">{slip.measurementsNote}</p>
                      <p className="text-[10px] font-mono text-rose-700 mt-0.5">Ready: {slip.readyDate}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900 tabular-nums">
                      ₹{slip.feeAmount.toFixed(0)}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onAdvanceAlterationStatus(slip.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black border cursor-pointer transition-colors ${statusBadgeClass(slip.status)}`}
                        title="Click to advance tailoring status"
                      >
                        {slip.status.replace("_", " ")}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onBillAlterationInPos(slip)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10.5px] font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingCart className="w-3 h-3 text-rose-300" />
                        <span>Bill in POS</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSlips.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No alteration slips match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


