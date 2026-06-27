import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  RefreshCw,
  Plus,
  X,
  UserCheck,
  UserX,
  AlertTriangle
} from "lucide-react";
import { User } from "../types";
import { api } from "../utils/api";

interface EmployeeManagementProps {
  onNotify: (message: string, type: "success" | "error") => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ onNotify }) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<User | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("Employee");
  const [status, setStatus] = useState<User["status"]>("Active");
  const [avatar, setAvatar] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployees(search);
      setEmployees(data);
    } catch (e: any) {
      onNotify(e.message || "Failed to load employees list.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  const openAddModal = () => {
    setSelectedEmp(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setUsername("");
    setPassword("");
    setRole("Employee");
    setStatus("Active");
    setAvatar("");
    setIsModalOpen(true);
  };

  const openEditModal = (emp: User) => {
    setSelectedEmp(emp);
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setEmail(emp.email);
    setPhone(emp.phone);
    setUsername(emp.username);
    setPassword(""); // Leave blank unless changing
    setRole(emp.role);
    setStatus(emp.status);
    setAvatar(emp.avatar || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !username || (!selectedEmp && !password)) {
      onNotify("Please fill in all required fields.", "error");
      return;
    }

    try {
      if (selectedEmp) {
        // Edit flow
        const updates: any = { firstName, lastName, email, phone, role, status, avatar };
        if (password) {
          updates.password = password;
        }
        await api.updateEmployee(selectedEmp.id, updates);
        onNotify(`Employee '${firstName} ${lastName}' profile updated.`, "success");
      } else {
        // Create flow
        await api.createEmployee({
          firstName,
          lastName,
          email,
          phone,
          username,
          passwordPlain: password,
          role,
          status,
          avatar
        });
        onNotify(`Employee '${firstName} ${lastName}' registered successfully.`, "success");
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err: any) {
      onNotify(err.message || "Operation failed.", "error");
    }
  };

  const toggleStatus = async (emp: User) => {
    if (emp.id === "usr-1") {
      onNotify("The system primary Super Admin cannot be deactivated.", "error");
      return;
    }
    const newStatus: User["status"] = emp.status === "Active" ? "Inactive" : "Active";
    try {
      await api.updateEmployee(emp.id, { status: newStatus });
      onNotify(`Status of ${emp.firstName} toggled to ${newStatus}.`, "success");
      fetchEmployees();
    } catch (e: any) {
      onNotify(e.message || "Failed to toggle status.", "error");
    }
  };

  const handleDelete = async (emp: User) => {
    if (emp.id === "usr-1") {
      onNotify("The system primary Super Admin cannot be deleted.", "error");
      return;
    }
    if (!window.confirm(`Are you absolutely sure you want to remove ${emp.firstName} ${emp.lastName} from the system?`)) {
      return;
    }
    try {
      await api.deleteEmployee(emp.id);
      onNotify(`Employee profile successfully purged.`, "success");
      fetchEmployees();
    } catch (e: any) {
      onNotify(e.message || "Failed to delete employee.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" /> Employee Control Deck
          </h2>
          <p className="text-sm text-gray-500 font-sans mt-1">Manage corporate rosters, security access levels, and active work statuses.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add New Employee
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, role, or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100/60 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800 font-sans"
          />
        </div>
        <div className="text-xs font-mono text-gray-400 flex items-center gap-1.5 self-end sm:self-center">
          <Shield className="w-3.5 h-3.5 text-red-500" /> Total records tracked: {employees.length}
        </div>
      </div>

      {/* Roster table/cards grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
          <p className="text-sm text-gray-500 font-sans mt-3">Syncing active employee roster from server...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xs">
          <div className="p-4 bg-gray-50 text-gray-400 rounded-full">
            <Users className="w-10 h-10" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mt-4">No employees match this search</h3>
          <p className="text-xs text-gray-400 font-sans mt-1">Refine your query or create a new employee profile to begin.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 uppercase font-mono tracking-wider">
                  <th className="py-4 px-6">Name & Username</th>
                  <th className="py-4 px-6">Contact Details</th>
                  <th className="py-4 px-6">Security Role</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-800 font-sans">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${emp.firstName}`}
                          alt="Avatar"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-xs"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 leading-snug">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs font-mono text-gray-400">@{emp.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <a href={`mailto:${emp.email}`} className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-colors">
                          <Mail className="w-3.5 h-3.5" /> {emp.email}
                        </a>
                        {emp.phone && (
                          <a href={`tel:${emp.phone}`} className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-colors">
                            <Phone className="w-3.5 h-3.5" /> {emp.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full font-mono ${
                        emp.role === "Super Admin"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : emp.role === "Manager"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        <Shield className="w-3.5 h-3.5" /> {emp.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleStatus(emp)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                          emp.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-red-50 text-red-400 hover:bg-red-100"
                        }`}
                        title="Click to toggle account status"
                      >
                        {emp.status === "Active" ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp)}
                          className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Purge Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                {selectedEmp ? <Edit2 className="w-5 h-5 text-blue-600" /> : <UserPlus className="w-5 h-5 text-red-600" />}
                {selectedEmp ? "Modify Employee Profile" : "Register New Employee"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    placeholder="+2519..."
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">System Username *</label>
                  <input
                    type="text"
                    required
                    disabled={!!selectedEmp}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-400 rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">
                    {selectedEmp ? "New Password (Optional)" : "Password *"}
                  </label>
                  <input
                    type="password"
                    required={!selectedEmp}
                    placeholder={selectedEmp ? "••••••••" : ""}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                  />
                </div>
              </div>

              {!selectedEmp && password && (
                <div className="bg-amber-50 p-3 rounded-xl flex items-start gap-2 border border-amber-100 text-xs text-amber-800 leading-snug">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <p className="font-bold">Password strength requirements:</p>
                    <p>Minimum 8 characters. Must contain an uppercase, a lowercase, a number, and a special character (!@#$%^&*).</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Security Access Level *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as User["role"])}
                    className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                  >
                    <option value="Super Admin">Super Admin (Full access)</option>
                    <option value="Manager">Manager (Menu and offers)</option>
                    <option value="Employee">Employee (Dashboard and assigned)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Account Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as User["status"])}
                    className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 font-mono uppercase mb-1.5">Avatar Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 focus:bg-white rounded-xl border border-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-hidden transition-all text-gray-800"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold shadow-md cursor-pointer"
                >
                  {selectedEmp ? "Apply Changes" : "Register Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployeeManagement;
