import React, { useState } from "react";
import { 
  Users, Key, Trash2, ShieldCheck, UserCheck, 
  Shuffle, Eye, EyeOff, Plus, FileText,
  Edit, X, Check, Mail, Lock, User, ShieldAlert,
  Calendar, Star, Award, Briefcase, PlusCircle, Clock, CheckCircle2, AlertCircle, FileMinus
} from "lucide-react";
import { UserRole, Tenant, StoreBranch } from "../types";

export interface AccessProfile {
  role: UserRole;
  title: string;
  email: string;
  password: string;
  name: string;
  color: string;
  gradient: string;
  bgHover: string;
  accent: string;
  border: string;
  glow: string;
  description: string;
  privileges: string[];
  tenantId?: string; // Explicit tenant mapping
  storeBranchId?: string; // Associated branch ID
  // New employee-details fields for manager & admin audits
  phone?: string;
  joinedDate?: string;
  salary?: number;
  status?: "Active" | "Inactive" | "On Leave";
  attendance?: Array<{
    date: string;
    checkIn: string;
    checkOut: string;
    status: "Present" | "Absent" | "Late" | "Sick";
  }>;
  leaves?: Array<{
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    comments?: string;
  }>;
  performance?: {
    salesKpi: number; // e.g. monthly sales completed
    rating: number; // e.g. 1 to 5 stars
    attendanceScore: number; // e.g. attendance percentage
    monthlyNotes?: string; // custom feedback notes
  };
}

interface StaffRegistryProps {
  credentialsList: AccessProfile[];
  onUpdateCredentials: (newList: AccessProfile[]) => void;
  triggerNotification: (msg: string, type: "success" | "warning") => void;
  activeTenant: Tenant;
  branches: StoreBranch[];
  currentRole: UserRole;
  currentBranch: StoreBranch | null;
  currentTheme?: any;
}

export default function StaffRegistry({
  credentialsList,
  onUpdateCredentials,
  triggerNotification,
  activeTenant,
  branches,
  currentRole,
  currentBranch,
  currentTheme
}: StaffRegistryProps) {
  const theme = currentTheme || {
    bg: "bg-[#1E4D3E]",
    bgHover: "hover:bg-[#12362B]",
    bgLight: "bg-[#F6F5F0]",
    bgLightTransparent: "bg-[#1E4D3E]/8",
    text: "text-[#1E4D3E]",
    textAccent: "text-[#286450]",
    textAccentDark: "text-[#0F2D23]",
    hoverBg: "hover:bg-[#1E4D3E]",
    border: "border-stone-300",
    borderAccent: "border-stone-400",
    borderLight: "border-stone-200",
    glow: "shadow-stone-300/10 hover:shadow-stone-300/25",
    activeTab: "bg-stone-200/50 text-[#1E4D3E] border border-stone-400/50"
  };

  const [activeSubView, setActiveSubView] = useState<"list" | "register">("list");
  const [newStaffBranchId, setNewStaffBranchId] = useState<string>(() => {
    if (currentRole === UserRole.MANAGER && currentBranch) {
      return currentBranch.id;
    }
    return "";
  });
  const [editStaffBranchId, setEditStaffBranchId] = useState<string>("");
  
  // Interactive options states (view, edit, delete confirmation)
  const [viewingStaff, setViewingStaff] = useState<AccessProfile | null>(null);
  const [editingStaff, setEditingStaff] = useState<AccessProfile | null>(null);
  const [editStaffOriginalEmail, setEditStaffOriginalEmail] = useState("");

  // System states for managing viewingStaff details & operational sub-tabs
  const [viewModalTab, setViewModalTab] = useState<"details" | "attendance" | "leaves" | "performance">("details");

  // State for editing staff details inside view modal
  const [editPhone, setEditPhone] = useState("");
  const [editJoinedDate, setEditJoinedDate] = useState("");
  const [editSalary, setEditSalary] = useState<number>(22500);
  const [editStatus, setEditStatus] = useState<"Active" | "Inactive" | "On Leave">("Active");

  // State for adding attendance log inside view modal
  const [attDate, setAttDate] = useState("");
  const [attStatus, setAttStatus] = useState<"Present" | "Absent" | "Late" | "Sick">("Present");
  const [attCheckIn, setAttCheckIn] = useState("09:00 AM");
  const [attCheckOut, setAttCheckOut] = useState("06:00 PM");

  // State for adding leaves request inside view modal
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  // State for logging appraisal inside view modal
  const [perfRating, setPerfRating] = useState<number>(4.8);
  const [perfKpi, setPerfKpi] = useState<number>(145);
  const [perfScore, setPerfScore] = useState<number>(95);
  const [perfNotes, setPerfNotes] = useState("");

  // Helpers to fetch staff custom data elements with elegant mock fallbacks for older structures
  const getStaffJoinedDate = (cred: AccessProfile) => cred.joinedDate || "2026-05-15";
  const getStaffPhone = (cred: AccessProfile) => cred.phone || "98765 43210";
  const getStaffSalary = (cred: AccessProfile) => cred.salary || 22500;
  const getStaffStatus = (cred: AccessProfile) => cred.status || "Active";
  
  const getStaffAttendance = (cred: AccessProfile): Array<{ date: string; checkIn: string; checkOut: string; status: "Present" | "Absent" | "Late" | "Sick" }> => {
    return cred.attendance || [
      { date: "2026-05-26", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present" },
      { date: "2026-05-27", checkIn: "08:58 AM", checkOut: "06:05 PM", status: "Present" },
      { date: "2026-05-28", checkIn: "09:15 AM", checkOut: "06:00 PM", status: "Late" },
      { date: "2026-05-29", checkIn: "09:02 AM", checkOut: "05:55 PM", status: "Present" },
    ];
  };

  const getStaffLeaves = (cred: AccessProfile): Array<{ id: string; type: string; startDate: string; endDate: string; reason: string; status: "PENDING" | "APPROVED" | "REJECTED"; comments?: string }> => {
    return cred.leaves || [
      { id: "LV-302", type: "Sick Leave", startDate: "2026-06-02", endDate: "2026-06-03", reason: "Medical dental appointment", status: "PENDING" },
      { id: "LV-198", type: "Casual Leave", startDate: "2026-05-10", endDate: "2026-05-11", reason: "Family congregation", status: "APPROVED", comments: "Cleared by manager" }
    ];
  };

  const getStaffPerformance = (cred: AccessProfile): { salesKpi: number; rating: number; attendanceScore: number; monthlyNotes?: string } => {
    return cred.performance || {
      salesKpi: 145,
      rating: 4.8,
      attendanceScore: 95,
      monthlyNotes: "Consistently highly punctual, outstanding checkout speed, positive customer feedback."
    };
  };

  const handleOpenViewModal = (staff: AccessProfile) => {
    setViewingStaff(staff);
    setViewModalTab("details");
    
    // Details tab fields
    setEditPhone(staff.phone || "98765 43210");
    setEditJoinedDate(staff.joinedDate || "2026-05-15");
    setEditSalary(staff.salary || 22500);
    setEditStatus(staff.status || "Active");

    // Attendance tab fields
    setAttDate(new Date().toISOString().split("T")[0]);
    setAttStatus("Present");
    setAttCheckIn("09:00 AM");
    setAttCheckOut("06:00 PM");

    // Leaves tab fields
    setLeaveType("Sick Leave");
    setLeaveStart("2026-06-05");
    setLeaveEnd("2026-06-06");
    setLeaveReason("");

    // Performance tab fields
    const perfExists = staff.performance || { salesKpi: 145, rating: 4.8, attendanceScore: 95, monthlyNotes: "Highly punctual and fast checkout speed." };
    setPerfRating(perfExists.rating);
    setPerfKpi(perfExists.salesKpi);
    setPerfScore(perfExists.attendanceScore);
    setPerfNotes(perfExists.monthlyNotes || "");
  };

  const updateStaffMember = (updatedStaff: AccessProfile) => {
    const updatedList = credentialsList.map(c => 
      c.email.toLowerCase() === updatedStaff.email.toLowerCase() ? updatedStaff : c
    );
    onUpdateCredentials(updatedList);
    setViewingStaff(updatedStaff);
  };
  const [editStaffName, setEditStaffName] = useState("");
  const [editStaffEmail, setEditStaffEmail] = useState("");
  const [editStaffPassword, setEditStaffPassword] = useState("");
  const [editStaffRole, setEditStaffRole] = useState<UserRole>(UserRole.CASHIER);
  const [editStaffTitle, setEditStaffTitle] = useState("");
  const [editStaffPrivileges, setEditStaffPrivileges] = useState<string[]>([]);
  const [editStaffCustomPrivilege, setEditStaffCustomPrivilege] = useState("");
  const [showEditStaffFormPassword, setShowEditStaffFormPassword] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<AccessProfile | null>(null);

  // Registration States
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>(UserRole.CASHIER);
  const [newTitle, setNewTitle] = useState("Cashier Billing Only");
  const [showFormPassword, setShowFormPassword] = useState(false);
  
  // Custom privileges states
  const [privilegeList, setPrivilegeList] = useState<string[]>([
    "POS checkout scanning", "Configure item quantities", "Associate loyalty members", "UPI, Cash, or Card prints"
  ]);
  const [customPrivilegeInput, setCustomPrivilegeInput] = useState("");

  // Helper matching to filter credentials belonging specifically to this active tenant, plus branch control if MANAGER
  const filteredStaff = credentialsList.filter((cred) => {
    if (cred.email === "superadmin@expertaid.com") return false;
    
    let isTenantMatch = false;
    
    // 1. Explicit tenantId match
    if (cred.tenantId) {
      isTenantMatch = (cred.tenantId === activeTenant.id);
    } else {
      // 2. Fallback: match based on email domain suffix
      const tenantDomain = activeTenant.adminEmail.split("@")[1]?.toLowerCase();
      const credDomain = cred.email.split("@")[1]?.toLowerCase();
      if (tenantDomain && credDomain && tenantDomain === credDomain) {
        isTenantMatch = true;
      } else if (cred.title.toLowerCase().includes(activeTenant.name.toLowerCase()) || 
                 cred.title.toLowerCase().includes(activeTenant.subdomain.toLowerCase())) {
        // 3. Fallback: match by title / name context
        isTenantMatch = true;
      }
    }

    if (!isTenantMatch) return false;

    // 4. Branch Restriction for Managers: managers only view/manage staff assigned to their branch
    if (currentRole === UserRole.MANAGER && currentBranch) {
      return cred.storeBranchId === currentBranch.id;
    }

    return true;
  });

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
    triggerNotification("Generated a strong cryptographic password passkey!", "success");
  };

  const handleRoleChange = (role: UserRole) => {
    setNewRole(role);
    if (role === UserRole.ADMIN) {
      setNewTitle("Admin Full Control");
      setPrivilegeList(["POS Sandbox access", "Audit profit & tax ledgers", "Modify products/suppliers", "Administer loyalty points"]);
    } else if (role === UserRole.MANAGER) {
      setNewTitle("Manager Reports & Stock");
      setPrivilegeList(["Analytics dashboard view", "Adjust and count stock", "Log utility & operating expenses", "Review cash drawers & logs"]);
    } else if (role === UserRole.CASHIER) {
      setNewTitle("Cashier Billing Only");
      setPrivilegeList(["POS checkout scanning", "Configure item quantities", "Associate loyalty members", "UPI, Cash, or Card prints"]);
    } else if (role === UserRole.STORE_KEEPER) {
      setNewTitle("Store Keeper Inventory Management");
      setPrivilegeList(["Inventory levels inspection", "Filter categories & alert status", "Register new supplier entries", "Expiry count audits"]);
    }
  };

  const handleAddPrivilege = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customPrivilegeInput.trim();
    if (!clean) return;

    if (privilegeList.includes(clean)) {
      triggerNotification("This capability has already been listed.", "warning");
      return;
    }

    setPrivilegeList((prev) => [...prev, clean]);
    setCustomPrivilegeInput("");
  };

  const removePrivilege = (idx: number) => {
    setPrivilegeList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRegisterProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const name = newName.trim();
    const email = newEmail.trim().toLowerCase();
    const password = newPassword.trim();
    const title = newTitle.trim() || `${newRole.charAt(0) + newRole.slice(1).toLowerCase()} Access Key`;

    if (!name || !email || !password) {
      triggerNotification("Please fill in Name, Email and Password security headers.", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      triggerNotification("Invalid email address format.", "warning");
      return;
    }

    // Email domain validation to enforce tenant workspace alignment
    const tenantDomain = activeTenant.adminEmail.split("@")[1]?.toLowerCase();
    const inputDomain = email.split("@")[1]?.toLowerCase();
    if (tenantDomain && inputDomain && tenantDomain !== inputDomain) {
      triggerNotification(`Domain Mismatch: For data integrity, staff email must match your active corporate domain suffix '@${tenantDomain}'.`, "warning");
      return;
    }

    if (credentialsList.some((cred) => cred.email.toLowerCase() === email)) {
      triggerNotification(`Registration Rejected: Another profile is already registered under '${email}'.`, "warning");
      return;
    }

    let color = "slate";
    let gradient = "from-slate-500 to-zinc-600";
    let bgHover = "hover:bg-slate-500/5";
    let accent = "text-slate-500";
    let border = "border-slate-500/20";
    let glow = "shadow-slate-500/10";
    let standardDesc = "Granted workspace capabilities in accordance with the retail security charter.";

    if (newRole === UserRole.ADMIN) {
      color = activeTenant.colorTheme;
      gradient = activeTenant.colorTheme === "indigo" ? "from-indigo-500 to-violet-600" :
                 activeTenant.colorTheme === "amber" ? "from-amber-500 to-orange-600" :
                 activeTenant.colorTheme === "rose" ? "from-rose-500 to-pink-600" :
                 activeTenant.colorTheme === "violet" ? "from-purple-500 to-indigo-600" :
                 "from-emerald-500 to-teal-600";
      bgHover = `hover:bg-${activeTenant.colorTheme}-500/5`;
      accent = `text-${activeTenant.colorTheme}-500`;
      border = `border-${activeTenant.colorTheme}-500/20`;
      glow = `shadow-${activeTenant.colorTheme}-500/10`;
      standardDesc = "Full master key to POS checkout, financial ledgers, inventory catalogue, CRM, expense logs, and AI Copilot.";
    } else if (newRole === UserRole.MANAGER) {
      color = "indigo";
      gradient = "from-indigo-500 to-violet-600";
      bgHover = "hover:bg-indigo-500/5";
      accent = "text-indigo-400";
      border = "border-indigo-500/20";
      glow = "shadow-indigo-500/10";
      standardDesc = "Manage physical store health, reconcile stock adjustment ledgers, approve utility expenses, and review reports.";
    } else if (newRole === UserRole.CASHIER) {
      color = "amber";
      gradient = "from-amber-500 to-orange-600";
      bgHover = "hover:bg-amber-500/5";
      accent = "text-amber-400";
      border = "border-amber-500/20";
      glow = "shadow-amber-500/10";
      standardDesc = "Primary front-line role. Focuses on retail scanning, customer checkout flow, processing payments, and coupons.";
    } else if (newRole === UserRole.STORE_KEEPER) {
      color = "rose";
      gradient = "from-rose-500 to-pink-600";
      bgHover = "hover:bg-rose-500/5";
      accent = "text-rose-400";
      border = "border-rose-500/20";
      glow = "shadow-rose-500/10";
      standardDesc = "Track warehouse levels, inspect batch codes, monitor nearing expiry warnings, and align supplier rosters.";
    }

    const finalPrivileges = privilegeList.length > 0 ? privilegeList : ["Assigned general workspace operations"];

    const newProfile: AccessProfile = {
      role: newRole,
      title,
      email,
      password,
      name,
      color,
      gradient,
      bgHover,
      accent,
      border,
      glow,
      description: standardDesc,
      privileges: finalPrivileges,
      tenantId: activeTenant.id, // Explicit link
      storeBranchId: newStaffBranchId || undefined
    };

    const updated = [...credentialsList, newProfile];
    onUpdateCredentials(updated);
    
    // Reset Form Fields
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole(UserRole.CASHIER);
    setNewTitle("Cashier Billing Only");
    setNewStaffBranchId(currentRole === UserRole.MANAGER && currentBranch ? currentBranch.id : "");
    setPrivilegeList(["POS checkout scanning", "Configure item quantities", "Associate loyalty members", "UPI, Cash, or Card prints"]);
    setCustomPrivilegeInput("");

    triggerNotification(`Successfully registered and activated staff profile for ${name}!`, "success");
    setActiveSubView("list");
  };

  const handleRevokeProfile = (email: string, name: string) => {
    if (email === activeTenant.adminEmail) {
      triggerNotification("Security Safeguard: Cannot revoke the default administrator credentials.", "warning");
      return;
    }

    const updated = credentialsList.filter((cred) => cred.email !== email);
    onUpdateCredentials(updated);
    triggerNotification(`Revoked clearances for ${name} (${email}). Profile deleted.`, "warning");
  };

  const startEditStaff = (staff: AccessProfile) => {
    setEditingStaff(staff);
    setEditStaffOriginalEmail(staff.email);
    setEditStaffName(staff.name);
    setEditStaffEmail(staff.email);
    setEditStaffPassword(staff.password);
    setEditStaffRole(staff.role);
    setEditStaffTitle(staff.title);
    setEditStaffBranchId(staff.storeBranchId || "");
    setEditStaffPrivileges([...staff.privileges]);
    setEditStaffCustomPrivilege("");
    setShowEditStaffFormPassword(false);
  };

  const handleSaveEditedStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaffName.trim() || !editStaffEmail.trim() || !editStaffPassword.trim()) {
      triggerNotification("Please fill in Name, Email and Password security headers.", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editStaffEmail)) {
      triggerNotification("Invalid email address format.", "warning");
      return;
    }

    if (editStaffEmail.toLowerCase() !== editStaffOriginalEmail.toLowerCase() && 
        credentialsList.some((cred) => cred.email.toLowerCase() === editStaffEmail.toLowerCase())) {
      triggerNotification(`Credential update rejected: Another profile already occupies '${editStaffEmail}'.`, "warning");
      return;
    }

    // Alignment logic for domains
    const tenantDomain = activeTenant.adminEmail.split("@")[1]?.toLowerCase();
    const inputDomain = editStaffEmail.split("@")[1]?.toLowerCase();
    if (tenantDomain && inputDomain && tenantDomain !== inputDomain) {
      triggerNotification(`Domain Mismatch: For data integrity, staff email must match your active corporate domain suffix '@${tenantDomain}'.`, "warning");
      return;
    }

    let color = "slate";
    let gradient = "from-slate-500 to-zinc-600";
    let bgHover = "hover:bg-slate-500/5";
    let accent = "text-slate-500";
    let border = "border-slate-500/20";
    let glow = "shadow-slate-500/10";
    let standardDesc = "Granted workspace capabilities in accordance with the retail security charter.";

    if (editStaffRole === UserRole.ADMIN) {
      color = activeTenant.colorTheme;
      gradient = activeTenant.colorTheme === "indigo" ? "from-indigo-500 to-violet-600" :
                 activeTenant.colorTheme === "amber" ? "from-amber-500 to-orange-600" :
                 activeTenant.colorTheme === "rose" ? "from-rose-500 to-pink-600" :
                 activeTenant.colorTheme === "violet" ? "from-purple-500 to-indigo-600" :
                 "from-emerald-500 to-teal-600";
      bgHover = `hover:bg-${activeTenant.colorTheme}-500/5`;
      accent = `text-${activeTenant.colorTheme}-500`;
      border = `border-${activeTenant.colorTheme}-500/20`;
      glow = `shadow-${activeTenant.colorTheme}-500/10`;
      standardDesc = "Full master key to POS checkout, financial ledgers, inventory catalogue, CRM, expense logs, and AI Copilot.";
    } else if (editStaffRole === UserRole.MANAGER) {
      color = "indigo";
      gradient = "from-indigo-500 to-violet-600";
      bgHover = "hover:bg-indigo-500/5";
      accent = "text-indigo-400";
      border = "border-indigo-500/20";
      glow = "shadow-indigo-500/10";
      standardDesc = "Manage physical store health, reconcile stock adjustment ledgers, approve utility expenses, and review reports.";
    } else if (editStaffRole === UserRole.CASHIER) {
      color = "amber";
      gradient = "from-amber-500 to-orange-600";
      bgHover = "hover:bg-amber-500/5";
      accent = "text-amber-400";
      border = "border-amber-500/20";
      glow = "shadow-amber-500/10";
      standardDesc = "Primary front-line role. Focuses on retail scanning, customer checkout flow, processing payments, and coupons.";
    } else if (editStaffRole === UserRole.STORE_KEEPER) {
      color = "rose";
      gradient = "from-rose-500 to-pink-600";
      bgHover = "hover:bg-rose-500/5";
      accent = "text-rose-400";
      border = "border-rose-500/20";
      glow = "shadow-rose-500/10";
      standardDesc = "Track warehouse levels, inspect batch codes, monitor nearing expiry warnings, and align supplier rosters.";
    }

    const finalPrivileges = editStaffPrivileges.length > 0 ? editStaffPrivileges : ["Assigned general workspace operations"];

    const updated = credentialsList.map((cred) => {
      if (cred.email.toLowerCase() === editStaffOriginalEmail.toLowerCase()) {
        return {
          ...cred,
          name: editStaffName.trim(),
          email: editStaffEmail.trim(),
          password: editStaffPassword,
          role: editStaffRole,
          title: editStaffTitle.trim() || `${editStaffRole.charAt(0) + editStaffRole.slice(1).toLowerCase()} Access Key`,
          color,
          gradient,
          bgHover,
          accent,
          border,
          glow,
          description: standardDesc,
          privileges: finalPrivileges,
          storeBranchId: editStaffBranchId || undefined
        };
      }
      return cred;
    });

    onUpdateCredentials(updated);
    setEditingStaff(null);
    triggerNotification(`Successfully updated staff profile for ${editStaffName}!`, "success");
  };

  const handleAddEditStaffPrivilege = (e: React.MouseEvent | React.KeyboardEvent | React.FormEvent) => {
    e.preventDefault();
    const value = editStaffCustomPrivilege.trim();
    if (value && !editStaffPrivileges.includes(value)) {
      setEditStaffPrivileges([...editStaffPrivileges, value]);
      setEditStaffCustomPrivilege("");
    }
  };

  const removeEditStaffPrivilege = (idx: number) => {
    setEditStaffPrivileges(editStaffPrivileges.filter((_, i) => i !== idx));
  };

  // Dynamically map themes
  const getBadgeColors = (role: UserRole, customColor?: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case UserRole.MANAGER:
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case UserRole.CASHIER:
        return "bg-amber-50 text-amber-800 border-amber-200";
      case UserRole.STORE_KEEPER:
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 space-y-6 text-stone-850 font-sans shadow-sm">
      {/* Upper Hub Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-stone-900 flex items-center gap-2 font-display leading-tight tracking-tight">
            <Users className={`w-6 h-6 ${theme.text}`} />
            <span>Staff Registry &amp; Credentials</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Manage authorized staff secure log-in terminals for <strong className="text-stone-800">{activeTenant.name}</strong>.
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 self-start md:self-auto shrink-0 select-none">
          <button
            onClick={() => setActiveSubView("list")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubView === "list"
                ? "bg-white text-stone-900 border border-stone-200 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Registered Staff ({filteredStaff.length})
          </button>
          <button
            onClick={() => setActiveSubView("register")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              activeSubView === "register"
                ? `${theme.bg} text-white shadow-s`
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Onboard Staff
          </button>
        </div>
      </div>

      {activeSubView === "list" ? (
        /* ================= SUB-TAB: STAFF LIST ================= */
        <div className="space-y-4">
          {filteredStaff.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
              <Users className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-stone-700">No Custom Staff Members Added</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                You are currently running exclusively on the Master Admin Access profile. Click Onboard Staff to activate checkout accounts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStaff.map((cred, index) => {
                const capLetters = cred.name.split(" ").map(n => n[0]).join("").substring(0, 2);
                const badgeColorClasses = getBadgeColors(cred.role, cred.color);
                
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-stone-400/80 hover:shadow-md transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl font-bold font-sans flex items-center justify-center uppercase shrink-0 border ${badgeColorClasses}`}>
                            {capLetters || "S"}
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-stone-900 leading-snug">{cred.name}</p>
                            <span className={`px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-wider border rounded mt-1 inline-block ${badgeColorClasses}`}>
                              {cred.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenViewModal(cred)}
                            className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-stone-200"
                            title={`Detailed security claim for ${cred.name}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {cred.email !== activeTenant.adminEmail && (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditStaff(cred)}
                                className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-stone-200"
                                title={`Edit profile credentials for ${cred.name}`}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setDeletingStaff(cred)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                                title={`Revoke access for ${cred.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 space-y-2 font-mono text-[10.5px]">
                        <div className="flex justify-between items-center select-text">
                          <span className="text-stone-500 text-[8.5px] uppercase font-bold tracking-wider">Email/ID:</span>
                          <span className="text-stone-800 select-text font-sans font-medium">{cred.email}</span>
                        </div>
                        <div className="flex justify-between items-center select-text">
                          <span className="text-stone-500 text-[8.5px] uppercase font-bold tracking-wider">Password:</span>
                          <span className="text-indigo-900 font-bold select-text bg-white border border-stone-200 px-1.5 py-0.5 rounded text-[10px]">{cred.password}</span>
                        </div>
                        <div className="flex justify-between items-center select-text">
                          <span className="text-stone-500 text-[8.5px] uppercase font-bold tracking-wider">Store Branch:</span>
                          <span className="text-stone-700 font-bold select-text bg-white border border-stone-200 px-1.5 py-0.5 rounded text-[10px]">
                            {branches.find(b => b.id === cred.storeBranchId)?.name || "Global / All Branches"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[8px] text-stone-400 uppercase font-black tracking-widest mb-1.5">Authorized Privileges</p>
                        <div className="flex flex-wrap gap-1">
                          {(cred.privileges || []).map((p, pIdx) => (
                            <span key={pIdx} className="bg-white border border-stone-200 text-stone-600 text-[8.5px] px-2 py-0.5 rounded flex items-center gap-1 font-sans font-medium">
                              <span className="w-1 h-1 rounded-full bg-stone-400 shrink-0"></span>
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-[10px]">
                      <span className="text-stone-400 font-mono font-bold uppercase tracking-wider">{cred.role} Card</span>
                      <span className="text-emerald-600 font-sans font-bold flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Policy Deployed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ================= SUB-TAB: REGISTER STAFF ================= */
        <form onSubmit={handleRegisterProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
          {/* Form Side */}
          <div className="lg:col-span-5 bg-stone-50 rounded-2xl border border-stone-200 p-5 md:p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-stone-900 hover:text-indigo-650 transition-colors uppercase tracking-widest flex items-center gap-1.5 mb-2 font-mono">
              <UserCheck className={`w-4 h-4 ${theme.text} shrink-0`} /> Onboard Staff Credentials
            </h3>

            <div>
              <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1.5 font-sans">
                Staff Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Liam Smith"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-white border border-stone-350 text-stone-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-stone-500 placeholder-stone-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1.5 font-sans">
                  Assigned Terminal Email/ID
                </label>
                <input
                  type="email"
                  required
                  placeholder={`name@${activeTenant.adminEmail.split("@")[1] || "expertaid.com"}`}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-white border border-stone-350 text-stone-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-stone-500 placeholder-stone-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1.5 font-sans">
                  Security Terminal Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full bg-white border border-stone-350 text-stone-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-stone-500 font-sans cursor-pointer"
                >
                  <option value={UserRole.CASHIER}>Cashier (POS Checkout only)</option>
                  <option value={UserRole.STORE_KEEPER}>Store Keeper (Inventory only)</option>
                  <option value={UserRole.MANAGER}>Manager (Reports &amp; Stock)</option>
                  <option value={UserRole.ADMIN}>Admin (Full Control Workspace)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1.5 font-sans">
                Assigned Retail Store Branch
              </label>
              <select
                value={newStaffBranchId}
                onChange={(e) => setNewStaffBranchId(e.target.value)}
                disabled={currentRole === UserRole.MANAGER}
                className="w-full bg-white border border-stone-350 text-stone-850 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-stone-500 text-stone-800 font-sans cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Global / All Branches (No Restriction)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-stone-400 mt-1">
                {currentRole === UserRole.MANAGER 
                  ? "Locked to your managed branch." 
                  : newRole === UserRole.ADMIN 
                    ? "Admins can access and reconcile data from all branches." 
                    : "Non-admin staff will be restricted strictly to view and manage only data of this branch."}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider font-sans">
                  Custom Terminal Designation
                </label>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Evening Shift POS Officer"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-stone-350 text-stone-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-stone-500 placeholder-stone-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider font-sans">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className={`text-[9px] ${theme.text} hover:opacity-80 font-bold flex items-center gap-1 cursor-pointer bg-white hover:bg-stone-100 px-2 py-0.5 rounded border border-stone-300 transition-all uppercase tracking-wider`}
                >
                  <Shuffle className="w-3 h-3" /> Auto-Generate
                </button>
              </div>
              <div className="relative">
                <input
                  type={showFormPassword ? "text" : "password"}
                  required
                  placeholder="Enter custom password or click Auto-Generate"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-stone-350 text-stone-800 rounded-xl py-2 pl-3 pr-10 text-xs font-mono placeholder-stone-400 focus:outline-none focus:border-stone-500"
                />
                <button
                  type="button"
                  onClick={() => setShowFormPassword(!showFormPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full ${theme.bg} ${theme.bgHover} text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md ${theme.glow} transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-sans mt-2`}
            >
              <Plus className="w-4 h-4 shrink-0" />
              Activate Clearance Profile
            </button>
          </div>

          {/* Privileges Builder Column */}
          <div className="lg:col-span-7 bg-stone-50 rounded-2xl border border-stone-200 p-5 md:p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black text-stone-900 hover:text-indigo-650 transition-colors uppercase tracking-widest flex items-center gap-1.5 mb-2 font-mono">
              <FileText className={`w-4 h-4 ${theme.text} shrink-0`} /> Privilege Policy Claims ({privilegeList.length})
            </h3>
            
            <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-3.5 shadow-sm">
              <p className="text-[10px] text-stone-550 leading-relaxed font-sans mt-0.5">
                Each terminal credential functions like an authorization key. Staff can access features corresponding to their role, restricted to this tenant. You can append customized permissions tags below.
              </p>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Access morning terminal drawer"
                  value={customPrivilegeInput}
                  onChange={(e) => setCustomPrivilegeInput(e.target.value)}
                  className="flex-1 bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 text-xs font-sans placeholder-stone-400 focus:outline-none focus:border-stone-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPrivilege(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddPrivilege}
                  className="px-4.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-lg font-bold transition-all text-xs flex items-center justify-center cursor-pointer"
                >
                  Add Tag
                </button>
              </div>

              {privilegeList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1.5 font-sans">
                  {privilegeList.map((priv, idx) => (
                    <span 
                      key={idx} 
                      className="bg-stone-50 border border-stone-200 text-stone-700 rounded-lg px-2.5 py-1 text-[9.5px] font-medium flex items-center gap-1.5 relative"
                    >
                      <span>{priv}</span>
                      <button 
                        type="button" 
                        onClick={() => removePrivilege(idx)}
                        className="text-stone-400 hover:text-rose-600 font-bold text-[12px] pl-1 cursor-pointer"
                        title="Remove privilege clause"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10.5px] text-stone-400 italic font-sans py-1">Type capabilities or let our templates decide.</p>
              )}
            </div>
          </div>
        </form>
      )}

      {/* ================= MODAL: SYSTEM STAFF DETAILED CLEARANCE VIEW ================= */}
      {viewingStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs py-12 px-4 flex items-center justify-center no-print" id="staff-details-modal">
          <div className="bg-white border border-stone-250 text-stone-850 max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans">
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
              viewingStaff.role === UserRole.ADMIN ? "from-emerald-500 to-teal-400" :
              viewingStaff.role === UserRole.MANAGER ? "from-indigo-500 to-purple-400" :
              viewingStaff.role === UserRole.CASHIER ? "from-amber-400 to-orange-400" :
              "from-rose-500 to-pink-400"
            }`}></div>

            {/* Header */}
            <div className="px-6 pt-7 pb-4 border-b border-stone-200 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base font-sans shadow-sm uppercase leading-none border ${
                  viewingStaff.role === UserRole.ADMIN ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                  viewingStaff.role === UserRole.MANAGER ? "bg-indigo-55 border-indigo-200 text-indigo-805" :
                  viewingStaff.role === UserRole.CASHIER ? "bg-amber-50 border-amber-200 text-amber-800" :
                  "bg-rose-50 border-rose-200 text-rose-800"
                }`}>
                  {viewingStaff.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 tracking-tight font-sans leading-none">{viewingStaff.name}</h3>
                  <span className={`px-1.5 py-0.5 mt-1.5 text-[8.5px] font-bold uppercase tracking-wider rounded border inline-block ${
                    viewingStaff.role === UserRole.ADMIN ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                    viewingStaff.role === UserRole.MANAGER ? "bg-indigo-50 border-indigo-200 text-indigo-800" :
                    viewingStaff.role === UserRole.CASHIER ? "bg-amber-50 border-amber-200 text-amber-800" :
                    "bg-rose-50 border-rose-200 text-rose-800"
                  }`}>
                    {viewingStaff.title}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingStaff(null)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Selector Navigation */}
            <div className="flex border-b border-stone-200 px-4 bg-stone-50 text-[10.5px] font-bold uppercase tracking-wider font-sans">
              <button
                type="button"
                onClick={() => setViewModalTab("details")}
                className={`py-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  viewModalTab === "details" ? "border-indigo-600 text-indigo-700 font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
              <button
                type="button"
                onClick={() => setViewModalTab("attendance")}
                className={`py-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  viewModalTab === "attendance" ? "border-indigo-600 text-indigo-700 font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Attendance ({getStaffAttendance(viewingStaff).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewModalTab("leaves")}
                className={`py-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  viewModalTab === "leaves" ? "border-indigo-600 text-indigo-700 font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Leaves ({getStaffLeaves(viewingStaff).length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewModalTab("performance")}
                className={`py-3 px-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  viewModalTab === "performance" ? "border-indigo-600 text-indigo-700 font-bold" : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Performance</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {viewModalTab === "details" && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {/* Basic Credentials Card */}
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2.5 font-mono text-[11px]">
                    <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                      <span className="text-stone-500 uppercase text-[9px] font-black">LOGIN EMAIL ID:</span>
                      <span className="text-stone-800 select-all font-medium font-sans">{viewingStaff.email}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                      <span className="text-stone-500 uppercase text-[9px] font-black">LOGIN PASSWORD:</span>
                      <span className="text-emerald-800 font-bold bg-white px-2 py-0.5 rounded text-[11px] border border-stone-200 select-all">{viewingStaff.password}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                      <span className="text-stone-500 uppercase text-[9px] font-black">SECURITY SYSTEM ROLE:</span>
                      <span className="text-indigo-400 font-black tracking-wide uppercase text-[10px]">{viewingStaff.role}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 uppercase text-[9px] font-black">ASSIGNED BRANCH:</span>
                      <span className="text-stone-800 font-sans font-bold">
                        {branches.find(b => b.id === viewingStaff.storeBranchId)?.name || "Corporate Store Headquarters"}
                      </span>
                    </div>
                  </div>

                  {/* Detail Customization Panel */}
                  <div className="p-4 bg-stone-50/60 border border-stone-200 rounded-xl space-y-3 shadow-sm">
                    <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Briefcase className={`w-3.5 h-3.5 ${theme.text}`} />
                      <span>Employee Record Parameters</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Contact Phone</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Date of Joining</label>
                        <input
                          type="date"
                          value={editJoinedDate}
                          onChange={(e) => setEditJoinedDate(e.target.value)}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Monthly Salary (₹)</label>
                        <input
                          type="number"
                          value={editSalary}
                          onChange={(e) => setEditSalary(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Employment Status</label>
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as any)}
                          className="w-full bg-white border border-stone-300 text-stone-850 rounded-lg px-2 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        >
                          <option value="Active">Active Duty</option>
                          <option value="Inactive">Deactivated</option>
                          <option value="On Leave">On Leave</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateStaffMember({
                          ...viewingStaff,
                          phone: editPhone,
                          joinedDate: editJoinedDate,
                          salary: editSalary,
                          status: editStatus
                        });
                        triggerNotification(`Successfully updated employee details for ${viewingStaff.name}!`, "success");
                      }}
                      className={`w-full mt-2 ${theme.bg} hover:opacity-90 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors shadow-sm`}
                    >
                      Save Parameters Update
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-extrabold block">Assigned Security Privileges</label>
                    <div className="flex flex-wrap gap-1">
                      {viewingStaff.privileges?.map((p, idx) => (
                        <span key={idx} className="bg-stone-100 text-stone-700 text-[9.5px] px-2 py-0.5 rounded border border-stone-200 font-sans flex items-center gap-1 shadow-xs">
                          <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {viewModalTab === "attendance" && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 font-sans">
                  {/* Add Attendance Log Form */}
                  <div className="p-4 bg-stone-50/60 border border-stone-200 rounded-xl space-y-3 shadow-sm">
                    <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <span>Log Attendance Override</span>
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Target Date</label>
                        <input
                          type="date"
                          value={attDate}
                          onChange={(e) => setAttDate(e.target.value)}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Shift Status</label>
                        <select
                          value={attStatus}
                          onChange={(e) => setAttStatus(e.target.value as any)}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2 py-1 font-sans focus:outline-none cursor-pointer focus:border-stone-500"
                        >
                          <option value="Present">Present</option>
                          <option value="Late">Late</option>
                          <option value="Sick">Sick Leave</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Punch In Time</label>
                        <input
                          type="text"
                          value={attCheckIn}
                          onChange={(e) => setAttCheckIn(e.target.value)}
                          placeholder="e.g. 09:00 AM"
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-stone-500 placeholder-stone-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Punch Out Time</label>
                        <input
                          type="text"
                          value={attCheckOut}
                          onChange={(e) => setAttCheckOut(e.target.value)}
                          placeholder="e.g. 06:00 PM"
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-stone-500 placeholder-stone-400"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (!attDate) {
                          triggerNotification("Please select a valid date entries node.", "warning");
                          return;
                        }
                        const currentAtt = getStaffAttendance(viewingStaff);
                        const existsIdx = currentAtt.findIndex(a => a.date === attDate);
                        let updatedAtt = [...currentAtt];
                        
                        const newLog = {
                          date: attDate,
                          checkIn: attStatus === "Absent" ? "--" : attCheckIn,
                          checkOut: attStatus === "Absent" ? "--" : attCheckOut,
                          status: attStatus
                        };
                        
                        if (existsIdx > -1) {
                          updatedAtt[existsIdx] = newLog;
                        } else {
                          updatedAtt.unshift(newLog);
                        }
                        
                        updatedAtt.sort((a, b) => b.date.localeCompare(a.date));
                        
                        updateStaffMember({
                          ...viewingStaff,
                          attendance: updatedAtt
                        });
                        triggerNotification(`Successfully recorded attendance punch for date ${attDate}!`, "success");
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      Record Attendance Check
                    </button>
                  </div>

                  {/* Attendance Log List */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-500 block">Historical Registry Punchcard</label>
                    <div className="space-y-1.5">
                      {getStaffAttendance(viewingStaff).map((att, idx) => (
                        <div key={idx} className="bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg flex justify-between items-center text-xs shadow-xs">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span className="font-mono text-stone-800 font-semibold">{att.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-5">
                            <div className="text-right text-[10px] font-mono text-stone-500">
                              <div>In: {att.checkIn}</div>
                              <div>Out: {att.checkOut}</div>
                            </div>
                            
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border min-w-[70px] text-center ${
                              att.status === "Present" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                              att.status === "Late" ? "bg-amber-50 border-amber-200 text-amber-800" :
                              att.status === "Sick" ? "bg-blue-50 border-blue-200 text-blue-800" :
                              "bg-rose-50 border-rose-200 text-rose-800"
                            }`}>
                              {att.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {viewModalTab === "leaves" && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {/* File Leave Request Form */}
                  <div className="p-4 bg-stone-50/60 border border-stone-200 rounded-xl space-y-3 shadow-sm font-sans">
                    <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <PlusCircle className={`w-4 h-4 ${theme.text}`} />
                      <span>Request Leave / Time Off Entry</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="col-span-2">
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Leave Category Type</label>
                        <select
                          value={leaveType}
                          onChange={(e) => setLeaveType(e.target.value)}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500 cursor-pointer"
                        >
                          <option value="Sick Leave">Sick Leave (Medical Emergency)</option>
                          <option value="Casual Leave">Casual Leave (General Personal)</option>
                          <option value="Annual Leave">Annual Leave (Planned Vacation)</option>
                          <option value="Maternity / Paternity">Maternity or Paternity Leave</option>
                          <option value="Emergency Unpaid">Emergency / Unpaid Sabbatical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Start Date</label>
                        <input
                          type="date"
                          value={leaveStart}
                          onChange={(e) => setLeaveStart(e.target.value)}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">End Date</label>
                        <input
                          type="date"
                          value={leaveEnd}
                          onChange={(e) => setLeaveEnd(e.target.value)}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Appraisal Request Reason</label>
                        <input
                          type="text"
                          value={leaveReason}
                          onChange={(e) => setLeaveReason(e.target.value)}
                          placeholder="Provide descriptive justification..."
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 text-xs font-sans placeholder-stone-400 focus:outline-none focus:border-stone-500"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!leaveStart || !leaveEnd || !leaveReason) {
                          triggerNotification("Please fill in dates and justification node.", "warning");
                          return;
                        }
                        const newLeave = {
                          id: `LV-${Math.floor(100 + Math.random() * 900)}`,
                          type: leaveType,
                          startDate: leaveStart,
                          endDate: leaveEnd,
                          reason: leaveReason,
                          status: "PENDING" as const
                        };
                        const currentLeaves = getStaffLeaves(viewingStaff);
                        
                        updateStaffMember({
                          ...viewingStaff,
                          leaves: [newLeave, ...currentLeaves]
                        });
                        triggerNotification("Filed high-priority leave request successfully!", "success");
                        setLeaveReason("");
                      }}
                      className={`w-full ${theme.bg} hover:opacity-90 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors shadow-sm`}
                    >
                      File Sabbatical Request
                    </button>
                  </div>

                  {/* Leaves List Pending & Approved */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-extrabold tracking-wider text-stone-500 font-sans block">Active Sabbatical Logs</label>
                    <div className="space-y-2">
                      {getStaffLeaves(viewingStaff).map((lv) => (
                        <div key={lv.id} className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-2 text-xs shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-stone-850 flex items-center gap-1 font-sans">
                                <span className="px-1 text-[9px] bg-stone-200 text-stone-600 font-mono rounded">#{lv.id}</span>
                                <span>{lv.type}</span>
                              </div>
                              <div className="text-[10px] text-stone-500 mt-0.5 font-mono">
                                Date Period: {lv.startDate} to {lv.endDate}
                              </div>
                            </div>
                                                       <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${
                              lv.status === "PENDING" ? "bg-amber-50 border-amber-200 text-amber-800" :
                              lv.status === "APPROVED" ? "bg-emerald-50 border-emerald-250 text-emerald-800" :
                              "bg-rose-50 border-rose-200 text-rose-800"
                            }`}>
                              {lv.status}
                            </span>
                          </div>
                          
                          <p className="text-stone-650 leading-normal bg-white p-2 border border-stone-200 rounded-lg text-[11px] italic font-sans text-stone-600">
                            &quot;{lv.reason}&quot;
                            {lv.comments && (
                              <span className="block mt-1 font-sans text-[10px] text-stone-500 not-italic font-semibold border-t border-stone-200 pt-1">
                                Manager Note: {lv.comments}
                              </span>
                            )}
                          </p>
                          
                          {lv.status === "PENDING" && (
                            <div className="flex gap-1.5 justify-end mt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = getStaffLeaves(viewingStaff).map(l =>
                                    l.id === lv.id ? { ...l, status: "REJECTED" as const, comments: "Decline decreed by Audit Manager" } : l
                                  );
                                  updateStaffMember({
                                    ...viewingStaff,
                                    leaves: updated
                                  });
                                  triggerNotification("Time-off request rejected.", "warning");
                                }}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md font-bold text-[10px] cursor-pointer shadow-xs"
                              >
                                Decline Sabbatical
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = getStaffLeaves(viewingStaff).map(l =>
                                    l.id === lv.id ? { ...l, status: "APPROVED" as const, comments: "Cleared by Operations Manager" } : l
                                  );
                                  updateStaffMember({
                                    ...viewingStaff,
                                    leaves: updated
                                  });
                                  triggerNotification("Time-off request approved!", "success");
                                }}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-750 border border-emerald-200 rounded-md font-bold text-[10px] cursor-pointer shadow-xs"
                              >
                                Approve Leave
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {viewModalTab === "performance" && (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 font-sans">
                  {/* Stats View */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center shadow-xs">
                      <div className="text-[9px] text-stone-500 uppercase font-black block">Star Quality</div>
                      <div className="text-sm font-bold text-amber-600 mt-1 flex items-center justify-center gap-1 font-sans">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{getStaffPerformance(viewingStaff).rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center shadow-xs">
                      <div className="text-[9px] text-stone-500 uppercase font-black block">Attendance Score</div>
                      <div className="text-sm font-bold text-emerald-700 mt-1">
                        {getStaffPerformance(viewingStaff).attendanceScore}%
                      </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-center shadow-xs">
                      <div className="text-[9px] text-stone-500 uppercase font-black block font-sans">Sales KPI</div>
                      <div className="text-sm font-sans font-black text-indigo-700 mt-1 leading-none">
                        {getStaffPerformance(viewingStaff).salesKpi} units
                      </div>
                    </div>
                  </div>

                  {/* General Comments Box */}
                  <div className="bg-stone-50/60 border border-stone-200 rounded-xl p-3.5 space-y-1.5 shadow-sm">
                    <div className="text-[10px] font-extrabold uppercase text-stone-500">Appraiser Audit Note</div>
                    <p className="text-stone-700 italic text-[11px] leading-relaxed">
                      &quot;{getStaffPerformance(viewingStaff).monthlyNotes || "No notes annotated for this appraisal cycle yet."}&quot;
                    </p>
                  </div>

                  {/* Edit Performance Form */}
                  <div className="p-4 bg-stone-50/60 border border-stone-200 rounded-xl space-y-3 shadow-sm">
                    <h4 className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-550" />
                      <span>Log appraisal scorecard review</span>
                    </h4>

                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Quality Star Rating</label>
                        <select
                          value={perfRating}
                          onChange={(e) => setPerfRating(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2 py-1.5 font-sans focus:outline-none cursor-pointer focus:border-stone-500"
                        >
                          <option value="5">5.0 - Excellent</option>
                          <option value="4.5">4.5 - Outstanding</option>
                          <option value="4">4.0 - Competent</option>
                          <option value="3.5">3.5 - Solid</option>
                          <option value="3">3.0 - Baseline</option>
                          <option value="2">2.0 - Sabbatical Warning</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Sales Volume</label>
                        <input
                          type="number"
                          value={perfKpi}
                          onChange={(e) => setPerfKpi(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Punctuality %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={perfScore}
                          onChange={(e) => setPerfScore(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 font-sans focus:outline-none focus:border-stone-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[9.5px] text-stone-500 font-bold uppercase mb-1">Appraisal Feedback Comments</label>
                        <textarea
                          rows={2}
                          value={perfNotes}
                          onChange={(e) => setPerfNotes(e.target.value)}
                          placeholder="Record review feedback, achievements or warnings..."
                          className="w-full bg-white border border-stone-300 text-stone-805 rounded-lg p-2 text-xs font-sans placeholder-stone-405 block focus:outline-none focus:border-stone-500"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateStaffMember({
                          ...viewingStaff,
                          performance: {
                            rating: perfRating,
                            salesKpi: perfKpi,
                            attendanceScore: perfScore,
                            monthlyNotes: perfNotes
                          }
                        });
                        triggerNotification(`Logged fresh appraisal card for ${viewingStaff.name}!`, "success");
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      Save Performance Appraisal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button 
                onClick={() => setViewingStaff(null)}
                className="bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300 font-bold text-xs px-4 py-2 rounded-xl transition-all font-sans cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SYSTEM STAFF RECORD EDIT & OVERRIDE ================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs py-12 px-4 flex items-center justify-center no-print" id="staff-edit-modal">
          <div className="bg-white border border-stone-250 text-stone-900 max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-stone-100">
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${theme.bg}`}></div>

            {/* Header */}
            <div className="px-6 pt-7 pb-4 border-b border-stone-200 flex items-start justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${theme.badgeBg} text-amber-600 border ${theme.badgeBorder} flex items-center justify-center`}>
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 tracking-tight leading-none">Edit Access Privileges</h3>
                  <p className="text-[10.5px] text-stone-500 mt-1">Modify identities, access domain, role assignments and credentials.</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingStaff(null)}
                className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEditedStaff}>
              <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
                {/* Full Name / Identity */}
                <div>
                  <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1 font-sans">
                    Full Name / Identity *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma, POS Administrator"
                      value={editStaffName}
                      onChange={(e) => setEditStaffName(e.target.value)}
                      className="w-full bg-white border border-stone-300 text-stone-850 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-all shadow-xs"
                    />
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  </div>
                </div>

                {/* Email / Login ID */}
                <div>
                  <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1 font-sans">
                    Access Security Email / Login ID *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. sharma.admin@expertaid.com"
                      value={editStaffEmail}
                      onChange={(e) => setEditStaffEmail(e.target.value)}
                      className="w-full bg-white border border-stone-300 text-stone-850 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:bg-white shadow-xs"
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  </div>
                </div>

                {/* Password Fields */}
                <div>
                  <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1 font-sans">
                    Security Passkey / Code *
                  </label>
                  <div className="relative">
                    <input
                      type={showEditStaffFormPassword ? "text" : "password"}
                      required
                      placeholder="Enter new passkey"
                      value={editStaffPassword}
                      onChange={(e) => setEditStaffPassword(e.target.value)}
                      className="w-full bg-white border border-stone-300 text-stone-850 rounded-xl py-2 pl-9 pr-10 text-xs font-mono placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:bg-white transition-all shadow-xs"
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <button
                      type="button"
                      onClick={() => setShowEditStaffFormPassword(!showEditStaffFormPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      {showEditStaffFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* System Domain Role */}
                  <div>
                    <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1 font-sans">
                      System Domain Role
                    </label>
                    <select
                      value={editStaffRole}
                      onChange={(e) => setEditStaffRole(e.target.value as UserRole)}
                      className="w-full bg-white border border-stone-300 text-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-stone-500 focus:bg-white cursor-pointer shadow-xs"
                    >
                      <option value={UserRole.ADMIN}>ADMIN (Full Control)</option>
                      <option value={UserRole.MANAGER}>MANAGER (Stock &amp; Costs)</option>
                      <option value={UserRole.CASHIER}>CASHIER (Fast Billing)</option>
                      <option value={UserRole.STORE_KEEPER}>STORE KEEPER (Inventory)</option>
                    </select>
                  </div>

                  {/* Title Badge description */}
                  <div>
                    <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1 font-sans">
                      Access Title Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Area Commander"
                      value={editStaffTitle}
                      onChange={(e) => setEditStaffTitle(e.target.value)}
                      className="w-full bg-white border border-stone-300 text-stone-850 rounded-xl py-2 px-3 text-xs font-semibold placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1 font-sans">
                    Assigned Retail Store Branch
                  </label>
                  <select
                    value={editStaffBranchId}
                    onChange={(e) => setEditStaffBranchId(e.target.value)}
                    className="w-full bg-white border border-stone-300 text-stone-800 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-stone-500 focus:bg-white cursor-pointer shadow-xs"
                  >
                    <option value="">Global / All Branches (No Restriction)</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                  <p className="text-[9.5px] text-stone-500 mt-1">
                    {editStaffRole === UserRole.ADMIN 
                      ? "Admins can access and view all branches." 
                      : "Staff members will be restricted strictly to view and manage only data of this branch."}
                  </p>
                </div>

                {/* Edit Security Claims & Privileges list */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] text-stone-500 font-bold uppercase tracking-wider font-mono">
                      Edit Assigned Clearances: ({editStaffPrivileges.length})
                    </span>
                    {editStaffPrivileges.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setEditStaffPrivileges([])}
                        className="text-[9px] text-rose-600 hover:text-rose-700 font-bold uppercase focus:outline-none cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Type custom privilege..."
                      value={editStaffCustomPrivilege}
                      onChange={(e) => setEditStaffCustomPrivilege(e.target.value)}
                      className="flex-1 bg-white border border-stone-300 text-stone-800 rounded-lg px-2.5 py-1.5 text-xs font-sans placeholder-stone-400 focus:outline-none focus:border-stone-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           e.preventDefault();
                           handleAddEditStaffPrivilege(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddEditStaffPrivilege}
                      className="px-3 bg-stone-100 border border-stone-300 text-stone-800 rounded-lg hover:bg-stone-200 font-bold text-xs flex items-center justify-center cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {editStaffPrivileges.length > 0 ? (
                    <div className="flex flex-wrap gap-1 pt-1 font-sans">
                      {editStaffPrivileges.map((p, idx) => (
                        <span 
                          key={idx} 
                          className="bg-white border border-stone-200 text-stone-700 rounded px-2 py-0.5 text-[9px] font-medium flex items-center gap-1 group shadow-xs"
                        >
                          {p}
                          <button 
                            type="button" 
                            onClick={() => removeEditStaffPrivilege(idx)}
                            className="text-stone-400 hover:text-rose-600 font-bold text-[10px] pl-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-400 italic py-1 font-sans">Must assign at least one clearance claim node.</p>
                  )}
                </div>

              </div>

              {/* Action buttons footer */}
              <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-2 text-xs">
                <button 
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold px-4 py-2 rounded-xl transition-all font-sans cursor-pointer"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className={`text-white ${theme.bg} hover:opacity-95 font-bold px-5 py-2.5 rounded-xl transition-all font-sans cursor-pointer flex items-center gap-1.5 shadow-md uppercase tracking-wider`}
                >
                  <Check className="w-4 h-4" /> Save Access Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SYSTEM STAFF ACCESS KEY REVOCATION DECREE ================= */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs py-12 px-4 flex items-center justify-center no-print" id="staff-revoke-modal">
          <div className="bg-white border border-stone-250 text-stone-900 max-w-md w-full rounded-2xl shadow-2xl relative overflow-hidden font-sans ring-8 ring-stone-100">
            {/* Top red header warning */}
            <div className="h-1.5 bg-rose-600"></div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 tracking-tight leading-none">Revoke Access Card &amp; Clearance</h3>
                  <p className="text-[11px] text-stone-500 mt-1.5">You are about to irreversibly decommission clearance for this active user account node.</p>
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <p className="text-xs font-sans text-stone-800 font-bold">Revocation Account Details:</p>
                <div className="grid grid-cols-2 gap-y-1.5 text-[10.5px] font-mono text-stone-600">
                  <span className="font-sans font-medium text-stone-500 text-left">Account Identity:</span>
                  <span className="text-stone-900 font-bold font-sans text-right">{deletingStaff.name}</span>
                  <span className="font-sans font-medium text-stone-500 text-left">Email Login ID:</span>
                  <span className="text-stone-900 text-right font-semibold select-all text-[10.5px]">{deletingStaff.email}</span>
                  <span className="font-sans font-medium text-stone-500 text-left">Security Clearance:</span>
                  <span className="text-rose-650 font-bold text-right text-[10px] uppercase font-sans">{deletingStaff.title}</span>
                </div>
              </div>

              <p className="text-[10.5px] text-stone-500 leading-normal">
                If you confirm, all logged-in terminals mapped to this card credential will expire, and database isolation keys will be safely decommissioned immediately.
              </p>
            </div>

            <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-2 text-xs font-sans">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="bg-stone-100 text-stone-700 border border-stone-300 hover:bg-stone-200 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                No, Retain Access
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRevokeProfile(deletingStaff.email, deletingStaff.name);
                  setDeletingStaff(null);
                }}
                className="bg-rose-600 text-white hover:bg-rose-700 font-bold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1 uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" /> Yes, Revoke Clearance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
