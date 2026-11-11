import React, { useState, useEffect } from "react";
import { StoreBranch, Tenant } from "../types";
import { MapPin, Phone, Building2, FileText, CheckCircle2, X } from "lucide-react";

interface EditReceiptAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTenant: Tenant;
  currentBranch: StoreBranch | null;
  receiptHeader: string;
  receiptFooter: string;
  onSave: (details: {
    storeName: string;
    receiptHeader: string;
    receiptFooter: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    gstin: string;
  }) => void;
}

export const EditReceiptAddressModal: React.FC<EditReceiptAddressModalProps> = ({
  isOpen,
  onClose,
  activeTenant,
  currentBranch,
  receiptHeader,
  receiptFooter,
  onSave
}) => {
  const [storeName, setStoreName] = useState<string>(
    activeTenant.businessLocation || activeTenant.name || currentBranch?.name || ""
  );
  const [headerTitle, setHeaderTitle] = useState<string>(
    receiptHeader || "OFFICIAL RETAIL CASH INVOICE"
  );
  const [address, setAddress] = useState<string>(
    activeTenant.address || currentBranch?.address || ""
  );
  const [city, setCity] = useState<string>(
    activeTenant.city || currentBranch?.city || ""
  );
  const [state, setState] = useState<string>(
    activeTenant.state || ""
  );
  const [pincode, setPincode] = useState<string>(
    activeTenant.pincode || ""
  );
  const [phone, setPhone] = useState<string>(
    activeTenant.phone || currentBranch?.phone || ""
  );
  const [gstin, setGstin] = useState<string>(
    activeTenant.gstinRegNumber || currentBranch?.gstin || ""
  );
  const [footerText, setFooterText] = useState<string>(
    receiptFooter || ""
  );

  // Sync state whenever modal opens or tenant changes
  useEffect(() => {
    if (isOpen) {
      setStoreName(activeTenant.businessLocation || activeTenant.name || currentBranch?.name || "");
      setHeaderTitle(receiptHeader || "OFFICIAL RETAIL CASH INVOICE");
      setAddress(activeTenant.address || currentBranch?.address || "");
      setCity(activeTenant.city || currentBranch?.city || "");
      setState(activeTenant.state || "");
      setPincode(activeTenant.pincode || "");
      setPhone(activeTenant.phone || currentBranch?.phone || "");
      setGstin(activeTenant.gstinRegNumber || currentBranch?.gstin || "");
      setFooterText(receiptFooter || "");
    }
  }, [isOpen, activeTenant, currentBranch, receiptHeader, receiptFooter]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      storeName: storeName.trim(),
      receiptHeader: headerTitle.trim(),
      receiptFooter: footerText.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      phone: phone.trim(),
      gstin: gstin.trim()
    });
    onClose();
  };

  const formattedAddressPreview = [address, city, state].filter(Boolean).join(", ") + (pincode ? ` - ${pincode}` : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Edit Receipt Address &amp; Store Details</h3>
              <p className="text-[11px] text-slate-400">
                Update store location, address line, phone, and GSTIN printed on cash receipts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Live Thermal Receipt Header Preview */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🧾 Live Thermal Receipt Header Preview</span>
            </p>
            <div className="bg-white border border-slate-200 rounded-lg p-3 max-w-sm mx-auto shadow-xs text-center font-mono">
              <h4 className="font-display font-black text-xs uppercase text-slate-950">
                ⭐ {storeName || activeTenant.name} ⭐
              </h4>
              <p className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wide">
                {headerTitle || "OFFICIAL RETAIL CASH INVOICE"}
              </p>
              <p className="text-[9.5px] text-slate-600 font-semibold mt-0.5">
                {storeName || activeTenant.name}
              </p>
              <p className="text-[9.5px] text-slate-600 leading-tight">
                {formattedAddressPreview || "Registered Store Address"}
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Contact: {phone || activeTenant.phone || "N/A"}
              </p>
              <p className="text-[8.5px] text-slate-500 border-t border-dashed border-slate-200 pt-1 mt-1 font-bold">
                GSTIN: {gstin || activeTenant.gstinRegNumber || "N/A"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Store / Branch Display Name *
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Main Flagship Outlet / Store #01"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Receipt Header Title
                </label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="e.g. OFFICIAL RETAIL CASH INVOICE"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Physical Address Line (Street / Plaza / Unit) *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Plot 14, Commercial Avenue, Sector 18"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. New Delhi"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Delhi"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 110001"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Contact Telephone / Mobile *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 811-23456789"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  GSTIN / Tax ID Check *
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="e.g. 07EXPAID5058A1Z1"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-mono uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Receipt Footer Greeting Note (Optional)
              </label>
              <textarea
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="e.g. Thank you for shopping with us! Visit again for special weekly deals."
                rows={2}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save &amp; Update Receipt Address</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
